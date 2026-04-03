import type { DroneParkAsset, DroneParkItem } from "@/types/drone-park";
import {
  getStrapiCollection,
  toStrapiAbsoluteUrl,
  unwrapStrapiEntity,
} from "./client";

const DRONE_PARK_ENDPOINT =
  import.meta.env.STRAPI_DRONE_PARK_ENDPOINT?.trim() || "parchi-droni";

const pickFirstString = (source: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
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

const normalizeAsset = (value: unknown): DroneParkAsset | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const url = toStrapiAbsoluteUrl(record.url);

  if (!url) return undefined;

  return {
    url,
    alt:
      pickFirstString(record, [
        "seo_AltText",
        "seoAltText",
        "alternativeText",
        "alt",
        "caption",
        "name",
      ]) || "Parco droni",
    caption: pickFirstString(record, ["caption", "name"]) || undefined,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
    mime: pickFirstString(record, ["mime"]) || undefined,
  };
};

const normalizeDroneParkItem = (
  entry: Record<string, any>,
  locale = "it",
): DroneParkItem | undefined => {
  const raw = unwrapStrapiEntity<Record<string, any>>(entry);
  const title = pickFirstString(raw, [
    "title",
    "titolo",
    "name",
    "nome",
    "model",
    "modello",
  ]);

  if (!title) return undefined;

  return {
    id: raw.id || title,
    title,
    description:
      pickFirstString(raw, [
        "description",
        "descrizione",
        "excerpt",
        "overview",
        "body",
        "testo",
      ]) || undefined,
    image: normalizeAsset(
      raw.image ||
        raw.immagine ||
        raw.coverImage ||
        raw.cover ||
        raw.photo ||
        raw.foto,
    ),
    order: normalizeInteger(
      raw.order || raw.sortOrder || raw.ordine || raw.ordinamento,
    ),
    locale: pickFirstString(raw, ["locale"]) || locale,
  };
};

const isDroneParkItem = (
  value: DroneParkItem | undefined,
): value is DroneParkItem => Boolean(value);

const sortDroneParkItems = (
  left: DroneParkItem,
  right: DroneParkItem,
  locale = "it",
) => {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.title.localeCompare(right.title, locale);
};

export const getAllDroneParkItems = async (locale = "it") => {
  const entries = await getStrapiCollection<Record<string, any>>(
    DRONE_PARK_ENDPOINT,
    {
      populate: "*",
      locale,
    },
  );

  return entries
    .map((entry) => normalizeDroneParkItem(entry, locale))
    .filter(isDroneParkItem)
    .sort((left, right) => sortDroneParkItems(left, right, locale));
};
