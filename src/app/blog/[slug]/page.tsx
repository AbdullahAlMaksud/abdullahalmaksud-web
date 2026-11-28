import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostScreen } from "@/screens/BlogPostScreen";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchBlogBySlugStrict, mapApiBlogToBlogPost } from "@/lib/api/blogs";
import { resolveAssetUrl } from "@/lib/asset-url";
import { DEFAULT_OG_IMAGE, buildPageMetadata } from "@/lib/seo";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({ params }: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const result = await fetchBlogBySlugStrict(slug);

  if (result.status !== "ok") {
    return buildPageMetadata({
      title: "Article",
      path: `/blog/${slug}`,
      noIndex: result.status === "not_found",
    });
  }

  const post = mapApiBlogToBlogPost(result.blog);
  const image = post.coverImage ? resolveAssetUrl(post.coverImage) : DEFAULT_OG_IMAGE;

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    image,
    publishedTime: result.blog.publishedAt || result.blog.createdAt,
    modifiedTime: result.blog.updatedAt,
    keywords: [post.category, post.tag, post.type, "Abdullah Al Maksud"].filter(Boolean),
  });
};

const Page = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const result = await fetchBlogBySlugStrict(slug);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "error") {
    return <NetworkErrorView />;
  }

  const post = mapApiBlogToBlogPost(result.blog);
  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingSchema(post),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <BlogPostScreen post={post} />
    </>
  );
};

export default Page;
