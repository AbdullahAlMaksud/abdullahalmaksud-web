import type { SupportedLocale } from "@/types/site";

export const aboutKeys = {
  all: ["about"] as const,
  locale: (locale: SupportedLocale) => [...aboutKeys.all, locale] as const,
};
