import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      // Partner product images live on many shop CDNs.
      { protocol: "https", hostname: "**" },
    ],
  },
  // Keep old URLs alive so existing rankings and links don't break.
  async redirects() {
    return [
      { source: "/become-a-partner", destination: "/become-partner", permanent: true },
      { source: "/voting", destination: "/", permanent: false },
      { source: "/voting/:slug", destination: "/", permanent: false },
      { source: "/subscribe/:path*", destination: "/become-partner", permanent: false },
    ];
  },
};

export default nextConfig;
