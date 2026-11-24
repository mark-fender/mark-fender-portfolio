import { ImageResponse } from 'next/og';
import { LOGO_PATH, LOGO_VIEWBOX } from '@/components/Logo';
import { site } from '@/content/site';
import { CONTOUR_PATHS, FIELD_VIEWBOX } from '@/features/hero';
import { defaultLocale, isLocale, locales } from '@/lib/i18n';

export const alt = `${site.name}: ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

// The dark theme's colours. next/og renders outside the page, so CSS variables don't reach it.
const BACKGROUND = '#262a30';
const FOREGROUND = '#ecede8';
const MUTED = '#a7adb5';
const BORDER = '#3e444d';
const PRIMARY = '#a3ae6a';

// The header sets the mark at 2.5x the name's size; 30px name, 76px mark keeps that.
const LOGO_W = 76;

const RINGS = CONTOUR_PATHS.filter((_, i) => i % 2 === 1);

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: BACKGROUND,
        color: FOREGROUND,
      }}>
      <svg
        viewBox={FIELD_VIEWBOX}
        width={1100}
        height={640}
        fill='none'
        style={{ position: 'absolute', top: -5, right: -330 }}>
        {RINGS.map((d) => (
          <path key={d} d={d} stroke={BORDER} strokeWidth={1.6} />
        ))}
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 30 }}>
        <svg viewBox={LOGO_VIEWBOX} width={LOGO_W} height={(LOGO_W * 369) / 731}>
          <path d={LOGO_PATH} fill={PRIMARY} />
        </svg>
        {site.name}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 860 }}>
        <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: '-0.04em' }}>
          {site.headline[locale]}
        </div>
        <div style={{ fontSize: 28, color: MUTED }}>{`${site.role}, ${site.city}`}</div>
      </div>
    </div>,
    size,
  );
}
