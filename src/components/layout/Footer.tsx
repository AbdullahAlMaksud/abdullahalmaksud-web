import React, { FC } from "react";
import Link from "next/link";
import { AAMonogram } from "@/components/layout/TopHeader";
import { SocialLink } from "@/types/portfolio";

interface FooterProps {
  copyright: string;
  rights: string;
  socials: SocialLink[];
}

export const Footer: FC<FooterProps> = ({ copyright, rights, socials }) => {
  return (
    <footer id="contact" className="w-full bg-[#F7F7F5]">
      <div className="mx-auto max-w-6xl border-t border-neutral-200/80 px-5 py-8 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <AAMonogram className="h-5 w-7 text-[#111]" />
            <span className="font-sans text-xs font-medium text-neutral-700">{copyright}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((social) =>
              social.isExternal ? (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-wider text-neutral-600 uppercase transition-colors hover:text-[#111]"
                >
                  {social.label}
                </a>
              ) : (
                <Link
                  key={social.label}
                  href={social.url}
                  className="font-mono text-[11px] tracking-wider text-neutral-600 uppercase transition-colors hover:text-[#111]"
                >
                  {social.label}
                </Link>
              )
            )}
            <span className="hidden h-4 w-px bg-neutral-300 sm:inline-block" />
            <span className="font-mono text-[11px] tracking-wider text-neutral-500">{rights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
