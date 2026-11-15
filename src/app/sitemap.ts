import type { MetadataRoute } from 'next';
import { localePath, locales } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.markfender.dev/';

const urlOf = (path: string) => new URL(path, BASE_URL).href;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, urlOf(localePath(l))]));
  return locales.map((locale) => ({
    url: urlOf(localePath(locale)),
    lastModified: new Date(),
    alternates: { languages },
  }));
}
