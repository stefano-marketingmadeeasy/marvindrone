export interface ProductionsArchiveContent {
  title: string;
  allLabel: string;
  emptyLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyFilterLabel: string;
  emptyFilterTitle: string;
  emptyFilterDescription: string;
}

export interface ProductionsCardContent {
  open: string;
  noImage: string;
}

export interface ProductionsPageContent {
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  hero: {
    title: string;
    imageAlt: string;
  };
  subhero: {
    paragraphs: string[];
    ctaLabel: string;
    ctaMessage: string;
  };
  archive: ProductionsArchiveContent;
  editorial: {
    title: string;
    body: string;
  };
  realArchive: {
    title: string;
    body: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  operations: {
    title: string;
    body: string;
  };
  card: ProductionsCardContent;
}
