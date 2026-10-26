// Splash Screen Component - Virtual Lab IPL
import { navigate, bgmAudio, applyBgmSettings, state } from '../main.js';
import { playUIClick } from '../utils/audioFeedback.js';
import { getComponentWiringSVG } from './WiringSymbols.js';

export const SPLASH_FOOTER = 'Pendidikan Teknik Elektro · Universitas Negeri Padang';

const strip = h => h.replace(/<text[^>]*>.*?<\/text>/g, ''); // buang label teks pada simbol hiasan
const place = (type, compState, x, y, sc) =>
  `<g transform="translate(${x},${y}) scale(${sc})">${strip(getComponentWiringSVG(type, compState))}</g>`;

const hit = (id, label, pressed, x, y, w, h, inner) => `
  <g class="splash-hit" id="${id}" role="button" tabindex="0" aria-label="${label}" aria-pressed="${pressed}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"/>
    <g class="splash-symbol">${inner}</g>
  </g>`;

export function renderSplashScreen() {
  const app = document.getElementById('app');

  // State rangkaian hiasan (sumber kebenaran tunggal lokal)
  const circuit = { switchOn: true, mcbOn: true, fuseBlown: false };
  const isLive = () => circuit.mcbOn && !circuit.fuseBlown && circuit.switchOn;

  const art = `
<svg class="splash-art" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" focusable="false">
  <g class="deco">
    <path class="splash-trace" d="M0 150 H150 Q170 150 170 170 V224"/>
    <path class="splash-flow" data-seg="a" d="M0 150 H150 Q170 150 170 170 V224"/>
    <path class="splash-trace" d="M170 336 V414"/>
    <path class="splash-flow" data-seg="a" d="M170 336 V414"/>
    <path class="splash-trace" d="M170 498 V560 Q170 580 190 580 H330 Q350 580 350 600 V720"/>
    <path class="splash-flow" data-seg="b" d="M170 498 V560 Q170 580 190 580 H330 Q350 580 350 600 V720"/>
    <path class="splash-trace" d="M1280 560 H1130 Q1110 560 1110 540 V498"/>
    <path class="splash-flow" data-seg="b" d="M1280 560 H1130 Q1110 560 1110 540 V498"/>
    <path class="splash-trace" d="M1110 414 V270 Q1110 250 1090 250 H1042"/>
    <path class="splash-flow" data-seg="c" d="M1110 414 V270 Q1110 250 1090 250 H1042"/>
    <path class="splash-trace" d="M998 250 H985 Q965 250 965 230 V0"/>
    <path class="splash-flow n" data-seg="c" d="M998 250 H985 Q965 250 965 230 V0"/>
    <circle class="splash-node" cx="170" cy="224" r="4"/>
    <circle class="splash-node" cx="1110" cy="414" r="4" style="animation-delay:.8s"/>
  </g>
  <defs><radialGradient id="splash-lg"><stop offset="0" stop-color="#fde047" stop-opacity=".55"/><stop offset="1" stop-color="#fde047" stop-opacity="0"/></radialGradient></defs>
  <g class="deco">
    <circle class="splash-glow" cx="1020" cy="250" r="95" fill="url(#splash-lg)"/>
    ${hit('splash-mcb', 'MCB 1-Fasa: Aktif (klik untuk mematikan)', 'true', 115, 215, 110, 135, place('MCB_1P', { on: circuit.mcbOn }, 128, 210, 1.4))}
    ${hit('splash-fuse', 'Sekering: Normal (klik untuk memutuskan)', 'false', 120, 405, 100, 105, place('Fuse', { blown: circuit.fuseBlown }, 135, 400, 1.4))}
    ${hit('splash-switch', 'Saklar Tunggal: Tertutup (klik untuk membuka)', 'true', 1040, 395, 140, 125, place('SwitchSingle', { on: circuit.switchOn }, 1068, 400, 1.4))}
    ${hit('splash-lamp', 'Lampu: Menyala (klik untuk mematikan)', 'true', 950, 180, 140, 140, place('Lamp', { on: isLive() }, 960, 190, 1.5))}
  </g>
</svg>`;

  app.innerHTML = `
    <div class="splash-screen">
      <div class="splash-grid"></div>
      ${art}
      <div class="splash-content">
        <div class="splash-logo"><svg viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true" focusable="false"><path d="M13.5 2 4 13.5h6.2L9.5 22 20 9.6h-6.5L13.5 2z"/></svg></div>
        <h1 class="splash-title">Virtual <span>Laboratory</span></h1>
        <div class="splash-sub">Instalasi Penerangan Listrik (IPL)</div>
        <p class="splash-tag">Media Pendamping Pembelajaran Praktik Kelistrikan Interaktif Kelas XI TITL</p>
        <button id="btn-enter-app" class="btn-splash-enter" type="button">
          <span>Mulai Belajar</span> <i class="bi bi-arrow-right"></i>
        </button>
        <div class="splash-foot">${SPLASH_FOOTER}</div>
        <div id="splash-hint" class="splash-hint">Coba klik saklar dan lampunya</div>
      </div>
    </div>
  `;

  const splashScreenEl = app.querySelector('.splash-screen');
  const onVisibilityChange = () => {
    if (!document.body.contains(splashScreenEl)) {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      return;
    }
    splashScreenEl.classList.toggle('splash-paused', document.hidden);
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Fungsi sinkronisasi tampilan rangkaian dari circuit state
  const applyCircuit = () => {
    const live = isLive();
    const segAActive = circuit.mcbOn;
    const segBActive = circuit.mcbOn && !circuit.fuseBlown;
    const segCActive = live;

    // 1. Kabel flow per segmen
    app.querySelectorAll('.splash-flow[data-seg="a"]').forEach(el => el.classList.toggle('is-off', !segAActive));
    app.querySelectorAll('.splash-flow[data-seg="b"]').forEach(el => el.classList.toggle('is-off', !segBActive));
    app.querySelectorAll('.splash-flow[data-seg="c"]').forEach(el => el.classList.toggle('is-off', !segCActive));

    // 2. Glow lampu
    const glow = app.querySelector('.splash-glow');
    if (glow) glow.classList.toggle('is-off', !live);

    // 3. MCB
    const mcb = app.querySelector('#splash-mcb');
    if (mcb) {
      mcb.setAttribute('aria-pressed', String(circuit.mcbOn));
      mcb.setAttribute('aria-label', circuit.mcbOn ? 'MCB 1-Fasa: Aktif (klik untuk mematikan)' : 'MCB 1-Fasa: Nonaktif (klik untuk menyalakan)');
      const sym = mcb.querySelector('.splash-symbol');
      if (sym) sym.innerHTML = place('MCB_1P', { on: circuit.mcbOn }, 128, 210, 1.4);
    }

    // 4. Sekering
    const fuse = app.querySelector('#splash-fuse');
    if (fuse) {
      fuse.setAttribute('aria-pressed', String(circuit.fuseBlown));
      fuse.setAttribute('aria-label', circuit.fuseBlown ? 'Sekering: Putus (klik untuk mereset)' : 'Sekering: Normal (klik untuk memutuskan)');
      const sym = fuse.querySelector('.splash-symbol');
      if (sym) sym.innerHTML = place('Fuse', { blown: circuit.fuseBlown }, 135, 400, 1.4);
    }

    // 5. Saklar
    const sw = app.querySelector('#splash-switch');
    if (sw) {
      sw.setAttribute('aria-pressed', String(circuit.switchOn));
      sw.setAttribute('aria-label', circuit.switchOn ? 'Saklar Tunggal: Tertutup (klik untuk membuka)' : 'Saklar Tunggal: Terbuka (klik untuk menutup)');
      const sym = sw.querySelector('.splash-symbol');
      if (sym) sym.innerHTML = place('SwitchSingle', { on: circuit.switchOn }, 1068, 400, 1.4);
    }

    // 6. Lampu
    const lamp = app.querySelector('#splash-lamp');
    if (lamp) {
      lamp.setAttribute('aria-pressed', String(live));
      lamp.setAttribute('aria-label', live ? 'Lampu: Menyala (klik untuk mematikan)' : 'Lampu: Padam (klik untuk menyalakan)');
      const sym = lamp.querySelector('.splash-symbol');
      if (sym) sym.innerHTML = place('Lamp', { on: live }, 960, 190, 1.5);
    }
  };

  // Hilangkan petunjuk interaksi setelah aksi pertama
  const dismissHint = () => {
    const hintEl = app.querySelector('#splash-hint');
    if (hintEl) {
      hintEl.style.opacity = '0';
      setTimeout(() => hintEl.remove(), 300);
    }
  };

  // Helper pasang listener click + keyboard (Enter / Space)
  const bindHit = (id, handler) => {
    const el = app.querySelector(`#${id}`);
    if (!el) return;
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  };

  // Handler interaksi komponen
  bindHit('splash-mcb', () => {
    circuit.mcbOn = !circuit.mcbOn;
    dismissHint();
    playUIClick();
    applyCircuit();
  });

  let blowTimer = null;
  bindHit('splash-fuse', () => {
    dismissHint();
    playUIClick();
    if (circuit.fuseBlown) {
      circuit.fuseBlown = false;
      const fuseEl = app.querySelector('#splash-fuse');
      if (fuseEl) fuseEl.classList.remove('is-blowing');
      if (blowTimer) clearTimeout(blowTimer);
    } else {
      circuit.fuseBlown = true;
      const fuseEl = app.querySelector('#splash-fuse');
      if (fuseEl) {
        fuseEl.classList.remove('is-blowing');
        void fuseEl.offsetWidth; // re-trigger animasi
        fuseEl.classList.add('is-blowing');
        if (blowTimer) clearTimeout(blowTimer);
        blowTimer = setTimeout(() => {
          fuseEl.classList.remove('is-blowing');
        }, 1000);
      }
    }
    applyCircuit();
  });

  bindHit('splash-switch', () => {
    circuit.switchOn = !circuit.switchOn;
    dismissHint();
    playUIClick();
    applyCircuit();
  });

  bindHit('splash-lamp', () => {
    circuit.switchOn = !circuit.switchOn;
    dismissHint();
    playUIClick();
    applyCircuit();
  });

  document.getElementById('btn-enter-app').addEventListener('click', () => {
    if (blowTimer) clearTimeout(blowTimer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    // Klik ini adalah interaksi pertama pengguna -- titik paling andal untuk memulai audio,
    // karena kebijakan autoplay browser MENGHARUSKAN audio dimulai langsung di dalam
    // event handler klik pengguna, bukan sesudahnya lewat proses async apa pun.
    applyBgmSettings();
    if (state.bgmEnabled) {
      bgmAudio.play().catch(() => {});
    }
    playUIClick();
    navigate('home');
  });
}
