const R = FW.rules, ALL_DIMS = FW.dimensions, LAYERS = FW.layers;
const F = R.foundation || "SY", TOP = R.top_layer || "DP";
// Milestones per stage become one flat evidence list; evStage records which stage each item belongs to.
for (const d of ALL_DIMS) if (d.milestones && !d.evidence){
  d.evidence = []; d.evStage = [];
  for (const st of Object.keys(d.milestones).sort()) for (const m of d.milestones[st]){ d.evidence.push(m); d.evStage.push(+st); }
}
let DIMS = ALL_DIMS;
function applyScope(){ const out = new Set((S && S.scope) || []); DIMS = ALL_DIMS.filter(d => !out.has(d.id)); if (!DIMS.length) DIMS = ALL_DIMS; }
const LAYER = Object.fromEntries(LAYERS.map(l => [l.id, l]));
const FRAGILE = new Set(FW.dependency_options.filter(d => d.fragile).map(d => d.id));
const LVCOL = ["var(--l1)","var(--l2)","var(--l3)","var(--l4)","var(--l5)"];
const C = Object.assign({
  key: "bca-session-v1", org: "organization", orgLabel: "Organization", orgPh: "Organization name", untitled: "Untitled organization",
  leaderPh: "e.g. CEO, Managing Principal", thesis: "Brand is a readout of the system that produces it.",
  who: "people from key functions", r2Who: "People from key functions",
  r2Include: "Include someone two or more levels below leadership.",
  stPh: "e.g. BD Director", roleLabel: "Function", kindLabel: "Serves as",
  sampleNote: "You're viewing a fictional sample organization.", loadSample: "Load the sample organization",
  coherence: "Organizational coherence", readout: "Cohesion readout", levelWord: "Cohesion level",
  overview: "", r1Text: "", r2Text: "", scaleTitle: "Five levels" }, FW.copy || {});
const KEY = C.key;
const ico = (n, cls = "ico") => { const g = n && window.ICONS && window.ICONS[n]; return g ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${g}</svg>` : ""; };
const stTag = st => [st.role, st.kind].filter(Boolean).join(" · ");

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = (v, d = 2) => v == null || isNaN(v) ? "–" : (Math.sign(v) * Math.round((Math.abs(v) + 1e-9) * 10 ** d) / 10 ** d).toFixed(d);
const pct = v => v == null || isNaN(v) ? "–" : Math.round(v * 100) + "%";
const clone = o => JSON.parse(JSON.stringify(o));

function blank(){ return { v:1, mode:"full", org:"", sample:false, leader:{title:"", answers:{}}, stakeholders:[], view:{screen:"overview", dim:0, st:null, sstep:0} }; }
let S;
try { const raw = localStorage.getItem(KEY); S = raw ? JSON.parse(raw) : null; } catch(e){ S = null; }
if (!S || !S.leader || (S.sample && S.sampleId !== SAMPLE.sampleId)) S = clone(SAMPLE);
applyScope();
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

/* ---------- scoring (mirrors the Excel model) ---------- */
function band(v){ let n = R.bands[0][1]; for (const [t, nm] of R.bands) if (v >= t - 1e-9) n = nm; return n; }
function levelN(name){ return FW.levels.findIndex(l => l.name === name) + 1; }
function mean(a){ return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null; }

function syScore(){
  const sy = DIMS.filter(d => d.layer === F);
  if (!sy.length) return null;
  if (!sy.every(d => S.leader.answers[d.id]?.rating)) return null;
  return mean(sy.map(d => adjusted(d).score));
}
function lightRoute(d){
  const sy = syScore();
  return S.mode === "light" && d.layer !== F && sy != null && sy <= 2;
}
function depAsked(d){
  const a = S.leader.answers[d.id]; const sy = d.layer === F ? null : syScore();
  return !!(a?.rating && sy != null && a.rating >= sy + 2 && !lightRoute(d));
}
function adjusted(d){
  const a = S.leader.answers[d.id];
  if (!a?.rating) return {score:null};
  const ec = evCheck(d, a);
  const evAdj = ec && !ec.holds ? -1 : 0;
  const asked = d.layer !== F && depAsked(d);
  const frAdj = asked && FRAGILE.has(a.dep) ? -1 : 0;
  return {score: Math.max(1, a.rating + evAdj + frAdj), evAdj, frAdj, asked};
}
// Evidence check: a rating at or above R.evidence_from holds only when enough of that stage's milestones are in place.
function evCheck(d, a){
  if (!a?.rating || a.rating < (R.evidence_from || 4)) return null;
  if (d.evStage){
    const items = d.evStage.map((s, k) => s === a.rating ? k : -1).filter(k => k >= 0);
    if (!items.length) return null;
    const got = (a.ev || []).filter(k => items.includes(k)).length, need = Math.max(1, Math.ceil(items.length * (R.evidence_share || 0.5)));
    return {items, got, need, holds: got >= need};
  }
  const got = (a.ev || []).length; return {items: d.evidence.map((_, k) => k), got, need: R.evidence_threshold, holds: got >= R.evidence_threshold};
}
function rollUp(scores){
  const layer = {};
  for (const L of LAYERS){ const v = DIMS.filter(d => d.layer === L.id).map(d => scores[d.id]); layer[L.id] = mean(v); }
  const live = LAYERS.filter(L => layer[L.id] != null), wsum = live.reduce((s, L) => s + L.weight, 0);
  const index = live.reduce((s, L) => s + layer[L.id] * L.weight, 0) / wsum;   // weights re-balance when a layer is out of scope
  const ceiling = layer[F] == null ? 5 : Math.min(5, layer[F] + 1);
  const capped = Math.min(index, ceiling);
  const resT = R.bands[4][0];
  const topLow = layer[TOP] != null && layer[TOP] < 4;
  const fin = topLow ? Math.min(capped, resT - 0.01) : capped;
  return {layer, index, ceiling, final: fin, level: band(fin), ceilingApplied: index > ceiling,
          resCapped: topLow && capped >= resT, upstream: layer[F] != null && layer[F] <= 2};
}
function leaderComplete(){ return DIMS.every(d => S.leader.answers[d.id]?.rating); }
function leaderResult(){
  if (!leaderComplete()) return null;
  const adj = {}; let unverified = 0, fragile = 0;
  for (const d of DIMS){ const x = adjusted(d); adj[d.id] = x.score; if (x.evAdj) unverified++; if (x.frAdj) fragile++; }
  const out = rollUp(adj);
  const order = DIMS.map(d => d.id);
  out.adj = adj; out.unverified = unverified; out.fragile = fragile;
  out.verify = [...order].sort((a, b) => adj[b] - adj[a] || order.indexOf(a) - order.indexOf(b)).slice(0, R.verify_count);
  out.confirm = [...order].sort((a, b) => adj[a] - adj[b] || order.indexOf(a) - order.indexOf(b)).slice(0, R.confirm_count);
  return out;
}
function stComplete(st){ return DIMS.every(d => st.answers[d.id]?.rating); }
function composite(){
  const lr = leaderResult(); if (!lr) return null;
  const sts = S.stakeholders.filter(stComplete);
  if (!sts.length) return {lr, sts, valid:false};
  const comp = {}, det = {}, spreads = [];
  for (const d of DIMS){
    const s = sts.map(st => st.answers[d.id].rating), L = lr.adj[d.id];
    const m = mean(s), sp = Math.max(...s) - Math.min(...s), all = Math.max(...s, L) - Math.min(...s, L), gap = L - m;
    const flags = [];
    if (gap >= R.blind_spot_gap) flags.push("Blind spot");
    if (gap <= -R.blind_spot_gap) flags.push("Hidden strength");
    if (sp >= R.fracture_spread) flags.push("Fracture");
    comp[d.id] = Math.max(1, (L + s.reduce((a, b) => a + b, 0)) / (s.length + 1) - (sp >= R.fracture_spread ? R.fracture_penalty : 0));
    spreads.push(all);
    det[d.id] = {s, m, sp, gap, flags, comp: comp[d.id], L};
  }
  const out = rollUp(comp);
  Object.assign(out, {lr, sts, det, valid: sts.length >= R.min_stakeholders, align: 1 - mean(spreads) / 4});
  let num = 0, den = 0;
  for (const id of lr.verify){ const ev = S.leader.answers[id].ev || []; for (const st of sts){ den += ev.length; num += (st.verify?.[id] || []).filter(i => ev.includes(i)).length; } }
  out.corrob = den ? num / den : null;
  let y = 0, n = 0;
  for (const id of lr.confirm) for (const st of sts){ const v = st.confirm?.[id]?.v; if (v){ n++; if (v === "Y") y++; } }
  out.rootAgree = n ? y / n : null;
  return out;
}

/* ---------- views ---------- */
const main = document.getElementById("main");
function go(screen, extra = {}){ Object.assign(S.view, {screen}, extra); save(); render(); window.scrollTo({top:0}); }

function renderRail(){
  const lr = leaderComplete(), done = DIMS.filter(d => S.leader.answers[d.id]?.rating).length;
  const nst = S.stakeholders.filter(stComplete).length;
  const steps = [
    ["overview","Overview","", true],
    ["r1","Leader interview", `${done}/${DIMS.length}`, done === DIMS.length],
    ["r1result","Leader view", "", lr],
    ["r2","Stakeholders", `${nst} done`, nst >= R.min_stakeholders],
    ["results",C.readout, "", nst >= R.min_stakeholders && lr],
  ];
  const cur = S.view.screen === "r2int" ? "r2" : S.view.screen;
  const EN = FW.enhanced, ready = EN ? enhancedReady() : false;
  document.getElementById("rail").innerHTML = `<div class="steps">` + steps.map(([k, l, m, d], i) =>
    `<button class="step ${d && k !== "overview" ? "done" : ""}" data-act="go" data-v="${k}" ${cur === k ? 'aria-current="page"' : ""}>
      <span class="dot">${d && k !== "overview" ? "✓" : i}</span><span>${l}</span><span class="meta">${m}</span></button>`).join("") + `</div>` +
    (EN ? `<div class="rail-cta"><button class="btn primary" id="enhanced-btn" data-act="go" data-v="enhanced" ${ready ? "" : "disabled"} ${cur === "enhanced" ? 'aria-current="page"' : ""}>${esc(EN.button)}</button>${ready ? "" : `<span class="hint">${esc(EN.locked)}</span>`}</div>` : "") +
    `<div class="rail-note">${S.mode === "full" ? "<b>Full mode.</b> Every branch probe runs. For facilitated interviews." : "<b>Light mode.</b> Gate questions and evidence checks only. For self-serve use."}</div>`;
  document.getElementById("mode-light").setAttribute("aria-pressed", S.mode === "light");
  document.getElementById("mode-full").setAttribute("aria-pressed", S.mode === "full");
  document.getElementById("orgline").innerHTML = (S.org ? esc(S.org) : C.untitled) + (S.sample ? ` <span class="sample-flag">Sample data</span>` : "");
}

function scaleStrip(active){
  return `<div class="scale">${FW.levels.map((l, i) => `<div class="lv ${active === l.name ? "on" : ""}"><div class="n">${i + 1}</div><div class="nm">${l.name}</div><div class="bar" style="background:${LVCOL[i]}"></div></div>`).join("")}</div>`;
}

function vOverview(){
  const actions = `<div class="row"><button class="btn primary" data-act="go" data-v="r1">${Object.keys(S.leader.answers).length ? "Continue leader interview" : "Start leader interview"}</button>
    ${S.sample ? `<button class="btn" data-act="new-confirm">Start a new assessment</button><span class="small">${esc(C.sampleNote)}</span>` : ""}</div>`;
  return `<div class="stack">
  <div><div class="eyebrow">How it works</div>
  <h2 class="title">${esc(C.thesis)}</h2>
  <p class="lede">${esc(C.overview.replace("{n}", DIMS.length))} A leader answers first; then two or more ${esc(C.who)} answer the same questions blind. Where they disagree is part of the result.</p></div>
  <div class="spine">${LAYERS.map(L => `<div class="band"><div>${L.icon ? `<div class="lyr-ico">${ico(L.icon)}</div>` : ""}<div class="role">${esc(L.role)} · ${Math.round(L.weight*100)}%</div><div class="nm">${esc(L.name)}</div></div>
    <div><div class="small">${esc(L.desc)}</div><div class="dims">${DIMS.filter(d => d.layer === L.id).map(d => `<span class="chip">${ico(d.icon)}<span class="mono">${d.id}</span>${esc(d.name)}</span>`).join("")}</div></div></div>`).join("")}</div>
  <div><h3>${esc(C.scaleTitle)}</h3>${scaleStrip()}</div>
  ${vScope()}
  <div class="grid2">
    <div class="panel"><h3>Round 1: Leader</h3><p class="small">${esc(C.r1Text)}</p></div>
    <div class="panel"><h3>Round 2: Stakeholders</h3><p class="small">${esc(C.r2Text)}</p></div>
  </div>
  <div class="panel stack">
    <label for="org-name"><h3 style="margin:0">${esc(C.orgLabel)}</h3></label>
    <input type="text" id="org-name" data-bind="org" value="${esc(S.org)}" placeholder="${esc(C.orgPh)}">
    <label for="leader-title" class="small">Leader's role</label>
    <input type="text" id="leader-title" data-bind="ltitle" value="${esc(S.leader.title)}" placeholder="${esc(C.leaderPh)}">
    ${FW.profile ? "" : actions}
  </div>${FW.profile ? vProfileForm() + actions : ""}</div>`;
}

/* ---------- church and community profile (context only, never scored) ---------- */
/* ---------- scope: which domains apply to this organization ---------- */
function vScope(){
  if (!C.scopeTitle) return "";
  const out = new Set(S.scope || []);
  return `<div class="panel stack" id="scope"><div><h3 style="margin:0 0 4px">${esc(C.scopeTitle)}</h3><p class="small" style="margin:0;max-width:70ch">${esc(C.scopeText)}</p></div>
    <div class="scope-grid">${LAYERS.map(L => `<fieldset class="scope-col"><legend>${ico(L.icon)} ${esc(L.name)}</legend>${ALL_DIMS.filter(d => d.layer === L.id).map(d =>
      `<label class="check"><input type="checkbox" id="scope-${d.id}" data-act="scope" data-v="${d.id}" ${out.has(d.id) ? "" : "checked"}><span>${ico(d.icon)} ${esc(d.name)}</span></label>`).join("")}</fieldset>`).join("")}</div>
    <p class="small" style="margin:0">${DIMS.length} of ${ALL_DIMS.length} domains in scope.</p></div>`;
}
function blankProfile(){
  const P = FW.profile;
  return { says: "", zips: "", source: "", foot: {v: "", basis: "estimate"},
    age: {church: P.age.bands.map(() => ""), community: P.age.bands.map(() => ""), basis: "estimate"},
    hh: {church: P.hh.rows.map(() => ""), community: P.hh.rows.map(() => ""), basis: "estimate"} };
}
function pctInput(id, path, val, label){
  return `<span class="pct"><input type="number" inputmode="decimal" min="0" max="100" step="1" id="${id}" aria-label="${esc(label)}" data-bind="prof" data-path="${path}" value="${esc(val)}"><span>%</span></span>`;
}
function basisSelect(key){
  const P = FW.profile, v = S.profile[key].basis;
  return `<select id="pf-basis-${key}" aria-label="${esc(P.basisLabel)}" data-bind="prof" data-path="${key}.basis">${[["estimate", P.basisEstimate], ["counted", P.basisCounted]].map(([k, t]) => `<option value="${k}" ${v === k ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>`;
}
function vProfileForm(){
  const P = FW.profile, p = S.profile;
  const grid = (key, labels) => `<div class="pf-table"><span></span><span class="h">${esc(P.inside)}</span><span class="h">${esc(P.outside)}</span>
    ${labels.map((l, i) => `<label for="pf-${key}-c-${i}">${esc(l)}</label>${pctInput(`pf-${key}-c-${i}`, `${key}.church.${i}`, p[key].church[i], l + ", " + P.inside)}${pctInput(`pf-${key}-m-${i}`, `${key}.community.${i}`, p[key].community[i], l + ", " + P.outside)}`).join("")}</div>`;
  return `<div class="panel stack" id="profile">
    <div><h3 style="margin:0 0 4px">${esc(P.title)}</h3><p class="small" style="margin:0;max-width:70ch">${esc(P.intro)}</p></div>
    <div class="pf-two">
      <div><label class="small" for="pf-says">${esc(P.saysLabel)}</label><textarea id="pf-says" data-bind="prof" data-path="says" placeholder="${esc(P.saysPh)}" style="min-height:64px">${esc(p.says)}</textarea></div>
      <div><label class="small" for="pf-zips">${esc(P.zipsLabel)}</label><input type="text" id="pf-zips" data-bind="prof" data-path="zips" value="${esc(p.zips)}" placeholder="${esc(P.zipsPh)}">
        <label class="small" for="pf-source">${esc(P.sourceLabel)}</label><input type="text" id="pf-source" data-bind="prof" data-path="source" value="${esc(p.source)}" placeholder="${esc(P.sourcePh)}"></div>
    </div>
    <div class="pf-block"><div class="pf-head"><h4>${esc(P.foot.title)}</h4>${basisSelect("foot")}</div>
      <div class="pf-table"><label for="pf-foot">${esc(P.foot.label)}</label>${pctInput("pf-foot", "foot.v", p.foot.v, P.foot.label)}<span></span></div></div>
    <div class="pf-block"><div class="pf-head"><h4>${esc(P.age.title)} <span class="small" style="font-weight:400">${esc(P.age.unit)}</span></h4>${basisSelect("age")}</div>
      ${grid("age", P.age.bands)}
      <div class="pf-table" style="margin-top:6px"><span></span><span class="pf-hint" id="pf-sum-church" role="status"></span><span class="pf-hint" id="pf-sum-community" role="status"></span></div></div>
    <div class="pf-block"><div class="pf-head"><h4>${esc(P.hh.title)} <span class="small" style="font-weight:400">${esc(P.hh.unit)}</span></h4>${basisSelect("hh")}</div>
      ${grid("hh", P.hh.rows)}</div>
    <details><summary class="small" style="cursor:pointer">${esc(P.helpTitle)}</summary><p class="small" style="margin:8px 0 0;max-width:70ch">${esc(P.help)} <a href="https://data.census.gov/" target="_blank" rel="noopener">data.census.gov</a></p></details>
  </div>`;
}
function profileHints(){
  if (!FW.profile || !S.profile) return;
  for (const side of ["church", "community"]){
    const el = document.getElementById("pf-sum-" + side); if (!el) continue;
    const v = S.profile.age[side], full = v.every(x => x !== "" && !isNaN(+x)), sum = v.reduce((a, x) => a + (+x || 0), 0);
    el.textContent = full ? `Adds to ${fmt(sum, 0)}%` : "";
    el.className = "pf-hint" + (full && Math.abs(sum - 100) > 1 ? " off" : "");
  }
}
function profData(){
  const P = FW.profile, p = S.profile; if (!P || !p) return null;
  const num = v => v === "" || v == null || isNaN(+v) || +v < 0 || +v > 100 ? null : +v;
  const rows = (labels, key) => labels.map((label, i) => { const c = num(p[key].church[i]), m = num(p[key].community[i]), gap = c != null && m != null ? c - m : null;
    return {label, c, m, gap, ratio: gap != null && m > 0 ? c / m : null, notable: gap != null && Math.abs(gap) >= P.noise}; });
  const age = rows(P.age.bands, "age"), hh = rows(P.hh.rows, "hh"), foot = num(p.foot.v), all = [...age, ...hh];
  return {P, p, age, hh, foot, all, any: foot != null || all.some(r => r.c != null || r.m != null) || !!p.says.trim() || !!p.zips.trim()};
}
/* ---------- next steps: group by level, start upstream, add a step per flag ---------- */
function nextSteps(c){
  const N = FW.next; if (!N) return null;
  const g = N.groups.find(x => x.levels.includes(c.level)); if (!g) return null;
  const sy = c.layer[F], sound = g.id === "align" && sy != null && sy >= N.upstream;
  const order = [...LAYERS.map(l => l.id)].filter(id => c.layer[id] != null && !(sound && id === F)).sort((a, b) => c.layer[a] - c.layer[b] || g.tie.indexOf(a) - g.tie.indexOf(b));
  const startId = sy != null && sy < N.upstream ? F : order[0];
  const lt = (S.leader.title || "leader").trim(), leader = "The " + lt;
  const fill = (t, o) => esc(t).replace(/\{(\w+)\}/g, (_, k) => esc(o[k] ?? ""));
  const layerAction = (id, tag) => { const ds = DIMS.filter(d => d.layer === id).sort((a, b) => c.det[a.id].comp - c.det[b.id].comp), low = ds[0];
    const o = {v: fmt(c.layer[id]), sy: fmt(sy), dim: low.name, dimv: fmt(c.det[low.id].comp)}, a = g.layers[id];
    return {tag: `${tag} · ${LAYER[id].name} layer`, title: fill(a.title, o), why: fill(a.why, o), first: fill(a.first, o)}; };
  // flags, each with the one dimension that shows it most strongly
  const by = (f, key) => DIMS.filter(d => c.det[d.id].flags.includes(f)).sort(key)[0];
  const found = {};
  const b = by("Blind spot", (x, y) => c.det[y.id].gap - c.det[x.id].gap); if (b) found.blind = {dim: b.name, L: c.det[b.id].L, m: fmt(c.det[b.id].m, 1), leader};
  const fr = by("Fracture", (x, y) => c.det[y.id].sp - c.det[x.id].sp); if (fr) found.fracture = {dim: fr.name, min: Math.min(...c.det[fr.id].s), max: Math.max(...c.det[fr.id].s)};
  const h = by("Hidden strength", (x, y) => c.det[x.id].gap - c.det[y.id].gap); if (h) found.hidden = {dim: h.name, L: c.det[h.id].L, m: fmt(c.det[h.id].m, 1), leader: "the " + lt};
  const fg = DIMS.find(d => adjusted(d).frAdj); if (fg) found.fragile = {dim: fg.name};
  const pd = typeof profData === "function" ? profData() : null, gp = pd ? pd.all.filter(r => r.notable).sort((x, y) => Math.abs(y.gap) - Math.abs(x.gap))[0] : null;
  if (gp) found.gap = {label: gp.label, c: fmt(gp.c, 0), cm: fmt(gp.m, 0), says: pd.p.says.trim() ? `The church says it is for “${pd.p.says.trim()}”. ` : ""};
  const flagKeys = g.flags.filter(k => found[k]);
  const actions = [layerAction(startId, N.labels.start)];
  const room = N.cap - 2;                       // one slot each kept for the starting action and the standing action
  flagKeys.slice(0, room).forEach(k => { const a = N.flagActions[k], o = found[k]; actions.push({tag: N.labels[k], title: fill(a.title, o), why: fill(a.why, o), first: fill(a.first, o)}); });
  const st = g.standing; let extra = null;
  if (actions.length + 1 < N.min) {              // too few flags to fill the list: add one more step that is true for this result
    const nextId = order.find(id => id !== startId && id !== F);
    if (g.second && !sound) extra = {tag: N.labels.then, title: esc(g.second.title), why: esc(g.second.why), first: esc(g.second.first)};
    else if (nextId) extra = layerAction(nextId, N.labels.then);
  }
  if (extra) actions.push(extra);
  actions.push({tag: N.labels.standing, title: esc(st.title), why: esc(st.why), first: esc(st.first)});
  const also = flagKeys.slice(room).map(k => `<b>${esc(N.labels[k])}.</b> ${fill(N.flagActions[k].also, found[k])}`);
  return {N, g, sound, startId, actions, also, posture: sound ? g.sound.posture : g.posture, hold: sound ? g.sound.hold : g.hold};
}
function vNextSteps(c){
  const x = nextSteps(c); if (!x) return "";
  const {N, g} = x;
  return `<div class="panel stack" id="next-steps">
    <div><h3 style="margin:0 0 4px">${esc(N.title)}</h3><p class="small" style="margin:0;max-width:70ch">${esc(N.intro)}</p></div>
    <div class="ns-groups">${N.groups.map(k => `<div class="g ${k.id === g.id ? "on" : ""}"><div class="lv">${esc(k.levels.join(" · "))}</div><div class="nm">${esc(k.name)}</div></div>`).join("")}</div>
    <p class="ns-posture"><b>${esc(g.name)}.</b> ${esc(x.posture)}</p>
    <ol class="ns-actions">${x.actions.map((a, i) => `<li><span class="n">${i + 1}</span><div><div class="ns-tag">${esc(a.tag)}</div><h4>${a.title}</h4><p class="why">${a.why}</p><p class="first"><b>${esc(N.labels.first)}:</b> ${a.first}</p></div></li>`).join("")}</ol>
    <div class="branch warn"><div class="tag">${esc(N.labels.hold)}</div><p style="margin:0">${esc(x.hold)}</p></div>
    ${x.also.length ? `<div><div class="ns-tag" style="margin-bottom:4px">${esc(N.labels.also)}</div><ul class="clean">${x.also.map(t => `<li>${t}</li>`).join("")}</ul></div>` : ""}
    <p class="small" style="margin:0">${esc(N.help)}</p>
  </div>`;
}
function anchorList(d, rating, act){
  return `<div class="anchors" role="radiogroup" aria-label="Choose the closest description">${d.anchors.map((a, i) => {
    const n = i + 1, lab = d.depth ? d.depth[i] : FW.levels[i].name, txt = d.depth ? a.replace(/^[^:]+:\s*/, "") : a;
    return `<button class="anchor" role="radio" id="${act}-${d.id}-${n}" aria-checked="${rating === n}" data-act="${act}" data-v="${n}">
      <span class="lvl"><span class="sw" style="background:${LVCOL[i]}"></span>${n} ${esc(lab)}</span><span class="txt">${esc(txt)}</span></button>`; }).join("")}</div>`;
}
function dimMap(cur, answered, act){
  return `<div class="dimmap">${LAYERS.map(L => `<div class="grp"><span>${ico(L.icon)}${L.name}</span>${DIMS.map((d, i) => d.layer !== L.id ? "" :
    `<button class="${answered(d) ? "ans" : ""} ${i === cur ? "cur" : ""}" data-act="${act}" data-v="${i}" title="${esc(d.name)}" aria-label="${d.id} ${esc(d.name)}">${d.id.slice(2)}</button>`).join("")}</div>`).join("")}</div>`;
}

function vR1(){
  const i = Math.min(S.view.dim, DIMS.length - 1), d = DIMS[i], L = LAYER[d.layer];
  const a = S.leader.answers[d.id] || {}, r = a.rating;
  const sy = syScore(), light = lightRoute(d), x = adjusted(d);
  let branch = "";
  if (light && r){
    branch = `<div class="notice warn">Upstream root cause: the ${LAYER[F].name} layer scored ${fmt(sy)}. Light mode skips probes for the remaining layers, so strong ratings here count as unverified.</div>`;
  } else if (r >= (R.evidence_from || 4)){
    const ec = evCheck(d, a);
    branch = `<div class="branch"><div class="tag">Evidence check${d.evStage ? ` · stage ${r} milestones` : ""}</div><p>${d.evStage ? `Claiming ${FW.levels[r - 1].name} means these are in place. Tick what the leader can point to today.` : "What would we see if we looked? Tick what the leader can point to."}</p>
      ${ec.items.map(k => `<label class="check"><input type="checkbox" id="ev-${d.id}-${k}" data-act="ev" data-v="${k}" ${(a.ev || []).includes(k) ? "checked" : ""}><span>${esc(d.evidence[k])}</span></label>`).join("")}
      <div class="status ${ec.holds ? "ok" : "drop"}">${ec.got} of ${ec.items.length} · ${ec.holds ? `rating of ${r} holds` : `needs ${ec.need} to hold; scores as ${Math.max(1, r - 1)}`}</div>
      ${S.mode === "full" && d.tension ? `<textarea id="note-${d.id}" data-bind="lnote" placeholder="${esc(d.tension)}" style="margin-top:10px">${esc(a.note)}</textarea>` : ""}</div>`;
  } else if (r === 3 && S.mode === "full"){
    branch = `<div class="branch"><div class="tag">Tension probe</div><p class="question" style="font-size:17px;margin-bottom:10px">${esc(d.tension)}</p>
      <textarea id="note-${d.id}" data-bind="lnote" placeholder="Notes">${esc(a.note)}</textarea></div>`;
  } else if (r && r <= 2 && S.mode === "full"){
    branch = `<div class="branch warn"><div class="tag">Root cause</div><p>What's behind this? Choose the closest cause.</p>
      ${FW.roots[d.layer].map((t, k) => `<label class="check"><input type="radio" name="root-${d.id}" id="root-${d.id}-${k}" data-act="root" data-v="${esc(t)}" ${a.root === t ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}
      <textarea id="note-${d.id}" data-bind="lnote" placeholder="The story behind it">${esc(a.note)}</textarea></div>`;
  }
  const nextStage = r && r < 5 && d.evStage ? d.evidence.filter((_, k) => d.evStage[k] === r + 1) : [];
  const nextList = nextStage.length ? `<details class="next-ms"><summary>To reach ${r + 1} ${esc(FW.levels[r].name)}: ${nextStage.length} milestone${nextStage.length > 1 ? "s" : ""}</summary><ul class="clean">${nextStage.map(m => `<li>${esc(m)}</li>`).join("")}</ul></details>` : "";
  let dep = "";
  if (x.asked){
    dep = `<div class="branch warn"><div class="tag">Dependency question</div><p>This is rated ${r - sy >= 2 ? "at least two levels" : ""} above the ${LAYER[F].name} layer (${fmt(sy)}). <b>What sustains it? If it disappeared tomorrow, what would it be because of?</b></p>
      ${FW.dependency_options.map(o => `<label class="check"><input type="radio" name="dep-${d.id}" id="dep-${d.id}-${o.id}" data-act="dep" data-v="${o.id}" ${a.dep === o.id ? "checked" : ""}><span>${esc(o.label)}</span></label>`).join("")}
      ${a.dep ? `<div class="status ${FRAGILE.has(a.dep) ? "drop" : "ok"}">${FRAGILE.has(a.dep) ? "Fragile signal: scores one level lower" : "Sustained by the system: no change"}</div>` : ""}</div>`;
  }
  const syNote = d.layer !== F && sy != null && !light ? `<div class="notice">${LAYER[F].name} layer ${fmt(sy)}. Ratings of ${Math.ceil(sy + 2 - 1e-9)} or higher here get the dependency question.</div>` : "";
  return `${dimMap(i, dd => S.leader.answers[dd.id]?.rating, "r1dim")}
  <div class="stack">
    <div class="qhead"><div class="eyebrow">${ico(L.icon)} ${esc(L.name)} layer · ${esc(L.role)} · ${d.id}</div><div class="eyebrow">Question ${i + 1} of ${DIMS.length}</div></div>
    <div><h2 class="title ttl">${d.icon ? `<span class="title-ico">${ico(d.icon)}</span>` : ""}<span>${esc(d.name)}</span></h2><p class="question">${esc(d.q)}</p></div>
    ${syNote}
    ${anchorList(d, r, "rate")}
    ${branch}${dep}${nextList}
    <div class="navbar"><button class="btn" data-act="r1prev" ${i === 0 ? "disabled" : ""}>Back</button>
      <span class="pill">${x.score ? `Scores ${x.score} · ${FW.levels[x.score - 1].name}${x.score !== r ? ` (rated ${r})` : ""}` : "Not yet rated"}</span>
      ${i < DIMS.length - 1 ? `<button class="btn primary" data-act="r1next">Next</button>` : `<button class="btn primary" data-act="go" data-v="r1result" ${leaderComplete() ? "" : "disabled"}>See leader view</button>`}</div>
  </div>`;
}

function layerBars(layer, alt){
  return `<div class="bars">${LAYERS.map(L => { const v = layer[L.id], w = v == null ? 0 : (v - 1) / 4 * 100;
    const a = alt ? alt[L.id] : null;
    return `<div class="bar-row"><span class="bar-lbl">${ico(L.icon)}<span>${L.name}</span></span><div class="track">${[25,50,75].map(t => `<span class="tick" style="left:${t}%"></span>`).join("")}<div class="fill" style="width:${w}%"></div>${a != null ? `<div class="fill alt" style="width:${(a - 1) / 4 * 100}%"></div>` : ""}</div><span class="mono">${fmt(v)}</span></div>`; }).join("")}</div>`;
}

function vR1Result(){
  const lr = leaderResult();
  if (!lr) return `<div class="panel"><h3>Leader interview incomplete</h3><p class="small">${DIMS.filter(d => !S.leader.answers[d.id]?.rating).length} domains still need a rating.</p><button class="btn primary" data-act="go" data-v="r1">Return to the interview</button></div>`;
  const lv = FW.levels[levelN(lr.level) - 1];
  const flags = [];
  if (lr.ceilingApplied) flags.push(`<span class="chip warn">Ceiling applied: capped at ${fmt(lr.ceiling)}</span>`);
  if (lr.resCapped) flags.push(`<span class="chip warn">Level 5 cap: ${LAYER[TOP].name} below ${R.bands[4][0] - 0.5}</span>`);
  if (lr.upstream) flags.push(`<span class="chip bad">Upstream root cause</span>`);
  if (lr.unverified) flags.push(`<span class="chip bad">${lr.unverified} unverified claim${lr.unverified > 1 ? "s" : ""}</span>`);
  if (lr.fragile) flags.push(`<span class="chip warn">${lr.fragile} fragile signal${lr.fragile > 1 ? "s" : ""}</span>`);
  const dn = id => DIMS.find(d => d.id === id);
  return `<div class="stack">
  <div class="eyebrow">Round 1 result · ${S.leader.title ? esc(S.leader.title) + "'s view" : "leader view"}</div>
  <div class="hero"><div><div class="small">The leader sees the organization at</div><div class="levelname">${lv.name}</div>
    <p class="lede" style="margin-top:12px">${esc(lv.summary)}</p></div>
    <div class="panel"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h3 style="margin:0">Layers</h3><span class="mono small">Index ${fmt(lr.index)}</span></div>${layerBars(lr.layer)}</div></div>
  ${scaleStrip(lr.level)}
  ${flags.length ? `<div class="row">${flags.join("")}</div>` : ""}
  <div class="notice warn"><b>One view, not the result.</b> A single respondent can't detect misalignment. Round 2 tests this view against people across the ${esc(C.org)}.${FW.next ? " " + esc(FW.next.leaderNote) : ""}</div>
  <div class="grid2">
    <div class="panel"><h3>Round 2 will verify</h3><p class="small">The leader's strongest domains. Stakeholders confirm the evidence first-hand.</p>
      <ul class="clean">${lr.verify.map(id => `<li><b>${id} ${esc(dn(id).name)}</b> · scores ${lr.adj[id]} · ${(S.leader.answers[id].ev || []).length} evidence items</li>`).join("")}</ul></div>
    <div class="panel"><h3>Round 2 will confirm</h3><p class="small">The leader's weakest domains. Stakeholders say whether they see the same cause.</p>
      <ul class="clean">${lr.confirm.map(id => `<li><b>${id} ${esc(dn(id).name)}</b> · scores ${lr.adj[id]}<br><span class="small">${esc(S.leader.answers[id].root || "No cause named")}</span></li>`).join("")}</ul></div>
  </div>
  <div class="row"><button class="btn primary" data-act="go" data-v="r2">Go to stakeholder interviews</button><button class="btn" data-act="go" data-v="r1">Review answers</button></div>
  </div>`;
}

function vR2(){
  const lr = leaderResult();
  if (!lr) return `<div class="panel"><h3>Finish the leader interview first</h3><p class="small">Round 2 is built from the leader's answers: it verifies the strongest domains and confirms the weakest.</p><button class="btn primary" data-act="go" data-v="r1">Go to the leader interview</button></div>`;
  const nd = S.stakeholders.filter(stComplete).length;
  return `<div class="stack">
  <div><div class="eyebrow">Round 2</div><h2 class="title">Stakeholder interviews</h2>
  <p class="lede">${esc(C.r2Who)} rate the same ${DIMS.length} ${esc(C.dimWord || "dimensions")} without seeing the leader's answers. At least ${R.min_stakeholders} are needed for a readout; four to six gives a stronger read. ${esc(C.r2Include)}</p></div>
  <div class="row"><span class="chip ${nd >= R.min_stakeholders ? "good" : "warn"}">${nd} of ${R.min_stakeholders}+ complete</span>
    ${nd >= R.min_stakeholders ? `<button class="btn primary" data-act="go" data-v="results">See the ${esc(C.readout.toLowerCase())}</button>` : ""}</div>
  <div class="cards">${S.stakeholders.map((st, k) => { const n = DIMS.filter(d => st.answers[d.id]?.rating).length;
    return `<div class="card"><div class="eyebrow">${esc(stTag(st) || "Role not set")}</div><h3 style="margin:0">${esc(st.name || "Unnamed")}</h3>
      <div class="progress" aria-label="${n} of ${DIMS.length} rated"><div style="width:${n / DIMS.length * 100}%"></div></div>
      <div class="row" style="justify-content:space-between"><span class="small mono">${n}/${DIMS.length} rated</span>
      <span class="row" style="gap:6px"><button class="btn" data-act="st-open" data-v="${k}">${n ? (stComplete(st) ? "Review" : "Continue") : "Start"}</button><button class="btn ghost" data-act="st-del" data-v="${k}" aria-label="Remove ${esc(st.name)}">Remove</button></span></div></div>`; }).join("")}
    <div class="card"><h3 style="margin:0">Add a stakeholder</h3>
      <label class="small" for="new-name">Name or label</label><input type="text" id="new-name" placeholder="${esc(C.stPh)}">
      <label class="small" for="new-role">${esc(C.roleLabel)}</label><select id="new-role">${FW.roles.map(r => `<option>${esc(r.name)}</option>`).join("")}</select>
      ${FW.kinds ? `<label class="small" for="new-kind">${esc(C.kindLabel)}</label><select id="new-kind">${FW.kinds.map(k => `<option>${esc(k)}</option>`).join("")}</select>` : ""}
      <button class="btn primary" data-act="st-add">Add and start</button></div>
  </div></div>`;
}

function vR2Int(){
  const st = S.stakeholders[S.view.st]; if (!st) { S.view.screen = "r2"; return vR2(); }
  const lr = leaderResult();
  const steps = [...DIMS.map(d => ({k:"gate", d})), {k:"verify"}, {k:"confirm"}, ...(S.mode === "full" ? [{k:"lens"}] : [])];
  const idx = Math.min(S.view.sstep, steps.length - 1), step = steps[idx];
  const head = `<div class="qhead"><div class="eyebrow">${esc(st.name)} · ${esc(stTag(st))}</div><div class="eyebrow">Step ${idx + 1} of ${steps.length}</div></div>`;
  const nav = (canNext = true) => `<div class="navbar"><button class="btn" data-act="s-prev" ${idx === 0 ? "disabled" : ""}>Back</button>
    ${idx < steps.length - 1 ? `<button class="btn primary" data-act="s-next" ${canNext ? "" : "disabled"}>Next</button>` : `<button class="btn primary" data-act="go" data-v="r2">Finish interview</button>`}</div>`;
  let body = "";
  if (step.k === "gate"){
    const d = step.d, a = st.answers[d.id] || {}, r = a.rating;
    let br = "";
    if (S.mode === "full" && r === 3) br = `<div class="branch"><div class="tag">Tension probe</div><p class="question" style="font-size:17px;margin-bottom:10px">${esc(d.tension)}</p><textarea id="snote-${d.id}" data-bind="snote" placeholder="Notes">${esc(a.note)}</textarea></div>`;
    if (S.mode === "full" && r && r <= 2) br = `<div class="branch warn"><div class="tag">Root cause</div>${FW.roots[d.layer].map((t, k) => `<label class="check"><input type="radio" name="sroot-${d.id}" id="sroot-${d.id}-${k}" data-act="sroot" data-v="${esc(t)}" ${a.root === t ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}<textarea id="snote-${d.id}" data-bind="snote" placeholder="The story behind it">${esc(a.note)}</textarea></div>`;
    body = `${dimMap(idx, dd => st.answers[dd.id]?.rating, "sdim")}<div class="stack">${head}
      <div><div class="eyebrow">${ico(LAYER[d.layer].icon)} ${esc(LAYER[d.layer].name)} layer · ${d.id} · blind rating</div><h2 class="title ttl">${d.icon ? `<span class="title-ico">${ico(d.icon)}</span>` : ""}<span>${esc(d.name)}</span></h2><p class="question">${esc(d.qs)}</p></div>
      ${anchorList(d, r, "srate")}${br}${nav(!!r)}</div>`;
  } else if (step.k === "verify"){
    body = `<div class="stack">${head}<div><div class="eyebrow">Part B</div><h2 class="title">Verify the strengths</h2>
      <p class="lede">"Some people have pointed to these as evidence that the ${esc(C.org)} is strong here. For each one, have you seen it yourself?" Count first-hand only.</p></div>
      ${lr.verify.map(id => { const d = DIMS.find(x => x.id === id), ev = S.leader.answers[id].ev || [], got = st.verify?.[id] || [];
        return `<div class="branch"><div class="tag">${id} ${esc(d.name)}</div>${ev.length ? ev.map(k => `<label class="check"><input type="checkbox" id="ver-${id}-${k}" data-act="ver" data-dim="${id}" data-v="${k}" ${got.includes(k) ? "checked" : ""}><span>${esc(d.evidence[k])}</span></label>`).join("") + `<div class="status ${got.length === ev.length ? "ok" : "drop"}">${got.length} of ${ev.length} confirmed</div>` : `<p class="small">No evidence was claimed for this domain.</p>`}</div>`; }).join("")}
      ${nav()}</div>`;
  } else if (step.k === "confirm"){
    body = `<div class="stack">${head}<div><div class="eyebrow">Part C</div><h2 class="title">Confirm the diagnosis</h2>
      <p class="lede">"One view is that the main thing holding the ${esc(C.org)} back here is the cause below. Does that match what you see?"</p></div>
      ${lr.confirm.map(id => { const d = DIMS.find(x => x.id === id), root = S.leader.answers[id].root, c = st.confirm?.[id] || {};
        return `<div class="branch warn"><div class="tag">${id} ${esc(d.name)}</div><p><b>${esc(root || "The leader didn't name a cause. Ask what the stakeholder sees.")}</b></p>
          <div class="seg" role="group" aria-label="Same cause?">${["Y","N"].map(v => `<button id="conf-${id}-${v}" data-act="conf" data-dim="${id}" data-v="${v}" aria-pressed="${c.v === v}">${v === "Y" ? "Yes, same cause" : "No, something else"}</button>`).join("")}</div>
          ${c.v === "N" ? `<textarea style="margin-top:10px" id="alt-${id}" data-bind="alt" data-dim="${id}" placeholder="What the stakeholder sees instead">${esc(c.alt)}</textarea>` : ""}</div>`; }).join("")}
      ${nav()}</div>`;
  } else {
    const role = st.prompts ? {name: st.name, prompts: st.prompts} : (FW.roles.find(r => r.name === st.role) || FW.roles[0]);
    body = `<div class="stack">${head}<div><div class="eyebrow">Part D · not scored</div><h2 class="title">Role lens: ${esc(role.name)}</h2>
      <p class="lede">Open prompts for this role. They supply the stories and quotes that make the readout credible.</p></div>
      ${role.prompts.map((q, k) => `<div class="branch"><p style="font-weight:600">${esc(q)}</p><textarea id="lens-${k}" data-bind="lens" data-v="${k}" placeholder="Notes">${esc(st.lens?.[k])}</textarea></div>`).join("")}
      ${nav()}</div>`;
  }
  return body;
}

function findings(c){
  const lv = FW.levels[levelN(c.level) - 1], ll = c.lr.level;
  const cnt = f => DIMS.filter(d => c.det[d.id].flags.includes(f));
  const blind = cnt("Blind spot"), hidden = cnt("Hidden strength"), frac = cnt("Fracture");
  const weakest = [...LAYERS].filter(L => c.layer[L.id] != null).sort((a, b) => c.layer[a.id] - c.layer[b.id])[0];
  const read = [
    `The leader sees <b>${ll}</b>; the ${esc(C.org)} reads as <b>${c.level}</b>${ll === c.level ? " when leader and stakeholder views are combined" : ""}. Composite index ${fmt(c.index)} against the leader's ${fmt(c.lr.index)}.`,
    blind.length ? `Blind spot${blind.length > 1 ? "s" : ""} in ${blind.map(d => `<b>${esc(d.name)}</b>`).join(", ")}: leadership believes this works; the ${esc(C.org)} doesn't experience it.` : "",
    frac.length ? `Fracture${frac.length > 1 ? "s" : ""} in ${frac.map(d => `<b>${esc(d.name)}</b>`).join(", ")}: different parts of the ${esc(C.org)} live different realities.` : "",
    hidden.length ? `Hidden strength${hidden.length > 1 ? "s" : ""} in ${hidden.map(d => `<b>${esc(d.name)}</b>`).join(", ")}: better than leadership realizes.` : "",
    c.ceilingApplied ? `The ${esc(LAYER[F].name)} ceiling capped the result at ${fmt(c.ceiling)}. ${esc(C.ceilingNote || "")}` : "",
    c.lr.fragile ? `${c.lr.fragile} leader-rated strength${c.lr.fragile > 1 ? "s depend" : " depends"} on specific people or a past track record.` : "",
    `The ${weakest.name} layer holds the result down (${fmt(c.layer[weakest.id])}). ${esc(lv.next)}`,
  ].filter(Boolean);
  return {lv, ll, blind, hidden, frac, weakest, read};
}
function vResults(){
  const c = composite();
  if (!c || !c.lr) return `<div class="panel"><h3>Nothing to read out yet</h3><p class="small">Complete the leader interview and at least ${R.min_stakeholders} stakeholder interviews.</p><button class="btn primary" data-act="go" data-v="r1">Go to the leader interview</button></div>`;
  if (!c.valid) return `<div class="panel"><h3>${c.sts.length} of ${R.min_stakeholders} stakeholders complete</h3><p class="small">One respondent's view against another's isn't enough to separate a blind spot from a disagreement. Complete at least ${R.min_stakeholders} stakeholder interviews.</p><button class="btn primary" data-act="go" data-v="r2">Go to stakeholders</button></div>`;
  const {lv, ll, blind, hidden, frac, read} = findings(c);
  const pos = v => ((v - 1) / 4 * 100).toFixed(2) + "%";
  return `<div class="stack">
  <div class="eyebrow">${esc(C.readout)} · ${esc(S.leader.title || "leader")} + ${c.sts.length} stakeholders</div>
  <div class="hero"><div><div class="small">${esc(C.coherence)}</div><div class="levelname">${lv.name}</div>
    <p class="lede" style="margin-top:12px">${esc(lv.summary)}</p>
    <div class="row"><span class="chip">Leader view <b>${ll}</b></span><span class="chip mono">Index ${fmt(c.index)}</span><button class="btn no-print" data-act="md">Markdown report</button></div></div>
    <div class="panel"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h3 style="margin:0">Layers</h3><span class="small">thick: composite · thin: leader</span></div>${layerBars(c.layer, c.lr.layer)}</div></div>
  ${scaleStrip(c.level)}
  <div class="metrics">
    <div class="metric"><div class="v">${pct(c.align)}</div><div class="k">Alignment index</div></div>
    <div class="metric"><div class="v">${pct(c.corrob)}</div><div class="k">Leader evidence corroborated</div></div>
    <div class="metric"><div class="v">${pct(c.rootAgree)}</div><div class="k">Root-cause agreement</div></div>
    <div class="metric"><div class="v">${blind.length} · ${frac.length} · ${hidden.length}</div><div class="k">Blind spots · fractures · hidden strengths</div></div>
  </div>
  <div class="panel"><h3>Readout</h3><ul class="clean">${read.map(r => `<li>${r}</li>`).join("")}</ul></div>
  ${vNextSteps(c)}
  <div class="panel"><h3>By domain</h3>
  <div class="plot"><table><thead><tr><th>Domain</th><th style="width:44%">1 ${FW.levels[0].name} → 5 ${FW.levels[4].name}</th><th>Gap</th><th>Score</th><th>Flag</th></tr></thead><tbody>
  ${DIMS.map(d => { const x = c.det[d.id];
    return `<tr><td><span class="dim-cell">${ico(d.icon)}<span>${esc(d.name)}</span></span></td>
    <td><div class="lane"><span class="axis"></span>${[0,25,50,75,100].map(t => `<span class="g" style="left:${t}%"></span>`).join("")}
      ${x.s.map(v => `<span class="sd" style="left:${pos(v)}"></span>`).join("")}<span class="cm" style="left:${pos(x.comp)}" title="Composite ${fmt(x.comp)}"></span><span class="ld" style="left:${pos(x.L)}" title="Leader ${x.L}"></span></div></td>
    <td class="mono">${x.gap >= 0 ? "+" : ""}${fmt(x.gap, 1)}</td><td class="mono">${fmt(x.comp)}</td>
    <td>${x.flags.length ? x.flags.map(f => `<span class="chip ${f === "Blind spot" ? "bad" : f === "Fracture" ? "warn" : "good"}">${f}</span>`).join(" ") : `<span class="small">Aligned</span>`}</td></tr>`; }).join("")}
  </tbody></table></div>
  <div class="legend"><span><i class="ld-l" style="width:10px;height:10px;background:var(--accent);transform:rotate(45deg)"></i>Leader</span><span><i style="width:10px;height:10px;border-radius:50%;background:var(--l2)"></i>Stakeholder</span><span><i style="width:3px;height:14px;background:var(--ink)"></i>Composite</span><span>Gap = leader minus stakeholder mean</span></div>
  </div></div>`;
}

/* ---------- Enhanced Report: a conversation with the AI adviser about the result ---------- */
const ENDPOINT = (typeof window !== "undefined" && window.BCA_CONFIG && window.BCA_CONFIG.enhancedEndpoint) || "";
const EX = {busy: false, partial: "", error: "", draft: "", ctrl: null};   // live state, never saved
function enhancedReady(){ const c = composite(); return !!(c && c.valid); }
function enhancedBrief(report){
  const EN = FW.enhanced;
  return ["# Enhanced Report brief", "", `Everything the ${EN.assistant} is given: how to behave, how to read the assessment, and the report itself.`, "",
    `## Instructions for the ${EN.assistant}`, "", EN.instructions, "", "## About this assessment", "", EN.context, "", "## The assessment report", "",
    (report || reportMarkdown()).replace(/^(#{1,3}) /gm, (m, h) => "#".repeat(h.length + 2) + " ")].join("\n").trim() + "\n";
}
function conversationMarkdown(){
  const EN = FW.enhanced, E = S.enhanced; if (!E) return "";
  return [`# ${EN.title}: conversation`, "", `- **${C.orgLabel}:** ${S.org || "Not named"}`, `- **Started:** ${E.started}`, "",
    ...E.messages.flatMap(m => [`**${m.role === "assistant" ? EN.assistant : EN.you}:**`, "", m.content.trim(), ""])].join("\n").trim() + "\n";
}
function mdRender(t){
  const inline = x => esc(x).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\w)/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  let html = "", list = null, para = [];
  const flushP = () => { if (para.length){ html += "<p>" + para.map(inline).join("<br>") + "</p>"; para = []; } };
  const flushL = () => { if (list){ html += `</${list}>`; list = null; } };
  for (const raw of String(t).replace(/\r/g, "").split("\n")){
    const l = raw.trimEnd(); let m;
    if (!l.trim()){ flushP(); flushL(); continue; }
    if ((m = l.match(/^#{1,6}\s+(.*)$/))){ flushP(); flushL(); html += `<h4>${inline(m[1])}</h4>`; continue; }
    if ((m = l.match(/^\s*[-*•]\s+(.*)$/))){ flushP(); if (list !== "ul"){ flushL(); html += "<ul>"; list = "ul"; } html += `<li>${inline(m[1])}</li>`; continue; }
    if ((m = l.match(/^\s*(\d+)[.)]\s+(.*)$/))){ flushP(); if (list !== "ol"){ flushL(); html += `<ol start="${+m[1]}">`; list = "ol"; } html += `<li>${inline(m[2])}</li>`; continue; }
    if (list && /^\s{2,}\S/.test(raw)){ html = html.replace(/<\/li>$/, " " + inline(l.trim()) + "</li>"); continue; }
    flushL(); para.push(l);
  }
  flushP(); flushL(); return html;
}
function paintLive(){ const el = document.getElementById("en-live"); if (el) el.innerHTML = mdRender(EX.partial); }
function toChatEnd(){ const el = document.getElementById("en-end"); if (el && el.scrollIntoView) el.scrollIntoView({block: "end"}); }
async function enhancedSend(){
  const E = S.enhanced; if (!E || EX.busy || !ENDPOINT) return;
  EX.busy = true; EX.error = ""; EX.partial = ""; EX.ctrl = new AbortController();
  render(); toChatEnd();
  let text = "";
  try {
    const res = await fetch(ENDPOINT, {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({brief: enhancedBrief(E.report), opening: FW.enhanced.opening, messages: E.messages}), signal: EX.ctrl.signal});
    const type = res.headers.get("content-type") || "";
    if (!res.ok){ let m = ""; try { m = (await res.json()).message; } catch(err){} throw new Error(m || `The request failed (${res.status}). Try again in a moment.`); }
    if (type.includes("application/json")){ const j = await res.json(); text = j.choices?.[0]?.message?.content || ""; }
    else {
      const reader = res.body.getReader(), dec = new TextDecoder(); let buf = "";
      for (;;){
        const {done, value} = await reader.read(); if (done) break;
        buf += dec.decode(value, {stream: true});
        let i;
        while ((i = buf.indexOf("\n")) >= 0){
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line.startsWith("data:")) continue;
          const d = line.slice(5).trim(); if (!d || d === "[DONE]") continue;
          let j; try { j = JSON.parse(d); } catch(err){ continue; }
          if (j.error) throw new Error(typeof j.error === "string" ? j.error : (j.error.message || "The AI service reported an error."));
          const delta = j.choices?.[0]?.delta?.content ?? j.choices?.[0]?.message?.content ?? "";
          if (delta){ text += delta; EX.partial = text; paintLive(); }
        }
      }
    }
    if (!text.trim()) throw new Error("The AI service returned an empty reply. Try again.");
    E.messages.push({role: "assistant", content: text});
  } catch(err){
    if (err.name === "AbortError"){ if (text.trim()) E.messages.push({role: "assistant", content: text.trim() + "\n\n*(stopped)*"}); }
    else { if (text.trim()) E.messages.push({role: "assistant", content: text.trim() + "\n\n*(interrupted)*"}); EX.error = err.message && !/Failed to fetch|NetworkError|Load failed/i.test(err.message) ? err.message : "Couldn't reach the Enhanced Report service. Check the connection and try again."; }
  }
  EX.busy = false; EX.partial = ""; EX.ctrl = null; save(); render(); toChatEnd();
}
function vEnhanced(){
  const EN = FW.enhanced, E = S.enhanced;
  const head = `<div><div class="eyebrow">After the readout</div><h2 class="title">${esc(EN.title)}</h2><p class="lede">${esc(EN.lede)}</p></div>`;
  if (!enhancedReady() && !E) return `<div class="stack">${head}<div class="panel"><h3>Not available yet</h3><p class="small">${esc(EN.locked)}</p><button class="btn primary" data-act="go" data-v="results">Go to the readout</button></div></div>`;
  if (!ENDPOINT) return `<div class="stack">${head}
    <div class="notice warn">${esc(EN.preview)}</div>
    <div class="panel stack"><h3 style="margin:0">Brief sent to the AI adviser</h3>
      <textarea id="brief-box" readonly aria-label="Brief sent to the AI adviser" style="min-height:420px;font-family:var(--mono);font-size:12.5px;line-height:1.5">${esc(enhancedBrief())}</textarea>
      <div class="row"><button class="btn primary" data-act="brief-copy">Copy the brief</button><span class="small" id="brief-msg" role="status"></span></div></div></div>`;
  if (!E) return `<div class="stack">${head}
    <div class="panel stack"><h3 style="margin:0">${esc(EN.consentTitle)}</h3><p style="margin:0;max-width:68ch">${esc(EN.consent)}</p>
      <div class="row"><button class="btn primary" data-act="en-start">${esc(EN.start)}</button><button class="btn" data-act="en-review">${esc(EN.review)}</button></div></div></div>`;
  const turns = E.messages.filter(m => m.role === "user").length, full = turns >= EN.maxTurns;
  const last = E.messages[E.messages.length - 1], waiting = !EX.busy && (!last || last.role === "user");
  return `<div class="stack">${head}
    <div class="row no-print"><button class="btn" data-act="en-review">${esc(EN.review)}</button><button class="btn" data-act="en-copy">Copy conversation</button><button class="btn ghost" data-act="en-reset-ask">${esc(EN.restart)}</button><span class="small" id="en-msg" role="status"></span></div>
    <div class="panel"><div class="chat" id="chat" aria-live="polite">
      ${E.messages.map(m => `<div class="msg ${m.role === "user" ? "user" : "ai"}"><div class="who">${esc(m.role === "user" ? EN.you : EN.assistant)}</div><div class="body">${m.role === "user" ? esc(m.content) : mdRender(m.content)}</div></div>`).join("")}
      ${EX.busy ? `<div class="msg ai"><div class="who">${esc(EN.assistant)}</div><div class="body" id="en-live">${mdRender(EX.partial)}</div><div class="writing">${esc(EN.writing)}</div></div>` : ""}
      ${EX.error ? `<div class="notice warn" role="alert">${esc(EX.error)}</div>` : ""}
      ${waiting ? `<div class="row"><button class="btn primary" data-act="en-retry">${esc(EN.retry)}</button></div>` : ""}
    </div></div>
    ${full ? `<div class="notice">${esc(EN.limit)}</div>` : `<div class="chat-input no-print">
      <textarea id="en-input" data-bind="endraft" maxlength="${EN.maxChars}" aria-label="${esc(EN.placeholder)}" placeholder="${esc(EN.placeholder)}" ${waiting ? "disabled" : ""}>${esc(EX.draft)}</textarea>
      ${EX.busy ? `<button class="btn" data-act="en-stop">${esc(EN.stop)}</button>` : `<button class="btn primary" data-act="en-send" ${waiting ? "disabled" : ""}>${esc(EN.send)}</button>`}</div>`}
    <p class="small" style="margin:0">${esc(EN.disclaimer)} ${turns} of ${EN.maxTurns} turns used.</p>
    <div id="en-end"></div></div>`;
}
function vBrief(){
  return `<div class="sheet" data-act="sheet-bg"><div class="panel stack" role="dialog" aria-modal="true" aria-labelledby="br-h" style="width:min(780px,100%)">
    <div class="row" style="justify-content:space-between"><h3 id="br-h" style="margin:0">What is sent to the AI adviser</h3><button class="btn ghost" data-act="sheet-close">Close</button></div>
    <p class="small" style="margin:0">The instructions and the description of the assessment are sent with every message. The report is the one captured when the conversation began${S.enhanced ? "" : ", or as it stands now if you start"}.</p>
    <textarea id="brief-box" readonly aria-label="Brief sent to the AI adviser" style="min-height:340px;font-family:var(--mono);font-size:12.5px;line-height:1.5">${esc(enhancedBrief(S.enhanced?.report))}</textarea>
    <div class="row"><button class="btn primary" data-act="brief-copy">Copy the brief</button><span class="small" id="brief-msg" role="status"></span></div>
  </div></div>`;
}
function vEnReset(){
  return `<div class="sheet" data-act="sheet-bg"><div class="panel stack" role="alertdialog" aria-modal="true">
    <h3 style="margin:0">Start the conversation over?</h3><p class="small">This clears the conversation in this browser. The assessment itself is not changed. Copy the conversation first if you want to keep it.</p>
    <div class="row"><button class="btn primary" data-act="en-reset">Clear and start over</button><button class="btn" data-act="sheet-close">Cancel</button></div></div></div>`;
}
/* ---------- Markdown report: the whole assessment as plain text ---------- */
function reportMarkdown(){
  const h2m = t => String(t).replace(/<\/?b>/g, "**").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const cell = t => String(t ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");
  const one = t => String(t ?? "").trim().replace(/\s*\n\s*/g, " ");
  const table = (head, rows) => ["| " + head.join(" | ") + " |", "| " + head.map(() => "---").join(" | ") + " |", ...rows.map(r => "| " + r.map(cell).join(" | ") + " |")].join("\n");
  const sgn = (v, d = 0) => (v > 0 ? "+" : v < 0 ? "−" : "") + fmt(Math.abs(v), d);
  const now = new Date(), date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  const lr = leaderResult(), c = composite(), full = !!(c && c.valid);
  const rated = DIMS.filter(d => S.leader.answers[d.id]?.rating).length, done = S.stakeholders.filter(stComplete);
  const Org = C.orgLabel, out = [];
  out.push(`# ${document.title || FW.title}`, "");
  out.push(`- **${Org}:** ${one(S.org) || "Not named"}${S.sample ? " (sample data)" : ""}`);
  out.push(`- **Leader:** ${one(S.leader.title) || "Role not given"}`);
  out.push(`- **Date of this report:** ${date}`);
  out.push(`- **Interview mode:** ${S.mode === "full" ? "Full (every branch probe)" : "Light (gate questions and evidence checks)"}`);
  out.push(`- **Status:** ${full ? `Complete: leader and ${c.sts.length} stakeholders` : lr ? `Leader view only: ${done.length} of ${R.min_stakeholders} stakeholder interviews complete` : `In progress: ${rated} of ${DIMS.length} leader ratings`}`, "");

  if (full){
    const f = findings(c);
    out.push("## Result", "");
    out.push(`- **${C.levelWord}:** ${c.level} (index ${fmt(c.index)} on a scale of 1 to 5)`);
    out.push(`- **Leader's view:** ${f.ll} (index ${fmt(c.lr.index)})`);
    out.push(`- **What this level means:** ${f.lv.summary}`);
    out.push(`- **Alignment index:** ${pct(c.align)} (100% means every respondent gave the same rating)`);
    out.push(`- **Leader evidence corroborated by stakeholders:** ${pct(c.corrob)}`);
    out.push(`- **Root-cause agreement:** ${pct(c.rootAgree)}`);
    out.push(`- **Flags:** blind spots ${f.blind.length}, fractures ${f.frac.length}, hidden strengths ${f.hidden.length}, unverified leader claims ${c.lr.unverified}, fragile signals ${c.lr.fragile}`);
    if (c.ceilingApplied) out.push(`- **System ceiling applied:** result capped at ${fmt(c.ceiling)}`);
    if (c.resCapped) out.push(`- **Level 5 cap applied:** the ${LAYER[TOP].name} layer is below 4`);
    out.push("", "## Layers", "", table(["Layer", "Role", "Weight", "Composite", "Leader's view"], LAYERS.map(L => [L.name, L.role, Math.round(L.weight * 100) + "%", fmt(c.layer[L.id]), fmt(c.lr.layer[L.id])])), "");
    out.push("## Findings", "", ...f.read.map(r => "- " + h2m(r)), "");
    const x = nextSteps(c);
    if (x){
      out.push(`## ${x.N.title}`, "", `**${x.g.name}** (${x.g.levels.join(" and ")}). ${x.posture}`, "");
      x.actions.forEach((a, i) => out.push(`${i + 1}. **${h2m(a.title)}** (${a.tag})`, `   - Why: ${h2m(a.why)}`, `   - ${x.N.labels.first}: ${h2m(a.first)}`));
      out.push("", `**${x.N.labels.hold}:** ${x.hold}`, "");
      if (x.also.length) out.push(`**${x.N.labels.also}:**`, "", ...x.also.map(t => "- " + h2m(t)), "");
    }
    out.push("## By domain", "", "Stakeholder ratings are listed lowest to highest, so they can't be matched to a person.", "",
      table(["ID", "Domain", "Layer", "Leader", "Stakeholders", "Stakeholder mean", "Gap", "Composite", "Flag"],
        DIMS.map(d => { const x = c.det[d.id]; return [d.id, d.name, LAYER[d.layer].name, x.L, [...x.s].sort((a, b) => a - b).join(", "), fmt(x.m), sgn(x.gap, 1), fmt(x.comp), x.flags.join(", ") || "Aligned"]; })), "");
  } else if (lr){
    const lv = FW.levels[levelN(lr.level) - 1];
    out.push("## Result so far", "", `- **Leader's view:** ${lr.level} (index ${fmt(lr.index)} on a scale of 1 to 5)`, `- **What this level means:** ${lv.summary}`,
      "- One view, not the result. A " + C.levelWord.toLowerCase() + " needs at least " + R.min_stakeholders + " stakeholder interviews.", "",
      "## Layers", "", table(["Layer", "Role", "Weight", "Leader's view"], LAYERS.map(L => [L.name, L.role, Math.round(L.weight * 100) + "%", fmt(lr.layer[L.id])])), "",
      "## By domain", "", table(["ID", "Domain", "Layer", "Leader rating", "Scores as"], DIMS.map(d => [d.id, d.name, LAYER[d.layer].name, S.leader.answers[d.id].rating, lr.adj[d.id]])), "");
  }

  const pd = profData();
  if (pd){
    const {P, p} = pd, basis = k => p[k].basis === "counted" ? P.basisCounted : P.basisEstimate;
    out.push(`## ${P.title}`, "", P.unscored, "");
    if (!pd.any) out.push("No figures were entered.", "");
    else {
      out.push(`- **${P.saysLabel}:** ${one(p.says) ? "“" + one(p.says) + "”" : "Not entered"}`);
      out.push(`- **${P.zipsLabel}:** ${one(p.zips) || "Not entered"}`);
      out.push(`- **${P.sourceLabel}:** ${one(p.source) || "Not entered"}`);
      out.push(`- **${P.foot.title}:** ${pd.foot != null ? `${fmt(pd.foot, 0)}% of attending households live inside the served ZIP codes (${basis("foot").toLowerCase()}). ${pd.foot >= P.local ? "Mostly local." : "Mostly drives in."}` : "Not entered"}`, "");
      const rows = rs => rs.map(r => [r.label, r.c != null ? fmt(r.c, 0) + "%" : "–", r.m != null ? fmt(r.m, 0) + "%" : "–", r.gap != null ? sgn(r.gap) : "–", r.gap == null ? "" : r.notable ? P.notable : P.withinNoise]);
      for (const [k, rs] of [["age", pd.age], ["hh", pd.hh]]) if (rs.some(r => r.c != null || r.m != null))
        out.push(`### ${P[k].title}`, "", `${P[k].unit}. Church figures: ${basis(k).toLowerCase()}.`, "", table(["Measure", P.inside, P.outside, "Gap (points)", "Reading"], rows(rs)), "");
      out.push(P.noiseNote.replace("{n}", P.noise), "");
    }
  }

  out.push("## Respondents", "", `- **Leader:** ${one(S.leader.title) || "Role not given"} (${rated} of ${DIMS.length} rated)`);
  S.stakeholders.forEach(st => out.push(`- **Stakeholder:** ${[one(st.name), one(st.role), one(st.kind)].filter(Boolean).join(" · ")} (${DIMS.filter(d => st.answers[d.id]?.rating).length} of ${DIMS.length} rated)`));
  out.push("");

  const notes = ["## Interview notes", "", "The facilitator's record. Stakeholder comments carry no names, but with few respondents they can still point to a person. Edit before sharing.", "", "### Leader", ""];
  let any = false;
  for (const d of DIMS){ const a = S.leader.answers[d.id]; if (!a?.rating) continue; any = true;
    const x = adjusted(d);
    notes.push(`- **${d.id} ${d.name}:** rated ${a.rating}${x.score !== a.rating ? `, scores as ${x.score}` : ""}`);
    if (evCheck(d, a)) notes.push(`  - Evidence confirmed (${(a.ev || []).length} of ${d.evidence.length}): ${(a.ev || []).map(i => d.evidence[i]).join("; ") || "none"}`);
    if (x.asked && a.dep) notes.push(`  - What sustains it: ${FW.dependency_options.find(o => o.id === a.dep)?.label || a.dep}`);
    if (a.root) notes.push(`  - Root cause named: ${a.root}`);
    if (one(a.note)) notes.push(`  - Note: ${one(a.note)}`);
  }
  if (!any) notes.push("No leader ratings yet.");
  if (S.stakeholders.length){
    notes.push("", "### Stakeholders", "");
    let sAny = false;
    for (const d of DIMS){ const bits = [];
      for (const st of S.stakeholders){ const a = st.answers[d.id]; if (a?.root) bits.push(`  - Root cause named: ${a.root}`); if (one(a?.note)) bits.push(`  - Note: ${one(a.note)}`); }
      if (lr && lr.verify.includes(d.id)){ const ev = S.leader.answers[d.id].ev || [], n = done.reduce((t, st) => t + (st.verify?.[d.id] || []).filter(i => ev.includes(i)).length, 0);
        if (done.length && ev.length) bits.push(`  - Leader's evidence confirmed first-hand: ${n} of ${ev.length * done.length} possible checks`); }
      if (lr && lr.confirm.includes(d.id)){ const vs = S.stakeholders.map(st => st.confirm?.[d.id]).filter(v => v?.v);
        if (vs.length) bits.push(`  - Leader's root cause (${S.leader.answers[d.id].root || "none named"}): ${vs.filter(v => v.v === "Y").length} of ${vs.length} see the same cause`);
        vs.filter(v => v.v === "N" && one(v.alt)).forEach(v => bits.push(`  - A different cause: ${one(v.alt)}`)); }
      if (bits.length){ sAny = true; notes.push(`- **${d.id} ${d.name}**`, ...bits); }
    }
    const lens = [];
    for (const st of S.stakeholders){ const role = st.prompts ? {name: st.name, prompts: st.prompts} : (FW.roles.find(r => r.name === st.role) || FW.roles[0]);
      role.prompts.forEach((q, k) => { if (one(st.lens?.[k])) lens.push(`- *${role.name}: ${q}* ${one(st.lens[k])}`); }); }
    if (lens.length){ sAny = true; notes.push("", "**Role lens**", "", ...lens); }
    if (!sAny) notes.push("No stakeholder notes recorded.");
  }
  out.push(...notes, "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
function vMarkdown(){
  const extra = FW.profile ? `, the ${FW.profile.title.toLowerCase()} figures` : "";
  return `<div class="sheet" data-act="sheet-bg"><div class="panel stack" role="dialog" aria-modal="true" aria-labelledby="md-h" style="width:min(780px,100%)">
    <div class="row" style="justify-content:space-between"><h3 id="md-h" style="margin:0">Markdown report</h3><button class="btn ghost" data-act="sheet-close">Close</button></div>
    <p class="small" style="margin:0">The whole assessment as plain text: result, findings, next steps, every domain${esc(extra)} and the interview notes. Stakeholder comments carry no names but can still point to a person, so edit before sharing.</p>
    <textarea id="md-box" readonly aria-label="Markdown report" style="min-height:320px;font-family:var(--mono);font-size:12.5px;line-height:1.5">${esc(reportMarkdown())}</textarea>
    <div class="row"><button class="btn primary" data-act="md-copy">Copy Markdown</button><span class="small" id="md-msg" role="status"></span></div>
  </div></div>`;
}
function vSession(){
  return `<div class="sheet" data-act="sheet-bg"><div class="panel stack" role="dialog" aria-modal="true" aria-labelledby="sess-h">
    <div class="row" style="justify-content:space-between"><h3 id="sess-h" style="margin:0">Session</h3><button class="btn ghost" data-act="sheet-close">Close</button></div>
    <p class="small">This session saves in this browser only. To move it to another device, or to keep a record per client, copy the session data and paste it back later.</p>
    <div class="row"><button class="btn" data-act="copy">Copy session data</button><span class="small" id="copy-msg" role="status"></span></div>
    <label for="load-box" class="small">Paste session data to load it</label>
    <textarea id="load-box" style="min-height:110px" placeholder='{"v":1, ...}'></textarea>
    <div class="row"><button class="btn primary" data-act="load">Load pasted session</button><span class="small" id="load-msg" role="status"></span></div>
    <hr style="border:0;border-top:1px solid var(--line);width:100%">
    <div class="row"><button class="btn" data-act="md">Markdown report</button><button class="btn" data-act="load-sample">${esc(C.loadSample)}</button><button class="btn" data-act="new-confirm">Start a new assessment</button></div>
  </div></div>`;
}
function vConfirmNew(){
  return `<div class="sheet" data-act="sheet-bg"><div class="panel stack" role="alertdialog" aria-modal="true">
    <h3 style="margin:0">Start a new assessment?</h3><p class="small">This clears every answer in this browser. Copy the session data first if you want to keep it.</p>
    <div class="row"><button class="btn primary" data-act="new">Clear and start new</button><button class="btn" data-act="sheet-close">Cancel</button></div></div></div>`;
}

let sheet = null;
function render(){ applyScope();
  if (FW.profile) S.profile ||= blankProfile();
  renderRail();
  const v = S.view.screen;
  main.innerHTML = v === "enhanced" && FW.enhanced ? vEnhanced() : v === "r1" ? vR1() : v === "r1result" ? vR1Result() : v === "r2" ? vR2() : v === "r2int" ? vR2Int() : v === "results" ? vResults() : vOverview();
  document.getElementById("sheet").innerHTML = sheet === "brief" ? vBrief() : sheet === "en-reset" ? vEnReset() : sheet === "md" ? vMarkdown() : sheet === "session" ? vSession() : sheet === "new" ? vConfirmNew() : "";
  profileHints();
}

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const act = el.dataset.act, v = el.dataset.v;
  if (act === "sheet-bg" && e.target !== el) return;
  const cur = DIMS[S.view.dim], la = () => (S.leader.answers[cur.id] ||= {});
  const st = S.stakeholders[S.view.st];
  switch (act){
    case "go": return go(v);
    case "mode": S.mode = v; break;
    case "session": sheet = "session"; break;
    case "md": sheet = "md"; break;
    case "en-review": sheet = "brief"; break;
    case "en-reset-ask": sheet = "en-reset"; break;
    case "en-reset": if (EX.ctrl) EX.ctrl.abort(); delete S.enhanced; EX.error = ""; EX.draft = ""; sheet = null; break;
    case "en-start": {
      const now = new Date();
      S.enhanced = {started: now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0"), report: reportMarkdown(), messages: []};
      save(); enhancedSend(); return;
    }
    case "en-retry": enhancedSend(); return;
    case "en-stop": if (EX.ctrl) EX.ctrl.abort(); return;
    case "en-send": {
      const t = EX.draft.trim(); if (!t || EX.busy || !S.enhanced) return;
      S.enhanced.messages.push({role: "user", content: t.slice(0, FW.enhanced.maxChars)}); EX.draft = ""; save(); enhancedSend(); return;
    }
    case "en-copy": case "brief-copy": {
      const isBrief = act === "brief-copy", msg = document.getElementById(isBrief ? "brief-msg" : "en-msg"), box = document.getElementById("brief-box");
      const txt = isBrief ? box.value : conversationMarkdown();
      const fallback = () => { if (isBrief){ box.focus(); box.select(); msg.textContent = "Selected. Copy it from the box."; } else msg.textContent = "Copying isn't available here."; };
      try { navigator.clipboard.writeText(txt).then(() => msg.textContent = "Copied.", fallback); } catch(err){ fallback(); }
      return;
    }
    case "md-copy": {
      const box = document.getElementById("md-box"), msg = document.getElementById("md-msg");
      const fallback = () => { box.focus(); box.select(); msg.textContent = "Selected. Copy it from the box."; };
      try { navigator.clipboard.writeText(box.value).then(() => msg.textContent = "Copied.", fallback); } catch(err){ fallback(); }
      return;
    }
    case "sheet-close": case "sheet-bg": sheet = null; break;
    case "new-confirm": sheet = "new"; break;
    case "new": S = blank(); sheet = null; break;
    case "load-sample": S = clone(SAMPLE); sheet = null; break;
    case "copy": {
      const txt = JSON.stringify(S), msg = document.getElementById("copy-msg");
      const fallback = () => { const b = document.getElementById("load-box"); b.value = txt; b.focus(); b.select(); msg.textContent = "Selected below. Copy it manually."; };
      try { navigator.clipboard.writeText(txt).then(() => msg.textContent = "Copied.", fallback); } catch(err){ fallback(); }
      return;
    }
    case "load": {
      const msg = document.getElementById("load-msg");
      try { const o = JSON.parse(document.getElementById("load-box").value); if (!o.leader || !o.view) throw 0; S = o; sheet = null; }
      catch(err){ msg.textContent = "That isn't session data from this tool. Paste the full text you copied."; return; }
      break;
    }
    case "rate": la().rating = +v; break;
    case "scope": { const out = new Set(S.scope || []); if (el.checked) out.delete(v); else if (DIMS.length > 1) out.add(v); else { el.checked = true; return; }
      S.scope = [...out]; applyScope(); S.view.dim = Math.min(S.view.dim, DIMS.length - 1); save(); render(); return; }
    case "ev": { const a = la(); a.ev ||= []; const k = +v; a.ev = el.checked ? [...new Set([...a.ev, k])] : a.ev.filter(x => x !== k); save(); render(); return; }
    case "root": la().root = el.dataset.v; save(); return;
    case "dep": la().dep = v; break;
    case "r1dim": S.view.dim = +v; save(); render(); window.scrollTo({top:0}); return;
    case "r1prev": S.view.dim = Math.max(0, S.view.dim - 1); save(); render(); window.scrollTo({top:0}); return;
    case "r1next": S.view.dim = Math.min(DIMS.length - 1, S.view.dim + 1); save(); render(); window.scrollTo({top:0}); return;
    case "st-add": {
      const name = document.getElementById("new-name").value.trim() || `Stakeholder ${S.stakeholders.length + 1}`;
      S.stakeholders.push({name, role: document.getElementById("new-role").value, kind: document.getElementById("new-kind")?.value || "", answers:{}, verify:{}, confirm:{}, lens:{}});
      return go("r2int", {st: S.stakeholders.length - 1, sstep: 0});
    }
    case "st-open": return go("r2int", {st: +v, sstep: 0});
    case "st-del": S.stakeholders.splice(+v, 1); break;
    case "srate": { const d = DIMS[S.view.sstep]; (st.answers[d.id] ||= {}).rating = +v; break; }
    case "sroot": { const d = DIMS[S.view.sstep]; (st.answers[d.id] ||= {}).root = el.dataset.v; save(); return; }
    case "sdim": S.view.sstep = +v; save(); render(); window.scrollTo({top:0}); return;
    case "s-prev": S.view.sstep = Math.max(0, S.view.sstep - 1); save(); render(); window.scrollTo({top:0}); return;
    case "s-next": S.view.sstep++; save(); render(); window.scrollTo({top:0}); return;
    case "ver": { const id = el.dataset.dim, k = +v; st.verify ||= {}; const g = st.verify[id] || []; st.verify[id] = el.checked ? [...new Set([...g, k])] : g.filter(x => x !== k); break; }
    case "conf": { const id = el.dataset.dim; st.confirm ||= {}; st.confirm[id] = {...(st.confirm[id] || {}), v}; break; }
    default: return;
  }
  save(); render();
});
document.addEventListener("input", e => {
  const el = e.target, b = el.dataset.bind; if (!b) return;
  const st = S.stakeholders[S.view.st];
  if (b === "prof") { const ks = el.dataset.path.split("."); let o = S.profile; for (const k of ks.slice(0, -1)) o = o[k]; o[ks[ks.length - 1]] = el.value; profileHints(); }
  if (b === "endraft") { EX.draft = el.value; return; }
  if (b === "ltitle") S.leader.title = el.value;
  if (b === "org") { S.org = el.value; document.getElementById("orgline").textContent = el.value || C.untitled; }
  if (b === "lnote") (S.leader.answers[DIMS[S.view.dim].id] ||= {}).note = el.value;
  if (b === "snote") (st.answers[DIMS[S.view.sstep].id] ||= {}).note = el.value;
  if (b === "alt") { st.confirm[el.dataset.dim].alt = el.value; }
  if (b === "lens") { (st.lens ||= {})[el.dataset.v] = el.value; }
  save();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && sheet){ sheet = null; render(); }
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && e.target.id === "en-input"){ e.preventDefault(); document.querySelector('[data-act="en-send"]')?.click(); }
});
render();
