import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Specify the correct root directory for Turbopack
  turbopack: {
    root: path.resolve(__dirname),
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: 'icons.llamao.fi',
        pathname: '/icons/**',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        pathname: '/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/trustwallet/assets/**',
      },
    ],
  },
};

export default nextConfig;
