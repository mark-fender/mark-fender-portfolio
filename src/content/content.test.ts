import { describe, expect, it } from 'vitest';
import { roles } from './experience';
import { navLinks, sectionHeader, sections, spySections } from './nav';
import { nowItems, photos } from './now';
import { projects } from './projects';
import { site, socials } from './site';
import { skillGroups } from './skills';
import { visited } from './travel';
import { ui } from './ui';

const monthIndex = ({ year, month }: { year: number; month: number }) => year * 12 + month;

describe('experience', () => {
  it('lists the roles oldest first, one after another', () => {
    for (const [i, role] of roles.entries()) {
      const next = roles[i + 1];
      if (!next) continue;
      expect(role.to, `${role.company} has an end date`).not.toBeNull();
      // A role may start in the month the one before it ended, never earlier.
      expect(
        monthIndex(next.from),
        `${next.company} starts after ${role.company}`,
      ).toBeGreaterThanOrEqual(monthIndex(role.to!));
    }
  });

  it('has exactly one current role, and it is the last', () => {
    expect(roles.filter((r) => r.to === null)).toHaveLength(1);
    expect(roles.at(-1)!.to).toBeNull();
  });

  it('starts every role before it ends', () => {
    for (const { company, from, to } of roles)
      if (to) expect(monthIndex(from), company).toBeLessThanOrEqual(monthIndex(to));
  });
});

describe('projects', () => {
  it('has unique slugs and exactly one featured project', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(projects.filter((p) => 'featured' in p)).toHaveLength(1);
  });

  it('names every link in its summary, in every language', () => {
    for (const { slug, summary, link } of projects)
      if (link)
        for (const [locale, text] of Object.entries(summary))
          expect(text, `${slug} (${locale})`).toContain(link.label);
  });
});

describe('skills', () => {
  it('names every skill once', () => {
    const names = skillGroups.flatMap((g) => g.items);
    expect(names).toHaveLength(28);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('nav', () => {
  it('derives the header links from the sections that are in the nav', () => {
    expect(navLinks('en').map((l) => l.hash)).toEqual([
      '#home',
      '#projects',
      '#experience',
      '#skills',
      '#game',
      '#travel',
      '#contact',
    ]);
  });

  it('points every link at a section', () => {
    const ids = new Set<string>(['home', ...sections.map((s) => s.id)]);
    for (const { hash } of navLinks('en')) expect(ids.has(hash.slice(1)), hash).toBe(true);
  });

  it('maps a section outside the nav to the nav section before it', () => {
    expect(spySections.find((s) => s.id === 'off-the-clock')?.nav).toBe('travel');
    expect(spySections.every((s) => navLinks('en').some((l) => l.hash === `#${s.nav}`))).toBe(true);
  });

  it('numbers the sections in page order', () => {
    expect(sectionHeader('projects', 'en')).toEqual({ index: 1, label: 'Projects', total: 7 });
    expect(sectionHeader('contact', 'sk')).toEqual({ index: 7, label: 'Kontakt', total: 7 });
  });

  // The header stays on one line only while the seven labels are short (CLAUDE.md).
  it('keeps the Slovak nav no longer than the English one', () => {
    const length = (locale: 'en' | 'sk') => navLinks(locale).reduce((n, l) => n + l.name.length, 0);
    expect(length('sk')).toBeLessThanOrEqual(length('en'));
  });
});

// Every string in a piece of content, with the path to it: "experience.roles.one".
const strings = (value: unknown, path = ''): [string, string][] => {
  if (typeof value === 'string') return [[path, value]];
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
};

describe('translations', () => {
  it('gives every interface string in both languages, none of them empty', () => {
    const paths = (locale: 'en' | 'sk') => strings(ui[locale]).map(([p]) => p);
    // Slovak may add a `few` plural form; nothing else may differ.
    expect(paths('sk').filter((p) => !p.endsWith('.few'))).toEqual(paths('en'));
    for (const [path, text] of strings(ui.sk)) expect(text, path).not.toBe('');
  });

  it('keeps the same {slots} in both languages', () => {
    const slots = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    const en = new Map(strings(ui.en));
    for (const [path, text] of strings(ui.sk))
      if (en.has(path)) expect(slots(text), path).toEqual(slots(en.get(path)!));
  });

  it('translates every localized field of the data', () => {
    const all = new Map(
      strings({ roles, sections, nowItems, photos, projects, site, skillGroups }),
    );
    for (const path of all.keys())
      if (path.endsWith('.en')) expect(all.get(`${path.slice(0, -3)}.sk`), path).toBeTruthy();
  });
});

describe('travel', () => {
  it('lists each visited place once', () => {
    expect(new Set(visited).size).toBe(visited.length);
  });
});

describe('site', () => {
  it('links to socials over https with ASCII-only URLs', () => {
    for (const { href } of socials) expect(href).toMatch(/^https:\/\/[\x21-\x7e]+$/);
  });
});

// Every string in a piece of content that still has a [placeholder] in it.
const placeholders = (value: unknown): string[] => {
  if (typeof value === 'string') return value.includes('[') ? [value] : [];
  if (value && typeof value === 'object') return Object.values(value).flatMap(placeholders);
  return [];
};

describe('placeholders', () => {
  it('finds bracketed text and nothing else', () => {
    expect(placeholders({ roles: [{ company: 'NetCore', stack: ['React'] }] })).toEqual([]);
    expect(placeholders({ now: [{ label: 'Reading', value: '[Book placeholder]' }] })).toEqual([
      '[Book placeholder]',
    ]);
  });
});

// Set CONTENT_STRICT=1 before a production deploy: no [placeholder] may ship.
describe.runIf(process.env.CONTENT_STRICT)('strict', () => {
  it('has no [placeholder] text left', () => {
    expect(
      placeholders({ roles, sections, nowItems, photos, projects, site, socials, skillGroups }),
    ).toEqual([]);
  });
});
