"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { TopHeader } from "@/components/layout/TopHeader";
import { Footer } from "@/components/layout/Footer";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";
import { resolveAssetUrl } from "@/lib/asset-url";
import { useBookBySlugQuery } from "@/services/book";

interface BookDetailScreenProps {
  slug: string;
}

export const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ slug }) => {
  const { site, isLoading: isSiteLoading, isError: isSiteError, retry: retrySite } = useSite();
  const {
    data: bookRes,
    isLoading: isBookLoading,
    isError: isBookError,
    error: bookError,
    refetch: refetchBook,
  } = useBookBySlugQuery(slug, {
    retry: (failureCount, err) => {
      if (axios.isAxiosError(err) && err.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  const isNotFound = axios.isAxiosError(bookError) && bookError.response?.status === 404;

  if (isSiteError || (isBookError && !isNotFound)) {
    return (
      <NetworkErrorView
        onRetry={() => {
          retrySite();
          void refetchBook();
        }}
      />
    );
  }

  if (isSiteLoading || isBookLoading || !site) {
    return <PageSkeleton />;
  }

  const book = bookRes?.data;

  if (isNotFound || !book) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-white text-black">
        <TopHeader />
        <main className="mx-auto my-auto max-w-xl space-y-5 px-5 py-20">
          <h1 className="font-sans text-3xl font-bold text-black">{site.ui.bookNotFoundTitle}</h1>
          <p className="font-editorial-body text-neutral-600">{site.ui.bookNotFoundSubtitle}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-black bg-black px-4 py-2 font-mono text-xs text-white uppercase"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{site.nav.backToHome}</span>
          </Link>
        </main>
        <Footer
          copyright={site.footer.copyright}
          rights={site.footer.rights}
          socials={site.footer.socials}
        />
      </div>
    );
  }

  const purchaseLinks =
    book.purchaseLinks && book.purchaseLinks.length > 0 ? book.purchaseLinks : [];

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-black">
      <div>
        <TopHeader />

        <div className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/#books"
              className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-neutral-600 uppercase transition-colors hover:text-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{site.nav.backToHome}</span>
            </Link>
            <span className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
              {site.ui.bookSpecLabel}
            </span>
          </div>
        </div>

        <main>
          <section className="border-b border-neutral-200 py-12 sm:py-16">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Clean Minimal Cover & Specs */}
              <div className="space-y-6 lg:col-span-5">
                {(book.coverImage || book.slug === "emon-jodi-hoto") && (
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-neutral-200 bg-neutral-50">
                    <Image
                      src={
                        book.coverImage && book.coverImage !== "/images/books/emon-jodi-hoto.webp"
                          ? resolveAssetUrl(book.coverImage)
                          : "/images/image.png"
                      }
                      alt={book.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                )}

                {purchaseLinks.length > 0 && (
                  <div className="space-y-2.5">
                    {purchaseLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          className={`w-full justify-between py-5 font-mono text-xs font-semibold tracking-wider uppercase ${
                            link.isPrimary
                              ? "bg-black text-white hover:bg-neutral-800"
                              : "border border-black bg-white text-black hover:bg-neutral-100"
                          }`}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </a>
                    ))}
                  </div>
                )}

                <div className="border border-neutral-200 p-4 font-mono text-xs">
                  <div className="mb-3 border-b border-neutral-200 pb-2 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    {site.ui.bookSpecLabel}
                  </div>
                  <dl className="grid grid-cols-2 gap-y-2 text-[11px]">
                    <dt className="text-neutral-500">{site.ui.bookAuthorLabel}:</dt>
                    <dd className="font-medium text-black">{book.author}</dd>

                    <dt className="text-neutral-500">{site.ui.bookPublisherLabel}:</dt>
                    <dd className="font-medium text-black">{book.publisher || "—"}</dd>

                    <dt className="text-neutral-500">{site.ui.bookYearLabel}:</dt>
                    <dd className="font-medium text-black">
                      {book.publicationYear || "—"} {book.edition ? `(${book.edition})` : ""}
                    </dd>

                    {book.language && (
                      <>
                        <dt className="text-neutral-500">{site.ui.bookLanguageLabel}:</dt>
                        <dd className="font-medium text-black">{book.language}</dd>
                      </>
                    )}

                    {book.pages ? (
                      <>
                        <dt className="text-neutral-500">{site.ui.bookPagesLabel}:</dt>
                        <dd className="font-medium text-black">{book.pages}</dd>
                      </>
                    ) : null}

                    {book.isbn && (
                      <>
                        <dt className="text-neutral-500">{site.ui.bookIsbnLabel}:</dt>
                        <dd className="font-medium text-black">{book.isbn}</dd>
                      </>
                    )}
                  </dl>
                </div>
              </div>

              {/* Right Column: Title, Synopsis & Themes */}
              <div className="space-y-8 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                  {book.category && (
                    <span className="border border-black bg-black px-2.5 py-1 text-white">
                      {book.category}
                    </span>
                  )}
                  {book.genre && (
                    <span className="border border-neutral-300 px-2.5 py-1 text-neutral-700">
                      {book.genre}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="font-editorial-body text-4xl leading-tight font-extrabold tracking-tight text-black sm:text-5xl">
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="font-editorial-body text-lg text-neutral-600 sm:text-xl">
                      {book.subtitle}
                    </p>
                  )}
                </div>

                {book.synopsis && (
                  <div className="space-y-3 border-t border-neutral-200 pt-6">
                    <h2 className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
                      {site.ui.bookSynopsisLabel}
                    </h2>
                    <div className="font-editorial-body text-base leading-relaxed whitespace-pre-line text-neutral-800 sm:text-lg">
                      {typeof book.synopsis === "string" ? book.synopsis.trim() : ""}
                    </div>
                  </div>
                )}

                {book.themes && book.themes.length > 0 && (
                  <div className="space-y-3 border-t border-neutral-200 pt-6">
                    <h2 className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
                      {site.ui.bookThemesLabel}
                    </h2>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {book.themes.map((theme, index) => (
                        <li
                          key={index}
                          className="font-editorial-body flex items-start gap-2 border border-neutral-200 p-3 text-sm text-neutral-800"
                        >
                          <span className="font-mono text-xs font-bold text-neutral-400">
                            0{index + 1}.
                          </span>
                          <span>{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

          {book.quotes && book.quotes.length > 0 && (
            <section className="border-b border-neutral-200 py-12 sm:py-16">
              <div className="mx-auto max-w-5xl space-y-6 px-5 sm:px-8">
                <h2 className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
                  {site.ui.bookQuotesLabel}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {book.quotes.map((quote, idx) => (
                    <blockquote
                      key={idx}
                      className="font-editorial-body border-l-2 border-black pl-4 text-base leading-relaxed text-neutral-800 italic"
                    >
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>
          )}

          {book.chapters && book.chapters.length > 0 && (
            <section className="border-b border-neutral-200 py-12 sm:py-16">
              <div className="mx-auto max-w-5xl space-y-6 px-5 sm:px-8">
                <h2 className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
                  {site.ui.bookChaptersLabel}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {book.chapters.map((ch) => (
                    <div key={ch.number} className="border border-neutral-200 p-5">
                      <div className="mb-2 flex items-center justify-between font-mono text-xs text-neutral-400">
                        <span>{ch.number}</span>
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <h3 className="font-editorial-body mb-1.5 text-lg font-bold text-black">
                        {ch.title}
                      </h3>
                      <p className="font-editorial-body text-sm leading-relaxed text-neutral-700">
                        {ch.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {book.authorNote && (
            <section className="py-12 sm:py-16">
              <div className="mx-auto max-w-3xl space-y-4 border-l-2 border-black px-5 sm:px-8">
                <h2 className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
                  {site.ui.bookAuthorNoteLabel}
                </h2>
                <div className="font-editorial-body text-base leading-relaxed whitespace-pre-line text-neutral-800 italic sm:text-lg">
                  {book.authorNote.trim()}
                </div>
                <div className="font-mono text-xs font-bold text-black uppercase">
                  — {book.author}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer
        copyright={site.footer.copyright}
        rights={site.footer.rights}
        socials={site.footer.socials}
      />
    </div>
  );
};
