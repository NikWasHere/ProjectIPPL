import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
    qualities: [75, 90, 100],
  },
  serverExternalPackages: ['pdf-parse', '@google/generative-ai'],
};

export default nextConfig;
