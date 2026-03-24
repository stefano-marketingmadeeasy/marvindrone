export type RentalTaxonomy = {
  id?: number | string;
  name: string;
  slug: string;
  order?: number;
  locale?: string;
};

export type RentalAsset = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  mime?: string;
};

export type Rental = {
  id: number | string;
  model: string;
  brand: RentalTaxonomy;
  categories: RentalTaxonomy[];
  description?: string;
  image?: RentalAsset;
  order?: number;
  locale?: string;
};
