import { COMPONENT_TYPES as CT } from '../components/SVGAssets.js';

export const GRID = 10;
const STUB = 16;
export const snap = v => Math.round(v / GRID) * GRID;

// kotak komponen di koordinat dunia (memperhitungkan rotasi), diperlebar sebagai margin
export function compBox(c, m = 6) {
  const t = CT[c.type], a = (c.rotation || 0) * Math.PI / 180, cx = t.width / 2, cy = t.height / 2;
  const xs = [], ys = [];
  for (const [px, py] of [[0, 0], [t.width, 0], [0, t.height], [t.width, t.height]]) {
    xs.push(c.x + cx + Math.cos(a) * (px - cx) - Math.sin(a) * (py - cy));
    ys.push(c.y + cy + Math.sin(a) * (px - cx) + Math.cos(a) * (py - cy));
  }
  return { l: Math.min(...xs) - m, r: Math.max(...xs) + m, t: Math.min(...ys) - m, b: Math.max(...ys) + m };
}

// posisi dunia sebuah pin (rotasi di sekitar pusat komponen)
export function pinAbs(comp, pin) {
  const t = CT[comp.type], cx = t.width / 2, cy = t.height / 2, a = (comp.rotation || 0) * Math.PI / 180;
  return {
    x: comp.x + Math.cos(a) * (pin.x - cx) - Math.sin(a) * (pin.y - cy) + cx,
    y: comp.y + Math.sin(a) * (pin.x - cx) + Math.cos(a) * (pin.y - cy) + cy
  };
}

// arah keluar pin: sumbu 'h'/'v', tanda, dan panjang stub agar ujungnya berada di luar kotak komponen
export function pinExit(comp, pin) {
  const t = CT[comp.type], cx = t.width / 2, cy = t.height / 2, a = (comp.rotation || 0) * Math.PI / 180;
  const ox = Math.cos(a) * (pin.x - cx) - Math.sin(a) * (pin.y - cy);
  const oy = Math.sin(a) * (pin.x - cx) + Math.cos(a) * (pin.y - cy);
  const nx = Math.abs(ox) / (t.width / 2), ny = Math.abs(oy) / (t.height / 2);
  const axis = nx >= ny ? 'h' : 'v', sign = (axis === 'h' ? Math.sign(ox) : Math.sign(oy)) || 1;
  const P = { x: comp.x + cx + ox, y: comp.y + cy + oy }, bx = compBox(comp, 0);
  const dist = axis === 'h' ? (sign > 0 ? bx.r - P.x : P.x - bx.l) : (sign > 0 ? bx.b - P.y : P.y - bx.t);
  return { axis, sign, len: Math.max(STUB, Math.ceil(dist / 10) * 10 + 10) };
}

const segHitsBox = (p, q, bx) => {
  if (p.y === q.y) return p.y > bx.t && p.y < bx.b && Math.max(p.x, q.x) > bx.l && Math.min(p.x, q.x) < bx.r;
  if (p.x === q.x) return p.x > bx.l && p.x < bx.r && Math.max(p.y, q.y) > bx.t && Math.min(p.y, q.y) < bx.b;
  return false;
};

export function orientOf(p, q) { return p.y === q.y ? 'h' : (p.x === q.x ? 'v' : null); }

// segmen tengah (tidak menyentuh pin) dari sebuah jalur: { o, c, lo, hi }
export function middleSegs(pts) {
  const r = [];
  for (let i = 1; i <= pts.length - 3; i++) {
    const o = orientOf(pts[i], pts[i + 1]); if (!o) continue;
    r.push({
      o, c: o === 'h' ? pts[i].y : pts[i].x,
      lo: o === 'h' ? Math.min(pts[i].x, pts[i + 1].x) : Math.min(pts[i].y, pts[i + 1].y),
      hi: o === 'h' ? Math.max(pts[i].x, pts[i + 1].x) : Math.max(pts[i].y, pts[i + 1].y)
    });
  }
  return r;
}

// segmen tengah dari kabel lain yang BUKAN satu jaringan dengan kabel (fromKey, toKey)
export function segmentsOfOtherNets(wires, fromKey, toKey, exceptWireId = null) {
  const key = e => (e && e.type === 'pin' ? e.componentId + '.' + e.pinName : null);
  const out = [];
  for (const w of wires) {
    if (w.id === exceptWireId || w.mode !== 'ortho') continue;
    const k1 = key(w.from), k2 = key(w.to);
    if ([k1, k2].some(k => k && (k === fromKey || k === toKey))) continue;   // satu jaringan: boleh menyatu
    out.push(...middleSegs(w.path));
  }
  return out;
}

function overlapLen(p, q, segs) {   // total panjang yang berimpit (segaris) dengan segmen lain
  const o = orientOf(p, q); if (!o) return 0;
  let tot = 0;
  for (const s of segs) {
    if (s.o !== o) continue;
    if (o === 'h' && Math.abs(s.c - p.y) < 1) tot += Math.max(0, Math.min(Math.max(p.x, q.x), s.hi) - Math.max(Math.min(p.x, q.x), s.lo));
    if (o === 'v' && Math.abs(s.c - p.x) < 1) tot += Math.max(0, Math.min(Math.max(p.y, q.y), s.hi) - Math.max(Math.min(p.y, q.y), s.lo));
  }
  return tot;
}

// kandidat jalur: lurus, L, Z, dan Z dengan garis tengah digeser 10..40px (lebih banyak pilihan menghindari kabel lain)
function legCandidates(P, Q) {
  const c = [];
  if (P.x === Q.x || P.y === Q.y) c.push([P, Q]);
  c.push([P, { x: Q.x, y: P.y }, Q], [P, { x: P.x, y: Q.y }, Q]);
  const mxs = [snap((P.x + Q.x) / 2)], mys = [snap((P.y + Q.y) / 2)];
  for (const k of [10, 20, 30, 40]) {
    mxs.push(P.x + k, P.x - k, Q.x + k, Q.x - k, mxs[0] + k, mxs[0] - k);
    mys.push(P.y + k, P.y - k, Q.y + k, Q.y - k, mys[0] + k, mys[0] - k);
  }
  for (const mx of mxs) c.push([P, { x: mx, y: P.y }, { x: mx, y: Q.y }, Q]);
  for (const my of mys) c.push([P, { x: P.x, y: my }, { x: Q.x, y: my }, Q]);
  return c;
}

function chooseLeg(P, Q, boxes, keepStraight = false, others = []) {
  if (keepStraight && (P.x === Q.x || P.y === Q.y)) return [P, Q];   // mode manual: jangan dibelokkan menghindari komponen
  let best = null;
  for (const path of legCandidates(P, Q)) {
    let hits = 0, len = 0, ov = 0;
    for (let i = 0; i < path.length - 1; i++) {
      len += Math.abs(path[i + 1].x - path[i].x) + Math.abs(path[i + 1].y - path[i].y);
      for (const bx of boxes) if (segHitsBox(path[i], path[i + 1], bx)) hits++;
      ov += overlapLen(path[i], path[i + 1], others);
    }
    const score = hits * 100000 + ov * 40 + (path.length - 2) * 1000 + len;   // komponen > tumpang tindih > tikungan > panjang
    if (!best || score < best.score) best = { path, score };
  }
  return best.path;
}

// Ujung stub: jika titik belok pertama/terakhir pengguna sudah segaris dengan arah keluar pin (jarak >= 8), pakai titik itu.
function stubEnd(P, exit, anchor) {
  if (anchor) {
    if (exit.axis === 'h' && anchor.y === P.y && Math.sign(anchor.x - P.x) === exit.sign && Math.abs(anchor.x - P.x) >= 8) return { x: anchor.x, y: P.y };
    if (exit.axis === 'v' && anchor.x === P.x && Math.sign(anchor.y - P.y) === exit.sign && Math.abs(anchor.y - P.y) >= 8) return { x: P.x, y: anchor.y };
  }
  return exit.axis === 'h' ? { x: P.x + exit.sign * exit.len, y: P.y } : { x: P.x, y: P.y + exit.sign * exit.len };
}

// opts.keepStraight: leg yang sudah lurus dipertahankan. opts.keepAnchors: jangan snap ulang titik belok (mode manual).
export function routeOrthogonal(A, exitA, waypoints, B, exitB, boxes = [], opts = {}) {
  const w = opts.keepAnchors ? waypoints.map(q => ({ x: q.x, y: q.y })) : waypoints.map(q => ({ x: snap(q.x), y: snap(q.y) }));
  const A1 = stubEnd(A, exitA, w[0]);
  const B1 = !exitB ? { ...B } : stubEnd(B, exitB, w[w.length - 1]);
  const anchors = [A1, ...w, B1];
  const pts = [{ ...A }, A1];
  for (let i = 0; i < anchors.length - 1; i++) pts.push(...chooseLeg(anchors[i], anchors[i + 1], boxes, opts.keepStraight, opts.others || []).slice(1));
  if (exitB) pts.push({ ...B });
  return normalizePath(pts);
}

export function normalizePath(pts) {   // buang titik kembar dan titik segaris; ulangi sampai stabil
  let cur = pts.map(p => ({ x: p.x, y: p.y })), changed = true;
  while (changed) {
    changed = false;
    const dedup = [];
    for (const p of cur) { const l = dedup[dedup.length - 1]; if (l && l.x === p.x && l.y === p.y) { changed = true; continue; } dedup.push(p); }
    const next = dedup.filter((p, i, a) => i === 0 || i === a.length - 1 ||
      !((a[i - 1].x === p.x && p.x === a[i + 1].x) || (a[i - 1].y === p.y && p.y === a[i + 1].y)));
    if (next.length !== dedup.length) changed = true;
    cur = next;
  }
  return cur;
}

// path SVG dengan sudut membulat (hanya tampilan; titik asli tidak berubah)
export function roundedPath(pts, r = 8) {
  if (pts.length < 3) return 'M' + pts.map(p => p.x + ' ' + p.y).join(' L');
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1], v = pts[i], p1 = pts[i + 1];
    const l0 = Math.hypot(v.x - p0.x, v.y - p0.y), l1 = Math.hypot(p1.x - v.x, p1.y - v.y), rr = Math.min(r, l0 / 2, l1 / 2);
    const s = { x: v.x - (v.x - p0.x) / l0 * rr, y: v.y - (v.y - p0.y) / l0 * rr };
    const e = { x: v.x + (p1.x - v.x) / l1 * rr, y: v.y + (p1.y - v.y) / l1 * rr };
    d += ` L ${s.x} ${s.y} Q ${v.x} ${v.y} ${e.x} ${e.y}`;
  }
  return d + ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
}
