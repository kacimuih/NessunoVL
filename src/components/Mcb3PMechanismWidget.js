// Interactive 3-Phase MCB Mechanism Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderMcb3PMechanismWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 1. Konstanta Standar IEC 60898-1
  const RATINGS = [6, 10, 16, 20, 25, 32, 40, 50, 63]; // In (A)
  const CURVES = { B: { lo: 3, hi: 5 }, C: { lo: 5, hi: 10 }, D: { lo: 10, hi: 20 } };

  // 2. State Widget
  let ratingIn = 16;
  let curve = 'C';
  let loadAmps = 10;    // Arus beban normal per fasa
  let currentScenario = 'normal'; // 'normal' | 'fault_r' | 'no_bar'
  let animTimers = [];

  // Status kontak per fasa: { r: boolean, s: boolean, t: boolean } (true = ON / tutup)
  let contacts = { r: true, s: true, t: true };
  let phaseStatus = { r: 'NORMAL', s: 'NORMAL', t: 'NORMAL' };
  let phaseAmps = { r: 10, s: 10, t: 10 };
  let motorStatus = 'RUNNING'; // 'RUNNING' | 'STOPPED' | 'SINGLE_PHASING'
  let tieBarOffset = 0; // px geser ke bawah

  // Konversi slider logaritmik (0.5 A s.d. 1000 A)
  const ampsToPos = a => Math.round(1000 * Math.log(Math.max(0.5, a) / 0.5) / Math.log(2000));
  const posToAmps = v => {
    const a = 0.5 * Math.pow(2000, v / 1000);
    return a < 10 ? Math.round(a * 10) / 10 : (a < 100 ? Math.round(a) : Math.round(a / 5) * 5);
  };

  // Estimasi daya motor 3-fasa (P = √3 × V × I × cos φ) V=380V, cos φ=0.85
  const calcMotorPowerKw = amps => (Math.sqrt(3) * 380 * amps * 0.85 / 1000).toFixed(1);
  const calcMotorHp = kw => (kw * 1.341).toFixed(1);

  // Analisis trip
  function analyzeTrip(In, curveKey, I) {
    const { lo, hi } = CURVES[curveKey];
    const m = I / In;
    if (I <= 0) return { m, kind: 'off' };
    if (m <= 1.13) return { m, kind: 'normal' };
    if (m >= hi) return { m, kind: 'magnetic', timeSec: 0.05 };
    const timeSec = 3600 * Math.pow(0.45 / (m - 1), 2);
    return {
      m,
      kind: m < 1.45 ? 'caution' : 'thermal',
      grayZone: m >= lo,
      timeSec
    };
  }


  let steps = [
    { text: 'Ketiga fasa R, S, T terhubung normal menyuplai motor 3-fasa.', status: 'done' },
    { text: 'Batang penghubung (Common Trip Bar) dalam posisi standby.', status: 'done' },
    { text: 'Rotor motor berputar simetris dan seimbang.', status: 'done' }
  ];

  let resultNote = {
    title: 'Kondisi 3-Fasa Seimbang (Normal)',
    text: 'Ketiga kutub MCB ON bersamaan. Motor 3-fasa bekerja efisien tanpa dengungan beban hilang fasa.',
    type: 'normal'
  };

  function clearAllTimers() {
    animTimers.forEach(t => clearTimeout(t));
    animTimers = [];
  }

  function setStepsState(stepStatuses) {
    stepStatuses.forEach((st, idx) => {
      if (steps[idx]) steps[idx].status = st;
    });
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

  function syncControlTexts() {
    const inValEl = container.querySelector('#ctrl-m3-in-val');
    const ampsNumEl = container.querySelector('#ctrl-m3-amps-num');
    const ampsRangeEl = container.querySelector('#ctrl-m3-amps-range');
    const ampsMultEl = container.querySelector('#ctrl-m3-amps-mult');
    const pKw = calcMotorPowerKw(loadAmps);
    const pHp = calcMotorHp(pKw);

    if (inValEl) inValEl.textContent = `${ratingIn} A`;
    if (ampsNumEl) ampsNumEl.value = loadAmps;
    if (ampsRangeEl) ampsRangeEl.value = ampsToPos(loadAmps);
    if (ampsMultEl) ampsMultEl.textContent = `= ${(loadAmps / ratingIn).toFixed(1)} × In (${pKw} kW / ${pHp} HP)`;
  }

  // 3. Eksekusi Skenario Pengujian 3-Fasa
  function applyScenario(sc) {
    clearAllTimers();
    currentScenario = sc;

    const pKw = calcMotorPowerKw(loadAmps);
    const m = loadAmps / ratingIn;

    if (sc === 'normal') {
      contacts = { r: true, s: true, t: true };
      phaseStatus = { r: 'NORMAL', s: 'NORMAL', t: 'NORMAL' };
      phaseAmps = { r: loadAmps, s: loadAmps, t: loadAmps };
      motorStatus = 'RUNNING';
      tieBarOffset = 0;
      steps = [
        { text: `Ketiga fasa R, S, T mengalirkan arus seimbang (${loadAmps} A per fasa).`, status: 'done' },
        { text: 'Common Trip Bar dalam posisi standby mengaitkan ketiga kutub.', status: 'done' },
        { text: `Motor 3-fasa (${pKw} kW) berputar simetris dan stabil.`, status: 'done' }
      ];
      resultNote = {
        title: `Kondisi 3-Fasa Seimbang — Normal (${loadAmps} A)`,
        text: `Tegangan 380V simetris menyuplai motor. Arus ${loadAmps} A (${m.toFixed(2)} × In) berada pada kapasitas aman rating ${ratingIn} A.`,
        type: 'normal'
      };
      renderDynamic();

    } else if (sc === 'fault_r') {
      // Gangguan Fasa R: arus gangguan 2.5x In
      const faultI = Math.round(ratingIn * 2.5);
      contacts = { r: true, s: true, t: true };
      phaseStatus = { r: 'BESAR', s: 'NORMAL', t: 'NORMAL' };
      phaseAmps = { r: faultI, s: loadAmps, t: loadAmps };
      motorStatus = 'RUNNING';
      tieBarOffset = 0;

      const analysis = analyzeTrip(ratingIn, curve, faultI);

      steps = [
        { text: `Gangguan beban lebih / korslet di Fasa R (Arus melonjak ${faultI} A = ${analysis.m.toFixed(1)} × In!).`, status: 'active' },
        { text: 'Kutub R trip & Common Trip Bar terdorong bergeser.', status: 'pending' },
        { text: 'Kutub S & T dipaksa ikut terbuka serentak. Motor berhenti aman.', status: 'pending' }
      ];
      resultNote = {
        title: 'Proteksi Trip Serentak (Sesuai PUIL 2011)',
        text: `Gangguan terjadi di Fasa R (${faultI} A), namun Common Trip Bar menjamin Fasa S dan T ikut terputus serentak.`,
        type: 'warning'
      };
      renderDynamic();

      // Langkah 1: Kutub R trip
      animTimers.push(setTimeout(() => {
        contacts.r = false;
        phaseStatus.r = 'PUTUS';
        phaseAmps.r = 0;
        tieBarOffset = 14;
        setStepsState(['done', 'active', 'pending']);
        renderDynamic();
      }, 500));

      // Langkah 2: S dan T ikut ditarik trip serempak
      animTimers.push(setTimeout(() => {
        contacts.s = false;
        contacts.t = false;
        phaseStatus.s = 'PUTUS';
        phaseStatus.t = 'PUTUS';
        phaseAmps.s = 0;
        phaseAmps.t = 0;
        motorStatus = 'STOPPED';
        setStepsState(['done', 'done', 'done']);
        resultNote = {
          title: 'Sistem Terlindungi Sempurna (AMAN)',
          text: 'PUIL 2011 Pasal 510 mensyaratkan MCB 3-fasa memutus seluruh kutub secara simultan agar motor tidak terbakar akibat hilangnya 1 fasa.',
          type: 'safe'
        };
        renderDynamic();
      }, 1100));

    } else if (sc === 'no_bar') {
      // Skenario berbahaya: tanpa batang penghubung
      const faultI = Math.round(ratingIn * 2.5);
      const singlePhaseAmps = Math.round(loadAmps * 1.73 * 10) / 10;
      contacts = { r: true, s: true, t: true };
      phaseStatus = { r: 'BESAR', s: 'NORMAL', t: 'NORMAL' };
      phaseAmps = { r: faultI, s: loadAmps, t: loadAmps };
      motorStatus = 'RUNNING';
      tieBarOffset = 0;
      steps = [
        { text: `Gangguan di Fasa R (${faultI} A). Tanpa batang kopel, Fasa R trip sendiri!`, status: 'active' },
        { text: `Fasa S & T MASIH HIDUP (${singlePhaseAmps} A) mengalirkan daya (Single Phasing).`, status: 'pending' },
        { text: 'Motor mendengung keras, panas ekstrem, dan lilitan stator terancam terbakar!', status: 'pending' }
      ];
      resultNote = {
        title: 'Simulasi Bahaya Tanpa Batang Kopel',
        text: 'Jika 3 MCB 1-fasa dipakai tanpa kopel mekanik resmi, hilangnya 1 fasa akan merusak motor 3-fasa.',
        type: 'danger'
      };
      renderDynamic();

      // R trip sendiri, S dan T tertinggal hidup
      animTimers.push(setTimeout(() => {
        contacts.r = false;
        phaseStatus.r = 'PUTUS';
        phaseStatus.s = 'HIDUP';
        phaseStatus.t = 'HIDUP';
        phaseAmps.r = 0;
        phaseAmps.s = singlePhaseAmps;
        phaseAmps.t = singlePhaseAmps;
        motorStatus = 'SINGLE_PHASING';
        setStepsState(['done', 'done', 'done']);
        resultNote = {
          title: 'KONDISI FATAL: SINGLE PHASING (BERBAHAYA)',
          text: `Arus pada fasa S & T melonjak tajam (${singlePhaseAmps} A). Motor kehilangan medan putar putar, mendengung hebat dan lilitan stator akan hangus terbakar dalam hitungan detik!`,
          type: 'danger'
        };
        renderDynamic();
      }, 700));
    }
  }

  // 4. Panel Kontrol (Dirender SEKALI)
  function renderControls() {
    const ctrlContainer = container.querySelector('#m3-controls');
    if (!ctrlContainer) return;

    const pKw = calcMotorPowerKw(loadAmps);
    const pHp = calcMotorHp(pKw);

    ctrlContainer.innerHTML = `
      <div class="mcb2-ctrl">
        <div class="mcb2-ctrl-block">
          <div class="mcb2-ctrl-title">
            <span>Rating MCB 3P (In):</span>
            <strong id="ctrl-m3-in-val">${ratingIn} A</strong>
          </div>
          <div class="mcb2-chip-row" id="ctrl-m3-rating" role="group" aria-label="Rating MCB 3P">
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
          <div class="mcb2-chip-row" id="ctrl-m3-curve" role="group" aria-label="Kurva trip 3P">
            <button class="mcb2-chip ${curve === 'B' ? 'active' : ''}" data-curve="B" aria-pressed="${curve === 'B'}">B (3–5 In)</button>
            <button class="mcb2-chip ${curve === 'C' ? 'active' : ''}" data-curve="C" aria-pressed="${curve === 'C'}">C (5–10 In)</button>
            <button class="mcb2-chip ${curve === 'D' ? 'active' : ''}" data-curve="D" aria-pressed="${curve === 'D'}">D (10–20 In)</button>
          </div>
        </div>

        <div class="mcb2-ctrl-block">
          <div class="mcb2-ctrl-title">
            <span>Arus Beban Motor (I):</span>
            <div class="mcb2-ctrl-amps-input-wrap">
              <input id="ctrl-m3-amps-num" type="number" min="0.5" max="1000" step="0.5" inputmode="decimal" value="${loadAmps}">
              <span style="font-size: 0.82rem; font-weight: 700;">A</span>
              <span id="ctrl-m3-amps-mult">= ${(loadAmps / ratingIn).toFixed(1)} × In (${pKw} kW / ${pHp} HP)</span>
            </div>
          </div>

          <input id="ctrl-m3-amps-range" type="range" min="0" max="1000" step="1" value="${ampsToPos(loadAmps)}" aria-label="Arus beban motor">

          <div class="mcb2-chip-row" id="ctrl-m3-presets">
            <button class="mcb2-chip" data-preset="normal">Beban Aman (${(0.6 * ratingIn).toFixed(1)} A)</button>
            <button class="mcb2-chip" data-preset="heavy">Beban Berat (${(1.5 * ratingIn).toFixed(1)} A)</button>
            <button class="mcb2-chip" data-preset="short">Korslet (${Math.round(CURVES[curve].hi * 1.2 * ratingIn)} A)</button>
          </div>
        </div>
      </div>

      <!-- 3 Tombol Skenario Utama -->
      <div class="mcb2-scenarios" role="group" aria-label="Skenario Pengujian MCB 3 Fasa">
        <button class="mcb2-sc-btn ${currentScenario === 'normal' ? 'active' : ''}" data-sc="normal" aria-pressed="${currentScenario === 'normal'}">
          <div class="sc-icon"><i class="bi bi-shield-check"></i></div>
          <div class="sc-info">
            <span class="sc-title">Normal 3-Fasa</span>
            <span class="sc-sub">R, S, T simetris menyuplai motor</span>
          </div>
        </button>

        <button class="mcb2-sc-btn ${currentScenario === 'fault_r' ? 'active' : ''}" data-sc="fault_r" aria-pressed="${currentScenario === 'fault_r'}">
          <div class="sc-icon"><i class="bi bi-link-45deg"></i></div>
          <div class="sc-info">
            <span class="sc-title">Gangguan Fasa R (Standar PUIL)</span>
            <span class="sc-sub">Common bar memutus 3 fasa serempak</span>
          </div>
        </button>

        <button class="mcb2-sc-btn ${currentScenario === 'no_bar' ? 'active' : ''}" data-sc="no_bar" aria-pressed="${currentScenario === 'no_bar'}">
          <div class="sc-icon"><i class="bi bi-exclamation-triangle-fill" style="color:#ef4444;"></i></div>
          <div class="sc-info">
            <span class="sc-title">Tanpa Batang Penghubung</span>
            <span class="sc-sub">Simulasi bahaya single phasing</span>
          </div>
        </button>
      </div>
    `;

    // Pasang Event Listeners Kontrol SEKALI
    const inValEl = ctrlContainer.querySelector('#ctrl-m3-in-val');
    const ampsNumEl = ctrlContainer.querySelector('#ctrl-m3-amps-num');
    const ampsRangeEl = ctrlContainer.querySelector('#ctrl-m3-amps-range');

    function syncM3PresetLabels() {
      const normalBtn = ctrlContainer.querySelector('[data-preset="normal"]');
      const heavyBtn = ctrlContainer.querySelector('[data-preset="heavy"]');
      const shortBtn = ctrlContainer.querySelector('[data-preset="short"]');
      if (normalBtn) normalBtn.textContent = `Beban Aman (${(0.6 * ratingIn).toFixed(1)} A)`;
      if (heavyBtn) heavyBtn.textContent = `Beban Berat (${(1.5 * ratingIn).toFixed(1)} A)`;
      if (shortBtn) shortBtn.textContent = `Korslet (${Math.round(CURVES[curve].hi * 1.2 * ratingIn)} A)`;
    }

    // Rating Chips
    ctrlContainer.querySelectorAll('#ctrl-m3-rating .mcb2-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        playUIClick();
        ratingIn = Number(btn.getAttribute('data-in'));
        ctrlContainer.querySelectorAll('#ctrl-m3-rating .mcb2-chip').forEach(b => {
          const isAct = Number(b.getAttribute('data-in')) === ratingIn;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        });
        if (inValEl) inValEl.textContent = `${ratingIn} A`;
        syncControlTexts();
        syncM3PresetLabels();
        applyScenario(currentScenario);
      });
    });

    // Curve Chips
    ctrlContainer.querySelectorAll('#ctrl-m3-curve .mcb2-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        playUIClick();
        curve = btn.getAttribute('data-curve');
        ctrlContainer.querySelectorAll('#ctrl-m3-curve .mcb2-chip').forEach(b => {
          const isAct = b.getAttribute('data-curve') === curve;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        });
        syncM3PresetLabels();
        applyScenario(currentScenario);
      });
    });

    // Slider Arus
    ampsRangeEl.addEventListener('input', () => {
      loadAmps = posToAmps(Number(ampsRangeEl.value));
      ampsNumEl.value = loadAmps;
      syncControlTexts();
      applyScenario('normal');
    });

    // Input Angka Arus
    const handleNumInput = () => {
      let val = parseFloat(ampsNumEl.value);
      if (isNaN(val) || val < 0.5) val = 0.5;
      if (val > 1000) val = 1000;
      loadAmps = val;
      ampsRangeEl.value = ampsToPos(loadAmps);
      syncControlTexts();
      applyScenario('normal');
    };
    ampsNumEl.addEventListener('input', handleNumInput);
    ampsNumEl.addEventListener('change', () => {
      ampsNumEl.value = loadAmps;
    });

    // Presets
    ctrlContainer.querySelectorAll('#ctrl-m3-presets .mcb2-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        playUIClick();
        const p = btn.getAttribute('data-preset');
        if (p === 'normal') {
          loadAmps = Math.round(0.6 * ratingIn * 10) / 10;
          syncControlTexts();
          applyScenario('normal');
        } else if (p === 'heavy') {
          loadAmps = Math.round(1.5 * ratingIn);
          syncControlTexts();
          applyScenario('fault_r');
        } else if (p === 'short') {
          loadAmps = Math.round(CURVES[curve].hi * 1.2 * ratingIn);
          syncControlTexts();
          applyScenario('fault_r');
        }
      });
    });

    // 3 Skenario Buttons
    ctrlContainer.querySelectorAll('.mcb2-sc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playUIClick();
        ctrlContainer.querySelectorAll('.mcb2-sc-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const sc = btn.getAttribute('data-sc');
        if (sc) applyScenario(sc);
      });
    });
  }

  // 5. Area Dinamis (SVG 3P, Chips Fasa, Steps, Result)
  function renderDynamic() {
    const dynContainer = container.querySelector('#m3-dynamic');
    if (!dynContainer) return;

    const isAllOff = !contacts.r && !contacts.s && !contacts.t;
    const isSinglePhasing = motorStatus === 'SINGLE_PHASING';
    const pKw = calcMotorPowerKw(loadAmps);

    dynContainer.innerHTML = `
      <div class="mcb2-stage">
        <!-- Kolom Kiri: Penampang SVG 3 Kutub & Motor 3-Fasa -->
        <div class="mcb2-svg-container">
          <svg id="mcb3p-svg" viewBox="0 0 340 375" class="mcb2-svg">
            <defs>
              <filter id="m3-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- KOTAK 3 KUTUB MCB (R, S, T) -->
            <g stroke="#334155" stroke-width="1.5">
              <rect x="25" y="20" width="85" height="190" rx="8" fill="#1e293b" />
              <rect x="125" y="20" width="85" height="190" rx="8" fill="#1e293b" />
              <rect x="225" y="20" width="85" height="190" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
            </g>

            <!-- Label Kode Rating Resmi pada MCB 3P -->
            <g class="mcb-plate" pointer-events="none">
              <rect x="135" y="152" width="65" height="28" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1.2"/>
              <text x="167" y="169" fill="#facc15" font-size="12" font-weight="900" text-anchor="middle" font-family="monospace">${curve}${ratingIn}</text>
              <text x="167" y="177" fill="#94a3b8" font-size="6.5" font-weight="700" text-anchor="middle">400V~ 3P</text>
            </g>

            <!-- Label Fasa di Atas Terminal -->
            <text x="67" y="38" fill="#ef4444" font-size="11" font-weight="800" text-anchor="middle">Fasa R</text>
            <text x="167" y="38" fill="#facc15" font-size="11" font-weight="800" text-anchor="middle">Fasa S</text>
            <text x="267" y="38" fill="#94a3b8" font-size="11" font-weight="800" text-anchor="middle">Fasa T</text>

            <!-- Terminal Input Atas -->
            <rect x="57" y="10" width="20" height="14" rx="3" fill="#64748b"/>
            <rect x="157" y="10" width="20" height="14" rx="3" fill="#64748b"/>
            <rect x="257" y="10" width="20" height="14" rx="3" fill="#64748b"/>

            <!-- KONTAK KUTUB R -->
            <g id="m3-contact-r">
              <line x1="67" y1="24" x2="67" y2="52" stroke="#ef4444" stroke-width="3"/>
              <circle cx="67" cy="54" r="4.5" fill="#facc15"/>
              <line x1="67" y1="54" x2="67" y2="86" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"
                style="transform-origin: 67px 54px; transition: transform 0.2s ease-out; transform: ${contacts.r ? 'rotate(0deg)' : 'rotate(26deg)'};"
              />
              <rect x="62" y="96" width="10" height="35" rx="2" fill="${phaseStatus.r === 'BESAR' ? '#ef4444' : '#64748b'}"/>
              <text x="67" y="142" fill="#ef4444" font-size="7" font-weight="bold" text-anchor="middle">Trip R</text>
              <line x1="67" y1="150" x2="67" y2="195" stroke="#ef4444" stroke-width="3"/>
            </g>

            <!-- KONTAK KUTUB S -->
            <g id="m3-contact-s">
              <line x1="167" y1="24" x2="167" y2="52" stroke="#facc15" stroke-width="3"/>
              <circle cx="167" cy="54" r="4.5" fill="#facc15"/>
              <line x1="167" y1="54" x2="167" y2="86" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"
                style="transform-origin: 167px 54px; transition: transform 0.2s ease-out; transform: ${contacts.s ? 'rotate(0deg)' : 'rotate(26deg)'};"
              />
              <rect x="162" y="96" width="10" height="35" rx="2" fill="#64748b"/>
              <text x="167" y="142" fill="#facc15" font-size="7" font-weight="bold" text-anchor="middle">Trip S</text>
              <line x1="167" y1="150" x2="167" y2="195" stroke="#facc15" stroke-width="3"/>
            </g>

            <!-- KONTAK KUTUB T -->
            <g id="m3-contact-t">
              <line x1="267" y1="24" x2="267" y2="52" stroke="#94a3b8" stroke-width="3"/>
              <circle cx="267" cy="54" r="4.5" fill="#facc15"/>
              <line x1="267" y1="54" x2="267" y2="86" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"
                style="transform-origin: 267px 54px; transition: transform 0.2s ease-out; transform: ${contacts.t ? 'rotate(0deg)' : 'rotate(26deg)'};"
              />
              <rect x="262" y="96" width="10" height="35" rx="2" fill="#64748b"/>
              <text x="267" y="142" fill="#94a3b8" font-size="7" font-weight="bold" text-anchor="middle">Trip T</text>
              <line x1="267" y1="150" x2="267" y2="195" stroke="#94a3b8" stroke-width="3"/>
            </g>

            <!-- Terminal Output Bawah -->
            <rect x="57" y="195" width="20" height="14" rx="3" fill="#64748b"/>
            <rect x="157" y="195" width="20" height="14" rx="3" fill="#64748b"/>
            <rect x="257" y="195" width="20" height="14" rx="3" fill="#64748b"/>

            <!-- BATANG PENGHUBUNG (COMMON TRIP BAR) -->
            ${currentScenario !== 'no_bar' ? `
              <g id="m3-tie-bar-group" style="transform: translateY(${tieBarOffset}px); transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <rect x="40" y="66" width="255" height="14" rx="5" fill="${isAllOff ? '#ef4444' : '#10b981'}" stroke="#065f46" stroke-width="1.5" filter="url(#m3-glow)"/>
                <circle cx="67" cy="73" r="3.5" fill="#f8fafc"/>
                <circle cx="167" cy="73" r="3.5" fill="#f8fafc"/>
                <circle cx="267" cy="73" r="3.5" fill="#f8fafc"/>
                <text x="167" y="76" fill="#022c22" font-size="8" font-weight="900" text-anchor="middle">COMMON TRIP BAR (TERKOPEL)</text>
              </g>
            ` : `
              <g id="m3-no-bar-indicator">
                <line x1="45" y1="73" x2="290" y2="73" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
                <rect x="100" y="65" width="135" height="16" rx="4" fill="#7f1d1d" stroke="#ef4444" stroke-width="1"/>
                <text x="167" y="76" fill="#fecaca" font-size="7.5" font-weight="bold" text-anchor="middle">⚠️ TANPA BATANG KOPEL</text>
              </g>
            `}

            <!-- KABEL KELUARAN KE MOTOR 3-FASA -->
            <path d="M 67 209 L 67 245 L 135 270" stroke="${contacts.r ? '#ef4444' : '#475569'}" stroke-width="${contacts.r ? 2.5 : 1.5}" fill="none"/>
            <path d="M 167 209 L 167 255 L 167 270" stroke="${contacts.s ? '#facc15' : '#475569'}" stroke-width="${contacts.s ? 2.5 : 1.5}" fill="none"/>
            <path d="M 267 209 L 267 245 L 200 270" stroke="${contacts.t ? '#94a3b8' : '#475569'}" stroke-width="${contacts.t ? 2.5 : 1.5}" fill="none"/>

            <!-- BEBAN MOTOR LISTRIK 3-FASA (BAWAH) -->
            <g id="m3-motor-group" transform="translate(115, 270)">
              <rect x="0" y="0" width="105" height="75" rx="10" fill="#1e293b" stroke="${isSinglePhasing ? '#ef4444' : '#3b82f6'}" stroke-width="2"/>
              <line x1="-4" y1="20" x2="0" y2="20" stroke="#64748b" stroke-width="2"/>
              <line x1="-4" y1="35" x2="0" y2="35" stroke="#64748b" stroke-width="2"/>
              <line x1="-4" y1="50" x2="0" y2="50" stroke="#64748b" stroke-width="2"/>

              <!-- Rotor Motor Berputar -->
              <g id="m3-rotor" transform="translate(52, 38)" class="${motorStatus === 'RUNNING' ? 'm3-rotor-spin' : (isSinglePhasing ? 'm3-rotor-shake' : '')}">
                <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
                <line x1="-16" y1="0" x2="16" y2="0" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
                <line x1="0" y1="-16" x2="0" y2="16" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
                <circle cx="0" cy="0" r="6" fill="#facc15"/>
              </g>

              <!-- Status Teks Motor -->
              <text x="52" y="68" fill="${motorStatus === 'RUNNING' ? '#10b981' : (isSinglePhasing ? '#ef4444' : '#94a3b8')}" font-size="7.5" font-weight="bold" text-anchor="middle">
                ${motorStatus === 'RUNNING' ? `MOTOR: ${pKw} kW NORMAL` : (isSinglePhasing ? 'MOTOR: OVERHEAT & DENGUNG' : 'MOTOR: STOPPED')}
              </text>
            </g>

            <!-- Teks Peringatan Single Phasing -->
            ${isSinglePhasing ? `
              <g filter="url(#m3-glow)">
                <text x="167" y="260" fill="#ef4444" font-size="10" font-weight="900" text-anchor="middle">OVERHEAT! (HILANG 1 FASA)</text>
              </g>
            ` : ''}
          </svg>
        </div>

        <!-- Kolom Kanan: Panel Samping (Chips Fasa, Status, 3 Steps, Result) -->
        <div class="mcb2-side-panel">
          <!-- Badge Status Utama -->
          <div class="mcb2-status-badge ${isAllOff ? 'status-trip' : (isSinglePhasing ? 'status-trip' : 'status-on')}">
            <i class="bi ${isAllOff ? 'bi-shield-fill-check' : (isSinglePhasing ? 'bi-exclamation-diamond-fill' : 'bi-check-circle-fill')}"></i>
            <span>${isAllOff ? 'MCB 3P TRIP TOTAL — R, S, T TERPUTUS' : (isSinglePhasing ? 'PERINGATAN: KONDISI SINGLE PHASING' : `MCB 3P ON — 3-FASA SEIMBANG (${loadAmps} A)`)}</span>
          </div>

          <!-- Chips Kondisi Fasa R, S, T -->
          <div class="m3-phase-chips-box">
            <div class="chips-title"><i class="bi bi-activity"></i> Arus Terukur Tiap Fasa (In = ${ratingIn} A):</div>
            <div class="m3-chips-row">
              <div class="m3-chip chip-${phaseStatus.r.toLowerCase()}">
                <span class="chip-phase" style="color:#ef4444;">Fasa R</span>
                <strong style="font-size:0.85rem; font-family:monospace;">${phaseAmps.r} A</strong>
                <span class="chip-status">${phaseStatus.r}</span>
              </div>
              <div class="m3-chip chip-${phaseStatus.s.toLowerCase()}">
                <span class="chip-phase" style="color:#facc15;">Fasa S</span>
                <strong style="font-size:0.85rem; font-family:monospace;">${phaseAmps.s} A</strong>
                <span class="chip-status">${phaseStatus.s}</span>
              </div>
              <div class="m3-chip chip-${phaseStatus.t.toLowerCase()}">
                <span class="chip-phase" style="color:#38bdf8;">Fasa T</span>
                <strong style="font-size:0.85rem; font-family:monospace;">${phaseAmps.t} A</strong>
                <span class="chip-status">${phaseStatus.t}</span>
              </div>
            </div>
          </div>

          <!-- Daftar 3 Langkah Kejadian -->
          <div class="mcb2-steps-container">
            <div class="steps-title"><i class="bi bi-list-ol"></i> Apa yang terjadi?</div>
            <ul class="mcb2-steps-list" id="m3-steps-list">
              ${renderStepsHTML()}
            </ul>
          </div>

          <!-- Kotak Hasil Analisis PUIL -->
          <div class="mcb2-result-box result-${resultNote.type}">
            <div class="result-title"><i class="bi bi-shield-check"></i> ${resultNote.title}</div>
            <div class="result-desc">${resultNote.text}</div>
          </div>

          <!-- Tombol Reset -->
          <button id="btn-mcb3p-reset" class="btn-mcb2-reset">
            <i class="bi bi-arrow-counterclockwise"></i> Reset ke Kondisi Normal
          </button>
        </div>
      </div>
    `;

    // Pasang Event Listeners Area Dinamis
    const resetBtn = dynContainer.querySelector('#btn-mcb3p-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playUIClick();
        applyScenario('normal');
        const scBtnNormal = container.querySelector('.mcb2-sc-btn[data-sc="normal"]');
        if (scBtnNormal) {
          container.querySelectorAll('.mcb2-sc-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          scBtnNormal.classList.add('active');
          scBtnNormal.setAttribute('aria-pressed', 'true');
        }
      });
    }
  }

  // Initial Setup: Bangun wrapper, panel kontrol dan stage dinamis
  container.innerHTML = `
    <div class="mcb2-wrapper">
      <div class="mcb2-instruction-box">
        <i class="bi bi-info-circle-fill"></i>
        <span>Atur <strong>Rating (In)</strong>, <strong>Kurva Trip</strong>, dan <strong>Arus Beban Motor</strong>, lalu uji beda kinerja proteksi <strong>MCB 3-Fasa Resmi (dengan Common Trip Bar)</strong> dibanding pemakaian salah tanpa batang kopel.</span>
      </div>
      <div id="m3-controls"></div>
      <div id="m3-dynamic"></div>
      <p class="mcb-widget-caption" style="margin-top: 14px;">
        PUIL 2011 mensyaratkan instalasi 3-fasa wajib menggunakan pemutus dengan kopel mekanis serentak (all-pole disconnection) agar motor listrik terlindungi dari bahaya terbakar akibat hilangnya 1 fasa (single phasing).
      </p>
      <div class="mcb2-footnote">
        Estimasi edukatif berdasarkan karakteristik IEC 60898-1 & PUIL 2011. Daya motor dihitung pada 380V (cos φ = 0,85).
      </div>
    </div>
  `;

  renderControls();
  renderDynamic();
}
