import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    // Disable ESLint during build to work around compatibility issues with newer ESLint versions
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;