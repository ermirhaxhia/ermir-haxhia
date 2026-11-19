# Dizajni

Dizajni u bë në një canvas Design të Claude. Skedarët `pages/*.dc.html` janë **burimi i pamjes**: struktura, teksti, ngjyrat dhe hapësirat janë të shkruara inline në çdo skedar.

## Si t'i lexosh

- Format i veçantë `.dc.html`: një faqe HTML me `<x-dc>` ku bëhet pamja, `<helmet>` për font-et dhe CSS bazë, dhe një skript i vogël bosh. Nuk hapen si faqe të pavarura (mungon `support.js`).
- **Mos i kopjo si kod.** Ri-ndërtoji si komponente Astro. Ruaj: strukturën, tekstin, vlerat e pikselave, ngjyrat, kohëzimet e animacioneve.
- Stilet janë inline dhe për këtë janë të gjata. Kërko komponente që përsëriten: fleta me vija, skeda, rreshta, etiketa, kartela.

## Harta: skedar → rrugë

| Skedar | Rruga | Shënime |
|---|---|---|
| `Kopertina.dc.html` | `/` | Kryefaqja. Skena me tre objekte, animacione, hover që hap objektet. Pastaj "Rreth meje" dhe "Kontakt". |
| `Main.dc.html` | `/fletorja` | Ballina e fletores. Skedat sipër (Ballina, Projekte, Shkollë, Kontakt) + lidhja "Kryefaqja". |
| `Projekte.dc.html` | `/fletorja/projekte` | Rreshta: data, emri, përshkrimi, statusi. |
| `Shkolle.dc.html` | `/fletorja/shkolle` | Rreshta të grupuar sipas lëndës. Rreshti me "hap" lidhet me faqen e projektit. |
| `Projekt.dc.html` | `/fletorja/shkolle/[slug]` | Dritare shfletuesi për Shiny app, butonat, fusha "Linku për ndarje". Shabllon edhe për faqet e fshehura. |
| `Kontakt.dc.html` | `/fletorja/kontakt` | |
| `Dosja.dc.html` | `/dosja` | Skeda kraft (Kopertina, Power BI, Excel, Analizë); kartela me pamje; fletë me kuadrate. |
| `Libra.dc.html` | `/libraria` | Rafte me libra (kapak me ngjyrë sipas kategorisë) dhe kartela e kurseve. |

`canvas.json` përmban vetëm vendosjen e kornizave në canvas. Nuk ka rëndësi për kodin, por tregon çfarë faqe ekzistojnë.

## Çfarë nuk është dizajnuar ende

- Faqja e një libri të vetëm (nuk është kërkuar).
- Faqja e një pune në dosje (karta tani nuk lidhet askund; pyetje e hapur).
- Shablloni i faqeve të fshehura (merr pamjen e `Projekt.dc.html`).
- Gjendjet e gabimit (404) dhe e `Kopjo linkun` pas klikimit.
- Versioni i errët. Nuk është planifikuar.

Dizajni live (privat): https://claude.ai/artifact/FGzMgaGbPE2fn9Rs3kwRw2
