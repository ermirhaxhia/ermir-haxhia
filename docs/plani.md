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

## M5b — Paneli admin (`/admin`)
- CMS me Git (Keystatic ose Decap; verifiko dokumentimin aktual para se të zgjedhësh) mbi skemat e `content/*.json`.
- Formularë për projekte, libra, punë të dosjes dhe faqe të fshehura; ngarkim fotosh (në repo) dhe PDF (Cloudflare R2).
- Hyrje vetëm për Ermirin; repo private; `/admin` jo në sitemap dhe me `noindex`.
- PDF me të drejta autori nuk dalin publike (shih `arkitektura.md`, seksioni 5).
- **Përfundon kur:** Ermiri shton një projekt me foto dhe një libër me PDF nga paneli, dhe ato shfaqen në faqe pas rindërtimit pa prekur kod.

## M6 — Faqet e fshehura
- `/p/[kod]` nga `faqe-te-fshehura.json`, `noindex`, jo në sitemap.
- **Përfundon kur:** një faqe provë hapet me kod dhe nuk del në sitemap, `robots.txt` ose lidhje.

## M7 — Cilësia
- Aksesueshmëri (tastierë, kontrast, fokus), Lighthouse ≥ 90, imazhe, meta/OG, 404.
- **Përfundon kur:** lista te `CLAUDE.md` ("Kontrolli para se të thuash gati") kalon e plotë.

## M8 — Publikimi (vetëm me konfirmim nga Ermiri)
- Lidh repo-n me Cloudflare, deploy, domeni `www.ermir-haxhia.com`, ridrejtimi i domenit bosh.
- **Përfundon kur:** faqja hapet në domenin real me HTTPS dhe Ermiri e ka konfirmuar.

## M9 — Pas publikimit
- Lidh faqen e kurseve (nën-domen), shto përmbajtjen reale me Ermirin, vendos për analitikën dhe versionin anglisht.
