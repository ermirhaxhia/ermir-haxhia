// Kopje rezervë e bazës së vërtetë të të dhënave (vetëm lexim): npm run db:backup
// Ruhet te backups/ (jashtë Git-it). Paneli nuk ka kthim prapa, ndaj bëje para ndryshimeve të mëdha.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

mkdirSync('backups', { recursive: true });
const data = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
const skedari = join('backups', `ermir-haxhia-db-${data}.sql`);
execFileSync('npx', ['wrangler', 'd1', 'export', 'DB', '--remote', '--output', skedari], { stdio: 'inherit', shell: true });
console.log(`\nKopja u ruajt te ${skedari}`);
