"use client";

import Link from "next/link";
import { TopHeader } from "@/components/layout/TopHeader";
import { Footer } from "@/components/layout/Footer";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ArrowUpRight, Mail } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";
import { useAboutQuery } from "@/services/about";

export const AboutScreen = () => {
  const {
    locale,
    site,
    isLoading: isSiteLoading,
    isError: isSiteError,
    retry: retrySite,
  } = useSite();
  const {
    data: about,
    isLoading: isAboutLoading,
    isError: isAboutError,
    refetch: refetchAbout,
  } = useAboutQuery(locale);

  if (isSiteError || isAboutError) {
    return (
      <NetworkErrorView
        onRetry={() => {
          retrySite();
          void refetchAbout();
        }}
      />
    );
  }

  if (isSiteLoading || isAboutLoading || !site || !about) {
    return <PageSkeleton />;
  }

  const cvUrl = about.header.cvUrl || site.meta.cvUrl || "/CV-of-Abdullah-Al-Maksud.pdf";

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-black">
      <div>
        <TopHeader />

        <div className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-neutral-600 uppercase transition-colors hover:text-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{site.nav.backToHome}</span>
            </Link>
            <span className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
              {about.header.badge}
            </span>
          </div>
        </div>

        {/* About Hero */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-4 lg:col-span-6">
              <h1 className="font-sans text-3xl leading-[1.02] font-extrabold tracking-tight text-black uppercase sm:text-5xl">
                {about.header.name || site.identity.name}
              </h1>

              <p className="font-mono text-xs tracking-wider text-neutral-600 uppercase">
                {about.header.role || site.identity.role}
              </p>

              {about.header.headline && (
                <p className="font-editorial-body text-lg font-medium text-black">
                  {about.header.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="default"
                    className="flex items-center gap-2 font-mono text-xs uppercase"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{site.contact.cvButtonLabel}</span>
                  </Button>
                </a>

                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 font-mono text-xs uppercase"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{site.nav.contact}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-6">
              <p className="font-editorial-body border-l-2 border-black pl-5 text-base leading-relaxed text-neutral-800 sm:text-lg">
                {about.header.intro}
              </p>
              {about.header.bioSecondary && (
                <p className="font-editorial-body text-sm leading-relaxed text-neutral-700 sm:text-base">
                  {about.header.bioSecondary}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Core Disciplines */}
        {about.pillars && about.pillars.length > 0 && (
          <section className="border-b border-neutral-200">
            <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
                {about.pillars.map((pillar, idx) => (
                  <div
                    key={pillar.id || idx}
                    className="space-y-3 border-t border-neutral-200 pt-5"
                  >
                    <div className="font-mono text-[11px] font-medium tracking-widest text-neutral-500 uppercase">
                      {pillar.tag}
                    </div>
                    <h2 className="font-sans text-lg font-bold text-black">{pillar.title}</h2>
                    {pillar.subtitle && (
                      <div className="font-mono text-xs text-neutral-500">{pillar.subtitle}</div>
                    )}
                    <p className="font-editorial-body text-sm leading-relaxed text-neutral-700">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Core Principles */}
        {about.principles && about.principles.length > 0 && (
          <section>
            <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-[11px] font-medium tracking-widest text-neutral-500 uppercase">
                  {site.advisory.category}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8">
                {about.principles.map((pr, idx) => (
                  <div
                    key={pr.number || idx}
                    className="space-y-2 border-t border-neutral-200 pt-4"
                  >
                    <div className="font-mono text-xs text-neutral-400">{pr.number}</div>
                    <h3 className="font-sans text-sm font-bold text-black uppercase">{pr.title}</h3>
                    <p className="font-editorial-body text-xs leading-relaxed text-neutral-700 sm:text-sm">
                      {pr.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer
        copyright={site.footer.copyright}
        rights={site.footer.rights}
        socials={site.footer.socials}
      />
    </div>
  );
};
