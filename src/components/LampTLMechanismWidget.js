// Interactive Fluorescent Tube (Lampu TL) Mechanism Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderLampTLMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="lamptl-mech-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <defs>
          <linearGradient id="tl-tube-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="50%" stop-color="#e0f2fe" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95"/>
          </linearGradient>
        </defs>

        <!-- TABUNG LAMPU TL (Horizontal di Atas, y=40..70) -->
        <!-- Pendaran Luar Tabung (Saat Nyala Penuh) -->
        <rect id="tl-tube-halo" x="25" y="35" width="230" height="40" rx="10" fill="#bae6fd" opacity="0" filter="blur(4px)" style="transition: opacity 0.5s;"/>

        <!-- Tabung Kaca Dasar -->
        <rect id="tl-tube-body" x="30" y="40" width="220" height="30" rx="8" fill="#334155" stroke="#64748b" stroke-width="2" style="transition: fill 0.4s;"/>

        <!-- Tutup Ujung Logam Kiri & Kanan (End Caps) -->
        <rect x="25" y="42" width="10" height="26" rx="2" fill="#94a3b8"/>
        <rect x="245" y="42" width="10" height="26" rx="2" fill="#94a3b8"/>

        <!-- Filamen Elektroda Kiri & Kanan di Dalam Tabung -->
        <path id="tl-filament-left" d="M 40 48 Q 45 55 40 62" stroke="#64748b" stroke-width="2.5" fill="none" style="transition: stroke 0.3s, filter 0.3s;"/>
        <path id="tl-filament-right" d="M 240 48 Q 235 55 240 62" stroke="#64748b" stroke-width="2.5" fill="none" style="transition: stroke 0.3s, filter 0.3s;"/>

        <!-- Lonjakan Kilatan Listrik / Percikan High Voltage (Tahap 2) -->
        <g id="tl-flash-kick" opacity="0" style="transition: opacity 0.1s;">
          <circle cx="50" cy="55" r="12" fill="rgba(250, 204, 21, 0.7)"/>
          <circle cx="230" cy="55" r="12" fill="rgba(250, 204, 21, 0.7)"/>
          <line x1="40" y1="55" x2="240" y2="55" stroke="#fef08a" stroke-width="2" stroke-dasharray="8,4"/>
        </g>

        <!-- KOMPONEN BAWAH: BALLAST & STARTER -->
        <!-- Ballast (Trafo/Choke di Bawah Kiri) -->
        <rect x="35" y="105" width="85" height="45" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
        <!-- Lilitan Kumparan Simbolik -->
        <path d="M 48 128 C 48 118 60 118 60 128 C 60 118 72 118 72 128 C 72 118 84 118 84 128 C 84 118 96 118 96 128 C 96 118 108 118 108 128" stroke="#3b82f6" stroke-width="2" fill="none"/>
        <text x="77" y="142" fill="#93c5fd" font-size="8" font-weight="bold" text-anchor="middle">BALLAST</text>

        <!-- Starter (Silinder Kecil di Bawah Kanan) -->
        <rect x="175" y="105" width="40" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <circle id="starter-glow-indicator" cx="195" cy="122" r="6" fill="#64748b" style="transition: fill 0.3s, filter 0.3s;"/>
        <text x="195" y="142" fill="#fde68a" font-size="8" font-weight="bold" text-anchor="middle">STARTER</text>

        <!-- Kabel Pengawatan Sirkuit Seri -->
        <path d="M 15 125 L 35 125" stroke="#ef4444" stroke-width="2"/> <!-- Fasa Masuk ke Ballast -->
        <path d="M 120 125 L 140 125 L 140 55 L 25 55" stroke="#ef4444" stroke-width="1.5" fill="none"/> <!-- Ballast ke Filamen Kiri -->
        <path d="M 35 55 L 35 90 L 175 118" stroke="#f59e0b" stroke-width="1.5" fill="none"/> <!-- Filamen Kiri ke Starter -->
        <path d="M 215 118 L 245 90 L 245 55" stroke="#f59e0b" stroke-width="1.5" fill="none"/> <!-- Starter ke Filamen Kanan -->
        <path d="M 255 55 L 275 55 L 275 125" stroke="#3b82f6" stroke-width="2" fill="none"/> <!-- Filamen Kanan ke Netral Keluar -->

        <!-- Status Indikator -->
        <text id="tl-status-text" x="140" y="185" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">STATUS: LAMPU PADAM</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-tl-ignite" class="btn-mcb-demo"><i class="bi bi-play-circle-fill" style="margin-right:4px;"></i>Nyalakan Lampu TL (3 Tahap)</button>
        <button id="btn-tl-reset" class="btn-mcb-demo btn-mcb-demo-secondary"><i class="bi bi-arrow-counterclockwise" style="margin-right:4px;"></i>Reset</button>
      </div>

      <p id="tl-caption" class="mcb-widget-caption">
        Lampu TL padam. Membutuhkan kerja sama Starter dan Ballast untuk memulai proses penyalaan gas.
      </p>
    </div>
  `;

  const halo = document.getElementById('tl-tube-halo');
  const tubeBody = document.getElementById('tl-tube-body');
  const filL = document.getElementById('tl-filament-left');
  const filR = document.getElementById('tl-filament-right');
  const flash = document.getElementById('tl-flash-kick');
  const starterGlow = document.getElementById('starter-glow-indicator');
  const statusText = document.getElementById('tl-status-text');
  const caption = document.getElementById('tl-caption');

  let t1 = null;
  let t2 = null;
  let t3 = null;

  function clearTimers() {
    if (t1) clearTimeout(t1);
    if (t2) clearTimeout(t2);
    if (t3) clearTimeout(t3);
  }

  function resetTL() {
    clearTimers();
    if (halo) halo.style.opacity = '0';
    if (tubeBody) tubeBody.setAttribute('fill', '#334155');
    if (filL) {
      filL.setAttribute('stroke', '#64748b');
      filL.style.filter = 'none';
    }
    if (filR) {
      filR.setAttribute('stroke', '#64748b');
      filR.style.filter = 'none';
    }
    if (flash) flash.style.opacity = '0';
    if (starterGlow) {
      starterGlow.setAttribute('fill', '#64748b');
      starterGlow.style.filter = 'none';
    }
    if (statusText) {
      statusText.textContent = 'STATUS: LAMPU PADAM';
      statusText.setAttribute('fill', '#94a3b8');
    }
    if (caption) {
      caption.textContent = 'Lampu TL padam. Membutuhkan kerja sama Starter dan Ballast untuk memulai proses penyalaan gas.';
    }
  }

  const btnIgnite = document.getElementById('btn-tl-ignite');
  const btnReset = document.getElementById('btn-tl-reset');

  if (btnIgnite) {
    btnIgnite.addEventListener('click', () => {
      playUIClick();
      resetTL();

      // TAHAP 1: Pemanasan Filamen via Starter (t = 0.2s)
      t1 = setTimeout(() => {
        if (starterGlow) {
          starterGlow.setAttribute('fill', '#f97316');
          starterGlow.style.filter = 'drop-shadow(0 0 4px #f97316)';
        }
        if (filL) {
          filL.setAttribute('stroke', '#f97316');
          filL.style.filter = 'drop-shadow(0 0 5px #f97316)';
        }
        if (filR) {
          filR.setAttribute('stroke', '#f97316');
          filR.style.filter = 'drop-shadow(0 0 5px #f97316)';
        }
        if (statusText) {
          statusText.textContent = 'TAHAP 1: PEMANASAN ELEKTRODA...';
          statusText.setAttribute('fill', '#f59e0b');
        }
        if (caption) {
          caption.textContent = 'Tahap 1: Saklar bimetal starter menutup, mengalirkan arus pemanas ke kedua elektroda tungsten di ujung tabung hingga berpijar oranye.';
        }
      }, 200);

      // TAHAP 2: Starter Terputus & Ballast Memberi High-Voltage Kick (t = 1.4s)
      t2 = setTimeout(() => {
        if (starterGlow) {
          starterGlow.setAttribute('fill', '#64748b');
          starterGlow.style.filter = 'none';
        }
        if (flash) flash.style.opacity = '1';
        if (statusText) {
          statusText.textContent = 'TAHAP 2: LONJAKAN TEGANGAN BALLAST...';
          statusText.setAttribute('fill', '#38bdf8');
        }
        if (caption) {
          caption.textContent = 'Tahap 2: Bimetal starter mendingin dan terputus seketika. Kumparan ballast merespons dengan melepaskan lonjakan tegangan induksi kejut (~1000V).';
        }
      }, 1400);

      // TAHAP 3: Gas Terionisasi & Tabung Menyala Penuh (t = 1.9s)
      t3 = setTimeout(() => {
        if (flash) flash.style.opacity = '0';
        if (tubeBody) tubeBody.setAttribute('fill', 'url(#tl-tube-glow)');
        if (halo) halo.style.opacity = '0.9';
        if (filL) {
          filL.setAttribute('stroke', '#fef08a');
          filL.style.filter = 'none';
        }
        if (filR) {
          filR.setAttribute('stroke', '#fef08a');
          filR.style.filter = 'none';
        }
        if (statusText) {
          statusText.textContent = 'STATUS: MENYALA PENUH (IONISASI SUKSES)';
          statusText.setAttribute('fill', '#10b981');
        }
        if (caption) {
          caption.textContent = 'Tahap 3: Tegangan tinggi memicu ionisasi gas argon & uap merkuri. Elektron bertumbukan memancarkan sinar UV yang membuat lapisan fosfor tabung berpendar putih terang penuh.';
        }
      }, 1900);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      playUIClick();
      resetTL();
    });
  }
}
