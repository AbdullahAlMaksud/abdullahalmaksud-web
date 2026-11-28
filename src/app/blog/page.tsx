import type { Metadata } from "next";
import { BlogScreen } from "@/screens/BlogScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/structured-data";

const BLOG_DESCRIPTION =
  "Essays, monographs, and technical articles by Abdullah Al Maksud on frontend architecture, state thermodynamics, formal UI design systems, and Bengali digital typography.";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog & Monographs",
  description: BLOG_DESCRIPTION,
  path: "/blog",
});

const Page = () => (
  <>
    <JsonLd
      data={[
        buildWebPageSchema({
          type: "CollectionPage",
          name: "Blog & Monographs — Abdullah Al Maksud",
          description: BLOG_DESCRIPTION,
          path: "/blog",
        }),
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
      ]}
    />
    <BlogScreen />
  </>
);

export default Page;
