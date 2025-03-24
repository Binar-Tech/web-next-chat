import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // Substitua pelo domínio das imagens
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
