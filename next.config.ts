import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  // Runtime-only research data must stay out of Next's deployable file traces.
  outputFileTracingExcludes: {
    "/*": ["./data/**/*", "./private/**/*", "./EthnoHack-Codex-Context/**/*", "./.env*"],
  },
};
export default nextConfig;
