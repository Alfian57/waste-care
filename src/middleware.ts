import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Block third-party cookies
  response.headers.set('Permissions-Policy', 'interest-cohort=()');
  
  // Add resource hints for better performance
  response.headers.set('Link', '<https://cdn.jsdelivr.net>; rel=preconnect; crossorigin, <https://api.maptiler.com>; rel=preconnect; crossorigin');

  // Cache control for static assets with immutable
  if (
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)$/)
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Cache control for images
  if (
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname.startsWith('/logos') ||
    request.nextUrl.pathname.startsWith('/icons')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Cache control for API routes - no cache
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, max-age=0'
    );
  }
  
  // Cache control for HTML pages
  if (request.nextUrl.pathname === '/' || !request.nextUrl.pathname.match(/\./)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!favicon.ico).*)',
  ],
};
