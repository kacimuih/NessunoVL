// Interactive Double Switch (Saklar Seri) Mechanism Demonstration Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderSwitchDoubleMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="switch-double-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <!-- Terminal Input Bersama (Common In) di Kiri -->
        <rect x="15" y="85" width="25" height="30" rx="3" fill="#94a3b8"/>
        <line x1="0" y1="100" x2="15" y2="100" stroke="#ef4444" stroke-width="4"/>
        <text x="27" y="103" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">IN</text>

        <!-- Percabangan Input Tembaga (Busbar kecil) -->
        <path d="M 40 100 L 60 100 L 60 55 L 75 55 M 60 100 L 60 145 L 75 145" stroke="#ef4444" stroke-width="3" fill="none"/>

        <!-- JALUR 1 (ATAS) -->
        <!-- Poros Engsel 1 -->
        <circle cx="75" cy="55" r="5" fill="#cbd5e1"/>
        <!-- Bilah Kontak 1 -->
        <g id="sw-double-blade-1" style="transform-origin: 75px 55px; transition: transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28); transform: rotate(-25deg);">
          <line x1="75" y1="55" x2="195" y2="55" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="195" cy="55" r="4" fill="#facc15"/>
        </g>
        <!-- Kontak Tetap 1 -->
        <circle cx="195" cy="55" r="4.5" fill="#facc15"/>
        <line x1="195" y1="55" x2="235" y2="55" stroke="#facc15" stroke-width="3"/>
        <!-- Terminal Output 1 -->
        <rect x="235" y="45" width="25" height="20" rx="3" fill="#94a3b8"/>
        <line x1="260" y1="55" x2="280" y2="55" stroke="#ef4444" stroke-width="3"/>
        <text x="247" y="58" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">OUT 1</text>

        <!-- JALUR 2 (BAWAH) -->
        <!-- Poros Engsel 2 -->
        <circle cx="75" cy="145" r="5" fill="#cbd5e1"/>
        <!-- Bilah Kontak 2 -->
        <g id="sw-double-blade-2" style="transform-origin: 75px 145px; transition: transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28); transform: rotate(-25deg);">
          <line x1="75" y1="145" x2="195" y2="145" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="195" cy="145" r="4" fill="#facc15"/>
        </g>
        <!-- Kontak Tetap 2 -->
        <circle cx="195" cy="145" r="4.5" fill="#facc15"/>
        <line x1="195" y1="145" x2="235" y2="145" stroke="#facc15" stroke-width="3"/>
        <!-- Terminal Output 2 -->
        <rect x="235" y="135" width="25" height="20" rx="3" fill="#94a3b8"/>
        <line x1="260" y1="145" x2="280" y2="145" stroke="#ef4444" stroke-width="3"/>
        <text x="247" y="148" fill="#1e293b" font-size="8" font-weight="bold" text-anchor="middle">OUT 2</text>

        <!-- Status Indikator -->
        <text id="sw-double-status-1" x="140" y="30" fill="#94a3b8" font-size="10" font-weight="bold" text-anchor="middle">Kutub 1: OFF</text>
        <text id="sw-double-status-2" x="140" y="180" fill="#94a3b8" font-size="10" font-weight="bold" text-anchor="middle">Kutub 2: OFF</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-sw-double-1" class="btn-mcb-demo"><i class="bi bi-toggle2-off" style="margin-right:4px;"></i>Toggle Saklar 1</button>
        <button id="btn-sw-double-2" class="btn-mcb-demo"><i class="bi bi-toggle2-off" style="margin-right:4px;"></i>Toggle Saklar 2</button>
      </div>

      <p id="sw-double-caption" class="mcb-widget-caption">
        Kedua saklar dalam posisi OFF. Satu terminal input fasa dibagi ke dua mekanisme independen.
      </p>
    </div>
  `;

  let is1On = false;
  let is2On = false;

  const blade1 = document.getElementById('sw-double-blade-1');
  const blade2 = document.getElementById('sw-double-blade-2');
  const status1 = document.getElementById('sw-double-status-1');
  const status2 = document.getElementById('sw-double-status-2');
  const caption = document.getElementById('sw-double-caption');
  const btn1 = document.getElementById('btn-sw-double-1');
  const btn2 = document.getElementById('btn-sw-double-2');

  function updateDoubleCaption() {
    if (is1On && is2On) {
      caption.textContent = 'Kedua saklar ON -- Lampu 1 dan Lampu 2 menyala bersamaan melalui 1 kabel input fasa utama yang sama.';
    } else if (is1On && !is2On) {
      caption.textContent = 'Hanya Saklar 1 ON (Lampu 1 menyala). Saklar 2 tetap OFF tanpa terpengaruh, membuktikan kedua kutub bekerja mandiri.';
    } else if (!is1On && is2On) {
      caption.textContent = 'Hanya Saklar 2 ON (Lampu 2 menyala). Saklar 1 tetap OFF secara independen.';
    } else {
      caption.textContent = 'Kedua saklar OFF. Arus fasa berhenti di percabangan input dan tidak mengalir ke beban manapun.';
    }
  }

  if (btn1) {
    btn1.addEventListener('click', () => {
      playUIClick();
      is1On = !is1On;
      if (blade1) blade1.style.transform = is1On ? 'rotate(0deg)' : 'rotate(-25deg)';
      if (status1) {
        status1.textContent = is1On ? 'Kutub 1: ON' : 'Kutub 1: OFF';
        status1.setAttribute('fill', is1On ? '#10b981' : '#94a3b8');
      }
      if (btn1) btn1.innerHTML = `<i class="bi ${is1On ? 'bi-toggle2-on' : 'bi-toggle2-off'}" style="margin-right:4px;"></i>Toggle Saklar 1`;
      updateDoubleCaption();
    });
  }

  if (btn2) {
    btn2.addEventListener('click', () => {
      playUIClick();
      is2On = !is2On;
      if (blade2) blade2.style.transform = is2On ? 'rotate(0deg)' : 'rotate(-25deg)';
      if (status2) {
        status2.textContent = is2On ? 'Kutub 2: ON' : 'Kutub 2: OFF';
        status2.setAttribute('fill', is2On ? '#10b981' : '#94a3b8');
      }
      if (btn2) btn2.innerHTML = `<i class="bi ${is2On ? 'bi-toggle2-on' : 'bi-toggle2-off'}" style="margin-right:4px;"></i>Toggle Saklar 2`;
      updateDoubleCaption();
    });
  }
}
