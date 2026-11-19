# Fletorja e Ermirit — faqja personale (ermir-haxhia.com)

Ky folder është **paketa e dorëzimit** për ndërtimin e faqes. Dizajni dhe vendimet kryesore janë bërë në bisedë me Claude (chat). Ndërtimi i kodit të vërtetë do ta bëjë **Claude Code**, duke u nisur nga ky folder. Çdo gjë që duhet për të filluar është këtu: dizajni, përmbajtja bosh, arkitektura, plani me hapa dhe pyetjet e hapura.

> Data e paketës: 18 nëntor 2026. Domeni i synuar: **www.ermir-haxhia.com**.

---

## 1. Çfarë ka në folder

```
ermir-haxhia-website/
├── README.md                  ← ky skedar (përse, çfarë, si)
├── CLAUDE.md                  ← udhëzime të përhershme për Claude Code
├── design/
│   ├── README.md              ← si lexohen skedarët e dizajnit
│   ├── tokens.md              ← ngjyra, fonte, hapësira, animacione (vlera të sakta)
│   ├── canvas.json            ← vendosja e faqeve në canvas (nuk ka rëndësi për kodin)
│   └── pages/                 ← 8 faqet e dizajnuara (.dc.html)
├── content/
│   ├── README.md              ← si plotësohet përmbajtja
│   └── *.json                 ← përmbajtja bosh (vendet bosh janë null)
└── docs/
    ├── arkitektura.md         ← stack-u, hosting, privatësia, Shiny, PDF
    ├── plani.md               ← hapat e punës me kriter "përfundon kur..."
    └── vendime-dhe-pyetje.md  ← çfarë është vendosur dhe çfarë mungon
```

---

## 2. Përse na duhet faqja

Ermiri është student Master në Matematikë të Aplikuar, me fokus te analiza e të dhënave dhe programimi. Faqja ka katër qëllime konkrete:

1. **Të mbledhë punët në një vend:** projektet e veta, projektet e shkollës, analizat dhe leximet.
2. **Të dorëzojë projekte shkollore në mënyrë të bukur.** Shembulli i parë: një projekt në R që në janar duhet dorëzuar bashkë me një version **R Shiny app**. Aplikacioni duhet të jetë i hostuar dhe i lidhur me faqen, që pedagogu ta hapë me një link, **pa i dhënë gjithë kodin**.
3. **Të ndajë llojet e punëve.** Shkolla, analizat (Power BI, Excel, analizë të dhënash) dhe leximet nuk përzihen. Secila ka hapësirën e vet.
4. **Të ketë faqe të fshehura:** faqe që nuk dalin në asnjë listë dhe hapen vetëm me linkun që ndan Ermiri.

Faqja **nuk është** një CV e zakonshme ose një portofol me kartela të njëjta. Dizajni është qëllimisht ndryshe (shih më poshtë).

---

## 3. Koncepti i dizajnit

Faqja është një **tavolinë** me tre objekte. Çdo objekt është një hapësirë e veçantë:

| Objekti | Hapësira | Çfarë mban |
|---|---|---|
| **Fletorja** (kapak blu) | `/fletorja` | Shënime, projekte dhe projekte shkollore (si R + Shiny) |
| **Dosja** (kraft) | `/dosja` | Punë me Power BI, Excel dhe analizë të dhënash |
| **Libri** (kapak i gjelbër) | `/libraria` | Libra për Python, R e të tjerë, plus një kartelë që lidh me faqen e kurseve (SQL, ML, Data Analyst) |

Parimet:

- **Shumë i pastër dhe i kuptueshëm.** Çdo faqe duhet të kuptohet në pesë sekonda.
- **Fletore e vërtetë:** fletët kanë vija çdo 32 px, kufi të kuq në margjinë, vrima spirale, skeda sipër. Dosja ka fletë me kuadrate. Libraria ka rafte.
- **Prekje të vogla dore:** shënime me shkrim dore (Caveat), vija theksuese e verdhë, shënim i verdhë ngjitës. Vetëm si detaj, kurrë për tekst kryesor.
- **Kryefaqja ka efektin "wow":** objektet bien mbi tavolinë, emri shkruhet me animacion dhe objektet "hapen" kur i kalon miun sipër. Të gjitha animacionet respektojnë `prefers-reduced-motion`.

Detajet e sakta (vlera, kohëzime) janë te `design/tokens.md`.

---

## 4. Harta e faqes

| URL | Përshkrimi | Dizajni | Publik? |
|---|---|---|---|
| `/` | Kryefaqja: hyrje + tavolina + rreth meje + kontakt | `Kopertina.dc.html` | po |
| `/fletorja` | Ballina e fletores: hyrje, "tani në punë", përmbajtja | `Main.dc.html` | po |
| `/fletorja/projekte` | Lista e projekteve | `Projekte.dc.html` | po |
| `/fletorja/shkolle` | Detyrat/projektet sipas lëndës | `Shkolle.dc.html` | po |
| `/fletorja/shkolle/[slug]` | Faqja e një projekti shkollor me Shiny app të ngulitur | `Projekt.dc.html` | po |
| `/fletorja/kontakt` | Kontakti | `Kontakt.dc.html` | po |
| `/dosja` | Dosja e analizave (seksione Power BI, Excel, Analizë) | `Dosja.dc.html` | po |
| `/libraria` | Libraria: rafte + kartela e kurseve | `Libra.dc.html` | po |
| `/p/[kod]` | **Faqe të fshehura** (pa listë, pa sitemap, noindex) | *nuk është dizajnuar ende; merr shabllonin e `Projekt.dc.html`* | vetëm me link |

Lidhjet mes faqeve janë tashmë të vendosura në dizajn (p.sh. skeda "Kryefaqja" kthen te `/`).

---

## 5. Faqet e fshehura (e rëndësishme)

Një faqe e fshehur këtu do të thotë: **nuk ka lidhje nga asgjëkundi, nuk është në sitemap, ka `noindex`, dhe adresa ka kod të rastësishëm** (`/p/x7k2m9...`). Kush e ka linkun, e hap.

Kjo **nuk është siguri e vërtetë**. Nëse linku dërgohet më tej, e hap kushdo. Për pedagogun që duhet të shohë një Shiny app, kjo mjafton. Për diçka të ndjeshme duhet hyrje e vërtetë (Cloudflare Access). Ermiri e ka vendosur që Libraria **nuk ka nevojë për login**, pra është publike.

---

## 6. Si veprojmë (ndarja e rolit)

**Faza 1 (bërë): dizajni, me Claude në chat.** Rezultati është te `design/`.

**Faza 2 (tani): ndërtimi, me Claude Code.** Claude Code merr këtë folder dhe:

1. e lexon `CLAUDE.md`, `docs/arkitektura.md` dhe `docs/plani.md`;
2. krijon projektin (rekomandim: Astro, shih `docs/arkitektura.md`);
3. ndërton faqet një nga një sipas `docs/plani.md`, duke e marrë pamjen nga `design/pages/*.dc.html` dhe vlerat nga `design/tokens.md`;
4. e fut përmbajtjen nga `content/*.json` (jo të shpikur);
5. e vendos në Cloudflare dhe e lidh me domenin.

**Çfarë bën Ermiri vetë:**

- plotëson `content/*.json` (titujt, datat, linqet) ose ia jep Claude Code kur ta kërkojë;
- zotëron domenin dhe llogarinë në Cloudflare (Claude Code nuk i krijon llogari në emër të tij);
- publikon Shiny app-in në shinyapps.io (ose Posit Connect Cloud) nga R dhe i jep linkun;
- vendos cilat libra me PDF mund të jenë publikë (vetëm me licencë të hapur).

**Rregulli i artë:** Claude Code **nuk shpik përmbajtje**. Ku mungon një fakt, mbetet vend bosh i dukshëm (`[ ... ]`) dhe pyet Ermirin.

---

## 7. Teknologjia (përmbledhje)

Detajet dhe arsyet janë te `docs/arkitektura.md`.

- **Astro + TypeScript**, faqe statike, përmbajtja nga skedarë JSON/Markdown.
- **Cloudflare Workers me Static Assets** për hostim (Cloudflare e rekomandon këtë për projekte të reja; Pages vazhdon të funksionojë). Domeni te Cloudflare.
- **R Shiny:** hostohet te shinyapps.io (plani falas: 5 aplikacione, 25 orë aktive në muaj) dhe ngulitet me `iframe`, me një buton rezervë "Hap në faqe të plotë".
- **Libra PDF:** pak libra (6–7), pra skedarë statikë ose Cloudflare R2. Nuk duhet bazë të dhënash.
- **Faqja e kurseve** (repo ekzistuese e Ermirit) mbetet **faqe e veçantë** në nën-domen, dhe Libraria lidh me të.

---

## 8. Çfarë mungon (vende bosh)

Në dizajn dhe te `content/` këto janë ende bosh (shih listën e plotë te `docs/vendime-dhe-pyetje.md`):

- linku i LinkedIn dhe email-i;
- titujt, datat dhe përshkrimet e projekteve, punëve në dosje dhe librave;
- emri i lëndës për projektin në R;
- adresa e aplikacionit Shiny dhe e faqes së kurseve;
- teksti përfundimtar i "Rreth meje" (tani ka vetëm dy fakte);
- statusi i domenit (blerë ose jo).

---

## 9. Rregulla për përmbajtjen dhe gjuhën

- Teksti i faqes është në **shqip**. Emrat teknikë (Power BI, Shiny, SQL) mbeten si janë.
- **Pa përmbajtje të shpikur, pa statistika të rreme, pa lorem ipsum.**
- Pa emoji. Ikonat janë SVG.
- Aksesueshmëri: elemente të vërteta (`<a>`, `<button>`), kontrast ≥ 4.5:1, zona prekjeje ≥ 44 px.

---

## 10. Çfarë NUK bëjmë (tani)

- Nuk ka login, llogari përdoruesish ose komente.
- Nuk ka blog, analitikë ose formular kontakti (mund të shtohen më vonë; pyetje e hapur).
- Nuk e shkruajmë përsëri faqen e kurseve brenda kësaj faqeje.
- Nuk hedhim në faqe PDF libra me të drejta autori.

---

## 11. Si ta nisësh me Claude Code

Hape terminalin në një folder bosh të projektit, kopjo këtë folder brenda dhe nise Claude Code. Mesazhi i parë i sugjeruar:

```
Lexo README.md, CLAUDE.md, docs/arkitektura.md dhe docs/plani.md.
Pastaj nis nga hapi M0 i planit. Pyet më para se të shtosh çfarëdo
përmbajtjeje që nuk është te content/. Mos e vendos asgjë në internet
pa e pyetur.
```

Dizajni live (privat, vetëm për Ermirin): https://claude.ai/artifact/FGzMgaGbPE2fn9Rs3kwRw2
