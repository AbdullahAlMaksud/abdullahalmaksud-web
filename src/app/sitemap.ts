import type { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "@/lib/seo";
import { getSeoBlogs, getSeoBooks } from "@/lib/seo-data";

export const revalidate = 3600;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: buildAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: buildAbsoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: buildAbsoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: buildAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildAbsoluteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const [blogs, books] = await Promise.all([getSeoBlogs(false), getSeoBooks()]);

  const blogRoutes: MetadataRoute.Sitemap = blogs.map(({ post, updatedAt }) => ({
    url: buildAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: updatedAt ? new Date(updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const bookRoutes: MetadataRoute.Sitemap = books.map((book) => ({
    url: buildAbsoluteUrl(`/books/${book.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...bookRoutes, ...blogRoutes];
};

export default sitemap;
