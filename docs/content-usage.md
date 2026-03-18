# Content Usage Map

Questo report descrive dove vengono usati i file Markdown/MDX rimasti in `src/content`.

## Rimossi

- `src/content/_file_format.md`
  Non apparteneva a nessuna collection Astro e non veniva letto dal sito.
- `src/content/sections/italian/blog-section.md`
  Orfano: il componente `BlogSection.astro` non e usato da nessuna route attiva.
- `src/content/sections/english/blog-section.md`
  Orfano: stesso motivo della variante italiana.

## Rimasti

### `src/content/about/{italian,english}/-index.md`

Usati da:

- `src/pages/about.astro`
- `src/pages/en/about.astro`

Attraverso:

- `src/lib/contentParser.astro`
- `src/layouts/components/sections/AboutBanner.astro`
- `src/layouts/components/sections/Achievements.astro`
- `src/layouts/components/sections/OurTeam.astro`

### `src/content/author/{italian,english}/allium-johnson.md`

Usato quando lo slug autore richiesto e `allium-johnson`.

Usato da:

- `src/layouts/components/SinglePageLayout.astro`
- `src/layouts/components/cards/BlogCard.astro`
- `src/layouts/components/widgets/Search.astro`

### `src/content/blog/{italian,english}/-index.md`

Usati da:

- `src/pages/blog/index.astro`
- `src/pages/blog/modern.astro`
- `src/pages/blog/page/[slug].astro`
- `src/pages/blog/category/[category].astro`
- `src/pages/blog/[single].astro`
- `src/pages/en/blog/index.astro`
- `src/pages/en/blog/modern.astro`
- `src/pages/en/blog/page/[slug].astro`
- `src/pages/en/blog/category/[category].astro`
- `src/pages/en/blog/[single].astro`

Usati anche indirettamente da:

- `src/layouts/components/widgets/Search.astro`

### `src/content/blog/{italian,english}/post-*.mdx`

Usati da:

- `src/pages/blog/[single].astro`
- `src/pages/blog/single-minimal.astro`
- `src/pages/blog/index.astro`
- `src/pages/blog/modern.astro`
- `src/pages/blog/page/[slug].astro`
- `src/pages/blog/category/[category].astro`
- `src/pages/en/blog/[single].astro`
- `src/pages/en/blog/single-minimal.astro`
- `src/pages/en/blog/index.astro`
- `src/pages/en/blog/modern.astro`
- `src/pages/en/blog/page/[slug].astro`
- `src/pages/en/blog/category/[category].astro`

Consumati nei listing/sidebar da:

- `src/layouts/components/BlogListPage.astro`
- `src/layouts/components/widgets/ContentList.astro`
- `src/layouts/components/widgets/Categories.astro`
- `src/layouts/components/widgets/RecentPosts.astro`
- `src/layouts/components/widgets/Search.astro`

### `src/content/career/{italian,english}/-index.md`

Usati da:

- `src/pages/career/index.astro`
- `src/pages/career/[single].astro`
- `src/pages/en/career/index.astro`
- `src/pages/en/career/[single].astro`

Consumati anche da:

- `src/layouts/components/sections/CareerOpenings.astro`
- `src/layouts/components/sections/OurValues.astro`

### `src/content/career/{italian,english}/job-*.md`

Usati da:

- `src/pages/career/[single].astro`
- `src/pages/en/career/[single].astro`

Consumati anche nei listing da:

- `src/layouts/components/sections/CareerOpenings.astro`

### `src/content/case-studies/{italian,english}/-index.md`

Usati da:

- `src/pages/case-studies/index.astro`
- `src/pages/case-studies/classic.astro`
- `src/pages/case-studies/overlay.astro`
- `src/pages/case-studies/classic-masonry.astro`
- `src/pages/case-studies/[single].astro`
- `src/pages/en/case-studies/index.astro`
- `src/pages/en/case-studies/classic.astro`
- `src/pages/en/case-studies/overlay.astro`
- `src/pages/en/case-studies/classic-masonry.astro`
- `src/pages/en/case-studies/[single].astro`

Consumati anche da:

- `src/layouts/components/sections/PortfolioSection.astro`

### `src/content/case-studies/{italian,english}/case-studies-*.mdx`

Usati da:

- `src/pages/case-studies/[single].astro`
- `src/pages/en/case-studies/[single].astro`

Consumati anche nei listing/sidebar da:

- `src/layouts/components/sections/PortfolioSection.astro`
- `src/layouts/components/widgets/ContentList.astro`
- `src/layouts/components/widgets/RelatedPortfolios.astro`
- `src/layouts/components/PortfolioSingle.astro`

### `src/content/contact/{italian,english}/-index.md`

Usati da:

- `src/pages/contact.astro`
- `src/pages/en/contact.astro`

### `src/content/faq/{italian,english}/-index.md`

Usati da:

- `src/pages/faq.astro`
- `src/pages/pricing.astro`
- `src/pages/services/[single].astro`
- `src/pages/en/faq.astro`
- `src/pages/en/pricing.astro`
- `src/pages/en/services/[single].astro`

Consumati attraverso:

- `src/layouts/components/sections/FaqSection.astro`

### `src/content/homepage/{italian,english}/-index.md`

Usati da:

- `src/pages/index.astro`
- `src/pages/en/index.astro`

Nota:

- oggi servono soprattutto per i metadati della home; le sezioni homepage aggiuntive sono commentate nelle due route home.

### `src/content/pages/{italian,english}/*.md` e `*.mdx`

Usati da:

- `src/pages/[page].astro`
- `src/pages/en/[page].astro`

In particolare:

- `terms-conditions.md` genera `/terms-conditions/` e `/en/terms-conditions/`
- `privacy-policy.md` genera `/privacy-policy/` e `/en/privacy-policy/`
- `elements.mdx` genera `/elements/` e `/en/elements/`

### `src/content/pricing/{italian,english}/-index.md`

Usati da:

- `src/pages/pricing.astro`
- `src/pages/en/pricing.astro`

Attraverso:

- `src/layouts/components/sections/PricingSection.astro`
- `src/layouts/components/sections/FaqSection.astro`
- `src/layouts/components/sections/TestimonialSection.astro`

### `src/content/sections/{italian,english}/about-banner.md`

Usati da:

- `src/layouts/components/sections/AboutBanner.astro`
- richiamato da `src/pages/about.astro` e `src/pages/en/about.astro`

### `src/content/sections/{italian,english}/achievements.md`

Usati da:

- `src/layouts/components/sections/Achievements.astro`
- richiamato da `src/pages/about.astro` e `src/pages/en/about.astro`

### `src/content/sections/{italian,english}/call-to-action.md`

Usati da:

- `src/layouts/components/sections/CallToAction.astro`

Richiamato da molte route:

- pagine `about`, `blog`, `career`, `case-studies`, `contact`, `faq`, `pricing`, `services`, `produzioni`
- stesse equivalenti sotto `/en`

### `src/content/sections/{italian,english}/career-openings.md`

Usati da:

- `src/layouts/components/sections/CareerOpenings.astro`
- richiamato da `src/pages/career/index.astro` e `src/pages/en/career/index.astro`

### `src/content/sections/{italian,english}/contact-section.md`

Usati da:

- `src/layouts/components/sections/ContactSection.astro`
- richiamato da `src/pages/contact.astro` e `src/pages/en/contact.astro`

### `src/content/sections/{italian,english}/home-banner.md`

Usati da:

- `src/layouts/components/sections/HomeBanner.astro`
- richiamato da `src/pages/index.astro` e `src/pages/en/index.astro`

### `src/content/sections/{italian,english}/home-sub-hero.md`

Usati da:

- `src/layouts/components/sections/SubHero.astro`
- richiamato da `src/pages/index.astro` e `src/pages/en/index.astro`

### `src/content/sections/{italian,english}/join-us.md`

Usati da:

- `src/layouts/components/sections/JoinUs.astro`
- richiamato da `src/pages/team.astro` e `src/pages/en/team.astro`

### `src/content/sections/{italian,english}/office-locations.md`

Usati da:

- `src/layouts/components/sections/OfficeLocations.astro`
- richiamato da `src/pages/contact.astro` e `src/pages/en/contact.astro`

### `src/content/sections/{italian,english}/our-team.md`

Usati da:

- `src/layouts/components/sections/OurTeam.astro`
- richiamato da `src/pages/about.astro`, `src/pages/team.astro`, `src/pages/en/about.astro`, `src/pages/en/team.astro`

### `src/content/sections/{italian,english}/our-values.md`

Usati da:

- `src/layouts/components/sections/OurValues.astro`
- richiamato da `src/pages/career/index.astro` e `src/pages/en/career/index.astro`

### `src/content/sections/{italian,english}/portfolio-section.md`

Usati da:

- `src/layouts/components/sections/PortfolioSection.astro`
- richiamato da:
  `src/pages/case-studies/index.astro`
  `src/pages/case-studies/classic.astro`
  `src/pages/case-studies/overlay.astro`
  `src/pages/case-studies/classic-masonry.astro`
  `src/pages/en/case-studies/index.astro`
  `src/pages/en/case-studies/classic.astro`
  `src/pages/en/case-studies/overlay.astro`
  `src/pages/en/case-studies/classic-masonry.astro`

### `src/content/sections/{italian,english}/pricing-section.md`

Usati da:

- `src/layouts/components/sections/PricingSection.astro`
- richiamato da `src/pages/pricing.astro` e `src/pages/en/pricing.astro`

### `src/content/sections/{italian,english}/services-section.md`

Usati da:

- `src/layouts/components/sections/ServicesSection.astro`
- richiamato da:
  `src/pages/services/index.astro`
  `src/pages/services/[single].astro`
  `src/pages/en/services/index.astro`
  `src/pages/en/services/[single].astro`

### `src/content/sections/{italian,english}/sezione1.md`

Usati da:

- `src/layouts/components/sections/Sezione1.astro`
- richiamato da `src/pages/index.astro` e `src/pages/en/index.astro`

### `src/content/sections/{italian,english}/sezione2.md`

Usati da:

- `src/layouts/components/sections/Sezione2.astro`
- richiamato da `src/pages/index.astro` e `src/pages/en/index.astro`

### `src/content/sections/{italian,english}/sezione3.md`

Usati da:

- `src/layouts/components/sections/Sezione3.astro`
- richiamato da `src/pages/index.astro` e `src/pages/en/index.astro`

### `src/content/sections/{italian,english}/sezione4.md`

Usati da:

- `src/layouts/components/sections/Sezione4.astro`
- richiamato da `src/pages/index.astro` e `src/pages/en/index.astro`

### `src/content/sections/{italian,english}/testimonial-section.md`

Usati da:

- `src/layouts/components/sections/TestimonialSection.astro`
- richiamato da `src/pages/pricing.astro` e `src/pages/en/pricing.astro`

### `src/content/services/{italian,english}/-index.md`

Usati da:

- `src/pages/services/index.astro`
- `src/pages/services/[single].astro`
- `src/pages/en/services/index.astro`
- `src/pages/en/services/[single].astro`

Consumati anche da:

- `src/layouts/components/global/header/MegaMenu.astro`
- `src/layouts/components/sections/ServiceDetailsSection.astro`

### `src/content/services/{italian,english}/service-*.md`

Usati da:

- `src/pages/services/[single].astro`
- `src/pages/en/services/[single].astro`

Consumati anche da:

- `src/layouts/components/sections/ServicesSection.astro`
- `src/layouts/components/widgets/ContentList.astro`
- `src/layouts/components/cards/ServiceCard.astro`
- `src/layouts/components/global/header/MegaMenu.astro`

### `src/content/team/{italian,english}/-index.md`

Usati da:

- `src/pages/team.astro`
- `src/pages/en/team.astro`

Consumati anche da:

- `src/layouts/components/sections/OurTeam.astro`

### `src/content/widgets/{italian,english}/cta-block.md`

Usati da:

- `src/layouts/components/widgets/CtaBlock.astro`

Richiamato nei sidebar di:

- `src/layouts/components/BlogListPage.astro`
- `src/layouts/components/PortfolioSingle.astro`

## Nota su `produzioni`

Le route `src/pages/produzioni/**` e `src/pages/en/produzioni/**` non leggono Markdown da `src/content`: usano Strapi tramite `src/lib/strapi/productions.ts`.
