import { orientOf } from './wireRouting.js';

export const LANE = 6; // jarak antar jalur (satuan dunia)

// kelompokkan kabel yang berbagi pin menjadi satu jaringan
export function netIds(wires) {
  const parent = {};
  const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const union = (a, b) => {
    a = find(a);
    b = find(b);
    if (a !== b) parent[a] = b;
  };
  const key = e => (e && e.type === 'pin' ? e.componentId + '.' + e.pinName : null);
  wires.forEach(w => {
    parent[w.id] = w.id;
  });
  const owner = {};
  wires.forEach(w => [w.from, w.to].forEach(e => {
    const k = key(e);
    if (!k) return;
    if (owner[k]) union(owner[k], w.id);
    else owner[k] = w.id;
  }));
  const out = {};
  wires.forEach(w => {
    out[w.id] = find(w.id);
  });
  return out;
}

// Urutan lane agar kabel tidak saling bersilangan (mengerucut dari trunk)
export function laneOrder(cluster, o) {
  if (!cluster || !cluster.length) return [];

  // 1. Ambil segmen unik per wireId (jika satu kabel punya multiple segmen di kluster yang sama, ambil yang terpanjang)
  const segByWid = new Map();
  for (const s of cluster) {
    const existing = segByWid.get(s.wid);
    if (!existing || (s.hi - s.lo) > (existing.hi - existing.lo)) {
      segByWid.set(s.wid, s);
    }
  }
  const uniqueSegs = [...segByWid.values()];
  const wids = [...segByWid.keys()];
  if (wids.length <= 1) return wids;

  // 2. Tentukan titik pangkal bersama (trunk):
  // Hitung seberapa banyak segmen yang memakai nilai lo atau hi yang sama (toleransi 2 px).
  const loCounts = new Map();
  const hiCounts = new Map();
  for (const s of uniqueSegs) {
    const rLo = Math.round(s.lo);
    const rHi = Math.round(s.hi);
    loCounts.set(rLo, (loCounts.get(rLo) || 0) + 1);
    hiCounts.set(rHi, (hiCounts.get(rHi) || 0) + 1);
  }

  let maxLoCount = 0, bestLo = null;
  for (const [val, count] of loCounts) {
    if (count > maxLoCount) {
      maxLoCount = count;
      bestLo = val;
    }
  }

  let maxHiCount = 0, bestHi = null;
  for (const [val, count] of hiCounts) {
    if (count > maxHiCount) {
      maxHiCount = count;
      bestHi = val;
    }
  }

  let trunkEnd = null;
  let trunkCoord = null;
  if (maxHiCount > maxLoCount) {
    trunkEnd = 'hi';
    trunkCoord = bestHi;
  } else if (maxLoCount > maxHiCount) {
    trunkEnd = 'lo';
    trunkCoord = bestLo;
  }

  // Jika tidak ada trunk yang dominan (mis. paralel identik antar net berbeda)
  if (!trunkEnd) {
    uniqueSegs.sort((a, b) => {
      if (a.net !== b.net) return String(a.net).localeCompare(String(b.net));
      return String(a.wid).localeCompare(String(b.wid));
    });
    return uniqueSegs.map(s => s.wid);
  }

  // 3. Tentukan sisi sumber (sourceSide): apakah sumber berada di koordinat tegak lurus yang lebih kecil (< c) atau lebih besar (> c)
  let sideSum = 0;
  for (const s of uniqueSegs) {
    const pCoord = o === 'h' ? s.p.x : s.p.y;
    const qCoord = o === 'h' ? s.q.x : s.q.y;
    const pAtTrunk = Math.abs(pCoord - trunkCoord) <= Math.abs(qCoord - trunkCoord);
    const inc = pAtTrunk ? s.prev : s.next;
    if (inc) {
      const incPerp = o === 'h' ? inc.y : inc.x;
      sideSum += Math.sign(incPerp - s.c);
    }
  }
  const sourceSide = sideSum !== 0 ? Math.sign(sideSum) : -1;

  // 4. Hitung jarak masing-masing kabel menjauh dari pangkal (trunk):
  const distByWid = new Map();
  for (const s of uniqueSegs) {
    const dist = trunkEnd === 'hi' ? (trunkCoord - s.lo) : (s.hi - trunkCoord);
    distByWid.set(s.wid, dist);
  }

  // 5. Kabel yang menjauh paling jauh dari pangkal mendapat lane terdekat ke sumber:
  // Jika sourceSide < 0 (sumber di koordinat lebih kecil, mis. di atas), lane terdekat ke sumber adalah k=0 (offset paling negatif).
  // -> Urutkan jarak descending (distB - distA).
  // Jika sourceSide > 0 (sumber di koordinat lebih besar, mis. di bawah), lane terdekat ke sumber adalah k=n-1 (offset paling positif).
  // -> Urutkan jarak ascending (distA - distB).
  uniqueSegs.sort((a, b) => {
    const distA = distByWid.get(a.wid) || 0;
    const distB = distByWid.get(b.wid) || 0;
    if (Math.abs(distA - distB) > 0.1) {
      return sourceSide < 0 ? (distB - distA) : (distA - distB);
    }
    // Bila seri imbang, urutkan stabil berdasarkan wid
    return String(a.wid).localeCompare(String(b.wid));
  });

  return uniqueSegs.map(s => s.wid);
}

// -> { [wireId]: Map(segIndex -> offset) } untuk segmen tengah yang berimpit baik satu jaringan maupun beda jaringan
export function computeLanes(wires) {
  const net = netIds(wires), items = [], result = {};
  wires.filter(w => w.mode === 'ortho').forEach(w => {
    for (let i = 1; i <= w.path.length - 3; i++) {
      const p = w.path[i], q = w.path[i + 1], o = orientOf(p, q);
      if (!o) continue;
      items.push({
        wid: w.id,
        net: net[w.id],
        i,
        o,
        c: o === 'h' ? p.y : p.x,
        lo: o === 'h' ? Math.min(p.x, q.x) : Math.min(p.y, q.y),
        hi: o === 'h' ? Math.max(p.x, q.x) : Math.max(p.y, q.y),
        p,
        q,
        prev: w.path[i - 1],
        next: w.path[i + 2]
      });
    }
  });

  for (const o of ['h', 'v']) {
    const groups = {};
    items.filter(s => s.o === o).forEach(s => {
      (groups[Math.round(s.c * 2) / 2] ??= []).push(s);
    });

    for (const g of Object.values(groups)) {
      g.sort((a, b) => a.lo - b.lo);
      let cluster = [], hi = -Infinity;
      const flush = () => {
        if (!cluster.length) return;
        const wids = laneOrder(cluster, o);
        if (wids.length > 1) {
          cluster.forEach(s => {
            const k = wids.indexOf(s.wid);
            if (k !== -1) {
              (result[s.wid] ??= new Map()).set(s.i, (k - (wids.length - 1) / 2) * LANE);
            }
          });
        }
        cluster = [];
        hi = -Infinity;
      };

      for (const s of g) {
        if (cluster.length && s.lo < hi - 2) {
          cluster.push(s);
          hi = Math.max(hi, s.hi);
        } else {
          flush();
          cluster = [s];
          hi = s.hi;
        }
      }
      flush();
    }
  }

  return result;
}

const hasFold = pts => {
  const d = [];
  for (const p of pts) {
    const l = d[d.length - 1];
    if (!(l && l.x === p.x && l.y === p.y)) d.push(p);
  }
  for (let k = 1; k < d.length - 1; k++) {
    const a = d[k - 1], b = d[k], c = d[k + 1];
    if (a.x === b.x && b.x === c.x && (b.y - a.y) * (c.y - b.y) < 0) return true;
    if (a.y === b.y && b.y === c.y && (b.x - a.x) * (c.x - b.x) < 0) return true;
  }
  return false;
};

// jalur untuk digambar (bukan untuk disimpan). Mengembalikan jalur asli bila pergeseran tidak aman.
export function displayPath(pts, offs) {
  if (!offs || !offs.size) return pts;
  const n = pts.length, res = pts.map(p => ({ ...p }));
  for (const [i, off] of offs) {
    const o = orientOf(pts[i], pts[i + 1]);
    if (o === 'h') {
      res[i].y += off;
      res[i + 1].y += off;
    } else {
      res[i].x += off;
      res[i + 1].x += off;
    }
  }
  const dirOf = (P, Q) => (P.y === Q.y ? ['h', Math.sign(Q.x - P.x)] : ['v', Math.sign(Q.y - P.y)]);
  const [o0, s0] = dirOf(pts[0], pts[1]), [o1, s1] = dirOf(res[0], res[1]);
  const [oN, sN] = dirOf(pts[n - 1], pts[n - 2]), [oM, sM] = dirOf(res[n - 1], res[n - 2]);
  const len = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
  if (hasFold(res) || o0 !== o1 || s0 !== s1 || oN !== oM || sN !== sM || len(res[0], res[1]) < 4 || len(res[n - 1], res[n - 2]) < 4) return pts;
  return res;
}
