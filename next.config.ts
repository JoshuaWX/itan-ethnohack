import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
};
export default nextConfig;
