"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const AAMonogram: React.FC<{ className?: string }> = ({ className = "h-7 w-7" }) => (
  <svg
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 25L12.5 3L21 25M7.2 17.5H17.8"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
    />
    <path
      d="M19 25L27.5 3L36 25M22.2 17.5H32.8"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
    />
  </svg>
);

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const { locale, setLocale, site } = useSite();

  const nav = site?.nav;
  const siteName = site?.meta?.siteName || "Abdullah Al Maksud";
  const cvUrl = site?.meta?.cvUrl || "/CV-of-Abdullah-Al-Maksud.pdf";

  const links = [
    { href: "/", label: nav?.home || "Home" },
    { href: "/about", label: nav?.about || "About" },
    { href: "/#work", label: nav?.work || "Works" },
    { href: "/blog", label: nav?.blog || "Blog" },
    { href: "/#books", label: nav?.books || "Books" },
    { href: "/contact", label: nav?.contact || "Contact" },
  ];

  return (
    <header className="w-full bg-[#F7F7F5]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href="/"
          aria-label={siteName}
          className="inline-flex items-center gap-2 text-[#111] transition-opacity hover:opacity-70"
        >
          <AAMonogram className="h-6 w-9" />
        </Link>

        {/* Desktop Minimal Flat Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-6 font-mono text-[11px] font-medium tracking-[0.18em] uppercase"
          >
            {links.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : !item.href.startsWith("/#") &&
                    (pathname === item.href || pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-1 transition-colors ${
                    isActive
                      ? "border-b border-[#111] font-semibold text-[#111]"
                      : "text-neutral-500 hover:text-[#111]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center border-l border-neutral-300 pl-4 font-mono text-[11px]">
            {(["en", "bn"] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={`cursor-pointer px-2 py-0.5 transition-colors ${
                  locale === loc
                    ? "bg-[#111] font-semibold text-white"
                    : "text-neutral-500 hover:text-[#111]"
                }`}
              >
                {loc === "en" ? "EN" : "বাংলা"}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center font-mono text-[11px]">
            {(["en", "bn"] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={`cursor-pointer px-2 py-0.5 transition-colors ${
                  locale === loc
                    ? "bg-[#111] font-semibold text-white"
                    : "text-neutral-500 hover:text-[#111]"
                }`}
              >
                {loc === "en" ? "EN" : "বাংলা"}
              </button>
            ))}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open Navigation Menu"
                className="flex cursor-pointer items-center justify-center p-1.5 text-[#111] transition-opacity hover:opacity-70"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col justify-between bg-white p-6">
              <SheetHeader className="border-b border-neutral-200 pb-4 text-left">
                <SheetTitle className="font-mono text-xs font-semibold tracking-widest uppercase">
                  {siteName}
                </SheetTitle>
                <SheetDescription className="sr-only">Navigation</SheetDescription>
              </SheetHeader>

              <nav className="flex flex-1 flex-col gap-1 py-6 font-mono text-xs tracking-wider uppercase">
                {links.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between border-b border-neutral-100 py-3 text-black"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400" />
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#111] py-3 font-mono text-xs font-medium tracking-wider text-white uppercase"
              >
                <span>{nav?.downloadCv || "Resume"}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
