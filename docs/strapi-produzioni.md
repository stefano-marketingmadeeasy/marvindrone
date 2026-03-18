# Strapi per la sezione Produzioni

Il frontend Astro e gia pronto. Quello che devi fare adesso e allineare il tuo backend Strapi al blueprint che ho preparato in [docs/strapi-blueprint](/Users/stefanopaolucci/Desktop/marvindrone2/docs/strapi-blueprint).

## Variabili ambiente del frontend

Nel progetto Astro crea `.env` partendo da [.env.example](/Users/stefanopaolucci/Desktop/marvindrone2/.env.example#L1):

```bash
STRAPI_URL=https://cms.tuodominio.it
STRAPI_TOKEN=
STRAPI_PRODUCTIONS_ENDPOINT=produzioni
```

`STRAPI_URL` puo essere sia l'origin del progetto Strapi sia un URL che termina con `/api`.

## Cosa e gia pronto lato Astro

- lettura endpoint Strapi in [src/lib/strapi/client.ts](/Users/stefanopaolucci/Desktop/marvindrone2/src/lib/strapi/client.ts#L1)
- normalizzazione delle produzioni in [src/lib/strapi/productions.ts](/Users/stefanopaolucci/Desktop/marvindrone2/src/lib/strapi/productions.ts#L1)
- archivio filtrabile in [src/pages/produzioni/index.astro](/Users/stefanopaolucci/Desktop/marvindrone2/src/pages/produzioni/index.astro#L1)
- pagine dettaglio in [src/pages/produzioni/[category]/[slug].astro](/Users/stefanopaolucci/Desktop/marvindrone2/src/pages/produzioni/[category]/[slug].astro#L1)
- script di check connessione `npm run check:strapi`

## Blueprint da copiare nel progetto Strapi

Dentro [docs/strapi-blueprint](/Users/stefanopaolucci/Desktop/marvindrone2/docs/strapi-blueprint#L1) trovi:

- collection type `Produzione`
- collection type `Tipologia produzione`
- componenti `shared.text-item`, `shared.link`, `shared.seo`
- componenti `produzione.credito`, `produzione.informazione`
- un esempio payload in `examples/produzione-sample.json`

## Procedura consigliata

1. Copia il contenuto di `docs/strapi-blueprint/src/` dentro `src/` del tuo progetto Strapi.
2. Riavvia Strapi.
3. Apri il pannello admin e verifica che esistano:
   - `Tipologia produzione`
   - `Produzione`
4. Crea prima le tipologie, ad esempio:
   - `Film` con slug `film`
   - `Serie TV` con slug `serie-tv`
   - `Documentario` con slug `documentario`
5. Crea almeno una produzione completa e pubblicala.
6. Se in `Public` non vedi `Produzione` o `Tipologia produzione`, controlla di aver copiato anche:
   - `src/api/produzione/routes`
   - `src/api/produzione/controllers`
   - `src/api/produzione/services`
   - `src/api/tipologia-produzione/routes`
   - `src/api/tipologia-produzione/controllers`
   - `src/api/tipologia-produzione/services`
7. Se vuoi usare API pubbliche:
   - abilita per il ruolo `Public` le permission `find` e `findOne` su `Produzione`
   - abilita per il ruolo `Public` le permission `find` e `findOne` su `Tipologia produzione`
8. Se non vuoi API pubbliche:
   - lascia tutto privato
   - genera un API token read-only in Strapi
   - inseriscilo in `STRAPI_TOKEN`
9. Nel progetto Astro configura `.env`.
10. Esegui `npm run check:strapi`.
11. Se il check va bene, esegui `npm run dev` oppure `npm run build`.

## Endpoint atteso

Il frontend legge:

- `GET /api/produzioni?pagination[pageSize]=500&populate=*`

e usa:

- `tipologia.slug` per il filtro e per l'URL
- `slug` della produzione per la pagina dettaglio

## Campi previsti dal blueprint

Collection type `Produzione`:

- `title`
- `slug`
- `excerpt`
- `synopsis`
- `body`
- `releaseDate`
- `year`
- `duration`
- `stato`
- `genre`
- `location`
- `broadcaster`
- `trailerUrl`
- `sortOrder`
- `featured`
- `tipologia`
- `heroImage`
- `poster`
- `gallery`
- `cast`
- `awards`
- `tags`
- `credits`
- `facts`
- `externalLinks`
- `seo`

Collection type `Tipologia produzione`:

- `name`
- `slug`
- `order`

## Note pratiche

- il build Astro non fallisce se Strapi e spento, ma la pagina produzioni restera vuota
- le pagine dettaglio vengono generate solo per le produzioni che Strapi restituisce al build
- se aggiungi una nuova produzione e il sito e statico, devi rifare il deploy/build per vedere la nuova pagina
