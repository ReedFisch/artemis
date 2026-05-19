import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Resolve absolute path to enforce correct Turbopack scoping and silence warnings
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
