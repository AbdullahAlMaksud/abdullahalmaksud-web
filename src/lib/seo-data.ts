import { BLOG_POSTS } from "@/data/blog-data";
import { BOOKS_DATA, getBookBySlug as getStaticBookBySlug } from "@/data/book-data";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { mapApiBlogToBlogPost, type ApiBlog } from "@/lib/api/blogs";
import type { ApiCaseStudy } from "@/lib/api/case-studies";
import type { ApiProject } from "@/lib/api/projects";
import type { ContentBlock, ContentPayload } from "@/types/block";
import type { BlogPost } from "@/types/blog";
import type { BookPublication } from "@/types/book";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const fetchJsonWithTimeout = async <T>(path: string, timeoutMs = 4500): Promise<T | null> => {
  if (!API_BASE_URL || !/^https?:\/\//i.test(API_BASE_URL)) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export interface SeoBlogItem {
  post: BlogPost;
  updatedAt?: string;
}

export const getSeoBlogs = async (includeContent = false): Promise<SeoBlogItem[]> => {
  const query = includeContent
    ? "/api/blogs?published=true&limit=100&includeContent=true"
    : "/api/blogs?published=true&limit=100";
  const res = await fetchJsonWithTimeout<{ data?: ApiBlog[] }>(query);

  if (res?.data && res.data.length > 0) {
    return res.data.map((item) => ({
      post: mapApiBlogToBlogPost(item),
      updatedAt: item.updatedAt || item.publishedAt || item.createdAt,
    }));
  }

  return BLOG_POSTS.map((post) => ({ post }));
};

export const getSeoBooks = async (): Promise<BookPublication[]> => {
  const res = await fetchJsonWithTimeout<{ data?: BookPublication[] }>("/api/v1/books/all");
  if (res?.data && res.data.length > 0) {
    return res.data;
  }
  return BOOKS_DATA;
};

export const getSeoBookBySlug = async (slug: string): Promise<BookPublication | null> => {
  const res = await fetchJsonWithTimeout<{ data?: BookPublication }>(
    `/api/v1/books/${encodeURIComponent(slug)}`
  );
  if (res?.data) {
    return res.data;
  }
  return getStaticBookBySlug(slug) || null;
};

export const getSeoCaseStudies = async (): Promise<ApiCaseStudy[]> => {
  const res = await fetchJsonWithTimeout<{ data?: ApiCaseStudy[] }>(
    "/api/case-studies?published=true&limit=20&includeContent=true"
  );
  if (res?.data && res.data.length > 0) {
    return res.data;
  }

  return PORTFOLIO_DATA.enterpriseArchitecture.projects.map((p) => {
    const textContent = extractPlainText(p.fullContent);
    return {
      title: p.title,
      slug: p.id,
      client: "Enterprise",
      category: p.tag,
      excerpt: p.description,
      challenge: p.description,
      solution: textContent,
      results: (p.metrics || []).map((m) => ({ metric: "Outcome", value: m })),
      content: textContent,
      featured: true,
      tags: [],
      stack: p.techStack || [],
      isPublished: true,
      createdAt: "",
      updatedAt: "",
    };
  });
};

export const getSeoProjects = async (): Promise<ApiProject[]> => {
  const res = await fetchJsonWithTimeout<{ data?: ApiProject[] }>("/api/projects?limit=20");
  if (res?.data && res.data.length > 0) {
    return res.data;
  }

  return PORTFOLIO_DATA.designSystems.modules.map((m, idx) => ({
    title: m.title,
    slug: m.id,
    description: m.description,
    category: m.tag,
    status: "Completed",
    featured: true,
    tags: [],
    stack: [],
    sortOrder: idx,
    isPublished: true,
    createdAt: "",
    updatedAt: "",
  }));
};

const extractBlocksText = (blocks: ContentBlock[]): string =>
  blocks
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const data = block.data;
      if (!data) return "";
      if (data.markdown) return data.markdown;
      if (data.text) return data.text;
      if (data.items?.length) return data.items.map((i) => `- ${i}`).join("\n");
      if (data.code) return data.code;
      return "";
    })
    .filter(Boolean)
    .join("\n\n");

const extractLexicalText = (node: unknown): string => {
  if (!node || typeof node !== "object") return "";
  const record = node as { text?: unknown; children?: unknown[] };
  const parts: string[] = [];
  if (typeof record.text === "string") parts.push(record.text);
  if (Array.isArray(record.children)) {
    for (const child of record.children) {
      const childText = extractLexicalText(child);
      if (childText) parts.push(childText);
    }
  }
  return parts.join(" ").trim();
};

export const extractPlainText = (content: ContentPayload): string => {
  if (!content) return "";
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) return extractBlocksText(content);
  if (typeof content === "object" && "blocks" in content && Array.isArray(content.blocks)) {
    return extractBlocksText(content.blocks);
  }
  if (typeof content === "object" && "root" in content && content.root) {
    return extractLexicalText(content.root);
  }
  return "";
};
