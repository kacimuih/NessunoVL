import { normalizePath, orientOf as orient } from './wireRouting.js';

function hasFoldBack(pts) {   // jalur melipat balik pada dirinya tidak boleh ada
  const d = [];
  for (const p of pts) { const l = d[d.length - 1]; if (!(l && l.x === p.x && l.y === p.y)) d.push(p); }
  for (let k = 1; k < d.length - 1; k++) {
    const a = d[k - 1], b = d[k], c = d[k + 1];
    if (a.x === b.x && b.x === c.x && (b.y - a.y) * (c.y - b.y) < 0) return true;
    if (a.y === b.y && b.y === c.y && (b.x - a.x) * (c.x - b.x) < 0) return true;
  }
  return false;
}
const stubSign = (pts, atEnd) => {
  const P = atEnd ? pts[pts.length - 1] : pts[0], Q = atEnd ? pts[pts.length - 2] : pts[1];
  return P.y === Q.y ? Math.sign(Q.x - P.x) : Math.sign(Q.y - P.y);
};

// Geser segmen i tegak lurus sebesar d. Segmen yang menyentuh pin (pertama/terakhir) tidak boleh digeser.
// Mengembalikan jalur baru, atau null bila tidak valid (menyentuh pin, jalur melipat, atau arah keluar pin berbalik).
export function moveSegment(pts, i, d, snapOn = true, minStub = 8, normalize = true) {
  const n = pts.length;
  if (i <= 0 || i >= n - 2) return null;
  const o = orient(pts[i], pts[i + 1]); if (!o) return null;
  const res = pts.map(p => ({ ...p }));
  let nv = (o === 'h' ? pts[i].y : pts[i].x) + d;
  if (snapOn) nv = Math.round(nv / 10) * 10;
  const clampStub = (pin, idx, val) => {
    const stubO = orient(pts[pin], pts[idx]); if (!stubO) return val;
    const axisVal = stubO === 'h' ? pts[pin].x : pts[pin].y;
    const origSign = Math.sign((stubO === 'h' ? pts[idx].x : pts[idx].y) - axisVal) || 1;
    return origSign > 0 ? Math.max(val, axisVal + minStub) : Math.min(val, axisVal - minStub);
  };
  if (i === 1) nv = clampStub(0, 1, nv);
  if (i === n - 3) nv = clampStub(n - 1, n - 2, nv);
  if (o === 'h') { res[i].y = nv; res[i + 1].y = nv; } else { res[i].x = nv; res[i + 1].x = nv; }
  if (hasFoldBack(res)) return null;
  const out = normalize ? normalizePath(res) : res;
  if (normalize && (stubSign(out, false) !== stubSign(pts, false) || stubSign(out, true) !== stubSign(pts, true))) return null;
  return out;
}

// Sisipkan belokan pada segmen i: EMPAT titik (dua pasang titik kembar) agar setelah segmen tengah digeser,
// dua segmen penghubung di sisinya tegak lurus. Mengembalikan { pts, index } (index = segmen tengah baru).
export function insertJog(pts, i, half = 10) {
  const P = pts[i], Q = pts[i + 1], o = orient(P, Q); if (!o) return null;
  const len = Math.abs(Q.x - P.x) + Math.abs(Q.y - P.y); if (len < 4 * half) return null;
  const dir = o === 'h' ? Math.sign(Q.x - P.x) : Math.sign(Q.y - P.y);
  const mid = Math.round(((o === 'h' ? P.x + Q.x : P.y + Q.y) / 2) / 10) * 10;
  const at = off => (o === 'h' ? { x: mid + dir * off, y: P.y } : { x: P.x, y: mid + dir * off });
  const n1 = at(-half), m1 = at(-half), m2 = at(half), n2 = at(half);
  return { pts: [...pts.slice(0, i + 1), n1, m1, m2, n2, ...pts.slice(i + 1)].map(p => ({ ...p })), index: i + 2 };
}

// anchors baru = semua sudut (titik antara) pada jalur yang sudah dinormalisasi
export const anchorsFromPath = pts => normalizePath(pts).slice(1, -1).map(p => ({ x: p.x, y: p.y }));
