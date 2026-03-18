# Blueprint Strapi

Questa cartella contiene una `src` minima ma completa da copiare dentro il tuo progetto Strapi.

## Dove copiare

Dal progetto Astro:

- `docs/strapi-blueprint/src`

Nel progetto Strapi:

- sostituisci o sovrascrivi la cartella `src`

## Risultato

Dopo il riavvio di Strapi troverai:

- collection type `Tipologia produzione`
- collection type `Produzione`
- componenti riusabili per link, SEO, crediti e informazioni
- route API registrate per entrambi i content type
- file root `src/index.js` gia presente

## Nota

Il frontend Astro e gia pronto a leggere questi contenuti dall'endpoint:

- `GET /api/produzioni`

con `populate=*`.

## Importante

Se nel ruolo `Public` non vedi `Produzione` o `Tipologia produzione`, non sei nel posto sbagliato:

- sei in quello giusto
- il problema e che Strapi non ha registrato le route API

Per questo nel blueprint ci sono anche:

- `controllers`
- `routes`
- `services`
- `index.js`
