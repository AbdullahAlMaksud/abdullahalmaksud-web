import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import {
  AUTHOR_NAME,
  AUTHOR_NAME_BN,
  DEFAULT_DESCRIPTION,
  SITE_URL,
  buildAbsoluteUrl,
} from "@/lib/seo";
import { getSeoBlogs, getSeoBooks, getSeoCaseStudies, getSeoProjects } from "@/lib/seo-data";

export const revalidate = 3600;

export const GET = async (): Promise<Response> => {
  const [blogs, books, caseStudies, projects] = await Promise.all([
    getSeoBlogs(false),
    getSeoBooks(),
    getSeoCaseStudies(),
    getSeoProjects(),
  ]);

  const lines: string[] = [
    `# ${AUTHOR_NAME} (${AUTHOR_NAME_BN})`,
    "",
    `> ${DEFAULT_DESCRIPTION}`,
    "",
    `Canonical Website: ${SITE_URL}`,
    `Full Machine-Readable Context: ${buildAbsoluteUrl("/llms-full.txt")}`,
    `XML Sitemap: ${buildAbsoluteUrl("/sitemap.xml")}`,
    "",
    "## Core Identity & Disciplines",
    "",
    `- Role: ${PORTFOLIO_DATA.identity.role} (${PORTFOLIO_DATA.identity.subRole})`,
    ...PORTFOLIO_DATA.identity.consultation.offerings.map(
      (item) => `- ${item.label} (${item.category}): ${item.description}`
    ),
    "",
    "## Primary Pages",
    "",
    `- [Home](${buildAbsoluteUrl("/")}): Editorial portfolio, technical case studies, design systems, featured books, and writings.`,
    `- [About](${buildAbsoluteUrl("/about")}): Biography, architectural philosophy, experience, and CV of ${AUTHOR_NAME}.`,
    `- [Blog & Monographs](${buildAbsoluteUrl("/blog")}): Technical essays, formal UI monographs, and Bengali typography articles.`,
    `- [Contact & Advisory](${buildAbsoluteUrl("/contact")}): Direct inquiry and strategic consultation channels.`,
    "",
    "## Published Books",
    "",
    ...books.map(
      (book) =>
        `- [${book.title}](${buildAbsoluteUrl(`/books/${book.slug}`)}): ${book.subtitle || book.genre} — Author: ${book.author}${book.isbn ? `, ISBN: ${book.isbn}` : ""}`
    ),
    "",
    "## Essays, Articles & Monographs",
    "",
    ...blogs.map(
      ({ post }) =>
        `- [${post.title}](${buildAbsoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt} (${post.category}, ${post.language === "bn" ? "Bengali" : "English"})`
    ),
    "",
    "## Technical Case Studies",
    "",
    ...caseStudies.map((cs) => `- ${cs.title} (${cs.category}): ${cs.excerpt || cs.challenge}`),
    "",
    "## Design Systems & Projects",
    "",
    ...projects.map((p) => `- ${p.title} (${p.category}): ${p.description}`),
    "",
    "## Extended Context",
    "",
    `- [Full Knowledge Base (llms-full.txt)](${buildAbsoluteUrl("/llms-full.txt")}): Complete text of books, essays, case studies, and architectural notes for AI agents.`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
};
