// Interactive Fitting Mechanism & K3LH Safety Demonstration Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderFittingMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="mcb-widget">
      <svg id="fitting-mech-svg" viewBox="0 0 280 200" style="width:100%; max-width:360px; margin:0 auto; display:block; background:#1e293b; border-radius:10px;">
        <defs>
          <radialGradient id="fitting-lamp-glow" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#facc15" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Cahaya Pendar Bohlam -->
        <circle id="fitting-glow" cx="140" cy="50" r="45" fill="url(#fitting-lamp-glow)" opacity="0" style="transition: opacity 0.4s;"/>

        <!-- Bohlam Lampu (Terpasang di Fitting) -->
        <path d="M 115 75 C 95 55 100 20 140 18 C 180 20 185 55 165 75 Z" fill="rgba(255,255,255,0.08)" stroke="#64748b" stroke-width="1.5"/>

        <!-- BODI FITTING (Potongan Membujur / Cross Section) -->
        <rect x="75" y="85" width="130" height="75" rx="8" fill="#334155" stroke="#475569" stroke-width="2"/>
        <text x="82" y="100" fill="#94a3b8" font-size="7.5" font-weight="bold">Bodi Porselen</text>

        <!-- SELONGSONG ULIR LUAR (Threaded Shell) -->
        <rect id="fitting-outer-shell" x="110" y="75" width="60" height="40" rx="3" fill="#64748b" stroke="#94a3b8" stroke-width="2" style="transition: all 0.3s;"/>
        <line x1="110" y1="85" x2="170" y2="85" stroke="#475569" stroke-width="1.5"/>
        <line x1="110" y1="95" x2="170" y2="95" stroke="#475569" stroke-width="1.5"/>
        <line x1="110" y1="105" x2="170" y2="105" stroke="#475569" stroke-width="1.5"/>

        <!-- LIDAH KONTAK TENGAH (Center Tongue Contact) -->
        <path id="fitting-center-tongue" d="M 130 135 L 140 115 L 150 135" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round" style="transition: all 0.3s;"/>
        <circle id="fitting-tongue-tip" cx="140" cy="115" r="3.5" fill="#facc15" style="transition: all 0.3s;"/>

        <!-- KABEL KIRI & KANAN -->
        <!-- Terminal 1 (Kiri) ke Ulir -->
        <path id="wire-shell-lead" d="M 40 100 L 110 100" stroke="#3b82f6" stroke-width="3" fill="none" style="transition: stroke 0.3s;"/>
        <circle cx="40" cy="100" r="4" fill="#3b82f6" id="wire-shell-tag"/>
        <text id="label-wire-left" x="35" y="120" fill="#3b82f6" font-size="9" font-weight="bold" text-anchor="middle">Netral (N)</text>

        <!-- Terminal 2 (Kanan) ke Lidah Tengah -->
        <path id="wire-tongue-lead" d="M 240 145 L 140 145 L 140 130" stroke="#ef4444" stroke-width="3" fill="none" style="transition: stroke 0.3s;"/>
        <circle cx="240" cy="145" r="4" fill="#ef4444" id="wire-tongue-tag"/>
        <text id="label-wire-right" x="245" y="165" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">Fasa (L)</text>

        <!-- Peringatan Bahaya Tangan Menyentuh Ulir (Blinking Badge saat Salah) -->
        <g id="fitting-hazard-badge" opacity="0" style="transition: opacity 0.3s;">
          <circle cx="185" cy="85" r="14" fill="#ef4444" style="animation: badgeBounce 1s infinite;"/>
          <text x="185" y="90" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">!</text>
          <text x="210" y="80" fill="#f87171" font-size="8.5" font-weight="bold">ULIR BERTEGANGAN!</text>
        </g>

        <!-- Status Indikator -->
        <text id="fitting-status-text" x="140" y="185" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">PILIH POLARITAS PEMASANGAN</text>
      </svg>

      <div class="mcb-widget-controls" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px;">
        <button id="btn-fitting-correct" class="btn-mcb-demo" style="background:#10b981; color:#ffffff;"><i class="bi bi-shield-check" style="margin-right:4px;"></i>Pasang Benar (Fasa ke Lidah)</button>
        <button id="btn-fitting-reversed" class="btn-mcb-demo" style="background:#ef4444; color:#ffffff;"><i class="bi bi-exclamation-triangle-fill" style="margin-right:4px;"></i>Pasang TERBALIK (Fasa ke Ulir)</button>
      </div>

      <p id="fitting-caption" class="mcb-widget-caption">
        Pilih opsi di atas untuk mengamati perbedaan keselamatan saat memasang kabel polaritas pada fitting lampu.
      </p>
    </div>
  `;

  const glow = document.getElementById('fitting-glow');
  const outerShell = document.getElementById('fitting-outer-shell');
  const centerTongue = document.getElementById('fitting-center-tongue');
  const tongueTip = document.getElementById('fitting-tongue-tip');
  const wireShell = document.getElementById('wire-shell-lead');
  const wireTongue = document.getElementById('wire-tongue-lead');
  const tagShell = document.getElementById('wire-shell-tag');
  const tagTongue = document.getElementById('wire-tongue-tag');
  const labelL = document.getElementById('label-wire-left');
  const labelR = document.getElementById('label-wire-right');
  const hazardBadge = document.getElementById('fitting-hazard-badge');
  const statusText = document.getElementById('fitting-status-text');
  const caption = document.getElementById('fitting-caption');

  const btnCorrect = document.getElementById('btn-fitting-correct');
  const btnReversed = document.getElementById('btn-fitting-reversed');

  if (btnCorrect) {
    btnCorrect.addEventListener('click', () => {
      playUIClick();
      if (glow) glow.style.opacity = '1';
      if (hazardBadge) hazardBadge.style.opacity = '0';

      // Warna kabel benar: Kiri Netral (#3b82f6), Kanan Fasa (#ef4444)
      if (wireShell) wireShell.setAttribute('stroke', '#3b82f6');
      if (tagShell) tagShell.setAttribute('fill', '#3b82f6');
      if (labelL) {
        labelL.textContent = 'Netral (N)';
        labelL.setAttribute('fill', '#3b82f6');
      }

      if (wireTongue) wireTongue.setAttribute('stroke', '#ef4444');
      if (tagTongue) tagTongue.setAttribute('fill', '#ef4444');
      if (labelR) {
        labelR.textContent = 'Fasa (L)';
        labelR.setAttribute('fill', '#ef4444');
      }

      // Ulir aman (abu-abu/biru netral)
      if (outerShell) {
        outerShell.setAttribute('fill', '#64748b');
        outerShell.setAttribute('stroke', '#94a3b8');
      }
      // Lidah tengah bertegangan (fasa merah/emas)
      if (centerTongue) centerTongue.setAttribute('stroke', '#ef4444');
      if (tongueTip) tongueTip.setAttribute('fill', '#ef4444');

      if (statusText) {
        statusText.textContent = 'POLARITAS BENAR & AMAN (PUIL)';
        statusText.setAttribute('fill', '#10b981');
      }
      if (caption) {
        caption.innerHTML = '<span style="color:#10b981; font-weight:700;"><i class="bi bi-check-circle-fill"></i> Benar!</span> Kabel Fasa terhubung ke kontak lidah tengah, sedangkan ulir luar terhubung ke Netral. Ulir luar aman disentuh secara tidak sengaja saat mengganti bohlam.';
      }
    });
  }

  if (btnReversed) {
    btnReversed.addEventListener('click', () => {
      playUIClick();
      if (glow) glow.style.opacity = '1';
      if (hazardBadge) hazardBadge.style.opacity = '1';

      // Warna kabel terbalik: Kiri Fasa (#ef4444), Kanan Netral (#3b82f6)
      if (wireShell) wireShell.setAttribute('stroke', '#ef4444');
      if (tagShell) tagShell.setAttribute('fill', '#ef4444');
      if (labelL) {
        labelL.textContent = 'Fasa (L) SALAH!';
        labelL.setAttribute('fill', '#ef4444');
      }

      if (wireTongue) wireTongue.setAttribute('stroke', '#3b82f6');
      if (tagTongue) tagTongue.setAttribute('fill', '#3b82f6');
      if (labelR) {
        labelR.textContent = 'Netral (N)';
        labelR.setAttribute('fill', '#3b82f6');
      }

      // Ulir luar MERAH BERBAHAYA
      if (outerShell) {
        outerShell.setAttribute('fill', 'rgba(239, 68, 68, 0.4)');
        outerShell.setAttribute('stroke', '#ef4444');
      }
      if (centerTongue) centerTongue.setAttribute('stroke', '#3b82f6');
      if (tongueTip) tongueTip.setAttribute('fill', '#3b82f6');

      if (statusText) {
        statusText.textContent = 'BAHAYA: POLARITAS TERBALIK!';
        statusText.setAttribute('fill', '#ef4444');
      }
      if (caption) {
        caption.innerHTML = '<span style="color:#ef4444; font-weight:700;"><i class="bi bi-exclamation-triangle-fill"></i> BAHAYA!</span> Kabel Fasa terhubung ke ulir luar fitting. Menyentuh ulir luar ini saat mengganti lampu bisa menyebabkan <strong>sengatan listrik fatal</strong>, meskipun lampu tetap menyala!';
      }
    });
  }
}
