"use client";

import Link from "next/link";
import { TopHeader } from "@/components/layout/TopHeader";
import { Footer } from "@/components/layout/Footer";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { ArrowLeft } from "lucide-react";
import { BlockContentRenderer } from "@/components/content/BlockContentRenderer";
import { BlogPost } from "@/types/blog";
import { useSite } from "@/contexts/SiteContext";

interface BlogPostScreenProps {
  post: BlogPost;
}

export const BlogPostScreen = ({ post }: BlogPostScreenProps) => {
  const { site, isLoading, isError, retry } = useSite();

  if (isError) {
    return <NetworkErrorView onRetry={retry} />;
  }

  if (isLoading || !site) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F7F7F5] text-[#111]">
      <div>
        <TopHeader />

        <div className="border-b border-black/10 bg-white/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-neutral-600 uppercase transition-colors hover:text-[#111]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{site.nav.allWritings}</span>
            </Link>
            <span className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
              {post.category} · {post.type}
            </span>
          </div>
        </div>

        <article className="font-editorial-body mx-auto my-8 max-w-3xl bg-white px-6 py-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:my-12 sm:px-12 sm:py-14">
          <header className="space-y-4 border-b border-black/10 pb-8">
            <div className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
              {post.date} · {post.readTime} · {post.tag}
            </div>

            <h1 className="font-display text-3xl leading-[1.15] font-bold tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="font-editorial-body pt-1 text-base leading-relaxed text-neutral-600 sm:text-lg">
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="pt-8 sm:pt-10">
            <BlockContentRenderer content={post.content} />
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 font-mono text-xs text-neutral-500 sm:flex-row sm:items-center">
            <div>
              {site.ui.writtenByLabel}{" "}
              <span className="font-bold text-[#111]">{site.ui.authorName}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="underline transition-colors hover:text-[#111]">
                {site.nav.allWritings}
              </Link>
              <span>·</span>
              <Link href="/" className="underline transition-colors hover:text-[#111]">
                {site.nav.home}
              </Link>
              <span>·</span>
              <Link href="/contact" className="underline transition-colors hover:text-[#111]">
                {site.ui.contactAuthor}
              </Link>
            </div>
          </div>
        </article>
      </div>

      <Footer
        copyright={site.footer.copyright}
        rights={site.footer.rights}
        socials={site.footer.socials}
      />
    </div>
  );
};
