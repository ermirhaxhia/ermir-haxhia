// Ngarkon një skedar në R2 LOKAL (vetëm për prova): npm run files:upload -- <skedari> <public/shteg.ext>
// Shembull: npm run files:upload -- foto.png public/dosja/analiza-1.png
// Përdor vetëm --local; nuk prek kurrë Cloudflare. Ngarkimi i vërtetë bëhet nga paneli (M5d).
import { execFileSync } from 'node:child_process';
import { extname } from 'node:path';

const [skedari, celesi] = process.argv.slice(2);
if (!skedari || !celesi || !celesi.startsWith('public/')) {
  console.error('Përdorimi: npm run files:upload -- <skedari> <public/shteg.ext>');
  process.exit(1);
}

const llojet = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.pdf': 'application/pdf' };
const lloji = llojet[extname(celesi).toLowerCase()] ?? 'application/octet-stream';

execFileSync(
  'npx',
  ['wrangler', 'r2', 'object', 'put', `ermir-haxhia-files/${celesi}`, '--file', skedari, '--content-type', lloji, '--local'],
  { stdio: 'inherit', shell: true },
);
console.log(`Adresa lokale: /f/${celesi}`);
