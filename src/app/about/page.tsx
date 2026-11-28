import type { Metadata } from "next";
import { AboutScreen } from "@/screens/AboutScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/structured-data";

const ABOUT_DESCRIPTION =
  "Biography, engineering philosophy, design systems expertise, literary translation work, and CV of Abdullah Al Maksud — Frontend Engineer & Lead Architect.";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: ABOUT_DESCRIPTION,
  path: "/about",
  type: "profile",
});

const Page = () => (
  <>
    <JsonLd
      data={[
        buildWebPageSchema({
          type: "ProfilePage",
          name: "About — Abdullah Al Maksud",
          description: ABOUT_DESCRIPTION,
          path: "/about",
        }),
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ]}
    />
    <AboutScreen />
  </>
);

export default Page;
