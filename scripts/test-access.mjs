// Prova e verifikimit të JWT-së së Access, pa rrjet: npm run test:access
// Gjeneron çift çelësash RSA, nënshkruan tokena dhe provon rastet e mira dhe të këqija.
import { generateKeyPairSync, createSign } from 'node:crypto';
import assert from 'node:assert/strict';
import { verifikoJwt, normalizoTeamDomain } from '../src/lib/access.ts';

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const { privateKey: tjeter } = generateKeyPairSync('rsa', { modulusLength: 2048 });

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
function token({ header = {}, payload = {}, celesi = privateKey } = {}) {
  const h = b64({ alg: 'RS256', kid: 'k1', ...header });
  const p = b64({
    iss: 'https://ekipi.cloudflareaccess.com',
    aud: ['AUD123'],
    email: 'ermir@example.com',
    exp: Math.floor(Date.now() / 1000) + 600,
    ...payload,
  });
  const s = createSign('RSA-SHA256').update(`${h}.${p}`).sign(celesi).toString('base64url');
  return `${h}.${p}.${s}`;
}

const konfig = { teamDomain: 'ekipi.cloudflareaccess.com', aud: 'AUD123' };
const jwks = [jwk];
const prove = async (emri, tok, k, pritet, arsyeja) => {
  const r = await verifikoJwt(tok, k, { jwks });
  assert.equal(r.ok, pritet, `${emri}: ${JSON.stringify(r)}`);
  if (arsyeja) assert.equal(r.arsyeja, arsyeja, emri);
  console.log(`ok  ${emri}`);
};

await prove('token i vlefshëm', token(), konfig, true);
await prove('pa token', null, konfig, false, 'pa-token');
await prove('token i çuditshëm', 'abc', konfig, false, 'token-i-keq');
await prove('nënshkrim nga çelës tjetër', token({ celesi: tjeter }), konfig, false, 'nënshkrim');
await prove('payload i ndryshuar pas nënshkrimit', (() => { const [h, , s] = token().split('.'); return `${h}.${b64({ iss: 'https://ekipi.cloudflareaccess.com', aud: ['AUD123'], email: 'hacker@x.com', exp: 9999999999 })}.${s}`; })(), konfig, false, 'nënshkrim');
await prove('audiencë e gabuar', token({ payload: { aud: ['TJETER'] } }), konfig, false, 'audienca');
await prove('lëshues i gabuar', token({ payload: { iss: 'https://keq.cloudflareaccess.com' } }), konfig, false, 'lëshues');
await prove('i skaduar', token({ payload: { exp: Math.floor(Date.now() / 1000) - 3600 } }), konfig, false, 'skaduar');
await prove('alg=none', token({ header: { alg: 'none' } }), konfig, false, 'alg-ose-kid');
await prove('alg=HS256', token({ header: { alg: 'HS256' } }), konfig, false, 'alg-ose-kid');
await prove('kid i panjohur', token({ header: { kid: 'kx' } }), konfig, false, 'çelës-i-panjohur');
await prove('pa email', token({ payload: { email: undefined } }), konfig, false, 'pa-email');
await prove('email i lejuar', token(), { ...konfig, email: 'ERMIR@example.com' }, true);
await prove('email jo i lejuar', token(), { ...konfig, email: 'tjeter@example.com' }, false, 'email-i-palejuar');
await prove('konfigurim pa AUD', token(), { ...konfig, aud: '' }, false, 'konfigurim-i-pa-plotë');
await prove('team domain i keq', token(), { ...konfig, teamDomain: 'evil.com' }, false, 'konfigurim-i-pa-plotë');
await prove('aud si varg të vetëm (string)', token({ payload: { aud: 'AUD123' } }), konfig, true);

assert.equal(normalizoTeamDomain('https://Ekipi.cloudflareaccess.com/'), 'ekipi.cloudflareaccess.com');
assert.equal(normalizoTeamDomain('ekipi.evil.com'), null);
console.log('\nTë gjitha provat kaluan.');
