import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los prompts y datos se leen desde el disco en las funciones del servidor.
  outputFileTracingIncludes: {
    "/api/**": ["./prompts/**", "./data/**"],
  },
};

export default nextConfig;
