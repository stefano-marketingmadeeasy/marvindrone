import path from "node:path";
import trailingSlashChecker from "./trailingSlashChecker";
import config from "../../../.astro/config.generated.json";
import languagesJSON from "../../config/language.json";

type LanguageConfig = {
  languageName: string;
  languageCode: string;
  contentDir: string;
  locale?: string;
  weight?: number;
};

export const supportedLanguages = [...(languagesJSON as LanguageConfig[])].sort(
  (left, right) => (left.weight || 0) - (right.weight || 0),
);
export const defaultLanguage =
  supportedLanguages.find((language) => language.languageCode === "it")
    ?.languageCode || supportedLanguages[0]?.languageCode || "it";

export const getLanguageConfig = (
  lang?: string,
): LanguageConfig => {
  return (
    supportedLanguages.find((language) => language.languageCode === lang) ||
    supportedLanguages.find(
      (language) => language.languageCode === defaultLanguage,
    ) ||
    supportedLanguages[0]
  );
};

export const getContentDirForLocale = (lang?: string): string =>
  getLanguageConfig(lang).contentDir;

export const getOpenGraphLocale = (lang?: string): string =>
  getLanguageConfig(lang).locale || config.opengraph.ogLocale || "it_IT";

const translationCache: Record<string, any> = {};

export const useTranslations = async (lang?: string): Promise<Function> => {
  const resolvedLanguage = getLanguageConfig(lang).languageCode;

  if (translationCache[resolvedLanguage]) {
    return translationCache[resolvedLanguage];
  }

  let menu;
  let dictionary;

  try {
    menu = await import(`../../../src/config/menu.${resolvedLanguage}.json`);
    dictionary = await import(`../../../src/i18n/${resolvedLanguage}.json`);
  } catch {
    menu = await import(`../../../src/config/menu.${defaultLanguage}.json`);
    dictionary = await import(`../../../src/i18n/${defaultLanguage}.json`);
  }

  const translations = {
    ...menu,
    ...dictionary,
    contentDir: getContentDirForLocale(resolvedLanguage),
  };

  type NestedObject = Record<string, any>;
  type DotNotationKeys<T> = T extends NestedObject
    ? {
        [K in keyof T & string]: T[K] extends NestedObject
          ? `${K}` | `${K}.${DotNotationKeys<T[K]>}`
          : `${K}`;
      }[keyof T & string]
    : never;

  const t = <T extends NestedObject>(key: DotNotationKeys<T>): string | any => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return "Not Found";
      }
    }

    return value;
  };

  translationCache[resolvedLanguage] = Object.assign(t, translations);
  return translationCache[resolvedLanguage];
};

export const getLocaleUrlCTM = (
  url: string,
  providedLang: string | undefined,
  prependValue?: string,
): string => {
  const language = getLanguageConfig(providedLang).languageCode;
  const isExternalUrl = (() => {
    try {
      const parsedUrl = new URL(url, config.site.baseUrl);
      const baseUrl = new URL(config.site.baseUrl);

      if (!parsedUrl.protocol.startsWith("http")) {
        return false;
      }

      const isSameOrigin = parsedUrl.origin === baseUrl.origin;
      const isLocalhost =
        parsedUrl.hostname === "localhost" ||
        parsedUrl.hostname === "127.0.0.1";

      return !(isSameOrigin || isLocalhost);
    } catch {
      return false;
    }
  })();

  if (isExternalUrl || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }

  const isAbsoluteUrl = url.startsWith("http://") || url.startsWith("https://");
  const sourceUrl = isAbsoluteUrl ? new URL(url) : null;
  const hash = sourceUrl?.hash || "";
  let updatedUrl = isAbsoluteUrl ? sourceUrl?.pathname || "/" : url;

  if (updatedUrl.endsWith(".mdx") || updatedUrl.endsWith(".md")) {
    updatedUrl = updatedUrl.replace(/\.(md|mdx)$/, "");
  }

  supportedLanguages.forEach((languageConfig) => {
    updatedUrl = updatedUrl.replace(
      new RegExp(`^/?${languageConfig.contentDir}/`),
      "/",
    );
    updatedUrl = updatedUrl.replace(
      new RegExp(`^/?${languageConfig.languageCode}(?=/|$)`),
      "/",
    );
  });

  if (prependValue) {
    updatedUrl = prependValue.startsWith("/")
      ? path.posix.join(prependValue, updatedUrl)
      : path.posix.join("/" + prependValue, updatedUrl);
  }

  if (!updatedUrl.startsWith("/")) {
    updatedUrl = "/" + updatedUrl;
  }

  updatedUrl = updatedUrl.replace(/\/homepage\/?$/, "/");
  updatedUrl = updatedUrl.replace(/\/pages\//g, "/");
  updatedUrl = updatedUrl.replace(/\/+/g, "/");

  if (language !== defaultLanguage) {
    updatedUrl =
      updatedUrl === "/"
        ? `/${language}/`
        : path.posix.join(`/${language}`, updatedUrl);
  }

  updatedUrl = trailingSlashChecker(updatedUrl);

  if (sourceUrl) {
    return `${sourceUrl.origin}${updatedUrl}${hash}`;
  }

  return `${updatedUrl}${hash}`;
};

export const getAlternateLocaleLinks = (
  url: string,
): Array<{ hreflang: string; href: string }> =>
  supportedLanguages.map((language) => ({
    hreflang: language.languageCode,
    href: getLocaleUrlCTM(url, language.languageCode),
  }));
