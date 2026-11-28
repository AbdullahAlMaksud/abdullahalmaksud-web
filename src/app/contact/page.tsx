import type { Metadata } from "next";
import { ContactScreen } from "@/screens/ContactScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/structured-data";

const CONTACT_DESCRIPTION =
  "Connect with Abdullah Al Maksud for frontend engineering, enterprise architecture consulting, design systems, and literary translation inquiries.";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact & Advisory",
  description: CONTACT_DESCRIPTION,
  path: "/contact",
});

const Page = () => (
  <>
    <JsonLd
      data={[
        buildWebPageSchema({
          type: "ContactPage",
          name: "Contact & Advisory — Abdullah Al Maksud",
          description: CONTACT_DESCRIPTION,
          path: "/contact",
        }),
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]),
      ]}
    />
    <ContactScreen />
  </>
);

export default Page;
