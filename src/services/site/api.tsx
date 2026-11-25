import { axiosClient, ApiResponse } from "../axios-client";
import type { SiteLocaleData, SupportedLocale } from "@/types/site";

export async function getSiteData(
  locale: SupportedLocale = "en"
): Promise<ApiResponse<SiteLocaleData>> {
  const res = await axiosClient.get<ApiResponse<SiteLocaleData>>("/api/v1/site", {
    params: { locale },
  });
  return res.data;
}
