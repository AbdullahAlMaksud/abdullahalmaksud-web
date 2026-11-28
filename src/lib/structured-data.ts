import {
  AUTHOR_NAME,
  AUTHOR_NAME_BN,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  buildAbsoluteUrl,
} from "@/lib/seo";
import { resolveAssetUrl } from "@/lib/asset-url";
import type { BlogPost } from "@/types/blog";
import type { BookPublication } from "@/types/book";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const buildPersonSchema = (sameAs: string[] = []) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: AUTHOR_NAME,
  alternateName: AUTHOR_NAME_BN,
  url: SITE_URL,
  image: buildAbsoluteUrl("/images/portrait-full.png"),
  jobTitle: "Frontend Engineer, Lead Architect & Author",
  description: DEFAULT_DESCRIPTION,
  knowsAbout: [
    "Frontend Engineering",
    "React",
    "Next.js",
    "TypeScript",
    "Design Systems",
    "Enterprise Web Architecture",
    "UI/UX Engineering",
    "Bengali-English Literary Translation",
    "Science Fiction Literature",
  ],
  knowsLanguage: ["en", "bn"],
  ...(sameAs.length > 0 ? { sameAs } : {}),
});

export const buildWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: ["en", "bn"],
  publisher: {
    "@id": `${SITE_URL}/#person`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildAbsoluteUrl(item.path),
  })),
});

export const buildBlogPostingSchema = (post: BlogPost) => {
  const url = buildAbsoluteUrl(`/blog/${post.slug}`);
  const image = post.coverImage
    ? buildAbsoluteUrl(resolveAssetUrl(post.coverImage))
    : buildAbsoluteUrl("/images/portrait-full.png");

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: [image],
    ...(post.date ? { datePublished: post.date } : {}),
    inLanguage: post.language === "bn" ? "bn" : "en",
    articleSection: post.category,
    keywords: [post.category, post.tag, post.type].filter(Boolean).join(", "),
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  };
};

export const buildBookSchema = (book: BookPublication) => {
  const url = buildAbsoluteUrl(`/books/${book.slug}`);
  const image = book.coverImage
    ? buildAbsoluteUrl(resolveAssetUrl(book.coverImage))
    : buildAbsoluteUrl("/images/image.png");
  const primaryOffer =
    book.purchaseLinks?.find((link) => link.isPrimary) || book.purchaseLinks?.[0];

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${url}#book`,
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    description: book.synopsis?.trim() || book.subtitle,
    url,
    image,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: book.author || AUTHOR_NAME,
      url: SITE_URL,
    },
    ...(book.publisher
      ? {
          publisher: {
            "@type": "Organization",
            name: book.publisher,
          },
        }
      : {}),
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.pages ? { numberOfPages: book.pages } : {}),
    ...(book.genre ? { genre: book.genre } : {}),
    inLanguage: book.language || "bn",
    ...(book.publicationYear ? { datePublished: book.publicationYear } : {}),
    ...(primaryOffer
      ? {
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            url: primaryOffer.url,
          },
        }
      : {}),
  };
};

export const buildWebPageSchema = ({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ProfilePage" | "CollectionPage" | "ContactPage";
  name: string;
  description: string;
  path: string;
}) => {
  const url = buildAbsoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#person`,
    },
  };
};
