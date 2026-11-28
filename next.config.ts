import type { NextConfig } from "next";

const envAssetRemotePattern = (() => {
  const raw = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    };
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      ...(envAssetRemotePattern ? [envAssetRemotePattern] : []),
      {
        protocol: "https",
        hostname: "assets.abdullahalmaksud.com",
      },
      {
        protocol: "https",
        hostname: "assets-dev.abdullahalmaksud.com",
      },
      {
        protocol: "https",
        hostname: "*.abdullahalmaksud.com",
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
