import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

const manifest = (): MetadataRoute.Manifest => ({
  name: `${SITE_NAME} — Portfolio & Monographs`,
  short_name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#111111",
  icons: [
    {
      src: "/icons/brand-logo.svg",
      sizes: "any",
      type: "image/svg+xml",
    },
    {
      src: "/icons/brand-logo.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
});

export default manifest;
