import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85],
    deviceSizes: [390, 640, 828, 1080, 1280, 1680, 2048],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
