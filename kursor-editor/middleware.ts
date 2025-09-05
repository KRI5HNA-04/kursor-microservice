import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disabled middleware to fix 404 issues
  return NextResponse.next();
}

// Disable matcher completely for now
export const config = {
  matcher: []
};
