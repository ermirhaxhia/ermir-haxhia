# Plani i punës

Çdo hap ka kriter **"përfundon kur..."**. Mos kalo te hapi tjetër pa e plotësuar. Në fund të çdo hapi, trego Ermirit çfarë ndryshoi.

## M0 — Themeli
- Krijo projektin Astro (TypeScript, output statik), git, `.gitignore`, `.env.example`.
- Ngarko variablat nga `design/tokens.md` si CSS globale; font-et; `lang="sq"`.
- Shabllon bazë (header, fleta me vija, skedat) si komponente.
- **Përfundon kur:** `npm run build` kalon dhe një faqe bosh hapet me sfondin e tavolinës dhe font-et e sakta.

## M1 — Skeleti dhe përmbajtja
- Content Collections me skema për çdo `content/*.json`; vlerat `null` shfaqen si `[ ... ]`.
- Të gjitha rrugët nga README ekzistojnë dhe lidhen mes tyre.
- **Përfundon kur:** çdo rrugë hapet pa 404 dhe skedat/lidhjet "Kryefaqja" funksionojnë.

## M2 — Kryefaqja (`/`)
- Ndërto `Kopertina.dc.html`: hero me animacion, skena me tre objekte, "Rreth meje", "Kontakt", footer.
- **Përfundon kur:** pamja përputhet me dizajnin në 1280 px dhe 390 px; hover/fokus hapin objektet; me `prefers-reduced-motion` nuk ka animacion.

## M3 — Fletorja
- `Main`, `Projekte`, `Shkolle`, `Kontakt` si faqe me fletë me vija.
- **Përfundon kur:** të katër faqet përputhen me dizajnin dhe lexojnë nga JSON.

## M4 — Faqja e projektit + Shiny
- Shablloni `/fletorja/shkolle/[slug]` nga `Projekt.dc.html`: iframe, "Hap në faqe të plotë", "Raporti PDF", "Kopjo linkun".
- Provo `iframe` me aplikacionin real (kur Ermiri ta ketë publikuar në shinyapps.io); nëse bllokohet, lidhja e plotë mbetet rruga kryesore.
- **Përfundon kur:** aplikacioni hapet brenda faqes ose, kur nuk ka ende URL, shfaqet gjendje e qartë "do të shtohet".

## M5 — Dosja dhe Libraria
- `/dosja` nga `Dosja.dc.html` (kartela me pamje, skeda seksionesh).
- `/libraria` nga `Libra.dc.html` (rafte, kartela e kurseve me lidhje te nën-domeni).
- **Përfundon kur:** të dyja përputhen me dizajnin dhe lexojnë nga `dosja.json` / `libra.json`.

## M5b — D1 dhe lexim direkt (vendim: faqet publike lexojnë nga D1 në çdo kërkesë)
- Adapteri Cloudflare (SSR), `wrangler.jsonc`, lidhja me D1 (verifiko dokumentimin aktual para se të zgjedhësh versionet).
- Skema D1 dhe migrime për: projekte, punë shkollore (lëndë, projekt, `shiny_url`…), dosja (seksione, punë), libra (rafte, libra), kontakt, rreth meje, faqe të fshehura (me kodin).
- Skript "seed" që mbush D1 nga `content/*.json`; skemat zod mbeten për validim.
- Faqet publike lexojnë nga D1 (në zhvillim: D1 lokale me `wrangler`, pa prekur llogarinë).
- **Përfundon kur:** të gjitha faqet publike shfaqin të njëjtën përmbajtje nga D1 lokale si më parë nga JSON, dhe `npm run build` kalon.

## M5c — R2 dhe skedarët
- Bucket R2 për PDF dhe foto; lidhja me Worker-in; adresë publike për foto dhe lidhje e kontrolluar për PDF.
- PDF me të drejta autori nuk dalin publike (shih `arkitektura.md`, seksioni 5).
- **Përfundon kur:** një foto dhe një PDF provë ngarkohen lokalisht dhe shfaqen në faqe.

## M5d — Paneli admin (`/admin`) me Cloudflare Access (ndërtuar dhe provuar lokalisht; mbetet aktivizimi i Access, shih `access.md`)
- Formularë për projekte, libra, punë të dosjes, kontakt dhe faqe të fshehura; ngarkim skedarësh në R2; validim në server.
- Hyrje vetëm për Ermirin: Cloudflare Access (email + kod një-përdorimësh) mbi `/admin/*` dhe API-n e tij. Kodi i panelit duhet të verifikojë edhe vetë kokën e Access, jo vetëm të mbështetet te rrjeti.
- `/admin` jo në sitemap, me `noindex`.
- **Përfundon kur:** Ermiri shton një projekt me foto dhe një libër me PDF nga paneli dhe ato shfaqen menjëherë në faqe, pa prekur kod; një vizitor pa hyrje nuk arrin te `/admin`.

## M6 — Faqet e fshehura (bërë)
- `/p/[kod]`, `noindex`, jo në sitemap. Pas M5b kodet jetojnë në D1, jo në repo.
- **Përfundon kur:** një faqe provë hapet me kod dhe nuk del në sitemap, `robots.txt` ose lidhje.

## M7 — Cilësia
- Aksesueshmëri (tastierë, kontrast, fokus), Lighthouse ≥ 90, imazhe, meta/OG, 404.
- **Përfundon kur:** lista te `CLAUDE.md` ("Kontrolli para se të thuash gati") kalon e plotë.

## M8 — Publikimi (vetëm me konfirmim nga Ermiri)
- Krijo te Cloudflare: D1, bucket R2 dhe Access për `/admin` (Ermiri i krijon ose i miraton).
- Lidh repo-n me Cloudflare, deploy (fillimisht në `*.workers.dev`), pastaj domeni `www.ermirhaxhia.com` dhe ridrejtimi i domenit bosh.
- **Përfundon kur:** faqja hapet në domenin real me HTTPS dhe Ermiri e ka konfirmuar.

## M9 — Pas publikimit
- Lidh faqen e kurseve (nën-domen), shto përmbajtjen reale me Ermirin, vendos për analitikën dhe versionin anglisht.
