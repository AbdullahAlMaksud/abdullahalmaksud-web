import type { Metadata } from "next";
import localFont from "next/font/local";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SiteProvider } from "@/contexts/SiteContext";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  AUTHOR_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  buildAbsoluteUrl,
} from "@/lib/seo";
import { buildPersonSchema, buildWebsiteSchema } from "@/lib/structured-data";
import "./globals.css";

const purno = localFont({
  src: [
    {
      path: "../../public/font/Purno Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Purno Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/Purno Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/Purno Bold-Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-purno-face",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../../public/font/Inter-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = localFont({
  src: [
    {
      path: "../../public/font/Newsreader-Variable.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../../public/font/Newsreader-Italic-Variable.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/font/JetBrainsMono-Variable.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

const playfairDisplay = localFont({
  src: [
    {
      path: "../../public/font/PlayfairDisplay-Variable.woff2",
      weight: "500 800",
      style: "normal",
    },
    {
      path: "../../public/font/PlayfairDisplay-Italic-Variable.woff2",
      weight: "500 800",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/brand-logo.svg", type: "image/svg+xml" },
      { url: "/icons/brand-logo.png", type: "image/png" },
    ],
    apple: "/icons/brand-logo.png",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    type: "website",
    images: [
      {
        url: buildAbsoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [buildAbsoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${purno.variable} ${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
        <JsonLd data={[buildPersonSchema(), buildWebsiteSchema()]} />
        <LenisProvider>
          <QueryProvider>
            <SiteProvider>{children}</SiteProvider>
          </QueryProvider>
        </LenisProvider>
      </body>
    </html>
  );
};

export default RootLayout;
