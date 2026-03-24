import { slugifyyy } from "@/lib/utils/textConverter";
import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import type {
  Production,
  ProductionAsset,
  ProductionCategory,
  ProductionCompany,
  ProductionLocalization,
  ProductionCreditGroup,
  ProductionFact,
  ProductionLink,
} from "@/types/productions";
import {
  getStrapiCollection,
  toStrapiAbsoluteUrl,
  unwrapStrapiArray,
  unwrapStrapiEntity,
} from "./client";

const PRODUCTIONS_ENDPOINT =
  import.meta.env.STRAPI_PRODUCTIONS_ENDPOINT?.trim() || "produzioni";
const PRODUCTION_COMPANIES_ENDPOINT =
  import.meta.env.STRAPI_PRODUCTION_COMPANIES_ENDPOINT?.trim() ||
  "case-produzione";

const pickFirstString = (source: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const pickFirstScalarAsString = (
  source: Record<string, any>,
  keys: string[],
) => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
};

const pickFirstArray = (source: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === "object") {
      const unwrappedArray = unwrapStrapiArray(value);
      if (unwrappedArray.length > 0) {
        return unwrappedArray;
      }
    }
  }

  return [] as any[];
};

const normalizeInteger = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const formatDateYear = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : String(date.getFullYear());
};

const normalizeTextList = (value: unknown): string[] => {
  if (!value) return [];

  if (typeof value === "string") {
    return value
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return item.trim() ? [item.trim()] : [];
    }

    const record = unwrapStrapiEntity<Record<string, any>>(item);
    const text = pickFirstString(record, [
      "name",
      "nome",
      "label",
      "title",
      "titolo",
      "value",
      "valore",
    ]);

    if (text) {
      return [text];
    }

    return normalizeTextList(record.values || record.list || record.items);
  });
};

const normalizeAsset = (value: unknown): ProductionAsset | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const url = toStrapiAbsoluteUrl(record.url);

  if (!url) return undefined;

  return {
    url,
    alt:
      pickFirstString(record, ["alternativeText", "alt", "caption", "name"]) ||
      "Produzione",
    caption: pickFirstString(record, ["caption", "name"]) || undefined,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
    mime: pickFirstString(record, ["mime"]),
  };
};

const normalizeGallery = (raw: Record<string, any>) =>
  pickFirstArray(raw, [
    "gallery",
    "galleria",
    "images",
    "immagini",
    "fotoBackstage",
  ])
    .map((item) => normalizeAsset(item))
    .filter(Boolean) as ProductionAsset[];

const normalizeCategory = (raw: Record<string, any>): ProductionCategory => {
  const categorySource =
    raw.tipologia_produzione ||
    raw.tipologiaProduzione ||
    raw.tipologia ||
    raw.category ||
    raw.categoria;

  if (typeof categorySource === "string") {
    return {
      name: categorySource,
      slug: slugifyyy(categorySource),
    };
  }

  const record = unwrapStrapiEntity<Record<string, any>>(categorySource);
  const name =
    pickFirstString(record, ["name", "nome", "label", "title", "titolo"]) ||
    "Produzioni";
  const slug =
    pickFirstString(record, ["slug"]) || slugifyyy(name) || "produzioni";

  return {
    id: record.id,
    name,
    slug,
    order: normalizeInteger(record.order),
    locale: pickFirstString(record, ["locale"]) || undefined,
  };
};

const normalizeProductionCompany = (
  value: unknown,
  fallback = "",
): ProductionCompany | undefined => {
  if (!value) {
    return fallback
      ? {
          name: fallback,
          slug: slugifyyy(fallback),
        }
      : undefined;
  }

  if (typeof value === "string") {
    const name = value.trim();
    if (!name) return undefined;

    return {
      name,
      slug: slugifyyy(name),
    };
  }

  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const name =
    pickFirstString(record, ["name", "nome", "title", "titolo", "label"]) ||
    fallback;

  if (!name) return undefined;

  return {
    id: record.id,
    name,
    slug: pickFirstString(record, ["slug"]) || slugifyyy(name),
    logo: normalizeAsset(record.logo),
    order: normalizeInteger(record.order || record.sortOrder),
    locale: pickFirstString(record, ["locale"]) || undefined,
  };
};

const normalizeProductionLocalization = (
  value: unknown,
): ProductionLocalization | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const locale = pickFirstString(record, ["locale"]);
  const title = pickFirstString(record, ["title", "titolo", "name", "nome"]);
  const slug = pickFirstString(record, ["slug"]) || (title ? slugifyyy(title) : "");

  if (!locale || !slug) return undefined;

  return {
    locale,
    slug,
    categorySlug: normalizeCategory(record).slug,
  };
};


const normalizeFacts = (raw: Record<string, any>) => {
  const customFacts = pickFirstArray(raw, [
    "facts",
    "informazioni",
    "information",
    "details",
  ])
    .map((item) => {
      const record = unwrapStrapiEntity<Record<string, any>>(item);
      const label = pickFirstString(record, [
        "label",
        "titolo",
        "title",
        "name",
        "nome",
      ]);
      const value =
        pickFirstString(record, ["value", "valore", "description", "testo"]) ||
        normalizeTextList(record.values || record.list).join(", ");

      if (!label || !value) return undefined;

      return { label, value };
    })
    .filter(Boolean) as ProductionFact[];

  const derivedFacts: ProductionFact[] = [];
  const year =
    pickFirstScalarAsString(raw, ["year", "anno"]) ||
    formatDateYear(
      pickFirstString(raw, ["releaseDate", "release_date", "dataUscita"]),
    );
  const duration = pickFirstString(raw, ["duration", "durata"]);
  const status = pickFirstString(raw, ["status", "stato"]);
  const genre = pickFirstString(raw, ["genre", "genere"]);
  const city = pickFirstString(raw, ["city", "citta"]);
  const region = pickFirstString(raw, ["region", "regione"]);
  const country = pickFirstString(raw, ["country", "paese"]);
  const location =
    pickFirstString(raw, ["location", "luogo", "ambientazione"]) ||
    [city, region, country].filter(Boolean).join(", ");
  const broadcaster = pickFirstString(raw, [
    "broadcaster",
    "network",
    "piattaforma",
    "distributor",
  ]);
  const director = pickFirstString(raw, ["Regista", "regista", "director"]);
  const directorOfPhotography = pickFirstString(raw, [
    "DirettoreFotografia",
    "direttoreFotografia",
    "directorOfPhotography",
  ]);
  const productionCompanyEntry = normalizeProductionCompany(
    raw.casaProduzione || raw.productionCompany,
  );
  const productionCompany =
    productionCompanyEntry?.name ||
    pickFirstString(raw, ["productionCompany", "casaProduzione"]);
  const shootingTypes = normalizeTextList(
    raw.shootingTypes || raw.tipologiaRiprese,
  );
  const equipmentUsed = normalizeTextList(
    raw.equipmentUsed || raw.attrezzaturaUtilizzata,
  );

  if (year) derivedFacts.push({ label: "Anno", value: year });
  if (duration) derivedFacts.push({ label: "Durata", value: duration });
  if (status) derivedFacts.push({ label: "Stato", value: status });
  if (genre) derivedFacts.push({ label: "Genere", value: genre });
  if (location) derivedFacts.push({ label: "Location", value: location });
  if (director) derivedFacts.push({ label: "Regista", value: director });
  if (directorOfPhotography) {
    derivedFacts.push({
      label: "Direttore della fotografia",
      value: directorOfPhotography,
    });
  }
  if (productionCompany) {
    derivedFacts.push({ label: "Casa di produzione", value: productionCompany });
  }
  if (shootingTypes.length > 0) {
    derivedFacts.push({
      label: "Tipologia riprese",
      value: shootingTypes.join(", "),
    });
  }
  if (equipmentUsed.length > 0) {
    derivedFacts.push({
      label: "Attrezzatura utilizzata",
      value: equipmentUsed.join(", "),
    });
  }
  if (broadcaster)
    derivedFacts.push({ label: "Distribuzione", value: broadcaster });

  const merged = [...derivedFacts, ...customFacts];
  const seen = new Set<string>();

  return merged.filter((fact) => {
    const key = `${fact.label}-${fact.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const normalizeCredits = (raw: Record<string, any>) =>
  pickFirstArray(raw, ["credits", "crediti"])
    .map((item) => {
      const record = unwrapStrapiEntity<Record<string, any>>(item);
      const label = pickFirstString(record, [
        "label",
        "title",
        "titolo",
        "name",
        "nome",
      ]);
      const values = normalizeTextList(
        record.values || record.list || record.items || record.people,
      );

      if (!label || values.length === 0) return undefined;

      return { label, values };
    })
    .filter(Boolean) as ProductionCreditGroup[];

const normalizeLinks = (raw: Record<string, any>) =>
  pickFirstArray(raw, ["externalLinks", "links", "linkEsterni"])
    .map((item) => {
      const record = unwrapStrapiEntity<Record<string, any>>(item);
      const url = pickFirstString(record, ["url", "href", "link"]);
      if (!url) return undefined;

      return {
        label:
          pickFirstString(record, ["label", "title", "titolo", "name"]) ||
          "Approfondisci",
        url,
      };
    })
    .filter(Boolean) as ProductionLink[];

const normalizeProduction = (
  entry: Record<string, any>,
): Production | undefined => {
  const raw = unwrapStrapiEntity<Record<string, any>>(entry);
  const title = pickFirstString(raw, ["title", "titolo", "name", "nome"]);

  if (!title) return undefined;

  const releaseDate = pickFirstString(raw, [
    "releaseDate",
    "release_date",
    "publishDate",
    "dataUscita",
  ]);
  const year =
    pickFirstScalarAsString(raw, ["year", "anno"]) ||
    formatDateYear(releaseDate);
  const description =
    pickFirstString(raw, [
      "descrizione",
      "description",
      "shortDescription",
      "descrizioneBreve",
      "overview",
    ]) || undefined;
  const heroImage = normalizeAsset(
    raw.heroImage ||
      raw.coverImage ||
      raw.cover ||
      raw.image ||
      raw.immagineHero ||
      raw.copertinaProduzione,
  );
  const poster =
    normalizeAsset(raw.poster || raw.locandina || raw.manifesto) || heroImage;
  const gallery = normalizeGallery(raw);
  const city = pickFirstString(raw, ["city", "citta"]) || undefined;
  const region = pickFirstString(raw, ["region", "regione"]) || undefined;
  const country = pickFirstString(raw, ["country", "paese"]) || undefined;
  const productionCompanyEntry = normalizeProductionCompany(
    raw.casaProduzione || raw.productionCompany,
  );
  const director =
    pickFirstString(raw, ["Regista", "regista", "director"]) || undefined;
  const directorOfPhotography =
    pickFirstString(raw, [
      "DirettoreFotografia",
      "direttoreFotografia",
      "directorOfPhotography",
    ]) || undefined;
  const productionCompany =
    productionCompanyEntry?.name ||
    pickFirstString(raw, ["productionCompany", "casaProduzione"]) ||
    undefined;
  const shootingTypes = normalizeTextList(
    raw.shootingTypes || raw.tipologiaRiprese,
  );
  const equipmentUsed = normalizeTextList(
    raw.equipmentUsed || raw.attrezzaturaUtilizzata,
  );
  const seoRecord = unwrapStrapiEntity<Record<string, any>>(raw.seo);
  const seoMetaTitle =
    pickFirstString(raw, ["MetaTitle", "metaTitle"]) ||
    pickFirstString(seoRecord, ["metaTitle", "title", "titolo"]) ||
    undefined;
  const seoMetaDescription =
    pickFirstString(raw, ["MetaDescription", "metaDescription"]) ||
    pickFirstString(seoRecord, [
      "metaDescription",
      "description",
      "descrizione",
    ]) ||
    undefined;
  const seoAltText =
    pickFirstString(raw, ["AltText", "altText"]) ||
    pickFirstString(seoRecord, ["altText", "alternativeText", "alt"]) ||
    heroImage?.alt ||
    undefined;
  const seoCaption =
    pickFirstString(raw, ["Caption", "caption"]) ||
    pickFirstString(seoRecord, ["caption"]) ||
    heroImage?.caption ||
    undefined;
  const seoImage = heroImage
    ? {
        ...heroImage,
        alt: seoAltText || heroImage.alt,
        caption: seoCaption || heroImage.caption,
      }
    : undefined;

  return {
    id: raw.id || title,
    locale: pickFirstString(raw, ["locale"]) || undefined,
    title,
    slug:
      pickFirstString(raw, ["slug"]) ||
      slugifyyy(title) ||
      `produzione-${raw.id}`,
    category: normalizeCategory(raw),
    localizations: pickFirstArray(raw, ["localizations"])
      .map((item) => normalizeProductionLocalization(item))
      .filter(Boolean) as ProductionLocalization[],
    excerpt: description,
    description,
    synopsis:
      pickFirstString(raw, ["synopsis", "sinossi", "plot", "trama"]) ||
      undefined,
    body:
      pickFirstString(raw, [
        "body",
        "content",
        "contenuto",
        "story",
        "scheda",
      ]) || undefined,
    releaseDate: releaseDate || undefined,
    year: year || undefined,
    duration: pickFirstString(raw, ["duration", "durata"]) || undefined,
    status: pickFirstString(raw, ["status", "stato"]) || undefined,
    genre: pickFirstString(raw, ["genre", "genere"]) || undefined,
    location:
      pickFirstString(raw, ["location", "luogo", "ambientazione"]) ||
      [city, region, country].filter(Boolean).join(", ") ||
      undefined,
    city,
    region,
    country,
    director,
    directorOfPhotography,
    productionCompany,
    productionCompanyEntry,
    shootingTypes,
    equipmentDescription:
      pickFirstString(raw, [
        "equipmentDescription",
        "descrizioneAttrezzatura",
      ]) || undefined,
    equipmentUsed,
    broadcaster:
      pickFirstString(raw, ["broadcaster", "network", "piattaforma"]) ||
      undefined,
    heroImage: heroImage || gallery[0],
    poster,
    gallery,
    backstageImages: gallery,
    credits: normalizeCredits(raw),
    cast: normalizeTextList(raw.cast || raw.casting || raw.interpreti),
    tags: normalizeTextList(raw.tags || raw.tag),
    awards: normalizeTextList(raw.awards || raw.riconoscimenti || raw.premi),
    facts: normalizeFacts(raw),
    externalLinks: normalizeLinks(raw),
    trailerUrl:
      pickFirstString(raw, ["trailerUrl", "trailer", "videoUrl", "video"]) ||
      undefined,
    videoUrl:
      pickFirstString(raw, ["videoUrl", "video", "trailerUrl", "trailer"]) ||
      undefined,
    seo: {
      metaTitle: seoMetaTitle,
      metaDescription: seoMetaDescription,
      altText: seoAltText,
      caption: seoCaption,
      image: seoImage,
    },
  };
};

const isProduction = (value: Production | undefined): value is Production =>
  Boolean(value);

const sortProductions = (
  left: Production,
  right: Production,
  locale = "it",
) => {
  const leftDate = left.releaseDate ? new Date(left.releaseDate).getTime() : 0;
  const rightDate = right.releaseDate
    ? new Date(right.releaseDate).getTime()
    : 0;

  if (rightDate !== leftDate) {
    return rightDate - leftDate;
  }

  const leftYear = Number(left.year || 0);
  const rightYear = Number(right.year || 0);

  if (rightYear !== leftYear) {
    return rightYear - leftYear;
  }

  return left.title.localeCompare(right.title, locale);
};

export const getAllProductions = async (locale = "it") => {
  const entries = await getStrapiCollection<Record<string, any>>(
    PRODUCTIONS_ENDPOINT,
    {
      "populate[copertinaProduzione][populate]": "*",
      "populate[manifesto][populate]": "*",
      "populate[fotoBackstage][populate]": "*",
      "populate[tipologia_produzione][populate]": "*",
      "populate[casaProduzione][populate]": "*",
      "populate[localizations][populate]": "*",
      locale,
    },
  );

  return entries
    .map((entry) => normalizeProduction(entry))
    .filter(isProduction)
    .sort((left, right) => sortProductions(left, right, locale));
};

const sortProductionCategories = (
  left: ProductionCategory,
  right: ProductionCategory,
  locale = "it",
) => {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.name.localeCompare(right.name, locale);
};

const inferProductionFilters = (
  productions: Production[],
  locale = "it",
) => {
  const filters = new Map<string, ProductionCategory>();

  productions.forEach((production) => {
    if (!filters.has(production.category.slug)) {
      filters.set(production.category.slug, production.category);
    }
  });

  return Array.from(filters.values()).sort((left, right) =>
    sortProductionCategories(left, right, locale),
  );
};

export const getProductionFilters = async (
  productions: Production[],
  locale = "it",
) => inferProductionFilters(productions, locale);

export const getProductionPath = (
  production: Production,
  locale = "it",
) =>
  getLocaleUrlCTM(
    `/produzioni/${production.category.slug}/${production.slug}/`,
    locale,
  );

export const getLocalizedProductionPath = (
  production: Production,
  locale = "it",
) => {
  if (production.locale === locale) {
    return getProductionPath(production, locale);
  }

  const localizedTarget = production.localizations?.find(
    (item) => item.locale === locale,
  );

  if (!localizedTarget) {
    return getProductionPath(production, locale);
  }

  return getLocaleUrlCTM(
    `/produzioni/${localizedTarget.categorySlug}/${localizedTarget.slug}/`,
    locale,
  );
};

export const getProductionLocaleUrls = (production: Production) => {
  const localeUrls: Record<string, string> = {};

  if (production.locale) {
    localeUrls[production.locale] = getProductionPath(
      production,
      production.locale,
    );
  }

  (production.localizations || []).forEach((localization) => {
    localeUrls[localization.locale] = getLocaleUrlCTM(
      `/produzioni/${localization.categorySlug}/${localization.slug}/`,
      localization.locale,
    );
  });

  return localeUrls;
};

const sortProductionCompanies = (
  left: ProductionCompany,
  right: ProductionCompany,
  locale = "it",
) => {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.name.localeCompare(right.name, locale);
};

export const getProductionCompanyLogos = async (locale = "it") => {
  const entries = await getStrapiCollection<Record<string, any>>(
    PRODUCTION_COMPANIES_ENDPOINT,
    {
      "populate[logo][populate]": "*",
      locale,
    },
  );

  const companies = entries
    .map((entry) => normalizeProductionCompany(entry))
    .filter(Boolean) as ProductionCompany[];

  return companies
    .sort((left, right) => sortProductionCompanies(left, right, locale))
    .filter((company) => company.logo?.url)
    .map((company) => ({
      src: company.logo!.url,
      alt: company.name,
    }));
};
