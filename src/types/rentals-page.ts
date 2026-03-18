export interface RentalsFaqItem {
  question: string;
  answer: string;
  featured?: boolean;
  active?: boolean;
}

export interface RentalsPageContent {
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  hero: {
    title: string;
    subtitle: string;
    imageAlt: string;
  };
  intro: {
    body: string;
    footnote: string;
  };
  catalog: {
    title: string;
  };
  archive: {
    brandLabel: string;
    brandPlaceholder: string;
    usageLabel: string;
    usagePlaceholder: string;
    resetFilters: string;
    emptyLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyFilterLabel: string;
    emptyFilterTitle: string;
    emptyFilterDescription: string;
  };
  conditions: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
    cta: string;
  };
  card: {
    cta: string;
    noImage: string;
    brandFallback: string;
    usageFallback: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: RentalsFaqItem[];
  };
}
