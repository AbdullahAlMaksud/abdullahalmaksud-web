import type { Metadata } from "next";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://abdullahalmaksud.com";

export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");
export const SITE_NAME = "Abdullah Al Maksud";
export const AUTHOR_NAME = "Abdullah Al Maksud";
export const AUTHOR_NAME_BN = "আব্দুল্লাহ আল মাকসুদ";
export const DEFAULT_TITLE = "Abdullah Al Maksud — Frontend Engineer, Architect & Author";
export const DEFAULT_DESCRIPTION =
  "Portfolio, technical case studies, monographs, and literary works of Abdullah Al Maksud. Frontend Engineering (React, Next.js, TypeScript), Design Systems, Enterprise Architecture, and Bengali-English Translation.";
export const DEFAULT_OG_IMAGE = "/images/portrait-full.png";

export const DEFAULT_KEYWORDS = [
  "Abdullah Al Maksud",
  "আব্দুল্লাহ আল মাকসুদ",
  "Frontend Engineer",
  "Lead Architect",
  "Next.js Developer",
  "React TypeScript Architect",
  "Design Systems",
  "Enterprise Architecture",
  "Bengali Science Fiction Author",
  "এমন যদি হতো",
  "Emon Jodi Hoto",
  "Technical Monographs",
  "Literary Translation",
];

export const buildAbsoluteUrl = (path = "/"): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

interface BuildPageMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article" | "book" | "profile";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export const buildPageMetadata = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  keywords = DEFAULT_KEYWORDS,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: BuildPageMetadataInput = {}): Metadata => {
  const canonicalUrl = buildAbsoluteUrl(path);
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const ogImageUrl = buildAbsoluteUrl(image);

  return {
    ...(title ? { title } : {}),
    description,
    keywords,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    creator: AUTHOR_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      alternateLocale: ["bn_BD"],
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
};
