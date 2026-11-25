"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TopHeader } from "@/components/layout/TopHeader";
import { Footer } from "@/components/layout/Footer";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, X, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogGridCard } from "@/screens/blog/BlogGridCard";
import { BlogListCard } from "@/screens/blog/BlogListCard";
import { useBlogs } from "@/lib/hooks/useBlogs";
import { useSite } from "@/contexts/SiteContext";

export const BlogScreen = () => {
  const { site, isLoading: isSiteLoading, isError: isSiteError, retry: retrySite } = useSite();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: posts = [],
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    refetch,
  } = useBlogs();

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((post) => {
        const contentStr =
          typeof post.content === "string" ? post.content : JSON.stringify(post.content || "");
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          contentStr.toLowerCase().includes(q) ||
          post.tag.toLowerCase().includes(q)
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return posts.indexOf(a) - posts.indexOf(b);
      if (sortBy === "oldest") return posts.indexOf(b) - posts.indexOf(a);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "readTime") {
        const getMins = (str: string) => parseInt(str.replace(/\D/g, "") || "0", 10);
        return getMins(a.readTime) - getMins(b.readTime);
      }
      return 0;
    });

    return result;
  }, [posts, searchQuery, sortBy]);

  if (isSiteError || isBlogsError) {
    return (
      <NetworkErrorView
        onRetry={() => {
          retrySite();
          void refetch();
        }}
      />
    );
  }

  if (isSiteLoading || isBlogsLoading || !site) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-black">
      <div>
        <TopHeader />

        <div className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-neutral-600 uppercase transition-colors hover:text-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{site.nav.backToHome}</span>
            </Link>
            <div className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
              {filteredAndSortedPosts.length}
            </div>
          </div>
        </div>

        {/* Header */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-5xl space-y-3 px-5 py-12 sm:px-8">
            <h1 className="font-sans text-3xl font-extrabold tracking-tight text-black uppercase sm:text-4xl lg:text-5xl">
              {site.ui.blogTitle}
            </h1>
            <p className="font-editorial-body max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {site.ui.blogSubtitle}
            </p>
          </div>
        </section>

        {/* Search & Sort Toolbar */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={site.ui.searchPlaceholder}
                className="h-9 w-full border border-neutral-300 bg-white pr-8 pl-9 font-sans text-xs focus:border-black"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="hidden font-mono text-[10px] tracking-widest text-neutral-500 uppercase md:inline-block">
                  {site.ui.sortLabel}:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-36 border-neutral-300 bg-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="newest">{site.ui.sortNewest}</SelectItem>
                    <SelectItem value="oldest">{site.ui.sortOldest}</SelectItem>
                    <SelectItem value="readTime">{site.ui.sortReadTime}</SelectItem>
                    <SelectItem value="title">{site.ui.sortTitle}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex h-9 items-center border border-neutral-300 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid View"
                  className={`flex h-full cursor-pointer items-center justify-center px-2.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List View"
                  className={`flex h-full cursor-pointer items-center justify-center px-2.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Posts List */}
        <section className="mx-auto min-h-[300px] max-w-5xl px-5 py-12 sm:px-8">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="space-y-3 py-12 text-center">
              <p className="font-sans text-base font-bold text-black uppercase">
                {site.ui.emptyBlogsTitle}
              </p>
              <p className="font-editorial-body text-sm text-neutral-600">
                {site.ui.emptyBlogsSubtitle}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="cursor-pointer font-mono text-xs font-semibold text-black uppercase underline"
                >
                  {site.ui.clearSearch}
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedPosts.map((post, index) => (
                <BlogGridCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  readTime={post.readTime}
                  type={post.type}
                  isLead={index === 0 && !searchQuery}
                  isSecondary={index === 1 && !searchQuery}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="w-full space-y-8 divide-y divide-neutral-200">
              {filteredAndSortedPosts.map((post) => (
                <BlogListCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  readTime={post.readTime}
                  type={post.type}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer
        copyright={site.footer.copyright}
        rights={site.footer.rights}
        socials={site.footer.socials}
      />
    </div>
  );
};
