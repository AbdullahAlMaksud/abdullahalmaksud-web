import type { Metadata } from "next";
import { BookDetailScreen } from "@/screens/BookDetailScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { resolveAssetUrl } from "@/lib/asset-url";
import { DEFAULT_OG_IMAGE, buildPageMetadata } from "@/lib/seo";
import { getSeoBookBySlug } from "@/lib/seo-data";
import { buildBookSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: BookPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const book = await getSeoBookBySlug(slug);

  if (!book) {
    return buildPageMetadata({
      title: "Book Publication",
      path: `/books/${slug}`,
    });
  }

  const image = book.coverImage ? resolveAssetUrl(book.coverImage) : DEFAULT_OG_IMAGE;
  const description =
    book.subtitle || book.synopsis?.trim().slice(0, 160) || `${book.title} by ${book.author}`;

  return buildPageMetadata({
    title: `${book.title} — ${book.author}`,
    description,
    path: `/books/${slug}`,
    type: "book",
    image,
    keywords: [
      book.title,
      book.author,
      book.genre,
      book.publisher,
      "Bengali Literature",
      "Abdullah Al Maksud",
    ].filter((k): k is string => Boolean(k)),
  });
};

const Page = async ({ params }: BookPageProps) => {
  const { slug } = await params;
  const book = await getSeoBookBySlug(slug);

  return (
    <>
      {book && (
        <JsonLd
          data={[
            buildBookSchema(book),
            buildBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Books", path: "/#books" },
              { name: book.title, path: `/books/${slug}` },
            ]),
          ]}
        />
      )}
      <BookDetailScreen slug={slug} />
    </>
  );
};

export default Page;
