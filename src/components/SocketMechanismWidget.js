// Interactive Socket (Stop Kontak) Mechanism Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderSocketMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="socket-mech-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <!-- BAGIAN STOP KONTAK (Kiri, x=20..140) -->
        <rect x="20" y="30" width="115" height="140" rx="12" fill="#334155" stroke="#475569" stroke-width="2"/>
        <circle cx="77" cy="100" r="45" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>

        <!-- Klip Arde / Grounding PE (Atas & Bawah) -->
        <path id="socket-pe-top" d="M 72 55 L 72 65 L 82 65 L 82 55" stroke="#22c55e" stroke-width="3" fill="none" style="transition: stroke 0.2s;"/>
        <path id="socket-pe-bottom" d="M 72 145 L 72 135 L 82 135 L 82 145" stroke="#22c55e" stroke-width="3" fill="none" style="transition: stroke 0.2s;"/>
        <text x="35" y="62" fill="#22c55e" font-size="8" font-weight="bold">Arde PE</text>

        <!-- Lubang Kontak Fasa (L) di Kiri Dalam -->
        <circle id="socket-hole-l" cx="60" cy="100" r="6" fill="#0f172a" stroke="#ef4444" stroke-width="2" style="transition: all 0.2s;"/>
        <text x="43" y="103" fill="#ef4444" font-size="8" font-weight="bold">L</text>

        <!-- Lubang Kontak Netral (N) di Kanan Dalam -->
        <circle id="socket-hole-n" cx="95" cy="100" r="6" fill="#0f172a" stroke="#3b82f6" stroke-width="2" style="transition: all 0.2s;"/>
        <text x="110" y="103" fill="#3b82f6" font-size="8" font-weight="bold">N</text>

        <!-- BAGIAN STEKER / COLOKAN (Bergerak dari Kanan ke Kiri) -->
        <g id="socket-plug-group" style="transform: translateX(65px); transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);">
          <!-- Pin Pin Colokan Logam (Prongs) -->
          <rect id="plug-prong-l" x="140" y="97" width="28" height="6" rx="2" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
          <rect id="plug-prong-n" x="140" y="97" width="28" height="6" rx="2" fill="#facc15" stroke="#ca8a04" stroke-width="1" transform="translate(35, 0)"/>
          
          <!-- Plat Samping Arde pada Colokan -->
          <rect id="plug-ground-tab" x="160" y="70" width="8" height="60" rx="2" fill="#22c55e" opacity="0.8"/>

          <!-- Badan Steker (Plug Body) -->
          <rect x="168" y="60" width="45" height="80" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
          <rect x="213" y="92" width="22" height="16" rx="3" fill="#334155"/>
          <path d="M 235 100 Q 255 100 270 115" stroke="#94a3b8" stroke-width="5" fill="none" stroke-linecap="round"/>
          <text x="190" y="104" fill="#cbd5e1" font-size="8" text-anchor="middle">STEKER</text>
        </g>

        <!-- Status Indikator -->
        <text id="socket-status" x="140" y="188" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">STATUS: BELUM TERTANCAP</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-socket-toggle" class="btn-mcb-demo"><i class="bi bi-outlet" style="margin-right:4px;"></i>Masukkan Colokan</button>
      </div>

      <p id="socket-caption" class="mcb-widget-caption">
        Stop kontak terbuka. Di dalamnya terdapat klip penjepit Fasa (L), Netral (N), dan klip pelindung pembumian (Arde/PE).
      </p>
    </div>
  `;

  let isPlugged = false;
  const plug = document.getElementById('socket-plug-group');
  const holeL = document.getElementById('socket-hole-l');
  const holeN = document.getElementById('socket-hole-n');
  const peTop = document.getElementById('socket-pe-top');
  const peBottom = document.getElementById('socket-pe-bottom');
  const statusText = document.getElementById('socket-status');
  const caption = document.getElementById('socket-caption');
  const toggleBtn = document.getElementById('btn-socket-toggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playUIClick();
      isPlugged = !isPlugged;

      if (isPlugged) {
        // Colokan tertancap (geser ke kiri)
        if (plug) plug.style.transform = 'translateX(0px)';
        if (holeL) {
          holeL.setAttribute('fill', '#ef4444');
          holeL.setAttribute('stroke', '#fca5a5');
        }
        if (holeN) {
          holeN.setAttribute('fill', '#3b82f6');
          holeN.setAttribute('stroke', '#93c5fd');
        }
        if (peTop) peTop.setAttribute('stroke', '#4ade80');
        if (peBottom) peBottom.setAttribute('stroke', '#4ade80');
        if (statusText) {
          statusText.textContent = 'STATUS: TERSAMBUNG PENUH (AMAN)';
          statusText.setAttribute('fill', '#10b981');
        }
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-x-circle" style="margin-right:4px;"></i>Cabut Colokan';
        if (caption) {
          caption.textContent = 'Colokan terhubung penuh. Klip arde (PE) di bagian atas dan bawah menjepit plat steker bersamaan dengan pin fasa/netral. Hal ini memastikan badan logam alat aman dari sengatan kebocoran listrik.';
        }
      } else {
        // Colokan dicabut (geser ke kanan)
        if (plug) plug.style.transform = 'translateX(65px)';
        if (holeL) {
          holeL.setAttribute('fill', '#0f172a');
          holeL.setAttribute('stroke', '#ef4444');
        }
        if (holeN) {
          holeN.setAttribute('fill', '#0f172a');
          holeN.setAttribute('stroke', '#3b82f6');
        }
        if (peTop) peTop.setAttribute('stroke', '#22c55e');
        if (peBottom) peBottom.setAttribute('stroke', '#22c55e');
        if (statusText) {
          statusText.textContent = 'STATUS: BELUM TERTANCAP';
          statusText.setAttribute('fill', '#94a3b8');
        }
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-outlet" style="margin-right:4px;"></i>Masukkan Colokan';
        if (caption) {
          caption.textContent = 'Stop kontak terbuka. Di dalamnya terdapat klip penjepit Fasa (L), Netral (N), dan klip pelindung pembumian (Arde/PE).';
        }
      }
    });
  }
}
