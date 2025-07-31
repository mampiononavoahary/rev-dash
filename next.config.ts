import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'wzdaypnhnfqcqhhoipdk.supabase.co',
        pathname: '/storage/v1/object/public/**',
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

