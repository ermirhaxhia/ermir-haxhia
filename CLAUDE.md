# CLAUDE.md — udhëzime për Claude Code

Projekti: faqja personale e Ermir Haxhias (www.ermirhaxhia.com). Lexo `README.md` për përshkrimin e plotë.

## Burimet e së vërtetës

- **Pamja, struktura, teksti:** `design/pages/*.dc.html`. Janë burim dizajni, jo kod për ta kopjuar. Formati është i veçantë (`<x-dc>`, `<helmet>`, stile inline). Ri-ndërtoji si komponente Astro, duke ruajtur vlerat e sakta.
- **Vlerat (ngjyra, fonte, hapësira, animacione):** `design/tokens.md`.
- **Përmbajtja:** `content/*.json`. Mos shpik përmbajtje. Vendet bosh janë `null`, dhe shfaqen në faqe si `[ ... ]` të dukshme.
- **Arkitektura dhe plani:** `docs/arkitektura.md`, `docs/plani.md`.
- **Çfarë mungon:** `docs/vendime-dhe-pyetje.md`. Pyet Ermirin para se të supozosh.

## Gjuha

- Teksti i faqes, dokumentet dhe komentet e kodit: **shqip**.
- Emrat e skedarëve, variablave, komponenteve dhe commit-et: anglisht.
- Ermiri preferon: kod të pastër që funksionon, pa shpjegime të panevojshme. Dokumentacioni mund të jetë i detajuar.

## Stili i punës

- Ndërto sipas `docs/plani.md`, një hap në një kohë. Në fund të çdo hapi: trego çfarë ndryshoi dhe si ta kontrollojë Ermiri.
- **Mos shto seksione, faqe ose tekste që nuk janë në dizajn pa pyetur.** Ndryshime të vogla mbeten të vogla.
- Mos publiko, mos bli, mos ndrysho DNS ose llogari në Cloudflare pa konfirmim të qartë nga Ermiri.
- Asnjë sekret (çelësa, tokena) në repo. Përdor variabla mjedisi.
- Mos fut në repo PDF libra me të drejta autori.

## Rregulla të dizajnit që nuk shkelen

- Pa emoji, pa gradient-e dekorative, pa kartela me kufi të majtë me ngjyrë.
- Elemente të vërteta: `<a href>`, `<button>`, `<input>` + `<label>`. Asnjëherë `div` me `onClick`.
- Kontrast teksti ≥ 4.5:1 (≥ 3:1 për tekst ≥ 24 px). Zona prekjeje ≥ 44 px.
- Faqet duhet të punojnë në telefon (390 px). Rrjetat shembin në një kolonë.
- Animacionet shfaqen vetëm kur `prefers-reduced-motion` nuk është `reduce`.
- Ikonat: SVG inline, me `aria-hidden="true"` ose `aria-label`.

## Faqet e fshehura (`/p/[kod]`)

Pa lidhje nga faqet publike, jo në sitemap, jo në `robots.txt`, `noindex` në meta dhe në header (`X-Robots-Tag`), kod i rastësishëm (≥ 12 shenja). Mos i quaj "të sigurta": janë vetëm të pa-listuara.

## Kontrolli para se të thuash "gati"

- `npm run build` kalon pa gabime.
- Çdo faqe hapet në 390 px dhe 1280 px pa tekst që del jashtë.
- Lidhjet e brendshme funksionojnë (nuk ka 404).
- Kontrast dhe fokus me tastierë i kontrolluar.
- Vendet bosh janë ende të dukshme, jo të fshehura.
