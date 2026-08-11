import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/' && !request.nextUrl.searchParams.has('studio')) {
    return NextResponse.redirect(new URL('/muse', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
