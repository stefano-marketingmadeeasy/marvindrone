/**
 * Centralized configuration for all URLs, endpoints and contact details.
 * Edit this file to update links and contact information across the whole site.
 */

// ---------------------------------------------------------------------------
// CONTACT INFO
// ---------------------------------------------------------------------------
export const CONTACT = {
  /** Phone number in international format (used for tel: links) */
  phone: "+39 351 93 85 209",

  /** Phone number as displayed to the user */
  phoneDisplay: "+39 351 93 85 209",

  /** Secondary phone number in international format (used for tel: links) */
  secondaryPhone: "+39 388 16 70 798",

  /** Secondary phone number as displayed to the user */
  secondaryPhoneDisplay: "+39 388 16 70 798",

  /**
   * WhatsApp number WITHOUT + or spaces (e.g. "393401234567").
   * Used to build the wa.me deep-link.
   */
  whatsappNumber: "3519385209",

  /** Pre-filled WhatsApp message for Italian visitors */
  whatsappMessageIT: "Ciao, vorrei ricevere informazioni",

  /** Pre-filled WhatsApp message for English visitors */
  whatsappMessageEN: "Hello, I would like to receive information",

  /** Public contact email shown on the page */
  email: "info@marvindrone.com",
} as const;

// ---------------------------------------------------------------------------
// SOCIAL MEDIA
// ---------------------------------------------------------------------------
export const SOCIAL = {
  facebook: "https://www.facebook.com/MarvinDroneTM",
  instagram: "https://www.instagram.com/marvindrone_tm",
  youtube: "",   // add when available
  linkedin: "",  // add when available
} as const;

// ---------------------------------------------------------------------------
// INTERNAL API ENDPOINTS (server-side routes)
// ---------------------------------------------------------------------------
export const API = {
  /** Contact form submission endpoint (POST) */
  contact: "/api/contact/",
} as const;

// ---------------------------------------------------------------------------
// EXTERNAL / THIRD-PARTY ENDPOINTS
// ---------------------------------------------------------------------------
export const EXTERNAL = {
  /** Strapi CMS base URL (mirrors STRAPI_URL env var, kept here for reference) */
  strapiBase: import.meta.env.STRAPI_URL ?? "",

  /**
   * Resend dashboard: https://resend.com/emails
   * API key is stored in RESEND_API_KEY env var.
   */
} as const;

// ---------------------------------------------------------------------------
// HELPER: build WhatsApp deep-link
// ---------------------------------------------------------------------------
export function whatsappUrl(lang: "it" | "en" = "it"): string {
  const msg =
    lang === "en" ? CONTACT.whatsappMessageEN : CONTACT.whatsappMessageIT;
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
