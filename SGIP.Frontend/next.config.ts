import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.57"],
  output: "standalone",
};

export default nextConfig;
