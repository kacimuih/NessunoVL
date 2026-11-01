// WorkingDrawing.js - Generator Diagram Pengawatan (Gambar Kerja) Virtual Lab IPL
// Menghasilkan inline SVG dari spesifikasi komponen, jalur kabel ortogonal, dan titik percabangan.
// Menggunakan simbol standar dari WiringSymbols.js dan definisi pin dari SVGAssets.js.

import { COMPONENT_TYPES } from './SVGAssets.js';
import { getComponentWiringSVG } from './WiringSymbols.js';

/**
 * Peta warna kabel standar PUIL / SNI
 */
const WIRE_COLOR_MAP = {
  phase: { stroke: '#ef4444', label: 'Fasa (Merah)', hex: '#ef4444' },
  red: { stroke: '#ef4444', label: 'Fasa / R (Merah)', hex: '#ef4444' },
  R: { stroke: '#ef4444', label: 'Fasa R (Merah)', hex: '#ef4444' },
  S: { stroke: '#facc15', label: 'Fasa S (Kuning)', hex: '#facc15' },
  yellow: { stroke: '#facc15', label: 'Fasa S (Kuning)', hex: '#facc15' },
  T: { stroke: 'var(--wd-wire-t, #1e293b)', label: 'Fasa T (Hitam)', hex: '#1e293b', isT: true },
  black: { stroke: 'var(--wd-wire-t, #1e293b)', label: 'Fasa T (Hitam)', hex: '#1e293b', isT: true },
  neutral: { stroke: '#3b82f6', label: 'Netral (Biru)', hex: '#3b82f6' },
  blue: { stroke: '#3b82f6', label: 'Netral (Biru)', hex: '#3b82f6' },
  earth: { stroke: '#22c55e', label: 'Ground / Arde (Kuning-Hijau)', hex: '#22c55e', isPE: true },
  ground: { stroke: '#22c55e', label: 'Ground / Arde (Kuning-Hijau)', hex: '#22c55e', isPE: true },
  green: { stroke: '#22c55e', label: 'Ground / Arde (Kuning-Hijau)', hex: '#22c55e', isPE: true }
};

/**
 * Mengadaptasi warna garis/teks simbol agar mendukung dark dan light mode melalui CSS variable
 */
function adaptSymbolColors(svgStr) {
  if (!svgStr) return '';
  return svgStr
    .replaceAll('stroke="#cbd5e1"', 'stroke="var(--wd-symbol-stroke, #cbd5e1)"')
    .replaceAll('fill="#cbd5e1"', 'fill="var(--wd-symbol-stroke, #cbd5e1)"')
    .replaceAll('fill="#e2e8f0"', 'fill="var(--wd-symbol-text, #e2e8f0)"')
    .replaceAll('fill="#94a3b8"', 'fill="var(--wd-symbol-sub, #94a3b8)"')
    .replaceAll('stroke="#64748b"', 'stroke="var(--wd-symbol-dim, #64748b)"')
    .replaceAll('fill="#0f172a"', 'fill="var(--wd-symbol-bg, #0f172a)"');
}

/**
 * Menghitung koordinat absolut sebuah pin pada komponen
 */
function getPinCoords(comp, pinName) {
  const typeInfo = COMPONENT_TYPES[comp.type];
  if (!typeInfo) {
    return { x: comp.x || 0, y: comp.y || 0 };
  }
  const pin = (typeInfo.pins || []).find(p => p.name === pinName);
  if (!pin) {
    return { x: comp.x + (typeInfo.width || 60) / 2, y: comp.y + (typeInfo.height || 60) / 2 };
  }

  const rot = comp.rot || 0;
  if (!rot) {
    return { x: comp.x + pin.x, y: comp.y + pin.y };
  }

  const cx = typeInfo.width / 2;
  const cy = typeInfo.height / 2;
  const rad = (rot * Math.PI) / 180;
  const rx = Math.cos(rad) * (pin.x - cx) - Math.sin(rad) * (pin.y - cy) + cx;
  const ry = Math.sin(rad) * (pin.x - cx) + Math.cos(rad) * (pin.y - cy) + cy;
  return { x: comp.x + rx, y: comp.y + ry };
}

/**
 * Memecahkan titik akhir kabel (endpoint) menjadi { x, y }
 */
function resolveEndpoint(endpoint, components) {
  if (!endpoint) return { x: 0, y: 0 };
  if (Array.isArray(endpoint)) {
    return { x: endpoint[0], y: endpoint[1] };
  }
  if (typeof endpoint === 'object' && endpoint.x !== undefined && endpoint.y !== undefined) {
    return { x: endpoint.x, y: endpoint.y };
  }
  if (typeof endpoint === 'string') {
    const parts = endpoint.split('.');
    if (parts.length === 2) {
      const comp = components.find(c => c.id === parts[0]);
      if (comp) {
        return getPinCoords(comp, parts[1]);
      }
    }
  }
  return { x: 0, y: 0 };
}

/**
 * Mencari posisi terbaik untuk nomor langkah (step badge) pada segmen garis terpanjang
 */
function findBestStepPosition(points) {
  if (!points || points.length < 2) return { x: 0, y: 0 };
  let bestLen = -1;
  let bestMid = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    if (dist > bestLen) {
      bestLen = dist;
      bestMid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    }
  }
  return bestMid;
}

/**
 * Render inline SVG diagram pengawatan (Gambar Kerja)
 * @param {Object} spec Spesifikasi gambar kerja
 * @param {Object} options Opsi tambahan { title, desc, interactive }
 * @returns {string} Inline SVG string
 */
export function renderWorkingDrawing(spec, options = {}) {
  if (!spec || !spec.components) {
    return '<div class="wd-empty">Data gambar kerja tidak tersedia.</div>';
  }

  const width = spec.width || 600;
  const height = spec.height || 300;
  const title = options.title || 'Diagram Pengawatan (Gambar Kerja)';
  const desc = options.desc || 'Diagram pengawatan rangkaian listrik sesuai standar PUIL';

  // 1. Gambar kabel (Wires)
  const wiresSvg = (spec.wires || []).map((w, idx) => {
    const pStart = resolveEndpoint(w.from, spec.components);
    const pEnd = resolveEndpoint(w.to, spec.components);
    const viaPts = (w.via || []).map(pt => (Array.isArray(pt) ? { x: pt[0], y: pt[1] } : pt));
    const allPts = [pStart, ...viaPts, pEnd];

    const d = allPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const colorInfo = WIRE_COLOR_MAP[w.color] || WIRE_COLOR_MAP.phase;
    const strokeColor = colorInfo.stroke;

    let wireElements = '';

    // Untuk Fasa T (hitam), tambahkan halo kontras halus agar terbaca di tema gelap
    if (colorInfo.isT) {
      wireElements += `<path d="${d}" fill="none" stroke="var(--text-primary)" stroke-width="4.2" opacity="0.45" stroke-linecap="round" stroke-linejoin="round"/>`;
      wireElements += `<path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else if (colorInfo.isPE) {
      // Ground PE: garis hijau dengan aksen strip kuning
      wireElements += `<path d="${d}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      wireElements += `<path d="${d}" fill="none" stroke="#facc15" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      wireElements += `<path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    // Nomor langkah (step badge) jika ditentukan
    if (w.step) {
      const stepPos = w.stepPos
        ? (Array.isArray(w.stepPos) ? { x: w.stepPos[0], y: w.stepPos[1] } : w.stepPos)
        : findBestStepPosition(allPts);

      wireElements += `
        <g class="wd-step-badge" transform="translate(${stepPos.x}, ${stepPos.y})" pointer-events="none">
          <circle cx="0" cy="0" r="9" fill="var(--bg-secondary, #1e293b)" stroke="${colorInfo.hex || '#ef4444'}" stroke-width="2"/>
          <text x="0" y="0.5" fill="var(--text-primary, #f8fafc)" font-size="9" font-weight="800" text-anchor="middle" dominant-baseline="central">${w.step}</text>
        </g>
      `;
    }

    return `<g class="wd-wire" data-wire-idx="${idx}">${wireElements}</g>`;
  }).join('\n');

  // 2. Titik percabangan (Junctions)
  const junctionsSvg = (spec.junctions || []).map((j, idx) => {
    const jx = Array.isArray(j) ? j[0] : j.x;
    const jy = Array.isArray(j) ? j[1] : j.y;
    const jColor = (j && j.color && WIRE_COLOR_MAP[j.color]?.hex) || '#ef4444';
    return `
      <g class="wd-junction" data-junction-idx="${idx}">
        <circle cx="${jx}" cy="${jy}" r="4.5" fill="${jColor}" stroke="var(--bg-primary, #0f172a)" stroke-width="1.8"/>
      </g>
    `;
  }).join('\n');

  // 3. Komponen (Components)
  const componentsSvg = (spec.components || []).map(comp => {
    const typeInfo = COMPONENT_TYPES[comp.type] || { width: 60, height: 60, pins: [] };
    const rawSvg = getComponentWiringSVG(comp.type, comp.state || {}, comp.rot || 0);
    const adaptedSvg = adaptSymbolColors(rawSvg);

    // Keterangan teks tambahan jika komponen memiliki label khusus (misal "Saklar 1", "Saklar 2")
    const labelSvg = comp.label
      ? `<text x="${typeInfo.width / 2}" y="-8" fill="var(--text-primary)" font-size="8.5" font-weight="700" text-anchor="middle">${comp.label}</text>`
      : '';

    // Indikator terminal pin
    const pinsSvg = (typeInfo.pins || []).map(p => {
      const pinColor = p.color || '#ef4444';
      return `
        <circle cx="${p.x}" cy="${p.y}" r="2.8" fill="${pinColor}" stroke="var(--bg-primary, #0f172a)" stroke-width="1"/>
      `;
    }).join('');

    return `
      <g class="wd-component" id="wd-comp-${comp.id}" transform="translate(${comp.x}, ${comp.y})">
        ${labelSvg}
        ${adaptedSvg}
        <g class="wd-pin-dots" pointer-events="none">${pinsSvg}</g>
      </g>
    `;
  }).join('\n');

  return `
    <svg class="wd-svg" viewBox="0 0 ${width} ${height}" width="100%" height="auto"
         role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
      <title>${title}</title>
      <desc>${desc}</desc>
      <defs>
        <!-- Pola grid latar belakang untuk nuansa gambar teknik -->
        <pattern id="wd-grid-${width}" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.75" fill="var(--border-color, #334155)" opacity="0.35"/>
        </pattern>
      </defs>
      <!-- Background netral -->
      <rect width="100%" height="100%" fill="var(--bg-primary, #0f172a)" rx="10"/>
      <rect width="100%" height="100%" fill="url(#wd-grid-${width})" rx="10"/>

      <!-- Lapisan kabel, titik sambungan, dan komponen -->
      <g class="wd-layer-wires">${wiresSvg}</g>
      <g class="wd-layer-junctions">${junctionsSvg}</g>
      <g class="wd-layer-components">${componentsSvg}</g>
    </svg>
  `.trim();
}

/**
 * Render legenda warna kabel dan keterangan terminal untuk ditempatkan di bawah gambar
 * @param {Object} spec Spesifikasi gambar kerja
 * @returns {string} HTML string untuk legenda
 */
export function renderWorkingDrawingLegend(spec) {
  if (!spec) return '';

  // Identifikasi warna kabel yang digunakan dalam gambar ini
  const usedColors = new Set();
  (spec.wires || []).forEach(w => {
    if (w.color) usedColors.add(w.color);
  });

  const colorItems = [];
  if (usedColors.has('phase') || usedColors.has('red') || usedColors.has('R')) {
    colorItems.push(`
      <div class="wd-legend-item">
        <span class="wd-color-swatch swatch-phase"></span>
        <span class="wd-legend-label">Fasa / R (Merah)</span>
      </div>
    `);
  }
  if (usedColors.has('S') || usedColors.has('yellow')) {
    colorItems.push(`
      <div class="wd-legend-item">
        <span class="wd-color-swatch swatch-phase-s"></span>
        <span class="wd-legend-label">Fasa S (Kuning)</span>
      </div>
    `);
  }
  if (usedColors.has('T') || usedColors.has('black')) {
    colorItems.push(`
      <div class="wd-legend-item">
        <span class="wd-color-swatch swatch-phase-t"></span>
        <span class="wd-legend-label">Fasa T (Hitam)</span>
      </div>
    `);
  }
  if (usedColors.has('neutral') || usedColors.has('blue')) {
    colorItems.push(`
      <div class="wd-legend-item">
        <span class="wd-color-swatch swatch-neutral"></span>
        <span class="wd-legend-label">Netral (Biru)</span>
      </div>
    `);
  }
  if (usedColors.has('earth') || usedColors.has('ground') || usedColors.has('green')) {
    colorItems.push(`
      <div class="wd-legend-item">
        <span class="wd-color-swatch swatch-earth"></span>
        <span class="wd-legend-label">Ground PE (Kuning-Hijau)</span>
      </div>
    `);
  }

  // Tanda lingkaran langkah
  const stepChip = `
    <div class="wd-legend-item">
      <span class="wd-step-chip">1</span>
      <span class="wd-legend-label">Nomor Langkah Kerja</span>
    </div>
  `;

  // Titik percabangan jika ada junction
  const junctionChip = (spec.junctions && spec.junctions.length > 0) ? `
    <div class="wd-legend-item">
      <span class="wd-junction-chip">●</span>
      <span class="wd-legend-label">Titik Percabangan</span>
    </div>
  ` : '';

  // Keterangan terminal penting yang digunakan dalam rangkaian
  const terminalNotes = [];
  const compTypes = new Set((spec.components || []).map(c => c.type));

  if (compTypes.has('MCB_1P') || compTypes.has('SwitchSingle')) {
    terminalNotes.push('<strong>in/out</strong>: Masukan (atas) & Keluaran (bawah)');
  }
  if (compTypes.has('SwitchDouble')) {
    terminalNotes.push('<strong>in</strong>: Fasa Masuk, <strong>out1/out2</strong>: Keluaran Beban 1 & 2');
  }
  if (compTypes.has('SwitchWay3')) {
    terminalNotes.push('<strong>com</strong>: Terminal Induk, <strong>L1/L2</strong>: Terminal Cabang');
  }
  if (compTypes.has('SwitchCross')) {
    terminalNotes.push('<strong>in1/in2</strong>: Masukan dari Saklar 1, <strong>out1/out2</strong>: Keluaran ke Saklar 2');
  }
  if (compTypes.has('Socket')) {
    terminalNotes.push('<strong>L</strong>: Fasa, <strong>N</strong>: Netral, <strong>PE</strong>: Ground (Arde)');
  }
  if (compTypes.has('MCB_3P')) {
    terminalNotes.push('<strong>in_R/S/T & out_R/S/T</strong>: Masukan & Keluaran 3-Fasa');
  }

  const terminalsHtml = terminalNotes.length > 0 ? `
    <div class="wd-terminal-notes">
      <span class="wd-terminal-title"><i class="bi bi-info-circle"></i> Keterangan Terminal:</span>
      <span class="wd-terminal-list">${terminalNotes.join(' &bull; ')}</span>
    </div>
  ` : '';

  return `
    <div class="wd-legend-container">
      <div class="wd-legend-swatches">
        ${colorItems.join('')}
        ${stepChip}
        ${junctionChip}
      </div>
      ${terminalsHtml}
    </div>
  `.trim();
}

/**
 * Membuka modal overlay tampilan penuh (fullscreen) gambar kerja dengan pan/zoom
 * @param {Object} spec Spesifikasi gambar kerja
 * @param {string} title Judul modal
 */
export function openWorkingDrawingModal(spec, title = 'Gambar Kerja') {
  // Hapus modal lama jika ada
  const existing = document.getElementById('wd-fullscreen-modal');
  if (existing) existing.remove();

  let zoomLevel = 1;

  const modal = document.createElement('div');
  modal.id = 'wd-fullscreen-modal';
  modal.className = 'wd-modal-backdrop';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', title);

  modal.innerHTML = `
    <div class="wd-modal-container">
      <div class="wd-modal-header">
        <div class="wd-modal-title">
          <i class="bi bi-diagram-3-fill"></i> ${title}
        </div>
        <div class="wd-modal-tools">
          <button type="button" class="wd-btn-tool" id="wd-zoom-out" title="Perkecil" aria-label="Perkecil">
            <i class="bi bi-zoom-out"></i>
          </button>
          <span class="wd-zoom-text" id="wd-zoom-val">100%</span>
          <button type="button" class="wd-btn-tool" id="wd-zoom-in" title="Perbesar" aria-label="Perbesar">
            <i class="bi bi-zoom-in"></i>
          </button>
          <button type="button" class="wd-btn-tool" id="wd-zoom-reset" title="Reset Ukuran" aria-label="Reset Ukuran">
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
          <button type="button" class="wd-btn-tool wd-btn-close" id="wd-modal-close" title="Tutup (Esc)" aria-label="Tutup Tampilan">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div class="wd-modal-body" id="wd-modal-viewport">
        <div class="wd-modal-svg-wrapper" id="wd-modal-svg-target">
          ${renderWorkingDrawing(spec, { title })}
        </div>
      </div>
      <div class="wd-modal-footer">
        ${renderWorkingDrawingLegend(spec)}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const target = modal.querySelector('#wd-modal-svg-target');
  const zoomVal = modal.querySelector('#wd-zoom-val');

  function updateZoom() {
    if (target) {
      target.style.transform = `scale(${zoomLevel})`;
      target.style.transformOrigin = 'center top';
    }
    if (zoomVal) {
      zoomVal.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  }

  function closeModal() {
    document.removeEventListener('keydown', handleKey);
    modal.classList.add('wd-modal-closing');
    setTimeout(() => modal.remove(), 200);
  }

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  document.addEventListener('keydown', handleKey);

  modal.querySelector('#wd-modal-close').addEventListener('click', closeModal);
  modal.querySelector('#wd-zoom-in').addEventListener('click', () => {
    if (zoomLevel < 3) {
      zoomLevel = Math.min(3, zoomLevel + 0.25);
      updateZoom();
    }
  });
  modal.querySelector('#wd-zoom-out').addEventListener('click', () => {
    if (zoomLevel > 0.5) {
      zoomLevel = Math.max(0.5, zoomLevel - 0.25);
      updateZoom();
    }
  });
  modal.querySelector('#wd-zoom-reset').addEventListener('click', () => {
    zoomLevel = 1;
    updateZoom();
  });

  // Klik backdrop untuk menutup modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * Menginisialisasi event klik tombol "Perbesar" di dalam kontainer instruksi
 * @param {HTMLElement} container Elemen kontainer instruksi
 * @param {Array} jobsheetList Daftar jobsheetData
 */
export function initWorkingDrawingEvents(container, jobsheetList) {
  if (!container || !jobsheetList) return;

  const btnZoom = container.querySelector('[data-action="wd-zoom"]');
  if (btnZoom) {
    btnZoom.addEventListener('click', () => {
      const jsId = btnZoom.getAttribute('data-js-id');
      const js = jobsheetList.find(j => j.id === jsId);
      if (js && js.workingDrawing) {
        const cleanTitle = `Gambar Kerja ${js.id.toUpperCase()}: ${js.title.replace(/^Jobsheet \d+:\s*/, '')}`;
        openWorkingDrawingModal(js.workingDrawing, cleanTitle);
      }
    });
  }
}
