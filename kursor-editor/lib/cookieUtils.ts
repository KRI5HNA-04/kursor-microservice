// Utility functions to manage cookies and prevent header size issues

export function clearLargeCookies(): string[] {
  if (typeof window === 'undefined') return [];
  
  const cookies = document.cookie.split(';');
  const largeCookies: string[] = [];
  
  cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    if (value && value.length > 1000) { // If cookie value is larger than 1KB
      largeCookies.push(name.trim());
    }
  });
  
  // Clear large cookies
  largeCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    // Also try clearing with dot prefix for subdomains
    if (window.location.hostname.includes('.')) {
      const rootDomain = '.' + window.location.hostname.split('.').slice(-2).join('.');
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
    }
  });
  
  return largeCookies;
}

export function getTotalCookieSize(): number {
  if (typeof window === 'undefined') return 0;
  return document.cookie.length;
}

export function checkHeaderSize(): { size: number; isLarge: boolean; largeCookies: string[] } {
  const totalSize = getTotalCookieSize();
  const largeCookies = clearLargeCookies() || [];
  
  return {
    size: totalSize,
    isLarge: totalSize > 8192, // 8KB threshold
    largeCookies
  };
}

// Function to clean up old NextAuth cookies
export function cleanupNextAuthCookies() {
  if (typeof window === 'undefined') return;
  
  const cookiesToClean = [
    'next-auth.callback-url',
    'next-auth.csrf-token',
    '__Secure-next-auth.callback-url',
    '__Host-next-auth.csrf-token',
    // Add any other problematic cookies
  ];
  
  cookiesToClean.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });
}
