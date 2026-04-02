# Strapi per la sezione News

Il frontend Astro e gia pronto. Quello che devi fare adesso e allineare il backend Strapi alla struttura che il sito si aspetta.

## Variabili ambiente del frontend

Nel progetto Astro configura `.env` partendo da [.env.example](/Users/stefanopaolucci/Desktop/marvindrone/.env.example#L1):

```bash
STRAPI_URL=https://cms.tuodominio.it
STRAPI_TOKEN=
STRAPI_NEWS_ENDPOINT=news
```

`STRAPI_URL` puo essere sia l'origin del progetto Strapi sia un URL che termina con `/api`.

## Cosa e gia pronto lato Astro

- lettura endpoint Strapi in [src/lib/strapi/client.ts](/Users/stefanopaolucci/Desktop/marvindrone/src/lib/strapi/client.ts#L1)
- normalizzazione news in [src/lib/strapi/news.ts](/Users/stefanopaolucci/Desktop/marvindrone/src/lib/strapi/news.ts#L1)
- archivio news in [src/pages/news/index.astro](/Users/stefanopaolucci/Desktop/marvindrone/src/pages/news/index.astro#L1)
- archivio news inglese in [src/pages/en/news/index.astro](/Users/stefanopaolucci/Desktop/marvindrone/src/pages/en/news/index.astro#L1)
- pagina dettaglio news in [src/pages/news/[slug].astro](/Users/stefanopaolucci/Desktop/marvindrone/src/pages/news/[slug].astro#L1)
- pagina dettaglio news inglese in [src/pages/en/news/[slug].astro](/Users/stefanopaolucci/Desktop/marvindrone/src/pages/en/news/[slug].astro#L1)

## Blueprint da copiare nel progetto Strapi

Dentro [docs/strapi-news-blueprint](/Users/stefanopaolucci/Desktop/marvindrone/docs/strapi-news-blueprint#L1) trovi:

- collection type `News`
- collection type `Categoria news`
- componente `shared.seo`
- un esempio payload in `examples/news-sample.json`

Se nel tuo progetto Strapi hai gia copiato il blueprint delle produzioni, il componente `shared.seo` esiste gia. In quel caso puoi saltare il file duplicato.

## Procedura consigliata

1. Copia il contenuto di `docs/strapi-news-blueprint/src/` dentro `src/` del tuo progetto Strapi.
2. Riavvia Strapi.
3. Apri il pannello admin e verifica che esistano:
   - `Categoria news`
   - `News`
4. Attiva il plugin `Internationalization` per entrambi i collection type, se non e gia attivo nel progetto.
5. Crea prima le categorie news, ad esempio:
   - `Comunicati` con slug `comunicati`
   - `Backstage` con slug `backstage`
   - `Produzioni` con slug `produzioni`
6. Crea almeno una news in italiano e pubblicala.
7. Apri la news appena creata e aggiungi la traduzione inglese tramite `Add new locale`.
8. Se usi API pubbliche:
   - abilita per il ruolo `Public` le permission `find` e `findOne` su `News`
   - abilita per il ruolo `Public` le permission `find` e `findOne` su `Categoria news`
9. Se non vuoi API pubbliche:
   - lascia tutto privato
   - genera un API token read-only in Strapi
   - inseriscilo in `STRAPI_TOKEN`
10. Nel progetto Astro configura `.env`.
11. Esegui `npm run dev` oppure `npm run build`.

## Endpoint atteso

Il frontend legge:

- `GET /api/news?pagination[pageSize]=500&locale=it&populate[...]`
- `GET /api/news?pagination[pageSize]=500&locale=en&populate[...]`

e usa:

- `slug` della news per la pagina dettaglio
- `categoria_news.slug` per il filtro client-side
- `localizations` per il language switch tra IT e EN

## Schema consigliato con nomi campo in italiano

Collection type `News`:

- `titolo`
- `slug`
- `estratto`
- `contenuto`
- `dataPubblicazione`
- `inEvidenza`
- `categoria_news`
- `immagineCopertina`
- `galleria`
- `seo`

Collection type `Categoria news`:

- `nome`
- `slug`
- `ordine`

## Note pratiche

- il build Astro non fallisce se Strapi e spento, ma la sezione News restera vuota
- le pagine dettaglio vengono generate solo per le news che Strapi restituisce al build
- se aggiungi o modifichi una news in un sito statico, devi rifare il deploy/build per vedere le nuove pagine
