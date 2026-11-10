// Portable Next.js Middleware compatible with TypeScript typecheck
export function middleware(req: any) {
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'proffkit.com';
  const url = req.nextUrl;
  const hostname = req.headers.get('host')?.toLowerCase() || '';

  // Extract clean hostname without port
  const hostWithoutPort = hostname.split(':')[0];

  // Prevent rewriting for static files, API routes, and internal Next.js assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.')
  ) {
    return;
  }

  // Determine tenant slug
  let tenantSlug: string | null = null;

  if (hostWithoutPort.endsWith(`.${ROOT_DOMAIN}`)) {
    tenantSlug = hostWithoutPort.replace(`.${ROOT_DOMAIN}`, '');
  } else if (hostWithoutPort.endsWith('.localhost')) {
    tenantSlug = hostWithoutPort.replace('.localhost', '');
  } else if (
    hostWithoutPort !== ROOT_DOMAIN &&
    hostWithoutPort !== 'localhost' &&
    hostWithoutPort !== '127.0.0.1'
  ) {
    tenantSlug = hostWithoutPort.replace(/^www\./, '').split('.')[0];
  }

  return;
}

export const config = {
  matcher: ['/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)'],
};
