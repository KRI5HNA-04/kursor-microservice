import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request has large headers
  const headerSize = calculateHeaderSize(request);
  
  // Vercel limits: individual headers 16KB, total headers 32KB
  // We'll be more conservative and act at 8KB
  if (headerSize > 8192) { // 8KB threshold
    console.warn(`Large headers detected: ${headerSize} bytes on ${request.nextUrl.pathname}`);
    
    // Create a response that clears problematic cookies
    const response = NextResponse.redirect(new URL('/login?error=session_too_large', request.url));
    
    // Clear ALL next-auth cookies to prevent header size issues
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.callback-url', 
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      'next-auth.pkce.code_verifier'
    ];
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });
    
    return response;
  }
  
  return NextResponse.next();
}

function calculateHeaderSize(request: NextRequest): number {
  let totalSize = 0;
  
  // Calculate all header sizes
  request.headers.forEach((value, key) => {
    totalSize += key.length + value.length + 4; // +4 for ": " and "\r\n"
  });
  
  // Special attention to cookie header which is often the largest
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader && cookieHeader.length > 4096) { // 4KB cookie warning
    console.warn(`Large cookie header detected: ${cookieHeader.length} bytes`);
  }
  
  return totalSize;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (our uploaded images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
