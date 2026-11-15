import { roles } from '../src/content/experience';
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
      await expect(page.locator(`#project-${project.slug}`)).toHaveText(project.summary[locale]);
    }
    const projectLink = projectSection.getByRole('link', { name: 'cat.com', exact: true });
    await expect(projectLink).toHaveAttribute('href', 'https://www.cat.com');
    await expect(projectLink).toHaveAttribute('target', '_blank');
    await expect(projectLink).toHaveAttribute('rel', 'noopener noreferrer');
    if (!isMobile) await expect(projectSection.getByRole('button')).toHaveCount(0);

    const skills = page.locator('#skills');
    await expect(skills.getByRole('heading', { level: 2 })).toHaveText(copy.skills.heading);
    for (const group of skillGroups) {
      const category = skills
        .locator('dl > div')
        .filter({ has: page.getByText(group.name[locale], { exact: true }) });
      await expect(category.locator('li')).toHaveText([...group.items]);
    }
    for (const social of socials) {
      const link = page.locator('#contact').getByRole('link', { name: social.label, exact: true });
      await expect(link).toHaveAttribute('href', social.href);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    const top = page
      .getByRole('contentinfo')
      .getByRole('link', { name: `${copy.footer.backToTop} ↑`, exact: true });
    await top.click();
    await expect(page).toHaveURL(/#home$/);
    await expect(hero.getByRole('heading', { level: 1 })).toBeInViewport();
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
