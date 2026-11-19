# Vendime dhe pyetje

## Të vendosura
| Vendimi | Arsyeja |
|---|---|
| Dizajn si fletore/tavolinë me tre hapësira (Fletorja, Dosja, Libraria) | Nuk dëshiron portofol të zakonshëm; ndarje e qartë e punëve |
| Kryefaqja me objekte që hapen (efekt "wow") | Vizitori nuk mund të shohë direkt brendësinë; duhet hyrje |
| Libraria është publike, pa login | Kërkesë e Ermirit |
| Faqet e fshehura = lidhje e pa-listuar | E mjaftueshme për pedagogun; jo siguri e vërtetë |
| Faqja e kurseve mbetet e veçantë, në nën-domen, e lidhur nga Libraria | Ekziston si repo; nuk përzihet |
| PDF librat: pak (6–7), pa bazë të dhënash | Kufijtë e D1 (2 MB për rresht) nuk përshtaten |
| Stack: Astro + Cloudflare Workers (SSR) | Zëvendësoi "Static Assets" kur u vendos D1 (nëntor 2026) |
| Përmbajtja në **D1**, skedarët në **R2**; faqet publike lexojnë direkt nga D1 | Kërkesë e Ermirit: panel admin, ndryshime pa rindërtim |
| `/admin` mbrohet me Cloudflare Access; kodet e faqeve të fshehura jetojnë në D1 | Hyrje e vërtetë pa login të shkruar vetë; repo nuk mban më kode |
| Domeni blihet te Cloudflare (Ermiri e blen); deploy fillimisht në `*.workers.dev` | Çmim "at-cost"; domeni nuk bllokon zhvillimin |
| Shiny në shinyapps.io, i ngulitur me iframe | Cloudflare nuk ekzekuton R |

## Pyetje të hapura për Ermirin
1. A është blerë domeni `ermir-haxhia.com`? Te kush? (ndikon në DNS/transfer)
2. URL e LinkedIn dhe email-i publik.
3. Emri i lëndës dhe pedagogut për projektin në R; data e saktë e dorëzimit.
4. A është publikuar aplikacioni Shiny? Cila është adresa?
5. Adresa e faqes së kurseve (repo ekzistuese) dhe emri i nën-domenit të dëshiruar.
6. Cilat 6–7 libra do të shfaqen, dhe cilët kanë licencë të hapur për PDF publike.
7. Teksti përfundimtar "Rreth meje" (tani vetëm dy fakte).
8. A duhet kartela e punës në Dosje të hapë faqe të veçantë?
9. Analitikë (p.sh. Cloudflare Web Analytics, pa cookies)? Po/jo.
10. Version anglisht? Po/jo.
11. Formular kontakti, apo vetëm email? Mbetet vetëm email deri sa të vendoset.
12. Repo në GitHub: private (rekomanduar, për shkak të kodeve të faqeve të fshehura)?
