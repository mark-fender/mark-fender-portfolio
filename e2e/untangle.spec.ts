import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/en#game');
  await page.locator('#game').scrollIntoViewIfNeeded();
  await expect(page.getByRole('group', { name: 'Network to untangle' })).toBeVisible();
});

test('keyboard moves a focused node and reset restores the board', async ({ page }) => {
  const game = page.locator('#game');
  const node = game.getByRole('button', { name: 'Node r1. Arrow keys move it.' });
  const circle = node.locator('circle').first();
  const x = Number(await circle.getAttribute('cx'));
  const y = await circle.getAttribute('cy');
  const crossings = game
    .locator('dl > div')
    .filter({ has: page.getByText('crossings', { exact: true }) })
    .locator('dd');
  const moves = game
    .locator('dl > div')
    .filter({ has: page.getByText('moves', { exact: true }) })
    .locator('dd');
  const initialCrossings = await crossings.textContent();

  await node.focus();
  await page.keyboard.press('ArrowRight');
  await expect(node).toBeFocused();
  await expect(circle).toHaveAttribute('cx', String(x + 2));
  await expect(circle).toHaveAttribute('cy', y!);
  await expect(moves).toHaveText('1');

  await game.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(circle).toHaveAttribute('cx', String(x));
  await expect(moves).toHaveText('0');
  await expect(crossings).toHaveText(initialCrossings!);
  await expect(game.getByRole('button', { name: 'Next level' })).toHaveCount(0);
});

test('showing solutions supports retrying and navigating every level', async ({ page }) => {
  const game = page.locator('#game');
  await game.getByRole('button', { name: 'Show solution' }).click();
  await expect(game.getByRole('status')).toContainText('Solution shown.');
  await expect(game.getByRole('button', { name: 'Reset', exact: true })).toHaveCount(0);
  await game.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(game.getByText('Level 1 of 5:', { exact: false })).toBeVisible();
  await expect(game.getByRole('button', { name: 'Show solution' })).toBeVisible();

  const nodeCounts = [6, 10, 8, 9, 12];
  for (let level = 1; level <= 5; level++) {
    await expect(game.getByText(`Level ${level} of 5:`, { exact: false })).toBeVisible();
    await expect(game.getByRole('button', { name: /^Node / })).toHaveCount(nodeCounts[level - 1]!);
    await game.getByRole('button', { name: 'Show solution' }).click();
    await expect(game.getByRole('status')).toContainText('Solution shown.');
    await expect(game.locator('dd').first()).toHaveText('0');
    await game
      .getByRole('button', { name: level === 5 ? 'Play again' : 'Next level', exact: true })
      .click();
  }
  await expect(game.getByText('Level 1 of 5:', { exact: false })).toBeVisible();
  await expect(game.getByRole('button', { name: 'Show solution' })).toBeVisible();
  await expect(game.locator('dd').nth(1)).toHaveText('0');
});

test('the first network can be untangled entirely with arrow keys', async ({ page }) => {
  const game = page.locator('#game');
  const next = game.getByRole('button', { name: 'Next level', exact: true });
  const positions = [
    [30, 10],
    [70, 10],
    [90, 30],
    [70, 50],
    [30, 50],
    [10, 30],
  ];

  for (const [index, target] of positions.entries()) {
    const node = game.getByRole('button', { name: `Node r${index + 1}. Arrow keys move it.` });
    const circle = node.locator('circle').first();
    await node.focus();
    for (const [axis, negative, positive] of [
      ['cx', 'ArrowLeft', 'ArrowRight'],
      ['cy', 'ArrowUp', 'ArrowDown'],
    ] as const) {
      const delta = target[axis === 'cx' ? 0 : 1]! - Number(await circle.getAttribute(axis));
      for (let step = 0; step < Math.abs(Math.round(delta / 2)); step++) {
        await page.keyboard.press(delta < 0 ? negative : positive);
      }
    }
    if (await next.isVisible()) break;
  }

  await expect(game.getByRole('status')).toContainText('Untangled. Nice work.');
  await expect(game.getByRole('status')).toContainText(/\d+ moves?, \d+ seconds?/);
  await expect(game.locator('dd').first()).toHaveText('0');
  await expect(game.getByRole('button', { name: 'Try again', exact: true })).toHaveCount(0);
  await next.click();
  await expect(game.getByText('Level 2 of 5:', { exact: false })).toBeVisible();
});

test('dragging a node updates its position and counts one move on release', async ({ page }) => {
  const game = page.locator('#game');
  const node = game.getByRole('button', { name: 'Node r1. Arrow keys move it.' });
  const circle = node.locator('circle').first();
  const before = await circle.getAttribute('cx');
  const box = await circle.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 35, box!.y + box!.height / 2 + 15, { steps: 5 });
  await expect(circle).not.toHaveAttribute('cx', before!);
  await expect(game.locator('dd').nth(1)).toHaveText('0');
  await page.mouse.up();
  await expect(game.locator('dd').nth(1)).toHaveText('1');
  await game.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(circle).toHaveAttribute('cx', before!);
});

test('touch dragging moves a node without scrolling and counts one move', async ({
  page,
  context,
  isMobile,
}) => {
  test.skip(!isMobile, 'Touch behavior is exercised on the mobile project.');
  const game = page.locator('#game');
  const circle = game
    .getByRole('button', { name: 'Node r1. Arrow keys move it.' })
    .locator('circle')
    .first();
  await circle.scrollIntoViewIfNeeded();
  const box = await circle.boundingBox();
  expect(box).not.toBeNull();
  const start = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2, id: 1 };
  const before = await circle.getAttribute('cx');
  const scroll = await page.evaluate(() => scrollY);
  const cdp = await context.newCDPSession(page);

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ ...start, x: start.x + 35, y: start.y + 65 }],
  });
  await expect(circle).not.toHaveAttribute('cx', before!);
  await expect(game.locator('dd').nth(1)).toHaveText('0');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(game.locator('dd').nth(1)).toHaveText('1');
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await cdp.detach();
});
