"use client";
import { useEffect } from "react";
import { checkHeaderSize, cleanupNextAuthCookies } from "../../lib/cookieUtils";

export default function HeaderSizeMonitor() {
  useEffect(() => {
    // Check header size on component mount
    const headerInfo = checkHeaderSize();

    if (headerInfo.isLarge) {
      console.warn(
        `Large headers detected (${headerInfo.size} bytes). Cleaning up...`
      );

      // Clean up NextAuth cookies
      cleanupNextAuthCookies();

      // If still too large, show a warning to the user
      setTimeout(() => {
        const newHeaderInfo = checkHeaderSize();
        if (newHeaderInfo.isLarge) {
          // Show user-friendly warning
          const shouldReload = window.confirm(
            "Your browser data is causing issues. Would you like to clear it and reload the page?"
          );

          if (shouldReload) {
            // Clear all cookies and reload
            document.cookie.split(";").forEach((c) => {
              const eqPos = c.indexOf("=");
              const name = eqPos > -1 ? c.substr(0, eqPos) : c;
              document.cookie =
                name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });
            window.location.reload();
          }
        }
      }, 1000);
    }

    // Set up periodic cleanup (every 5 minutes)
    const intervalId = setInterval(() => {
      const headerInfo = checkHeaderSize();
      if (headerInfo.isLarge) {
        cleanupNextAuthCookies();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component doesn't render anything
}
