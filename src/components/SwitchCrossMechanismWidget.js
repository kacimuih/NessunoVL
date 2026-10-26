// Interactive Cross Switch (Saklar Silang) Mechanism Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderSwitchCrossMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="switch-cross-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <!-- Terminal Input 1 & 2 di Kiri -->
        <rect x="20" y="50" width="28" height="20" rx="3" fill="#94a3b8"/>
        <line x1="0" y1="60" x2="20" y2="60" stroke="#facc15" stroke-width="3"/>
        <text x="34" y="63" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">IN 1</text>

        <rect x="20" y="130" width="28" height="20" rx="3" fill="#94a3b8"/>
        <line x1="0" y1="140" x2="20" y2="140" stroke="#facc15" stroke-width="3"/>
        <text x="34" y="143" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">IN 2</text>

        <!-- Terminal Output 1 & 2 di Kanan -->
        <rect x="232" y="50" width="28" height="20" rx="3" fill="#94a3b8"/>
        <line x1="260" y1="60" x2="280" y2="60" stroke="#facc15" stroke-width="3"/>
        <text x="246" y="63" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">OUT 1</text>

        <rect x="232" y="130" width="28" height="20" rx="3" fill="#94a3b8"/>
        <line x1="260" y1="140" x2="280" y2="140" stroke="#facc15" stroke-width="3"/>
        <text x="246" y="143" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">OUT 2</text>

        <!-- Titik Kontak Tetap Internal -->
        <circle cx="65" cy="60" r="5" fill="#facc15"/>
        <circle cx="65" cy="140" r="5" fill="#facc15"/>
        <circle cx="215" cy="60" r="5" fill="#facc15"/>
        <circle cx="215" cy="140" r="5" fill="#facc15"/>

        <!-- Jalur Penghubung Bergerak (Group yang Berputar / Beralih) -->
        <g id="sw-cross-lines-group">
          <!-- Jalur Atas A -->
          <line id="cross-line-1" x1="65" y1="60" x2="215" y2="60" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" style="transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"/>
          <!-- Jalur Bawah B -->
          <line id="cross-line-2" x1="65" y1="140" x2="215" y2="140" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" style="transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"/>
        </g>

        <!-- Jembatan Isolator Tengah (Bila Menyilang) -->
        <circle id="cross-bridge" cx="140" cy="100" r="7" fill="#1e293b" stroke="#64748b" stroke-width="1.5" opacity="0" style="transition: opacity 0.25s;"/>

        <!-- Status Indikator -->
        <text id="sw-cross-status" x="140" y="185" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">POSISI: LURUS (PARALEL)</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-sw-cross-toggle" class="btn-mcb-demo"><i class="bi bi-x-diamond-fill" style="margin-right:4px;"></i>Toggle Lurus / Silang</button>
      </div>

      <p id="sw-cross-caption" class="mcb-widget-caption">
        Posisi Lurus: Jalur In 1 terhubung ke Out 1, dan In 2 terhubung ke Out 2 secara sejajar.
      </p>
    </div>
  `;

  let isCrossed = false;
  const line1 = document.getElementById('cross-line-1');
  const line2 = document.getElementById('cross-line-2');
  const bridge = document.getElementById('cross-bridge');
  const statusText = document.getElementById('sw-cross-status');
  const caption = document.getElementById('sw-cross-caption');
  const toggleBtn = document.getElementById('btn-sw-cross-toggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playUIClick();
      isCrossed = !isCrossed;

      if (isCrossed) {
        // Mode Silang: In 1 (y=60) -> Out 2 (y=140), In 2 (y=140) -> Out 1 (y=60)
        if (line1) {
          line1.setAttribute('y2', '140');
        }
        if (line2) {
          line2.setAttribute('y2', '60');
        }
        if (bridge) bridge.style.opacity = '1';
        if (statusText) {
          statusText.textContent = 'POSISI: MENYILANG (CROSS)';
          statusText.setAttribute('fill', '#f59e0b');
        }
        if (caption) {
          caption.textContent = 'Posisi Menyilang: In 1 dialihkan ke Out 2, dan In 2 dialihkan ke Out 1. Saklar silang dipasang di ANTARA dua unit Saklar Tukar untuk memungkinkan kontrol 1 lampu dari 3 lokasi atau lebih.';
        }
      } else {
        // Mode Lurus: In 1 (y=60) -> Out 1 (y=60), In 2 (y=140) -> Out 2 (y=140)
        if (line1) {
          line1.setAttribute('y2', '60');
        }
        if (line2) {
          line2.setAttribute('y2', '140');
        }
        if (bridge) bridge.style.opacity = '0';
        if (statusText) {
          statusText.textContent = 'POSISI: LURUS (PARALEL)';
          statusText.setAttribute('fill', '#10b981');
        }
        if (caption) {
          caption.textContent = 'Posisi Lurus: Jalur In 1 terhubung ke Out 1, dan In 2 terhubung ke Out 2 secara sejajar.';
        }
      }
    });
  }
}
