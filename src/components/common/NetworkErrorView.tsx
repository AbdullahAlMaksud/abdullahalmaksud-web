"use client";

import React from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";

interface NetworkErrorViewProps {
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({
  onRetry,
  title,
  description,
}) => {
  const { locale, setLocale, site, retry } = useSite();

  const fallbackCopy =
    locale === "bn"
      ? {
          eyebrow: "নেটওয়ার্ক / সার্ভার এরর",
          title: "সার্ভারের সাথে সংযোগ করা যাচ্ছে না",
          description:
            "এই মুহূর্তে সার্ভার থেকে পোর্টফোলিও তথ্য লোড করা সম্ভব হচ্ছে না। দয়া করে ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
          retry: "আবার চেষ্টা করুন",
        }
      : {
          eyebrow: "Network / Server Error",
          title: "Unable to Connect to Server",
          description:
            "Live portfolio data could not be loaded right now. Please check your connection or try again shortly.",
          retry: "Try Again",
        };

  const resolvedTitle = title || site?.ui?.errorTitle || fallbackCopy.title;
  const resolvedDescription = description || site?.ui?.errorDescription || fallbackCopy.description;
  const resolvedRetry = site?.ui?.retryButton || fallbackCopy.retry;

  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-white px-6 py-8 text-black">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between border-b border-neutral-200 pb-4">
        <span className="font-mono text-xs font-medium tracking-widest text-neutral-500 uppercase">
          {site?.meta?.siteName || "Abdullah Al Maksud"}
        </span>
        <div className="flex items-center gap-2 font-mono text-xs">
          {(["en", "bn"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              className={`cursor-pointer px-2 py-0.5 transition-colors ${
                locale === loc ? "bg-black text-white" : "text-neutral-500 hover:text-black"
              }`}
            >
              {loc === "en" ? "EN" : "বাংলা"}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto my-auto flex w-full max-w-xl flex-col items-start space-y-6 py-16">
        <div className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-neutral-500 uppercase">
          <WifiOff className="h-4 w-4 text-black" />
          <span>{fallbackCopy.eyebrow}</span>
        </div>

        <h1 className="font-sans text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {resolvedTitle}
        </h1>

        <p className="font-editorial-body text-base leading-relaxed text-neutral-600 sm:text-lg">
          {resolvedDescription}
        </p>

        <button
          type="button"
          onClick={onRetry || retry}
          className="inline-flex cursor-pointer items-center gap-2 border border-black bg-black px-5 py-2.5 font-mono text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-neutral-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{resolvedRetry}</span>
        </button>
      </section>

      <div className="mx-auto w-full max-w-5xl border-t border-neutral-200 pt-4 font-mono text-[11px] text-neutral-400">
        {site?.footer?.copyright || "© Abdullah Al Maksud"}
      </div>
    </main>
  );
};
