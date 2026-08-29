import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  turbopack: {
    root:path.resolve(__dirname, "../.."),
  },
  transpilePackages:['@repo/axios'],
  reactStrictMode:false
};

export default nextConfig;
