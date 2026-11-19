# Arkitektura

Ky dokument shpjegon **çfarë ndërtojmë, me çfarë, dhe pse**. Janë rekomandime; ku ka rrezik thuhet qartë.

## 1. Vendimi i përgjithshëm

> **Vendim i ri (nëntor 2026):** Ermiri kërkon panel admin me hyrje të mbrojtur, dhe përmbajtje (tekste, foto, PDF) që ndryshon pa prekur kod. Prandaj faqja **nuk është më vetëm statike**: përmbajtja jeton në **Cloudflare D1** (të dhëna) dhe **R2** (skedarë), faqet publike e lexojnë **direkt nga D1 në çdo kërkesë**, dhe `/admin` mbrohet nga **Cloudflare Access**. Pjesët e mëposhtme që thonë "statik" ose "JSON" vlejnë për gjendjen e mëparshme; ku ka kundërshti, ky paragraf mbizotëron. Seksionet 5 dhe 6 janë përditësuar në fund.

Dizajni mbetet përmbajtje me shumë tekst dhe pak JS në shfletues. Pjesët dinamike janë: leximi nga D1, paneli `/admin`, ngarkimi në R2, dhe aplikacionet e jashtme (Shiny, faqja e kurseve).

| Pjesa | Zgjedhja | Pse |
|---|---|---|
| Framework | **Astro** + adapteri Cloudflare (SSR) + TypeScript | Faqet publike lexojnë nga D1 në çdo kërkesë; JS minimal në shfletues. |
| Përmbajtja | **D1** (burimi i së vërtetës). `content/*.json` mbeten vetëm si të dhëna fillestare (seed) dhe për skemat zod. | Panelet ndryshon përmbajtjen pa rindërtim. |
| Skedarët | **R2** (PDF, foto) | Shih seksionin 5. |
| Hyrja në `/admin` | **Cloudflare Access** | Pa sistem login-i të vetin. Kodi verifikon edhe kokën e Access. |
| Stilet | CSS i thjeshtë me variabla nga `design/tokens.md` (ose Tailwind nëse Claude Code e sheh më të përshtatshme) | Dizajni ka shumë vlera të sakta inline; variablat i mbajnë të njëjta. |
| JS në shfletues | Pothuajse asnjë. Vetëm butoni "Kopjo linkun" (clipboard). | Skena e kryefaqes dhe hover-at janë CSS i pastër. |
| Hostimi | **Cloudflare Workers me Static Assets** | Shih seksionin 3. |
| Aplikacioni R Shiny | **shinyapps.io**, i ngulitur me `iframe` | Cloudflare nuk e ekzekuton R. |
| Libra PDF | Skedarë statikë ose **Cloudflare R2** | Shih seksionin 5. |
| Faqja e kurseve | Projekt i veçantë, në nën-domen | Ekziston tashmë si repo; nuk e rindërtojmë. |

## 2. Rrugët

Shih tabelën te `README.md`. Rregulla:

- URL të vogla, pa shkronja të mëdha, pa shenja shqipe në rrugë (`/fletorja/shkolle`, jo `/fletorja/shkollë`).
- `www.ermir-haxhia.com` dhe `ermir-haxhia.com`: njëra ridrejton te tjetra (zgjidh një kanonike).
- `lang="sq"` në `<html>`; `<title>` unik për çdo faqe.

## 3. Hostimi në Cloudflare

- Për projekte të reja Cloudflare e rekomandon **Workers me Static Assets**; Pages vazhdon të funksionojë por merr më pak veçori të reja. Rekomandimi ynë: Workers. Kontrollo dokumentimin zyrtar kur fillon, sepse kjo ka ndryshuar vitet e fundit.
- Build: `astro build` jep `dist/`. Konfigurimi (`wrangler.jsonc`) tregon `assets.directory: "./dist"`.
- Deploy nga Git (Workers Builds) dhe URL-të e parapamjes për çdo degë.
- Domeni lidhet te Cloudflare (DNS dhe "Custom domain"). Nëse domeni është blerë diku tjetër, ose transferohet, ose ndërrohen nameserver-ët.
- **Rrezik për t'u verifikuar:** që titrat HTTP të personalizuar për `/p/*` (`X-Robots-Tag`) të funksionojnë me Static Assets. Nëse `_headers` nuk respektohet, mjafton `<meta name="robots" content="noindex,nofollow">` në çdo faqe të fshehur, ose një Worker i vogël përpara.

## 4. R Shiny app

- Publikohet nga R me `rsconnect::deployApp()` te **shinyapps.io**. Adresa ka formën `https://<llogaria>.shinyapps.io/<aplikacioni>/`.
- **Plani falas:** 5 aplikacione, 25 orë aktive në muaj, kryesisht për demo me pak përdorues njëkohësisht. Orët aktive numërohen sa kohë aplikacioni është ndezur; koha e papunësisë para fjetjes është 15 minuta si parazgjedhje dhe mund të shkurtohet.
- **Domeni i vetë nuk mbështetet në planin falas** (vetëm plani Professional). Pra aplikacioni mbetet te `*.shinyapps.io`, dhe faqja jonë e ngulit.
- Ngulitja: `<iframe src="..." title="..." loading="lazy">` me lartësi ~720 px dhe buton rezervë "Hap në faqe të plotë" (një lidhje e zakonshme). **Provoje herët** që `iframe` të punojë në praktikë.
- Alternativë: Posit Connect Cloud (Posit ka plan falas); nuk e kemi verifikuar këtu, kontrolloje kur të vijë koha.
- Pedagogu e hap faqen `/p/[kod]` (ose `/fletorja/shkolle/projekt-r-shiny`) dhe sheh aplikacionin, **pa marrë kodin**.

## 5. Librat dhe PDF-të

- Pak libra (Ermiri thotë 6–7), nga disa MB deri 30 MB secili. **Nuk na duhet bazë të dhënash.** Lista e librave është `content/libra.json`.
- Skedarët PDF: ose në `public/` (nëse janë të vegjël dhe me licencë të hapur), ose në **Cloudflare R2** (10 GB falas, pa tarifa shkarkimi), me nën-domen publik (p.sh. `files.ermir-haxhia.com`) dhe lidhje nga `skedari`.
- **D1 nuk përdoret për PDF.** Një rresht ose BLOB në D1 kufizohet në 2 MB, dhe baza falas në 500 MB.
- **Të drejtat e autorit:** në faqe publike hidhen vetëm libra me licencë të hapur (p.sh. "R for Data Science"). Për të tjerët shfaqen vetëm titulli, autori dhe statusi.

## 6. Faqet e fshehura (`/p/[kod]`)

- Gjenerohen në build nga `content/faqe-te-fshehura.json`.
- `<meta name="robots" content="noindex,nofollow">`; jo në sitemap; jo në `robots.txt` (që të mos zbulohen); asnjë lidhje nga faqet publike.
- Kodi: ≥ 12 shenja të rastësishme.
- **Kujdes me repo-n:** nëse është publike, kodet janë të lexueshme. Repo private, ose kodet jashtë repo-s.
- Nuk është siguri e vërtetë. Për hyrje të vërtetë: Cloudflare Access (kod një-përdorimësh me email). Nuk kërkohet tani.

## 7. Kryefaqja

- Skena me tre objekte është **vetëm HTML dhe CSS**: pozicione në përqindje brenda një kontejneri me `container-type: inline-size`, madhësi në `cqw`, animacione `@keyframes`, hover me `transform`, `perspective` për hapjen e kapakëve.
- Nuk përdoren biblioteka animacioni. Respekto `prefers-reduced-motion`.
- Në prekje (pa hover): objektet hapen si lidhje normale; hover-i është përmirësim, jo detyrim.
- Vlerat e sakta janë te `design/tokens.md`.

## 8. Performanca dhe SEO

- Font-et nga Google Fonts me `preconnect` dhe `display=swap`; opsionale: vetë-hostim për të shmangur kërkesa të jashtme.
- Imazhet (pamjet e punëve në dosje): `loading="lazy"`, madhësi të përcaktuara, formate moderne (`webp`/`avif`).
- Sitemap pa faqet e fshehura; `<meta name="description">` dhe imazh Open Graph për kryefaqen.
- Synim: Lighthouse ≥ 90 në Performance, Accessibility, Best Practices, SEO.

## 9. Çfarë nuk është vendosur

Analitika, forma e kontaktit, versioni anglisht, blog. Shih `vendime-dhe-pyetje.md`.

## Burimet

- Cloudflare R2, çmimet: https://workers.cloudflare.com/product/r2/
- Cloudflare D1, kufijtë: https://developers.cloudflare.com/d1/platform/limits
- Workers kundrejt Pages (2026): https://flaviocopes.com/cloudflare-pages-vs-workers/
- shinyapps.io, kufijtë e planit falas: https://support.posit.co/hc/en-us/articles/217592947-What-are-the-limits-of-the-shinyapps-io-Free-plan
- shinyapps.io, planet dhe domeni i vetë: https://www.shinyapps.io/
- Aplikacionet në shinyapps.io: https://docs.posit.co/shinyapps.io/guide/applications/index.html
