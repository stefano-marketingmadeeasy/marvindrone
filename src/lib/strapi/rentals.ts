import { slugifyyy } from "@/lib/utils/textConverter";
import type { Rental, RentalAsset, RentalTaxonomy } from "@/types/rentals";
import {
  getStrapiCollection,
  toStrapiAbsoluteUrl,
  unwrapStrapiArray,
  unwrapStrapiEntity,
} from "./client";

const RENTALS_ENDPOINT =
  import.meta.env.STRAPI_RENTALS_ENDPOINT?.trim() || "noleggi";
const DEFAULT_WHATSAPP_PHONE = "3519385209";

const pickFirstString = (source: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const pickFirstTaxonomySource = (
  source: Record<string, any>,
  keys: string[],
): unknown => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (Array.isArray(value) && value.length > 0) {
      return value;
    }

    if (value && typeof value === "object") {
      const entries = unwrapStrapiArray<Record<string, any>>(value);
      if (entries.length > 0) {
        return value;
      }

      const entity = unwrapStrapiEntity<Record<string, any>>(value);
      if (Object.keys(entity).length > 0) {
        return value;
      }
    }
  }

  return undefined;
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

const pickLocalizedEntity = (
  value: unknown,
  locale = "it",
): Record<string, any> | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);

  if (Object.keys(record).length === 0) return undefined;

  const recordLocale = pickFirstString(record, ["locale"]);
  if (!recordLocale || recordLocale === locale) {
    return record;
  }

  const matchingLocalization = unwrapStrapiArray<Record<string, any>>(
    record.localizations,
  ).find((entry) => pickFirstString(entry, ["locale"]) === locale);

  return matchingLocalization || record;
};

const buildTaxonomyKey = (
  source: Record<string, any>,
  record: Record<string, any>,
  fallbackSlug: string,
) => {
  const documentId =
    pickFirstString(record, ["documentId"]) ||
    pickFirstString(source, ["documentId"]);

  if (documentId) {
    return documentId;
  }

  const stableIds = new Set<string>();

  [source, record].forEach((entry) => {
    if (!entry || Object.keys(entry).length === 0) return;

    if (entry.id !== undefined && entry.id !== null) {
      stableIds.add(String(entry.id));
    }

    unwrapStrapiArray<Record<string, any>>(entry.localizations).forEach(
      (localization) => {
        if (localization.id !== undefined && localization.id !== null) {
          stableIds.add(String(localization.id));
        }
      },
    );
  });

  if (stableIds.size > 0) {
    return Array.from(stableIds).sort().join(":");
  }

  return fallbackSlug;
};

const normalizeAsset = (value: unknown): RentalAsset | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const url = toStrapiAbsoluteUrl(record.url);

  if (!url) return undefined;

  return {
    url,
    alt:
      pickFirstString(record, ["alternativeText", "alt", "caption", "name"]) ||
      "Noleggio",
    caption: pickFirstString(record, ["caption", "name"]) || undefined,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
    mime: pickFirstString(record, ["mime"]),
  };
};

const normalizeTaxonomy = (
  value: unknown,
  fallback = "",
  locale = "it",
): RentalTaxonomy | undefined => {
  if (!value) {
    return fallback ? { name: fallback, slug: slugifyyy(fallback) } : undefined;
  }

  if (typeof value === "string") {
    const name = value.trim();
    if (!name) return undefined;
    const slug = slugifyyy(name);

    return {
      name,
      slug,
      key: slug,
    };
  }

  const source = unwrapStrapiEntity<Record<string, any>>(value);
  const record = pickLocalizedEntity(value, locale);
  if (!record) return undefined;
  const name =
    pickFirstString(record, ["name", "nome", "title", "titolo", "label"]) ||
    fallback;

  if (!name) return undefined;

  const slug = pickFirstString(record, ["slug"]) || slugifyyy(name);
  const documentId =
    pickFirstString(record, ["documentId"]) ||
    pickFirstString(source, ["documentId"]) ||
    undefined;

  return {
    id: record.id || source.id,
    documentId,
    key: buildTaxonomyKey(source, record, slug),
    name,
    slug,
    order: normalizeInteger(record.order || record.sortOrder || record.ordine),
    locale: pickFirstString(record, ["locale"]) || undefined,
  };
};

const normalizeTaxonomyList = (value: unknown, locale = "it") => {
  if (!value) return [] as RentalTaxonomy[];

  if (typeof value === "string") {
    return value
      .split(/[\n,;|]+/)
      .map((item) => normalizeTaxonomy(item, "", locale))
      .filter(Boolean) as RentalTaxonomy[];
  }

  const values = Array.isArray(value) ? value : unwrapStrapiArray(value);

  return values
    .map((item) => normalizeTaxonomy(item, "", locale))
    .filter(Boolean) as RentalTaxonomy[];
};

const normalizeRental = (
  entry: Record<string, any>,
  locale = "it",
): Rental | undefined => {
  const raw = unwrapStrapiEntity<Record<string, any>>(entry);
  const model = pickFirstString(raw, [
    "model",
    "modello",
    "title",
    "titolo",
    "name",
    "nome",
  ]);

  if (!model) return undefined;

  const brand = normalizeTaxonomy(
    raw.brand || raw.marca || raw.manufacturer || raw.produttore,
    "",
    locale,
  ) || { name: "", slug: "" };
  const taxonomyKeys = [
    "categories",
    "category",
    "categorie",
    "categoria",
    "Categories",
    "Category",
    "Categorie",
    "Categoria",
    "usages",
    "usage",
    "utilizzi",
    "utilizzo",
    "uses",
    "use",
  ];
  let categories = normalizeTaxonomyList(
    pickFirstTaxonomySource(raw, taxonomyKeys),
    locale,
  );

  if (categories.length === 0) {
    for (const localization of unwrapStrapiArray<Record<string, any>>(
      raw.localizations,
    )) {
      categories = normalizeTaxonomyList(
        pickFirstTaxonomySource(localization, taxonomyKeys),
        locale,
      );

      if (categories.length > 0) {
        break;
      }
    }
  }
  const description =
    pickFirstString(raw, [
      "shortDescription",
      "descrizioneBreve",
      "description",
      "descrizione",
      "excerpt",
      "overview",
    ]) || undefined;

  return {
    id: raw.id || model,
    model,
    brand,
    categories,
    description,
    image: normalizeAsset(
      raw.image ||
        raw.immagine ||
        raw.coverImage ||
        raw.cover ||
        raw.photo ||
        raw.foto,
    ),
    order: normalizeInteger(raw.order || raw.sortOrder || raw.ordine),
    locale: pickFirstString(raw, ["locale"]) || locale,
  };
};

const isRental = (value: Rental | undefined): value is Rental => Boolean(value);

const sortTaxonomy = (
  left: RentalTaxonomy,
  right: RentalTaxonomy,
  locale = "it",
) => {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.name.localeCompare(right.name, locale);
};

const sortRentals = (left: Rental, right: Rental, locale = "it") => {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  const brandCompare = (left.brand.name || "").localeCompare(
    right.brand.name || "",
    locale,
  );

  if (brandCompare !== 0) {
    return brandCompare;
  }

  return left.model.localeCompare(right.model, locale);
};

export const getAllRentals = async (locale = "it") => {
  const entries = await getStrapiCollection<Record<string, any>>(
    RENTALS_ENDPOINT,
    {
      "populate[brand][populate]": "*",
      "populate[Categorie][populate][localizations][populate]": "*",
      "populate[immagine][populate]": "*",
      "populate[localizations][populate]": "*",
      locale,
    },
  );

  return entries
    .map((entry) => normalizeRental(entry, locale))
    .filter(isRental)
    .sort((left, right) => sortRentals(left, right, locale));
};

export const getRentalFilters = (rentals: Rental[], locale = "it") => {
  const brands = new Map<string, RentalTaxonomy>();
  const categories = new Map<string, RentalTaxonomy>();

  rentals.forEach((rental) => {
    const brandKey = rental.brand.key || rental.brand.slug;
    if (brandKey) {
      brands.set(brandKey, rental.brand);
    }

    rental.categories.forEach((category) => {
      const categoryKey = category.key || category.slug;
      if (categoryKey) {
        categories.set(categoryKey, category);
      }
    });
  });

  return {
    brands: Array.from(brands.values()).sort((left, right) =>
      sortTaxonomy(left, right, locale),
    ),
    categories: Array.from(categories.values()).sort((left, right) =>
      sortTaxonomy(left, right, locale),
    ),
  };
};

const getWhatsappPhone = () => {
  const phone =
    import.meta.env.WHATSAPP_PHONE?.trim().replace(/[^\d]/g, "") ||
    DEFAULT_WHATSAPP_PHONE;

  return phone;
};

export const getRentalWhatsappUrl = (rental: Rental, locale = "it") => {
  const subject = [rental.model, rental.brand.name].filter(Boolean).join(" ");
  const text =
    locale === "it"
      ? `Ciao vorrei avere maggiori informazioni sul noleggio di ${subject}`
      : `Hi, I would like more information about renting ${subject}`;

  return `https://wa.me/${getWhatsappPhone()}?text=${encodeURIComponent(text)}`;
};

export const getRentalContactWhatsappUrl = (locale = "it") => {
  const text =
    locale === "it"
      ? "Ciao, vorrei verificare disponibilita e condizioni per il noleggio attrezzatura cinematografica."
      : "Hi, I would like to check availability and conditions for film equipment rental.";

  return `https://wa.me/${getWhatsappPhone()}?text=${encodeURIComponent(text)}`;
};
