"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSiteQuery } from "@/services/site";
import type { SiteLocaleData, SupportedLocale } from "@/types/site";

interface SiteContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  site: SiteLocaleData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  retry: () => void;
}

const SiteContext = createContext<SiteContextValue>({
  locale: "en",
  setLocale: () => {},
  site: null,
  isLoading: true,
  isError: false,
  error: null,
  retry: () => {},
});

const LOCALE_STORAGE_KEY = "aam_web_locale";

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === "bn" || saved === "en") {
        setLocaleState(saved);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const { data, isLoading, isError, error, refetch } = useSiteQuery(locale);
  const site = data?.data || null;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      if (window.location.pathname === "/" && site?.meta?.defaultTitle) {
        document.title = site.meta.defaultTitle;
      }
    }
  }, [locale, site]);

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <SiteContext.Provider
      value={{
        locale,
        setLocale,
        site,
        isLoading,
        isError,
        error: error ?? null,
        retry,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export function useSite() {
  return useContext(SiteContext);
}
