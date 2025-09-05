import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily simplified middleware to avoid deployment issues
  // Just pass through all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match specific paths that really need middleware
    '/editor/:path*',
    '/profile/:path*'
  ],
};
