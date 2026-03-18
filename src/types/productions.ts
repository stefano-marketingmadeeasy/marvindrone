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
  width?: number;
  height?: number;
  mime?: string;
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
};

export type Production = {
  id: number | string;
  title: string;
  slug: string;
  category: ProductionCategory;
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
  productionCompany?: string;
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
