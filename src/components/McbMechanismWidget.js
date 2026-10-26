// Interactive MCB 1-Phase Mechanism Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

// Format angka Indonesia
const fmtA = a => `${(Math.round(a * 10) / 10).toLocaleString('id-ID')} A`;
const fmtMult = m => (Math.round(m * 10) / 10).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function renderMcbMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Bersihkan instans sebelumnya jika ada
  if (typeof container._cleanupMcbWidget === 'function') {
    container._cleanupMcbWidget();
  }

  // 1. Konstanta Standar IEC 60898-1
  const RATINGS = [2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63];            // In (A)
  const CURVES = { B: { lo: 3, hi: 5 }, C: { lo: 5, hi: 10 }, D: { lo: 10, hi: 20 } }; // ambang magnetik (× In)

  // Koordinat Log-Log Grafik Kurva Trip (X: 1–50, Y: 0.01–10000 s)
  const xCoord = v => +(44 + (Math.log10(Math.max(1, v)) / Math.log10(50)) * 270).toFixed(1);
  const yCoord = t => +(16 + ((4 - Math.log10(Math.max(0.01, t))) / 6) * 168).toFixed(1);

  // Helper tampilan Mobile & Reduced Motion
  const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollToStage() {
    if (!isMobileView()) return;
    // Tunggu render #mcb2-dynamic selesai (elemen stage bisa diganti oleh renderDynamic)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const stage = container.querySelector('.mcb2-stage');
      if (!stage) return;
      const top = stage.getBoundingClientRect().top;
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 56;
      // Hanya bergulir jika stage belum terlihat jelas (hindari lompatan saat ditekan berulang)
      if (top < navH || top > window.innerHeight * 0.55) {
        stage.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }
    }));
  }

  function scrollToControls() {
    const ctrl = container.querySelector('#mcb2-controls');
    if (ctrl) {
      ctrl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  // 2. State Widget
  let ratingIn = 10;     // default
  let curve = 'C';       // default
  let loadAmps = 6;      // arus beban yang diatur siswa
  let measuredAmps = 6;  // arus terukur (0 setelah trip)
  let isRunning = false;
  let isMcbOn = true;
  let animTimers = [];
  let _rafId = null;
  let activeHighlight = null;

  // Rumus konversi logaritmik (0.5 A s.d. 3000 A)
  const ampsToPos = a => Math.round(1000 * Math.log(Math.max(0.5, a) / 0.5) / Math.log(6000));
  const posToAmps = v => {
    const a = 0.5 * Math.pow(6000, v / 1000);
    return a < 10 ? Math.round(a * 10) / 10 : (a < 100 ? Math.round(a) : Math.round(a / 5) * 5);
  };

  // 3. Fungsi Analisis Karakteristik Trip (IEC 60898-1)
  function analyzeTrip(In, curveKey, I) {
    const { lo, hi } = CURVES[curveKey];
    const m = I / In;
    if (I <= 0) return { m, kind: 'off' };
    if (m <= 1.13) return { m, kind: 'normal' };                 // tidak trip
    if (m >= hi) return { m, kind: 'magnetic', timeSec: 0.05 };  // trip instan (< 0,1 s)
    // termal: waktu ≈ 3600 × (0,45 / (m − 1))²  → 1,45×In ≈ 1 jam
    const timeSec = 3600 * Math.pow(0.45 / (m - 1), 2);
    return {
      m,
      kind: m < 1.45 ? 'caution' : 'thermal',                    // caution: trip baru setelah > 1 jam
      grayZone: m >= lo,                                          // zona abu-abu magnetik (lo ≤ m < hi)
      timeSec
    };
  }

  function formatTime(s) {
    if (s < 0.1) return '< 0,1 detik';
    if (s < 60) return '± ' + Math.round(s) + ' detik';
    if (s < 3600) return '± ' + Math.round(s / 60) + ' menit';
    return '> 1 jam';
  }

  // Steps state
  let steps = [
    { text: 'Beban normal terhubung (6 A di bawah rating 10 A).', status: 'done' },
    { text: 'Kontak tertutup rapat, bimetal & kumparan dingin.', status: 'done' },
    { text: 'Arus mengalir stabil ke beban penerangan.', status: 'done' }
  ];

  let resultNote = {
    title: 'Kondisi Normal (ON)',
    text: 'MCB mengalirkan arus nominal tanpa trip karena panas bimetal dan gaya tarik kumparan masih di bawah ambang batas pemicu.',
    type: 'normal'
  };

  function clearAllTimers() {
    if (_rafId) {
      cancelAnimationFrame(_rafId);
      _rafId = null;
    }
    animTimers.forEach(t => clearTimeout(t));
    animTimers = [];
  }

  function scheduleReadouts() {
    if (_rafId) return;
    _rafId = requestAnimationFrame(() => {
      _rafId = null;
      updateReadouts();
    });
  }

  function setStepsState(stepStatuses) {
    stepStatuses.forEach((st, idx) => {
      if (steps[idx]) steps[idx].status = st;
    });
  }

  function highlightElement(hlId) {
    activeHighlight = hlId;
  }

  function renderHighlights() {
    const highlights = ['hl-bimetal', 'hl-coil', 'hl-contacts', 'hl-arc'];
    highlights.forEach(hId => {
      const el = container.querySelector('#' + hId);
      if (el) {
        el.style.opacity = (activeHighlight === hId) ? '1' : '0';
      }
    });
  }

  function updateStepsUI() {
    const list = container.querySelector('#mcb2-steps-list');
    if (!list) return;
    list.innerHTML = renderStepsHTML();
  }

  function renderStepsHTML() {
    return steps.map((s, idx) => {
      let icon = '<i class="bi bi-circle"></i>';
      let cls = 'step-pending';
      if (s.status === 'done') {
        icon = '<i class="bi bi-check-circle-fill" style="color:#10b981;"></i>';
        cls = 'step-done';
      } else if (s.status === 'active') {
        icon = '<i class="bi bi-arrow-right-circle-fill" style="color:#f59e0b;"></i>';
        cls = 'step-active';
      }
      return `
        <li class="mcb2-step-item ${cls}">
          <span class="step-num">${idx + 1}</span>
          <span class="step-text">${s.text}</span>
          <span class="step-icon">${icon}</span>
        </li>
      `;
    }).join('');
  }

  // Update deskripsi prediksi awal saat slider/parameter diubah
  function updatePredictionState() {
    const analysis = analyzeTrip(ratingIn, curve, loadAmps);
    if (analysis.kind === 'off') {
      steps = [
        { text: 'Arus beban 0 A.', status: 'done' },
        { text: 'Kontak MCB dalam posisi terbuka.', status: 'done' },
        { text: 'Tidak ada aliran arus.', status: 'done' }
      ];
      resultNote = {
        title: 'Kondisi OFF (0 A)',
        text: 'Tidak ada arus beban yang terhubung.',
        type: 'normal'
      };
    } else if (analysis.kind === 'normal') {
      steps = [
        { text: `Beban normal terhubung (${loadAmps} A ≤ 1,13 × ${ratingIn} A = ${(1.13 * ratingIn).toFixed(1)} A).`, status: 'done' },
        { text: `Suhu bimetal & kumparan dingin pada batas aman (m = ${analysis.m.toFixed(2)} × In).`, status: 'done' },
        { text: 'Kontak tertutup rapat, arus mengalir stabil.', status: 'done' }
      ];
      resultNote = {
        title: `Prediksi: Aman — Operasi Normal (${loadAmps} A)`,
        text: `Arus ${loadAmps} A (${analysis.m.toFixed(2)} × In) berada di bawah ambang batas trip 1,13 × In (${(1.13 * ratingIn).toFixed(1)} A). MCB aman dan tidak akan trip.`,
        type: 'safe'
      };
    } else if (analysis.kind === 'caution') {
      steps = [
        { text: `Arus beban (${loadAmps} A = ${analysis.m.toFixed(2)} × In) melampaui 1,13 × In.`, status: 'pending' },
        { text: `Bimetal memanas sangat perlahan.`, status: 'pending' },
        { text: `Trip baru akan terjadi setelah > 1 jam (${formatTime(analysis.timeSec)}).`, status: 'pending' }
      ];
      resultNote = {
        title: `Prediksi: Waspada — Arus Lebih Ringan (${loadAmps} A)`,
        text: `Arus ${loadAmps} A (${analysis.m.toFixed(2)} × In) berada di zona 1,13–1,45 × In. Bimetal memanas perlahan, trip baru terjadi setelah ${formatTime(analysis.timeSec)} bila beban terus bertahan.`,
        type: 'warning'
      };
    } else if (analysis.kind === 'thermal') {
      steps = [
        { text: `Arus beban lebih (${loadAmps} A = ${analysis.m.toFixed(2)} × In > 1,45 × In).`, status: 'pending' },
        { text: `Bimetal akan memanas & melengkung (estimasi: ${formatTime(analysis.timeSec)}${analysis.grayZone ? ', zona abu-abu' : ''}).`, status: 'pending' },
        { text: 'Pengunci terlepas, kontak terbuka & tuas ke TRIP.', status: 'pending' }
      ];
      resultNote = {
        title: `Prediksi: Beban Lebih — Trip Termal (${loadAmps} A)`,
        text: `Arus ${loadAmps} A (${analysis.m.toFixed(2)} × In) memicu trip termal bimetal dalam waktu nyata diperkirakan ${formatTime(analysis.timeSec)}. Klik "Jalankan Simulasi" untuk menguji.`,
        type: 'warning'
      };
    } else if (analysis.kind === 'magnetic') {
      steps = [
        { text: `Lonjakan arus besar (${loadAmps} A = ${analysis.m.toFixed(2)} × In ≥ ${CURVES[curve].hi} × In)!`, status: 'pending' },
        { text: 'Kumparan solenoid menarik plunger instan (< 100 ms).', status: 'pending' },
        { text: 'Kontak terbuka di Arc Chute seketika.', status: 'pending' }
      ];
      resultNote = {
        title: `Prediksi: Hubung Singkat — Trip Magnetik (${loadAmps} A)`,
        text: `Arus ${loadAmps} A mencapai ambang magnetik Kurva ${curve} (${CURVES[curve].hi} × In). Solenoid akan memutus kontak seketika (< 0,1 detik).`,
        type: 'danger'
      };
    }
  }

  // Handler saat rating/kurva diubah via chip
  function onControlParamChanged() {
    clearAllTimers();
    isRunning = false;
    isMcbOn = true;
    measuredAmps = loadAmps;
    activeHighlight = null;
    updatePredictionState();
    renderDynamic();
  }

  // 4. Jalankan Simulasi Lengkap
  function runSimulation() {
    playUIClick();
    clearAllTimers();
    isRunning = true;
    isMcbOn = true;
    measuredAmps = loadAmps;

    const analysis = analyzeTrip(ratingIn, curve, loadAmps);

    if (analysis.kind === 'off') {
      isRunning = false;
      isMcbOn = false;
      measuredAmps = 0;
      updatePredictionState();
      renderDynamic();
      scrollToStage();
      return;
    }

    if (analysis.kind === 'normal') {
      isRunning = false;
      isMcbOn = true;
      measuredAmps = loadAmps;
      steps = [
        { text: `Beban normal terhubung (${loadAmps} A ≤ 1,13 × ${ratingIn} A = ${(1.13 * ratingIn).toFixed(1)} A).`, status: 'done' },
        { text: `Suhu bimetal & kumparan dingin pada batas aman (${analysis.m.toFixed(2)} × In).`, status: 'done' },
        { text: 'Kontak tetap tertutup rapat, arus mengalir stabil.', status: 'done' }
      ];
      resultNote = {
        title: `Kondisi Aman — Operasi Normal (${loadAmps} A)`,
        text: `Arus ${loadAmps} A (${analysis.m.toFixed(2)} × In) berada di bawah ambang batas trip 1,13 × In (${(1.13 * ratingIn).toFixed(1)} A). MCB aman dan tidak trip.`,
        type: 'safe'
      };
      renderDynamic();
      scrollToStage();
      return;
    }

    if (analysis.kind === 'caution') {
      steps = [
        { text: `Arus beban (${loadAmps} A = ${analysis.m.toFixed(2)} × In) melampaui 1,13 × In.`, status: 'active' },
        { text: 'Bimetal memanas sangat perlahan.', status: 'pending' },
        { text: `Trip baru akan terjadi setelah > 1 jam (${formatTime(analysis.timeSec)}).`, status: 'pending' }
      ];
      resultNote = {
        title: `Waspada — Arus Lebih Ringan (${loadAmps} A)`,
        text: `Arus berada pada zona 1,13–1,45 × In. Bimetal memanas perlahan, trip konvensional baru terpicu setelah ${formatTime(analysis.timeSec)} bila beban terus bertahan.`,
        type: 'warning'
      };
      renderDynamic();
      scrollToStage();

      animTimers.push(setTimeout(() => {
        setStepsState(['done', 'active', 'pending']);
        highlightElement('hl-bimetal');
        renderHighlights();
        updateStepsUI();
      }, 600));

      animTimers.push(setTimeout(() => {
        isRunning = false;
        setStepsState(['done', 'done', 'done']);
        updateStepsUI();
      }, 1800));
      return;
    }

    if (analysis.kind === 'thermal') {
      const animDuration = Math.round(2500 + Math.min(3000, Math.log10(1 + analysis.timeSec) * 900));
      steps = [
        { text: `Arus beban lebih terdeteksi (${loadAmps} A = ${analysis.m.toFixed(2)} × In > 1,45 × In).`, status: 'active' },
        { text: `Bimetal memanas bertahap & melengkung (waktu nyata: ${formatTime(analysis.timeSec)}${analysis.grayZone ? ', zona abu-abu magnetik' : ''}).`, status: 'pending' },
        { text: 'Pengunci terlepas, kontak terbuka & tuas ke posisi TRIP.', status: 'pending' }
      ];
      resultNote = {
        title: `Simulasi Beban Lebih (Thermal Trip)`,
        text: `Arus ${loadAmps} A (${analysis.m.toFixed(2)} × In) membuat bimetal memanas secara gradual. Estimasi waktu nyata: ${formatTime(analysis.timeSec)} (animasi dipercepat ${(animDuration / 1000).toFixed(1)}s).`,
        type: 'warning'
      };
      renderDynamic();
      scrollToStage();

      animTimers.push(setTimeout(() => {
        setStepsState(['done', 'active', 'pending']);
        highlightElement('hl-bimetal');
        renderHighlights();
        updateStepsUI();
      }, 600));

      animTimers.push(setTimeout(() => {
        isMcbOn = false;
        measuredAmps = 0;
        isRunning = false;
        setStepsState(['done', 'done', 'done']);
        highlightElement('hl-contacts');
        resultNote = {
          title: 'Proteksi Thermal Berhasil (TRIP)',
          text: `Bimetal melengkung sempurna mendorong tuas pengunci. Waktu nyata ${formatTime(analysis.timeSec)} (dipercepat di animasi). Aliran listrik terputus aman untuk mencegah kebakaran kabel.`,
          type: 'danger'
        };
        renderDynamic();
      }, animDuration));
      return;
    }

    if (analysis.kind === 'magnetic') {
      steps = [
        { text: `Arus lonjakan hubung singkat masif (${loadAmps} A = ${analysis.m.toFixed(2)} × In ≥ ${CURVES[curve].hi} × In)!`, status: 'active' },
        { text: 'Kumparan solenoid menarik plunger seketika (< 100 ms).', status: 'pending' },
        { text: 'Kontak terbuka seketika dan busur api dipadamkan di Arc Chute.', status: 'pending' }
      ];
      resultNote = {
        title: `Simulasi Hubung Singkat (Magnetic Trip)`,
        text: `Hubung singkat menimbulkan arus ${loadAmps} A (${analysis.m.toFixed(2)} × In). Kumparan solenoid bereaksi secepat kilat memisahkan kontak.`,
        type: 'danger'
      };
      renderDynamic();
      scrollToStage();

      animTimers.push(setTimeout(() => {
        setStepsState(['done', 'active', 'pending']);
        highlightElement('hl-coil');
        renderHighlights();
        updateStepsUI();
      }, 150));

      animTimers.push(setTimeout(() => {
        isMcbOn = false;
        measuredAmps = 0;
        isRunning = false;
        setStepsState(['done', 'done', 'done']);
        highlightElement('hl-arc');
        resultNote = {
          title: 'Proteksi Magnetik Berhasil (TRIP INSTAN)',
          text: `Magnetic Trip bekerja dalam hitungan milidetik (< 0,1 detik) tanpa menunggu panas, memadamkan loncatan api di kisi-kisi Arc Chute demi mencegah kebakaran fatal.`,
          type: 'danger'
        };
        renderDynamic();
      }, 750));
      return;
    }
  }

  // Toggle Tuas Saklar Manual
  function toggleManualLever() {
    if (isRunning) return;
    playUIClick();
    clearAllTimers();
    isMcbOn = !isMcbOn;
    measuredAmps = isMcbOn ? loadAmps : 0;
    steps = [
      { text: isMcbOn ? 'Tuas dinaikkan ke posisi ON secara manual.' : 'Tuas diturunkan ke posisi OFF secara manual.', status: 'done' },
      { text: isMcbOn ? 'Kontak terhubung kembali.' : 'Kontak mekanik terbuka.', status: 'done' },
      { text: isMcbOn ? `Arus kembali mengalir ke beban (${loadAmps} A).` : 'Arus terputus total (0 A).', status: 'done' }
    ];
    resultNote = {
      title: isMcbOn ? 'Kontrol Manual: ON' : 'Kontrol Manual: OFF',
      text: isMcbOn ? 'MCB siap beroperasi normal mengalirkan arus listrik.' : 'Aliran listrik diputus aman untuk pemeliharaan rangkaian.',
      type: isMcbOn ? 'normal' : 'warning'
    };
    activeHighlight = 'hl-contacts';
    renderDynamic();
  }

  // 5. Panel Kontrol (Dirender SEKALI & Listener Melalui Delegation)
  function renderControls() {
    const ctrlContainer = container.querySelector('#mcb2-controls');
    if (!ctrlContainer) return;

    ctrlContainer.innerHTML = `
      <div class="mcb2-ctrl">
        <div class="mcb2-ctrl-block">
          <div class="mcb2-ctrl-title">
            <span>Rating MCB (In):</span>
            <strong id="ctrl-in-val">${ratingIn} A</strong>
          </div>
          <div class="mcb2-chip-row" id="ctrl-rating" role="group" aria-label="Rating MCB">
            ${RATINGS.map(r => `
              <button class="mcb2-chip ${r === ratingIn ? 'active' : ''}" data-in="${r}" aria-pressed="${r === ratingIn}">
                ${r} A
              </button>
            `).join('')}
          </div>

          <div class="mcb2-ctrl-title" style="margin-top: 4px;">
            <span>Kurva trip:</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">(ambang magnetik)</span>
          </div>
          <div class="mcb2-chip-row" id="ctrl-curve" role="group" aria-label="Kurva trip">
            <button class="mcb2-chip ${curve === 'B' ? 'active' : ''}" data-curve="B" aria-pressed="${curve === 'B'}">B (3–5 In)</button>
            <button class="mcb2-chip ${curve === 'C' ? 'active' : ''}" data-curve="C" aria-pressed="${curve === 'C'}">C (5–10 In)</button>
            <button class="mcb2-chip ${curve === 'D' ? 'active' : ''}" data-curve="D" aria-pressed="${curve === 'D'}">D (10–20 In)</button>
          </div>
        </div>

        <div class="mcb2-ctrl-block">
          <div class="mcb2-ctrl-title">
            <span>Arus beban (I):</span>
            <div class="mcb2-ctrl-amps-input-wrap">
              <input id="ctrl-amps-num" type="number" min="0.5" max="3000" step="0.5" inputmode="decimal" value="${loadAmps}">
              <span style="font-size: 0.82rem; font-weight: 700;">A</span>
              <span id="ctrl-amps-mult">= ${fmtMult(loadAmps / ratingIn)} × In</span>
            </div>
          </div>

          <input id="ctrl-amps-range" type="range" min="0" max="1000" step="1" value="${ampsToPos(loadAmps)}" aria-label="Arus beban">

          <!-- Preset Ringkas 3 Kolom -->
          <div class="mcb2-chip-row mcb2-preset-row" id="ctrl-presets">
            <button class="mcb2-chip mcb2-chip-preset" data-preset="normal" aria-label="Normal, ${fmtA(0.6 * ratingIn)}">
              <span class="p-name">Normal</span><small class="p-val">${fmtA(0.6 * ratingIn)}</small>
            </button>
            <button class="mcb2-chip mcb2-chip-preset" data-preset="overload" aria-label="Beban Lebih, ${fmtA(2 * ratingIn)}">
              <span class="p-name">Beban Lebih</span><small class="p-val">${fmtA(2 * ratingIn)}</small>
            </button>
            <button class="mcb2-chip mcb2-chip-preset" data-preset="short" aria-label="Hubung Singkat, ${fmtA(Math.round(CURVES[curve].hi * 1.2 * ratingIn))}">
              <span class="p-name">Hubung Singkat</span><small class="p-val">${fmtA(Math.round(CURVES[curve].hi * 1.2 * ratingIn))}</small>
            </button>
          </div>

          <button id="btn-mcb2-run" class="btn-mcb2-run">
            <i class="bi bi-play-fill"></i> Jalankan Simulasi
          </button>
        </div>
      </div>
    `;

    function syncPresetLabels() {
      const set = (key, a) => {
        const btn = ctrlContainer.querySelector(`[data-preset="${key}"]`);
        if (!btn) return;
        const val = btn.querySelector('.p-val');
        if (val) val.textContent = fmtA(a);
        const name = btn.querySelector('.p-name');
        if (name) btn.setAttribute('aria-label', `${name.textContent}, ${fmtA(a)}`);
      };
      set('normal', 0.6 * ratingIn);
      set('overload', 2 * ratingIn);
      set('short', Math.round(CURVES[curve].hi * 1.2 * ratingIn));
    }

    // Delegasi Event Click pada #mcb2-controls (Hanya terpasang sekali)
    ctrlContainer.addEventListener('click', e => {
      const ratingBtn = e.target.closest('#ctrl-rating .mcb2-chip');
      if (ratingBtn) {
        playUIClick();
        ratingIn = Number(ratingBtn.getAttribute('data-in'));
        ctrlContainer.querySelectorAll('#ctrl-rating .mcb2-chip').forEach(b => {
          const isAct = Number(b.getAttribute('data-in')) === ratingIn;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        });
        const inValEl = ctrlContainer.querySelector('#ctrl-in-val');
        if (inValEl) inValEl.textContent = `${ratingIn} A`;
        const ampsMultEl = ctrlContainer.querySelector('#ctrl-amps-mult');
        if (ampsMultEl) ampsMultEl.textContent = `= ${fmtMult(loadAmps / ratingIn)} × In`;
        syncPresetLabels();
        onControlParamChanged();
        return;
      }

      const curveBtn = e.target.closest('#ctrl-curve .mcb2-chip');
      if (curveBtn) {
        playUIClick();
        curve = curveBtn.getAttribute('data-curve');
        ctrlContainer.querySelectorAll('#ctrl-curve .mcb2-chip').forEach(b => {
          const isAct = b.getAttribute('data-curve') === curve;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        });
        syncPresetLabels();
        onControlParamChanged();
        return;
      }

      const presetBtn = e.target.closest('#ctrl-presets .mcb2-chip');
      if (presetBtn) {
        const p = presetBtn.getAttribute('data-preset');
        if (p === 'normal') {
          loadAmps = Math.round(0.6 * ratingIn * 10) / 10;
        } else if (p === 'overload') {
          loadAmps = Math.round(2.0 * ratingIn);
        } else if (p === 'short') {
          loadAmps = Math.round(CURVES[curve].hi * 1.2 * ratingIn);
        }
        const ampsNumEl = ctrlContainer.querySelector('#ctrl-amps-num');
        const ampsRangeEl = ctrlContainer.querySelector('#ctrl-amps-range');
        const ampsMultEl = ctrlContainer.querySelector('#ctrl-amps-mult');
        if (ampsNumEl) ampsNumEl.value = loadAmps;
        if (ampsRangeEl) ampsRangeEl.value = ampsToPos(loadAmps);
        if (ampsMultEl) ampsMultEl.textContent = `= ${fmtMult(loadAmps / ratingIn)} × In`;
        runSimulation();
        return;
      }

      const runBtn = e.target.closest('#btn-mcb2-run');
      if (runBtn) {
        runSimulation();
        return;
      }
    });

    // Delegasi Event Input (Slider & Number) - TIDAK merender ulang SVG
    ctrlContainer.addEventListener('input', e => {
      if (e.target && e.target.id === 'ctrl-amps-range') {
        loadAmps = posToAmps(Number(e.target.value));
        const ampsNumEl = ctrlContainer.querySelector('#ctrl-amps-num');
        if (ampsNumEl) ampsNumEl.value = loadAmps;
        const ampsMultEl = ctrlContainer.querySelector('#ctrl-amps-mult');
        if (ampsMultEl) ampsMultEl.textContent = `= ${fmtMult(loadAmps / ratingIn)} × In`;
        if (isMcbOn && !isRunning) measuredAmps = loadAmps;
        scheduleReadouts();
      } else if (e.target && e.target.id === 'ctrl-amps-num') {
        let val = parseFloat(e.target.value);
        if (!isNaN(val)) {
          if (val < 0.5) val = 0.5;
          if (val > 3000) val = 3000;
          loadAmps = val;
          const ampsRangeEl = ctrlContainer.querySelector('#ctrl-amps-range');
          if (ampsRangeEl) ampsRangeEl.value = ampsToPos(loadAmps);
          const ampsMultEl = ctrlContainer.querySelector('#ctrl-amps-mult');
          if (ampsMultEl) ampsMultEl.textContent = `= ${fmtMult(loadAmps / ratingIn)} × In`;
          if (isMcbOn && !isRunning) measuredAmps = loadAmps;
          scheduleReadouts();
        }
      }
    });

    ctrlContainer.addEventListener('change', e => {
      if (e.target && e.target.id === 'ctrl-amps-num') {
        e.target.value = loadAmps;
      }
    });
  }

  // 5b. Grafik Kurva Trip Waktu-Arus Log-Log (IEC 60898-1)
  // Kurva dihitung maksimal 28 titik (sangat ringan, < 60 titik)
  function renderTripCurveSVG(In, curveKey, I, analysis) {
    const { lo, hi } = CURVES[curveKey];
    const mVal = I / In;

    // Titik kurva termal IEC dari m = 1.13 s.d. batas magnetik hi (<= 28 titik)
    const mPoints = [1.13, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.6, 1.7, 1.8, 2.0, 2.2, 2.5, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 7.0, 8.0, 10.0, 12.0, 15.0, 20.0];
    const validM = mPoints.filter(val => val <= hi);
    if (!validM.includes(hi)) validM.push(hi);

    const thermalPathD = validM.map((val, idx) => {
      const t = 3600 * Math.pow(0.45 / (val - 1), 2);
      return `${idx === 0 ? 'M' : 'L'} ${xCoord(val)} ${yCoord(t)}`;
    }).join(' ');

    // Poligon pita transisi magnetik
    const tLo = 3600 * Math.pow(0.45 / (lo - 1), 2);
    const tHi = 3600 * Math.pow(0.45 / (hi - 1), 2);
    const magPoly = `${xCoord(lo)},${yCoord(tLo)} ${xCoord(hi)},${yCoord(tHi)} ${xCoord(hi)},${yCoord(0.04)} ${xCoord(lo)},${yCoord(0.04)}`;

    // Titik kerja saat ini (m, t)
    const isNoTrip = analysis.kind === 'normal' || analysis.kind === 'off';
    const ptM = Math.max(1, Math.min(50, mVal));
    const ptT = isNoTrip ? 10000 : Math.max(0.02, analysis.timeSec);
    const ptX = xCoord(ptM);
    const ptY = yCoord(ptT);

    const tipBoxX = Math.min(226, Math.max(48, Number(ptX) + 8));
    const tipBoxY = Math.max(20, Math.min(160, Number(ptY) - 18));

    const xTicks = [1, 2, 5, 10, 20, 50];
    const yTicks = [
      { t: 10000, label: '10⁴s' },
      { t: 1000, label: '10³s' },
      { t: 100, label: '100s' },
      { t: 10, label: '10s' },
      { t: 1, label: '1s' },
      { t: 0.1, label: '0.1s' },
      { t: 0.01, label: '0.01s' }
    ];

    return `
      <svg id="mcb2-curve-svg" viewBox="0 0 340 215" class="mcb2-curve-svg">
        <defs>
          <filter id="mcb2-pt-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Area Plot & Grid Sumbu Log-Log -->
        <rect x="44" y="16" width="270" height="168" fill="#0b1120" stroke="#334155" stroke-width="1.2"/>

        <!-- Garis Kisi X (Logaritmik) -->
        ${xTicks.map(tVal => `
          <line x1="${xCoord(tVal)}" y1="16" x2="${xCoord(tVal)}" y2="184" stroke="#1e293b" stroke-width="1"/>
          <text x="${xCoord(tVal)}" y="198" fill="#94a3b8" font-size="8.5" font-weight="700" text-anchor="middle">${tVal}×</text>
        `).join('')}

        <!-- Garis Kisi Y (Logaritmik 6 Dekade) -->
        ${yTicks.map(item => `
          <line x1="44" y1="${yCoord(item.t)}" x2="314" y2="${yCoord(item.t)}" stroke="#1e293b" stroke-width="1"/>
          <text x="38" y="${(Number(yCoord(item.t)) + 3).toFixed(1)}" fill="#94a3b8" font-size="8" font-weight="600" text-anchor="end">${item.label}</text>
        `).join('')}

        <!-- Label Sumbu -->
        <text x="179" y="210" fill="#cbd5e1" font-size="9" font-weight="800" text-anchor="middle">Kelipatan Arus Nominal (I / In)</text>
        <text x="14" y="100" fill="#cbd5e1" font-size="9" font-weight="800" text-anchor="middle" transform="rotate(-90, 14, 100)">Waktu Trip (detik)</text>

        <!-- Pita Transisi / Magnetik Kurva Aktif -->
        <polygon points="${magPoly}" fill="rgba(245, 158, 11, 0.22)" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,2"/>
        <text x="${((Number(xCoord(lo)) + Number(xCoord(hi))) / 2).toFixed(1)}" y="${(Number(yCoord(0.04)) - 6).toFixed(1)}" fill="#fbbf24" font-size="7.5" font-weight="700" text-anchor="middle">Magnetik ${lo}–${hi} In</text>

        <!-- Garis Kurva Proteksi Termal IEC -->
        <path d="${thermalPathD}" fill="none" stroke="#f97316" stroke-width="2.6" stroke-linecap="round"/>
        <text x="${xCoord(1.45)}" y="${(Number(yCoord(3600)) - 6).toFixed(1)}" fill="#f97316" font-size="8" font-weight="800">Termal Bimetal</text>

        <!-- Garis Proteksi Instan Magnetik (< 0,1s) -->
        <line x1="${xCoord(hi)}" y1="${yCoord(0.04)}" x2="${xCoord(50)}" y2="${yCoord(0.04)}" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round"/>
        <text x="${xCoord(30)}" y="${(Number(yCoord(0.04)) - 6).toFixed(1)}" fill="#ef4444" font-size="8" font-weight="800">Trip Instan</text>

        <!-- Garis Proyeksi Titik Kerja Saat Ini -->
        <line id="mcb2-proj-x" x1="${ptX}" y1="16" x2="${ptX}" y2="184" stroke="rgba(250, 204, 21, 0.45)" stroke-width="1.2" stroke-dasharray="3,2"/>
        <line id="mcb2-proj-y" x1="44" y1="${ptY}" x2="${ptX}" y2="${ptY}" stroke="rgba(250, 204, 21, 0.45)" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- Titik Kerja Saat Ini (m, t) -->
        <circle id="mcb2-curve-dot" cx="${ptX}" cy="${ptY}" r="5.5" fill="#facc15" stroke="#ffffff" stroke-width="2" filter="url(#mcb2-pt-glow)"/>
        <rect id="mcb2-curve-tip-box" x="${tipBoxX}" y="${tipBoxY}" width="80" height="20" rx="3" fill="#0f172a" fill-opacity="0.9" stroke="#facc15" stroke-width="1"/>
        <text id="mcb2-curve-tip-txt" x="${tipBoxX + 40}" y="${tipBoxY + 13}" fill="#fde047" font-size="8" font-weight="800" text-anchor="middle">
          ${mVal.toFixed(1)}×In · ${isNoTrip ? 'Aman' : formatTime(analysis.timeSec)}
        </text>
      </svg>
    `;
  }

  // 5c. Pembaruan Super Cepat via RequestAnimationFrame (Tanpa render ulang SVG!)
  function updateReadouts() {
    const analysis = analyzeTrip(ratingIn, curve, loadAmps);
    const m = loadAmps / ratingIn;

    // 1. Label kelipatan di kontrol
    const ampsMultEl = container.querySelector('#ctrl-amps-mult');
    if (ampsMultEl) ampsMultEl.textContent = `= ${fmtMult(m)} × In`;

    // 2. Meter Arus Logaritmik
    const mMin = 0.5;
    const mMax = 30;
    const logMin = Math.log(mMin);
    const logMax = Math.log(mMax);
    const clamped = Math.max(mMin, Math.min(mMax, m));
    const pointerPct = Math.round(((Math.log(clamped) - logMin) / (logMax - logMin)) * 1000) / 10;

    const meterColor = isMcbOn
      ? (m >= CURVES[curve].hi ? '#ef4444' : (m >= 1.45 ? '#f97316' : (m > 1.13 ? '#eab308' : '#10b981')))
      : '#64748b';

    const meterVal = container.querySelector('#mcb2-meter-val');
    if (meterVal) {
      meterVal.textContent = isMcbOn ? `${loadAmps} A` : '0 A (TRIP)';
      meterVal.style.color = meterColor;
    }

    const metaLoad = container.querySelector('#mcb2-meta-load');
    if (metaLoad) {
      metaLoad.innerHTML = `Beban I = <strong>${loadAmps} A</strong> (${m.toFixed(2)} × In)`;
    }

    const pointer = container.querySelector('#mcb2-zone-pointer');
    if (pointer) {
      pointer.style.left = pointerPct + '%';
    }

    // 3. Ringkasan Prediksi Cepat Badge
    const predBadge = container.querySelector('#mcb2-pred-badge');
    if (predBadge) {
      predBadge.className = `mcb2-pred-badge pred-${analysis.kind}`;
      const charTxt = analysis.kind === 'off' ? 'OFF (0 A)' :
        (analysis.kind === 'normal' ? 'Aman (Normal)' :
        (analysis.kind === 'caution' ? 'Waspada (Beban Lebih Ringan)' :
        (analysis.kind === 'thermal' ? 'Trip Termal Bimetal' : 'Trip Magnetik Instan Solenoid')));
      const estTxt = (analysis.kind === 'off' || analysis.kind === 'normal')
        ? 'Tidak Trip'
        : `${formatTime(analysis.timeSec)} ${analysis.grayZone ? '(Zona Abu-abu)' : ''}`;
      
      predBadge.innerHTML = `
        <span><strong>Karakteristik:</strong> ${charTxt}</span>
        <span><strong>Estimasi:</strong> ${estTxt}</span>
      `;
    }

    // 4. Update Prediksi Steps & Result Box saat sedang stanby (tidak animasi)
    if (!isRunning && isMcbOn) {
      updatePredictionState();
      updateStepsUI();

      const resBox = container.querySelector('#mcb2-result-box');
      if (resBox) {
        resBox.className = `mcb2-result-box result-${resultNote.type}`;
      }
      const resTitle = container.querySelector('#mcb2-result-title');
      if (resTitle) {
        resTitle.innerHTML = `<i class="bi bi-shield-shaded"></i> ${resultNote.title}`;
      }
      const resDesc = container.querySelector('#mcb2-result-desc');
      if (resDesc) {
        resDesc.textContent = resultNote.text;
      }
    }

    // 5. Update Titik Kerja & Proyeksi pada Grafik Kurva Trip (Tanpa render ulang SVG!)
    const isNoTrip = analysis.kind === 'normal' || analysis.kind === 'off';
    const ptM = Math.max(1, Math.min(50, m));
    const ptT = isNoTrip ? 10000 : Math.max(0.02, analysis.timeSec);
    const ptX = xCoord(ptM);
    const ptY = yCoord(ptT);

    const dot = container.querySelector('#mcb2-curve-dot');
    if (dot) {
      dot.setAttribute('cx', ptX);
      dot.setAttribute('cy', ptY);
    }

    const projX = container.querySelector('#mcb2-proj-x');
    if (projX) {
      projX.setAttribute('x1', ptX);
      projX.setAttribute('x2', ptX);
      projX.setAttribute('y1', '16');
      projX.setAttribute('y2', '184');
    }

    const projY = container.querySelector('#mcb2-proj-y');
    if (projY) {
      projY.setAttribute('x1', '44');
      projY.setAttribute('y1', ptY);
      projY.setAttribute('x2', ptX);
      projY.setAttribute('y2', ptY);
    }

    const tipBoxX = Math.min(226, Math.max(48, Number(ptX) + 8));
    const tipBoxY = Math.max(20, Math.min(160, Number(ptY) - 18));

    const tipBox = container.querySelector('#mcb2-curve-tip-box');
    if (tipBox) {
      tipBox.setAttribute('x', tipBoxX);
      tipBox.setAttribute('y', tipBoxY);
    }

    const tipTxt = container.querySelector('#mcb2-curve-tip-txt');
    if (tipTxt) {
      tipTxt.setAttribute('x', tipBoxX + 40);
      tipTxt.setAttribute('y', tipBoxY + 13);
      tipTxt.textContent = `${m.toFixed(1)}×In · ${isNoTrip ? 'Aman' : formatTime(analysis.timeSec)}`;
    }

    const curveLegend = container.querySelector('#mcb2-curve-legend');
    if (curveLegend) {
      curveLegend.innerHTML = `Titik Kerja: <strong>${m.toFixed(2)} × In (${loadAmps} A)</strong> &bull; t = <strong>${isNoTrip ? 'Tidak Trip' : formatTime(analysis.timeSec)}</strong>`;
    }
  }

  // 6. Area Dinamis (SVG, Meter Zona, Langkah, Hasil, Grafik Kurva)
  // Dipanggil saat awal, saat tombol simulasi ditekan, saat reset, atau saat ganti rating/kurva
  function renderDynamic() {
    const dynContainer = container.querySelector('#mcb2-dynamic');
    if (!dynContainer) return;

    const analysis = analyzeTrip(ratingIn, curve, loadAmps);
    const m = loadAmps / ratingIn;

    // Perhitungan bar meter zona logaritmik (0.5×In s.d. 30×In)
    const mMin = 0.5;
    const mMax = 30;
    const logMin = Math.log(mMin);
    const logMax = Math.log(mMax);
    const toPct = val => {
      const clamped = Math.max(mMin, Math.min(mMax, val));
      return Math.round(((Math.log(clamped) - logMin) / (logMax - logMin)) * 1000) / 10;
    };

    const p1 = toPct(1.0);
    const p113 = toPct(1.13);
    const p145 = toPct(1.45);
    const pLo = toPct(CURVES[curve].lo);
    const pHi = toPct(CURVES[curve].hi);
    const pointerPct = toPct(m);

    const meterColor = isMcbOn
      ? (m >= CURVES[curve].hi ? '#ef4444' : (m >= 1.45 ? '#f97316' : (m > 1.13 ? '#eab308' : '#10b981')))
      : '#64748b';

    dynContainer.innerHTML = `
      <div class="mcb2-stage">
        <!-- Kolom Kiri: Penampang SVG Komponen MCB -->
        <div class="mcb2-svg-container">
          <svg id="mcb2-svg" viewBox="0 0 340 340" class="mcb2-svg">
            <defs>
              <!-- Filter dibatasi ringan stdDeviation <= 2 -->
              <filter id="mcb2-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="lamp-glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="1"/>
                <stop offset="100%" stop-color="#eab308" stop-opacity="0.8"/>
              </linearGradient>
            </defs>

            <!-- Badan Isolator MCB (Casing) -->
            <rect x="20" y="20" width="300" height="300" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>

            <!-- Label Kode Rating & Kurva Resmi pada Casing MCB -->
            <g class="mcb-plate" pointer-events="none">
              <rect x="36" y="36" width="56" height="30" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.2"/>
              <text x="64" y="55" fill="#facc15" font-size="13" font-weight="900" text-anchor="middle" font-family="monospace">${curve}${ratingIn}</text>
              <text x="64" y="76" fill="#94a3b8" font-size="7" font-weight="700" text-anchor="middle">230V~ 6000A</text>
              <text x="64" y="85" fill="#64748b" font-size="6.5" font-weight="600" text-anchor="middle">IEC 60898-1</text>
            </g>

            <!-- 1. TERMINAL INPUT (Atas) -->
            <g class="mcb-part">
              <rect x="150" y="22" width="40" height="22" rx="4" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
              <circle cx="170" cy="33" r="4" fill="#0f172a"/>
              <text x="170" y="16" fill="#94a3b8" font-size="9" font-weight="700" text-anchor="middle">Terminal Input (Fasa)</text>
            </g>

            <!-- 2. KONTAK TETAP & BERGERAK -->
            <g class="mcb-part" id="part-contacts">
              <rect id="hl-contacts" x="142" y="55" width="56" height="52" rx="6" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3" opacity="${activeHighlight === 'hl-contacts' ? 1 : 0}"/>
              <circle cx="170" cy="65" r="5" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
              <g style="transform-origin: 170px 65px; transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); transform: ${isMcbOn ? 'rotate(0deg)' : 'rotate(-28deg)'};">
                <line x1="170" y1="65" x2="170" y2="100" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
                <circle cx="170" cy="65" r="4" fill="#fde047"/>
              </g>
              <text x="210" y="70" fill="#cbd5e1" font-size="8.5" font-weight="600">Kontak Tetap & Bergerak</text>
            </g>

            <!-- 3. RUANG PEMADAM BUSUR API (ARC CHUTE) -->
            <g class="mcb-part" id="part-arc">
              <rect id="hl-arc" x="90" y="55" width="48" height="56" rx="4" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3" opacity="${activeHighlight === 'hl-arc' ? 1 : 0}"/>
              <rect x="94" y="58" width="40" height="50" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <line x1="98" y1="66" x2="130" y2="66" stroke="#94a3b8" stroke-width="2"/>
              <line x1="98" y1="74" x2="130" y2="74" stroke="#94a3b8" stroke-width="2"/>
              <line x1="98" y1="82" x2="130" y2="82" stroke="#94a3b8" stroke-width="2"/>
              <line x1="98" y1="90" x2="130" y2="90" stroke="#94a3b8" stroke-width="2"/>
              <line x1="98" y1="98" x2="130" y2="98" stroke="#94a3b8" stroke-width="2"/>
              <text x="114" y="118" fill="#94a3b8" font-size="7.5" font-weight="600" text-anchor="middle">Arc Chute</text>
            </g>

            <!-- 4. TUAS SAKLAR (HANDLE) - Bisa Diklik Manual -->
            <g class="mcb-part" id="part-lever" style="cursor: pointer;">
              <circle cx="270" cy="90" r="18" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
              <g style="transform-origin: 270px 90px; transition: transform 0.3s ease; transform: ${isMcbOn ? 'rotate(0deg)' : 'rotate(35deg)'};">
                <rect x="264" y="60" width="12" height="32" rx="4" fill="${isMcbOn ? '#10b981' : '#ef4444'}" stroke="#ffffff" stroke-width="1"/>
              </g>
              <text x="270" y="120" fill="${isMcbOn ? '#10b981' : '#ef4444'}" font-size="8.5" font-weight="700" text-anchor="middle">
                Tuas: ${isMcbOn ? 'ON' : 'TRIP'}
              </text>
              <text x="270" y="130" fill="#64748b" font-size="7" text-anchor="middle">(klik di sini)</text>
            </g>

            <!-- 5. BIMETAL (Thermal Trip) -->
            <g class="mcb-part" id="part-bimetal">
              <rect id="hl-bimetal" x="125" y="125" width="45" height="75" rx="6" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3" opacity="${activeHighlight === 'hl-bimetal' ? 1 : 0}"/>
              <path d="${isMcbOn && isRunning && (analysis.kind === 'thermal' || analysis.kind === 'caution')
                ? 'M 145 130 Q 162 165 145 195'
                : 'M 145 130 L 145 195'}"
                stroke="${isMcbOn && isRunning && (analysis.kind === 'thermal' || analysis.kind === 'caution') ? '#f97316' : '#ea580c'}"
                stroke-width="7" stroke-linecap="round" fill="none"
                style="transition: all 1.8s ease-in-out;"
              />
              <text x="110" y="165" fill="#f97316" font-size="8.5" font-weight="700" text-anchor="end">Bimetal (Termal)</text>
            </g>

            <!-- 6. KUMPARAN SOLENOID (Magnetic Trip) -->
            <g class="mcb-part" id="part-coil">
              <rect id="hl-coil" x="175" y="125" width="55" height="75" rx="6" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="4,3" opacity="${activeHighlight === 'hl-coil' ? 1 : 0}"/>
              <rect x="195" y="135" width="16" height="55" rx="3" fill="${isMcbOn && isRunning && analysis.kind === 'magnetic' ? '#38bdf8' : '#3b82f6'}" stroke="#60a5fa" stroke-width="1.5"/>
              <path d="M 190 142 Q 203 148 216 142 M 190 154 Q 203 160 216 154 M 190 166 Q 203 172 216 166 M 190 178 Q 203 184 216 178" stroke="#facc15" stroke-width="2.5" fill="none"/>
              <text x="240" y="165" fill="#60a5fa" font-size="8.5" font-weight="700">Kumparan (Magnetik)</text>
            </g>

            <!-- 7. TERMINAL OUTPUT (Bawah) -->
            <g class="mcb-part">
              <rect x="150" y="215" width="40" height="22" rx="4" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
              <circle cx="170" cy="226" r="4" fill="#0f172a"/>
              <text x="170" y="248" fill="#94a3b8" font-size="9" font-weight="700" text-anchor="middle">Terminal Output</text>
            </g>

            <!-- 8. BEBAN PENERANGAN (LAMPU INDIKATOR) -->
            <g class="mcb-part" id="part-lamp">
              <line x1="170" y1="237" x2="170" y2="265" stroke="#ef4444" stroke-width="2.5"/>
              <circle cx="170" cy="285" r="16" fill="${isMcbOn ? 'url(#lamp-glow-grad)' : '#334155'}" stroke="${isMcbOn ? '#facc15' : '#475569'}" stroke-width="2" filter="${isMcbOn ? 'url(#mcb2-glow)' : 'none'}"/>
              <path d="M 165 290 L 168 280 L 172 280 L 175 290" stroke="${isMcbOn ? '#b45309' : '#64748b'}" stroke-width="1.5" fill="none"/>
              <text x="200" y="290" fill="${isMcbOn ? '#facc15' : '#64748b'}" font-size="9" font-weight="700">Beban Lampu: ${isMcbOn ? 'MENYALA' : 'PADAM'}</text>
            </g>

            <!-- JALUR ARUS LISTRIK (BERGERAK SAAT ON, HILANG SAAT TRIP) -->
            ${isMcbOn ? `
              <g class="mcb2-flow-group">
                <path class="mcb2-flow-line" d="M 170 44 L 170 65 L 170 100 L 145 130 L 145 195 L 170 215 L 170 269" fill="none" stroke="#facc15" stroke-width="3" stroke-dasharray="6,4"/>
              </g>
            ` : ''}

            <!-- KILATAN HUBUNG SINGKAT (Saat Short Circuit) -->
            ${isRunning && analysis.kind === 'magnetic' ? `
              <g id="short-flash" filter="url(#mcb2-glow)">
                <polygon points="170,85 155,105 168,105 160,125 185,100 172,100" fill="#facc15" stroke="#ef4444" stroke-width="1.5"/>
                <text x="170" y="80" fill="#ef4444" font-size="11" font-weight="900" text-anchor="middle">KORSLET!</text>
              </g>
            ` : ''}
          </svg>
        </div>

        <!-- Kolom Kanan: Panel Samping (Status, Meter Zona, 3 Steps, Result) -->
        <div class="mcb2-side-panel">
          <!-- Badge Status -->
          <div class="mcb2-status-badge ${isMcbOn ? 'status-on' : 'status-trip'}" id="mcb2-status-badge">
            <i class="bi ${isMcbOn ? 'bi-check-circle-fill' : 'bi-slash-circle-fill'}"></i>
            <span id="mcb2-status-badge-txt">${isMcbOn ? `MCB ON — Mengalirkan ${measuredAmps} A` : 'MCB TRIP — Aliran Terputus Aman (0 A)'}</span>
          </div>

          <!-- Meter Zona Arus Logaritmik -->
          <div class="mcb2-meter-box">
            <div class="meter-head">
              <span class="meter-label"><i class="bi bi-speedometer2"></i> Arus Terukur:</span>
              <span class="meter-value" id="mcb2-meter-val" style="color: ${meterColor};">
                ${isMcbOn ? `${measuredAmps} A` : '0 A (TRIP)'}
              </span>
            </div>

            <div class="mcb2-zone-meta">
              <span id="mcb2-meta-load">Beban I = <strong>${loadAmps} A</strong> (${m.toFixed(2)} × In)</span>
              <span id="mcb2-meta-rating">Rating In = <strong>${ratingIn} A</strong> (${curve})</span>
            </div>

            <!-- Bar Zona Berwarna -->
            <div class="mcb2-zone-track">
              <!-- Zona Aman (hijau) -->
              <div class="mcb2-zone-seg zone-safe" style="left: 0%; width: ${p113}%;" title="Zona Aman (≤ 1,13 In)"></div>
              <!-- Zona Waspada (kuning) -->
              <div class="mcb2-zone-seg zone-caution" style="left: ${p113}%; width: ${Math.max(0, p145 - p113)}%;" title="Zona Waspada (1,13–1,45 In)"></div>
              <!-- Zona Trip Termal (oranye) -->
              <div class="mcb2-zone-seg zone-thermal" style="left: ${p145}%; width: ${Math.max(0, pLo - p145)}%;" title="Trip Termal (1,45 In – ${CURVES[curve].lo} In)"></div>
              <!-- Zona Abu-abu / Transisi (loreng/oranye-merah) -->
              <div class="mcb2-zone-seg" style="left: ${pLo}%; width: ${Math.max(0, pHi - pLo)}%; background: repeating-linear-gradient(45deg, #f97316, #f97316 4px, #ef4444 4px, #ef4444 8px);" title="Zona Abu-abu Magnetik (${CURVES[curve].lo}–${CURVES[curve].hi} In)"></div>
              <!-- Zona Trip Magnetik Instan (merah) -->
              <div class="mcb2-zone-seg zone-magnetic" style="left: ${pHi}%; width: ${Math.max(0, 100 - pHi)}%;" title="Trip Magnetik Instan (≥ ${CURVES[curve].hi} In)"></div>

              <!-- Garis Penanda Skala -->
              <div class="mcb2-zone-mark" style="left: ${p1}%;"><span class="mcb2-zone-mark-label">In</span></div>
              <div class="mcb2-zone-mark" style="left: ${p113}%;"><span class="mcb2-zone-mark-label">1,13×</span></div>
              <div class="mcb2-zone-mark" style="left: ${p145}%;"><span class="mcb2-zone-mark-label">1,45×</span></div>
              <div class="mcb2-zone-mark" style="left: ${pLo}%;"><span class="mcb2-zone-mark-label">${curve}:${CURVES[curve].lo}×</span></div>
              <div class="mcb2-zone-mark" style="left: ${pHi}%;"><span class="mcb2-zone-mark-label">${CURVES[curve].hi}×</span></div>

              <!-- Penunjuk ▲ Posisi Arus Beban -->
              <div class="mcb2-zone-pointer" id="mcb2-zone-pointer" style="left: ${pointerPct}%;">▲</div>
            </div>
          </div>

          <!-- Ringkasan Prediksi Cepat -->
          <div class="mcb2-pred-badge pred-${analysis.kind}" id="mcb2-pred-badge">
            <span><strong>Karakteristik:</strong> ${
              analysis.kind === 'off' ? 'OFF (0 A)' :
              (analysis.kind === 'normal' ? 'Aman (Normal)' :
              (analysis.kind === 'caution' ? 'Waspada (Beban Lebih Ringan)' :
              (analysis.kind === 'thermal' ? 'Trip Termal Bimetal' : 'Trip Magnetik Instan Solenoid')))
            }</span>
            <span><strong>Estimasi:</strong> ${
              analysis.kind === 'off' || analysis.kind === 'normal' ? 'Tidak Trip' : formatTime(analysis.timeSec)
            } ${analysis.grayZone ? '(Zona Abu-abu)' : ''}</span>
          </div>

          <!-- Daftar 3 Langkah Kejadian -->
          <div class="mcb2-steps-container">
            <div class="steps-title"><i class="bi bi-list-ol"></i> Apa yang terjadi?</div>
            <ul class="mcb2-steps-list" id="mcb2-steps-list">
              ${renderStepsHTML()}
            </ul>
          </div>

          <!-- Kotak Hasil Analisis -->
          <div class="mcb2-result-box result-${resultNote.type}" id="mcb2-result-box">
            <div class="result-title" id="mcb2-result-title"><i class="bi bi-shield-shaded"></i> ${resultNote.title}</div>
            <div class="result-desc" id="mcb2-result-desc">${resultNote.text}</div>
          </div>

          <!-- Tombol Reset / Re-Arm -->
          <button id="btn-mcb2-reset" class="btn-mcb2-reset">
            <i class="bi bi-arrow-counterclockwise"></i> Nyalakan Kembali (Reset)
          </button>

          <!-- Tombol Kembali ke Pengaturan (Hanya Layar <= 768px) -->
          <button type="button" id="btn-mcb2-back-ctrl" class="mcb2-back-ctrl">
            <i class="bi bi-sliders"></i> Ubah Pengaturan
          </button>
        </div>
      </div>

      <!-- Grafik Kurva Trip Waktu-Arus Log-Log (IEC 60898-1) -->
      <div class="mcb2-curve-graph-card">
        <div class="curve-graph-header">
          <div class="curve-graph-title">
            <i class="bi bi-graph-up"></i> Karakteristik Waktu-Arus Kurva ${curve} (IEC 60898-1)
          </div>
          <span class="curve-graph-legend" id="mcb2-curve-legend">
            Titik Kerja: <strong>${m.toFixed(2)} × In (${loadAmps} A)</strong> &bull; t = <strong>${analysis.kind === 'normal' || analysis.kind === 'off' ? 'Tidak Trip' : formatTime(analysis.timeSec)}</strong>
          </span>
        </div>
        <div class="curve-graph-svg-wrap">
          ${renderTripCurveSVG(ratingIn, curve, loadAmps, analysis)}
        </div>
      </div>
    `;
  }

  // Initial Setup: Bangun kontainer pembungkus, panel kontrol, dan stage dinamis
  container.innerHTML = `
    <div class="mcb2-wrapper">
      <div class="mcb2-instruction-box">
        <i class="bi bi-info-circle-fill"></i>
        <span>Atur <strong>Rating (In)</strong>, <strong>Kurva Trip</strong>, dan <strong>Arus Beban (I)</strong>, lalu klik <strong>Jalankan Simulasi</strong> untuk mengamati respons proteksi MCB.</span>
      </div>
      <div id="mcb2-controls"></div>
      <div id="mcb2-dynamic"></div>
      <p class="mcb-widget-caption" style="margin-top: 14px;">
        MCB melindungi instalasi kabel listrik dari beban lebih (arus berlebih terus-menerus) dan hubung singkat (lonjakan arus masif seketika). Klik tuas handle untuk simulasi saklar manual.
      </p>
      <div class="mcb2-footnote">
        Estimasi edukatif berdasarkan karakteristik IEC 60898-1. Waktu trip nyata bergantung pada produk dan suhu kerja.
      </div>
    </div>
  `;

  // Delegasi Event Klik pada Area Dinamis (Dipasang SEKALI di dynContainer)
  const dynContainer = container.querySelector('#mcb2-dynamic');
  if (dynContainer) {
    dynContainer.addEventListener('click', e => {
      const backBtn = e.target.closest('#btn-mcb2-back-ctrl');
      if (backBtn) {
        playUIClick();
        scrollToControls();
        return;
      }
      const resetBtn = e.target.closest('#btn-mcb2-reset');
      if (resetBtn) {
        playUIClick();
        clearAllTimers();
        isMcbOn = true;
        isRunning = false;
        measuredAmps = loadAmps;
        activeHighlight = 'hl-contacts';
        updatePredictionState();
        renderDynamic();
        return;
      }
      const leverBtn = e.target.closest('#part-lever');
      if (leverBtn) {
        toggleManualLever();
        return;
      }
    });
  }

  // Pause flow line saat tab tidak terlihat untuk hemat baterai/CPU di mobile
  let _docAC = new AbortController();
  const handleVisibilityChange = () => {
    const flowLines = container.querySelectorAll('.mcb2-flow-line');
    flowLines.forEach(line => {
      line.style.animationPlayState = (document.hidden || !isMcbOn) ? 'paused' : 'running';
    });
  };
  document.addEventListener('visibilitychange', handleVisibilityChange, { signal: _docAC.signal });

  // Observer pembersihan otomatis saat container dilepas dari DOM
  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      cleanup();
    }
  });
  if (container.parentNode) {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function cleanup() {
    clearAllTimers();
    _docAC.abort();
    observer.disconnect();
    container._cleanupMcbWidget = null;
  }
  container._cleanupMcbWidget = cleanup;

  updatePredictionState();
  renderControls();
  renderDynamic();
}
