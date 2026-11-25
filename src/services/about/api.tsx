import { axiosClient } from "../axios-client";
import type { AboutData, SupportedLocale } from "@/types/site";

export async function getAboutData(locale: SupportedLocale = "en"): Promise<AboutData> {
  const res = await axiosClient.get<AboutData>("/api/v1/about", {
    params: { locale },
  });
  return res.data;
}
