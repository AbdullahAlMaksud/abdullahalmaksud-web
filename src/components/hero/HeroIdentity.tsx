"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, Palette, PenTool } from "lucide-react";
import { ParallaxBox } from "@/components/motion/ScrollReveal";
import { resolveAssetUrl } from "@/lib/asset-url";
import type { SiteAdvisoryPillar } from "@/types/site";

interface HeroIdentityProps {
  name: string;
  firstNameLine: string;
  lastNameLine: string;
  role: string;
  subRole: string;
  tagline: string;
  portraitUrl?: string;
  primaryCtaLabel: string;
  cvUrl: string;
  cvLabel: string;
  disciplines?: SiteAdvisoryPillar[];
}

export const HeroIdentity: React.FC<HeroIdentityProps> = ({
  name,
  firstNameLine,
  lastNameLine,
  role,
  subRole,
  tagline,
  portraitUrl = "/images/portrait.png",
  primaryCtaLabel,
  cvUrl,
  cvLabel,
  disciplines = [],
}) => {
  const prefersReduced = useReducedMotion();
  const initialAnim = prefersReduced ? false : { opacity: 0, y: 20 };
  const disciplineIcons = [PenTool, Code2, Palette];

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F7F5]">
      <div className="mx-auto max-w-6xl px-5 pt-4 sm:px-8 sm:pt-8">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          {/* Left Editorial Masthead */}
          <motion.div
            initial={initialAnim}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 pb-10 lg:col-span-6 lg:pb-16"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
              <span className="inline-block h-px w-6 bg-neutral-400" />
              <span>{subRole}</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight text-[#111] sm:text-6xl lg:text-7xl">
                <span className="block">{firstNameLine}</span>
                <span className="block">{lastNameLine}</span>
              </h1>
              <p className="font-sans text-lg font-normal tracking-tight text-neutral-600 sm:text-xl">
                {role}
              </p>
            </div>

            <div className="h-px w-10 bg-neutral-300" />

            <p className="font-editorial-body max-w-md text-base leading-relaxed text-neutral-700 italic sm:text-lg">
              {tagline}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <a
                href="#work"
                className="group inline-flex items-center gap-2.5 bg-[#111] px-5 py-3 font-mono text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-neutral-800"
              >
                <span>{primaryCtaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-medium tracking-wider text-neutral-600 uppercase underline underline-offset-4 transition-colors hover:text-[#111]"
              >
                {cvLabel}
              </a>
            </div>
          </motion.div>

          {/* Right Seamless Portrait + Giant Background Monogram */}
          <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
            {/* Subtle Giant Display Monogram Watermark Behind Portrait */}
            <ParallaxBox
              offset={18}
              className="pointer-events-none absolute -top-6 right-0 z-0 select-none sm:right-4"
            >
              <span className="font-display text-[220px] leading-none font-bold text-neutral-200/80 sm:text-[310px] lg:text-[340px]">
                {name.trim().charAt(0).toUpperCase() || "A"}
              </span>
            </ParallaxBox>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 h-[360px] w-full max-w-[420px] sm:h-[430px] lg:h-[470px]"
            >
              <Image
                src={resolveAssetUrl(portraitUrl)}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-contain object-bottom contrast-110 grayscale"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Anchored 3-Column Dark Discipline Bar */}
      {disciplines.length > 0 && (
        <div className="relative z-20 w-full bg-[#111] text-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            {disciplines.slice(0, 3).map((item, idx) => {
              const Icon = disciplineIcons[idx % disciplineIcons.length];
              return (
                <motion.div
                  key={item.number || idx}
                  initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="flex flex-col items-center justify-center space-y-1.5 py-7 text-center"
                >
                  <Icon className="mb-1 h-5 w-5 text-neutral-300" strokeWidth={1.5} />
                  <div className="font-sans text-sm font-semibold tracking-wide text-white">
                    {item.title}
                  </div>
                  <div className="line-clamp-1 max-w-[240px] font-mono text-[10px] tracking-wider text-neutral-400">
                    {item.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
