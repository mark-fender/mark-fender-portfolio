import type { Page } from '@playwright/test';
import { DECK_MIN_SCALE } from '@/design-system/motion';
import { projectsData } from '@/lib/data';
import { expect, test } from './fixtures';

const cards = (page: Page) => page.locator('#projects [data-deck-card] > div');
const scaleOf = (page: Page, i: number) =>
  cards(page)
    .nth(i)
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);

const scrollToDeckEnd = (page: Page) =>
  page.evaluate(() => {
    const deck = document.querySelector('#projects [data-deck-card]')!.parentElement!;
    const end = deck.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    window.scrollTo({ top: end, behavior: 'instant' });
  });

test('shows every project and no Imaginify', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).not.toContainText('Imaginify');
  await expect(cards(page)).toHaveCount(projectsData.length);
});

test('covered cards shrink at the end of the deck', async ({ page }) => {
  await page.goto('/');
  await scrollToDeckEnd(page);
  await expect.poll(() => scaleOf(page, 0)).toBeLessThan(1);
});

test('pins follow layout changes above the deck', async ({ page }) => {
  await page.goto('/');
  // Toggling an experience row moves the deck without resizing its cards.
  const first = page.locator('#experience button[aria-expanded]').first();
  const before = await first.getAttribute('aria-expanded');
  await first.click();
  await expect(first).not.toHaveAttribute('aria-expanded', before!);
  // Scroll to the moment card 1 pins over card 0: card 0 must be fully scaled by then.
  await page.evaluate(() => {
    const [first, second] = document.querySelectorAll<HTMLElement>('#projects [data-deck-card]');
    window.scrollTo({
      top: first!.parentElement!.getBoundingClientRect().top + scrollY - innerHeight,
      behavior: 'instant',
    });
    const pinAt = parseFloat(getComputedStyle(second!).getPropertyValue('--sticky-top'));
    window.scrollTo({
      top: scrollY + second!.getBoundingClientRect().top - pinAt + 2,
      behavior: 'instant',
    });
  });
  await expect.poll(() => scaleOf(page, 0)).toBeCloseTo(DECK_MIN_SCALE, 2);
});

test('a stationary resize re-runs the scales with the new pins', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop resize');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Park where card 1 is halfway over card 0, so card 0 is mid-scale.
  await page.evaluate(() => {
    const [first, second] = document.querySelectorAll<HTMLElement>('#projects [data-deck-card]');
    window.scrollTo({
      top: first!.parentElement!.getBoundingClientRect().top + scrollY - innerHeight,
      behavior: 'instant',
    });
    const pinAt = parseFloat(getComputedStyle(second!).getPropertyValue('--sticky-top'));
    const travel = second!.getBoundingClientRect().top - pinAt;
    const firstPin = parseFloat(getComputedStyle(first!).getPropertyValue('--sticky-top'));
    const firstTravel = first!.getBoundingClientRect().top - firstPin;
    window.scrollTo({ top: scrollY + (firstTravel + travel) / 2, behavior: 'instant' });
  });
  await expect.poll(() => scaleOf(page, 0)).toBeLessThan(0.999);
  expect(await scaleOf(page, 0)).toBeGreaterThan(0.941);
  // Height only: nothing reflows or scrolls, but the tall-card bound (innerHeight − cardHeight) moves the pins.
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.waitForTimeout(300);
  const afterResize = await scaleOf(page, 0);
  await page.evaluate(() => {
    window.scrollBy({ top: 1, behavior: 'instant' });
    window.scrollBy({ top: -1, behavior: 'instant' });
  });
  await page.waitForTimeout(300);
  expect(afterResize).toBeCloseTo(await scaleOf(page, 0), 3);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('cards keep scale 1', async ({ page }) => {
    await page.goto('/');
    await scrollToDeckEnd(page);
    await page.waitForTimeout(200);
    expect(await scaleOf(page, 0)).toBe(1);
  });
});

test('a card never covers content of the one below it', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'tall cards only happen on mobile');
  await page.goto('/');
  const range = await page.evaluate(() => {
    const deck = document.querySelector('#projects [data-deck-card]')!.parentElement!;
    const top = deck.getBoundingClientRect().top + window.scrollY;
    return { from: top - window.innerHeight, to: top + deck.offsetHeight };
  });
  for (let y = range.from; y <= range.to; y += 40) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    const problems = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#projects [data-deck-card] > div')];
      return els.slice(0, -1).flatMap((el, i) => {
        const covered = el.getBoundingClientRect();
        const next = els[i + 1]!.getBoundingClientRect();
        const covering = next.top < covered.bottom - 1;
        return covering && covered.bottom > window.innerHeight + 1
          ? [
              `card ${i} bottom ${Math.round(covered.bottom)} > ${window.innerHeight} at y=${Math.round(window.scrollY)}`,
            ]
          : [];
      });
    });
    expect(problems).toEqual([]);
  }
});
