import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ROYBOT',
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
