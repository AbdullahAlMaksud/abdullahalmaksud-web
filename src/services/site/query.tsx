import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { siteKeys } from "./query-key";
import { getSiteData } from "./api";
import type { ApiResponse } from "../axios-client";
import type { SiteLocaleData, SupportedLocale } from "@/types/site";

export function useSiteQuery(
  locale: SupportedLocale = "en",
  options?: Omit<
    UseQueryOptions<
      ApiResponse<SiteLocaleData>,
      Error,
      ApiResponse<SiteLocaleData>,
      ReturnType<typeof siteKeys.locale>
    >,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ApiResponse<SiteLocaleData>, Error> {
  return useQuery({
    queryKey: siteKeys.locale(locale),
    queryFn: () => getSiteData(locale),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    ...options,
  });
}
