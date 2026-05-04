/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL?: string;
  readonly STRAPI_TOKEN?: string;
  readonly STRAPI_PRODUCTIONS_ENDPOINT?: string;
  readonly STRAPI_NEWS_ENDPOINT?: string;
  readonly STRAPI_RENTALS_ENDPOINT?: string;
  readonly STRAPI_DRONE_PARK_ENDPOINT?: string;
  readonly STRAPI_IMPOSTAZIONI_GENERALI_ENDPOINT?: string;
  readonly STRAPI_SITE_SETTINGS_ENDPOINT?: string;
  readonly WHATSAPP_PHONE?: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM_EMAIL?: string;
  readonly RESEND_TO_EMAIL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly TURNSTILE_SECRET_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
