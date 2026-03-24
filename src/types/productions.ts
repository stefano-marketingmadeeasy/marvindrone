export type ProductionCategory = {
  id?: number | string;
  name: string;
  slug: string;
  order?: number;
  locale?: string;
};

export type ProductionAsset = {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  mime?: string;
};

export type ProductionCompany = {
  id?: number | string;
  name: string;
  slug: string;
  logo?: ProductionAsset;
  order?: number;
  locale?: string;
};

export type ProductionLocalization = {
  locale: string;
  slug: string;
  categorySlug: string;
};

export type ProductionFact = {
  label: string;
  value: string;
};

export type ProductionCreditGroup = {
  label: string;
  values: string[];
};

export type ProductionLink = {
  label: string;
  url: string;
};

export type ProductionSeo = {
  metaTitle?: string;
  metaDescription?: string;
  altText?: string;
  caption?: string;
  image?: ProductionAsset;
};

export type Production = {
  id: number | string;
  locale?: string;
  title: string;
  slug: string;
  category: ProductionCategory;
  localizations?: ProductionLocalization[];
  excerpt?: string;
  description?: string;
  synopsis?: string;
  body?: string;
  releaseDate?: string;
  year?: string;
  duration?: string;
  status?: string;
  genre?: string;
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  director?: string;
  directorOfPhotography?: string;
  productionCompany?: string;
  productionCompanyEntry?: ProductionCompany;
  shootingTypes: string[];
  equipmentDescription?: string;
  equipmentUsed: string[];
  broadcaster?: string;
  heroImage?: ProductionAsset;
  poster?: ProductionAsset;
  gallery: ProductionAsset[];
  backstageImages: ProductionAsset[];
  credits: ProductionCreditGroup[];
  cast: string[];
  tags: string[];
  awards: string[];
  facts: ProductionFact[];
  externalLinks: ProductionLink[];
  trailerUrl?: string;
  videoUrl?: string;
  seo: ProductionSeo;
};
