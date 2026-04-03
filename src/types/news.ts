export type NewsCategory = {
  id?: number | string;
  name: string;
  slug: string;
  order?: number;
  locale?: string;
};

export type NewsAsset = {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  mime?: string;
};

export type NewsLocalization = {
  locale: string;
  slug: string;
};

export type NewsSeo = {
  metaTitle?: string;
  metaDescription?: string;
  altText?: string;
  caption?: string;
  image?: NewsAsset;
  keywords?: string[];
  metaRobots?: string;
  metaViewport?: string;
  canonicalUrl?: string;
  structuredData?: unknown;
  openGraph?: {
    title?: string;
    description?: string;
    image?: NewsAsset;
    url?: string;
    type?: string;
  };
};

export type NewsArticle = {
  id: number | string;
  locale?: string;
  title: string;
  slug: string;
  category: NewsCategory;
  localizations?: NewsLocalization[];
  excerpt?: string;
  body?: string;
  publishedAt?: string;
  featured?: boolean;
  heroImage?: NewsAsset;
  gallery: NewsAsset[];
  seo: NewsSeo;
};
