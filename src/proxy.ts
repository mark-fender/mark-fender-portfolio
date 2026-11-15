import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, LOCALE_COOKIE, localePath } from '@/lib/i18n';

// Rewrite the unprefixed English page to its static /en build.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Clear the saved locale so /en does not bounce back to Slovak after redirecting to /.
  if (pathname === `/${defaultLocale}`) {
    url.pathname = '/';
    const response = NextResponse.redirect(url, 308);
    response.cookies.delete(LOCALE_COOKIE);
    return response;
  }

  // Ignore locale cookies on prefetches or the language switch caches the wrong page.
  // Next strips RSC headers here, so distinguish document loads with Sec-Fetch-Dest.
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const pageLoad = request.headers.get('sec-fetch-dest') === 'document';
  if (pageLoad && isLocale(saved) && saved !== defaultLocale) {
    url.pathname = localePath(saved);
    return NextResponse.redirect(url, 307);
  }

  url.pathname = `/${defaultLocale}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/', '/en'],
};
