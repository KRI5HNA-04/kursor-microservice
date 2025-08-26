import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Cookies cleared' });
    
    // List of cookies to clear
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.callback-url', 
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      '__Secure-next-auth.callback-url',
      '__Host-next-auth.callback-url'
    ];
    
    // Clear each cookie
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      // Also try to clear with domain
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });
    
    return response;
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cookies' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return information about current header size
  const cookies = request.headers.get('cookie') || '';
  const headerSize = calculateRequestHeaderSize(request);
  
  return NextResponse.json({
    cookieSize: cookies.length,
    totalHeaderSize: headerSize,
    isLarge: headerSize > 8192,
    suggestion: headerSize > 8192 ? 'Consider clearing cookies' : 'Headers are within normal limits'
  });
}

function calculateRequestHeaderSize(request: NextRequest): number {
  let totalSize = 0;
  
  request.headers.forEach((value, key) => {
    totalSize += key.length + value.length + 4; // +4 for ": " and "\r\n"
  });
  
  return totalSize;
}
