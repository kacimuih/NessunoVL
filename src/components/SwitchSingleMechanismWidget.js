// Interactive Single Switch Mechanism Demonstration Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderSwitchSingleMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="switch-single-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <!-- Terminal Kiri (Fasa Masuk) -->
        <rect x="25" y="115" width="25" height="20" rx="3" fill="#94a3b8"/>
        <line x1="5" y1="125" x2="25" y2="125" stroke="#ef4444" stroke-width="3"/>
        <text x="37" y="148" fill="#94a3b8" font-size="8" text-anchor="middle">In</text>

        <!-- Terminal Kanan (Fasa Keluar) -->
        <rect x="230" y="115" width="25" height="20" rx="3" fill="#94a3b8"/>
        <line x1="255" y1="125" x2="275" y2="125" stroke="#ef4444" stroke-width="3"/>
        <text x="242" y="148" fill="#94a3b8" font-size="8" text-anchor="middle">Out</text>

        <!-- Titik Kontak Tetap di Kanan -->
        <circle cx="210" cy="125" r="5" fill="#facc15"/>
        <line x1="210" y1="125" x2="230" y2="125" stroke="#facc15" stroke-width="3"/>

        <!-- Poros Engsel Kontak Bergerak di Kiri -->
        <circle cx="70" cy="125" r="6" fill="#cbd5e1"/>
        <line x1="50" y1="125" x2="70" y2="125" stroke="#ef4444" stroke-width="3"/>

        <!-- Bilah Kontak Bergerak (Pivots at x=70, y=125) -->
        <g id="switch-blade-group" style="transform-origin: 70px 125px; transition: transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28); transform: rotate(-28deg);">
          <line x1="70" y1="125" x2="210" y2="125" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
          <circle cx="210" cy="125" r="4.5" fill="#facc15"/>
        </g>

        <!-- Tuas Rocker Pegas di Atas -->
        <g id="switch-rocker-group" style="transform-origin: 140px 45px; transition: transform 0.12s ease-out; transform: rotate(-15deg);">
          <rect x="115" y="30" width="50" height="30" rx="5" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
          <circle cx="140" cy="45" r="4" fill="#94a3b8"/>
        </g>
        <!-- Pegas Spiral Simbolik -->
        <path d="M 140 60 Q 135 70 140 80 Q 145 90 140 100" fill="none" stroke="#64748b" stroke-width="2"/>

        <!-- Percikan Busur Api / Spark di Titik Kontak (Tersembunyi) -->
        <g id="switch-spark" opacity="0" style="transform-origin: 210px 125px; transition: opacity 0.08s, transform 0.08s;">
          <circle cx="210" cy="125" r="10" fill="rgba(250, 204, 21, 0.5)"/>
          <path d="M 210 115 L 210 135 M 200 125 L 220 125 M 203 118 L 217 132 M 203 132 L 217 118" stroke="#ffffff" stroke-width="1.5"/>
        </g>

        <!-- Status Indikator -->
        <text id="switch-status-text" x="140" y="175" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">STATUS: TERPUTUS (OFF)</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-switch-toggle" class="btn-mcb-demo"><i class="bi bi-toggle2-off" style="margin-right:4px;"></i>Toggle Saklar (ON / OFF)</button>
      </div>

      <p id="switch-widget-caption" class="mcb-widget-caption">
        Saklar OFF -- kontak terbuka karena pegas pembalik menahan bilah kontak agar terpisah dari terminal output.
      </p>
    </div>
  `;

  let isOn = false;
  const blade = document.getElementById('switch-blade-group');
  const rocker = document.getElementById('switch-rocker-group');
  const spark = document.getElementById('switch-spark');
  const statusText = document.getElementById('switch-status-text');
  const caption = document.getElementById('switch-widget-caption');
  const toggleBtn = document.getElementById('btn-switch-toggle');

  let sparkTimer = null;

  function triggerSpark() {
    if (spark) {
      spark.style.opacity = '1';
      spark.style.transform = 'scale(1.2)';
      if (sparkTimer) clearTimeout(sparkTimer);
      sparkTimer = setTimeout(() => {
        spark.style.opacity = '0';
        spark.style.transform = 'scale(0.5)';
      }, 120);
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playUIClick();
      isOn = !isOn;

      triggerSpark();

      if (isOn) {
        if (blade) blade.style.transform = 'rotate(0deg)';
        if (rocker) rocker.style.transform = 'rotate(15deg)';
        if (statusText) {
          statusText.textContent = 'STATUS: TERSAMBUNG (ON)';
          statusText.setAttribute('fill', '#10b981');
        }
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-toggle2-on" style="margin-right:4px;"></i>Toggle Saklar (ON / OFF)';
        if (caption) {
          caption.textContent = 'Saklar ON -- kontak logam menyambung dan arus mengalir. Percikan kecil (spark) yang terlihat saat berpindah adalah normal pada saklar mekanis akibat pemutusan/penyambungan arus bertegangan.';
        }
      } else {
        if (blade) blade.style.transform = 'rotate(-28deg)';
        if (rocker) rocker.style.transform = 'rotate(-15deg)';
        if (statusText) {
          statusText.textContent = 'STATUS: TERPUTUS (OFF)';
          statusText.setAttribute('fill', '#94a3b8');
        }
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-toggle2-off" style="margin-right:4px;"></i>Toggle Saklar (ON / OFF)';
        if (caption) {
          caption.textContent = 'Saklar OFF -- kontak terbuka seketika berkat dorongan pegas pembalik cepat untuk memutus jalur arus dan meminimalkan busur api.';
        }
      }
    });
  }
}
