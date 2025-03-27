import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // Substitua pelo domínio das imagens
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "10.0.1.121", // Substitua pelo domínio das imagens
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "187.73.185.68", // Substitua pelo domínio das imagens
        port: "4000",
      },
      {
        protocol: "https",
        hostname: "outracdn.com", // Adicione mais domínios, se necessário
      },
    ],
  },
};

export default nextConfig;
