import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.abdullahalmaksud.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/books",
        destination: "/#books",
        permanent: false,
      },
      {
        source: "/book",
        destination: "/#books",
        permanent: false,
      },
      {
        source: "/book/:slug",
        destination: "/books/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
