import type { Metadata } from "next";
import localFont from "next/font/local";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SiteProvider } from "@/contexts/SiteContext";
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
  title: "Abdullah Al Maksud — Lead Architect & Consultant",
  description:
    "Editorial portfolio of Abdullah Al Maksud. Translation, Design Systems, Web & App Engineering, and Enterprise Architecture.",
  keywords: [
    "Abdullah Al Maksud",
    "Lead Architect",
    "Strategic Implementation",
    "Translation",
    "Design Systems",
    "Web Development",
    "Mobile Apps",
    "Portfolio",
  ],
  authors: [{ name: "Abdullah Al Maksud" }],
  icons: {
    icon: [
      { url: "/icons/brand-logo.svg", type: "image/svg+xml" },
      { url: "/icons/brand-logo.png", type: "image/png" },
    ],
    apple: "/icons/brand-logo.png",
  },
  openGraph: {
    title: "Abdullah Al Maksud — Lead Architect & Consultant",
    description:
      "Editorial portfolio and monographs covering Translation, UI/UX Design, Web & App Solutions, and Enterprise Architecture.",
    type: "website",
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
