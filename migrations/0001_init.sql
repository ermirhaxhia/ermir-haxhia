-- Skema fillestare e bazës ermir-haxhia-db (D1 / SQLite).
-- `renditja` ruan rendin e shfaqjes. Vlerat NULL do të thonë "ende pa vlerë" dhe shfaqen [ ... ].

CREATE TABLE rreth (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  teksti TEXT NOT NULL
);

CREATE TABLE rreth_fakte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  renditja INTEGER NOT NULL,
  etiketa TEXT NOT NULL,
  vlera TEXT
);

CREATE TABLE kontakt (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  renditja INTEGER NOT NULL,
  etiketa TEXT NOT NULL,
  vlera TEXT,
  url TEXT
);

CREATE TABLE projekte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  renditja INTEGER NOT NULL,
  data TEXT,
  titulli TEXT,
  pershkrimi TEXT,
  statusi TEXT,
  url TEXT
);

CREATE TABLE lendet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  renditja INTEGER NOT NULL,
  lenda TEXT
);

CREATE TABLE punet_shkolle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lenda_id INTEGER NOT NULL REFERENCES lendet(id) ON DELETE CASCADE,
  renditja INTEGER NOT NULL,
  slug TEXT UNIQUE,
  data TEXT,
  titulli TEXT,
  pershkrimi TEXT,
  statusi TEXT,
  ka_faqe INTEGER NOT NULL DEFAULT 0 CHECK (ka_faqe IN (0, 1))
);
CREATE INDEX idx_punet_shkolle_lenda ON punet_shkolle(lenda_id, renditja);

-- Faqja e plotë e një projekti shkollor (adresa /fletorja/shkolle/<slug>)
CREATE TABLE projekte_shkolle (
  slug TEXT PRIMARY KEY,
  titulli TEXT NOT NULL,
  kategoria TEXT NOT NULL,
  afati TEXT NOT NULL,
  pershkrimi TEXT,
  shiny_url TEXT,
  raporti_pdf_url TEXT,
  linku_per_ndarje TEXT
);

CREATE TABLE dosja_seksione (
  id TEXT PRIMARY KEY,
  renditja INTEGER NOT NULL,
  titulli TEXT NOT NULL,
  mjeti TEXT NOT NULL
);

CREATE TABLE dosja_punet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seksion_id TEXT NOT NULL REFERENCES dosja_seksione(id) ON DELETE CASCADE,
  renditja INTEGER NOT NULL,
  pamje TEXT,
  data TEXT,
  titulli TEXT,
  pershkrimi TEXT,
  url TEXT
);
CREATE INDEX idx_dosja_punet_seksion ON dosja_punet(seksion_id, renditja);

CREATE TABLE libra_rafte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  renditja INTEGER NOT NULL,
  titulli TEXT NOT NULL,
  ngjyra TEXT NOT NULL CHECK (ngjyra IN ('navy', 'sage', 'kraft'))
);

CREATE TABLE libra (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  raft_id INTEGER NOT NULL REFERENCES libra_rafte(id) ON DELETE CASCADE,
  renditja INTEGER NOT NULL,
  titulli TEXT,
  autori TEXT,
  statusi TEXT NOT NULL CHECK (statusi IN ('lexuar', 'duke lexuar', 'për t''u lexuar')),
  formati TEXT NOT NULL CHECK (formati IN ('PDF', 'Fizik')),
  skedari TEXT,
  licenca TEXT
);
CREATE INDEX idx_libra_raft ON libra(raft_id, renditja);

CREATE TABLE kurse (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  titulli TEXT NOT NULL,
  pershkrimi TEXT,
  url TEXT
);

CREATE TABLE kurse_etiketat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  renditja INTEGER NOT NULL,
  etiketa TEXT NOT NULL
);

-- Faqet e fshehura: kodi është pjesa e fundit e adresës /p/<kodi>
CREATE TABLE faqe_fshehura (
  kodi TEXT PRIMARY KEY CHECK (length(kodi) >= 12),
  titulli TEXT NOT NULL,
  pershkrimi TEXT,
  shiny_url TEXT,
  raporti_pdf_url TEXT
);
