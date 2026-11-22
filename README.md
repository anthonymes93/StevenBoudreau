# Boudreau Carpentry Services

Production-oriented multipage React/Vite website for Boudreau Carpentry Services (Halifax, Nova Scotia). Uses project photos supplied by the client, optimized locally as WebP.

## Pages
Home, Services, Residential, Commercial, Our Work, About, Contact. Includes mobile navigation, motion effects with reduced-motion support, responsive image galleries and lightbox, and semantic accessibility-friendly elements.

## Local development
`npm install` then `npm run dev`. Build with `npm run build`.

## Cloudflare Pages
Connect GitHub repository to **Cloudflare Pages**. Framework preset **Vite**; build command **`npm run build`**, output directory **`dist`**. Root directory `/`. Functions live in `/functions/api/contact.js` and are automatically deployed by Cloudflare Pages. `_redirects` supports client-side page refreshes.

Configure Cloudflare Pages environment variables (Production and Preview as needed):
- `RESEND_API_KEY` — Resend API key for your verified sending domain.
- `CONTACT_FROM_EMAIL` — recommended `Boudreau Carpentry <emails@rtuino.com>` (sending domain must be verified).
- `CONTACT_TO_EMAIL` — set to `stevenboudreau@gmail.com` for direct delivery, or override with your preferred lead-routing inbox.

The form sends subject `Website Enquiries`, escapes user input in outgoing HTML, validates submissions and shows a success state only when Resend accepts the request. It does **not** work on a standalone Vite-only server because the `/api/contact` endpoint must run under Cloudflare Pages Functions. No Turnstile keys were provided; a honeypot is included, but configure server-side Turnstile before launch if spam protection is required.

## Before going live
- Confirm business service radius, project descriptions, licensing/insurance statements (not assumed or claimed), and visual approval of each supplied photo.
- Set required environment variables and submit a live test enquiry.
- Configure the final domain and add it to the canonical/SEO config once known.

All photographs in `public/assets/` are drawn from the supplied client archive. No stock photos, fake testimonials, or invented credentials.