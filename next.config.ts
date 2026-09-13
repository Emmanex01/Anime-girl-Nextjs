// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['bunt-rundown-zealous.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;