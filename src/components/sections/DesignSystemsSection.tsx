"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RevealBlock, ParallaxBox } from "@/components/motion/ScrollReveal";
import type { DesignSystemModule } from "@/types/portfolio";
import type { ModalArticleData } from "@/components/interactive/ArticleModal";

interface DesignSystemsSectionProps {
  category: string;
  title: string;
  modalCategoryLabel?: string;
  modules: DesignSystemModule[];
  onSelectModule: (data: ModalArticleData) => void;
}

export const DesignSystemsSection: React.FC<DesignSystemsSectionProps> = ({
  category,
  title,
  modalCategoryLabel = "Engineering Project",
  modules,
  onSelectModule,
}) => {
  if (modules.length === 0) return null;

  return (
    <div id="design" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Right Sticky Title Column (Zigzag balance against surrounding left-titled blocks) */}
        <div className="lg:sticky lg:top-24 lg:order-2 lg:col-span-4">
          <RevealBlock className="space-y-3 lg:text-right">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase lg:justify-end">
              <span className="inline-block h-px w-5 bg-neutral-400" />
              <span>{category}</span>
            </div>

            <h2 className="font-display text-3xl leading-[1.05] font-bold tracking-tight text-[#111] sm:text-4xl lg:text-5xl">
              {title}
            </h2>

            <div className="hidden h-px w-12 bg-neutral-300 lg:ml-auto lg:block" />
          </RevealBlock>
        </div>

        {/* Left Vertically Stacked Split Cards */}
        <ParallaxBox offset={10} className="space-y-4 lg:order-1 lg:col-span-8">
          {modules.map((item, idx) => {
            const isDarkPlate = idx % 2 === 1;

            return (
              <RevealBlock key={item.id} delay={idx * 0.08}>
                <motion.button
                  type="button"
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.25 }}
                  onClick={() =>
                    onSelectModule({
                      tag: item.tag,
                      title: item.title,
                      category: modalCategoryLabel,
                      description: item.description,
                      fullContent: item.details?.overview,
                      metrics: item.details?.keyPoints,
                    })
                  }
                  className="group grid w-full cursor-pointer grid-cols-12 overflow-hidden bg-white text-left shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)]"
                >
                  {/* Left Monochrome Typographic Plate */}
                  <div
                    className={`col-span-4 flex flex-col justify-between p-5 sm:col-span-3 ${
                      isDarkPlate ? "bg-[#111] text-white" : "bg-neutral-200/80 text-[#111]"
                    }`}
                  >
                    <span className="font-mono text-[10px] tracking-widest uppercase opacity-60">
                      0{idx + 1}
                    </span>
                    <div className="font-display text-3xl leading-none font-bold opacity-85 sm:text-4xl">
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate font-mono text-[9px] tracking-wider uppercase opacity-70">
                      {item.tag}
                    </span>
                  </div>

                  {/* Right Details */}
                  <div className="col-span-8 flex items-center justify-between gap-4 p-5 sm:col-span-9 sm:p-6">
                    <div className="space-y-1.5">
                      <h3 className="font-sans text-lg font-bold tracking-tight text-[#111]">
                        {item.title}
                      </h3>
                      <p className="font-editorial-body line-clamp-2 text-sm leading-relaxed text-neutral-600">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#111]" />
                  </div>
                </motion.button>
              </RevealBlock>
            );
          })}
        </ParallaxBox>
      </div>
    </div>
  );
};
