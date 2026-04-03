import { plainify, slugifyyy } from "@/lib/utils/textConverter";
import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import type {
  NewsArticle,
  NewsAsset,
  NewsCategory,
  NewsLocalization,
} from "@/types/news";
import {
  getStrapiCollection,
  toStrapiAbsoluteUrl,
  unwrapStrapiArray,
  unwrapStrapiEntity,
} from "./client";

const NEWS_ENDPOINT = import.meta.env.STRAPI_NEWS_ENDPOINT?.trim() || "news";

const pickFirstString = (source: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
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

const normalizeKeywordList = (value: unknown) => {
  if (!value) return [] as string[];

  if (typeof value === "string") {
    return value
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) return [] as string[];

  return value
    .flatMap((item) =>
      typeof item === "string"
        ? [item.trim()]
        : [
            pickFirstString(unwrapStrapiEntity<Record<string, any>>(item), [
              "name",
              "nome",
              "label",
              "title",
              "titolo",
              "value",
              "valore",
            ]),
          ],
    )
    .filter(Boolean);
};

const parseStructuredData = (value: unknown) => {
  if (!value) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "null") return undefined;

    try {
      return JSON.parse(trimmed);
    } catch {
      return undefined;
    }
  }

  if (typeof value === "object") {
    return value;
  }

  return undefined;
};

const normalizeAsset = (value: unknown): NewsAsset | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const url = toStrapiAbsoluteUrl(record.url);

  if (!url) return undefined;

  return {
    url,
    alt:
      pickFirstString(record, ["alternativeText", "alt", "caption", "name"]) ||
      "News",
    caption: pickFirstString(record, ["caption", "name"]) || undefined,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
    mime: pickFirstString(record, ["mime"]),
  };
};

const normalizeGallery = (raw: Record<string, any>) =>
  pickFirstArray(raw, ["gallery", "galleria", "images", "immagini"])
    .map((item) => normalizeAsset(item))
    .filter(Boolean) as NewsAsset[];

const normalizeCategory = (raw: Record<string, any>): NewsCategory => {
  const categorySource =
    raw.categoria_news || raw.categoriaNews || raw.categoria || raw.category;

  if (typeof categorySource === "string") {
    return {
      name: categorySource,
      slug: slugifyyy(categorySource),
    };
  }

  const record = unwrapStrapiEntity<Record<string, any>>(categorySource);
  const name =
    pickFirstString(record, ["name", "nome", "label", "title", "titolo"]) ||
    "News";
  const slug = pickFirstString(record, ["slug"]) || slugifyyy(name) || "news";

  return {
    id: record.id,
    name,
    slug,
    order: normalizeInteger(record.order || record.ordine),
    locale: pickFirstString(record, ["locale"]) || undefined,
  };
};

const normalizeLocalization = (
  value: unknown,
): NewsLocalization | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const locale = pickFirstString(record, ["locale"]);
  const title = pickFirstString(record, ["title", "titolo", "name", "nome"]);
  const slug =
    pickFirstString(record, ["slug"]) || (title ? slugifyyy(title) : "");

  if (!locale || !slug) return undefined;

  return {
    locale,
    slug,
  };
};

const normalizeNews = (entry: Record<string, any>): NewsArticle | undefined => {
  const raw = unwrapStrapiEntity<Record<string, any>>(entry);
  const title = pickFirstString(raw, ["title", "titolo", "name", "nome"]);

  if (!title) return undefined;

  const gallery = normalizeGallery(raw);
  const heroImage = normalizeAsset(
    raw.heroImage ||
      raw.coverImage ||
      raw.image ||
      raw.immagineCopertina ||
      raw.copertina,
  );
  const seoRecord = unwrapStrapiEntity<Record<string, any>>(raw.seo);
  const seoMetaTitle =
    pickFirstString(raw, ["metaTitle", "MetaTitle"]) ||
    pickFirstString(seoRecord, ["metaTitle", "title", "titolo"]) ||
    undefined;
  const seoMetaDescription =
    pickFirstString(raw, ["metaDescription", "MetaDescription"]) ||
    pickFirstString(seoRecord, [
      "metaDescription",
      "description",
      "descrizione",
    ]) ||
    undefined;
  const seoMetaImage = normalizeAsset(
    seoRecord.metaImage || seoRecord.meta_image || seoRecord.image,
  );
  const seoOpenGraphRecord = unwrapStrapiEntity<Record<string, any>>(
    seoRecord.openGraph || seoRecord.open_graph,
  );
  const seoOpenGraphImage = normalizeAsset(
    seoOpenGraphRecord["og:image"] ||
      seoOpenGraphRecord.ogImage ||
      seoOpenGraphRecord.image,
  );
  const seoAltText =
    pickFirstString(raw, ["altText", "AltText"]) ||
    pickFirstString(seoRecord, ["altText", "alternativeText", "alt"]) ||
    seoMetaImage?.alt ||
    heroImage?.alt ||
    undefined;
  const seoCaption =
    pickFirstString(raw, ["caption", "Caption"]) ||
    pickFirstString(seoRecord, ["caption"]) ||
    seoMetaImage?.caption ||
    heroImage?.caption ||
    undefined;
  const seoImage = seoMetaImage
    ? {
        ...seoMetaImage,
        alt: seoAltText || seoMetaImage.alt,
        caption: seoCaption || seoMetaImage.caption,
      }
    : heroImage
    ? {
        ...heroImage,
        alt: seoAltText || heroImage.alt,
        caption: seoCaption || heroImage.caption,
      }
    : undefined;
  const seoKeywords = normalizeKeywordList(seoRecord.keywords);
  const seoMetaRobots =
    pickFirstString(seoRecord, ["metaRobots", "robots"]) || undefined;
  const seoMetaViewport =
    pickFirstString(seoRecord, ["metaViewport", "viewport"]) || undefined;
  const seoCanonicalUrl =
    pickFirstString(seoRecord, ["canonicalURL", "canonicalUrl"]) || undefined;
  const seoStructuredData = parseStructuredData(
    seoRecord.structuredData || seoRecord.schema,
  );
  const seoOpenGraphTitle =
    pickFirstString(seoOpenGraphRecord, ["og:title", "title"]) || undefined;
  const seoOpenGraphDescription =
    pickFirstString(seoOpenGraphRecord, ["og:description", "description"]) ||
    undefined;
  const seoOpenGraphUrl =
    pickFirstString(seoOpenGraphRecord, ["og:url", "url"]) || undefined;
  const seoOpenGraphType =
    pickFirstString(seoOpenGraphRecord, ["og:type", "type"]) || undefined;
  const body =
    pickFirstString(raw, [
      "body",
      "content",
      "contenuto",
      "article",
      "testo",
    ]) || undefined;
  const excerpt =
    pickFirstString(raw, [
      "excerpt",
      "estratto",
      "description",
      "descrizioneBreve",
    ]) ||
    (body ? plainify(body).replace(/\s+/g, " ").trim().slice(0, 220) : "");

  return {
    id: raw.id || title,
    locale: pickFirstString(raw, ["locale"]) || undefined,
    title,
    slug:
      pickFirstString(raw, ["slug"]) || slugifyyy(title) || `news-${raw.id}`,
    category: normalizeCategory(raw),
    localizations: pickFirstArray(raw, ["localizations"])
      .map((item) => normalizeLocalization(item))
      .filter(Boolean) as NewsLocalization[],
    excerpt: excerpt || undefined,
    body,
    publishedAt:
      pickFirstString(raw, [
        "publishedAt",
        "publishDate",
        "dataPubblicazione",
        "date",
      ]) || undefined,
    featured: Boolean(raw.featured ?? raw.inEvidenza),
    heroImage: heroImage || gallery[0],
    gallery,
    seo: {
      metaTitle: seoMetaTitle,
      metaDescription: seoMetaDescription,
      altText: seoAltText,
      caption: seoCaption,
      image: seoImage,
      keywords: seoKeywords,
      metaRobots: seoMetaRobots,
      metaViewport: seoMetaViewport,
      canonicalUrl: seoCanonicalUrl,
      structuredData: seoStructuredData,
      openGraph:
        seoOpenGraphTitle ||
        seoOpenGraphDescription ||
        seoOpenGraphImage ||
        seoOpenGraphUrl ||
        seoOpenGraphType
          ? {
              title: seoOpenGraphTitle,
              description: seoOpenGraphDescription,
              image: seoOpenGraphImage,
              url: seoOpenGraphUrl,
              type: seoOpenGraphType,
            }
          : undefined,
    },
  };
};

const isNewsArticle = (value: NewsArticle | undefined): value is NewsArticle =>
  Boolean(value);

const sortNews = (left: NewsArticle, right: NewsArticle, locale = "it") => {
  const leftFeatured = left.featured ? 1 : 0;
  const rightFeatured = right.featured ? 1 : 0;

  if (rightFeatured !== leftFeatured) {
    return rightFeatured - leftFeatured;
  }

  const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
  const rightDate = right.publishedAt
    ? new Date(right.publishedAt).getTime()
    : 0;

  if (rightDate !== leftDate) {
    return rightDate - leftDate;
  }

  return left.title.localeCompare(right.title, locale);
};

export const getAllNews = async (locale = "it") => {
  const entries = await getStrapiCollection<Record<string, any>>(
    NEWS_ENDPOINT,
    {
      "populate[immagineCopertina][populate]": "*",
      "populate[galleria][populate]": "*",
      "populate[categoria_news][populate]": "*",
      "populate[localizations][populate]": "*",
      "populate[seo][populate]": "*",
      locale,
    },
  );

  return entries
    .map((entry) => normalizeNews(entry))
    .filter(isNewsArticle)
    .sort((left, right) => sortNews(left, right, locale));
};

const sortNewsCategories = (
  left: NewsCategory,
  right: NewsCategory,
  locale = "it",
) => {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.name.localeCompare(right.name, locale);
};

export const getNewsFilters = async (
  articles: NewsArticle[],
  locale = "it",
) => {
  const filters = new Map<string, NewsCategory>();

  articles.forEach((article) => {
    if (!filters.has(article.category.slug)) {
      filters.set(article.category.slug, article.category);
    }
  });

  return Array.from(filters.values()).sort((left, right) =>
    sortNewsCategories(left, right, locale),
  );
};

const newsSegment = () => "news";

export const getNewsPath = (article: NewsArticle, locale = "it") =>
  getLocaleUrlCTM(`/${newsSegment()}/${article.slug}/`, locale);

export const getLocalizedNewsPath = (article: NewsArticle, locale = "it") => {
  if (article.locale === locale) {
    return getNewsPath(article, locale);
  }

  const localizedTarget = article.localizations?.find(
    (item) => item.locale === locale,
  );

  if (!localizedTarget) {
    return getNewsPath(article, locale);
  }

  return getLocaleUrlCTM(`/${newsSegment()}/${localizedTarget.slug}/`, locale);
};

export const getNewsLocaleUrls = (article: NewsArticle) => {
  const localeUrls: Record<string, string> = {};

  if (article.locale) {
    localeUrls[article.locale] = getNewsPath(article, article.locale);
  }

  (article.localizations || []).forEach((localization) => {
    localeUrls[localization.locale] = getLocaleUrlCTM(
      `/${newsSegment()}/${localization.slug}/`,
      localization.locale,
    );
  });

  return localeUrls;
};
