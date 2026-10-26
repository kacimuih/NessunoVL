// Interactive 3-Way Switch (Saklar Tukar / Hotel) Mechanism Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderSwitchWay3MechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="switch-way3-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <!-- Terminal Common (COM / Pin 0) di Kiri -->
        <rect x="20" y="90" width="30" height="20" rx="3" fill="#94a3b8"/>
        <line x1="0" y1="100" x2="20" y2="100" stroke="#ef4444" stroke-width="4"/>
        <text x="35" y="103" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">COM</text>

        <!-- Engsel Poros Bilah Pemilih (SPDT Pivot) -->
        <circle cx="60" cy="100" r="6" fill="#cbd5e1"/>
        <line x1="50" y1="100" x2="60" y2="100" stroke="#ef4444" stroke-width="3"/>

        <!-- Bilah Penghubung SPDT (Bisa mengarah ke L1 di atas atau L2 di bawah) -->
        <!-- Default: Menyentuh L1 di atas (rotate -20deg) -->
        <g id="sw-way3-blade-group" style="transform-origin: 60px 100px; transition: transform 0.14s ease-out; transform: rotate(-20deg);">
          <line x1="60" y1="100" x2="205" y2="100" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
          <circle cx="205" cy="100" r="5" fill="#facc15"/>
        </g>

        <!-- Terminal Cabang L1 (Atas) -->
        <circle cx="205" cy="50" r="5" fill="#facc15"/>
        <line x1="205" y1="50" x2="230" y2="50" stroke="#facc15" stroke-width="3"/>
        <rect x="230" y="40" width="30" height="20" rx="3" fill="#94a3b8"/>
        <line x1="260" y1="50" x2="280" y2="50" stroke="#facc15" stroke-width="3"/>
        <text x="245" y="53" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">L1</text>

        <!-- Terminal Cabang L2 (Bawah) -->
        <circle cx="205" cy="150" r="5" fill="#facc15"/>
        <line x1="205" y1="150" x2="230" y2="150" stroke="#facc15" stroke-width="3"/>
        <rect x="230" y="140" width="30" height="20" rx="3" fill="#94a3b8"/>
        <line x1="260" y1="150" x2="280" y2="150" stroke="#facc15" stroke-width="3"/>
        <text x="245" y="153" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">L2</text>

        <!-- Garis Bantu Break-Before-Make di Tengah -->
        <line x1="190" y1="100" x2="215" y2="100" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>

        <!-- Status Indikator -->
        <text id="sw-way3-status" x="140" y="188" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">POSISI: COM &rarr; L1</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-sw-way3-toggle" class="btn-mcb-demo"><i class="bi bi-arrow-left-right" style="margin-right:4px;"></i>Toggle Posisi (Pindah Jalur)</button>
      </div>

      <p id="sw-way3-caption" class="mcb-widget-caption">
        Posisi saat ini: COM terhubung ke L1. Arus mengalir melalui cabang jalur 1.
      </p>
    </div>
  `;

  let currentTarget = 'L1'; // 'L1' or 'L2'
  const blade = document.getElementById('sw-way3-blade-group');
  const statusText = document.getElementById('sw-way3-status');
  const caption = document.getElementById('sw-way3-caption');
  const toggleBtn = document.getElementById('btn-sw-way3-toggle');

  let midTimer = null;
  let finalTimer = null;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playUIClick();
      if (midTimer) clearTimeout(midTimer);
      if (finalTimer) clearTimeout(finalTimer);

      const nextTarget = currentTarget === 'L1' ? 'L2' : 'L1';

      // Tahap 1: "Break Before Make" -- Jeda di tengah (rotate 0deg, tidak menyentuh keduanya)
      if (blade) blade.style.transform = 'rotate(0deg)';
      if (statusText) {
        statusText.textContent = 'TRANSISI: MEMUTUS (BREAK)...';
        statusText.setAttribute('fill', '#f59e0b');
      }
      if (caption) {
        caption.textContent = 'Mekanisme "Break Before Make" -- kontak terputus sekejap di tengah tanpa menyentuh L1 maupun L2 untuk mencegah percikan silang.';
      }

      // Tahap 2: Sambungkan ke target baru setelah 160ms
      finalTimer = setTimeout(() => {
        currentTarget = nextTarget;
        if (blade) {
          blade.style.transform = currentTarget === 'L1' ? 'rotate(-20deg)' : 'rotate(20deg)';
        }
        if (statusText) {
          statusText.innerHTML = `POSISI: COM &rarr; ${currentTarget}`;
          statusText.setAttribute('fill', '#10b981');
        }
        if (caption) {
          caption.textContent = `Posisi sekarang: COM terhubung ke ${currentTarget}. Untuk rangkaian saklar hotel (tangga/lorong), 2 unit saklar tukar WAJIB dipasang berpasangan dengan terminal L1-L1 dan L2-L2 saling terhubung.`;
        }
      }, 160);
    });
  }
}
