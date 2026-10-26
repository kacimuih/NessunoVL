// Interactive Hazard Spotting & Workshop Electrical Safety Simulation Widget - Virtual Lab IPL
import { playUIClick, playSuccess, playWarning } from '../utils/audioFeedback.js';
import { HAZARD_SCENE_SVG, HAZARD_GEOMETRY } from './hazardScene.js';

export function renderHazardSpotWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 6 Bahaya Kelistrikan dengan Bounding Box Presisi di SVG (600x380)
  const hazardDefinitions = [
    {
      id: 'kabel_air',
      num: 1,
      name: 'Kabel Terkelupas Dekat Genangan Air',
      kategori: 'Sengatan Listrik',
      kategoriBadge: 'badge-shock',
      risiko: 'Air adalah konduktor penghantar arus bocor yang sangat cepat ke tubuh manusia. Isolasi yang koyak di genangan air dapat menyebabkan henti jantung seketika.',
      solusi: 'Matikan MCB utama segera (LOTO), gunakan APD sarung tangan & sepatu safety isolasi, keringkan lantai kerja, lalu ganti kabel dengan kabel baru berisolasi utuh (bukan sekadar dilakban).',
      // Bounding box area objek pada SVG
      x: 35, y: 255, w: 120, h: 95,
      markerX: 95, markerY: 290
    },
    {
      id: 'stopkontak_overload',
      num: 2,
      name: 'Stop Kontak Overload (Colokan Bertumpuk)',
      kategori: 'Kebakaran',
      kategoriBadge: 'badge-fire',
      risiko: 'Beban arus kumulatif melebihi kapasitas kontak (16A), memicu kenaikan suhu ekstrem, melunakkan plastik stop kontak, dan menyulut percikan api kebakaran.',
      solusi: 'Cabut T-steker bercabang tumpuk, distribusikan beban peralatan portabel ke titik stop kontak lain yang berbeda grup fasa, dan gunakan steker berstandar SNI.',
      x: 485, y: 120, w: 90, h: 90,
      markerX: 530, markerY: 160
    },
    {
      id: 'kabel_menjuntai',
      num: 3,
      name: 'Kabel Menjuntai di Jalur Lalu Lintas',
      kategori: 'Cedera Fisik / Isolasi Rusak',
      kategoriBadge: 'badge-physical',
      risiko: 'Kabel yang melintang di lantai berisiko tersandung pekerja, tertarik paksa dari stop kontak hingga kawat konduktor putus dan memicu sengatan terbuka.',
      solusi: 'Lindungi kabel menggunakan ducting / pelindung lantai (rubber cable protector) atau pasang pipa pelindung conduit PVC di sepanjang dinding sesuai aturan PUIL.',
      x: 210, y: 285, w: 180, h: 65,
      markerX: 300, markerY: 315
    },
    {
      id: 'panel_terbuka',
      num: 4,
      name: 'Panel (PHB) Terbuka Tanpa Penutup',
      kategori: 'Sengatan Listrik',
      kategoriBadge: 'badge-shock',
      risiko: 'Rel tembaga busbar 3-fasa (R-S-T 380V) telanjang tanpa penutup akrilik/pintu panel dapat tersentuh langsung oleh tubuh pekerja atau benda logam kerja.',
      solusi: 'Pasang penutup isolator transparan di atas busbar, tutup rapat pintu panel PHB, pasang rambu peringatan tegangan tinggi, dan kunci pintu panel (LOTO).',
      x: 245, y: 65, w: 105, h: 120,
      markerX: 297, markerY: 125
    },
    {
      id: 'sambungan_terbuka',
      num: 5,
      name: 'Sambungan Hanya Dililit Isolasi, Konduktor Terlihat',
      kategori: 'Hubung Singkat',
      kategoriBadge: 'badge-short',
      risiko: 'Lilitan isolasi lepas memperlihatkan tembaga bertegangan. Rentan bersentuhan dengan kabel netral atau rangka konduktif lain memicu korsleting busur api ledakan.',
      solusi: 'Gunakan kotak sambung (T-Dos/Junction Box) standar, sambung inti kawat dengan sambungan ekor babi (pig-tail) rapi, dan tutup erat menggunakan lasdop keramik/PVC.',
      x: 395, y: 195, w: 85, h: 65,
      markerX: 435, markerY: 225
    },
    {
      id: 'pekerja_tanpa_apd',
      num: 6,
      name: 'Pekerja Menyentuh Panel Tanpa Sarung Tangan & Sepatu',
      kategori: 'Sengatan Listrik (APD)',
      kategoriBadge: 'badge-shock',
      risiko: 'Bekerja dengan tangan basah/telanjang dan sandal tipis membuat tubuh menjadi jalur hubung singkat termudah bagi arus listrik bocor menuju bumi.',
      solusi: 'Wajib patuhi SOP K3LH: kenakan sarung tangan isolasi karet rating 1000V dan sepatu safety ber-sol karet tebal non-konduktif sebelum menyentuh peralatan instalasi.',
      x: 125, y: 110, w: 105, h: 145,
      markerX: 180, markerY: 155
    }
  ];

  // Geometri bounding box presisi dari hazardScene.js
  hazardDefinitions.forEach(h => Object.assign(h, HAZARD_GEOMETRY[h.id]));

  // State
  let foundHazards = {};     // { id: true }
  let securedHazards = {};   // { id: true }
  let missCount = 0;
  let hintsLeft = 3;
  let hintActive = false;

  // Render Kerangka 1 KALI
  container.innerHTML = `
    <div class="hz2-wrapper">
      <!-- Header & Status Bar -->
      <div class="hz2-header">
        <div class="hz2-title-block">
          <h4 class="hz2-title"><i class="bi bi-search"></i> Simulasi Identifikasi & Pengamanan Bahaya Listrik</h4>
          <p class="hz2-subtitle">
            Klik bagian bengkel/ruang praktik di bawah yang melanggar standar keselamatan K3LH. Temukan <strong>6 titik bahaya</strong> lalu amankan!
          </p>
        </div>

        <div class="hz2-stats-row">
          <!-- Progress -->
          <div class="hz2-stat-chip">
            <span class="stat-label">Ditemukan:</span>
            <strong id="hz2-found-count" class="stat-val-amber">0 / 6</strong>
          </div>
          <!-- Diamankan -->
          <div class="hz2-stat-chip">
            <span class="stat-label">Diamankan:</span>
            <strong id="hz2-secured-count" class="stat-val-green">0 / 6</strong>
          </div>
          <!-- Salah Klik -->
          <div class="hz2-stat-chip">
            <span class="stat-label">Salah Klik:</span>
            <strong id="hz2-miss-count" class="stat-val-red">0</strong>
          </div>
          <!-- Tombol Petunjuk (Maks 3x) -->
          <button id="btn-hz2-hint" class="hz2-btn-hint" title="Gunakan petunjuk sorotan (mengurangi skor)">
            <i class="bi bi-lightbulb-fill"></i> Petunjuk: <span id="hz2-hint-count">3/3</span>
          </button>
        </div>
      </div>

      <!-- Area Gambar Ilustrasi SVG Bengkel (viewBox 0 0 600 380) -->
      <div class="hz2-canvas-container">
        <!-- Toast temuan bahaya (non-blocking) -->
        <div id="hz2-toast" class="hz2-scene-toast" role="status" aria-live="polite" style="display: none;"></div>

        <div class="hz2-canvas-scroll">
          <svg id="hz2-scene-svg" viewBox="0 0 600 380" class="hz2-svg-scene">
            ${HAZARD_SCENE_SVG}

            <!-- 6 HOTSPOT INTERAKTIF (Area Bounding Box Persis di Atas Objek) -->
            <g id="hz2-hotspots-group">
              ${hazardDefinitions.map(h => `
                <rect class="hz2-hotspot" data-hazard-id="${h.id}"
                  x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="6"
                  fill="transparent"
                  style="cursor: pointer; -webkit-tap-highlight-color: transparent;"
                />
              `).join('')}
            </g>

            <!-- MARKER NOMOR PIN TEMUAN (Muncul setelah Ditemukan) -->
            <g id="hz2-markers-group">
              ${hazardDefinitions.map(h => `
                <g id="hz2-pin-${h.id}" class="hz2-pin" style="opacity: 0; pointer-events: none; transition: opacity 0.3s;">
                  <line x1="${h.markerX}" y1="${h.markerY}" x2="${h.anchorX}" y2="${h.anchorY}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="${h.anchorX}" cy="${h.anchorY}" r="2.5" fill="#10b981" stroke="#ffffff" stroke-width="1"/>
                  <g class="hz2-pin-badge" style="transform-box: fill-box; transform-origin: center; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    <circle cx="${h.markerX}" cy="${h.markerY}" r="9" fill="#10b981" stroke="#ffffff" stroke-width="2" filter="url(#hz-glow)" />
                    <text x="${h.markerX}" y="${h.markerY + 3.2}" fill="#ffffff" font-size="9" font-weight="900" text-anchor="middle">${h.num}</text>
                  </g>
                </g>
              `).join('')}
            </g>

            <!-- RING PETUNJUK (PULSING HINT RINGS) -->
            <g id="hz2-hints-group">
              ${hazardDefinitions.map(h => `
                <rect id="hz2-hint-ring-${h.id}" x="${h.x - 4}" y="${h.y - 4}" width="${h.w + 8}" height="${h.h + 8}" rx="10"
                  fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4"
                  style="opacity: 0; pointer-events: none;"
                />
              `).join('')}
            </g>

            <!-- LAYER EFEK KLIK MELESET (✕ MERAH DI KOORDINAT KLIK) -->
            <g id="hz2-miss-effect" style="opacity: 0; pointer-events: none; transition: opacity 0.6s ease-out;">
              <circle id="hz2-miss-circle" cx="0" cy="0" r="16" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" stroke-width="2"/>
              <path id="hz2-miss-cross" d="M -6 -6 L 6 6 M 6 -6 L -6 6" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
            </g>
          </svg>
        </div>
        <div class="hz2-mobile-scroll-hint" aria-hidden="true">
          <i class="bi bi-arrows"></i> Geser ke samping untuk menjelajahi area bengkel
        </div>
      </div>

      <!-- Panel Hasil Akhir Saat Lengkap (Stars & Summary) -->
      <div id="hz2-result-panel" class="hz2-result-panel" style="display: none;">
        <div class="hz2-result-stars" id="hz2-stars-display">★★★</div>
        <h4 class="hz2-result-title" id="hz2-result-title">Bengkel Listrik Sukses Disterilkan!</h4>
        <p class="hz2-result-subtitle" id="hz2-result-subtitle">Skor Sempurna! Seluruh 6 bahaya berhasil diidentifikasi dan diamankan.</p>

        <div class="hz2-categories-summary">
          <div class="cat-pill"><i class="bi bi-shield-shaded"></i> Sengatan Listrik: <strong>3 Bahaya</strong></div>
          <div class="cat-pill"><i class="bi bi-fire"></i> Kebakaran: <strong>1 Bahaya</strong></div>
          <div class="cat-pill"><i class="bi bi-lightning-charge"></i> Hubung Singkat: <strong>1 Bahaya</strong></div>
          <div class="cat-pill"><i class="bi bi-exclamation-triangle"></i> Cedera Fisik: <strong>1 Bahaya</strong></div>
        </div>

        <button id="btn-hz2-restart" class="btn-mcb2-reset" style="margin-top: 14px; width: 100%;">
          <i class="bi bi-arrow-counterclockwise"></i> Ulangi Simulasi (Reset Bahaya)
        </button>
      </div>

      <!-- Daftar Kartu Temuan Bahaya (Di Bawah Gambar) -->
      <div class="hz2-findings-section" aria-live="polite">
        <div class="hz2-findings-head">
          <i class="bi bi-journal-check"></i> Daftar Analisis Risiko & Prosedur Pengamanan K3LH:
        </div>

        <div class="hz2-cards-list" id="hz2-cards-list">
          ${hazardDefinitions.map(h => `
            <div id="card-hz2-${h.id}" class="hz2-card card-locked">
              <div class="hz2-card-header">
                <span class="hz2-card-num">${h.num}</span>
                <span class="hz2-card-name">${h.name}</span>
                <span class="hz2-badge ${h.kategoriBadge}">${h.kategori}</span>
                <div class="hz2-secure-status"><i class="bi bi-check-circle-fill"></i> AMAN</div>
              </div>

              <div class="hz2-card-body">
                <div class="hz2-text-row">
                  <strong class="text-danger-title"><i class="bi bi-exclamation-octagon-fill"></i> Potensi Bahaya & Risiko:</strong>
                  <p class="hz2-text-desc">${h.risiko}</p>
                </div>
                <div class="hz2-text-row">
                  <strong class="text-success-title"><i class="bi bi-shield-check"></i> Prosedur Mengatasi (SOP K3LH):</strong>
                  <p class="hz2-text-desc">${h.solusi}</p>
                </div>

                <div class="hz2-card-actions">
                  <button class="btn-hz2-secure" data-secure-id="${h.id}">
                    <i class="bi bi-tools"></i> Amankan Bahaya Ini
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const svgEl = container.querySelector('#hz2-scene-svg');

  // Helper konversi koordinat pointer ke viewBox SVG
  function getSVGCoords(e) {
    if (!svgEl) return { x: 0, y: 0 };
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(svgEl.getScreenCTM().inverse());
    return { x: transformed.x, y: transformed.y };
  }

  // Trigger efek meleset
  function triggerMissEffect(x, y) {
    playWarning();
    missCount++;
    const missCountEl = container.querySelector('#hz2-miss-count');
    if (missCountEl) missCountEl.textContent = missCount;

    const missGroup = container.querySelector('#hz2-miss-effect');
    if (missGroup) {
      missGroup.setAttribute('transform', `translate(${x}, ${y})`);
      missGroup.style.opacity = '1';
      setTimeout(() => {
        missGroup.style.opacity = '0';
      }, 600);
    }

    // Getar ringan pada SVG
    svgEl.classList.add('scene-shake');
    setTimeout(() => svgEl.classList.remove('scene-shake'), 400);
  }

  // Update Status Teks & Cek Selesai
  function updateProgress() {
    const foundNum = Object.keys(foundHazards).length;
    const securedNum = Object.keys(securedHazards).length;

    const foundCountEl = container.querySelector('#hz2-found-count');
    const securedCountEl = container.querySelector('#hz2-secured-count');
    if (foundCountEl) foundCountEl.textContent = `${foundNum} / 6`;
    if (securedCountEl) securedCountEl.textContent = `${securedNum} / 6`;

    // Cek selesai total (6 ditemukan dan 6 diamankan)
    const resultPanel = container.querySelector('#hz2-result-panel');
    if (foundNum === 6 && securedNum === 6) {
      if (resultPanel) {
        resultPanel.style.display = 'block';

        const starsEl = container.querySelector('#hz2-stars-display');
        const subEl = container.querySelector('#hz2-result-subtitle');
        const totalPenalty = missCount + (3 - hintsLeft);

        if (totalPenalty < 2) {
          if (starsEl) starsEl.textContent = '★★★';
          if (subEl) subEl.textContent = `Skor Sempurna! Bengkel steril dengan hanya ${missCount} salah klik dan pemakaian ${3 - hintsLeft} petunjuk.`;
        } else if (totalPenalty < 5) {
          if (starsEl) starsEl.textContent = '★★☆';
          if (subEl) subEl.textContent = `Sangat Baik! Anda mengamankan bengkel dengan ${missCount} salah klik dan ${3 - hintsLeft} petunjuk.`;
        } else {
          if (starsEl) starsEl.textContent = '★☆☆';
          if (subEl) subEl.textContent = `Berhasil tuntas, namun tercatat ${missCount} kali salah klik & ${3 - hintsLeft} petunjuk. Tingkatkan kepekaan observasi K3LH!`;
        }
      }
      playSuccess();
    } else {
      if (resultPanel) resultPanel.style.display = 'none';
    }
  }

  // Toast Pemberitahuan Temuan Bahaya (Non-blocking, tidak auto-scroll)
  let toastTimer = null;
  function showHazardToast(hDef) {
    const toast = container.querySelector('#hz2-toast');
    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);

    toast.innerHTML = `
      <div class="hz2-toast-content">
        <div class="hz2-toast-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="hz2-toast-text">
          <div class="hz2-toast-title">Bahaya #${hDef.num}: ${hDef.name}</div>
          <div class="hz2-toast-sub"><span class="badge ${hDef.kategoriBadge} hz2-toast-badge">${hDef.kategori}</span></div>
        </div>
        <button type="button" class="hz2-toast-btn" id="btn-hz2-toast-view" title="Lihat kartu penjelasan di bawah">
          <span>Lihat penjelasan</span> <i class="bi bi-arrow-down-short"></i>
        </button>
      </div>
    `;
    toast.style.display = 'flex';
    toast.classList.remove('fade-out');

    const btnView = toast.querySelector('#btn-hz2-toast-view');
    if (btnView) {
      btnView.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = container.querySelector(`#card-hz2-${hDef.id}`);
        if (card) {
          card.classList.add('card-highlight');
          setTimeout(() => card.classList.remove('card-highlight'), 1200);
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    toastTimer = setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.classList.contains('fade-out')) {
          toast.style.display = 'none';
        }
      }, 300);
    }, 3200);
  }

  // Handler Klik Hotspot Bahaya
  function onHazardDiscovered(hDef) {
    if (foundHazards[hDef.id]) {
      // Jika sudah ditemukan, sorot kartu & tampilkan toast tanpa auto-scroll
      focusHazardCard(hDef.id);
      return;
    }

    playUIClick();
    foundHazards[hDef.id] = true;

    // 1. Tampilkan Pin di SVG
    const pin = container.querySelector(`#hz2-pin-${hDef.id}`);
    if (pin) {
      pin.style.opacity = '1';
      const badge = pin.querySelector('.hz2-pin-badge');
      if (badge) {
        badge.style.transform = 'scale(1.25)';
        setTimeout(() => badge.style.transform = 'scale(1)', 250);
      }
    }

    // 2. Buka Kartu di Daftar Temuan (tanpa auto-scroll yang mengganggu fokus gambar)
    const card = container.querySelector(`#card-hz2-${hDef.id}`);
    if (card) {
      card.classList.remove('card-locked');
      card.classList.add('card-found');
    }

    showHazardToast(hDef);
    updateProgress();
  }

  function focusHazardCard(hId) {
    const card = container.querySelector(`#card-hz2-${hId}`);
    if (card) {
      card.classList.add('card-highlight');
      setTimeout(() => card.classList.remove('card-highlight'), 1000);
    }
    const hDef = hazardDefinitions.find(h => h.id === hId);
    if (hDef) showHazardToast(hDef);
  }

  // Handler Amankan Bahaya (Tombol "Amankan Bahaya Ini")
  function onSecureHazard(hId) {
    playUIClick();
    securedHazards[hId] = true;

    // 1. Toggle Ilustrasi SVG dari .hz-danger ke .hz-safe
    const sceneGroup = container.querySelector(`#scene-${hId}`);
    if (sceneGroup) {
      const dEl = sceneGroup.querySelector('.hz-danger');
      const sEl = sceneGroup.querySelector('.hz-safe');
      if (dEl) dEl.style.opacity = '0';
      if (sEl) sEl.style.opacity = '1';
    }

    // 2. Update status kartu di daftar
    const card = container.querySelector(`#card-hz2-${hId}`);
    if (card) {
      card.classList.add('card-secured');
      const btnSec = card.querySelector('.btn-hz2-secure');
      if (btnSec) {
        btnSec.disabled = true;
        btnSec.innerHTML = '<i class="bi bi-check2-circle"></i> Berhasil Diamankan';
      }
    }

    updateProgress();
  }

  // Pasang Event Listeners pada SVG Canvas (dengan pemisahan tap vs gesture scroll)
  if (svgEl) {
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let isPointerDown = false;

    svgEl.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerStartTime = Date.now();
    });

    svgEl.addEventListener('pointerup', (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const dist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      const elapsed = Date.now() - pointerStartTime;

      // Jika jari bergeser > 8px atau drag ditahan > 800ms, itu gesture scroll horizontal (bukan tap)
      if (dist > 8 || elapsed > 800) {
        return;
      }

      // Cek apakah klik/tap mengenai hotspot
      const targetHotspot = e.target.closest('.hz2-hotspot');
      if (targetHotspot) {
        const hId = targetHotspot.getAttribute('data-hazard-id');
        const hDef = hazardDefinitions.find(h => h.id === hId);
        if (hDef) {
          onHazardDiscovered(hDef);
        }
      } else {
        // Klik di area kosong / meleset
        const coords = getSVGCoords(e);
        triggerMissEffect(coords.x, coords.y);
      }
    });

    svgEl.addEventListener('pointercancel', () => {
      isPointerDown = false;
    });
  }

  // Listener Tombol Amankan pada Tiap Kartu
  container.querySelectorAll('.btn-hz2-secure').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const hId = btn.getAttribute('data-secure-id');
      if (hId) onSecureHazard(hId);
    });
  });

  // Listener Klik Kartu untuk Sorot Pin di Gambar
  container.querySelectorAll('.hz2-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.id.replace('card-hz2-', '');
      if (foundHazards[id]) {
        playUIClick();
        const pin = container.querySelector(`#hz2-pin-${id}`);
        if (pin) {
          const badge = pin.querySelector('.hz2-pin-badge');
          if (badge) {
            badge.style.transform = 'scale(1.35)';
            setTimeout(() => badge.style.transform = 'scale(1)', 400);
          }
        }

        // Jika gambar sedang di-scroll horizontal di layar ponsel, pusatkan ke posisi objek bahaya
        const scrollBox = container.querySelector('.hz2-canvas-scroll');
        if (scrollBox && scrollBox.scrollWidth > scrollBox.clientWidth) {
          const hDef = hazardDefinitions.find(h => h.id === id);
          if (hDef) {
            const ratio = scrollBox.scrollWidth / 600;
            const targetX = (hDef.x + hDef.w / 2) * ratio;
            const scrollLeft = targetX - scrollBox.clientWidth / 2;
            scrollBox.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Listener Tombol Petunjuk (Maks 3x)
  const hintBtn = container.querySelector('#btn-hz2-hint');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      if (hintsLeft <= 0 || hintActive) return;
      playUIClick();
      hintsLeft--;
      const hintCountEl = container.querySelector('#hz2-hint-count');
      if (hintCountEl) hintCountEl.textContent = `${hintsLeft}/3`;
      if (hintsLeft === 0) hintBtn.disabled = true;

      // Cari bahaya yang BELUM ditemukan
      const unrevealed = hazardDefinitions.filter(h => !foundHazards[h.id]);
      if (unrevealed.length > 0) {
        hintActive = true;
        unrevealed.forEach(h => {
          const ring = container.querySelector(`#hz2-hint-ring-${h.id}`);
          if (ring) {
            ring.classList.add('ring-pulse');
            ring.style.opacity = '1';
          }
        });

        setTimeout(() => {
          unrevealed.forEach(h => {
            const ring = container.querySelector(`#hz2-hint-ring-${h.id}`);
            if (ring) {
              ring.classList.remove('ring-pulse');
              ring.style.opacity = '0';
            }
          });
          hintActive = false;
        }, 2200);
      }
    });
  }

  // Listener Tombol Restart / Ulangi
  const restartBtn = container.querySelector('#btn-hz2-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      playUIClick();
      foundHazards = {};
      securedHazards = {};
      missCount = 0;
      hintsLeft = 3;
      hintActive = false;

      // Reset SVG Pins & Safe Conditions
      hazardDefinitions.forEach(h => {
        const pin = container.querySelector(`#hz2-pin-${h.id}`);
        if (pin) {
          pin.style.opacity = '0';
          const badge = pin.querySelector('.hz2-pin-badge');
          if (badge) badge.style.transform = 'scale(1)';
        }

        const sceneGroup = container.querySelector(`#scene-${h.id}`);
        if (sceneGroup) {
          const dEl = sceneGroup.querySelector('.hz-danger');
          const sEl = sceneGroup.querySelector('.hz-safe');
          if (dEl) dEl.style.opacity = '1';
          if (sEl) sEl.style.opacity = '0';
        }

        const card = container.querySelector(`#card-hz2-${h.id}`);
        if (card) {
          card.className = 'hz2-card card-locked';
          const btnSec = card.querySelector('.btn-hz2-secure');
          if (btnSec) {
            btnSec.disabled = false;
            btnSec.innerHTML = '<i class="bi bi-tools"></i> Amankan Bahaya Ini';
          }
        }
      });

      const missCountEl = container.querySelector('#hz2-miss-count');
      if (missCountEl) missCountEl.textContent = '0';

      const hintCountEl = container.querySelector('#hz2-hint-count');
      if (hintCountEl) hintCountEl.textContent = '3/3';
      if (hintBtn) hintBtn.disabled = false;

      const toast = container.querySelector('#hz2-toast');
      if (toast) {
        toast.style.display = 'none';
        if (toastTimer) clearTimeout(toastTimer);
      }

      updateProgress();
    });
  }

  // Initial update
  updateProgress();
}
