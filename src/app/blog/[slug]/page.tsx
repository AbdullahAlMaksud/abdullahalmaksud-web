import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogPostScreen } from "@/screens/BlogPostScreen";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { fetchBlogBySlugStrict, mapApiBlogToBlogPost } from "@/lib/api/blogs";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchBlogBySlugStrict(slug);

  if (result.status !== "ok") {
    return {
      title: "Abdullah Al Maksud",
    };
  }

  const post = mapApiBlogToBlogPost(result.blog);

  return {
    title: `${post.title} — Abdullah Al Maksud`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Abdullah Al Maksud`,
      description: post.excerpt,
      type: "article",
    },
  };
}

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
  return <BlogPostScreen post={post} />;
};

export default Page;
