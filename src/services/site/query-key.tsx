import type { SupportedLocale } from "@/types/site";

export const siteKeys = {
  all: ["site"] as const,
  locale: (locale: SupportedLocale) => [...siteKeys.all, locale] as const,
};
