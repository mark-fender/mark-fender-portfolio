import { expect, test } from './fixtures';

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.goto('/en#travel');
  await page.locator('#travel').scrollIntoViewIfNeeded();
  const globe = page.getByRole('application', { name: /Globe of the countries/ });
  await expect(globe).toBeVisible();
  await expect
    .poll(() =>
      globe.evaluate(
        (canvas: HTMLCanvasElement) =>
          canvas.getContext('2d')!.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data[3],
      ),
    )
    .toBeGreaterThan(0);
});

test('the globe supports keyboard rotation without scrolling the page', async ({ page }) => {
  const globe = page.getByRole('application', { name: /Globe of the countries/ });
  await globe.focus();
  await expect(globe).toBeFocused();
  const scroll = await page.evaluate(() => scrollY);
  let drawing = await globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());

  for (const key of ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown']) {
    await page.keyboard.press(key);
    await expect
      .poll(() => globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()))
      .not.toBe(drawing);
    drawing = await globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  }
  await expect(globe).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await expect(page.locator('#travel').getByText(/^Visited: /)).toContainText('Slovakia');
});

test('zoom buttons stop at both limits and redraw the globe', async ({ page }) => {
  const zoom = page.getByRole('group', { name: 'Zoom', exact: true });
  const out = zoom.getByRole('button', { name: 'Zoom out' });
  const into = zoom.getByRole('button', { name: 'Zoom in' });
  const globe = page.getByRole('application', { name: /Globe of the countries/ });
  const drawing = await globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());

  await expect(out).toBeDisabled();
  await into.click();
  await expect(out).toBeEnabled();
  await expect(into).toBeEnabled();
  await expect
    .poll(() => globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()))
    .not.toBe(drawing);
  await into.click();
  await expect(into).toBeDisabled();
  await out.click();
  await expect(into).toBeEnabled();
  await out.click();
  await expect(out).toBeDisabled();
});

test('pointing at a visited country announces its name', async ({ page, isMobile }) => {
  const globe = page.getByRole('application', { name: /Globe of the countries/ });
  const box = await globe.boundingBox();
  expect(box).not.toBeNull();
  // Slovakia's interior projected onto the initial Europe view, away from any border.
  const position = { x: box!.width * 0.549, y: box!.height * 0.484 };
  if (isMobile) await globe.tap({ position });
  else await globe.hover({ position });
  const announcement = page.locator('#travel [aria-live="polite"]');
  await expect(announcement).toHaveText('Slovakia, visited');
  if (!isMobile) {
    await page.mouse.move(0, 0);
    await expect(announcement).toBeEmpty();
  }
});

test('dragging turns the globe', async ({ page }) => {
  const globe = page.getByRole('application', { name: /Globe of the countries/ });
  const drawing = await globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  const box = await globe.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height * 0.55, { steps: 5 });
  await page.mouse.up();
  await page.mouse.move(0, 0);
  await expect
    .poll(() => globe.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()))
    .not.toBe(drawing);
});

test('touch pinching updates zoom controls at both limits', async ({ page, context, isMobile }) => {
  test.skip(!isMobile, 'Touch behavior is exercised on the mobile project.');
  const globe = page.getByRole('application', { name: /Globe of the countries/ });
  await globe.scrollIntoViewIfNeeded();
  const box = await globe.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width / 2;
  const y = box!.y + box!.height / 2;
  const near = [
    { x: x - 20, y, id: 1 },
    { x: x + 20, y, id: 2 },
  ];
  const far = [
    { x: x - 90, y, id: 1 },
    { x: x + 90, y, id: 2 },
  ];
  const zoom = page.getByRole('group', { name: 'Zoom', exact: true });
  const out = zoom.getByRole('button', { name: 'Zoom out' });
  const into = zoom.getByRole('button', { name: 'Zoom in' });
  const cdp = await context.newCDPSession(page);

  await expect(out).toBeDisabled();
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: near });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: far });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(into).toBeDisabled();
  await expect(out).toBeEnabled();

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: far });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: near });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(out).toBeDisabled();
  await expect(into).toBeEnabled();
  await cdp.detach();
});
