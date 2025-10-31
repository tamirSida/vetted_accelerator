import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'versionbravo.netlify.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
