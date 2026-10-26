// Interactive Lamp Mechanism Demonstration Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderLampMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="lamp-mech-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <defs>
          <!-- Radial glow filter for incandescent filament / LED illumination -->
          <radialGradient id="lamp-bulb-glow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.85"/>
            <stop offset="45%" stop-color="#facc15" stop-opacity="0.45"/>
            <stop offset="85%" stop-color="#ca8a04" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Cahaya Pendar Bohlam (Hidden by default) -->
        <circle id="lamp-glow-aura" cx="140" cy="80" r="65" fill="url(#lamp-bulb-glow)" opacity="0" style="transition: opacity 0.5s ease-out;"/>

        <!-- Kubah Kaca Bohlam (Transparan) -->
        <path d="M 105 115 C 80 90 85 45 140 40 C 195 45 200 90 175 115 Z" fill="rgba(255,255,255,0.06)" stroke="#64748b" stroke-width="2"/>

        <!-- Ulir Logam (Fitting Base) & Kaki Kontak Bawah -->
        <rect x="120" y="125" width="40" height="22" rx="3" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="120" y1="131" x2="160" y2="131" stroke="#64748b" stroke-width="1.5"/>
        <line x1="120" y1="139" x2="160" y2="139" stroke="#64748b" stroke-width="1.5"/>
        <!-- Titik Kontak Tengah (Fasa L) -->
        <rect x="132" y="147" width="16" height="8" rx="2" fill="#ef4444"/>
        <text x="140" y="167" fill="#ef4444" font-size="8" font-weight="bold" text-anchor="middle">Terminal L</text>
        <!-- Ulir Luar (Netral N) -->
        <text x="185" y="138" fill="#3b82f6" font-size="8" font-weight="bold">Ulir (N)</text>

        <!-- Kawat Penyangga Filamen di Dalam Bohlam -->
        <path d="M 130 125 L 130 90 L 136 78" stroke="#94a3b8" stroke-width="2" fill="none"/>
        <path d="M 150 125 L 150 90 L 144 78" stroke="#94a3b8" stroke-width="2" fill="none"/>

        <!-- Kawat Filamen Pijar Tungsten (Coiled filament) -->
        <path id="lamp-filament" d="M 136 78 Q 140 70 144 78" stroke="#cbd5e1" stroke-width="3" fill="none" stroke-linecap="round" style="transition: stroke 0.4s, filter 0.4s;"/>

        <!-- Partikel Arus Elektron Bergerak (Titik kuning kecil) -->
        <g id="lamp-electrons" opacity="0" style="transition: opacity 0.3s;">
          <circle id="el-dot-1" cx="130" cy="115" r="2.5" fill="#facc15"/>
          <circle id="el-dot-2" cx="130" cy="95" r="2.5" fill="#facc15"/>
          <circle id="el-dot-3" cx="140" cy="74" r="3" fill="#ffffff"/>
          <circle id="el-dot-4" cx="150" cy="95" r="2.5" fill="#38bdf8"/>
          <circle id="el-dot-5" cx="150" cy="115" r="2.5" fill="#38bdf8"/>
        </g>

        <!-- Status Indikator -->
        <text id="lamp-status-text" x="140" y="188" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">STATUS: LAMPU PADAM (OFF)</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-lamp-toggle" class="btn-mcb-demo"><i class="bi bi-lightbulb-fill" style="margin-right:4px;"></i>Alirkan Listrik (Nyalakan)</button>
      </div>

      <p id="lamp-caption" class="mcb-widget-caption">
        Lampu padam -- sirkuit belum dialiri arus listrik.
      </p>
    </div>
  `;

  let isLit = false;
  const aura = document.getElementById('lamp-glow-aura');
  const filament = document.getElementById('lamp-filament');
  const electrons = document.getElementById('lamp-electrons');
  const statusText = document.getElementById('lamp-status-text');
  const caption = document.getElementById('lamp-caption');
  const toggleBtn = document.getElementById('btn-lamp-toggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playUIClick();
      isLit = !isLit;

      if (isLit) {
        if (aura) aura.style.opacity = '1';
        if (filament) {
          filament.setAttribute('stroke', '#ffea00');
          filament.style.filter = 'drop-shadow(0 0 6px #facc15)';
        }
        if (electrons) electrons.style.opacity = '1';
        if (statusText) {
          statusText.textContent = 'STATUS: LAMPU MENYALA (ON)';
          statusText.setAttribute('fill', '#10b981');
        }
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-lightbulb-off" style="margin-right:4px;"></i>Matikan Listrik';
        if (caption) {
          caption.textContent = 'Arus listrik dari kabel Fasa (L) masuk melalui kaki kontak tengah, melintasi filamen berhambatan tinggi hingga berpijar memancarkan cahaya, dan kembali lewat kabel Netral (N).';
        }
      } else {
        if (aura) aura.style.opacity = '0';
        if (filament) {
          filament.setAttribute('stroke', '#cbd5e1');
          filament.style.filter = 'none';
        }
        if (electrons) electrons.style.opacity = '0';
        if (statusText) {
          statusText.textContent = 'STATUS: LAMPU PADAM (OFF)';
          statusText.setAttribute('fill', '#94a3b8');
        }
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-lightbulb-fill" style="margin-right:4px;"></i>Alirkan Listrik (Nyalakan)';
        if (caption) {
          caption.textContent = 'Lampu padam -- sirkuit terputus, elektron berhenti mengalir, dan filamen mendingin.';
        }
      }
    });
  }
}
