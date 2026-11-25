"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy } from "lucide-react";
import { RevealBlock, ParallaxBox } from "@/components/motion/ScrollReveal";
import type { SiteLocaleData } from "@/types/site";

interface StrategicAdvisorySectionProps {
  advisory: SiteLocaleData["advisory"];
  email: string;
  onOpenBriefModal?: () => void;
}

export const AboutFlowBlock: React.FC<{
  advisory: SiteLocaleData["advisory"];
  learnMoreLabel: string;
}> = ({ advisory, learnMoreLabel }) => {
  const mosaicShades = [
    "bg-neutral-200/70",
    "bg-transparent",
    "bg-neutral-300/60",
    "bg-neutral-200/40",
    "bg-neutral-300/80",
    "bg-neutral-200/50",
    "bg-transparent",
    "bg-neutral-200/70",
    "bg-transparent",
    "bg-neutral-200/60",
    "bg-neutral-300/75",
    "bg-neutral-200/40",
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Left: Large Display Headline + Learn More */}
        <RevealBlock className="space-y-5 lg:col-span-5">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
            <span className="inline-block h-px w-5 bg-neutral-400" />
            <span>{advisory.category}</span>
          </div>

          <h2 className="font-display text-3xl leading-[1.06] font-bold tracking-tight text-[#111] sm:text-4xl lg:text-[42px]">
            {advisory.headline}
          </h2>

          <p className="font-editorial-body text-base leading-relaxed text-neutral-700">
            {advisory.statement}
          </p>

          <div className="pt-1">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2.5 bg-[#111] px-5 py-3 font-mono text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-neutral-800"
            >
              <span>{learnMoreLabel}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealBlock>

        {/* Center: Poetic Short Pillars with Hairline Left Rule */}
        <RevealBlock
          delay={0.1}
          className="space-y-4 border-neutral-300 lg:col-span-4 lg:border-l lg:pl-8"
        >
          {advisory.pillars.slice(0, 3).map((pillar) => (
            <div key={pillar.number} className="space-y-0.5">
              <div className="font-sans text-sm font-semibold text-[#111]">{pillar.title}</div>
              <p className="font-editorial-body text-xs leading-relaxed text-neutral-600 sm:text-sm">
                {pillar.description}
              </p>
            </div>
          ))}
        </RevealBlock>

        {/* Right: Subtle Animated Monochrome Mosaic Grid */}
        <ParallaxBox offset={16} className="hidden justify-end lg:col-span-3 lg:flex">
          <div className="grid w-44 grid-cols-3 gap-1.5" aria-hidden="true">
            {mosaicShades.map((shade, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0.4, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className={`aspect-square ${shade}`}
              />
            ))}
          </div>
        </ParallaxBox>
      </div>
    </div>
  );
};

export const StrategicAdvisorySection: React.FC<StrategicAdvisorySectionProps> = ({
  advisory,
  email,
  onOpenBriefModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="advisory" className="mx-auto max-w-6xl px-5 pt-8 pb-20 sm:px-8 sm:pb-24">
      <RevealBlock className="grid grid-cols-1 items-center gap-8 bg-[#111] p-8 text-white sm:p-12 md:grid-cols-12">
        <div className="space-y-3 md:col-span-7">
          <div className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            {advisory.ctaEyebrow} · {advisory.availability}
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {advisory.ctaTitle}
          </h2>
          <p className="font-editorial-body max-w-lg text-sm leading-relaxed text-neutral-300 sm:text-base">
            {advisory.statement}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
          <button
            type="button"
            onClick={onOpenBriefModal}
            className="group inline-flex cursor-pointer items-center gap-2 bg-white px-5 py-3 font-mono text-xs font-semibold tracking-wider text-[#111] uppercase transition-colors hover:bg-neutral-200"
          >
            <span>{advisory.primaryCta}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex cursor-pointer items-center gap-2 border border-white/25 px-4 py-3 font-mono text-xs font-medium tracking-wider text-white uppercase transition-colors hover:border-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? advisory.emailCopiedCta : advisory.copyEmailCta}</span>
          </button>
        </div>
      </RevealBlock>
    </div>
  );
};
