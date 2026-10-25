import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    globalNotFound: true,
    // to use Lingui macros
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
  images: {
    remotePatterns: [
      new URL("https://github.com/shadcn.png"),
      // Local Supabase Storage
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      // Production Supabase Storage
      {
        protocol: "https",
        hostname: "aadncooesxlzgrofzquo.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  domains: [
    "api.microlink.io", // Microlink Image Preview
  ],
  // Disable production webpack cache to prevent the 130 MiB 0.pack file from breaking Cloudflare Pagess
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;