import type { Page } from '@playwright/test';
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
