"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { RevealBlock, ParallaxBox } from "@/components/motion/ScrollReveal";
import { resolveAssetUrl } from "@/lib/asset-url";
import type { EssayPublication } from "@/types/portfolio";

export interface BookCoverItem {
  id: string;
  slug: string;
  title: string;
  author?: string;
  coverImage?: string;
  description?: string;
  publisher?: string;
  year?: string;
  category?: string;
}

interface LiteratureEssaysSectionProps {
  category: string;
  title: string;
  modalCategoryLabel?: string;
  bookLabel?: string;
  readBookDetailsLabel?: string;
  viewAllWritingsLabel?: string;
  books?: BookCoverItem[];
  items: EssayPublication[];
}

const FeaturedBookDetailCard: React.FC<{
  book: BookCoverItem;
  bookLabel: string;
  ctaLabel: string;
}> = ({ book, bookLabel, ctaLabel }) => {
  const initialSrc =
    book.coverImage === "/images/books/emon-jodi-hoto.webp" && book.slug === "emon-jodi-hoto"
      ? "/images/image.png"
      : resolveAssetUrl(book.coverImage);

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [failed, setFailed] = useState<boolean>(!initialSrc);

  const metaParts = [book.publisher, book.year, book.category].filter(Boolean);

  return (
    <RevealBlock>
      <Link
        href={`/books/${encodeURIComponent(book.slug)}`}
        className="group flex flex-col overflow-hidden bg-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_44px_rgba(0,0,0,0.09)] sm:flex-row sm:items-stretch"
      >
        {/* Left: Flush Book Cover fitted inside Card */}
        <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-[#141414] sm:w-[220px] md:w-[240px]">
          {!failed && imgSrc ? (
            <Image
              src={imgSrc}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              onError={() => {
                if (imgSrc !== "/images/image.png" && book.slug === "emon-jodi-hoto") {
                  setImgSrc("/images/image.png");
                } else {
                  setFailed(true);
                }
              }}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between bg-[#141414] p-6 text-white">
              <BookOpen className="h-5 w-5 text-neutral-400" />
              <div className="space-y-1">
                <div className="font-display text-lg leading-snug font-bold">{book.title}</div>
                {book.author && (
                  <div className="font-mono text-[10px] text-neutral-400">{book.author}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Book Details */}
        <div className="flex flex-1 flex-col justify-between space-y-6 p-6 sm:p-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] text-neutral-400 uppercase">
              <span>{bookLabel}</span>
              {book.author && <span className="text-neutral-500">{book.author}</span>}
            </div>

            <h3 className="font-display text-2xl leading-snug font-bold text-[#111] transition-colors group-hover:text-neutral-700 sm:text-3xl">
              {book.title}
            </h3>

            {metaParts.length > 0 && (
              <div className="font-mono text-[11px] text-neutral-500">{metaParts.join(" · ")}</div>
            )}

            {book.description && (
              <p className="font-editorial-body line-clamp-4 text-sm leading-relaxed text-neutral-600">
                {book.description}
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 pt-2 font-mono text-xs font-semibold tracking-wider text-[#111] uppercase">
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </RevealBlock>
  );
};

export const LiteratureEssaysSection: React.FC<LiteratureEssaysSectionProps> = ({
  category,
  title,
  modalCategoryLabel = "Read Article",
  bookLabel = "Published Book",
  readBookDetailsLabel = "Read Book Details",
  viewAllWritingsLabel = "Visit Blog",
  books = [],
  items,
}) => {
  if (items.length === 0 && books.length === 0) return null;

  const featuredBook = books[0];

  return (
    <div id="books" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      {/* Row 1: Left Title + Right Single Detailed Book Card */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <RevealBlock className="space-y-4 lg:col-span-4">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
            <span className="inline-block h-px w-5 bg-neutral-400" />
            <span>{category}</span>
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">
            {title}
          </h2>

          <div className="pt-1">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-[#111] uppercase"
            >
              <span>{viewAllWritingsLabel}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealBlock>

        {/* Right: Single Featured Book with Details */}
        <div className="lg:col-span-8">
          {featuredBook && (
            <ParallaxBox offset={10}>
              <FeaturedBookDetailCard
                book={featuredBook}
                bookLabel={bookLabel}
                ctaLabel={readBookDetailsLabel}
              />
            </ParallaxBox>
          )}
        </div>
      </div>

      {/* Row 2: Staggered Blog Cards linking to dedicated /blog/[slug] reader route */}
      {items.length > 0 && (
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => {
            const offsetClass = idx % 2 === 1 ? "md:mt-8" : "";
            const blogHref = item.slug ? `/blog/${encodeURIComponent(item.slug)}` : "/blog";

            return (
              <RevealBlock key={item.id} delay={idx * 0.08} className={offsetClass}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <Link
                    href={blogHref}
                    className="group flex h-full w-full flex-col justify-between space-y-5 bg-white p-6 text-left shadow-[0_4px_18px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                      <span>{item.tag}</span>
                      <span>{item.readTime}</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display text-xl leading-snug font-bold text-[#111] transition-colors group-hover:text-neutral-600">
                        {item.title}
                      </h3>
                      <p className="font-editorial-body line-clamp-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                        {item.description}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#111] uppercase">
                      <span>{modalCategoryLabel}</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              </RevealBlock>
            );
          })}
        </div>
      )}
    </div>
  );
};
