// Flux-E brain: forwards chat and voice to Gemini. Only works for a signed-in session.
// Settings in Netlify (Project configuration > Environment variables):
//   GEMINI_API_KEY  the key from Google AI Studio (secret)
//   FLUXE_SECRET    already set for the login (same value is used to check the cookie)
//   GEMINI_MODEL    optional: force one model id. If empty, a built-in list is tried in order.
const crypto = require('crypto');

const COOKIE = 'fluxe_session';
const CHAT_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash']; // fastest first
const TTS_MODELS = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
const STT_MODELS = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];

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
  "You cannot read the founder's real calendar, inbox or files, and you cannot take actions outside this app. Never pretend you did. " +
  'You do control FluxOS: six divisions of AI agents (Director, Marketing, Sales, Operation, Production, Finance) and the founder is the human who approves key steps. ' +
  'The current FluxOS activity is given to you below. For questions about today\'s work, tasks, status, what an agent or division is doing, or what is waiting, answer ONLY from that activity, speak of it as FluxOS agent activity, and never invent items that are not in it. ' +
  'For such status questions you may use up to 4 short sentences. Mention anything waiting for the founder\'s approval first. ' +
  'If the request needs something else, say so in one sentence and offer what you can do now: think it through, draft, plan, compare options, decide. ' +
  'Keep answers easy to speak aloud.';

// FluxOS activity sent by the page, cleaned and capped before it goes into the prompt.
function agentsText(a) {
  if (!a || typeof a !== 'object') return '';
  const cut = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
  const out = ['FluxOS activity right now (time ' + cut(a.time, 8) + '):'];
  out.push('Tasks run automatically so far: ' + (Number(a.auto) || 0) + '.');
  if (a.byDivision && typeof a.byDivision === 'object') {
    out.push('Automatic tasks per division: ' + Object.keys(a.byDivision).slice(0, 8).map((k) => cut(k, 20) + ' ' + (Number(a.byDivision[k]) || 0)).join(', ') + '.');
  }
  out.push(a.pending && a.pending.text
    ? 'WAITING FOR THE FOUNDER (approve or revise): ' + cut(a.pending.division, 20) + ' asks: ' + cut(a.pending.text, 200)
    : 'Nothing is waiting for the founder\'s approval.');
  const rec = Array.isArray(a.recent) ? a.recent.slice(0, 10) : [];
  if (rec.length) {
    out.push('Latest activity, newest first:');
    rec.forEach((r) => out.push('- ' + cut(r && r.time, 8) + ' ' + cut(r && r.who, 20) + (r && r.human ? ' (founder step)' : '') + ': ' + cut(r && r.text, 160)));
  }
  return out.join('\n');
}

let lastGood = ''; // remembered while this function instance stays warm

// Netlify stops a function after ~10 s, so this keeps its own clock and always answers in time.
async function gemini(key, body, order, budgetMs = 8000) {
  const t0 = Date.now();
  const models = [process.env.GEMINI_MODEL, lastGood, ...order].filter((m, i, a) => m && a.indexOf(m) === i);
  let detail = '';
  let status = 0;
  for (const m of models) {
    const left = budgetMs - (Date.now() - t0);
    if (left < 1500) { detail = detail || `${m}: out of time`; break; }
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), Math.min(left, 5500));
    let r, j;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
        signal: ctl.signal,
      });
      j = await r.json();
    } catch (e) {
      clearTimeout(timer);
      detail = `${m}: ${e && e.name === 'AbortError' ? 'too slow' : 'network'}`;
      status = 0;
      continue;
    }
    clearTimeout(timer);
    if (r.ok) {
      const c = (j.candidates && j.candidates[0]) || {};
      const parts = (c.content && c.content.parts) || [];
      const text = parts.map((p) => p.text || '').join('').trim();
      if (!text) { detail = `${m}: empty reply (${c.finishReason || (j.promptFeedback && j.promptFeedback.blockReason) || 'no reason'})`; status = 200; continue; }
      lastGood = m;
      return { ok: true, text, model: m, ms: Date.now() - t0 };
    }
    status = r.status;
    detail = `${m}: ${r.status} ${String((j.error && j.error.message) || '').slice(0, 160)}`.split(key).join('***');
    if (![404, 429, 500, 503].includes(r.status)) break; // key or request problem: other models will not help
  }
  return { ok: false, detail, status, ms: Date.now() - t0 };
}


// Text to speech. The docs show two ways to name the voice, so both are tried if the first is refused.
async function speak(key, text, voice) {
  const t0 = Date.now();
  let detail = '';
  for (const m of TTS_MODELS) {
    for (const voiceConfig of [{ voice }, { prebuiltVoiceConfig: { voiceName: voice } }]) {
      const left = 8000 - (Date.now() - t0);
      if (left < 1500) return { ok: false, detail: detail || 'out of time' };
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), Math.min(left, 6500));
      let r, j;
      try {
        r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig } },
          }),
          signal: ctl.signal,
        });
        j = await r.json();
      } catch (e) {
        clearTimeout(timer);
        detail = `${m}: ${e && e.name === 'AbortError' ? 'too slow' : 'network'}`;
        break; // next model
      }
      clearTimeout(timer);
      if (r.ok) {
        const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
        const p = parts.find((x) => (x.inlineData && x.inlineData.data) || (x.inline_data && x.inline_data.data));
        const d = p && (p.inlineData || p.inline_data);
        if (d && d.data) return { ok: true, audio: d.data, mime: d.mimeType || d.mime_type || 'audio/wav', model: m, ms: Date.now() - t0 };
        detail = `${m}: no audio in reply`;
        break;
      }
      detail = `${m}: ${r.status} ${String((j.error && j.error.message) || '').slice(0, 140)}`.split(key).join('***');
      if (r.status === 400) continue; // try the other voice format
      if ([404, 429, 500, 503].includes(r.status)) break; // try the next model
      return { ok: false, detail };
    }
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
    const persona = PERSONA + ` The app language is ${langName}.` + (agentsText(body.agents) ? '\n\n' + agentsText(body.agents) : '');
    let r = await gemini(GEMINI_API_KEY, {
      systemInstruction: { parts: [{ text: persona }] },
      contents,
      generationConfig: { maxOutputTokens: 1024, thinkingConfig: { thinkingLevel: 'low' } },
    }, CHAT_MODELS, 7500);
    if (!r.ok && r.status === 400) {
      // the request itself was refused: retry once in the plainest form (persona inside the first message)
      const plain = contents.map((c) => ({ role: c.role, parts: [{ text: c.parts[0].text }] }));
      plain[0].parts[0].text = persona + '\n\nUser: ' + plain[0].parts[0].text;
      const r2 = await gemini(GEMINI_API_KEY, { contents: plain }, CHAT_MODELS, 4000);
      if (r2.ok) r = r2; else r.detail = `${r.detail} | retry ${r2.detail}`;
    }
    console.log('chat', r.ok ? r.model : 'FAIL', r.ms + 'ms', r.ok ? '' : r.detail);
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
          { text: `This is a short voice command from a founder talking to an assistant. The assistant's name is Flux-E (said as "Flux" or "Flux E") and the company is Kodeflux. Transcribe exactly what was said, even if it is only one or two words such as "hey", "hello", "halo" or "hi Flux". The language is most likely ${langName}, but may be Indonesian or English; do not translate. Do not guess or invent words: if there is no clear speech, output nothing. Output only the transcript.` },
          { inlineData: { mimeType: 'audio/wav', data: audio } },
        ],
      }],
      generationConfig: { maxOutputTokens: 512, temperature: 0, thinkingConfig: { thinkingLevel: 'low' } },
    }, STT_MODELS, 7500);
    console.log('stt', r.ok ? r.model : 'FAIL', r.ms + 'ms', r.ok ? '' : r.detail);
    if (!r.ok) return reply(502, { ok: false, error: 'ai', detail: r.detail });
    return reply(200, { ok: true, text: r.text });
  }

  if (body.action === 'tts') {
    const text = String(body.text || '').replace(/\s+/g, ' ').trim().slice(0, 500);
    if (!text) return reply(400, { ok: false, error: 'empty' });
    const r = await speak(GEMINI_API_KEY, text, process.env.FLUXE_VOICE || 'Kore');
    console.log('tts', r.ok ? r.model : 'FAIL', (r.ms || '') + 'ms', r.ok ? '' : r.detail);
    if (!r.ok) return reply(502, { ok: false, error: 'tts', detail: r.detail });
    return reply(200, { ok: true, audio: r.audio, mime: r.mime });
  }

  return reply(400, { ok: false });
};
