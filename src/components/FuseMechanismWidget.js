// Interactive Fuse (Sekring) Mechanism Demonstration Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderFuseMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="fuse-mech-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <!-- Terminal Kiri -->
        <rect x="15" y="90" width="30" height="20" rx="3" fill="#94a3b8"/>
        <line x1="0" y1="100" x2="15" y2="100" stroke="#ef4444" stroke-width="4"/>
        
        <!-- Terminal Kanan -->
        <rect x="235" y="90" width="30" height="20" rx="3" fill="#94a3b8"/>
        <line x1="265" y1="100" x2="280" y2="100" stroke="#ef4444" stroke-width="4"/>

        <!-- Bodi Tabung Kaca Sekring (Transparan) -->
        <rect x="45" y="70" width="190" height="60" rx="8" fill="rgba(255,255,255,0.06)" stroke="#64748b" stroke-width="2"/>
        <rect x="45" y="70" width="190" height="15" fill="rgba(255,255,255,0.12)"/> <!-- Pantulan cahaya tabung -->

        <!-- Tutup Logam Kuningan di Ujung Tabung -->
        <rect x="45" y="68" width="22" height="64" rx="4" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        <rect x="213" y="68" width="22" height="64" rx="4" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>

        <!-- Pasir Peredam (Simbolik Partikel) -->
        <g opacity="0.3">
          <circle cx="85" cy="115" r="2" fill="#cbd5e1"/>
          <circle cx="115" cy="118" r="1.5" fill="#cbd5e1"/>
          <circle cx="165" cy="116" r="2" fill="#cbd5e1"/>
          <circle cx="195" cy="114" r="1.5" fill="#cbd5e1"/>
        </g>

        <!-- Kawat Lebur Kiri & Kanan (Normal Menyatu di Tengah) -->
        <path id="fuse-wire-left" d="M 67 100 Q 100 102 138 100" stroke="#facc15" stroke-width="2.5" fill="none" style="transition: stroke 0.4s, opacity 0.2s;"/>
        <path id="fuse-wire-right" d="M 142 100 Q 180 98 213 100" stroke="#facc15" stroke-width="2.5" fill="none" style="transition: stroke 0.4s, opacity 0.2s;"/>
        
        <!-- Titik Lebur Tengah -->
        <circle id="fuse-melt-point" cx="140" cy="100" r="3" fill="#facc15" style="transition: transform 0.2s, fill 0.3s;"/>

        <!-- Kilatan Api / Percikan saat Putus (Hidden by default) -->
        <g id="fuse-spark" opacity="0" style="transform-origin: 140px 100px; transition: opacity 0.15s, transform 0.25s;">
          <circle cx="140" cy="100" r="14" fill="rgba(239, 68, 68, 0.5)"/>
          <path d="M 140 85 L 140 115 M 125 100 L 155 100 M 130 90 L 150 110 M 130 110 L 150 90" stroke="#fef08a" stroke-width="2"/>
        </g>

        <!-- Status Indikator -->
        <text id="fuse-status-text" x="140" y="175" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">STATUS: UTUH (NORMAL)</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-fuse-overload" class="btn-mcb-demo"><i class="bi bi-lightning-fill" style="margin-right:4px;"></i>Simulasikan Arus Berlebih</button>
        <button id="btn-fuse-reset" class="btn-mcb-demo btn-mcb-demo-secondary"><i class="bi bi-arrow-repeat" style="margin-right:4px;"></i>Ganti Sekring Baru</button>
      </div>

      <p id="fuse-widget-caption" class="mcb-widget-caption">
        Sekring dalam kondisi normal (UTUH) -- kawat lebur menghantarkan arus listrik dengan aman.
      </p>
    </div>
  `;

  const wireL = document.getElementById('fuse-wire-left');
  const wireR = document.getElementById('fuse-wire-right');
  const meltPoint = document.getElementById('fuse-melt-point');
  const spark = document.getElementById('fuse-spark');
  const statusText = document.getElementById('fuse-status-text');
  const caption = document.getElementById('fuse-widget-caption');

  let timer1 = null;
  let timer2 = null;
  let timer3 = null;

  function clearTimers() {
    if (timer1) clearTimeout(timer1);
    if (timer2) clearTimeout(timer2);
    if (timer3) clearTimeout(timer3);
  }

  function resetFuse() {
    clearTimers();
    if (wireL) {
      wireL.setAttribute('stroke', '#facc15');
      wireL.setAttribute('d', 'M 67 100 Q 100 102 138 100');
      wireL.style.opacity = '1';
    }
    if (wireR) {
      wireR.setAttribute('stroke', '#facc15');
      wireR.setAttribute('d', 'M 142 100 Q 180 98 213 100');
      wireR.style.opacity = '1';
    }
    if (meltPoint) {
      meltPoint.setAttribute('fill', '#facc15');
      meltPoint.style.transform = 'scale(1)';
      meltPoint.style.opacity = '1';
    }
    if (spark) {
      spark.style.opacity = '0';
      spark.style.transform = 'scale(0.5)';
    }
    if (statusText) {
      statusText.textContent = 'STATUS: UTUH (NORMAL)';
      statusText.setAttribute('fill', '#10b981');
    }
    if (caption) {
      caption.textContent = 'Sekring baru terpasang (UTUH) -- kawat lebur siap mengalirkan arus normal.';
    }
  }

  function blowFuse() {
    if (spark) {
      spark.style.opacity = '1';
      spark.style.transform = 'scale(1.2)';
    }
    if (meltPoint) meltPoint.style.opacity = '0';
    if (wireL) {
      wireL.setAttribute('d', 'M 67 100 Q 95 102 120 105');
      wireL.setAttribute('stroke', '#94a3b8');
    }
    if (wireR) {
      wireR.setAttribute('d', 'M 160 95 Q 185 98 213 100');
      wireR.setAttribute('stroke', '#94a3b8');
    }
    if (statusText) {
      statusText.textContent = 'STATUS: PUTUS (BLOWN)';
      statusText.setAttribute('fill', '#ef4444');
    }
  }

  const btnOverload = document.getElementById('btn-fuse-overload');
  if (btnOverload) {
    btnOverload.addEventListener('click', () => {
      playUIClick();
      resetFuse();
      if (caption) caption.textContent = 'Arus berlebih mengalir -- kawat lebur memanas hebat (memijar merah)...';
      
      // Tahap 1: Memanas (kawat berubah merah terang)
      timer1 = setTimeout(() => {
        if (wireL) wireL.setAttribute('stroke', '#ef4444');
        if (wireR) wireR.setAttribute('stroke', '#ef4444');
        if (meltPoint) meltPoint.setAttribute('fill', '#ff0000');
      }, 300);

      // Tahap 2: Meleleh & Putus dengan kilatan
      timer2 = setTimeout(() => {
        blowFuse();
      }, 1100);

      // Tahap 3: Kilatan padam, tersisa celah putus & caption edukasi
      timer3 = setTimeout(() => {
        if (spark) spark.style.opacity = '0';
        if (caption) {
          caption.textContent = 'Elemen kawat meleleh dan putus karena arus melebihi kapasitas. Berbeda dari MCB, sekring yang sudah putus TIDAK BISA direset -- harus diganti fisik dengan yang baru.';
        }
      }, 1500);
    });
  }

  const btnReset = document.getElementById('btn-fuse-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      playUIClick();
      resetFuse();
    });
  }
}
