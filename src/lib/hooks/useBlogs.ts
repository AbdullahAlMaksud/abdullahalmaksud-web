"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBlogs,
  fetchBlogBySlug,
  fetchBlogCategories,
  BlogQueryParams,
  mapApiBlogToBlogPost,
  ApiBlog,
} from "@/lib/api/blogs";
import { BlogPost } from "@/types/blog";

/**
 * Hook to fetch paginated/filtered blogs using TanStack Query.
 * Throws on network/server failure so callers can render the Error Page.
 */
export function useBlogs(params: BlogQueryParams = {}) {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: async () => {
      const response = await fetchBlogs(params);
      return response.data || ([] as ApiBlog[]);
    },
    select: (apiBlogs): BlogPost[] => {
      return apiBlogs.map(mapApiBlogToBlogPost);
    },
    retry: 1,
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useBlog(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: Boolean(slug),
    retry: 1,
  });
}

/**
 * Hook to fetch blog categories
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: fetchBlogCategories,
  });
}
