import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import config from "./.astro/config.generated.json" with { type: "json" };
import languages from "./src/config/language.json" with { type: "json" };

import compressor from "astro-compressor";

let {
  seo: { sitemap: sitemapConfig },
} = config;

// https://astro.build/config
export default defineConfig({
  site: config.site.baseUrl ? config.site.baseUrl : "http://examplesite.com",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  i18n: {
    locales: languages.map((language) => language.languageCode),
    defaultLocale:
      languages.find((language) => language.languageCode === "it")
        ?.languageCode || languages[0].languageCode,
    routing: {
      redirectToDefaultLocale: true,
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemapConfig.enable ? sitemap() : null, react(), AutoImport({
    imports: [
      "@/components/CustomButton.astro",
      "@/shortcodes/Accordion.astro",
      "@/shortcodes/Notice.astro",
      "@/shortcodes/Tabs.astro",
      "@/shortcodes/Tab.astro",
      "@/shortcodes/Testimonial.astro",
      "@/shortcodes/ListCheck.astro",
      "@/shortcodes/StatsWrapper.astro",
      "@/shortcodes/ImageList.astro",
      "@/shortcodes/ImageItem.astro",
      "@/shortcodes/StatsItem.astro",
      "@/shortcodes/VideoInline.astro",
    ],
  }), mdx(), compressor()],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [
      remarkParseContent, // Parse markdown content and add classes in heading and loading="lazy" to images
      remarkToc,
    ],

    // Code Highlighter https://github.com/shikijs/shiki
    shikiConfig: {
      theme: "light-plus", // https://shiki.style/themes
      wrap: false,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
