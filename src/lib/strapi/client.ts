const getStrapiBaseUrl = () =>
  import.meta.env.STRAPI_URL?.trim().replace(/\/$/, "") || "";

const getStrapiApiUrl = () => {
  const baseUrl = getStrapiBaseUrl();

  if (!baseUrl) return "";

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
};

const getStrapiOriginUrl = () => {
  const baseUrl = getStrapiBaseUrl();

  if (!baseUrl) return "";

  return baseUrl.endsWith("/api") ? baseUrl.replace(/\/api$/, "") : baseUrl;
};

const asRecord = (value: unknown): Record<string, any> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, any>)
    : {};

export const strapiEnabled = () => Boolean(getStrapiApiUrl());

export const unwrapStrapiEntity = <T extends Record<string, any>>(
  value: unknown,
): T => {
  const record = asRecord(value);

  if (Array.isArray(value)) {
    return {} as T;
  }

  if ("data" in record) {
    return unwrapStrapiEntity<T>(record.data);
  }

  if ("attributes" in record && typeof record.attributes === "object") {
    return {
      id: record.id,
      ...asRecord(record.attributes),
    } as unknown as T;
  }

  return record as T;
};

export const unwrapStrapiArray = <T extends Record<string, any>>(
  value: unknown,
): T[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => unwrapStrapiEntity<T>(item))
      .filter((item) => Object.keys(item).length > 0);
  }

  const record = asRecord(value);

  if ("data" in record) {
    return unwrapStrapiArray<T>(record.data);
  }

  const entity = unwrapStrapiEntity<T>(value);

  return Object.keys(entity).length > 0 ? [entity] : [];
};

export const toStrapiAbsoluteUrl = (value?: string | null) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const originUrl = getStrapiOriginUrl();

  if (!originUrl) return value;

  return `${originUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

export const getStrapiCollection = async <T extends Record<string, any>>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T[]> => {
  const apiUrl = getStrapiApiUrl();

  if (!apiUrl) return [];

  const url = new URL(`${apiUrl}/${endpoint.replace(/^\/+/, "")}`);
  url.searchParams.set("pagination[pageSize]", "500");

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const token = import.meta.env.STRAPI_TOKEN?.trim();

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      console.warn(
        `[Strapi] Request failed for ${endpoint}: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const payload = await response.json();
    return unwrapStrapiArray<T>(payload);
  } catch (error) {
    console.warn(`[Strapi] Request failed for ${endpoint}`, error);
    return [];
  }
};
