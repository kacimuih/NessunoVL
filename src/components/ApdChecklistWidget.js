// Interactive APD Checklist & PPE Sorting Simulation Widget - Virtual Lab IPL
import { playUIClick, playWarning, playSuccess } from '../utils/audioFeedback.js';

export function renderApdChecklistWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 4 Benar + 4 Pengecoh (sesuai spesifikasi & teks materi K3LH)
  const allEquipment = [
    {
      id: 'helm_safety',
      name: 'Helm Pelindung (Safety Helmet)',
      slot: 'head',
      correct: true,
      iconType: 'bi',
      iconVal: 'bi-shield-shaded',
      color: '#f59e0b',
      fungsi: 'Melindungi kepala dari benturan benda keras yang jatuh atau sentuhan langsung dengan kabel bertegangan di atas kepala.',
      alasanSalah: ''
    },
    {
      id: 'topi_kain',
      name: 'Topi Kain Biasa',
      slot: 'head',
      correct: false,
      iconType: 'bi',
      iconVal: 'bi-circle',
      color: '#94a3b8',
      fungsi: '',
      alasanSalah: 'Topi kain tidak memiliki ketahanan mekanik terhadap benturan dan tidak memberikan isolasi tegangan listrik!'
    },
    {
      id: 'goggles_safety',
      name: 'Kacamata Pelindung (Safety Goggles)',
      slot: 'eyes',
      correct: true,
      iconType: 'bi',
      iconVal: 'bi-eyeglasses',
      color: '#38bdf8',
      fungsi: 'Melindungi mata dari percikan bunga api listrik (arc flash), partikel serpihan kawat tembaga, atau debu pengeboran.',
      alasanSalah: ''
    },
    {
      id: 'kacamata_fashion',
      name: 'Kacamata Hitam Fashion',
      slot: 'eyes',
      correct: false,
      iconType: 'bi',
      iconVal: 'bi-sunglasses',
      color: '#94a3b8',
      fungsi: '',
      alasanSalah: 'Kacamata fashion mudah pecah dan dapat menggelapkan penglihatan di area instalasi yang membutuhkan ketelitian!'
    },
    {
      id: 'sarung_isolasi',
      name: 'Sarung Tangan Isolasi (1000V)',
      slot: 'hands',
      correct: true,
      iconType: 'bi',
      iconVal: 'bi-hand-index-thumb-fill',
      color: '#ef4444',
      fungsi: 'Terbuat dari karet khusus berating tegangan 1000V untuk melindungi tangan dari sengatan listrik saat menyentuh konduktor.',
      alasanSalah: ''
    },
    {
      id: 'sarung_katun',
      name: 'Sarung Tangan Kain / Katun',
      slot: 'hands',
      correct: false,
      iconType: 'bi',
      iconVal: 'bi-hand-index-thumb',
      color: '#94a3b8',
      fungsi: '',
      alasanSalah: 'Kain katun bukan isolator listrik! Jika terkena keringat atau lembab, katun justru menjadi konduktor penghantar arus listrik!'
    },
    {
      id: 'sepatu_safety',
      name: 'Sepatu Safety (Sol Karet Tebal)',
      slot: 'feet',
      correct: true,
      iconType: 'svg_boot',
      iconVal: '',
      color: '#10b981',
      fungsi: 'Sol karet tebal tanpa bahan logam konduktif memutus sirkuit aliran listrik ke bumi (ground) dan mencegah shock hazard.',
      alasanSalah: ''
    },
    {
      id: 'sandal_terbuka',
      name: 'Sandal Jepit / Terbuka',
      slot: 'feet',
      correct: false,
      iconType: 'bi',
      iconVal: 'bi-slash-circle',
      color: '#94a3b8',
      fungsi: '',
      alasanSalah: 'Sandal jepit sangat berbahaya! Kaki tidak terlindungi dari sengatan listrik ke tanah, percikan api, dan benda tajam di lantai!'
    }
  ];

  // Acak urutan kartu di rak perlengkapan
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let items = shuffle(allEquipment);

  // State
  let equipped = {
    head: null, // item object
    eyes: null,
    hands: null,
    feet: null
  };
  let errorCount = 0;
  let activeInfo = null; // item object yang baru saja dipasang
  let toastTimer = null;
  let wasComplete = false;

  // Template SVG icon inline untuk sepatu
  const svgBootIcon = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:inline-block; vertical-align:middle;">
      <path d="M4 17 L8 17 L9 13 L6 13 L6 6 C6 4.9 6.9 4 8 4 L11 4 C12.1 4 13 4.9 13 6 L13 11 L16 13 C17.7 13.9 19.1 15.3 19.8 17 L21 17 C21.6 17 22 17.4 22 18 L22 20 C22 20.6 21.6 21 21 21 L3 21 C2.4 21 2 20.6 2 20 L2 18 C2 17.4 2.4 17 3 17 Z M4 19 L20 19 L20 18 L19 18 C18.3 16.6 17.1 15.4 15.6 14.6 L12 12.5 L12 6 L8 6 L8 13 L10 13 L9.5 15 L4 15 Z"/>
    </svg>
  `;

  // Render Skeleton 1 KALI
  container.innerHTML = `
    <div class="apd2-wrapper">
      <!-- Header & Petunjuk -->
      <div class="apd2-header">
        <h4 class="apd2-title">
          <i class="bi bi-shield-check"></i> Simulasi Pemasangan APD Kelistrikan (K3LH)
        </h4>
        <p class="apd2-subtitle">
          Pilih <strong>4 perlengkapan yang benar</strong> dari rak untuk melindungi pekerja dari bahaya kelistrikan. Waspadai alat pengecoh!
        </p>
      </div>

      <!-- Main Layout: Kiri (Figur) & Kanan (Rak & Info) -->
      <div class="apd2-layout">
        <!-- Kolom Kiri: Figur Pekerja & Callouts -->
        <div class="apd2-left-col">
          <!-- Top Badges & Progress -->
          <div class="apd2-status-bar">
            <div id="apd2-status-badge" class="apd2-badge badge-pending">
              <i class="bi bi-clock-history"></i> <span id="apd2-badge-text">BELUM LENGKAP</span>
            </div>
            <div class="apd2-counter-tag">
              <i class="bi bi-exclamation-triangle"></i> Salah: <strong id="apd2-error-counter">0</strong>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="apd2-progress-box">
            <div class="apd2-progress-label">
              <span>Progres Kelengkapan:</span>
              <strong id="apd2-progress-text">0 / 4 APD Terpasang</strong>
            </div>
            <div class="apd2-progress-track">
              <div id="apd2-progress-fill" class="apd2-progress-fill" style="width: 0%;"></div>
            </div>
          </div>

          <!-- SVG Figur Pekerja & Callout Slots -->
          <div class="apd2-figure-card">
            <svg id="apd2-svg-worker" viewBox="0 0 240 310" class="apd2-svg-worker">
              <defs>
                <filter id="apd2-drop-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <!-- Tubuh Pekerja (Karakter Proporsional) -->
              <!-- Leher -->
              <rect x="114" y="80" width="12" height="15" fill="#fbcfe8"/>
              <!-- Baju Kerja Lapangan Biru TITL -->
              <path d="M 85 95 L 155 95 L 160 190 L 80 190 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
              <line x1="120" y1="95" x2="120" y2="190" stroke="#1e3a8a" stroke-width="2"/>
              <!-- Saku Baju -->
              <rect x="92" y="110" width="18" height="18" rx="2" fill="#1d4ed8"/>
              <rect x="130" y="110" width="18" height="18" rx="2" fill="#1d4ed8"/>

              <!-- Lengan Kiri & Kanan -->
              <line x1="85" y1="105" x2="55" y2="175" stroke="#2563eb" stroke-width="14" stroke-linecap="round"/>
              <line x1="155" y1="105" x2="185" y2="175" stroke="#2563eb" stroke-width="14" stroke-linecap="round"/>

              <!-- Celana Kerja Abu-abu Tebal -->
              <path d="M 85 190 L 155 190 L 150 260 L 128 260 L 120 215 L 112 260 L 90 260 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>

              <!-- KEPALA PEKERJA -->
              <circle cx="120" cy="55" r="24" fill="#fbcfe8" stroke="#f472b6" stroke-width="1.5"/>
              <!-- Rambut Dasar -->
              <path d="M 98 52 C 98 34, 142 34, 142 52 Z" fill="#475569"/>
              <!-- Wajah (Mata, Alis, Senyum Ramah) -->
              <circle cx="112" cy="54" r="2.5" fill="#1e293b"/>
              <circle cx="128" cy="54" r="2.5" fill="#1e293b"/>
              <path d="M 115 63 Q 120 67 125 63" stroke="#1e293b" stroke-width="1.5" fill="none"/>

              <!-- SLOT 1: HELM K3LH (Kubah + Brim Kokoh) -->
              <g id="fig-slot-head" class="apd2-fig-item" style="opacity: 0; transform-origin: 120px 42px; transform: scale(0.85); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <!-- Kubah Helm -->
                <path d="M 94 48 C 94 22, 146 22, 146 48 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2" filter="url(#apd2-drop-glow)"/>
                <!-- Rusuk Penguat Atas Helm -->
                <path d="M 120 25 L 120 48" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <!-- Lidah / Brim Pelindung Depan -->
                <path d="M 88 48 Q 120 44 152 48 L 150 53 Q 120 48 90 53 Z" fill="#d97706"/>
              </g>

              <!-- SLOT 2: KACAMATA GOGGLES (Menutupi Area Mata Rapat) -->
              <g id="fig-slot-eyes" class="apd2-fig-item" style="opacity: 0; transform-origin: 120px 54px; transform: scale(0.85); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <!-- Lensa Kiri & Kanan dengan Kaca Polikarbonat Biru Bening -->
                <rect x="103" y="47" width="14" height="13" rx="3" fill="#38bdf8" fill-opacity="0.85" stroke="#0284c7" stroke-width="2"/>
                <rect x="123" y="47" width="14" height="13" rx="3" fill="#38bdf8" fill-opacity="0.85" stroke="#0284c7" stroke-width="2"/>
                <!-- Jembatan Tengah & Tali Pengikat Elastis -->
                <line x1="117" y1="53" x2="123" y2="53" stroke="#0284c7" stroke-width="2"/>
                <line x1="103" y1="52" x2="96" y2="50" stroke="#0284c7" stroke-width="1.5"/>
                <line x1="137" y1="52" x2="144" y2="50" stroke="#0284c7" stroke-width="1.5"/>
              </g>

              <!-- SLOT 3: TANGAN & SARUNG TANGAN ISOLASI (Karet Merah Tebal) -->
              <!-- Tangan Telanjang -->
              <circle cx="50" cy="180" r="8" fill="#fbcfe8"/>
              <circle cx="190" cy="180" r="8" fill="#fbcfe8"/>
              <!-- Sarung Tangan Karet Terpasang -->
              <g id="fig-slot-hands" class="apd2-fig-item" style="opacity: 0; transform-origin: 120px 180px; transform: scale(0.85); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <rect x="40" y="168" width="20" height="24" rx="7" fill="#ef4444" stroke="#b91c1c" stroke-width="2" filter="url(#apd2-drop-glow)"/>
                <rect x="180" y="168" width="20" height="24" rx="7" fill="#ef4444" stroke="#b91c1c" stroke-width="2" filter="url(#apd2-drop-glow)"/>
                <!-- Manset Isolator -->
                <rect x="42" y="166" width="16" height="4" rx="1" fill="#fca5a5"/>
                <rect x="182" y="166" width="16" height="4" rx="1" fill="#fca5a5"/>
              </g>

              <!-- SLOT 4: SEPATU SAFETY (Sol Karet Tebal) -->
              <!-- Kaki Telanjang/Dasar -->
              <ellipse cx="101" cy="266" rx="9" ry="6" fill="#64748b"/>
              <ellipse cx="139" cy="266" rx="9" ry="6" fill="#64748b"/>
              <!-- Sepatu Safety Terpasang -->
              <g id="fig-slot-feet" class="apd2-fig-item" style="opacity: 0; transform-origin: 120px 270px; transform: scale(0.85); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <!-- Bodi Sepatu Kiri & Kanan -->
                <path d="M 88 260 L 112 260 L 115 277 L 86 277 Z" fill="#10b981" stroke="#047857" stroke-width="2"/>
                <path d="M 128 260 L 152 260 L 154 277 L 125 277 Z" fill="#10b981" stroke="#047857" stroke-width="2"/>
                <!-- Sol Karet Tebal Isolator Bawah -->
                <rect x="84" y="275" width="34" height="6" rx="3" fill="#064e3b" stroke="#047857" stroke-width="1"/>
                <rect x="122" y="275" width="34" height="6" rx="3" fill="#064e3b" stroke="#047857" stroke-width="1"/>
              </g>

              <!-- 4 CALLOUT LABELS (Garis Penunjuk Rapi di Luar Area Tubuh) -->
              <!-- Callout 1: Kepala (Kiri Atas) -->
              <g id="callout-head" class="apd2-callout">
                <line x1="30" y1="36" x2="94" y2="36" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,2"/>
                <circle cx="94" cy="36" r="3" fill="#94a3b8"/>
                <rect x="4" y="24" width="46" height="20" rx="4" class="callout-tag"/>
                <text x="27" y="38" class="callout-text">Kepala</text>
              </g>

              <!-- Callout 2: Mata (Kanan Atas) -->
              <g id="callout-eyes" class="apd2-callout">
                <line x1="210" y1="54" x2="142" y2="54" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,2"/>
                <circle cx="142" cy="54" r="3" fill="#94a3b8"/>
                <rect x="190" y="42" width="46" height="20" rx="4" class="callout-tag"/>
                <text x="213" y="56" class="callout-text">Mata</text>
              </g>

              <!-- Callout 3: Tangan (Kiri Tengah) -->
              <g id="callout-hands" class="apd2-callout">
                <line x1="30" y1="180" x2="40" y2="180" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,2"/>
                <circle cx="40" cy="180" r="3" fill="#94a3b8"/>
                <rect x="4" y="168" width="46" height="20" rx="4" class="callout-tag"/>
                <text x="27" y="182" class="callout-text">Tangan</text>
              </g>

              <!-- Callout 4: Kaki (Kanan Bawah) -->
              <g id="callout-feet" class="apd2-callout">
                <line x1="210" y1="270" x2="155" y2="270" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,2"/>
                <circle cx="155" cy="270" r="3" fill="#94a3b8"/>
                <rect x="190" y="258" width="46" height="20" rx="4" class="callout-tag"/>
                <text x="213" y="272" class="callout-text">Kaki</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Kolom Kanan: Rak Perlengkapan & Info/Hasil -->
        <div class="apd2-right-col">
          <!-- Toast Pemberitahuan Salah Pilih -->
          <div id="apd2-toast" class="apd2-toast" aria-live="polite">
            <i class="bi bi-x-circle-fill"></i>
            <span id="apd2-toast-msg">Pilihan salah!</span>
          </div>

          <!-- Rak Perlengkapan (8 Kartu: 4 Benar + 4 Pengecoh) -->
          <div class="apd2-rack-box">
            <div class="apd2-rack-title">
              <i class="bi bi-boxes"></i> Rak Perlengkapan (Klik untuk Memasang / Melepas):
            </div>
            <div class="apd2-cards-grid" id="apd2-cards-grid">
              ${items.map(item => `
                <button class="apd2-item-card" data-item-id="${item.id}" aria-pressed="false">
                  <div class="apd2-card-icon" style="color: ${item.color};">
                    ${item.iconType === 'svg_boot' ? svgBootIcon : `<i class="bi ${item.iconVal}"></i>`}
                  </div>
                  <div class="apd2-card-name">${item.name}</div>
                  <div class="apd2-card-check"><i class="bi bi-check-lg"></i></div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Kartu Info Fungsi APD Aktif -->
          <div id="apd2-info-card" class="apd2-info-card" style="display: none;" aria-live="polite">
            <div class="apd2-info-header">
              <i class="bi bi-info-circle-fill"></i>
              <span id="apd2-info-title">Fungsi APD Terpasang</span>
            </div>
            <p id="apd2-info-text" class="apd2-info-text"></p>
          </div>

          <!-- Panel Hasil Akhir Saat Lengkap (Stars & Summary) -->
          <div id="apd2-result-panel" class="apd2-result-panel" style="display: none;">
            <div class="apd2-result-stars" id="apd2-stars-container">★★★</div>
            <h5 class="apd2-result-headline" id="apd2-result-headline">Pekerja Siap Masuk Area Praktik!</h5>
            <p class="apd2-result-score" id="apd2-result-score">Skor Sempurna tanpa kesalahan!</p>

            <div class="apd2-summary-box">
              <div class="summary-head"><i class="bi bi-card-checklist"></i> Ringkasan Standar K3LH:</div>
              <ul class="summary-list">
                <li><strong>Helm:</strong> Menahan impak benturan mekanik & tegangan atap.</li>
                <li><strong>Kacamata:</strong> Perlindungan dari loncatan arc flash & serpihan bor.</li>
                <li><strong>Sarung Tangan 1000V:</strong> Isolasi sentuh fasa langsung.</li>
                <li><strong>Sepatu Safety:</strong> Sol tebal pemutus aliran ke tanah (ground).</li>
              </ul>
            </div>

            <button id="btn-apd2-restart" class="btn-mcb2-reset" style="width: 100%; margin-top: 14px;">
              <i class="bi bi-arrow-counterclockwise"></i> Ulangi Simulasi (Acak Ulang)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Helper fungsi untuk update DOM tanpa render ulang
  function updateProgressAndStatus() {
    const slots = ['head', 'eyes', 'hands', 'feet'];
    const equippedCount = slots.filter(s => equipped[s] !== null).length;
    const isAllEquipped = equippedCount === 4;

    // Progress Bar & Text
    const progFill = container.querySelector('#apd2-progress-fill');
    const progText = container.querySelector('#apd2-progress-text');
    if (progFill) progFill.style.width = `${(equippedCount / 4) * 100}%`;
    if (progText) progText.textContent = `${equippedCount} / 4 APD Terpasang`;

    // Status Badge
    const badge = container.querySelector('#apd2-status-badge');
    if (badge) {
      if (isAllEquipped) {
        badge.className = 'apd2-badge badge-complete';
        badge.innerHTML = '<i class="bi bi-shield-fill-check"></i> <span id="apd2-badge-text">TERLINDUNGI LENGKAP</span>';
      } else {
        badge.className = 'apd2-badge badge-pending';
        badge.innerHTML = '<i class="bi bi-clock-history"></i> <span id="apd2-badge-text">BELUM LENGKAP</span>';
      }
    }

    // Callout Tag Highlight di SVG
    slots.forEach(s => {
      const callout = container.querySelector(`#callout-${s}`);
      const figPart = container.querySelector(`#fig-slot-${s}`);
      const isFilled = equipped[s] !== null;

      if (callout) {
        if (isFilled) {
          callout.classList.add('callout-filled');
        } else {
          callout.classList.remove('callout-filled');
        }
      }

      if (figPart) {
        if (isFilled) {
          figPart.style.opacity = '1';
          figPart.style.transform = 'scale(1)';
        } else {
          figPart.style.opacity = '0';
          figPart.style.transform = 'scale(0.85)';
        }
      }
    });

    // Update status pressed pada tombol rak
    container.querySelectorAll('.apd2-item-card').forEach(card => {
      const id = card.getAttribute('data-item-id');
      const isEq = Object.values(equipped).some(item => item && item.id === id);
      card.setAttribute('aria-pressed', isEq ? 'true' : 'false');
      if (isEq) {
        card.classList.add('card-equipped');
      } else {
        card.classList.remove('card-equipped');
      }
    });

    // Update Info Card
    const infoCard = container.querySelector('#apd2-info-card');
    const infoTitle = container.querySelector('#apd2-info-title');
    const infoText = container.querySelector('#apd2-info-text');

    if (activeInfo && !isAllEquipped) {
      infoCard.style.display = 'block';
      infoTitle.textContent = activeInfo.name;
      infoText.textContent = activeInfo.fungsi;
    } else if (!isAllEquipped) {
      infoCard.style.display = 'none';
    }

    // Cek Selesai (4 APD Terpasang)
    const resultPanel = container.querySelector('#apd2-result-panel');
    if (isAllEquipped) {
      if (infoCard) infoCard.style.display = 'none';
      if (resultPanel) {
        resultPanel.style.display = 'block';

        // Hitung Bintang: 0 salah = ★★★, 1-2 salah = ★★, >=3 salah = ★
        const starsEl = container.querySelector('#apd2-stars-container');
        const scoreEl = container.querySelector('#apd2-result-score');
        let starStr = '★★★';

        if (errorCount === 0) {
          starStr = '★★★';
          scoreEl.textContent = 'Luar Biasa! Skor Sempurna tanpa ada alat pengecoh yang terpilih.';
        } else if (errorCount <= 2) {
          starStr = '★★☆';
          scoreEl.textContent = `Bagus! Anda menyelesaikan simulasi dengan ${errorCount} kali salah pilih.`;
        } else {
          starStr = '★☆☆';
          scoreEl.textContent = `Selesai, namun Anda sempat memilih ${errorCount} alat pengecoh yang membahayakan. Pelajari lagi standar APD!`;
        }

        if (starsEl) starsEl.textContent = starStr;
      }
      if (!wasComplete) playSuccess();
    } else {
      if (resultPanel) resultPanel.style.display = 'none';
    }

    wasComplete = isAllEquipped;
  }

  function showToast(msg) {
    const toast = container.querySelector('#apd2-toast');
    const toastMsg = container.querySelector('#apd2-toast-msg');
    if (!toast || !toastMsg) return;

    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.add('toast-show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 4000);
  }

  function handleCardClick(card, item) {
    // 1. Jika item adalah pengecoh (salah)
    if (!item.correct) {
      playWarning();
      errorCount++;
      const errEl = container.querySelector('#apd2-error-counter');
      if (errEl) errEl.textContent = errorCount;

      // Animasi getar (shake)
      card.classList.add('card-shake');
      setTimeout(() => card.classList.remove('card-shake'), 450);

      showToast(item.alasanSalah);
      return;
    }

    // 2. Jika item adalah APD yang benar
    playUIClick();
    const isCurrentlyEquipped = equipped[item.slot] && equipped[item.slot].id === item.id;

    if (isCurrentlyEquipped) {
      // Toggle lepas
      equipped[item.slot] = null;
      if (activeInfo && activeInfo.id === item.id) activeInfo = null;
    } else {
      // Pasang ke slot
      equipped[item.slot] = item;
      activeInfo = item;
    }

    updateProgressAndStatus();
  }

  // Pasang event listeners pada tombol kartu di rak
  container.querySelectorAll('.apd2-item-card').forEach(card => {
    const itemId = card.getAttribute('data-item-id');
    const item = items.find(it => it.id === itemId);
    if (item) {
      card.addEventListener('click', () => handleCardClick(card, item));
    }
  });

  // Tombol Ulangi Simulasi (Reset & Acak Ulang)
  const restartBtn = container.querySelector('#btn-apd2-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      playUIClick();
      equipped = { head: null, eyes: null, hands: null, feet: null };
      errorCount = 0;
      activeInfo = null;
      wasComplete = false;
      items = shuffle(allEquipment);

      // Re-populate cards order
      const grid = container.querySelector('#apd2-cards-grid');
      if (grid) {
        grid.innerHTML = items.map(item => `
          <button class="apd2-item-card" data-item-id="${item.id}" aria-pressed="false">
            <div class="apd2-card-icon" style="color: ${item.color};">
              ${item.iconType === 'svg_boot' ? svgBootIcon : `<i class="bi ${item.iconVal}"></i>`}
            </div>
            <div class="apd2-card-name">${item.name}</div>
            <div class="apd2-card-check"><i class="bi bi-check-lg"></i></div>
          </button>
        `).join('');

        grid.querySelectorAll('.apd2-item-card').forEach(c => {
          const id = c.getAttribute('data-item-id');
          const itm = items.find(x => x.id === id);
          if (itm) c.addEventListener('click', () => handleCardClick(c, itm));
        });
      }

      const errEl = container.querySelector('#apd2-error-counter');
      if (errEl) errEl.textContent = '0';

      const toast = container.querySelector('#apd2-toast');
      if (toast) toast.classList.remove('toast-show');

      updateProgressAndStatus();
    });
  }

  // Initial state update
  updateProgressAndStatus();
}
