import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const robots = (): MetadataRoute.Robots => {
  const aiAgentAllowRules = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Meta-ExternalAgent",
    "DuckAssistBot",
  ].map((userAgent) => ({
    userAgent,
    allow: ["/", "/about", "/blog", "/books", "/contact", "/llms.txt", "/llms-full.txt"],
    disallow: ["/api/"],
  }));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...aiAgentAllowRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
};

export default robots;
