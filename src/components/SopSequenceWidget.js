// Interactive SOP Sequence & Classification Widget - Virtual Lab IPL
import { playUIClick, playError, playSuccess } from '../utils/audioFeedback.js';

export function renderSopSequenceWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Master Data Definisi SOP Sesuai Standar K3 Listrik (OSHA, PUIL, Permenaker No. 12/2015)
  const categories = [
    {
      id: 'sebelum',
      mode: 'sequence',
      title: 'Sebelum Bekerja',
      fullTitle: '1. Sebelum Bekerja (Persiapan & Isolasi Energi)',
      badge: 'Tahap 1/3: Sebelum Bekerja',
      description: 'Urutkan langkah persiapan, perlindungan diri, dan pemutusan sumber daya listrik sesuai urutan keselamatan standar.',
      steps: [
        {
          id: 'sebelum_izin',
          text: 'Koordinasi & minta izin kerja praktikum kepada instruktur/guru',
          why: 'Memastikan instruktur mengetahui rencana kerja dan panel utama siap dioperasikan dengan aman.'
        },
        {
          id: 'sebelum_apd',
          text: 'Kenakan APD lengkap standar kelistrikan (sarung tangan isolasi & sepatu safety)',
          why: 'Tubuh dan tangan harus terproteksi terlebih dahulu sebelum mendekati atau mengoperasikan panel listrik.'
        },
        {
          id: 'sebelum_off',
          text: 'Matikan sakelar utama / tuas MCB sumber daya instalasi',
          why: 'Memutus aliran arus listrik dari sumber sebelum komponen sirkuit disentuh atau dibuka.'
        },
        {
          id: 'sebelum_loto',
          text: 'Pasang LOTO (Lockout/Tagout) berupa gembok pengunci & label bahaya pada MCB',
          why: 'Mencegah orang lain menyalakan sakelar atau MCB secara tidak sengaja saat Anda sedang merakit.'
        },
        {
          id: 'sebelum_uji',
          text: 'Uji tegangan nol (nihil) dengan tespen atau multimeter yang dipastikan berfungsi',
          why: 'Memverifikasi secara fisik bahwa sirkuit benar-benar tidak bertegangan (dead circuit) sebelum kabel disentuh.'
        }
      ]
    },
    {
      id: 'saat',
      mode: 'classify',
      title: 'Saat Bekerja',
      fullTitle: '2. Saat Bekerja (Praktik Kerja Aman)',
      badge: 'Tahap 2/3: Saat Bekerja',
      description: 'Aturan keselamatan saat bekerja berlaku bersamaan. Kelompokkan setiap tindakan di bawah ke kategori WAJIB atau DILARANG.',
      cards: [
        {
          id: 'saat_kering',
          text: 'Memastikan area lantai kerja dan kedua tangan selalu dalam keadaan kering',
          type: 'wajib',
          why: 'Air dan kelembapan menurunkan resistansi kulit drastis sehingga memudahkan sengatan listrik.',
          wrongFeedback: 'Keliru: Menjaga lantai dan tangan tetap kering adalah KEWAJIBAN MUTLAK keselamatan listrik!'
        },
        {
          id: 'saat_perkakas',
          text: 'Menggunakan perkakas kerja berisolasi standar (obeng dan tang berisolasi)',
          type: 'wajib',
          why: 'Lapisan isolasi pada gagang perkakas memproteksi tangan jika terjadi kontak mendadak dengan konduktor.',
          wrongFeedback: 'Keliru: Menggunakan perkakas berisolasi WAJIB untuk melindungi tangan saat merakit!'
        },
        {
          id: 'saat_bebas_tegangan',
          text: 'Melakukan perakitan, penyambungan, dan pemasangan kabel hanya saat rangkaian bebas tegangan',
          type: 'wajib',
          why: 'Bekerja tanpa tegangan (cold work) adalah prinsip utama perlindungan dari bahaya korsleting dan sengatan fatal.',
          wrongFeedback: 'Keliru: Merakit tanpa tegangan adalah ATURAN UTAMA yang wajib selalu dipatuhi!'
        },
        {
          id: 'saat_sentuh_dua',
          text: 'Menyentuh dua konduktor kawat berpotensial berbeda secara bersamaan dengan dua tangan',
          type: 'dilarang',
          why: 'Menyentuh dua konduktor berbeda menutup rangkaian listrik melewati organ jantung (jalur tangan-ke-tangan).',
          wrongFeedback: 'Bahaya: Menyentuh dua konduktor berbeda SANGAT DILARANG karena menciptakan jalur sengatan fatal!'
        },
        {
          id: 'saat_lantai_basah',
          text: 'Bekerja di atas lantai lembap/basah atau tanpa mengenakan alas kaki berisolasi',
          type: 'dilarang',
          why: 'Lantai basah menghubungkan tubuh ke tanah (ground) dengan hambatan sangat rendah.',
          wrongFeedback: 'Bahaya: Bekerja di area basah DILARANG KERAS karena risiko shock ke ground sangat tinggi!'
        },
        {
          id: 'saat_sendirian',
          text: 'Melakukan praktikum perakitan instalasi sendirian di lab tanpa pengawasan guru atau rekan',
          type: 'dilarang',
          why: 'Bekerja sendirian meniadakan pertolongan pertama darurat jika terjadi kecelakaan sengatan listrik.',
          wrongFeedback: 'Bahaya: Bekerja sendirian di lab DILARANG demi memastikan adanya respon cepat jika terjadi insiden!'
        }
      ]
    },
    {
      id: 'setelah',
      mode: 'sequence',
      title: 'Setelah Bekerja',
      fullTitle: '3. Setelah Bekerja (Inspeksi & Normalisasi)',
      badge: 'Tahap 3/3: Setelah Bekerja',
      description: 'Urutkan prosedur inspeksi, pelaporan, pelepasan LOTO, dan pengujian daya secara teratur dan aman.',
      steps: [
        {
          id: 'setelah_bersih',
          text: 'Rapikan perkakas kerja dan bersihkan serpihan kawat tembaga/isolasi dari meja kerja',
          why: 'Serpihan kawat tembaga konduktif yang tertinggal dapat jatuh ke terminal dan memicu korsleting mendadak.'
        },
        {
          id: 'setelah_periksa',
          text: 'Periksa kembali kekencangan sambungan terminal dan pastikan tiada kabel mengambang',
          why: 'Sambungan kendor menimbulkan busur api (arcing) dan kabel lepas berisiko menyentuh rangka/casing bodi.'
        },
        {
          id: 'setelah_guru',
          text: 'Minta instruktur/guru memeriksa dan menyetujui hasil rangkaian instalasi',
          why: 'Verifikasi keselamatan oleh pihak berwenang wajib dilakukan sebelum sirkuit boleh diberi aliran daya listrik.'
        },
        {
          id: 'setelah_buka_loto',
          text: 'Lepas gembok dan label LOTO hanya oleh personil/siswa yang memasangnya',
          why: 'Prinsip LOTO: kunci hanya boleh dilepas oleh pemilik kunci setelah guru menyatakan instalasi aman.'
        },
        {
          id: 'setelah_nyalakan',
          text: 'Nyalakan tuas MCB utama untuk uji coba fungsi instalasi di bawah pengawasan instruktur',
          why: 'Pemberian tegangan dilakukan paling akhir setelah seluruh pengaman dan verifikasi keselamatan tuntas.'
        }
      ]
    }
  ];

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // State Widget
  let currentCatIndex = 0; // 0: Sebelum, 1: Saat, 2: Setelah
  const completedStages = [false, false, false];
  const stageMistakes = [0, 0, 0];
  let showFinalSummary = false;

  // Status Per Tahap
  // Untuk mode sequence (0 & 2): placedIds: [], poolIds: []
  // Untuk mode classify (1): cardIndex: 0, classifiedCards: [], poolCards: []
  const stageData = [
    { placedIds: [], poolIds: shuffle(categories[0].steps.map(s => s.id)) },
    { cardIndex: 0, classifiedCards: [], poolCards: shuffle(categories[1].cards) },
    { placedIds: [], poolIds: shuffle(categories[2].steps.map(s => s.id)) }
  ];

  let feedbackState = { message: '', type: null, isShake: false };
  let pendingFocusSelector = null;

  function setFeedback(msg, type = 'error', isShake = false) {
    feedbackState = { message: msg, type, isShake };
  }

  function clearFeedback() {
    feedbackState = { message: '', type: null, isShake: false };
  }

  function resetCurrentStage() {
    clearFeedback();
    stageMistakes[currentCatIndex] = 0;
    completedStages[currentCatIndex] = false;

    if (currentCatIndex === 0) {
      stageData[0].placedIds = [];
      stageData[0].poolIds = shuffle(categories[0].steps.map(s => s.id));
    } else if (currentCatIndex === 1) {
      stageData[1].cardIndex = 0;
      stageData[1].classifiedCards = [];
      stageData[1].poolCards = shuffle(categories[1].cards);
    } else if (currentCatIndex === 2) {
      stageData[2].placedIds = [];
      stageData[2].poolIds = shuffle(categories[2].steps.map(s => s.id));
    }
  }

  function resetAllStages() {
    clearFeedback();
    showFinalSummary = false;
    currentCatIndex = 0;
    for (let i = 0; i < 3; i++) {
      completedStages[i] = false;
      stageMistakes[i] = 0;
    }
    stageData[0].placedIds = [];
    stageData[0].poolIds = shuffle(categories[0].steps.map(s => s.id));
    stageData[1].cardIndex = 0;
    stageData[1].classifiedCards = [];
    stageData[1].poolCards = shuffle(categories[1].cards);
    stageData[2].placedIds = [];
    stageData[2].poolIds = shuffle(categories[2].steps.map(s => s.id));
  }

  // Logika Evaluasi Kesalahan Spesifik untuk Mode Urutan (Sequence)
  function getSequenceErrorMessage(clickedId, expectedId, catIndex, placedCount) {
    if (catIndex === 0) {
      if (clickedId === 'sebelum_uji') {
        return 'Belum aman: Tuas MCB harus dimatikan (OFF) dan dipasang LOTO terlebih dahulu sebelum melakukan uji tegangan nol.';
      }
      if (clickedId === 'sebelum_loto') {
        return 'Keliru: Tuas MCB harus diposisikan OFF terlebih dahulu sebelum memasang gembok pengunci LOTO.';
      }
      if (clickedId === 'sebelum_off') {
        return 'Bahaya: Kenakan APD isolasi lengkap terlebih dahulu sebelum mendekati dan menyentuh tuas panel listrik.';
      }
      if (clickedId === 'sebelum_apd') {
        return 'Awali praktikum dengan meminta izin dan pengarahan instruktur/guru sebelum menyiapkan APD dan peralatan.';
      }
    } else if (catIndex === 2) {
      if (clickedId === 'setelah_nyalakan') {
        return 'Sangat berbahaya: MCB belum boleh dinyalakan sebelum seluruh inspeksi selesai, disetujui guru, dan LOTO dilepas.';
      }
      if (clickedId === 'setelah_buka_loto') {
        return 'Jangan membuka kunci LOTO sebelum instalasi diperiksa dan dinyatakan aman oleh instruktur.';
      }
      if (clickedId === 'setelah_guru') {
        return 'Lakukan pemeriksaan mandiri terhadap kekencangan sambungan dan kabel terlebih dahulu sebelum memanggil instruktur.';
      }
      if (clickedId === 'setelah_periksa') {
        return 'Bersihkan serpihan tembaga dari meja kerja terlebih dahulu agar area rapi dan inspeksi sambungan lebih jelas.';
      }
    }
    return `Langkah ini belum tepat untuk urutan ke-${placedCount + 1}. Pikirkan urutan logis keselamatan kerja listrik.`;
  }

  function render() {
    const isAllCompleted = completedStages.every(Boolean);
    const cat = categories[currentCatIndex];
    const totalMistakes = stageMistakes[0] + stageMistakes[1] + stageMistakes[2];

    // HTML Wrapper Utama
    let contentHtml = '';

    if (showFinalSummary && isAllCompleted) {
      // Tampilan Ringkasan Akhir
      let evaluationBadge = 'Sangat Teliti & Sempurna 🌟';
      if (totalMistakes > 0 && totalMistakes <= 3) {
        evaluationBadge = 'Bagus & Cermat 👍';
      } else if (totalMistakes > 3) {
        evaluationBadge = 'Perlu Lebih Berhati-hati ⚠️';
      }

      contentHtml = `
        <div class="sop-final-summary">
          <div class="sop-summary-title">
            <i class="bi bi-patch-check-fill" style="margin-right: 6px;"></i>Semua Tahap SOP Selesai Terverifikasi!
          </div>
          <div class="sop-summary-subtitle">
            Anda telah berhasil memahami dan menyusun seluruh Prosedur Operasional Standar (SOP) keselamatan kerja listrik.
          </div>

          <div class="sop-summary-score-box">
            <div class="sop-summary-score-item">
              <strong>${evaluationBadge}</strong>
              <span>Predikat Keselamatan</span>
            </div>
            <div class="sop-summary-score-item">
              <strong>${totalMistakes}</strong>
              <span>Total Kesalahan</span>
            </div>
            <div class="sop-summary-score-item">
              <strong>100%</strong>
              <span>Kesiapan Praktik</span>
            </div>
          </div>

          <!-- Checklist Sebelum -->
          <div class="sop-summary-stage-title">
            <i class="bi bi-shield-check"></i>1. Sebelum Bekerja (Persiapan &amp; Isolasi LOTO)
          </div>
          <ul class="sop-summary-list">
            ${categories[0].steps.map((st, i) => `
              <li class="sop-summary-item">
                <i class="bi bi-check-circle-fill"></i>
                <div class="sop-summary-item-text">
                  <strong>${i + 1}. ${st.text}</strong>
                  <em>Alasan: ${st.why}</em>
                </div>
              </li>
            `).join('')}
          </ul>

          <!-- Checklist Saat -->
          <div class="sop-summary-stage-title">
            <i class="bi bi-lightning-charge-fill"></i>2. Saat Bekerja (Praktik Kerja Aman)
          </div>
          <ul class="sop-summary-list">
            ${categories[1].cards.map(cd => `
              <li class="sop-summary-item">
                <i class="bi ${cd.type === 'wajib' ? 'bi-check-circle-fill' : 'bi-x-octagon-fill'}" style="color: ${cd.type === 'wajib' ? '#10b981' : '#ef4444'};"></i>
                <div class="sop-summary-item-text">
                  <strong>[${cd.type === 'wajib' ? 'WAJIB' : 'DILARANG'}] ${cd.text}</strong>
                  <em>Alasan: ${cd.why}</em>
                </div>
              </li>
            `).join('')}
          </ul>

          <!-- Checklist Setelah -->
          <div class="sop-summary-stage-title">
            <i class="bi bi-clipboard2-check-fill"></i>3. Setelah Bekerja (Inspeksi &amp; Uji Coba)
          </div>
          <ul class="sop-summary-list">
            ${categories[2].steps.map((st, i) => `
              <li class="sop-summary-item">
                <i class="bi bi-check-circle-fill"></i>
                <div class="sop-summary-item-text">
                  <strong>${i + 1}. ${st.text}</strong>
                  <em>Alasan: ${st.why}</em>
                </div>
              </li>
            `).join('')}
          </ul>

          <div class="sop-footer-actions" style="margin-top: 16px;">
            <button id="sop-btn-view-stages" class="sop-btn-secondary" aria-label="Tinjau kembali per tahap">
              <i class="bi bi-arrow-left"></i>Tinjau Per Tahap
            </button>
            <button id="sop-btn-restart-all" class="sop-btn-primary" aria-label="Ulangi seluruh simulasi SOP">
              <i class="bi bi-arrow-counterclockwise"></i>Ulangi Simulasi SOP
            </button>
          </div>
        </div>
      `;
    } else {
      // Tampilan Tahap Aktif (0: Sebelum, 1: Saat, 2: Setelah)
      const isCurrentCompleted = completedStages[currentCatIndex];

      // Umpan balik Box
      const feedbackHtml = feedbackState.message ? `
        <div class="sop-feedback-box ${feedbackState.type === 'error' ? 'is-error' : 'is-success'}" role="status" aria-live="polite">
          <i class="bi ${feedbackState.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}"></i>
          <span>${feedbackState.message}</span>
        </div>
      ` : '';

      // Tampilan Berdasarkan Mode
      let stageBodyHtml = '';

      if (cat.mode === 'sequence') {
        // Mode Urutan (Tahap 1 & 3)
        const currentData = stageData[currentCatIndex];
        const stepMap = new Map(cat.steps.map(s => [s.id, s]));

        // Slot Area
        const slotsHtml = cat.steps.map((correctStep, idx) => {
          const placedId = currentData.placedIds[idx];
          const placedStep = placedId ? stepMap.get(placedId) : null;
          return `
            <div class="sop-slot-item ${placedStep ? 'is-filled' : ''}">
              <div class="sop-slot-header">
                <span class="sop-slot-number" aria-hidden="true">${idx + 1}</span>
                <div class="sop-slot-text">
                  ${placedStep ? placedStep.text : `<span class="sop-slot-empty-hint">Urutan ke-${idx + 1}: Pilih kartu di bawah...</span>`}
                </div>
                ${placedStep ? '<i class="bi bi-check-lg" style="color: #10b981; font-weight: bold;" aria-hidden="true"></i>' : ''}
              </div>
              ${placedStep ? `
                <div class="sop-slot-why">
                  <strong>Alasan:</strong> ${placedStep.why}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        // Pool Kartu Pilihan
        const poolHtml = currentData.poolIds.length > 0 ? `
          <div class="sop-pool-section">
            <div class="sop-pool-title">Pilih langkah yang tepat untuk urutan ke-${currentData.placedIds.length + 1}:</div>
            <div class="sop-cards-list">
              ${currentData.poolIds.map(id => {
                const step = stepMap.get(id);
                return `
                  <button class="sop-card-btn ${feedbackState.isShake ? 'is-error' : ''}" data-step-id="${id}" aria-label="Langkah: ${step.text}">
                    <i class="bi bi-hand-index-thumb" aria-hidden="true"></i>
                    <span>${step.text}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : '';

        stageBodyHtml = `
          <div class="sop-slots-list">
            ${slotsHtml}
          </div>
          ${poolHtml}
        `;
      } else {
        // Mode Klasifikasi Wajib vs Dilarang (Tahap 2: Saat Bekerja)
        const currentData = stageData[1];
        const isDoneClassifying = currentData.cardIndex >= currentData.poolCards.length;

        if (!isDoneClassifying) {
          const activeCard = currentData.poolCards[currentData.cardIndex];
          stageBodyHtml = `
            <div class="sop-classify-deck">
              <div class="sop-classify-progress">
                Pernyataan ${currentData.cardIndex + 1} dari ${currentData.poolCards.length}
              </div>
              <div class="sop-classify-card">
                "${activeCard.text}"
              </div>
              <div class="sop-classify-actions">
                <button id="sop-btn-wajib" class="sop-btn-wajib" aria-label="Tindakan ini Wajib Dilakukan">
                  <i class="bi bi-check-circle-fill" aria-hidden="true"></i> Wajib Dilakukan
                </button>
                <button id="sop-btn-dilarang" class="sop-btn-dilarang" aria-label="Tindakan ini Dilarang Keras">
                  <i class="bi bi-x-octagon-fill" aria-hidden="true"></i> Dilarang Keras
                </button>
              </div>
            </div>
          `;
        }

        // Tampilkan Daftar yang Telah Terklasifikasi
        if (currentData.classifiedCards.length > 0) {
          const wajibList = currentData.classifiedCards.filter(c => c.type === 'wajib');
          const dilarangList = currentData.classifiedCards.filter(c => c.type === 'dilarang');

          stageBodyHtml += `
            <div class="sop-classified-lists">
              <div class="sop-classified-col">
                <div class="sop-classified-col-title is-wajib">
                  <i class="bi bi-check-circle-fill"></i> Tindakan Wajib (${wajibList.length})
                </div>
                ${wajibList.map(item => `
                  <div class="sop-classified-item">
                    <strong>${item.text}</strong>
                    <div class="sop-classified-item-why">&bull; ${item.why}</div>
                  </div>
                `).join('')}
              </div>

              <div class="sop-classified-col">
                <div class="sop-classified-col-title is-dilarang">
                  <i class="bi bi-x-octagon-fill"></i> Tindakan Dilarang (${dilarangList.length})
                </div>
                ${dilarangList.map(item => `
                  <div class="sop-classified-item">
                    <strong>${item.text}</strong>
                    <div class="sop-classified-item-why">&bull; ${item.why}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }

      // Notifikasi Tahap Selesai
      const completeBannerHtml = isCurrentCompleted ? `
        <div class="sop-stage-complete">
          <div class="sop-stage-complete-text">
            <i class="bi bi-check-circle-fill" style="margin-right: 6px;"></i>${cat.title} Berhasil Diselesaikan!
          </div>
          ${currentCatIndex < 2 ? `
            <button id="sop-btn-next-stage" class="sop-btn-primary" aria-label="Lanjut ke tahap berikutnya">
              Lanjut ke ${categories[currentCatIndex + 1].title} <i class="bi bi-arrow-right"></i>
            </button>
          ` : `
            <button id="sop-btn-view-summary" class="sop-btn-primary" aria-label="Buka ringkasan akhir evaluasi SOP">
              <i class="bi bi-patch-check-fill"></i> Lihat Ringkasan Akhir SOP
            </button>
          `}
        </div>
      ` : '';

      contentHtml = `
        <!-- Info Progress & Skor -->
        <div class="sop-progress-row">
          <span class="sop-badge-stage">${cat.badge}</span>
          <span class="sop-badge-score">
            Kesalahan di tahap ini: <strong>${stageMistakes[currentCatIndex]}</strong>
          </span>
        </div>

        <!-- Tab Navigasi Kategori -->
        <div class="sop-tabs-nav" role="tablist" aria-label="Tahapan SOP Kerja Aman">
          ${categories.map((c, idx) => {
            const isCompleted = completedStages[idx];
            const isActive = idx === currentCatIndex;
            return `
              <button class="sop-tab-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}"
                      role="tab"
                      aria-selected="${isActive ? 'true' : 'false'}"
                      aria-label="${c.title} ${isCompleted ? '(Selesai)' : ''}"
                      data-cat="${idx}">
                ${isCompleted ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>' : ''}
                <span>${c.title}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Info Kotak Tahap -->
        <div class="sop-stage-info">
          <strong>${cat.fullTitle}</strong>: ${cat.description}
        </div>

        ${feedbackHtml}
        ${stageBodyHtml}
        ${completeBannerHtml}

        <!-- Footer Tombol Aksi -->
        <div class="sop-footer-actions">
          <button id="sop-btn-shuffle" class="sop-btn-secondary" aria-label="Acak ulang kartu tahap ini">
            <i class="bi bi-shuffle"></i> Acak Ulang Tahap Ini
          </button>
          ${isAllCompleted ? `
            <button id="sop-btn-open-summary" class="sop-btn-secondary" aria-label="Lihat ringkasan lengkap SOP">
              <i class="bi bi-journal-check"></i> Ringkasan Lengkap SOP
            </button>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="sop-widget">
        <div class="sop-header">
          <h4 class="sop-title">
            <i class="bi bi-shield-check" aria-hidden="true"></i>Simulasi SOP Kerja Aman Kelistrikan
          </h4>
          <p class="sop-desc">
            Pahami prosedur standar keselamatan kerja listrik dari persiapan, pelaksanaan, hingga normalisasi instalasi.
          </p>
        </div>

        ${contentHtml}
      </div>
    `;

    // Pasang Event Listeners
    attachEventListeners();

    // Fokus Otomatis yang Ramah Aksesibilitas
    if (pendingFocusSelector) {
      const targetEl = container.querySelector(pendingFocusSelector);
      if (targetEl) {
        targetEl.focus();
      }
      pendingFocusSelector = null;
    }
  }

  function attachEventListeners() {
    // 1. Tab Navigasi Kategori
    container.querySelectorAll('.sop-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        const catIdx = parseInt(tab.getAttribute('data-cat'), 10);
        if (!isNaN(catIdx) && catIdx !== currentCatIndex) {
          currentCatIndex = catIdx;
          showFinalSummary = false;
          render();
        }
      });
    });

    // 2. Klik Kartu Urutan (Mode Sequence: Sebelum & Setelah)
    container.querySelectorAll('.sop-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const clickedId = btn.getAttribute('data-step-id');
        const cat = categories[currentCatIndex];
        const currentData = stageData[currentCatIndex];
        const expectedStep = cat.steps[currentData.placedIds.length];

        if (clickedId === expectedStep.id) {
          // Benar
          playUIClick();
          currentData.placedIds.push(clickedId);
          currentData.poolIds = currentData.poolIds.filter(id => id !== clickedId);
          clearFeedback();

          if (currentData.placedIds.length === cat.steps.length) {
            completedStages[currentCatIndex] = true;
            try { playSuccess(); } catch (e) {}
            setFeedback(`Selamat! Tahap ${cat.title} berhasil disusun sesuai SOP yang benar.`, 'success');
            pendingFocusSelector = currentCatIndex < 2 ? '#sop-btn-next-stage' : '#sop-btn-view-summary';
          } else {
            pendingFocusSelector = '.sop-card-btn';
          }
          render();
        } else {
          // Salah Urutan
          try { playError(); } catch (e) {}
          stageMistakes[currentCatIndex]++;
          const errorMsg = getSequenceErrorMessage(
            clickedId,
            expectedStep.id,
            currentCatIndex,
            currentData.placedIds.length
          );
          setFeedback(errorMsg, 'error', true);
          render();

          // Reset animasi goyang kartu setelah 400ms
          setTimeout(() => {
            if (feedbackState.isShake) {
              feedbackState.isShake = false;
              const activeErrorCard = container.querySelector('.sop-card-btn.is-error');
              if (activeErrorCard) activeErrorCard.classList.remove('is-error');
            }
          }, 400);
        }
      });
    });

    // 3. Klasifikasi Kartu (Mode Classify: Saat Bekerja)
    const btnWajib = container.querySelector('#sop-btn-wajib');
    const btnDilarang = container.querySelector('#sop-btn-dilarang');

    function handleClassification(choice) {
      const currentData = stageData[1];
      const activeCard = currentData.poolCards[currentData.cardIndex];
      if (!activeCard) return;

      if (choice === activeCard.type) {
        // Pilihan Benar
        playUIClick();
        currentData.classifiedCards.push({
          ...activeCard,
          userChoice: choice,
          correct: true
        });
        currentData.cardIndex++;
        clearFeedback();

        if (currentData.cardIndex >= currentData.poolCards.length) {
          completedStages[1] = true;
          try { playSuccess(); } catch (e) {}
          setFeedback('Luar biasa! Seluruh aturan keselamatan saat bekerja telah diklasifikasikan dengan benar.', 'success');
          pendingFocusSelector = '#sop-btn-next-stage';
        } else {
          pendingFocusSelector = '#sop-btn-wajib';
        }
        render();
      } else {
        // Pilihan Salah
        try { playError(); } catch (e) {}
        stageMistakes[1]++;
        setFeedback(activeCard.wrongFeedback, 'error', true);
        render();

        setTimeout(() => {
          if (feedbackState.isShake) {
            feedbackState.isShake = false;
          }
        }, 400);
      }
    }

    if (btnWajib) {
      btnWajib.addEventListener('click', () => handleClassification('wajib'));
    }
    if (btnDilarang) {
      btnDilarang.addEventListener('click', () => handleClassification('dilarang'));
    }

    // 4. Tombol Lanjut Tahap Berikutnya
    const btnNext = container.querySelector('#sop-btn-next-stage');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        if (currentCatIndex < categories.length - 1) {
          currentCatIndex++;
          render();
        }
      });
    }

    // 5. Tombol Lihat Ringkasan
    const btnSummary = container.querySelector('#sop-btn-view-summary') || container.querySelector('#sop-btn-open-summary');
    if (btnSummary) {
      btnSummary.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        showFinalSummary = true;
        render();
      });
    }

    // 6. Tombol Kembali Tinjau Per Tahap dari Ringkasan
    const btnViewStages = container.querySelector('#sop-btn-view-stages');
    if (btnViewStages) {
      btnViewStages.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        showFinalSummary = false;
        currentCatIndex = 0;
        render();
      });
    }

    // 7. Tombol Acak Ulang Tahap Ini
    const btnShuffle = container.querySelector('#sop-btn-shuffle');
    if (btnShuffle) {
      btnShuffle.addEventListener('click', () => {
        playUIClick();
        resetCurrentStage();
        render();
      });
    }

    // 8. Tombol Ulangi Seluruh Simulasi
    const btnRestartAll = container.querySelector('#sop-btn-restart-all');
    if (btnRestartAll) {
      btnRestartAll.addEventListener('click', () => {
        playUIClick();
        resetAllStages();
        render();
      });
    }
  }

  // Inisialisasi awal
  render();
}
