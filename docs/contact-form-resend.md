# Form contatti con Resend

Il form della pagina contatti invia i dati a `POST /api/contact`, gestito in [src/pages/api/contact.ts](/Users/stefanopaolucci/Desktop/marvindrone/src/pages/api/contact.ts).

## Variabili ambiente richieste

Usa questi valori in locale dentro `.env` e in produzione dentro Cloudflare Pages:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@marvindrone.com
RESEND_TO_EMAIL=info@marvindrone.com
```

## Come impostarle

`RESEND_API_KEY`
Chiave API generata in Resend.

`RESEND_FROM_EMAIL`
Mittente usato dal sito. Deve appartenere a un dominio verificato su Resend. Resend consente di inviare da qualsiasi indirizzo del dominio verificato, senza creare prima la mailbox.

`RESEND_TO_EMAIL`
Casella che riceve i messaggi del form. Puoi usare anche piu destinatari separati da virgola.

## Turnstile opzionale

Se vuoi protezione antispam aggiungi anche:

```env
PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Se lasci questi due valori vuoti, il form continua a funzionare senza widget antispam.

## Cloudflare Pages

Per questo progetto l'adapter Astro attivo e Cloudflare. In Cloudflare Pages imposta:

1. `Workers & Pages`
2. progetto `marvindrone`
3. `Settings`
4. `Variables and Secrets`

Inserisci `RESEND_API_KEY` come secret. Gli altri valori possono essere variabili normali oppure secret.

## Verifica rapida

1. Avvia `npm run dev`
2. Apri `/contatti/`
3. Invia il form
4. Controlla la mailbox definita in `RESEND_TO_EMAIL`

## Riferimenti

- Resend email API: https://resend.com/docs/api-reference/emails/send-email
- Resend con Cloudflare Workers: https://resend.com/docs/send-with-cloudflare-workers
- Cloudflare Pages variables and secrets: https://developers.cloudflare.com/pages/functions/bindings/
