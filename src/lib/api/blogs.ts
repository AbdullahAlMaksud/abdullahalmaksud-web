import axios from "axios";
import { apiClient, safeGet, ApiResponse, PaginatedApiResponse } from "./client";
import { BlogPost } from "@/types/blog";
import type { ContentPayload } from "@/types/block";

export interface ApiBlog {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentPayload;
  coverImage?: string;
  category: string;
  tags: string[];
  readTime?: string;
  readingTime?: string;
  publishedAt?: string;
  type?: "essay" | "monograph" | "paper" | "article" | string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  published?: boolean;
  includeContent?: boolean;
}

/**
 * Fetch all blogs from the server with pagination and filtering.
 */
export async function fetchBlogs(
  params: BlogQueryParams = {}
): Promise<PaginatedApiResponse<ApiBlog>> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.category) queryParams.set("category", params.category);
  if (params.featured !== undefined) queryParams.set("featured", String(params.featured));
  if (params.search) queryParams.set("search", params.search);
  if (params.published !== undefined) {
    queryParams.set("published", String(params.published));
  } else {
    queryParams.set("published", "true");
  }
  if (params.includeContent) queryParams.set("includeContent", "true");

  const queryString = queryParams.toString();
  const url = `/api/blogs${queryString ? `?${queryString}` : ""}`;

  const res = await apiClient.get<PaginatedApiResponse<ApiBlog>>(url);
  return res.data;
}

export type FetchBlogSlugResult =
  { status: "ok"; blog: ApiBlog } | { status: "not_found" } | { status: "error" };

/**
 * Fetch a single blog post by slug, distinguishing 404 vs network/server error.
 */
export async function fetchBlogBySlugStrict(slug: string): Promise<FetchBlogSlugResult> {
  try {
    const res = await apiClient.get<ApiResponse<ApiBlog>>(`/api/blogs/${encodeURIComponent(slug)}`);
    if (!res.data?.data) {
      return { status: "not_found" };
    }
    return { status: "ok", blog: res.data.data };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { status: "not_found" };
    }
    return { status: "error" };
  }
}

/**
 * Fetch a single blog post by its slug (returns null on error/404).
 */
export async function fetchBlogBySlug(slug: string): Promise<ApiBlog | null> {
  const res = await safeGet<ApiResponse<ApiBlog>>(`/api/blogs/${encodeURIComponent(slug)}`);
  return res?.data || null;
}

/**
 * Fetch blog categories.
 */
export async function fetchBlogCategories(): Promise<string[]> {
  const res = await safeGet<ApiResponse<string[]>>("/api/blogs/categories");
  return res?.data || [];
}

/**
 * Convert backend ApiBlog to frontend BlogPost model
 */
export function mapApiBlogToBlogPost(blog: ApiBlog): BlogPost {
  let cleanContent: ContentPayload = "";

  if (Array.isArray(blog.content)) {
    cleanContent = blog.content;
  } else if (
    typeof blog.content === "object" &&
    blog.content !== null &&
    "blocks" in blog.content &&
    Array.isArray((blog.content as { blocks?: unknown[] }).blocks)
  ) {
    cleanContent = blog.content;
  } else if (typeof blog.content === "string") {
    cleanContent = blog.content;
    if (cleanContent.startsWith("{") && cleanContent.includes('"root"')) {
      try {
        const parsed = JSON.parse(cleanContent);
        const extractText = (node: Record<string, any>): string => {
          if (!node) return "";
          if (node.text) return node.text;
          if (node.children && Array.isArray(node.children)) {
            return node.children.map(extractText).join(node.type === "paragraph" ? "\n" : "");
          }
          return "";
        };
        cleanContent = extractText(parsed.root);
      } catch {
        // Keep original string if parse fails
      }
    }
  }

  const tag = blog.tags && blog.tags.length > 0 ? blog.tags[0] : blog.category.toUpperCase();

  const typeMap: Record<string, "Essay" | "Article" | "Monograph" | "Publication"> = {
    essay: "Essay",
    article: "Article",
    monograph: "Monograph",
    paper: "Publication",
    publication: "Publication",
  };
  const mappedType = (blog.type && typeMap[blog.type.toLowerCase()]) || "Essay";

  const rawDate = blog.publishedAt || blog.createdAt;
  const parsedDate = new Date(rawDate);
  const formattedDate = Number.isNaN(parsedDate.getTime())
    ? rawDate
    : parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

  return {
    slug: blog.slug,
    title: blog.title,
    category: blog.category || "ENGINEERING",
    excerpt: blog.excerpt,
    date: formattedDate,
    readTime: blog.readTime || blog.readingTime || "5 MIN READ",
    tag: tag.startsWith("0") ? tag : `${tag}`,
    type: mappedType,
    content: cleanContent,
  };
}
