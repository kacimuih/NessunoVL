// Penempatan menu konteks yang tidak menimpa objek terpilih maupun kartu peringatan, dan tetap di dalam kanvas.
// Semua koordinat dalam satu ruang yang sama (mis. koordinat layar). Rect = { l, t, r, b }.
const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

export function placeMenu(obj, size, bounds, avoid = [], gap = 14, pad = 8) {
  const cx = (obj.l + obj.r) / 2, cy = (obj.t + obj.b) / 2;
  const raw = [
    { x: cx - size.w / 2, y: obj.t - gap - size.h },     // atas (bawaan)
    { x: cx - size.w / 2, y: obj.b + gap },              // bawah
    { x: obj.l - gap - size.w, y: cy - size.h / 2 },     // kiri
    { x: obj.r + gap, y: cy - size.h / 2 }               // kanan
  ];
  const clamp = p => ({
    x: Math.min(Math.max(p.x, bounds.l + pad), Math.max(bounds.l + pad, bounds.r - size.w - pad)),
    y: Math.min(Math.max(p.y, bounds.t + pad), Math.max(bounds.t + pad, bounds.b - size.h - pad))
  });
  const rectOf = p => ({ l: p.x, t: p.y, r: p.x + size.w, b: p.y + size.h });
  let best = null;
  for (const c of raw) {
    const p = clamp(c), rc = rectOf(p);
    const score = avoid.filter(a => hit(rc, a)).length * 1000 + (hit(rc, obj) ? 500 : 0);   // 0 = tempat yang bersih
    if (score === 0) return p;
    if (!best || score < best.score) best = { p, score };
  }
  return best.p;
}
