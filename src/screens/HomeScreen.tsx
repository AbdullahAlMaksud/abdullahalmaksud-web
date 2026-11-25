"use client";

import { useState, useMemo } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { HeroIdentity } from "@/components/hero/HeroIdentity";
import { EnterpriseArchitectureSection } from "@/components/sections/EnterpriseArchitectureSection";
import {
  LiteratureEssaysSection,
  type BookCoverItem,
} from "@/components/sections/LiteratureEssaysSection";
import { DesignSystemsSection } from "@/components/sections/DesignSystemsSection";
import {
  AboutFlowBlock,
  StrategicAdvisorySection,
} from "@/components/sections/StrategicAdvisorySection";
import { Footer } from "@/components/layout/Footer";
import { ArticleModal, ModalArticleData } from "@/components/interactive/ArticleModal";
import { ContactEmailModal } from "@/components/interactive/ContactEmailModal";
import { NetworkErrorView } from "@/components/common/NetworkErrorView";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { useSite } from "@/contexts/SiteContext";
import { useCaseStudiesQuery } from "@/services/case-study";
import { useBlogsQuery } from "@/services/blog";
import { useProjectsQuery, type Project } from "@/services/project";
import { useBookBundleQuery, useBooksQuery } from "@/services/book";
import type { EnterpriseProject, EssayPublication, DesignSystemModule } from "@/types/portfolio";

export const HomeScreen = () => {
  const { site, isLoading: isSiteLoading, isError: isSiteError, retry: retrySite } = useSite();

  const [selectedArticle, setSelectedArticle] = useState<ModalArticleData | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  const {
    data: caseStudiesRes,
    isLoading: isCaseStudiesLoading,
    isError: isCaseStudiesError,
    refetch: refetchCaseStudies,
  } = useCaseStudiesQuery({
    published: true,
    limit: 3,
    includeContent: true,
  });

  const {
    data: blogsRes,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    refetch: refetchBlogs,
  } = useBlogsQuery({
    published: true,
    featured: true,
    limit: 4,
    includeContent: true,
  });

  const {
    data: projectsRes,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useProjectsQuery({
    featured: true,
    limit: 3,
  });

  const {
    data: bookBundleRes,
    isLoading: isBookBundleLoading,
    isError: isBookBundleError,
    refetch: refetchBookBundle,
  } = useBookBundleQuery();

  const {
    data: booksRes,
    isLoading: isBooksLoading,
    isError: isBooksError,
    refetch: refetchBooks,
  } = useBooksQuery();

  const dynamicCaseStudies = useMemo<EnterpriseProject[]>(() => {
    const apiList = caseStudiesRes?.data;
    if (!apiList || apiList.length === 0) return [];
    return apiList.map((cs, idx) => ({
      id: cs.slug || cs.id || `case-study-${idx}`,
      slug: cs.slug,
      tag: `0${idx + 1} / ${cs.category?.toUpperCase() || "CASE STUDY"}`,
      title: cs.title,
      description: cs.excerpt || cs.challenge || "",
      techStack: cs.stack || [],
      metrics: cs.results?.map((r) => `${r.metric}: ${r.value}`) || [],
      fullContent: cs.content || cs.solution || "",
      content: cs.content,
    }));
  }, [caseStudiesRes]);

  const dynamicBlogs = useMemo<EssayPublication[]>(() => {
    const apiList = blogsRes?.data;
    if (!apiList || apiList.length === 0) return [];
    return apiList.map((blog, idx) => ({
      id: blog.slug || blog.id || `blog-${idx}`,
      slug: blog.slug,
      tag: (blog.type || blog.category || "ESSAY").toUpperCase(),
      title: blog.title,
      description: blog.excerpt || "",
      fullContent: blog.content || "",
      content: blog.content,
      date: blog.date || (blog as unknown as { publishedAt?: string }).publishedAt || "",
      readTime: blog.readTime || (blog as unknown as { readingTime?: string }).readingTime || "",
      isFullWidth: idx >= 2,
    }));
  }, [blogsRes]);

  const dynamicProjects = useMemo<DesignSystemModule[]>(() => {
    const rawList = projectsRes?.data;
    const apiList = Array.isArray(rawList)
      ? rawList
      : Array.isArray((rawList as unknown as { items?: Project[] })?.items)
        ? (rawList as unknown as { items: Project[] }).items
        : [];

    if (!apiList || apiList.length === 0) return [];

    return (apiList as Project[]).map((proj: Project, idx: number) => ({
      id: proj.slug || proj.id || `project-${idx}`,
      tag: proj.category?.toUpperCase() || (proj.status ? proj.status.toUpperCase() : "PROJECT"),
      title: proj.title,
      description: proj.description || proj.longDescription || "",
      type: "article",
      isInteractive: false,
      details: {
        overview:
          typeof proj.fullContent === "string"
            ? proj.fullContent
            : proj.longDescription || proj.description || "",
        keyPoints: [
          ...(proj.stack || proj.tags || []),
          ...(proj.coreFeatures?.map(
            (f: { text: string; desc: string }) => `${f.text}: ${f.desc}`
          ) || []),
          proj.liveLink ? `Live: ${proj.liveLink}` : "",
          proj.github ? `GitHub: ${proj.github}` : "",
        ].filter(Boolean),
      },
    }));
  }, [projectsRes]);

  const dynamicBooks = useMemo<BookCoverItem[]>(() => {
    const map = new Map<string, BookCoverItem>();

    // Only include authored standalone books from /api/v1/books/all
    const standaloneList = booksRes?.data || [];
    for (const b of standaloneList) {
      if (!b.slug && !b.title) continue;
      const slug = b.slug || b.id || b.title;
      const isDefaultSlug = slug === "emon-jodi-hoto";
      const coverImage =
        b.coverImage === "/images/books/emon-jodi-hoto.webp" && isDefaultSlug
          ? "/images/image.png"
          : b.coverImage;
      const rawRecord = b as unknown as {
        description?: string;
        descriptionBn?: string;
        year?: number | string;
      };
      map.set(slug, {
        id: b.id || slug,
        slug,
        title: b.title,
        author: b.author,
        coverImage,
        description: b.synopsis || rawRecord.description || rawRecord.descriptionBn || "",
        publisher: b.publisher,
        year: b.publicationYear || (rawRecord.year ? String(rawRecord.year) : ""),
        category: b.category || b.genre,
      });
    }

    // Fallback to featured book from bundle only when /books/all returned nothing
    const bundle = bookBundleRes?.data;
    if (bundle?.book && map.size === 0) {
      const b = bundle.book;
      const rawCover = b.coverImage || b.cover;
      map.set("emon-jodi-hoto", {
        id: "featured-book",
        slug: "emon-jodi-hoto",
        title: b.title || b.titleBn || b.titleEn,
        author: b.author,
        coverImage:
          rawCover === "/images/books/emon-jodi-hoto.webp" ? "/images/image.png" : rawCover,
        description: b.description || b.descriptionBn || b.descriptionEn || "",
        publisher: b.publisher,
        year: b.year ? String(b.year) : "",
        category: b.category,
      });
    }

    return Array.from(map.values());
  }, [booksRes, bookBundleRes]);

  const hasError =
    isSiteError ||
    isCaseStudiesError ||
    isBlogsError ||
    isProjectsError ||
    isBookBundleError ||
    isBooksError;
  const isInitialLoading =
    isSiteLoading ||
    isCaseStudiesLoading ||
    isBlogsLoading ||
    isProjectsLoading ||
    isBookBundleLoading ||
    isBooksLoading;

  const handleRetryAll = () => {
    retrySite();
    void refetchCaseStudies();
    void refetchBlogs();
    void refetchProjects();
    void refetchBookBundle();
    void refetchBooks();
  };

  if (hasError) {
    return <NetworkErrorView onRetry={handleRetryAll} />;
  }

  if (isInitialLoading || !site) {
    return <PageSkeleton />;
  }

  const handleOpenArticle = (data: ModalArticleData) => {
    setSelectedArticle(data);
    setIsArticleModalOpen(true);
  };

  const handleCloseArticle = () => {
    setIsArticleModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F5] text-[#111]">
      <TopHeader />

      <main>
        {/* Seamless Hero + Anchored 3-Column Dark Discipline Bar */}
        <HeroIdentity
          name={site.identity.name}
          firstNameLine={site.identity.firstNameLine}
          lastNameLine={site.identity.lastNameLine}
          role={site.identity.role}
          subRole={site.identity.subRole}
          tagline={site.identity.tagline}
          portraitUrl={site.identity.portraitUrl || "/images/portrait.png"}
          primaryCtaLabel={site.advisory.primaryCta}
          cvUrl={site.meta.cvUrl || "/CV-of-Abdullah-Al-Maksud.pdf"}
          cvLabel={site.nav.downloadCv}
          disciplines={site.advisory.pillars}
        />

        {/* Flow Block A: About / Philosophy + Animated Monochrome Mosaic */}
        <AboutFlowBlock advisory={site.advisory} learnMoreLabel={site.nav.about} />

        {/* Flow Block B: Zigzag Asymmetric Case Studies */}
        <EnterpriseArchitectureSection
          category={site.sections.caseStudiesCategory}
          title={site.sections.caseStudiesTitle}
          statement={site.advisory.statement}
          ctaLabel={site.sections.viewAllWritings}
          modalCategoryLabel={site.sections.caseStudyModalLabel}
          projects={dynamicCaseStudies}
          onSelectProject={handleOpenArticle}
        />

        {/* Flow Block C: Staggered Split-Card Engineering Projects */}
        <DesignSystemsSection
          category={site.sections.projectsCategory}
          title={site.sections.projectsTitle}
          modalCategoryLabel={site.sections.projectModalLabel}
          modules={dynamicProjects}
          onSelectModule={handleOpenArticle}
        />

        {/* Flow Block D: Single Featured Book Card with Details & Dedicated-Route Blog Cards */}
        <LiteratureEssaysSection
          category={site.sections.writingsCategory}
          title={site.sections.writingsTitle}
          modalCategoryLabel={site.sections.writingModalLabel}
          bookLabel={site.sections.bookLabel}
          readBookDetailsLabel={site.sections.viewBookDetails}
          viewAllWritingsLabel={site.sections.viewAllWritings}
          books={dynamicBooks}
          items={dynamicBlogs}
        />

        {/* Flow Block E: Quiet Dialogue CTA */}
        <StrategicAdvisorySection
          advisory={site.advisory}
          email={site.contact.email}
          onOpenBriefModal={() => setIsContactModalOpen(true)}
        />
      </main>

      <Footer
        copyright={site.footer.copyright}
        rights={site.footer.rights}
        socials={site.footer.socials}
      />

      <ArticleModal
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={handleCloseArticle}
      />

      <ContactEmailModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};
