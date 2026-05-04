import type { ProductionAsset } from "@/types/productions";
import type { ImpostazioniGenerali } from "@/types/impostazioni-generali";
import {
  getStrapiSingle,
  toStrapiAbsoluteUrl,
  unwrapStrapiEntity,
} from "./client";

const IMPOSTAZIONI_GENERALI_ENDPOINT =
  import.meta.env.STRAPI_IMPOSTAZIONI_GENERALI_ENDPOINT?.trim() || "generale";

const pickFirstString = (source: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const normalizeAsset = (value: unknown): ProductionAsset | undefined => {
  const record = unwrapStrapiEntity<Record<string, any>>(value);
  const url = toStrapiAbsoluteUrl(record.url);

  if (!url) return undefined;

  return {
    url,
    alt:
      pickFirstString(record, ["alternativeText", "alt", "caption", "name"]) ||
      "Marvin Drone",
    caption: pickFirstString(record, ["caption", "name"]) || undefined,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
    mime: pickFirstString(record, ["mime"]) || undefined,
  };
};

const normalizePaginaProduzioni = (source: Record<string, any>) => {
  const paginaProduzioniRecord = unwrapStrapiEntity<Record<string, any>>(
    source.paginaProduzioni ||
      source.pagina_produzioni ||
      source.productionsPage ||
      source.produzioniPage ||
      source.produzioni,
  );

  return {
    immagineHero: normalizeAsset(
      paginaProduzioniRecord.immagineHero ||
        paginaProduzioniRecord.immagine_hero ||
        paginaProduzioniRecord.heroImage ||
        paginaProduzioniRecord.hero_image ||
        paginaProduzioniRecord.immagineCopertina ||
        paginaProduzioniRecord.coverImage ||
        paginaProduzioniRecord.image,
    ),
  };
};

const normalizeHeroProduzioni = (source: Record<string, any>) =>
  normalizeAsset(
    source.heroProduzioni ||
      source.hero_produzioni ||
      source.immagineHeroProduzioni ||
      source.immagine_hero_produzioni,
  ) || normalizePaginaProduzioni(source).immagineHero;

export const getImpostazioniGenerali = async (): Promise<ImpostazioniGenerali> => {
  const raw = await getStrapiSingle<Record<string, any>>(
    IMPOSTAZIONI_GENERALI_ENDPOINT,
    {
      populate: "*",
    },
    {
      suppressNotFound: true,
    },
  );

  if (!raw) {
    return {};
  }

  return {
    heroProduzioni: normalizeHeroProduzioni(raw),
  };
};
