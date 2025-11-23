import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Block third-party cookies and restrict external resources
  response.headers.set('Permissions-Policy', 'interest-cohort=(), browsing-topics=()');
  
  // Content Security Policy to block third-party cookies
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://cdn.jsdelivr.net",
    "connect-src 'self' https://api.maptiler.com https://*.supabase.co",
    "frame-src 'self'",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
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
