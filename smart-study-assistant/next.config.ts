import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    qualities: [75, 90, 100],
  },
  serverExternalPackages: ['pdf-parse', '@google/generative-ai'],
};

export default nextConfig;
