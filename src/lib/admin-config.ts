// Çfarë mund të ndryshojë paneli /admin dhe si validohet. Nga kjo tabelë dalin formularët dhe SQL-ja.
// Emrat e tabelave dhe kolonave vijnë VETËM nga këtu (kurrë nga përdoruesi), ndaj SQL-ja është e sigurt.

export type LlojiFushes =
  | 'tekst' // një rresht, deri 300 shenja
  | 'tekstGjate' // shumë rreshta, deri 2000 shenja
  | 'url' // http(s):// ose /f/public/...
  | 'skedar' // si url, me sugjerime nga skedarët e ngarkuar
  | 'slug' // a-z, 0-9 dhe viza
  | 'zgjedhje' // opsione fikse
  | 'burim' // zgjedhje nga një tabelë tjetër (çelës i huaj)
  | 'poJo'; // kuti zgjedhjeje (0/1)

export interface Fusha {
  emri: string;
  etiketa: string;
  lloji: LlojiFushes;
  kerkohet?: boolean;
  /** Vetëm për zgjedhje */
  opsione?: { vlera: string; etiketa: string }[];
  /** Vetëm për burim: tabela prej nga merren opsionet */
  burimi?: { tabela: string; vlera: string; etiketa: string };
  /** Mund të vendoset vetëm kur krijohet rreshti (p.sh. slug, id-ja e seksionit) */
  vetemShtim?: boolean;
}

export interface Entitet {
  id: string; // pjesa e adresës: /admin/<id>
  titulli: string;
  grupi: string;
  tabela: string;
  /** Kolona që identifikon rreshtin */
  celesi: string;
  celesiLloji: 'numer' | 'tekst';
  /** Rresht i vetëm (id = 1), pa shtim dhe pa fshirje */
  njeRresht?: boolean;
  /** Ka kolonën `renditja` (rend i ndryshueshëm) */
  renditja?: boolean;
  /** Rendi ruhet brenda grupit të kësaj kolone (p.sh. punët brenda një lënde) */
  grupiSipas?: string;
  /** Kodi gjenerohet vetë kur krijohet (faqet e fshehura) */
  gjeneroKod?: boolean;
  fushat: Fusha[];
  pershkrimi?: string;
}

const STATUSET = [
  { vlera: 'lexuar', etiketa: 'lexuar' },
  { vlera: 'duke lexuar', etiketa: 'duke lexuar' },
  { vlera: "për t'u lexuar", etiketa: "për t'u lexuar" },
];

export const entitetet: Entitet[] = [
  {
    id: 'rreth', titulli: 'Rreth meje (teksti)', grupi: 'Kryefaqja', tabela: 'rreth', celesi: 'id', celesiLloji: 'numer', njeRresht: true,
    fushat: [{ emri: 'teksti', etiketa: 'Teksti', lloji: 'tekstGjate', kerkohet: true }],
  },
  {
    id: 'rreth-fakte', titulli: 'Rreth meje (faktet)', grupi: 'Kryefaqja', tabela: 'rreth_fakte', celesi: 'id', celesiLloji: 'numer', renditja: true,
    fushat: [
      { emri: 'etiketa', etiketa: 'Etiketa', lloji: 'tekst', kerkohet: true },
      { emri: 'vlera', etiketa: 'Vlera', lloji: 'tekst' },
    ],
  },
  {
    id: 'kontakt', titulli: 'Kontakt', grupi: 'Kryefaqja', tabela: 'kontakt', celesi: 'id', celesiLloji: 'numer', renditja: true,
    fushat: [
      { emri: 'etiketa', etiketa: 'Etiketa', lloji: 'tekst', kerkohet: true },
      { emri: 'vlera', etiketa: 'Vlera (çfarë shfaqet)', lloji: 'tekst' },
      { emri: 'url', etiketa: 'Lidhja', lloji: 'url' },
    ],
  },
  {
    id: 'projekte', titulli: 'Projekte', grupi: 'Fletorja', tabela: 'projekte', celesi: 'id', celesiLloji: 'numer', renditja: true,
    fushat: [
      { emri: 'data', etiketa: 'Data', lloji: 'tekst' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst' },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekst' },
      { emri: 'statusi', etiketa: 'Statusi', lloji: 'tekst' },
      { emri: 'url', etiketa: 'Lidhja', lloji: 'url' },
    ],
  },
  {
    id: 'lendet', titulli: 'Lëndët', grupi: 'Shkollë', tabela: 'lendet', celesi: 'id', celesiLloji: 'numer', renditja: true,
    fushat: [{ emri: 'lenda', etiketa: 'Emri i lëndës', lloji: 'tekst' }],
  },
  {
    id: 'punet-shkolle', titulli: 'Punët e shkollës', grupi: 'Shkollë', tabela: 'punet_shkolle', celesi: 'id', celesiLloji: 'numer',
    renditja: true, grupiSipas: 'lenda_id',
    pershkrimi: 'Rreshtat te lista Shkollë. Për të pasur faqe të veçantë: shëno "Ka faqe" dhe vendos slug-un, pastaj plotëso faqen te "Faqet e projekteve".',
    fushat: [
      { emri: 'lenda_id', etiketa: 'Lënda', lloji: 'burim', kerkohet: true, burimi: { tabela: 'lendet', vlera: 'id', etiketa: 'lenda' } },
      { emri: 'slug', etiketa: 'Slug (adresa)', lloji: 'slug' },
      { emri: 'data', etiketa: 'Data', lloji: 'tekst' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst' },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekst' },
      { emri: 'statusi', etiketa: 'Statusi', lloji: 'tekst' },
      { emri: 'ka_faqe', etiketa: 'Ka faqe të veçantë', lloji: 'poJo' },
    ],
  },
  {
    id: 'projekte-shkolle', titulli: 'Faqet e projekteve', grupi: 'Shkollë', tabela: 'projekte_shkolle', celesi: 'slug', celesiLloji: 'tekst',
    pershkrimi: 'Faqja e plotë e një projekti (Shiny, raporti PDF). Slug-un nuk e ndryshon pasi të krijohet.',
    fushat: [
      { emri: 'slug', etiketa: 'Slug (adresa)', lloji: 'slug', kerkohet: true, vetemShtim: true },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'kategoria', etiketa: 'Kategoria', lloji: 'tekst', kerkohet: true },
      { emri: 'afati', etiketa: 'Afati', lloji: 'tekst', kerkohet: true },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekstGjate' },
      { emri: 'shiny_url', etiketa: 'Adresa e aplikacionit Shiny', lloji: 'url' },
      { emri: 'raporti_pdf_url', etiketa: 'Raporti PDF', lloji: 'skedar' },
      { emri: 'linku_per_ndarje', etiketa: 'Linku për ndarje', lloji: 'url' },
    ],
  },
  {
    id: 'dosja-seksione', titulli: 'Seksionet e dosjes', grupi: 'Dosja', tabela: 'dosja_seksione', celesi: 'id', celesiLloji: 'tekst', renditja: true,
    fushat: [
      { emri: 'id', etiketa: 'Kodi (slug)', lloji: 'slug', kerkohet: true, vetemShtim: true },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'mjeti', etiketa: 'Mjeti (pilula)', lloji: 'tekst', kerkohet: true },
    ],
  },
  {
    id: 'dosja-punet', titulli: 'Punët e dosjes', grupi: 'Dosja', tabela: 'dosja_punet', celesi: 'id', celesiLloji: 'numer',
    renditja: true, grupiSipas: 'seksion_id',
    fushat: [
      { emri: 'seksion_id', etiketa: 'Seksioni', lloji: 'burim', kerkohet: true, burimi: { tabela: 'dosja_seksione', vlera: 'id', etiketa: 'titulli' } },
      { emri: 'pamje', etiketa: 'Pamja (foto)', lloji: 'skedar' },
      { emri: 'data', etiketa: 'Data', lloji: 'tekst' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst' },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekst' },
      { emri: 'url', etiketa: 'Lidhja', lloji: 'url' },
    ],
  },
  {
    id: 'libra-rafte', titulli: 'Raftet e librave', grupi: 'Libraria', tabela: 'libra_rafte', celesi: 'id', celesiLloji: 'numer', renditja: true,
    fushat: [
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      {
        emri: 'ngjyra', etiketa: 'Ngjyra e kapakut', lloji: 'zgjedhje', kerkohet: true,
        opsione: [{ vlera: 'navy', etiketa: 'blu' }, { vlera: 'sage', etiketa: 'e gjelbër' }, { vlera: 'kraft', etiketa: 'kraft' }],
      },
    ],
  },
  {
    id: 'libra', titulli: 'Librat', grupi: 'Libraria', tabela: 'libra', celesi: 'id', celesiLloji: 'numer', renditja: true, grupiSipas: 'raft_id',
    pershkrimi: 'PDF vetëm për libra me licencë të hapur. Libra me të drejta autori: lëre pa skedar.',
    fushat: [
      { emri: 'raft_id', etiketa: 'Rafti', lloji: 'burim', kerkohet: true, burimi: { tabela: 'libra_rafte', vlera: 'id', etiketa: 'titulli' } },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst' },
      { emri: 'autori', etiketa: 'Autori', lloji: 'tekst' },
      { emri: 'statusi', etiketa: 'Statusi', lloji: 'zgjedhje', kerkohet: true, opsione: STATUSET },
      { emri: 'formati', etiketa: 'Formati', lloji: 'zgjedhje', kerkohet: true, opsione: [{ vlera: 'PDF', etiketa: 'PDF' }, { vlera: 'Fizik', etiketa: 'Fizik' }] },
      { emri: 'skedari', etiketa: 'Skedari PDF (vetëm licencë e hapur)', lloji: 'skedar' },
      { emri: 'licenca', etiketa: 'Licenca', lloji: 'tekst' },
    ],
  },
  {
    id: 'kurse', titulli: 'Kartela e kurseve', grupi: 'Libraria', tabela: 'kurse', celesi: 'id', celesiLloji: 'numer', njeRresht: true,
    fushat: [
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekst' },
      { emri: 'url', etiketa: 'Adresa e faqes së kurseve', lloji: 'url' },
    ],
  },
  {
    id: 'kurse-etiketat', titulli: 'Etiketat e kurseve', grupi: 'Libraria', tabela: 'kurse_etiketat', celesi: 'id', celesiLloji: 'numer', renditja: true,
    fushat: [{ emri: 'etiketa', etiketa: 'Etiketa', lloji: 'tekst', kerkohet: true }],
  },
  {
    id: 'faqe-fshehura', titulli: 'Faqet e fshehura', grupi: 'Të fshehura', tabela: 'faqe_fshehura', celesi: 'kodi', celesiLloji: 'tekst', gjeneroKod: true,
    pershkrimi: 'Kodi gjenerohet vetë kur krijon faqen dhe nuk ndryshohet. Linku është /p/<kodi>. Kushdo me linkun e hap.',
    fushat: [
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekstGjate' },
      { emri: 'shiny_url', etiketa: 'Adresa e aplikacionit Shiny', lloji: 'url' },
      { emri: 'raporti_pdf_url', etiketa: 'Raporti PDF', lloji: 'skedar' },
    ],
  },
];

export const entitetSipasId = (id: string) => entitetet.find((e) => e.id === id) ?? null;
