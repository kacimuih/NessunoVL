// Simbol Wiring Diagram (gaya IEC / SNI-PUIL) untuk mode "Skematik" Virtual Lab IPL.
// Posisi pin TIDAK diubah (mengikuti COMPONENT_TYPES), sehingga kabel dan evaluator tetap bekerja.

const LN = '#cbd5e1';   // garis simbol / konduktor
const DIM = '#64748b';  // bagian tidak aktif
const ACT = '#fbbf24';  // bagian yang sedang menghantar (kontak tertutup)
const RED = '#ef4444';
const TXT = '#e2e8f0';
const SUB = '#94a3b8';
const GRN = '#22c55e';
const BLU = '#3b82f6';

const line = (x1, y1, x2, y2, c = LN, w = 1.8, extra = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const poly = (pts, c = LN, w = 1.8) =>
  `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const dot = (x, y, r = 2.4, c = LN) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const ring = (x, y, r = 2.6, c = LN) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0f172a" stroke="${c}" stroke-width="1.5"/>`;

let _currentRot = 0;
const text = (x, y, s, size = 7.5, fill = SUB, anchor = 'middle', weight = 700) => {
  const normRot = ((_currentRot % 360) + 360) % 360;
  const rotAttr = normRot !== 0 ? ` transform="rotate(${-normRot}, ${x}, ${y})"` : '';
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" pointer-events="none"${rotAttr}>${s}</text>`;
};

const xmark = (x, y, c = LN) => `<path d="M${x - 3} ${y - 3} L${x + 3} ${y + 3} M${x + 3} ${y - 3} L${x - 3} ${y + 3}" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
// garis kecil tegak lurus di tengah bilah (pegangan saklar)
const handle = (x1, y1, x2, y2, c, len = 5) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1;
  const px = (dy / n) * len, py = (-dx / n) * len;
  return line(mx - px, my - py, mx + px, my + py, c, 1.6);
};
const dashed = (x1, y1, x2, y2) => line(x1, y1, x2, y2, SUB, 1.2, 'stroke-dasharray="3 2.5"');

// Satu kutub pemutus/saklar vertikal: terminal atas ke kontak tetap, engsel di bawah.
function pole({ x, topY, fixedY, pivotY, botY, closed, openDx = 14, markX = false, openColor = LN, hand = false }) {
  const c = closed ? ACT : openColor;
  const tipX = closed ? x : x + openDx;
  return `
    ${line(x, topY, x, fixedY, LN)}
    ${markX ? xmark(x, fixedY) : dot(x, fixedY, 2.2)}
    ${line(x, botY, x, pivotY, LN)}
    ${ring(x, pivotY, 2.4)}
    ${line(x, pivotY, tipX, fixedY + 2, c, 2.2)}
    ${hand ? handle(x, pivotY, tipX, fixedY + 2, c) : ''}
  `;
}

// Kutub pemutus (MCB) gaya IEC: terminal atas berhenti di kontak tetap, engsel di bawah,
// bilah miring ke KIRI saat terbuka dan tegak (amber) saat tertutup.
function breakerPole({ x, topY, botY, pivotY, stopY, tipY, closed, lean = 17, openColor = LN }) {
  const tipX = closed ? x : x - lean;
  const tipYY = closed ? stopY : tipY;
  return `
    ${line(x, topY, x, stopY, LN)}
    ${line(x, botY, x, pivotY, LN)}
    ${line(x, pivotY, tipX, tipYY, closed ? ACT : openColor, 2.4)}
  `;
}

// Mekanisme pelepas otomatis (garis bertingkat + panah putus-putus ke kiri) di sisi kiri bilah.
// Dibuat kompak (skala k) agar TETAP DI DALAM kotak komponen dan tidak menyentuh komponen/kabel di sebelahnya.
// px = sumbu kutub, k = skala, join = selisih x (absolut) titik temu dengan bilah pada y = 47.
function breakerMech(px, color = LN, k = 0.62, join = -8) {
  const X = d => +(px + d * k).toFixed(2);
  const Y = y => +(52 + (y - 52) * k).toFixed(2);
  const dx = -26 * k, dy = 7.6 * k, n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
  const tx = X(-36.5), ty = Y(62.3), a = 4 * k + 1.5, w = 2.2 * k + 0.6;
  const bx = tx - ux * a, by = ty - uy * a, qx = -uy * w, qy = ux * w;
  const jx = +(px + join).toFixed(2);
  return `
    <g opacity="0.9">
      ${poly([[X(-38), Y(53.7)], [X(-34.5), Y(52.2)], [X(-34.5), Y(42.4)], [X(-25.6), Y(40.3)], [X(-22.4), Y(47.8)], [jx, Y(46.9)]], color, 1.2)}
      ${line(+(jx + 1).toFixed(2), Y(54), X(-34), Y(61.6), color, 1.1, 'stroke-dasharray="2.5 2"')}
      <polygon points="${tx},${ty} ${(bx + qx).toFixed(2)},${(by + qy).toFixed(2)} ${(bx - qx).toFixed(2)},${(by - qy).toFixed(2)}" fill="${color}"/>
    </g>
  `;
}

function drawWiringSymbol(type, s = {}, rot = 0) {
  _currentRot = rot || 0;
  const isON = s.on === true;
  const isTripped = s.tripped === true;

  switch (type) {
    case 'Source_1P':
      return `
        <circle cx="22" cy="85" r="18" fill="none" stroke="${LN}" stroke-width="1.8"/>
        <path d="M11 85 C14 76, 19 76, 22 85 S30 94, 33 85" fill="none" stroke="${ACT}" stroke-width="1.8"/>
        ${text(22, 58, '220 V', 8, ACT)}
        ${text(22, 117, '1~', 7.5, SUB)}
        ${line(40, 85, 48, 85)}
        ${line(48, 55, 48, 115, LN, 3)}
        ${line(48, 55, 65, 55)}${line(48, 85, 65, 85)}${line(48, 115, 65, 115)}
        ${text(57, 50, 'L', 8, RED, 'middle', 800)}
        ${text(57, 80, 'N', 8, BLU, 'middle', 800)}
        ${text(57, 110, 'PE', 8, GRN, 'middle', 800)}
        ${text(40, 154, 'SUMBER 1-FASA', 7.5, TXT)}
      `;

    case 'Source_3P':
      return `
        <circle cx="22" cy="115" r="18" fill="none" stroke="${LN}" stroke-width="1.8"/>
        <path d="M11 115 C14 106, 19 106, 22 115 S30 124, 33 115" fill="none" stroke="${ACT}" stroke-width="1.8"/>
        ${text(22, 88, '380 V', 8, ACT)}
        ${text(22, 147, '3~', 7.5, SUB)}
        ${line(40, 115, 48, 115)}
        ${line(48, 55, 48, 175, LN, 3)}
        ${[55, 85, 115, 145, 175].map(y => line(48, y, 65, y)).join('')}
        ${text(57, 50, 'R', 8, RED, 'middle', 800)}
        ${text(57, 80, 'S', 8, '#facc15', 'middle', 800)}
        ${text(57, 110, 'T', 8, TXT, 'middle', 800)}
        ${text(57, 140, 'N', 8, BLU, 'middle', 800)}
        ${text(57, 170, 'PE', 8, GRN, 'middle', 800)}
        ${text(40, 234, 'SUMBER 3-FASA', 7.5, TXT)}
      `;

    case 'MCB_1P': {
      const closed = isON && !isTripped;
      const mc = isTripped ? RED : LN;
      return `
        ${breakerMech(30, mc, 0.62, closed ? -0.8 : -8)}
        ${breakerPole({ x: 30, topY: 10, botY: 90, pivotY: 70, stopY: 32, tipY: 29, closed, lean: 14, openColor: isTripped ? RED : LN })}
        ${text(30, 106, isTripped ? 'MCB 1P · TRIP' : 'MCB 1P', 7.5, isTripped ? RED : TXT)}
      `;
    }

    case 'MCB_3P': {
      const closed = isON && !isTripped;
      const mc = isTripped ? RED : LN;
      return `
        ${breakerMech(20, mc, 0.5, closed ? -0.8 : -5.6)}
        ${dashed(16, 50, 56, 50)}
        ${[20, 40, 60].map(x => breakerPole({ x, topY: 10, botY: 90, pivotY: 70, stopY: 32, tipY: 29, closed, lean: 9, openColor: isTripped ? RED : LN })).join('')}
        ${text(40, 106, isTripped ? 'MCB 3P · TRIP' : 'MCB 3P', 7.5, isTripped ? RED : TXT)}
      `;
    }

    case 'PanelPHB': {
      const mTrip = s.mainTripped === true;
      const mOn = s.mainOn === true && !mTrip;
      const gs = [
        { x: 25, on: s.group1On === true && s.group1Tripped !== true, tr: s.group1Tripped === true, n: 'G1', c: RED },
        { x: 70, on: s.group2On === true && s.group2Tripped !== true, tr: s.group2Tripped === true, n: 'G2', c: '#facc15' },
        { x: 115, on: s.group3On === true && s.group3Tripped !== true, tr: s.group3Tripped === true, n: 'G3', c: TXT },
      ];
      const mainPoles = [20, 40, 60].map(x =>
        breakerPole({ x, topY: 22, botY: 62, pivotY: 52, stopY: 28, tipY: 26, closed: mOn, lean: 9, openColor: mTrip ? RED : LN })
      ).join('');
      return `
        <rect x="2" y="14" width="136" height="136" rx="4" fill="none" stroke="${DIM}" stroke-width="1.2" stroke-dasharray="5 3"/>
        <!-- fasa masuk menuju kutub utama -->
        ${line(20, 5, 20, 22)}
        ${poly([[45, 5], [45, 12], [40, 12], [40, 22]])}
        ${poly([[70, 5], [70, 12], [60, 12], [60, 22]])}
        ${dashed(16, 40, 56, 40)}
        ${mainPoles}
        ${text(8, 40, 'Q', 8, mTrip ? RED : TXT, 'middle', 800)}
        <!-- dari kutub utama ke MCB tiap grup -->
        ${poly([[20, 62], [20, 66], [25, 66], [25, 76]])}
        ${poly([[40, 62], [40, 70], [70, 70], [70, 76]])}
        ${poly([[60, 62], [60, 64], [115, 64], [115, 76]])}
        ${gs.map(g => `
          ${breakerPole({ x: g.x, topY: 76, botY: 155, pivotY: 118, stopY: 84, tipY: 82, closed: g.on, lean: 10, openColor: g.tr ? RED : LN })}
          ${text(g.x - 9, 104, g.tr ? 'TRIP' : g.n, 6.5, g.tr ? RED : g.c, 'end', 800)}
        `).join('')}
        <!-- busbar Netral (N) dan Arde (PE): tidak melewati pemutus -->
        ${poly([[95, 5], [95, 10], [136, 10], [136, 100], [140, 100]], BLU, 2)}
        ${poly([[120, 5], [120, 16], [130, 16], [130, 130], [140, 130]], GRN, 2)}
        ${text(132, 96, 'N', 6.5, BLU, 'end', 800)}
        ${text(126, 126, 'PE', 6.5, GRN, 'end', 800)}
        ${text(70, 168, mTrip ? 'PHB 3-FASA · TRIP' : 'PHB 3-FASA', 7.5, mTrip ? RED : TXT)}
      `;
    }

    case 'Fuse': {
      const blown = s.blown === true;
      const c = blown ? RED : LN;
      return `
        ${blown
          ? `${line(25, 10, 25, 34, RED)}${line(25, 46, 25, 70, RED)}${dot(25, 40, 2, RED)}`
          : line(25, 10, 25, 70)}
        <rect x="19" y="24" width="12" height="32" rx="1.5" fill="#0f172a" fill-opacity="0.85" stroke="${c}" stroke-width="1.8"/>
        ${blown ? `${line(25, 27, 25, 34, RED, 1.6)}${line(25, 46, 25, 53, RED, 1.6)}` : line(25, 27, 25, 53, LN, 1.6)}
        ${text(25, 88, blown ? 'SEKRING · PUTUS' : 'SEKRING', 7, blown ? RED : TXT)}
      `;
    }

    case 'SwitchSingle':
      return `
        ${pole({ x: 30, topY: 10, fixedY: 26, pivotY: 52, botY: 70, closed: isON, openDx: 14, hand: true })}
        ${text(30, 88, 'SAKLAR TUNGGAL', 7, TXT)}
      `;

    case 'SwitchDouble': {
      const l = s.on1 === true, r = s.on2 === true;
      return `
        ${line(40, 70, 40, 58)}${line(25, 58, 55, 58)}${dot(40, 58, 2.6)}
        ${line(25, 10, 25, 28)}${dot(25, 28, 2.2)}${ring(25, 58, 2.4)}
        ${line(25, 58, l ? 25 : 14, 30, l ? ACT : LN, 2.2)}${handle(25, 58, l ? 25 : 14, 30, l ? ACT : LN)}
        ${line(55, 10, 55, 28)}${dot(55, 28, 2.2)}${ring(55, 58, 2.4)}
        ${line(55, 58, r ? 55 : 66, 30, r ? ACT : LN, 2.2)}${handle(55, 58, r ? 55 : 66, 30, r ? ACT : LN)}
        ${text(40, 88, 'SAKLAR SERI', 7, TXT)}
      `;
    }

    case 'SwitchWay3': {
      // ON -> common tersambung ke L1 (kiri), OFF -> L2 (kanan)
      const tx = isON ? 20 : 50;
      return `
        ${line(35, 70, 35, 52)}${ring(35, 52, 2.4)}
        ${line(20, 10, 20, 28)}${dot(20, 28, 2.2, isON ? ACT : LN)}
        ${line(50, 10, 50, 28)}${dot(50, 28, 2.2, isON ? LN : ACT)}
        ${line(35, 52, tx, 30, ACT, 2.2)}${handle(35, 52, tx, 30, ACT)}
        ${text(35, 88, 'SAKLAR TUKAR', 7, TXT)}
      `;
    }

    case 'SwitchCross': {
      // OFF: lurus (in1-out1, in2-out2). ON: silang (in1-out2, in2-out1)
      const act = isON ? [[25, 26, 55, 54], [55, 26, 25, 54]] : [[25, 26, 25, 54], [55, 26, 55, 54]];
      const idle = isON ? [[25, 26, 25, 54], [55, 26, 55, 54]] : [[25, 26, 55, 54], [55, 26, 25, 54]];
      return `
        ${line(25, 10, 25, 26)}${line(55, 10, 55, 26)}${line(25, 54, 25, 70)}${line(55, 54, 55, 70)}
        ${idle.map(p => line(...p, DIM, 1.2, 'stroke-dasharray="2 3" opacity="0.7"')).join('')}
        ${act.map(p => line(...p, ACT, 2.2)).join('')}
        ${[[25, 26], [55, 26], [25, 54], [55, 54]].map(p => dot(p[0], p[1], 2.4, ACT)).join('')}
        ${text(40, 88, 'SAKLAR SILANG', 7, TXT)}
      `;
    }

    case 'Socket':
      return `
        ${line(14, 40, 66, 40)}
        <path d="M18 40 A22 22 0 0 1 62 40" fill="none" stroke="${LN}" stroke-width="1.8"/>
        ${line(25, 40, 25, 26)}${line(55, 40, 55, 26)}
        ${line(40, 40, 40, 65, GRN, 1.8)}
        ${text(52, 66, 'PE', 6.5, GRN, 'start', 800)}
        ${text(40, 88, 'STOP KONTAK', 7, TXT)}
      `;

    case 'Lamp':
      return `
        ${isON ? `<circle cx="40" cy="40" r="22" fill="#fde047" opacity="0.28" filter="drop-shadow(0 0 10px #fde047)"/>` : ''}
        <circle cx="40" cy="40" r="16" fill="${isON ? '#fde047' : '#0f172a'}" fill-opacity="${isON ? 0.9 : 1}" stroke="${isON ? ACT : LN}" stroke-width="1.8"/>
        ${line(28.7, 28.7, 51.3, 51.3, isON ? '#78350f' : LN, 1.8)}
        ${line(51.3, 28.7, 28.7, 51.3, isON ? '#78350f' : LN, 1.8)}
        ${text(25, 58, 'L', 7, RED, 'middle', 800)}${text(55, 58, 'N', 7, BLU, 'middle', 800)}
        ${text(40, 80, 'LAMPU', 7.5, TXT)}
      `;

    case 'LampTL':
      return `
        ${line(10, 25, 24, 25)}${line(96, 25, 110, 25)}
        <rect x="24" y="14" width="72" height="22" rx="3" fill="${isON ? '#f8fafc' : '#0f172a'}" fill-opacity="${isON ? 0.92 : 1}" stroke="${isON ? ACT : LN}" stroke-width="1.8" ${isON ? 'filter="drop-shadow(0 0 8px #f0f9ff)"' : ''}/>
        ${line(48, 18, 72, 32, isON ? '#78350f' : LN, 1.6)}${line(72, 18, 48, 32, isON ? '#78350f' : LN, 1.6)}
        ${text(60, 47, 'LAMPU TL', 7.5, TXT)}
      `;

    case 'JunctionBox':
      return `
        ${line(30, 8, 30, 52)}${line(8, 30, 52, 30)}${dot(30, 30, 4.2, ACT)}
        ${text(30, 68, 'KOTAK SAMBUNG', 6.5, TXT)}
      `;

    case 'TerminalBlock':
      return `
        <rect x="6" y="4" width="88" height="42" rx="3" fill="none" stroke="${DIM}" stroke-width="1.1" stroke-dasharray="4 3"/>
        ${[20, 40, 60, 80].map(x => `${line(x, 10, x, 40)}${ring(x, 25, 3.2)}`).join('')}
        ${text(50, 61, 'TERMINAL BLOCK', 7, TXT)}
      `;

    default:
      return `<rect width="50" height="50" fill="none" stroke="magenta"/>`;
  }
}

// Simbol hanya hiasan: tidak boleh menangkap klik/drag. Area klik tetap .select-box dan pin di LabCanvas.
export function getComponentWiringSVG(type, s = {}, rot = 0) {
  return `<g pointer-events="none">${drawWiringSymbol(type, s, rot)}</g>`;
}
