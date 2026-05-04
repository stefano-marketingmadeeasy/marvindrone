import config from ".astro/config.generated.json" with { type: "json" };
import type { APIRoute } from "astro";

const { enable, disallow } = config.seo.robotsTxt;

const getRobotsTxt = (sitemapURL: URL) => {
  const disallowRules =
    disallow?.map((item: string) => `Disallow: ${item}`).join("\n") || "";

  return `User-agent: *
Allow: /
${disallowRules ? `${disallowRules}\n` : ""}Sitemap: ${sitemapURL.href}
`;
};

export const GET: APIRoute = ({ site }) => {
  if (!enable) {
    return new Response(null, { status: 404 });
  }

  const sitemapURL = new URL("sitemap-index.xml", site);

  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
