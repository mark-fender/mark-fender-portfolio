import { roles } from '../src/content/experience';
import { sections } from '../src/content/nav';
import { listening, nowItems } from '../src/content/now';
import { projects } from '../src/content/projects';
import { site, socials } from '../src/content/site';
import { skillGroups } from '../src/content/skills';
import { ui } from '../src/content/ui';
import { expect, test } from './fixtures';

for (const locale of ['en', 'sk'] as const) {
  const copy = ui[locale];
  const path = locale === 'en' ? '/' : '/sk';

  test(`${locale}: hero, projects, skills, socials, and footer render the published content`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(path);
    const hero = page.locator('#home');
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(site.headline[locale]);
    await expect(hero.getByRole('img', { name: copy.hero.portrait, exact: true })).toBeVisible();
    await expect(
      hero.getByRole('link', { name: copy.hero.viewProjects, exact: true }),
    ).toHaveAttribute('href', '#projects');
    await expect(
      hero.getByRole('link', { name: copy.hero.contactMe, exact: true }),
    ).toHaveAttribute('href', '#contact');
    await expect(hero.locator('time')).toHaveText(/\d{2}:\d{2}/);

    const projectSection = page.locator('#projects');
    await expect(projectSection.getByRole('heading', { level: 2 })).toHaveText(
      copy.projects.heading,
    );
    await expect(projectSection.getByRole('heading', { level: 3 })).toHaveText(
      projects.map(({ title }) => title),
    );
    for (const project of projects) {
      const cue = project.link ? ` (${copy.newTab})` : '';
      const summary = project.link
        ? project.summary[locale].replace(project.link.label, project.link.label + cue)
        : project.summary[locale];
      await expect(page.locator(`#project-${project.slug}`)).toHaveText(summary);
    }
    const projectLink = projectSection.getByRole('link', {
      name: `cat.com (${copy.newTab})`,
      exact: true,
    });
    await expect(projectLink).toHaveAttribute('href', 'https://www.cat.com');
    await expect(projectLink).toHaveAttribute('target', '_blank');
    await expect(projectLink).toHaveAttribute('rel', 'noopener noreferrer');
    if (!isMobile) await expect(projectSection.getByRole('button')).toHaveCount(0);

    const skills = page.locator('#skills');
    await expect(skills.getByRole('heading', { level: 2 })).toHaveText(copy.skills.heading);
    for (const group of skillGroups) {
      const category = skills.getByRole('list', { name: group.name[locale], exact: true });
      await expect(category.getByRole('listitem')).toHaveText([...group.items]);
    }
    for (const social of socials) {
      const link = page.locator('#contact').getByRole('link', {
        name: `${social.label} (${copy.newTab})`,
        exact: true,
      });
      await expect(link).toHaveAttribute('href', social.href);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    const top = page
      .getByRole('contentinfo')
      .getByRole('link', { name: copy.footer.backToTop, exact: true });
    await top.click();
    await expect(page).toHaveURL(/#home$/);
    await expect(hero.getByRole('heading', { level: 1 })).toBeInViewport();
  });

  test(`${locale}: new-tab cues are localized and English titles keep their language`, async ({
    page,
    context,
  }) => {
    await page.route('**/api/listening', (route) =>
      route.fulfill({
        json: {
          title: 'Feel It Still',
          artist: 'Portugal. The Man',
          url: 'https://open.spotify.com/track/test-current',
          playing: false,
        },
      }),
    );
    await page.goto(`${path}#off-the-clock`);
    const now = page.locator('#off-the-clock dl');
    await now.scrollIntoViewIfNeeded();
    await expect(
      now.getByRole('link', {
        name: `Feel It Still · Portugal. The Man (${copy.newTab})`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(now.getByText(listening.lastPlayed[locale], { exact: true })).toHaveAttribute(
      'lang',
      locale,
    );
    const links = page.locator('a[target="_blank"]');
    for (const link of await links.all()) {
      await expect(link).toHaveAccessibleName(new RegExp(`\\(${copy.newTab}\\)$`));
      const cue = link.locator('.sr-only');
      await expect(cue).toHaveCount(1);
      await expect(cue).toHaveText(` (${copy.newTab})`);
      await expect(cue).toHaveAttribute('lang', locale);
      await expect(cue).toHaveCSS('position', 'absolute');
      await expect(cue).toHaveCSS('width', '1px');
      await expect(cue).toHaveCSS('height', '1px');
      await expect(cue).toHaveCSS('overflow', 'hidden');
    }
    for (const item of nowItems.filter(({ value }) => value.en === value.sk)) {
      const value = now
        .locator('div')
        .filter({ has: page.getByText(item.label[locale], { exact: true }) })
        .locator('dd');
      await expect(value).toHaveAttribute('lang', 'en');
    }
    await expect(now.locator('dd').first()).not.toHaveAttribute('lang');

    const book = nowItems.find(({ id }) => id === 'reading')!;
    const bookLink = now.getByRole('link', {
      name: `${book.value[locale]} (${copy.newTab})`,
      exact: true,
    });
    await expect(bookLink).toHaveAttribute('href', book.href!);
    await expect(bookLink).toHaveAttribute('target', '_blank');
    await expect(bookLink).toHaveAttribute('rel', 'noopener noreferrer');
    await context.route(book.href!, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>Book preview</title>' }),
    );
    const originalUrl = page.url();
    const [popup] = await Promise.all([context.waitForEvent('page'), bookLink.click()]);
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(book.href!);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    await expect(page).toHaveURL(originalUrl);
    await popup.close();
  });

  test(`${locale}: decorations stay visible and out of the accessibility tree`, async ({
    page,
  }) => {
    await page.goto(path);
    const marquee = page.locator('.animate-marquee');
    await marquee.locator('..').scrollIntoViewIfNeeded();
    await expect(marquee).toBeVisible();
    await expect(marquee.getByRole('list', { includeHidden: true })).toHaveCount(2);
    await expect(marquee.getByRole('list')).toHaveCount(0);

    for (const { id, label } of sections) {
      const section = page.locator(`#${id}`);
      const eyebrow = section.locator(':scope > div').first();
      await section.scrollIntoViewIfNeeded();
      await expect(eyebrow).toBeVisible();
      await expect(eyebrow).toContainText(label[locale]);
      await expect.poll(() => eyebrow.ariaSnapshot()).toBe('');
      await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1);
    }

    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText('↑', { exact: true })).toBeVisible();
    await expect(footer.getByRole('link')).toHaveAccessibleName(copy.footer.backToTop);
  });

  test(`${locale}: experience tabs expose every role and support keyboard navigation`, async ({
    page,
  }) => {
    await page.goto(path);
    const experience = page.locator('#experience');
    const tabs = experience.getByRole('tablist', { name: copy.experience.tabs, exact: true });
    await expect(tabs.getByRole('tab')).toHaveCount(roles.length);
    await expect(tabs.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true');
    for (const [index, role] of roles.entries()) {
      await tabs.getByRole('tab').nth(index).click();
      const panel = experience.getByRole('tabpanel');
      await expect(panel).toHaveCount(1);
      await expect(panel.getByRole('heading', { level: 3 })).toHaveText(role.company);
      await expect(panel.getByText(role.description[locale], { exact: true })).toBeVisible();
      await expect(tabs.getByRole('tab').nth(index)).toHaveAttribute('aria-selected', 'true');
    }
    await page.keyboard.press('Home');
    await expect(tabs.getByRole('tab').first()).toBeFocused();
    await expect(tabs.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toBeFocused();
    await expect(experience.getByRole('tabpanel').getByRole('heading', { level: 3 })).toHaveText(
      'Workflows',
    );
  });

  test(`${locale}: project summaries expand and collapse on mobile`, async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Desktop summaries are always fully shown.');
    await page.goto(path);
    const summary = page.locator('#project-arkmap');
    const toggle = page.getByRole('button', { name: copy.projects.readMore, exact: true }).first();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'project-arkmap');
    await expect(summary).toHaveCSS('-webkit-line-clamp', '2');
    await toggle.click();
    const collapse = page.getByRole('button', { name: copy.projects.showLess, exact: true });
    await expect(collapse).toHaveAttribute('aria-expanded', 'true');
    await expect(summary).toHaveCSS('-webkit-line-clamp', 'none');
    await collapse.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(summary).toHaveCSS('-webkit-line-clamp', '2');
  });
}
