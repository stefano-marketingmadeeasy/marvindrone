/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL?: string;
  readonly STRAPI_TOKEN?: string;
  readonly STRAPI_PRODUCTIONS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
