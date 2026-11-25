import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { aboutKeys } from "./query-key";
import { getAboutData } from "./api";
import type { AboutData, SupportedLocale } from "@/types/site";

export function useAboutQuery(
  locale: SupportedLocale = "en",
  options?: Omit<
    UseQueryOptions<AboutData, Error, AboutData, ReturnType<typeof aboutKeys.locale>>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<AboutData, Error> {
  return useQuery({
    queryKey: aboutKeys.locale(locale),
    queryFn: () => getAboutData(locale),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    ...options,
  });
}
