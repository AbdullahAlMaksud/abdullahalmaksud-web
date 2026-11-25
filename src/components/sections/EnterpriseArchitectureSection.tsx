"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RevealBlock, ParallaxBox } from "@/components/motion/ScrollReveal";
import type { EnterpriseProject } from "@/types/portfolio";
import type { ModalArticleData } from "@/components/interactive/ArticleModal";

interface EnterpriseArchitectureSectionProps {
  category: string;
  title: string;
  statement?: string;
  ctaLabel?: string;
  modalCategoryLabel?: string;
  projects: EnterpriseProject[];
  onSelectProject: (data: ModalArticleData) => void;
}

export const EnterpriseArchitectureSection: React.FC<EnterpriseArchitectureSectionProps> = ({
  category,
  title,
  statement,
  ctaLabel = "View All Works",
  modalCategoryLabel = "Case Study",
  projects,
  onSelectProject,
}) => {
  if (projects.length === 0) return null;

  const [lead, ...rest] = projects;

  return (
    <div id="work" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      {/* Fluid Editorial Header */}
      <RevealBlock className="mb-12 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
        <div className="space-y-2 md:col-span-5">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
            <span className="inline-block h-px w-5 bg-neutral-400" />
            <span>{category}</span>
          </div>
          <h2 className="font-display text-3xl leading-[1.05] font-bold tracking-tight text-[#111] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>

        <div className="md:col-span-4 md:border-l md:border-neutral-300 md:pl-6">
          {statement && (
            <p className="font-editorial-body text-sm leading-relaxed text-neutral-600 sm:text-base">
              {statement}
            </p>
          )}
        </div>

        <div className="flex md:col-span-3 md:justify-end">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#111] uppercase"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </RevealBlock>

      {/* Zigzag Asymmetric Case Study Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Lead Dark Architectural Feature Card */}
        {lead && (
          <RevealBlock className="lg:col-span-7" delay={0.05}>
            <motion.button
              type="button"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              onClick={() =>
                onSelectProject({
                  tag: lead.tag,
                  title: lead.title,
                  category: modalCategoryLabel,
                  description: lead.description,
                  fullContent: lead.fullContent,
                  techStack: lead.techStack,
                  metrics: lead.metrics,
                })
              }
              className="group flex w-full cursor-pointer flex-col justify-between space-y-8 bg-[#111] p-8 text-left text-white shadow-sm sm:p-10"
            >
              <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                <span>{lead.tag}</span>
                <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {lead.title}
                </h3>
                <p className="font-editorial-body text-sm leading-relaxed text-neutral-300 sm:text-base">
                  {lead.description}
                </p>
              </div>

              {lead.techStack && lead.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {lead.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="border border-white/15 px-2.5 py-0.5 font-mono text-[10px] text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          </RevealBlock>
        )}

        {/* Offset Right Column Cards (Staggered Downward) */}
        {rest.length > 0 && (
          <ParallaxBox offset={14} className="space-y-6 lg:col-span-5 lg:pt-12">
            {rest.map((project, idx) => (
              <RevealBlock key={project.id} delay={0.12 + idx * 0.08}>
                <motion.button
                  type="button"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  onClick={() =>
                    onSelectProject({
                      tag: project.tag,
                      title: project.title,
                      category: modalCategoryLabel,
                      description: project.description,
                      fullContent: project.fullContent,
                      techStack: project.techStack,
                      metrics: project.metrics,
                    })
                  }
                  className="group flex w-full cursor-pointer flex-col justify-between space-y-4 bg-white p-7 text-left shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                    <span>{project.tag}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#111]" />
                  </div>

                  <h3 className="font-display text-xl font-bold tracking-tight text-[#111] sm:text-2xl">
                    {project.title}
                  </h3>

                  <p className="font-editorial-body line-clamp-3 text-sm leading-relaxed text-neutral-600">
                    {project.description}
                  </p>
                </motion.button>
              </RevealBlock>
            ))}
          </ParallaxBox>
        )}
      </div>
    </div>
  );
};
