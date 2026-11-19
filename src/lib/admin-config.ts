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
  /** Një shpjegim i shkurtër nën fushë, në shqip të thjeshtë */
  ndihme?: string;
  /** Shembull i dukshëm brenda fushës kur është bosh */
  shembull?: string;
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
  /** Shpjegim i shkurtër në krye të faqes */
  pershkrimi?: string;
  /** Emri i një njësie, për butonin "Shto … të ri" (p.sh. "projekt") */
  njesia?: string;
  /** Fushat nga merret titulli i rreshtit te lista (e para që ka vlerë) */
  permbledhja?: string[];
  /** Ku shfaqet kjo gjë në faqen publike (për lidhjen "Shiko në faqe") */
  faqja?: string;
  /** Teksti kur nuk ka asnjë rresht */
  boshTekst?: string;
}

const STATUSET = [
  { vlera: 'lexuar', etiketa: 'lexuar' },
  { vlera: 'duke lexuar', etiketa: 'duke lexuar' },
  { vlera: "për t'u lexuar", etiketa: "për t'u lexuar" },
];

export const entitetet: Entitet[] = [
  {
    id: 'rreth', titulli: 'Rreth meje (teksti)', grupi: 'Kryefaqja', tabela: 'rreth', celesi: 'id', celesiLloji: 'numer', njeRresht: true,
    pershkrimi: 'Paragrafi që shfaqet te seksioni "Rreth meje" në kryefaqe.',
    faqja: '/#rreth',
    fushat: [{ emri: 'teksti', etiketa: 'Teksti', lloji: 'tekstGjate', kerkohet: true, ndihme: 'Dy deri tre fjali për veten, në vetën e parë.' }],
  },
  {
    id: 'rreth-fakte', titulli: 'Rreth meje (faktet)', grupi: 'Kryefaqja', tabela: 'rreth_fakte', celesi: 'id', celesiLloji: 'numer', renditja: true,
    pershkrimi: 'Rreshta të shkurtër nën tekstin "Rreth meje", p.sh. "Studime: Master, Matematikë e Aplikuar".',
    njesia: 'fakt', permbledhja: ['etiketa'], faqja: '/#rreth',
    boshTekst: 'Ende nuk ka fakte. Shto një rresht si "Studime" ose "Fokus".',
    fushat: [
      { emri: 'etiketa', etiketa: 'Etiketa (e shkurtër)', lloji: 'tekst', kerkohet: true, shembull: 'Studime' },
      { emri: 'vlera', etiketa: 'Vlera', lloji: 'tekst', shembull: 'Master, Matematikë e Aplikuar' },
    ],
  },
  {
    id: 'kontakt', titulli: 'Kontakt', grupi: 'Kryefaqja', tabela: 'kontakt', celesi: 'id', celesiLloji: 'numer', renditja: true,
    pershkrimi: 'Ku mund të të gjejnë: GitHub, LinkedIn, email. Shfaqet te kryefaqja dhe te faqja "Kontakt".',
    njesia: 'kontakt', permbledhja: ['etiketa'], faqja: '/fletorja/kontakt',
    fushat: [
      { emri: 'etiketa', etiketa: 'Emri', lloji: 'tekst', kerkohet: true, shembull: 'LinkedIn' },
      { emri: 'vlera', etiketa: 'Çfarë shfaqet', lloji: 'tekst', shembull: 'linkedin.com/in/emri-yt', ndihme: 'Teksti që lexojnë vizitorët.' },
      { emri: 'url', etiketa: 'Lidhja', lloji: 'url', shembull: 'https://www.linkedin.com/in/emri-yt', ndihme: 'Adresa e plotë, që fillon me https://. Për email shkruaj mailto:emri@shembull.com.' },
    ],
  },
  {
    id: 'projekte', titulli: 'Projekte', grupi: 'Fletorja', tabela: 'projekte', celesi: 'id', celesiLloji: 'numer', renditja: true,
    pershkrimi: 'Projektet që ndërton vetë. Çdo rresht del te faqja "Projekte".',
    njesia: 'projekt', permbledhja: ['titulli'], faqja: '/fletorja/projekte',
    boshTekst: 'Ende nuk ke asnjë projekt. Shto të parin.',
    fushat: [
      { emri: 'data', etiketa: 'Data', lloji: 'tekst', shembull: 'Janar 2027' },
      { emri: 'titulli', etiketa: 'Emri i projektit', lloji: 'tekst', kerkohet: false },
      { emri: 'pershkrimi', etiketa: 'Çfarë bën (një rresht)', lloji: 'tekst' },
      { emri: 'statusi', etiketa: 'Statusi', lloji: 'tekst', shembull: 'në punë', ndihme: 'p.sh. "në punë", "përfunduar".' },
      { emri: 'url', etiketa: 'Lidhja', lloji: 'url', ndihme: 'Opsionale. Nëse e vendos, titulli bëhet lidhje.' },
    ],
  },
  {
    id: 'lendet', titulli: 'Lëndët', grupi: 'Shkollë', tabela: 'lendet', celesi: 'id', celesiLloji: 'numer', renditja: true,
    pershkrimi: 'Grupet në faqen "Shkollë". Çdo lëndë ka punët e veta (shih "Punët e shkollës").',
    njesia: 'lëndë', permbledhja: ['lenda'], faqja: '/fletorja/shkolle',
    fushat: [{ emri: 'lenda', etiketa: 'Emri i lëndës', lloji: 'tekst', shembull: 'Analiza e të dhënave' }],
  },
  {
    id: 'punet-shkolle', titulli: 'Punët e shkollës', grupi: 'Shkollë', tabela: 'punet_shkolle', celesi: 'id', celesiLloji: 'numer',
    renditja: true, grupiSipas: 'lenda_id',
    pershkrimi: 'Detyrat dhe projektet e shkollës, secila nën një lëndë. Për të pasur faqe të veçantë me Shiny: shëno "Ka faqe të veçantë", vendos slug-un, pastaj plotëso faqen te "Faqet e projekteve".',
    njesia: 'punë', permbledhja: ['titulli'], faqja: '/fletorja/shkolle',
    fushat: [
      { emri: 'lenda_id', etiketa: 'Lënda', lloji: 'burim', kerkohet: true, burimi: { tabela: 'lendet', vlera: 'id', etiketa: 'lenda' } },
      { emri: 'slug', etiketa: 'Slug (pjesa e adresës)', lloji: 'slug', shembull: 'projekt-r-shiny', ndihme: 'Vetëm nëse ka faqe të veçantë. Shkronja të vogla, shifra dhe viza.' },
      { emri: 'data', etiketa: 'Data ose afati', lloji: 'tekst', shembull: 'Janar' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst' },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi (një rresht)', lloji: 'tekst' },
      { emri: 'statusi', etiketa: 'Statusi', lloji: 'tekst', shembull: 'hap', ndihme: '"hap" nëse ka faqe të veçantë, ose "në punë", "dorëzuar".' },
      { emri: 'ka_faqe', etiketa: 'Ka faqe të veçantë', lloji: 'poJo' },
    ],
  },
  {
    id: 'projekte-shkolle', titulli: 'Faqet e projekteve', grupi: 'Shkollë', tabela: 'projekte_shkolle', celesi: 'slug', celesiLloji: 'tekst',
    pershkrimi: 'Faqja e plotë e një projekti shkollor: përshkrimi, aplikacioni Shiny, raporti PDF. Slug-un nuk e ndryshon pasi të krijohet.',
    njesia: 'faqe projekti', permbledhja: ['titulli', 'slug'], faqja: '/fletorja/shkolle',
    fushat: [
      { emri: 'slug', etiketa: 'Slug (pjesa e adresës)', lloji: 'slug', kerkohet: true, vetemShtim: true, shembull: 'projekt-r-shiny', ndihme: 'Faqja del te /fletorja/shkolle/<slug>.' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'kategoria', etiketa: 'Kategoria', lloji: 'tekst', kerkohet: true, shembull: 'Shkollë' },
      { emri: 'afati', etiketa: 'Afati', lloji: 'tekst', kerkohet: true, shembull: 'Janar' },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekstGjate', ndihme: 'Pyetja që trajton, të dhënat dhe metoda, në dy-tre fjali.' },
      { emri: 'shiny_url', etiketa: 'Adresa e aplikacionit Shiny', lloji: 'url', shembull: 'https://emri.shinyapps.io/aplikacioni/', ndihme: 'Pasi ta publikosh te shinyapps.io. Pa të, faqja thotë "do të shtohet".' },
      { emri: 'raporti_pdf_url', etiketa: 'Raporti PDF', lloji: 'skedar', ndihme: 'Ngarkoje te "Foto dhe PDF" dhe zgjidhe nga lista.' },
      { emri: 'linku_per_ndarje', etiketa: 'Linku për ndarje', lloji: 'url' },
    ],
  },
  {
    id: 'dosja-seksione', titulli: 'Seksionet e dosjes', grupi: 'Dosja', tabela: 'dosja_seksione', celesi: 'id', celesiLloji: 'tekst', renditja: true,
    pershkrimi: 'Ndarjet e Dosjes (Power BI, Excel, Analizë). Zakonisht nuk ndryshojnë.',
    njesia: 'seksion', permbledhja: ['titulli'], faqja: '/dosja',
    fushat: [
      { emri: 'id', etiketa: 'Kodi (slug)', lloji: 'slug', kerkohet: true, vetemShtim: true, shembull: 'powerbi' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'mjeti', etiketa: 'Mjeti (pilula në kartelë)', lloji: 'tekst', kerkohet: true },
    ],
  },
  {
    id: 'dosja-punet', titulli: 'Punët e dosjes', grupi: 'Dosja', tabela: 'dosja_punet', celesi: 'id', celesiLloji: 'numer',
    renditja: true, grupiSipas: 'seksion_id',
    pershkrimi: 'Kartelat me foto në Dosje: dashboard-e, modele në Excel, analiza.',
    njesia: 'punë', permbledhja: ['titulli'], faqja: '/dosja',
    boshTekst: 'Ende nuk ka asnjë punë. Ngarko një foto te "Foto dhe PDF", pastaj shto kartelën këtu.',
    fushat: [
      { emri: 'seksion_id', etiketa: 'Seksioni', lloji: 'burim', kerkohet: true, burimi: { tabela: 'dosja_seksione', vlera: 'id', etiketa: 'titulli' } },
      { emri: 'pamje', etiketa: 'Foto (pamja e punës)', lloji: 'skedar', ndihme: 'Zgjidh nga lista e fotove të ngarkuara.' },
      { emri: 'data', etiketa: 'Data', lloji: 'tekst' },
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst' },
      { emri: 'pershkrimi', etiketa: 'Çfarë tregon (një rresht)', lloji: 'tekst' },
      { emri: 'url', etiketa: 'Lidhja', lloji: 'url', ndihme: 'Opsionale: dashboard-i live ose skedari.' },
    ],
  },
  {
    id: 'libra-rafte', titulli: 'Raftet e librave', grupi: 'Libraria', tabela: 'libra_rafte', celesi: 'id', celesiLloji: 'numer', renditja: true,
    pershkrimi: 'Grupet e librave në Librari (p.sh. Python, R, Libra të tjerë).',
    njesia: 'raft', permbledhja: ['titulli'], faqja: '/libraria',
    fushat: [
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      {
        emri: 'ngjyra', etiketa: 'Ngjyra e kapakut', lloji: 'zgjedhje', kerkohet: true,
        opsione: [{ vlera: 'navy', etiketa: 'blu' }, { vlera: 'sage', etiketa: 'e gjelbër' }, { vlera: 'kraft', etiketa: 'kraft (bezhë)' }],
      },
    ],
  },
  {
    id: 'libra', titulli: 'Librat', grupi: 'Libraria', tabela: 'libra', celesi: 'id', celesiLloji: 'numer', renditja: true, grupiSipas: 'raft_id',
    pershkrimi: 'Librat që lexon ose do të lexosh. PDF vetëm për libra me licencë të hapur; për libra me të drejta autori lëre pa skedar.',
    njesia: 'libër', permbledhja: ['titulli'], faqja: '/libraria',
    boshTekst: 'Ende nuk ka libra. Shto të parin.',
    fushat: [
      { emri: 'raft_id', etiketa: 'Rafti', lloji: 'burim', kerkohet: true, burimi: { tabela: 'libra_rafte', vlera: 'id', etiketa: 'titulli' } },
      { emri: 'titulli', etiketa: 'Titulli i librit', lloji: 'tekst' },
      { emri: 'autori', etiketa: 'Autori', lloji: 'tekst' },
      { emri: 'statusi', etiketa: 'Statusi i leximit', lloji: 'zgjedhje', kerkohet: true, opsione: STATUSET },
      { emri: 'formati', etiketa: 'Formati', lloji: 'zgjedhje', kerkohet: true, opsione: [{ vlera: 'PDF', etiketa: 'PDF' }, { vlera: 'Fizik', etiketa: 'Fizik' }] },
      { emri: 'skedari', etiketa: 'Skedari PDF', lloji: 'skedar', ndihme: 'Vetëm për libra me licencë të hapur.' },
      { emri: 'licenca', etiketa: 'Licenca', lloji: 'tekst', shembull: 'CC BY-NC-ND' },
    ],
  },
  {
    id: 'kurse', titulli: 'Kartela e kurseve', grupi: 'Libraria', tabela: 'kurse', celesi: 'id', celesiLloji: 'numer', njeRresht: true,
    pershkrimi: 'Kartela në fund të Librarisë që të çon te faqja jote e kurseve.',
    faqja: '/libraria',
    fushat: [
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi (një rresht)', lloji: 'tekst' },
      { emri: 'url', etiketa: 'Adresa e faqes së kurseve', lloji: 'url', shembull: 'https://kurset.ermirhaxhia.com', ndihme: 'Pa të, butoni "Hap kurset" mbetet joaktiv.' },
    ],
  },
  {
    id: 'kurse-etiketat', titulli: 'Etiketat e kurseve', grupi: 'Libraria', tabela: 'kurse_etiketat', celesi: 'id', celesiLloji: 'numer', renditja: true,
    pershkrimi: 'Pilulat e vogla në kartelën e kurseve (p.sh. SQL, Machine Learning).',
    njesia: 'etiketë', permbledhja: ['etiketa'], faqja: '/libraria',
    fushat: [{ emri: 'etiketa', etiketa: 'Etiketa', lloji: 'tekst', kerkohet: true }],
  },
  {
    id: 'faqe-fshehura', titulli: 'Faqet e fshehura', grupi: 'Të fshehura', tabela: 'faqe_fshehura', celesi: 'kodi', celesiLloji: 'tekst', gjeneroKod: true,
    pershkrimi: 'Faqe që nuk del askund në faqe. Kodi gjenerohet vetë dhe linku është /p/<kodi>. Kushdo me linkun e hap, ndaj ndaje vetëm me ata që duhet (p.sh. pedagogun).',
    njesia: 'faqe e fshehur', permbledhja: ['titulli'],
    boshTekst: 'Ende nuk ke faqe të fshehura. Krijo një për të ndarë një projekt me një pedagog.',
    fushat: [
      { emri: 'titulli', etiketa: 'Titulli', lloji: 'tekst', kerkohet: true },
      { emri: 'pershkrimi', etiketa: 'Përshkrimi', lloji: 'tekstGjate' },
      { emri: 'shiny_url', etiketa: 'Adresa e aplikacionit Shiny', lloji: 'url' },
      { emri: 'raporti_pdf_url', etiketa: 'Raporti PDF', lloji: 'skedar' },
    ],
  },
];

export const entitetSipasId = (id: string) => entitetet.find((e) => e.id === id) ?? null;

/** Titulli i një rreshti për listën: vlera e parë e plotësuar nga `permbledhja`, ose null. */
export function permbledhjaERreshtit(e: Entitet, r: Record<string, string | number | null>): string | null {
  for (const emri of e.permbledhja ?? []) {
    const v = r[emri];
    if (typeof v === 'string' && v.trim() !== '') return v;
  }
  return null;
}
