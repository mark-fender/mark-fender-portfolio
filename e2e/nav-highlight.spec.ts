import { expect, test } from './fixtures';

test('nav highlight waits on reload and stays responsive after appearing', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The sliding highlight belongs to the desktop navbar.');
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto('/');
  await page.reload();

  const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
  const pill = nav.locator('a[aria-current] > span.absolute');
  await expect(nav).toBeVisible();
  await page.clock.runFor(200);
  await expect(pill).toHaveCount(0);
  await page.clock.runFor(600);
  await expect(pill).toBeVisible();
  const pillBox = await pill.boundingBox();
  const linkBox = await nav.locator('a[aria-current]').boundingBox();
  expect(pillBox).not.toBeNull();
  expect(linkBox).not.toBeNull();
  expect(pillBox!.x).toBeCloseTo(linkBox!.x, 0);
  expect(pillBox!.y).toBeCloseTo(linkBox!.y, 0);

  await nav.getByRole('link', { name: 'Projects', exact: true }).click({ force: true });
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute(
    'aria-current',
    'true',
  );
  await expect(pill).toBeVisible();
});
