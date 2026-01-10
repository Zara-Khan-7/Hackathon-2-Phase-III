import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
// Trigger redeploy Sat, Jan 10, 2026  7:16:23 PM
