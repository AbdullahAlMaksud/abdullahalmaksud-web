import type { Metadata } from "next";
import { HomeScreen } from "@/screens/HomeScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, buildPageMetadata } from "@/lib/seo";
import { buildWebPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  path: "/",
  description: DEFAULT_DESCRIPTION,
});

const Page = () => (
  <>
    <JsonLd
      data={buildWebPageSchema({
        type: "WebPage",
        name: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        path: "/",
      })}
    />
    <HomeScreen />
  </>
);

export default Page;
