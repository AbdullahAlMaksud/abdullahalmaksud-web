export type SupportedLocale = "en" | "bn";

export interface SiteSocialLink {
  label: string;
  url: string;
  isExternal: boolean;
}

export interface SiteAdvisoryPillar {
  number: string;
  title: string;
  description: string;
}

export interface SiteLocaleData {
  id?: string;
  locale: SupportedLocale;
  meta: {
    siteName: string;
    defaultTitle: string;
    description: string;
    keywords: string;
    cvUrl: string;
  };
  nav: {
    home: string;
    about: string;
    work: string;
    blog: string;
    books: string;
    contact: string;
    downloadCv: string;
    backToHome: string;
    allWritings: string;
  };
  identity: {
    name: string;
    firstNameLine: string;
    lastNameLine: string;
    role: string;
    subRole: string;
    tagline: string;
    portraitUrl?: string;
  };
  metrics?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  marqueeItems?: string[];
  sections: {
    caseStudiesCategory: string;
    caseStudiesTitle: string;
    caseStudyModalLabel: string;
    projectsCategory: string;
    projectsTitle: string;
    projectModalLabel: string;
    writingsCategory: string;
    writingsTitle: string;
    writingModalLabel: string;
    bookLabel: string;
    viewBookDetails: string;
    viewAllWritings: string;
  };
  advisory: {
    badge: string;
    availability: string;
    category: string;
    headline: string;
    statement: string;
    pillars: SiteAdvisoryPillar[];
    ctaEyebrow: string;
    ctaTitle: string;
    primaryCta: string;
    copyEmailCta: string;
    emailCopiedCta: string;
  };
  contact: {
    badge: string;
    headline: string;
    intro: string;
    responseTimeLabel: string;
    responseTimeValue: string;
    availabilityLabel: string;
    availabilityValue: string;
    emailLabel: string;
    email: string;
    copyLabel: string;
    copiedLabel: string;
    cvButtonLabel: string;
    formTitle: string;
    formSubtitle: string;
    modalTitle: string;
    modalSubtitle: string;
    topicLabel: string;
    quickSubjects: string[];
    nameLabel: string;
    namePlaceholder: string;
    emailFieldLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    sendingButton: string;
    poweredBy: string;
    successTitle: string;
    successMessage: string;
    sendAnotherButton: string;
    closeButton: string;
  };
  footer: {
    copyright: string;
    rights: string;
    socials: SiteSocialLink[];
  };
  ui: {
    blogTitle: string;
    blogSubtitle: string;
    searchPlaceholder: string;
    sortLabel: string;
    sortNewest: string;
    sortOldest: string;
    sortReadTime: string;
    sortTitle: string;
    emptyBlogsTitle: string;
    emptyBlogsSubtitle: string;
    clearSearch: string;
    writtenByLabel: string;
    authorName: string;
    contactAuthor: string;
    bookSpecLabel: string;
    bookAuthorLabel: string;
    bookPublisherLabel: string;
    bookYearLabel: string;
    bookLanguageLabel: string;
    bookPagesLabel: string;
    bookIsbnLabel: string;
    bookSynopsisLabel: string;
    bookThemesLabel: string;
    bookQuotesLabel: string;
    bookChaptersLabel: string;
    bookAuthorNoteLabel: string;
    bookNotFoundTitle: string;
    bookNotFoundSubtitle: string;
    stackLabel: string;
    metricsLabel: string;
    errorTitle: string;
    errorDescription: string;
    retryButton: string;
  };
}

export interface AboutPillar {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  icon?: string;
  description: string;
  skills?: string[];
}

export interface AboutPrinciple {
  number: string;
  title: string;
  description: string;
}

export interface AboutData {
  locale?: SupportedLocale;
  header: {
    badge: string;
    name?: string;
    role?: string;
    headline: string;
    intro: string;
    bioSecondary?: string;
    signature?: string;
    experienceYears?: string;
    cvUrl?: string;
  };
  pillars: AboutPillar[];
  principles?: AboutPrinciple[];
}
