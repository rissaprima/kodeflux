// Flux-E brain: forwards chat and voice to Gemini. Only works for a signed-in session.
// Settings in Netlify (Project configuration > Environment variables):
//   GEMINI_API_KEY  the key from Google AI Studio (secret)
//   FLUXE_SECRET    already set for the login (same value is used to check the cookie)
//   GEMINI_MODEL    optional: force one model id. If empty, a built-in list is tried in order.
const crypto = require('crypto');

const COOKIE = 'fluxe_session';
const MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite'];

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

const reply = (code, body) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

function hasSession(event, secret) {
  const raw = (event.headers.cookie || '')
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(COOKIE + '='));
  if (!raw) return false;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload, secret))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch (e) {
    return false;
  }
}

const PERSONA =
  'You are Flux-E, a personal AI assistant for a startup founder. You are one assistant, not a team. ' +
  'Be warm, direct and brief: usually 1 to 3 short sentences, plain text, no markdown, no emojis, no lists unless asked. ' +
  "Reply in the language the user writes in (Indonesian or English). " +
  "Right now you cannot read the founder's calendar, inbox, files or any app, and you cannot take actions for them. " +
  'Never pretend you did. When a request needs that, say so in one sentence and offer what you can do now: think it through, draft, plan, compare options, decide. ' +
  'Keep answers easy to speak aloud.';

async function gemini(key, body) {
  const models = [process.env.GEMINI_MODEL, ...MODELS].filter((m, i, a) => m && a.indexOf(m) === i);
  let detail = '';
  for (const m of models) {
    let r, j;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
      });
      j = await r.json();
    } catch (e) {
      detail = `${m}: network`;
      continue;
    }
    if (r.ok) {
      const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
      return { ok: true, text: parts.map((p) => p.text || '').join('').trim(), model: m };
    }
    detail = `${m}: ${r.status} ${String((j.error && j.error.message) || '').slice(0, 160)}`.split(key).join('***');
    if (![404, 429, 500, 503].includes(r.status)) break; // key or request problem: other models will not help
  }
  return { ok: false, detail };
}

// Gemini wants alternating turns that start with the user.
function cleanTurns(list) {
  const out = [];
  for (const m of (Array.isArray(list) ? list : []).slice(-12)) {
    const role = m && m.r === 'm' ? 'model' : 'user';
    const text = String((m && m.t) || '').slice(0, 2000).trim();
    if (!text) continue;
    if (!out.length && role === 'model') continue;
    if (out.length && out[out.length - 1].role === role) out[out.length - 1].parts[0].text += '\n' + text;
    else out.push({ role, parts: [{ text }] });
  }
  return out;
}

exports.handler = async (event) => {
  const { FLUXE_SECRET, GEMINI_API_KEY } = process.env;
  if (!FLUXE_SECRET || FLUXE_SECRET.length < 24) return reply(500, { ok: false, error: 'not_configured' });
  if (event.httpMethod !== 'POST') return reply(405, { ok: false });
  if (!hasSession(event, FLUXE_SECRET)) return reply(401, { ok: false, error: 'login' });
  if (!GEMINI_API_KEY) return reply(500, { ok: false, error: 'no_key' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { /* empty body */ }
  const langName = body.lang === 'id' ? 'Indonesian' : 'English';

  if (body.action === 'chat') {
    const contents = cleanTurns(body.messages);
    if (!contents.length) return reply(400, { ok: false, error: 'empty' });
    const r = await gemini(GEMINI_API_KEY, {
      systemInstruction: { parts: [{ text: PERSONA + ` The app language is ${langName}.` }] },
      contents,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });
    if (!r.ok) return reply(502, { ok: false, error: 'ai', detail: r.detail });
    return reply(200, { ok: true, text: r.text, model: r.model });
  }

  if (body.action === 'stt') {
    const audio = String(body.audio || '');
    if (!audio || audio.length > 3000000) return reply(400, { ok: false, error: 'audio' });
    const r = await gemini(GEMINI_API_KEY, {
      contents: [{
        role: 'user',
        parts: [
          { text: `Transcribe the speech in this audio exactly as spoken. It is most likely ${langName}, but may be Indonesian or English. Output only the transcript, nothing else. If there is no clear speech, output nothing.` },
          { inlineData: { mimeType: 'audio/wav', data: audio } },
        ],
      }],
      generationConfig: { maxOutputTokens: 512, temperature: 0 },
    });
    if (!r.ok) return reply(502, { ok: false, error: 'ai', detail: r.detail });
    return reply(200, { ok: true, text: r.text });
  }

  return reply(400, { ok: false });
};
