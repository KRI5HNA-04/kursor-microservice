import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request has large headers
  const headerSize = calculateHeaderSize(request);
  
  // If headers are too large, redirect to a cleanup page or handle gracefully
  if (headerSize > 8192) { // 8KB threshold
    console.warn(`Large headers detected: ${headerSize} bytes`);
    
    // Create a response that clears problematic cookies
    const response = NextResponse.next();
    
    // Clear potentially large cookies
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token'
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
    
    // Redirect to login if session cookies are cleared
    if (request.nextUrl.pathname.startsWith('/editor') || 
        request.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login?error=session_cleared', request.url));
    }
    
    return response;
  }
  
  return NextResponse.next();
}

function calculateHeaderSize(request: NextRequest): number {
  let totalSize = 0;
  
  // Calculate cookie header size
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    totalSize += cookieHeader.length;
  }
  
  // Add other significant headers
  request.headers.forEach((value, key) => {
    if (key !== 'cookie') {
      totalSize += key.length + value.length + 4; // +4 for ": " and "\r\n"
    }
  });
  
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
