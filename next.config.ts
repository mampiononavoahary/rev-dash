import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file-upload-mi-collecte.s3.amazonaws.com",
      },
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        "net": false,
        "tls": false,
        "fs": false,
      };
    }
    return config;
  },
};

export default nextConfig;

