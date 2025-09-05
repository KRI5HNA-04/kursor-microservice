import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import SessionProviderWrapper from "./Components/SessionProviderWrapper";
// import HeaderSizeMonitor from "./Components/HeaderSizeMonitor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kursor: Modern Code Editor",
  description: "A modern code editor built for developers",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Temporarily disabled HeaderSizeMonitor to fix deployment issues */}
        {/* <HeaderSizeMonitor /> */}
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
