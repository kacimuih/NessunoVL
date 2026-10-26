// Test suite untuk pemisahan kabel sejajar dan berimpit (wireLanes.js)
import assert from 'node:assert/strict';
import { computeLanes, displayPath, laneOrder, netIds } from './wireLanes.js';

console.log('🧪 Menjalankan pengujian wireLanes...');

// Kasus 1: 1 sumber -> 3 tujuan, satu jaringan (kasus MCB ke 3 MCB)
{
  const S = { type: 'pin', componentId: 'A', pinName: 'out' };
  const mk = (id, tx) => ({
    id,
    mode: 'ortho',
    from: S,
    to: { type: 'pin', componentId: id, pinName: 'in' },
    path: [
      { x: 336, y: 160 },
      { x: 336, y: 181 },
      { x: tx, y: 181 },
      { x: tx, y: 250 },
      { x: tx, y: 270 }
    ]
  });

  const wires = [mk('w1', 65), mk('w2', 137), mk('w3', 200)];

  // Pastikan semuanya dikenali sebagai 1 jaringan (net) yang sama
  const nets = netIds(wires);
  assert.equal(nets.w1, nets.w2);
  assert.equal(nets.w2, nets.w3);

  // Hitung lane
  const lanes = computeLanes(wires);

  // Harus menghasilkan offset untuk ketiga kabel pada segmen horizontal tengah (indeks 1)
  assert.ok(lanes.w1 && lanes.w1.has(1), 'w1 harus memiliki offset segmen 1');
  assert.ok(lanes.w2 && lanes.w2.has(1), 'w2 harus memiliki offset segmen 1');
  assert.ok(lanes.w3 && lanes.w3.has(1), 'w3 harus memiliki offset segmen 1');

  const off1 = lanes.w1.get(1);
  const off2 = lanes.w2.get(1);
  const off3 = lanes.w3.get(1);

  // w1 (tx=65, terjauh dari trunk x=336) harus terdekat ke sumber (y=160 < 181 -> offset -6)
  assert.equal(off1, -6, 'w1 (x=65) harus mendapat offset -6 (terdekat ke sumber di atas)');
  assert.equal(off2, 0, 'w2 (x=137) harus mendapat offset 0');
  assert.equal(off3, 6, 'w3 (x=200) harus mendapat offset +6');

  // Periksa displayPath untuk w1, w2, w3
  const disp1 = displayPath(wires[0].path, lanes.w1);
  const disp2 = displayPath(wires[1].path, lanes.w2);
  const disp3 = displayPath(wires[2].path, lanes.w3);

  // Titik pin tidak boleh berubah
  assert.deepEqual(disp1[0], { x: 336, y: 160 });
  assert.deepEqual(disp1[4], { x: 65, y: 270 });
  // Segmen tengah tergeser -6
  assert.equal(disp1[1].y, 175);
  assert.equal(disp1[2].y, 175);

  assert.deepEqual(disp2[0], { x: 336, y: 160 });
  assert.deepEqual(disp2[4], { x: 137, y: 270 });
  assert.equal(disp2[1].y, 181);

  assert.deepEqual(disp3[0], { x: 336, y: 160 });
  assert.deepEqual(disp3[4], { x: 200, y: 270 });
  assert.equal(disp3[1].y, 187);

  console.log('✅ Kasus 1: 1 sumber -> 3 tujuan satu jaringan berhasil dipisah (-6, 0, +6) tanpa silangan');
}

// Kasus 2: Dua kabel beda jaringan yang berimpit tetap terpisah
{
  const wireNetA = {
    id: 'wA',
    mode: 'ortho',
    from: { type: 'pin', componentId: 'compA', pinName: 'p1' },
    to: { type: 'pin', componentId: 'compB', pinName: 'p1' },
    path: [
      { x: 50, y: 100 },
      { x: 50, y: 140 },
      { x: 250, y: 140 },
      { x: 250, y: 200 },
      { x: 250, y: 220 }
    ]
  };

  const wireNetB = {
    id: 'wB',
    mode: 'ortho',
    from: { type: 'pin', componentId: 'compC', pinName: 'p1' },
    to: { type: 'pin', componentId: 'compD', pinName: 'p1' },
    path: [
      { x: 80, y: 80 },
      { x: 80, y: 140 },
      { x: 280, y: 140 },
      { x: 280, y: 200 },
      { x: 280, y: 220 }
    ]
  };

  const lanes = computeLanes([wireNetA, wireNetB]);
  assert.ok(lanes.wA && lanes.wA.has(1), 'wA harus mendapat offset');
  assert.ok(lanes.wB && lanes.wB.has(1), 'wB harus mendapat offset');

  const offA = lanes.wA.get(1);
  const offB = lanes.wB.get(1);

  // Keduanya harus terpisah berjarak LANE = 6px (mis. -3 dan +3)
  assert.equal(Math.abs(offA - offB), 6, 'Dua kabel beda jaringan harus terpisah 6 px');
  console.log('✅ Kasus 2: Dua kabel beda jaringan yang berimpit tetap terpisah (jarak 6 px)');
}

// Kasus 3: Satu kabel sendirian tidak punya offset
{
  const singleWire = {
    id: 'wSingle',
    mode: 'ortho',
    from: { type: 'pin', componentId: 'compA', pinName: 'p1' },
    to: { type: 'pin', componentId: 'compB', pinName: 'p1' },
    path: [
      { x: 50, y: 100 },
      { x: 50, y: 140 },
      { x: 250, y: 140 },
      { x: 250, y: 200 }
    ]
  };

  const lanes = computeLanes([singleWire]);
  assert.ok(!lanes.wSingle || lanes.wSingle.size === 0, 'Kabel tunggal tidak boleh memiliki offset');
  console.log('✅ Kasus 3: Kabel tunggal tidak mendapat offset');
}

// Kasus 4: displayPath mengembalikan jalur asli bila pergeseran tidak aman (mis. stub terlalu pendek)
{
  const shortStubPath = [
    { x: 100, y: 100 },
    { x: 100, y: 104 }, // stub hanya 4px
    { x: 200, y: 104 },
    { x: 200, y: 200 }
  ];

  // Offset -6 akan membuat y1 menjadi 104 - 6 = 98 (berlawanan arah / fold / stub < 4)
  const unsafeOffs = new Map([[1, -6]]);
  const result = displayPath(shortStubPath, unsafeOffs);

  // displayPath harus aman dan mempertahankan shortStubPath asli
  assert.deepEqual(result, shortStubPath, 'displayPath harus mengembalikan jalur asli bila pergeseran tidak aman');
  console.log('✅ Kasus 4: Pengaman displayPath bekerja mengembalikan jalur asli jika tidak aman');
}

// Kasus 5: Dinamika penyesuaian saat kabel dihapus (3 kabel menjadi 2 kabel)
{
  const S = { type: 'pin', componentId: 'A', pinName: 'out' };
  const mk = (id, tx) => ({
    id,
    mode: 'ortho',
    from: S,
    to: { type: 'pin', componentId: id, pinName: 'in' },
    path: [
      { x: 336, y: 160 },
      { x: 336, y: 181 },
      { x: tx, y: 181 },
      { x: tx, y: 250 },
      { x: tx, y: 270 }
    ]
  });

  // Hapus w1, tersisa w2 dan w3
  const remainingWires = [mk('w2', 137), mk('w3', 200)];
  const lanes = computeLanes(remainingWires);

  const off2 = lanes.w2.get(1);
  const off3 = lanes.w3.get(1);

  assert.equal(off2, -3, 'w2 harus bergeser ke -3 saat tersisa 2 kabel');
  assert.equal(off3, 3, 'w3 harus bergeser ke +3 saat tersisa 2 kabel');
  console.log('✅ Kasus 5: Menghapus 1 kabel menyesuaikan jarak dua kabel tersisa ke ±3 px');
}

console.log('🎉 Seluruh pengujian wireLanes LULUS sempurna!');
