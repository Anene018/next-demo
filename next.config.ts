import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
