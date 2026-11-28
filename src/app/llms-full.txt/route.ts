import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import {
  AUTHOR_NAME,
  AUTHOR_NAME_BN,
  DEFAULT_DESCRIPTION,
  SITE_URL,
  buildAbsoluteUrl,
} from "@/lib/seo";
import {
  extractPlainText,
  getSeoBlogs,
  getSeoBooks,
  getSeoCaseStudies,
  getSeoProjects,
} from "@/lib/seo-data";

export const revalidate = 3600;

export const GET = async (): Promise<Response> => {
  const [blogs, books, caseStudies, projects] = await Promise.all([
    getSeoBlogs(true),
    getSeoBooks(),
    getSeoCaseStudies(),
    getSeoProjects(),
  ]);

  const sections: string[] = [
    `# ${AUTHOR_NAME} (${AUTHOR_NAME_BN}) — Full Knowledge Base`,
    "",
    `> ${DEFAULT_DESCRIPTION}`,
    "",
    `- Canonical URL: ${SITE_URL}`,
    `- Summary Index: ${buildAbsoluteUrl("/llms.txt")}`,
    `- Primary Disciplines: Frontend Engineering (React, Next.js, TypeScript), Enterprise Architecture, Design Systems, Literary Translation (English/Bengali), Science Fiction Writing.`,
    "",
    "---",
    "",
    "## 1. Identity & Offerings",
    "",
    PORTFOLIO_DATA.identity.consultation.headline,
    "",
    ...PORTFOLIO_DATA.identity.consultation.offerings.map(
      (o) => `### ${o.label} (${o.category})\n${o.description}`
    ),
    "",
    "---",
    "",
    "## 2. Published Books",
    "",
    ...books.flatMap((book) => {
      const bookUrl = buildAbsoluteUrl(`/books/${book.slug}`);
      const details = [
        `### ${book.title}`,
        `- URL: ${bookUrl}`,
        `- Author: ${book.author}`,
        book.subtitle ? `- Subtitle: ${book.subtitle}` : "",
        book.genre ? `- Genre: ${book.genre}` : "",
        book.publisher ? `- Publisher: ${book.publisher}` : "",
        book.publicationYear ? `- Year: ${book.publicationYear}` : "",
        book.isbn ? `- ISBN: ${book.isbn}` : "",
        book.pages ? `- Pages: ${book.pages}` : "",
        book.synopsis ? `\n#### Synopsis\n${book.synopsis.trim()}` : "",
        book.themes?.length ? `\n#### Themes\n${book.themes.map((t) => `- ${t}`).join("\n")}` : "",
        book.purchaseLinks?.length
          ? `\n#### Purchase Links\n${book.purchaseLinks.map((l) => `- [${l.label}](${l.url})`).join("\n")}`
          : "",
        "",
      ];
      return details.filter(Boolean);
    }),
    "",
    "---",
    "",
    "## 3. Essays, Monographs & Articles",
    "",
    ...blogs.flatMap(({ post }) => {
      const body = extractPlainText(post.content);
      return [
        `### ${post.title}`,
        `- URL: ${buildAbsoluteUrl(`/blog/${post.slug}`)}`,
        `- Category: ${post.category} | Type: ${post.type} | Language: ${post.language === "bn" ? "Bengali" : "English"}`,
        post.date ? `- Published: ${post.date}` : "",
        post.readTime ? `- Read Time: ${post.readTime}` : "",
        post.excerpt ? `\n> ${post.excerpt}` : "",
        body ? `\n${body}` : "",
        "",
      ].filter(Boolean);
    }),
    "",
    "---",
    "",
    "## 4. Technical Case Studies",
    "",
    ...caseStudies.flatMap((cs) =>
      [
        `### ${cs.title}`,
        `- Category: ${cs.category}`,
        cs.stack?.length ? `- Stack: ${cs.stack.join(", ")}` : "",
        cs.excerpt ? `- Summary: ${cs.excerpt}` : "",
        cs.results?.length
          ? `- Results:\n${cs.results.map((r) => `  - ${r.metric}: ${r.value}`).join("\n")}`
          : "",
        cs.content ? `\n${cs.content.trim()}` : "",
        "",
      ].filter(Boolean)
    ),
    "",
    "---",
    "",
    "## 5. Design Systems & Projects",
    "",
    ...projects.map(
      (p) =>
        `### ${p.title} (${p.category})\n${p.description}${p.tags?.length ? `\nTags: ${p.tags.join(", ")}` : ""}`
    ),
  ];

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
};
