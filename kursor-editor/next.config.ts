import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config) => {
    // Avoid traversing Windows user profile special folder that throws EPERM in this environment.
    config.snapshot = config.snapshot || {};
    // Add an IgnorePlugin as a safeguard (pattern unlikely to match project files)
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({
        resourceRegExp: /C:\\Users\\king1\\Application Data/i,
      })
    );
    return config;
  },
};

export default nextConfig;
