import { defineCollection, z } from "astro:content";

export const sharedButton = z
  .object({
    enable: z.boolean().optional(),
    tag: z.enum(["a", "button"]).optional(),
    url: z.string(),
    label: z.string(),
    class: z.string().optional(),
    rel: z.string().optional(),
    icon: z.string().optional(),
    iconPosition: z.enum(["left", "right"]).optional(),
    animateIcon: z.string().optional(),
    showIcon: z.string().optional(),
    target: z.string().optional(),
    size: z.enum(["md"]).optional(),
    hoverEffect: z
      .enum(["text-flip", "creative-fill", "magnetic", "magnetic-text-flip"])
      .optional(),
    variant: z
      .enum(["fill", "outline", "outline-white", "text", "text-white"])
      .optional(),
  })
  .passthrough();

export const sharedButtonTag = sharedButton.refine(
  (data) => data.tag !== "a" || !!data.url,
  {
    message: "`url` is required when `tag` is 'a'",
    path: ["url"],
  },
);

// Universal Page Schema
const page = z.object({
  title: z.string(),
  date: z.date().optional(), // example date format 2022-01-01 or 2022-01-01T00:00:00+00:00 (Year-Month-Day Hour:Minute:Second+Timezone)
  description: z.string().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  robots: z.string().optional(),
  excludeFromSitemap: z.boolean().optional(),
  customSlug: z.string().optional(),
  canonical: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  disableTagline: z.boolean().optional(),
});

// Marquee Schema
export const marqueeConfig = z.object({
  marqueeElementWidth: z.string(),
  marqueeElementWidthResponsive: z.string(),
  marqueeElementWidthAuto: z.boolean(),
  marqueePauseOnHover: z.boolean(),
  marqueeReverse: z.enum(["reverse", ""]).optional(), // Optional: "reverse" or an empty string
  marqueeDuration: z.string(),
});

// Pages collection schema
const pagesCollection = defineCollection({
  schema: page,
});

// Export collections
export const collections = {
  pages: pagesCollection,
  sections: defineCollection({}),
  homepage: defineCollection({}),
  widgets: defineCollection({}),
};
