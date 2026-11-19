# Tokens e dizajnit

Vlerat janë nxjerrë nga dizajni. Ruaji si variabla CSS (`--color-ink`, etj.) dhe përdori kudo.

## Ngjyra

| Emri | Vlera | Përdorimi |
|---|---|---|
| `desk` | `#E9E6DF` | Sfondi i tavolinës (me pika: `radial-gradient(rgba(30,34,48,0.07) 1px, transparent 1px)` 24 px) |
| `paper` | `#FDFCF8` | Fleta, etiketat |
| `paper-warm` | `#F6F3EA` | Fleta të prapme, shënime të fshehura |
| `ink` | `#1E2230` | Teksti kryesor, butonat e errët |
| `muted` | `#5A6072` | Tekst dytësor (vetëm ≥ 14 px ose mono) |
| `muted-strong` | `#4A5062` | Tekst dytësor i vogël, etiketa |
| `rule` | `#DCE1EA` | Vijat e fletores (1 px çdo 32 px) |
| `grid` | `#E4E8EF` | Kuadratet e dosjes (24 px) |
| `margin-red` | `#E5A0A0` | Vija e kuqe në margjinë të fletores |
| `border` | `#CFCAC0` | Kufijtë e fletës |
| `accent` | `#2F4FA3` | Lidhje, numra seksionesh, theks |
| `highlight` | `#F7E58B` | Vija theksuese e verdhë, shënimi ngjitës |
| `sticky-ink` | `#3A3320` | Teksti mbi shënimin e verdhë |
| `navy` | `#232B4A` | Kapaku i fletores |
| `navy-ink` | `#F3F1EA` | Tekst mbi blu |
| `kraft` | `#C9A56E` | Dosja; raft i librave |
| `kraft-dark` | `#B8935A` | Skeda e dosjes, kufij |
| `kraft-ink` | `#2B2113` | Tekst mbi kraft |
| `sage` | `#4F6B5A` | Kapaku i librit |
| `sage-light` | `#A9BFB0` | Skeda e librarisë |
| `sage-ink` | `#1E2A22` | Tekst mbi skedën sage |
| `gold` | `#D9C58A` | Kornizat e kapakut të librit |
| `index-red` | `#D96B6B` | Vija e kartelës së indeksit |
| `dashed` | `#7A8093` | Kufi i ndërprerë (shënime të fshehura) |

## Tipografia

Të gjitha nga Google Fonts (një `<link>`; ngarko me `display=swap`):

- **Inter** 400, 500, 600, 700: teksti dhe titujt. Titujt `font-weight: 650–700`, `letter-spacing: -0.02em` deri `-0.04em` (emri i madh).
- **JetBrains Mono** 400, 500: etiketa, data, statusa. 11–13 px, `letter-spacing: 0.08–0.1em`, shpesh `text-transform: uppercase`.
- **Caveat** 500, 700: **vetëm** shënime me shkrim dore (24–28 px) dhe shënimi ngjitës.

| Elementi | Madhësia |
|---|---|
| Emri në kryefaqe (h1) | `clamp(56px, 8.4vw, 112px)`, line-height 1 |
| h1 i faqeve të brendshme | `clamp(34px, 5vw, 48px)` |
| h2 | 26–40 px |
| Paragraf hyrës | 18–22 px |
| Rresht i listës | titulli 18 px / 600, përshkrimi 15 px |
| Etiketë mono | 11–13 px |

## Hapësira dhe forma

- **Ritmi i fletores:** `line-height: 32px`. Seksionet ndahen me 56–64 px. Titulli i seksionit ka lartësi 64 px.
- **Fleta e brendshme:** `max-width: 1040px`, padding `56px clamp(20px,5vw,56px) 72px clamp(56px,9vw,112px)` (majtas më shumë për margjinën). Margjina e kuqe në `left: clamp(40px,8vw,88px)`, 2 px.
- **Kryefaqja:** `max-width: 1120px`, padding anësor `clamp(16px,4vw,48px)`.
- **Rrezet:** fleta `4px 12px 12px 12px`; butona 8 px; etiketa/chips 999 px; kapakë librash `3px 10px 10px 3px`.
- **Hije:** fleta `0 18px 40px -24px rgba(30,34,48,0.35)`; objektet `0 34px 40px -22px rgba(30,34,48,0.55)`.
- **Butonat:** lartësia ≥ 44 px (kryesorët 52 px); i errët = `ink` mbi `paper`; kontur = 1.5 px `ink`.
- **Vrimat spirale:** kolonë 28 px në majtas, rrathë 14 px çdo 64 px.

## Skena e kryefaqes (objektet)

Kontejneri i skenës: `aspect-ratio: 1 / 1.04`, `container-type: inline-size`; madhësitë e brendshme në `cqw`.

| Objekti | Pozicioni (majtas, sipër) | Gjerësia | Rrotullimi | Rendi (z) |
|---|---|---|---|---|
| Fletorja (3:4) | 1%, 9% | 43% | −5° | 1 |
| Libri (2:3) | 65%, 0% | 34% | +6° | 1 |
| Dosja (4:3) | 31%, 55% | 64% | +3° | 3 |
| Stilolapsi | 1%, poshtë 8% | 40% | −14° | 2 |

Çdo objekt është një lidhje (`<a>`) me `aria-label` dhe një etiketë të dukshme (Fletorja, Dosja, Libraria + shigjetë).

## Animacionet

| Emri | Çfarë bën | Kohëzimi |
|---|---|---|
| `drop` | objekti bie nga sipër (−70 px, scale 1.08 → normal, opacity 0 → 1) | 0.9 s, `cubic-bezier(.2,.8,.2,1)`, vonesa: fletorja .25 s, libri .35 s, dosja .45 s, stilolapsi .7 s, shënimi ngjitës 1.2 s |
| `rise` | rreshtat e emrit dalin nga një maskë | 0.9 s, vonesa .1 s dhe .25 s |
| `sweep` | vija e verdhë tërhiqet poshtë "Ermir" | 0.9 s, vonesa 1 s |
| `fade` | teksti ndihmës shfaqet | 0.8 s, vonesa 1.5 s |

**Hover / fokus (tastierë):**

- objekti ngrihet `−2.6cqw` dhe rrotullimi zvogëlohet në 30%;
- kapaku i fletores dhe i librit hapet `rotateY(-36deg)` (0.65 s, origjina majtas, `perspective: 1400px`) dhe tregon një faqe me tekst: fletorja "Projekt në R + Shiny app · dorëzim janar", libri "Python / R / SQL · ML";
- nga dosja ngrihen dy fletë (`translateY(-30%)` dhe `-18%`), me një grafik të vogël me shtylla;
- etiketa ngrihet 3 px.

`@media (prefers-reduced-motion: reduce)`: pa animacione, pa kalime; vija e verdhë shfaqet e plotë.

## Aksesueshmëria

- Kontrast teksti ≥ 4.5:1. Ngjyrat që duhen dalluar ndryshojnë edhe në ndriçim, jo vetëm në nuancë.
- Fokus i dukshëm: `outline: 2–3px solid #2F4FA3`, `outline-offset: 3–6px`.
- Elementet dekorative: `aria-hidden="true"`.
