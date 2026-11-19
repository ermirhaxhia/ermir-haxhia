// Mbush bazën LOKALE të të dhënave nga content/*.json: npm run db:seed
// Fshin dhe e mbush përsëri të gjithë përmbajtjen lokale. Nuk prek kurrë bazën te Cloudflare
// (komanda përdor vetëm --local).
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const lexo = (rruga) => JSON.parse(readFileSync(join('content', rruga), 'utf8'));
const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`);

const sql = [];
const tabelat = [
  'faqe_fshehura', 'kurse_etiketat', 'kurse', 'libra', 'libra_rafte', 'dosja_punet', 'dosja_seksione',
  'projekte_shkolle', 'punet_shkolle', 'lendet', 'projekte', 'kontakt', 'rreth_fakte', 'rreth',
];
for (const t of tabelat) sql.push(`DELETE FROM ${t};`);
sql.push(`DELETE FROM sqlite_sequence;`);

const rreth = lexo('rreth.json');
sql.push(`INSERT INTO rreth (id, teksti) VALUES (1, ${q(rreth.teksti)});`);
rreth.fakte.forEach((f, i) =>
  sql.push(`INSERT INTO rreth_fakte (renditja, etiketa, vlera) VALUES (${i}, ${q(f.etiketa)}, ${q(f.vlera)});`));

lexo('kontakt.json').forEach((k, i) =>
  sql.push(`INSERT INTO kontakt (renditja, etiketa, vlera, url) VALUES (${i}, ${q(k.etiketa)}, ${q(k.vlera)}, ${q(k.url)});`));

lexo('projekte.json').forEach((p, i) =>
  sql.push(`INSERT INTO projekte (renditja, data, titulli, pershkrimi, statusi, url) VALUES (${i}, ${q(p.data)}, ${q(p.titulli)}, ${q(p.pershkrimi)}, ${q(p.statusi)}, ${q(p.url)});`));

lexo('shkolle.json').forEach((l, i) => {
  sql.push(`INSERT INTO lendet (id, renditja, lenda) VALUES (${i + 1}, ${i}, ${q(l.lenda)});`);
  l.punet.forEach((p, j) =>
    sql.push(`INSERT INTO punet_shkolle (lenda_id, renditja, slug, data, titulli, pershkrimi, statusi, ka_faqe) VALUES (${i + 1}, ${j}, ${q(p.slug)}, ${q(p.data)}, ${q(p.titulli)}, ${q(p.pershkrimi)}, ${q(p.statusi)}, ${p.ka_faqe ? 1 : 0});`));
});

for (const skedar of readdirSync(join('content', 'shkolle')).filter((s) => s.endsWith('.json'))) {
  const slug = skedar.replace(/\.json$/, '');
  const d = lexo(join('shkolle', skedar));
  sql.push(`INSERT INTO projekte_shkolle (slug, titulli, kategoria, afati, pershkrimi, shiny_url, raporti_pdf_url, linku_per_ndarje) VALUES (${q(slug)}, ${q(d.titulli)}, ${q(d.kategoria)}, ${q(d.afati)}, ${q(d.pershkrimi)}, ${q(d.shiny_url)}, ${q(d.raporti_pdf_url)}, ${q(d.linku_per_ndarje)});`);
}

lexo('dosja.json').seksionet.forEach((s, i) => {
  sql.push(`INSERT INTO dosja_seksione (id, renditja, titulli, mjeti) VALUES (${q(s.id)}, ${i}, ${q(s.titulli)}, ${q(s.mjeti)});`);
  s.punet.forEach((p, j) =>
    sql.push(`INSERT INTO dosja_punet (seksion_id, renditja, pamje, data, titulli, pershkrimi, url) VALUES (${q(s.id)}, ${j}, ${q(p.pamje)}, ${q(p.data)}, ${q(p.titulli)}, ${q(p.pershkrimi)}, ${q(p.url)});`));
});

const libra = lexo('libra.json');
libra.rafte.forEach((r, i) => {
  sql.push(`INSERT INTO libra_rafte (id, renditja, titulli, ngjyra) VALUES (${i + 1}, ${i}, ${q(r.titulli)}, ${q(r.ngjyra)});`);
  r.libra.forEach((l, j) =>
    sql.push(`INSERT INTO libra (raft_id, renditja, titulli, autori, statusi, formati, skedari, licenca) VALUES (${i + 1}, ${j}, ${q(l.titulli)}, ${q(l.autori)}, ${q(l.statusi)}, ${q(l.formati)}, ${q(l.skedari)}, ${q(l.licenca)});`));
});
sql.push(`INSERT INTO kurse (id, titulli, pershkrimi, url) VALUES (1, ${q(libra.kurse.titulli)}, ${q(libra.kurse.pershkrimi)}, ${q(libra.kurse.url)});`);
libra.kurse.etiketat.forEach((e, i) =>
  sql.push(`INSERT INTO kurse_etiketat (renditja, etiketa) VALUES (${i}, ${q(e)});`));

lexo('faqe-te-fshehura.json').forEach((f) =>
  sql.push(`INSERT INTO faqe_fshehura (kodi, titulli, pershkrimi, shiny_url, raporti_pdf_url) VALUES (${q(f.kodi)}, ${q(f.titulli)}, ${q(f.pershkrimi)}, ${q(f.shiny_url)}, ${q(f.raporti_pdf_url)});`));

mkdirSync('.wrangler', { recursive: true });
const skedari = join('.wrangler', 'seed.sql');
writeFileSync(skedari, sql.join('\n') + '\n');
console.log(`U gjeneruan ${sql.length} komanda SQL te ${skedari}`);

execFileSync('npx', ['wrangler', 'd1', 'execute', 'DB', '--local', '--file', skedari], {
  stdio: 'inherit',
  shell: true,
});
