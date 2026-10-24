// Flux-E login for ai.html — one account, no database.
// Settings live in Netlify (Project configuration > Environment variables):
//   FLUXE_EMAIL    the only email allowed to sign in
//   FLUXE_PASSWORD the password for that email
//   FLUXE_SECRET   a long random text (24+ characters) used to sign the login cookie
const crypto = require('crypto');

const COOKIE = 'fluxe_session';
const DAYS = 7;

const sign = (data, secret) => crypto.createHmac('sha256', secret).update(data).digest('base64url');

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) {
    crypto.timingSafeEqual(x, x);
    return false;
  }
  return crypto.timingSafeEqual(x, y);
}

const reply = (code, body, headers = {}) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  body: JSON.stringify(body),
});

function readSession(event, secret) {
  const raw = (event.headers.cookie || '')
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(COOKIE + '='));
  if (!raw) return null;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload, secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch (e) {
    return null;
  }
}

exports.handler = async (event) => {
  const { FLUXE_EMAIL, FLUXE_PASSWORD, FLUXE_SECRET } = process.env;
  if (!FLUXE_EMAIL || !FLUXE_PASSWORD || !FLUXE_SECRET || FLUXE_SECRET.length < 24) {
    return reply(500, { ok: false, error: 'not_configured' });
  }
  const owner = FLUXE_EMAIL.trim().toLowerCase();

  if (event.httpMethod === 'GET') {
    const session = readSession(event, FLUXE_SECRET);
    return reply(200, session ? { ok: true, email: session.e } : { ok: false });
  }
  if (event.httpMethod !== 'POST') return reply(405, { ok: false });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { /* empty body */ }

  if (body.action === 'logout') {
    return reply(200, { ok: true }, {
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
    });
  }

  if (body.action === 'login') {
    const emailOk = safeEqual(String(body.email || '').trim().toLowerCase(), owner);
    const passOk = safeEqual(String(body.password || ''), FLUXE_PASSWORD);
    if (!(emailOk && passOk)) {
      await new Promise((r) => setTimeout(r, 1200)); // slows down guessing
      return reply(401, { ok: false, error: 'invalid' });
    }
    const payload = Buffer.from(JSON.stringify({ e: owner, exp: Date.now() + DAYS * 864e5 })).toString('base64url');
    const token = payload + '.' + sign(payload, FLUXE_SECRET);
    return reply(200, { ok: true, email: owner }, {
      'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Strict`,
    });
  }
  return reply(400, { ok: false });
};
