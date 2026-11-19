// Gjeneron një kod të rastësishëm për faqe të fshehur: npm run kodi
import { randomInt } from 'node:crypto';

const alfabeti = 'abcdefghijkmnpqrstuvwxyz23456789'; // pa shkronja të ngatërrueshme (l, o, 0, 1)
const gjatesia = 16;
let kodi = '';
for (let i = 0; i < gjatesia; i++) kodi += alfabeti[randomInt(alfabeti.length)];
console.log(kodi);
