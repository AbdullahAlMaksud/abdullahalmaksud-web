"use client";

import { useState } from "react";
import Link from "next/link";
import { TopHeader } from "@/components/layout/TopHeader";
import { Footer } from "@/components/layout/Footer";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { ArrowLeft, Mail, Copy, Check, Download, Calendar, Clock } from "lucide-react";
import { ContactForm } from "@/screens/contact/ContactForm";
import { useSite } from "@/contexts/SiteContext";

export const ContactScreen = () => {
  const { site, isLoading, isError, retry } = useSite();
  const [copied, setCopied] = useState(false);

  if (isError) {
    return <NetworkErrorView onRetry={retry} />;
  }

  if (isLoading || !site) {
    return <PageSkeleton />;
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(site.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cvUrl = site.meta.cvUrl || "/CV-of-Abdullah-Al-Maksud.pdf";

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
              {site.contact.badge}
            </span>
          </div>
        </div>

        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-8 lg:col-span-5">
              <div className="space-y-3">
                <h1 className="font-sans text-3xl leading-[1.05] font-extrabold tracking-tight text-black uppercase sm:text-4xl">
                  {site.contact.headline}
                </h1>

                <p className="font-editorial-body pt-1 text-base leading-relaxed text-neutral-700">
                  {site.contact.intro}
                </p>
              </div>

              <div className="space-y-4 border-t border-neutral-200 pt-5">
                <div className="flex items-start space-x-3">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-black" />
                  <div>
                    <div className="font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                      {site.contact.responseTimeLabel}
                    </div>
                    <div className="font-sans text-sm font-semibold text-black">
                      {site.contact.responseTimeValue}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="mt-1 h-4 w-4 shrink-0 text-black" />
                  <div>
                    <div className="font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                      {site.contact.availabilityLabel}
                    </div>
                    <div className="font-sans text-sm font-semibold text-black">
                      {site.contact.availabilityValue}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-black" />
                  <div className="space-y-1">
                    <div className="font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                      {site.contact.emailLabel}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-black">
                        {site.contact.email}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="flex cursor-pointer items-center gap-1 border border-neutral-300 px-2 py-0.5 font-mono text-[10px] uppercase hover:border-black"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? site.contact.copiedLabel : site.contact.copyLabel}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-black px-4 py-2 font-mono text-xs font-bold text-black uppercase transition-colors hover:bg-black hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{site.contact.cvButtonLabel}</span>
                </a>
              </div>
            </div>

            <div className="border border-neutral-200 p-6 sm:p-8 lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>

      <Footer
        copyright={site.footer.copyright}
        rights={site.footer.rights}
        socials={site.footer.socials}
      />
    </div>
  );
};
