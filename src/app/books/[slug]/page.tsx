import { BookDetailScreen } from "@/screens/BookDetailScreen";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <BookDetailScreen slug={slug} />;
};

export default Page;
