# Përmbajtja

Çdo faqe lexon përmbajtjen nga këtu. **`null` do të thotë: ende nuk ka vlerë.** Në faqe, një vlerë `null` shfaqet si vend bosh i dukshëm (`[ ... ]`), jo e fshehur. Kështu Ermiri e sheh menjëherë çfarë mungon.

Skedarët me vlera reale janë ato që Ermiri ka thënë vetë: teksti i "Rreth meje", GitHub, projekti në R + Shiny (afati "janar").

| Skedar | Përdoret në | Fushat |
|---|---|---|
| `rreth.json` | `/` | `teksti`, `fakte[]` (etiketa, vlera) |
| `kontakt.json` | `/` dhe `/fletorja/kontakt` | etiketa, vlera, url |
| `projekte.json` | `/fletorja/projekte` | data, titulli, pershkrimi, statusi, url |
| `shkolle.json` | `/fletorja/shkolle` | grupe sipas `lenda`; çdo punë: slug, data, titulli, pershkrimi, statusi, `ka_faqe` |
| `shkolle/<slug>.json` | `/fletorja/shkolle/<slug>` | titulli, kategoria, afati, pershkrimi, `shiny_url`, `raporti_pdf_url`, `linku_per_ndarje` |
| `dosja.json` | `/dosja` | seksione (powerbi, excel, analiza); çdo punë: pamje (imazh), data, titulli, pershkrimi, url |
| `libra.json` | `/libraria` | rafte → libra: titulli, autori, statusi, formati, skedari, licenca; plus `kurse` |
| `faqe-te-fshehura.json` | `/p/[kod]` | shih më poshtë |

## Vlerat e lejuara

- `libra[].statusi`: `"lexuar"`, `"duke lexuar"`, `"për t'u lexuar"`.
- `libra[].formati`: `"PDF"` ose `"Fizik"`. **PDF vetëm kur `licenca` është e hapur** (p.sh. "R for Data Science"); ndryshe lëre `"Fizik"` ose pa skedar.
- `libra[].ngjyra` (në raft): `"navy"`, `"sage"`, `"kraft"` (shih `design/tokens.md`).
- `shkolle[].punet[].statusi`: `"hap"` kur ka faqe të veçantë; ndryshe tekst i lirë (p.sh. "në punë", "dorëzuar").

## Faqet e fshehura

`faqe-te-fshehura.json` është bosh (`[]`). Çdo hyrje:

```json
{
  "kodi": "x7k2m9q4w8ab",
  "titulli": "...",
  "pershkrimi": "...",
  "shiny_url": null,
  "raporti_pdf_url": null
}
```

- `kodi` është pjesa e fundit e adresës (`/p/x7k2m9q4w8ab`), me të paktën 12 shenja të rastësishme.
- **Kujdes:** nëse repo është publike, kodet dalin. Mbaje repo-n **private**, ose mbaje këtë skedar jashtë repo-s (variabël mjedisi ose skedar i injoruar nga git).
