/* Kodeflux bundles — one config, rendered on /play and /corp.
   EDIT ONLY THE CONFIG BLOCK BELOW. */
(function () {
  var CFG = {
    launch: false,            // false = pre-launch (buttons go to Discord). true = checkout buttons live.
    discord: '',              // paste the Discord invite link here, e.g. 'https://discord.gg/xxxxx'
    seats: [50, 30, 20],      // seats per price phase (per bundle)
    // Seats and checkout links are tracked PER BUNDLE PER INDUSTRY.
    // buy: { rental: ['phase1 url','phase2 url','phase3 url'], party: [...], ... }
    // sold: { rental: 0, party: 0, ... }   (missing = 0)
    groups: [
      { id: 'io', kicker: 'FLUX I/O BUNDLES', title: 'Industry tools',
        inds: [['rental', 'Rental', 'Rental I/O'], ['party', 'Party', 'Party I/O'], ['travel', 'Travel', 'Travel I/O'], ['mentor', 'Mentor', 'Mentor I/O']],
        sub: 'Pilih industrimu dulu. Tiap bundle mencakup satu industri itu.',
        bundles: [
          { id: 'core',  name: 'Core',  tag: 'Tool-nya saja.',
            items: ['{tool}: the full tool', 'Full version, no demo limits'],
            prices: [79000, 99000, 129000],  sold: {}, buy: {} },
          { id: 'kit',   name: 'Kit',   tag: 'Tool + playbook.',
            items: ['Everything in Core', 'E-playbook for {ind}'],
            prices: [99000, 129000, 169000], sold: {}, buy: {} },
          { id: 'suite', name: 'Suite', tag: 'Paket lengkap.', feat: 'Most complete',
            items: ['Everything in Kit', 'E-mini course for {ind}'],
            prices: [129000, 169000, 219000], sold: {}, buy: {} }
        ] },
      { id: 'hq', kicker: 'FLUXHQ BUNDLES', title: 'Virtual office',
        inds: [['agency', 'Agency', 'Agency'], ['rental', 'Rental', 'Rental'], ['travel', 'Travel', 'Travel'], ['party', 'Party', 'Party'], ['mentor', 'Mentor', 'Mentor'], ['retail', 'Retail', 'Retail']],
        sub: 'Pilih industrimu dulu. Enam meja dan 18 agent, berjalan dengan API key Claude atau GPT milikmu.',
        bundles: [
          { id: 'alpha', name: 'Alpha', tag: 'Kantor virtualmu.',
            items: ['FluxHQ for {ind}: 6 desks, 18 agents', 'Runs on your own Claude or GPT key'],
            prices: [399000, 499000, 599000], sold: {}, buy: {} },
          { id: 'prime', name: 'Prime', tag: 'Kantor + playbook.',
            items: ['Everything in Alpha', 'E-playbook for {ind}'],
            prices: [499000, 599000, 699000], sold: {}, buy: {} },
          { id: 'elite', name: 'Elite', tag: 'Kantor + panduan lengkap.', feat: 'Best value',
            items: ['Everything in Prime', 'E-mini course for {ind}'],
            prices: [599000, 699000, 799000], sold: {}, buy: {} }
        ] }
    ]
  };

  var CSS = '' +
  '.bnd-note{margin-top:14px;color:var(--muted,#a29eab);font-size:.92rem;max-width:44rem}' +
  '.bnd-group{margin-top:34px}' +
  '.bnd-gh{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;margin-bottom:14px}' +
  '.bnd-gh b{font-family:var(--mono,monospace);font-size:.74rem;letter-spacing:.12em;color:var(--amber,#e7b565);font-weight:500}' +
  '.bnd-gh span{color:var(--muted,#a29eab);font-size:.92rem}' +
  '.bnd-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}' +
  '.bnd{position:relative;display:flex;flex-direction:column;padding:22px;border:1px solid var(--line,rgba(255,255,255,.09));border-radius:20px;background:rgba(255,255,255,.035)}' +
  '.bnd.feat{border-color:rgba(167,139,250,.55);background:linear-gradient(180deg,rgba(123,79,216,.12),rgba(255,255,255,.03))}' +
  '.bnd-badge{position:absolute;top:-11px;right:18px;padding:3px 10px;border-radius:99px;background:linear-gradient(135deg,#7b4fd8,#c8578f);color:#fff;font-size:.68rem;font-weight:700;letter-spacing:.04em}' +
  '.bnd h3{font-size:1.35rem;letter-spacing:-.02em;margin:0}' +
  '.bnd-tag{margin-top:2px;color:var(--muted,#a29eab);font-size:.9rem}' +
  '.bnd-price{margin-top:16px;display:flex;align-items:baseline;gap:8px}' +
  '.bnd-price b{font-size:2rem;letter-spacing:-.03em;line-height:1}' +
  '.bnd-price span{color:var(--muted,#a29eab);font-size:.84rem}' +
  '.bnd ul{list-style:none;margin:16px 0 0;padding:0;flex:1}' +
  '.bnd li{position:relative;padding:0 0 8px 20px;font-size:.92rem;line-height:1.45;color:var(--fg,#f4f1ea)}' +
  '.bnd li::before{content:"";position:absolute;left:2px;top:.5em;width:8px;height:8px;border-radius:50%;background:var(--amber,#e7b565)}' +
  '.bnd-lad{margin:14px 0 0;display:grid;gap:6px}' +
  '.bnd-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;height:36px;padding:0 12px;border:1px solid var(--line,rgba(255,255,255,.09));border-radius:11px;font-size:.84rem;color:var(--muted,#a29eab)}' +
  '.bnd-row i{font-style:normal;font-family:var(--mono,monospace);font-size:.7rem;letter-spacing:.06em}' +
  '.bnd-row b{font-size:.98rem;font-weight:700;letter-spacing:-.01em}' +
  '.bnd-row em{font-style:normal;text-align:right;font-size:.68rem}' +
  '.bnd-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}' +
  '.bnd-chip{padding:.45rem .95rem;border-radius:99px;border:1px solid var(--line,rgba(255,255,255,.12));background:rgba(255,255,255,.03);color:var(--muted,#a29eab);font:inherit;font-size:.86rem;cursor:pointer;transition:.2s}' +
  '.bnd-chip:hover{color:var(--fg,#f4f1ea);border-color:rgba(255,255,255,.28)}' +
  '.bnd-chip.on{color:#17120a;background:var(--amber,#e7b565);border-color:var(--amber,#e7b565);font-weight:600}' +
  '.bnd-row.now{color:var(--fg,#f4f1ea);border-color:rgba(231,181,101,.55);background:rgba(231,181,101,.08)}' +
  '.bnd-row.now em{color:var(--amber,#e7b565);font-weight:600}' +
  '.bnd-row.done{opacity:.5}.bnd-row.done b{text-decoration:line-through}' +
  '.bnd-row.next b{filter:blur(0)}' +
  '.bnd-cta{margin-top:16px}' +
  '.bnd-cta .btn{width:100%}' +
  '.bnd-cta .btn[aria-disabled="true"]{opacity:.5;pointer-events:none}' +
  '.bnd-fine{margin-top:10px;text-align:center;color:var(--dim,#6f6b78);font-size:.76rem}' +
  '@media(max-width:900px){.bnd-grid{grid-template-columns:1fr}.bnd-badge{right:16px}}';

  function k(n) { return 'Rp' + (n / 1000) + 'K'; }

  function phaseOf(sold) {
    var acc = 0;
    for (var i = 0; i < CFG.seats.length; i++) {
      acc += CFG.seats[i];
      if (sold < acc) return { i: i, left: acc - sold };
    }
    return { i: -1, left: 0 };
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function cta(b, cur, ind) {
    var arrow = '<svg class="ic"><use href="#i-arrow"/></svg>';
    if (!CFG.launch) {
      return CFG.discord
        ? '<a class="btn btn-glass" href="' + CFG.discord + '" target="_blank" rel="noopener noreferrer">Join Discord for launch ' + arrow + '</a>'
        : '<span class="btn btn-glass" aria-disabled="true">Launching soon</span>';
    }
    if (cur.i < 0) {
      return CFG.discord
        ? '<a class="btn btn-glass" href="' + CFG.discord + '" target="_blank" rel="noopener noreferrer">Lifetime sold out. Join Discord ' + arrow + '</a>'
        : '<span class="btn btn-glass" aria-disabled="true">Lifetime sold out</span>';
    }
    var link = ((b.buy && b.buy[ind[0]]) || [])[cur.i];
    return link
      ? '<a class="btn btn-primary" href="' + link + '" target="_blank" rel="noopener noreferrer">Get ' + esc(b.name) + ' · ' + esc(ind[1]) + ' for ' + k(b.prices[cur.i]) + ' ' + arrow + '</a>'
      : '<span class="btn btn-primary" aria-disabled="true">Checkout opening soon</span>';
  }

  function card(b, ind) {
    var cur = phaseOf((b.sold && b.sold[ind[0]]) || 0);
    var showNow = cur.i < 0 ? CFG.seats.length - 1 : cur.i;
    var rows = '';
    for (var i = 0; i < CFG.seats.length; i++) {
      var st = cur.i < 0 || i < cur.i ? 'done' : (i === cur.i ? 'now' : 'next');
      var label = st === 'done' ? 'Sold out'
        : st === 'now' ? (CFG.launch ? cur.left + ' of ' + CFG.seats[i] + ' left' : CFG.seats[i] + ' seats only')
        : CFG.seats[i] + ' seats only';
      rows += '<div class="bnd-row ' + st + '"><i>PHASE ' + (i + 1) + '</i><b>' + k(b.prices[i]) + '</b><em>' + label + '</em></div>';
    }
    var items = b.items.map(function (t) { return '<li>' + esc(t.replace('{tool}', ind[2]).replace('{ind}', ind[1])) + '</li>'; }).join('');
    return '<article class="bnd' + (b.feat ? ' feat' : '') + ' rv">' +
      (b.feat ? '<span class="bnd-badge">' + esc(b.feat) + '</span>' : '') +
      '<h3>' + esc(b.name) + '</h3><p class="bnd-tag">' + esc(b.tag) + '</p>' +
      '<div class="bnd-price"><b>' + k(b.prices[showNow]) + '</b><span>lifetime · 1 industri</span></div>' +
      '<ul>' + items + '</ul>' +
      '<div class="bnd-lad">' + rows + '</div>' +
      '<div class="bnd-cta">' + cta(b, cur, ind) + '</div>' +
      '<p class="bnd-fine">Harga naik seiring seat terjual. Harga berlaku untuk satu industri.</p>' +
      '</article>';
  }

  var SEL = {};
  (function () {
    var q = (new URLSearchParams(location.search).get('industry') || '').toLowerCase();
    CFG.groups.forEach(function (g) {
      var hit = g.inds.filter(function (x) { return x[0] === q; })[0];
      SEL[g.id] = hit ? hit[0] : g.inds[0][0];
    });
  })();

  function render() {
    var mounts = document.querySelectorAll('[data-bundles]');
    if (!mounts.length) return;
    if (!document.getElementById('bnd-css')) {
      var s = document.createElement('style'); s.id = 'bnd-css'; s.textContent = CSS; document.head.appendChild(s);
    }
    [].forEach.call(mounts, function (m) {
      var want = m.getAttribute('data-bundles');
      var out = '';
      CFG.groups.forEach(function (g) {
        if (want !== 'all' && want !== g.id) return;
        var ind = g.inds.filter(function (x) { return x[0] === SEL[g.id]; })[0] || g.inds[0];
        var chips = g.inds.map(function (x) {
          return '<button type="button" class="bnd-chip' + (x[0] === ind[0] ? ' on' : '') + '" data-g="' + g.id + '" data-i="' + x[0] + '">' + esc(x[1]) + '</button>';
        }).join('');
        out += '<div class="bnd-group"><div class="bnd-gh"><b>' + g.kicker + '</b><span>' + esc(g.sub) + '</span></div>' +
          '<div class="bnd-chips" role="group" aria-label="Industry">' + chips + '</div>' +
          '<div class="bnd-grid">' + g.bundles.map(function (b) { return card(b, ind); }).join('') + '</div></div>';
      });
      m.innerHTML = out;
      [].forEach.call(m.querySelectorAll('.rv'), function (el) { el.classList.add('in'); });
    });
  }

  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.bnd-chip');
    if (!c) return;
    SEL[c.getAttribute('data-g')] = c.getAttribute('data-i');
    render();
  });

  window.KODEFLUX_BUNDLES = CFG;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
