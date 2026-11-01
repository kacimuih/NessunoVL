// Interactive Electrical Shock First Aid (P3K) Sequence & Simulation Widget - Virtual Lab IPL
import { playUIClick, playError, playSuccess } from '../utils/audioFeedback.js';

export function renderP3kSequenceWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 1. Data Mode 1: Urutan Prosedur P3K Sengatan Listrik (6 Langkah Terverifikasi)
  const sequenceSteps = [
    {
      id: 'step_power',
      text: 'Amankan diri & putuskan aliran listrik (matikan MCB utama atau cabut steker)',
      why: 'Meniadakan bahaya sengatan bagi penolong dan menghentikan kerusakan jaringan tubuh pada korban.',
      isCriticalFirst: true
    },
    {
      id: 'step_help',
      text: 'Panggil bantuan darurat (laporkan guru, telepon 112 / 119) & minta bawakan AED',
      why: 'Respon cepat tenaga medis profesional dan ketersediaan AED sangat krusial jika terjadi henti jantung mendadak.',
      isCriticalFirst: false
    },
    {
      id: 'step_check',
      text: 'Cek respons korban (tepuk pundak) dan periksa gerakan napas (maksimal 10 detik)',
      why: 'Menentukan apakah korban hanya pingsan atau berada dalam kondisi henti napas/henti sirkulasi.',
      isCriticalFirst: false
    },
    {
      id: 'step_cpr',
      text: 'Lakukan RJP (kompresi dada 100–120x/menit, kedalaman 5–6 cm) jika tidak bernapas & pasang AED',
      why: 'Mempertahankan aliran darah beroksigen ke otak dan organ vital saat jantung berhenti memompa.',
      isCriticalFirst: false
    },
    {
      id: 'step_burn',
      text: 'Dinginkan luka bakar dengan air mengalir bersih (10–20 menit) & tutup kasa steril',
      why: 'Menurunkan suhu jaringan kulit yang terbakar arus dan mencegah kontaminasi kuman/infeksi.',
      isCriticalFirst: false
    },
    {
      id: 'step_refer',
      text: 'Dampingi korban dan rujuk ke rumah sakit / faskes untuk pemeriksaan rekam jantung (EKG)',
      why: 'Sengatan listrik berisiko memicu gangguan irama jantung tertunda (delayed arrhythmia) atau kerusakan ginjal laten.',
      isCriticalFirst: false
    }
  ];

  // 2. Data Mode 2: Boleh / Tidak Boleh (8 Tindakan Nyata)
  const classificationCards = [
    {
      id: 'act_pull_barehand',
      text: 'Menarik tubuh korban langsung dengan tangan telanjang saat korban masih menempel pada kabel listrik',
      type: 'dilarang',
      why: 'Tubuh korban yang teraliri listrik menjadi konduktor aktif. Menyentuhnya membuat penolong ikut tersengat arus fatal (double victims).',
      wrongFeedback: 'BAHAYA FATAL: Jangan pernah menyentuh korban saat listrik masih menyala! Anda akan ikut tersengat!'
    },
    {
      id: 'act_cut_mcb',
      text: 'Segera mematikan tuas MCB / sakelar utama atau mencabut steker dari stop kontak',
      type: 'boleh',
      why: 'Tindakan pertama paling aman dan efektif untuk memutus rantai sengatan listrik tanpa menyentuh korban.',
      wrongFeedback: 'Keliru: Mematikan MCB adalah TINDAKAN UTAMA yang wajib dilakukan pertama kali!'
    },
    {
      id: 'act_toothpaste',
      text: 'Mengoleskan odol (pasta gigi), mentega, minyak goreng, atau kecap pada kulit yang terbakar listrik',
      type: 'dilarang',
      why: 'Bahan-bahan tersebut memerangkap panas di dalam jaringan kulit, merusak sel lebih dalam, dan memicu infeksi parah.',
      wrongFeedback: 'Bahaya: Mengoleskan odol/minyak SANGAT DILARANG karena memperparah luka dan memicu infeksi jaringan!'
    },
    {
      id: 'act_water_burn',
      text: 'Mendinginkan luka bakar sengatan listrik dengan air bersih mengalir bersuhu ruang selama 10–20 menit',
      type: 'boleh',
      why: 'Air mengalir suhu ruang melepaskan panas dari jaringan tubuh secara fisiologis tanpa memicu hipotermia.',
      wrongFeedback: 'Keliru: Mendinginkan dengan air mengalir suhu ruang adalah prosedur P3K luka bakar standar yang BENAR!'
    },
    {
      id: 'act_give_drink',
      text: 'Memberi minum air atau teh hangat pada korban yang baru pingsan atau masih lemas/syok',
      type: 'dilarang',
      why: 'Refleks menelan korban belum pulih sempurna sehingga cairan berisiko masuk ke saluran napas/paru-paru (tersedak/aspirasi).',
      wrongFeedback: 'Bahaya: Memberi minum korban syok/pingsan DILARANG KERAS karena berisiko fatal menyumbat jalan napas!'
    },
    {
      id: 'act_approach_highvoltage',
      text: 'Mendekati kabel tiang listrik PLN tegangan tinggi yang putus ke tanah berair di luar ruangan',
      type: 'dilarang',
      why: 'Tegangan tinggi (> 1000 V) menghasilkan loncatan busur api dan tegangan langkah (step potential) di tanah yang mematikan.',
      wrongFeedback: 'BAHAYA MEMATIKAN: Jaringan tegangan tinggi DILARANG DIDEKATI! Hubungi PLN 123 dan Darurat 112!'
    },
    {
      id: 'act_hospital_check',
      text: 'Membawa korban ke rumah sakit/faskes terdekat untuk rekam jantung (EKG) meski korban merasa telah pulih',
      type: 'boleh',
      why: 'Sengatan listrik berpotensi memicu gangguan irama jantung laten (delayed arrhythmia) yang berbahaya beberapa jam kemudian.',
      wrongFeedback: 'Keliru: Rujukan medis ke rumah sakit WAJIB dilakukan untuk memastikan tidak ada komplikasi jantung tersembunyi!'
    },
    {
      id: 'act_wooden_stick',
      text: 'Menggunakan tongkat kayu kering atau pipa isolator untuk memisahkan korban pada tegangan rendah jika MCB jauh',
      type: 'boleh',
      why: 'Kayu kering merupakan isolator pada instalasi tegangan rendah (220 V) dalam kondisi darurat saat sakelar tak terjangkau.',
      wrongFeedback: 'Keliru: Menggunakan isolator kering pada tegangan rendah diperbolehkan bila sumber daya tidak dapat dimatikan segera!'
    }
  ];

  // 3. Data Mode 3: Skenario Kasus Nyata (3 Kasus Kunci)
  const scenarios = [
    {
      id: 'scen_workshop',
      context: 'Studi Kasus 1: Praktikum Bengkel Listrik',
      question: 'Saat merakit di bengkel, tangan rekanmu kaku dan menempel erat pada kawat bertegangan di panel sakelar. Rekanmu berteriak kesakitan. Apa tindakan PERTAMA yang wajib kamu lakukan?',
      options: [
        {
          id: 'opt_1a',
          text: 'Segera menarik badan atau baju rekanmu sekuat tenaga agar terlepas',
          isCorrect: false,
          explanation: 'SALAH & BAHAYA FATAL: Menyentuh korban yang masih menempel pada sumber listrik akan membuatmu ikut tersengat arus (menjadi korban kedua).'
        },
        {
          id: 'opt_1b',
          text: 'Lari ke panel MCB pembagi terdekat dan turunkan tuas MCB utama ke posisi OFF',
          isCorrect: true,
          explanation: 'BENAR (Tindakan Utama): Mematikan MCB memutuskan aliran listrik seketika dan menghilangkan sumber bahaya dengan aman sebelum mendekati korban.'
        },
        {
          id: 'opt_1c',
          text: 'Menyiram kawat dan tangan rekanmu dengan air agar tidak terbakar',
          isCorrect: false,
          explanation: 'SALAH BESAR: Air adalah konduktor listrik yang akan memperluas area aliran arus dan memperparah sengatan secara fatal.'
        },
        {
          id: 'opt_1d',
          text: 'Langsung memeriksa denyut nadi di leher rekanmu',
          isCorrect: false,
          explanation: 'SALAH & FATAL: Pemeriksaan fisik dilarang keras dilakukan sebelum aliran listrik dipastikan telah padam total.'
        }
      ]
    },
    {
      id: 'scen_cpr',
      context: 'Studi Kasus 2: Korban Tidak Bernapas (Bantuan Hidup Dasar)',
      question: 'Aliran listrik telah diputus dan korban telah terbebas. Korban tergeletak tidak sadar, tidak merespons panggilan, dan dadanya tidak bergerak naik-turun (tidak bernapas). Apa tindakan selanjutnya?',
      options: [
        {
          id: 'opt_2a',
          text: 'Memberi minum air teh hangat agar korban cepat sadar',
          isCorrect: false,
          explanation: 'SALAH: Korban yang tidak sadar tidak memiliki refleks menelan; cairan akan masuk ke saluran paru-paru dan memicu aspirasi fatal.'
        },
        {
          id: 'opt_2b',
          text: 'Minta orang sekitar telepon 112/119, segera lakukan kompresi dada (RJP/CPR) 100–120x/menit, dan minta bawakan AED',
          isCorrect: true,
          explanation: 'BENAR: Korban tidak bernapas berada dalam kondisi henti jantung. Kompresi dada berkualitas tinggi dan pemasangan AED sesegera mungkin adalah penyelamat utama nyawa korban.'
        },
        {
          id: 'opt_2c',
          text: 'Mengoleskan minyak angin pada hidung dan luka bakar di tubuh korban',
          isCorrect: false,
          explanation: 'SALAH: Minyak tidak mengembalikan pernapasan dan justru merusak jaringan luka bakar.'
        },
        {
          id: 'opt_2d',
          text: 'Mendudukkan korban dan memijat telapak kakinya',
          isCorrect: false,
          explanation: 'SALAH: Posisi duduk menghambat pasokan darah ke otak saat jantung berhenti memompa.'
        }
      ]
    },
    {
      id: 'scen_highvoltage',
      context: 'Studi Kasus 3: Bahaya Kabel Tegangan Tinggi Luar Gedung',
      question: 'Di halaman sekolah setelah badai, kabel tiang listrik PLN putus dan jatuh ke tanah berair. Seseorang tergeletak di dekatnya. Tindakan apa yang paling tepat?',
      options: [
        {
          id: 'opt_3a',
          text: 'Mencari dahan pohon kayu panjang untuk mengangkat kabel tiang PLN tersebut',
          isCorrect: false,
          explanation: 'SALAH & MEMATIKAN: Kabel tiang listrik PLN bertegangan tinggi (> 1000 V). Isolator kayu biasa tidak mampu menahan tegangan ribuan volt dan listrik tetap dapat menembus penolong.'
        },
        {
          id: 'opt_3b',
          text: 'Berlari menerobos genangan air untuk menarik korban keluar',
          isCorrect: false,
          explanation: 'SALAH & MEMATIKAN: Genangan air menghantarkan arus listrik dengan tegangan langkah (step potential) yang tinggi. Anda akan langsung tersengat begitu mendekat.'
        },
        {
          id: 'opt_3c',
          text: 'DILARANG MENDEKAT, jaga radius aman, peringatkan orang lain, dan hubungi PLN (123) serta Panggilan Darurat (112)',
          isCorrect: true,
          explanation: 'BENAR: Jaringan tegangan tinggi hanya boleh ditangani oleh tim khusus PLN dengan alat pengaman standar tegangan tinggi. Mengisolasi area dan menjauh adalah prinsip keselamatan mutlak.'
        },
        {
          id: 'opt_3d',
          text: 'Melempar ban karet bekas ke atas kabel agar aliran terputus',
          isCorrect: false,
          explanation: 'SALAH: Melempar benda tidak memutus arus dan dapat memicu loncatan bunga api listrik (arcing) yang berbahaya.'
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

  // State Management
  let currentModeIndex = 0; // 0: Urutkan, 1: Boleh/Tidak, 2: Skenario
  const completedModes = [false, false, false];
  const modeMistakes = [0, 0, 0];
  let showFinalSummary = false;

  // Mode 1: Sequence State
  let placedSequence = [];
  let poolSequence = shuffle(sequenceSteps.map(s => s.id));
  let severeWarningMessage = '';

  // Mode 2: Classify State
  let classifyIndex = 0;
  let classifiedCards = [];
  let poolClassification = shuffle(classificationCards);

  // Mode 3: Scenario State
  let scenarioIndex = 0;
  let answeredScenarios = []; // { scenarioId, selectedOptId, isCorrect, explanation }
  let selectedScenarioFeedback = null;

  let feedbackState = { message: '', type: null, isShake: false };
  let pendingFocusSelector = null;

  function setFeedback(msg, type = 'error', isShake = false) {
    feedbackState = { message: msg, type, isShake };
  }

  function clearFeedback() {
    feedbackState = { message: '', type: null, isShake: false };
    severeWarningMessage = '';
  }

  function resetCurrentMode() {
    clearFeedback();
    modeMistakes[currentModeIndex] = 0;
    completedModes[currentModeIndex] = false;

    if (currentModeIndex === 0) {
      placedSequence = [];
      poolSequence = shuffle(sequenceSteps.map(s => s.id));
      severeWarningMessage = '';
    } else if (currentModeIndex === 1) {
      classifyIndex = 0;
      classifiedCards = [];
      poolClassification = shuffle(classificationCards);
    } else if (currentModeIndex === 2) {
      scenarioIndex = 0;
      answeredScenarios = [];
      selectedScenarioFeedback = null;
    }
  }

  function resetAllModes() {
    clearFeedback();
    showFinalSummary = false;
    currentModeIndex = 0;
    for (let i = 0; i < 3; i++) {
      completedModes[i] = false;
      modeMistakes[i] = 0;
    }
    placedSequence = [];
    poolSequence = shuffle(sequenceSteps.map(s => s.id));
    severeWarningMessage = '';
    classifyIndex = 0;
    classifiedCards = [];
    poolClassification = shuffle(classificationCards);
    scenarioIndex = 0;
    answeredScenarios = [];
    selectedScenarioFeedback = null;
  }

  // Mode Headers Definition
  const modeHeaders = [
    { id: 'mode_seq', title: '1. Urutkan Prosedur', badge: 'Mode 1: Alur Penyelamatan' },
    { id: 'mode_cls', title: '2. Boleh / Dilarang', badge: 'Mode 2: Klasifikasi Tindakan' },
    { id: 'mode_scn', title: '3. Skenario Kasus', badge: 'Mode 3: Studi Kasus Lapangan' }
  ];

  function render() {
    const isAllCompleted = completedModes.every(Boolean);
    const totalMistakes = modeMistakes[0] + modeMistakes[1] + modeMistakes[2];

    let contentHtml = '';

    if (showFinalSummary && isAllCompleted) {
      // Tampilan Ringkasan Akhir P3K Sengatan Listrik
      let evaluationBadge = 'Tanggap & Berjiwa Penolong 🌟';
      if (totalMistakes > 0 && totalMistakes <= 3) {
        evaluationBadge = 'Cekatan & Teliti 👍';
      } else if (totalMistakes > 3) {
        evaluationBadge = 'Perlu Lebih Berhati-hati ⚠️';
      }

      contentHtml = `
        <div class="p3k-final-summary">
          <div class="p3k-summary-title">
            <i class="bi bi-patch-check-fill" style="margin-right: 6px;"></i>Seluruh Prosedur P3K Sengatan Listrik Berhasil Dikuasai!
          </div>
          <div class="p3k-summary-subtitle">
            Anda telah menyelesaikan modul urutan penyelamatan, pemilahan tindakan aman, serta uji skenario darurat kelistrikan.
          </div>

          <div class="p3k-summary-score-box">
            <div class="p3k-summary-score-item">
              <strong>${evaluationBadge}</strong>
              <span>Predikat Evaluasi</span>
            </div>
            <div class="p3k-summary-score-item">
              <strong>${totalMistakes}</strong>
              <span>Total Kesalahan</span>
            </div>
            <div class="p3k-summary-score-item">
              <strong>100%</strong>
              <span>Kesiapan Tanggap Darurat</span>
            </div>
          </div>

          <!-- Checklist Alur Langkah -->
          <div class="p3k-summary-section-title">
            <i class="bi bi-shield-check"></i>Alur 6 Langkah Prosedur P3K Sengatan Listrik
          </div>
          <ul class="p3k-summary-list">
            ${sequenceSteps.map((st, i) => `
              <li class="p3k-summary-item">
                <i class="bi bi-check-circle-fill"></i>
                <div class="p3k-summary-item-text">
                  <strong>${i + 1}. ${st.text}</strong>
                  <em>Alasan: ${st.why}</em>
                </div>
              </li>
            `).join('')}
          </ul>

          <!-- Checklist Boleh vs Dilarang -->
          <div class="p3k-summary-section-title">
            <i class="bi bi-list-check"></i>Panduan Sikap: Boleh vs Dilarang
          </div>
          <ul class="p3k-summary-list">
            ${classificationCards.map(cd => `
              <li class="p3k-summary-item">
                <i class="bi ${cd.type === 'boleh' ? 'bi-check-circle-fill' : 'bi-x-octagon-fill'}" style="color: ${cd.type === 'boleh' ? '#10b981' : '#ef4444'};"></i>
                <div class="p3k-summary-item-text">
                  <strong>[${cd.type === 'boleh' ? 'BOLEH / DIANJURKAN' : 'DILARANG KERAS'}] ${cd.text}</strong>
                  <em>Alasan: ${cd.why}</em>
                </div>
              </li>
            `).join('')}
          </ul>

          <!-- Callout Penting -->
          <div class="p3k-info-box" style="margin-top: 14px;">
            <strong>Nomor Darurat Resmi yang Wajib Diingat:</strong><br/>
            &bull; <strong>112</strong>: Panggilan Darurat Terpadu Nasional (Polisi, Ambulans, SAR, Damkar)<br/>
            &bull; <strong>119</strong>: Layanan Gawat Darurat Medis Kemenkes RI (SPGDT)<br/>
            &bull; <strong>123</strong>: Contact Center PT PLN (Persero) untuk kabel putus dan bahaya jaringan tiang listrik luar gedung.
          </div>

          <div class="p3k-footer-actions" style="margin-top: 16px;">
            <button id="p3k-btn-view-modes" class="p3k-btn-secondary" aria-label="Tinjau kembali per mode simulasi">
              <i class="bi bi-arrow-left"></i>Tinjau Per Mode
            </button>
            <button id="p3k-btn-restart-all" class="p3k-btn-primary" aria-label="Ulangi seluruh simulasi P3K">
              <i class="bi bi-arrow-counterclockwise"></i>Ulangi Simulasi P3K
            </button>
          </div>
        </div>
      `;
    } else {
      // Tampilan Mode Aktif (0: Urutkan, 1: Boleh/Tidak, 2: Skenario)
      const currentMode = modeHeaders[currentModeIndex];
      const isCurrentCompleted = completedModes[currentModeIndex];

      // Pesan Peringatan Keras (Danger to Rescuer)
      const warningHtml = severeWarningMessage ? `
        <div class="p3k-severe-warning" role="alert" aria-live="assertive">
          <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
          <div>${severeWarningMessage}</div>
        </div>
      ` : '';

      // Umpan Balik Normal
      const feedbackHtml = feedbackState.message ? `
        <div class="p3k-feedback-box ${feedbackState.type === 'error' ? 'is-error' : 'is-success'}" role="status" aria-live="polite">
          <i class="bi ${feedbackState.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}"></i>
          <span>${feedbackState.message}</span>
        </div>
      ` : '';

      let modeBodyHtml = '';

      if (currentModeIndex === 0) {
        // ==================== MODE 1: URUTKAN ====================
        const stepMap = new Map(sequenceSteps.map(s => [s.id, s]));

        const slotsHtml = sequenceSteps.map((s, idx) => {
          const placedId = placedSequence[idx];
          const placedStep = placedId ? stepMap.get(placedId) : null;
          return `
            <div class="p3k-slot-item ${placedStep ? 'is-filled' : ''}">
              <div class="p3k-slot-header">
                <span class="p3k-slot-number" aria-hidden="true">${idx + 1}</span>
                <div class="p3k-slot-text">
                  ${placedStep ? placedStep.text : `<span class="p3k-slot-empty-hint">Urutan ke-${idx + 1}: Pilih tindakan dari kartu di bawah...</span>`}
                </div>
                ${placedStep ? '<i class="bi bi-check-lg" style="color: #10b981; font-weight: bold;" aria-hidden="true"></i>' : ''}
              </div>
              ${placedStep ? `
                <div class="p3k-slot-why">
                  <strong>Alasan:</strong> ${placedStep.why}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        const poolHtml = poolSequence.length > 0 ? `
          <div class="p3k-pool-section">
            <div class="p3k-pool-title">Pilih langkah yang tepat untuk tindakan penyelamatan ke-${placedSequence.length + 1}:</div>
            <div class="p3k-cards-list">
              ${poolSequence.map(id => {
                const step = stepMap.get(id);
                return `
                  <button class="p3k-card-btn ${feedbackState.isShake ? 'is-error' : ''}" data-step-id="${id}" aria-label="Langkah: ${step.text}">
                    <i class="bi bi-hand-index-thumb" aria-hidden="true"></i>
                    <span>${step.text}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : '';

        modeBodyHtml = `
          <div class="p3k-slots-list">
            ${slotsHtml}
          </div>
          ${poolHtml}
        `;
      } else if (currentModeIndex === 1) {
        // ==================== MODE 2: BOLEH / TIDAK BOLEH ====================
        const isDoneClassifying = classifyIndex >= poolClassification.length;

        if (!isDoneClassifying) {
          const activeCard = poolClassification[classifyIndex];
          modeBodyHtml = `
            <div class="p3k-classify-deck">
              <div class="p3k-classify-progress">
                Tindakan ${classifyIndex + 1} dari ${poolClassification.length}
              </div>
              <div class="p3k-classify-card">
                "${activeCard.text}"
              </div>
              <div class="p3k-classify-actions">
                <button id="p3k-btn-boleh" class="p3k-btn-boleh" aria-label="Tindakan ini Boleh / Dianjurkan Dilakukan">
                  <i class="bi bi-check-circle-fill" aria-hidden="true"></i> Boleh / Dianjurkan
                </button>
                <button id="p3k-btn-dilarang" class="p3k-btn-dilarang" aria-label="Tindakan ini Dilarang Keras">
                  <i class="bi bi-x-octagon-fill" aria-hidden="true"></i> Dilarang Keras
                </button>
              </div>
            </div>
          `;
        }

        if (classifiedCards.length > 0) {
          const bolehList = classifiedCards.filter(c => c.type === 'boleh');
          const dilarangList = classifiedCards.filter(c => c.type === 'dilarang');

          modeBodyHtml += `
            <div class="p3k-classified-lists">
              <div class="p3k-classified-col">
                <div class="p3k-classified-col-title is-boleh">
                  <i class="bi bi-check-circle-fill"></i> Tindakan Boleh / Benar (${bolehList.length})
                </div>
                ${bolehList.map(item => `
                  <div class="p3k-classified-item">
                    <strong>${item.text}</strong>
                    <div class="p3k-classified-item-why">&bull; ${item.why}</div>
                  </div>
                `).join('')}
              </div>

              <div class="p3k-classified-col">
                <div class="p3k-classified-col-title is-dilarang">
                  <i class="bi bi-x-octagon-fill"></i> Tindakan Dilarang Keras (${dilarangList.length})
                </div>
                ${dilarangList.map(item => `
                  <div class="p3k-classified-item">
                    <strong>${item.text}</strong>
                    <div class="p3k-classified-item-why">&bull; ${item.why}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      } else {
        // ==================== MODE 3: SKENARIO KASUS ====================
        const isDoneScenarios = scenarioIndex >= scenarios.length;

        if (!isDoneScenarios) {
          const activeScenario = scenarios[scenarioIndex];
          const hasAnsweredCurrent = selectedScenarioFeedback !== null;

          modeBodyHtml = `
            <div class="p3k-scenario-box">
              <span class="p3k-scenario-badge">${activeScenario.context} (Soal ${scenarioIndex + 1}/${scenarios.length})</span>
              <div class="p3k-scenario-question">${activeScenario.question}</div>

              <div class="p3k-scenario-options">
                ${activeScenario.options.map((opt, oIdx) => {
                  let optClass = '';
                  if (hasAnsweredCurrent) {
                    if (opt.id === selectedScenarioFeedback.optId) {
                      optClass = opt.isCorrect ? 'is-correct' : 'is-wrong';
                    } else if (opt.isCorrect) {
                      optClass = 'is-correct';
                    }
                  }
                  return `
                    <button class="p3k-scenario-btn ${optClass}" data-opt-id="${opt.id}" ${hasAnsweredCurrent ? 'disabled' : ''} aria-label="Pilihan ${String.fromCharCode(65 + oIdx)}: ${opt.text}">
                      <span class="p3k-scenario-opt-tag">${String.fromCharCode(65 + oIdx)}</span>
                      <span>${opt.text}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              ${selectedScenarioFeedback ? `
                <div class="p3k-feedback-box ${selectedScenarioFeedback.isCorrect ? 'is-success' : 'is-error'}" role="status" aria-live="polite">
                  <i class="bi ${selectedScenarioFeedback.isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
                  <div>
                    <strong>${selectedScenarioFeedback.isCorrect ? 'Tepat Sekali!' : 'Pilihan Kurang Tepat:'}</strong>
                    <p style="margin: 4px 0 0 0; font-size: 0.82rem;">${selectedScenarioFeedback.explanation}</p>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                  <button id="p3k-btn-next-scenario" class="p3k-btn-primary" aria-label="Lanjut ke skenario berikutnya">
                    ${scenarioIndex < scenarios.length - 1 ? 'Skenario Berikutnya <i class="bi bi-arrow-right"></i>' : 'Selesaikan Mode Skenario <i class="bi bi-check-lg"></i>'}
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        } else {
          modeBodyHtml = `
            <div class="p3k-stage-complete">
              <div class="p3k-stage-complete-text">
                <i class="bi bi-check-circle-fill" style="margin-right: 6px;"></i>Semua Skenario Kasus Berhasil Dijawab!
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 4px 0 10px 0;">
                Anda telah menunjukkan pengambilan keputusan tanggap darurat yang matang sesuai prinsip DRABC.
              </p>
            </div>
          `;
        }
      }

      // Banner Notifikasi Mode Selesai
      const completeBannerHtml = isCurrentCompleted ? `
        <div class="p3k-stage-complete">
          <div class="p3k-stage-complete-text">
            <i class="bi bi-check-circle-fill" style="margin-right: 6px;"></i>${currentMode.title} Berhasil Diselesaikan!
          </div>
          ${currentModeIndex < 2 ? `
            <button id="p3k-btn-next-mode" class="p3k-btn-primary" aria-label="Lanjut ke mode berikutnya">
              Lanjut ke ${modeHeaders[currentModeIndex + 1].title} <i class="bi bi-arrow-right"></i>
            </button>
          ` : `
            <button id="p3k-btn-view-summary" class="p3k-btn-primary" aria-label="Lihat ringkasan akhir evaluasi P3K">
              <i class="bi bi-patch-check-fill"></i> Lihat Ringkasan Lengkap P3K
            </button>
          `}
        </div>
      ` : '';

      contentHtml = `
        <!-- Info Progress & Skor -->
        <div class="p3k-progress-row">
          <span class="p3k-badge-mode">${currentMode.badge}</span>
          <span class="p3k-badge-score">
            Kesalahan di bagian ini: <strong>${modeMistakes[currentModeIndex]}</strong>
          </span>
        </div>

        <!-- Tab Navigasi Mode -->
        <div class="p3k-tabs-nav" role="tablist" aria-label="Mode Simulasi P3K Sengatan Listrik">
          ${modeHeaders.map((m, idx) => {
            const isCompleted = completedModes[idx];
            const isActive = idx === currentModeIndex;
            return `
              <button class="p3k-tab-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}"
                      role="tab"
                      aria-selected="${isActive ? 'true' : 'false'}"
                      aria-label="${m.title} ${isCompleted ? '(Selesai)' : ''}"
                      data-mode="${idx}">
                ${isCompleted ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>' : ''}
                <span>${m.title}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${warningHtml}
        ${feedbackHtml}
        ${modeBodyHtml}
        ${completeBannerHtml}

        <!-- Footer Tombol Aksi -->
        <div class="p3k-footer-actions">
          <button id="p3k-btn-shuffle" class="p3k-btn-secondary" aria-label="Ulangi atau acak bagian ini">
            <i class="bi bi-arrow-counterclockwise"></i> Ulangi Mode Ini
          </button>
          ${isAllCompleted ? `
            <button id="p3k-btn-open-summary" class="p3k-btn-secondary" aria-label="Buka ringkasan lengkap P3K">
              <i class="bi bi-journal-check"></i> Ringkasan Lengkap P3K
            </button>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="p3k-widget">
        <div class="p3k-header">
          <h4 class="p3k-title">
            <i class="bi bi-heart-pulse-fill" aria-hidden="true"></i>Simulasi Prosedur P3K Sengatan Listrik
          </h4>
          <p class="p3k-desc">
            Pelajari urutan penyelamatan jiwa, batas tindakan aman vs bahaya, dan respons cepat terhadap skenario darurat kelistrikan.
          </p>
        </div>

        ${contentHtml}
      </div>
    `;

    attachEventListeners();

    if (pendingFocusSelector) {
      const targetEl = container.querySelector(pendingFocusSelector);
      if (targetEl) targetEl.focus();
      pendingFocusSelector = null;
    }
  }

  function attachEventListeners() {
    // 1. Tab Navigasi Mode
    container.querySelectorAll('.p3k-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        const modeIdx = parseInt(tab.getAttribute('data-mode'), 10);
        if (!isNaN(modeIdx) && modeIdx !== currentModeIndex) {
          currentModeIndex = modeIdx;
          showFinalSummary = false;
          render();
        }
      });
    });

    // 2. Mode 1: Urutan Prosedur
    container.querySelectorAll('.p3k-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const clickedId = btn.getAttribute('data-step-id');
        const expectedStep = sequenceSteps[placedSequence.length];

        // PEMERIKSAAN KRITIS: Jika listrik belum dimatikan dan siswa memilih langkah selain putus daya
        if (placedSequence.length === 0 && clickedId !== 'step_power') {
          try { playError(); } catch (e) {}
          modeMistakes[0]++;
          severeWarningMessage = '⚠️ BAHAYA FATAL: Jangan pernah menyentuh korban atau mendekati sirkuit sebelum arus listrik dimatikan! Penolong akan ikut tersengat arus listrik (double victims)!';
          render();
          return;
        }

        if (clickedId === expectedStep.id) {
          // Benar
          playUIClick();
          placedSequence.push(clickedId);
          poolSequence = poolSequence.filter(id => id !== clickedId);
          clearFeedback();

          if (placedSequence.length === sequenceSteps.length) {
            completedModes[0] = true;
            try { playSuccess(); } catch (e) {}
            setFeedback('Luar biasa! Seluruh 6 langkah alur P3K sengatan listrik berhasil disusun secara sempurna dan aman.', 'success');
            pendingFocusSelector = '#p3k-btn-next-mode';
          } else {
            pendingFocusSelector = '.p3k-card-btn';
          }
          render();
        } else {
          // Salah Urutan
          try { playError(); } catch (e) {}
          modeMistakes[0]++;
          severeWarningMessage = '';

          let specificError = `Langkah ini belum tepat untuk urutan ke-${placedSequence.length + 1}.`;
          if (clickedId === 'step_cpr') {
            specificError = 'Pemeriksaan kesadaran dan napas harus dilakukan terlebih dahulu sebelum memulai kompresi dada (RJP).';
          } else if (clickedId === 'step_burn') {
            specificError = 'Bantuan hidup dasar (pernapasan & sirkulasi) harus diprioritaskan sebelum menangani luka bakar luar.';
          } else if (clickedId === 'step_refer') {
            specificError = 'Tindakan pertolongan pertama darurat di tempat harus diselesaikan sebelum merujuk pasien ke faskes.';
          }
          setFeedback(specificError, 'error', true);
          render();

          setTimeout(() => {
            if (feedbackState.isShake) {
              feedbackState.isShake = false;
              const activeErrorCard = container.querySelector('.p3k-card-btn.is-error');
              if (activeErrorCard) activeErrorCard.classList.remove('is-error');
            }
          }, 400);
        }
      });
    });

    // 3. Mode 2: Boleh / Tidak Boleh
    const btnBoleh = container.querySelector('#p3k-btn-boleh');
    const btnDilarang = container.querySelector('#p3k-btn-dilarang');

    function handleClassification(choice) {
      const activeCard = poolClassification[classifyIndex];
      if (!activeCard) return;

      if (choice === activeCard.type) {
        // Benar
        playUIClick();
        classifiedCards.push({
          ...activeCard,
          userChoice: choice,
          correct: true
        });
        classifyIndex++;
        clearFeedback();

        if (classifyIndex >= poolClassification.length) {
          completedModes[1] = true;
          try { playSuccess(); } catch (e) {}
          setFeedback('Hebat! Seluruh tindakan benar dan larangan keras telah berhasil dikelompokkan dengan tepat.', 'success');
          pendingFocusSelector = '#p3k-btn-next-mode';
        } else {
          pendingFocusSelector = '#p3k-btn-boleh';
        }
        render();
      } else {
        // Salah
        try { playError(); } catch (e) {}
        modeMistakes[1]++;
        setFeedback(activeCard.wrongFeedback, 'error', true);
        render();

        setTimeout(() => {
          if (feedbackState.isShake) feedbackState.isShake = false;
        }, 400);
      }
    }

    if (btnBoleh) {
      btnBoleh.addEventListener('click', () => handleClassification('boleh'));
    }
    if (btnDilarang) {
      btnDilarang.addEventListener('click', () => handleClassification('dilarang'));
    }

    // 4. Mode 3: Skenario Kasus Pilihan Ganda
    container.querySelectorAll('.p3k-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optId = btn.getAttribute('data-opt-id');
        const activeScenario = scenarios[scenarioIndex];
        const chosenOpt = activeScenario.options.find(o => o.id === optId);

        if (chosenOpt) {
          if (chosenOpt.isCorrect) {
            playSuccess();
          } else {
            playError();
            modeMistakes[2]++;
          }
          selectedScenarioFeedback = {
            optId,
            isCorrect: chosenOpt.isCorrect,
            explanation: chosenOpt.explanation
          };
          render();
        }
      });
    });

    const btnNextScenario = container.querySelector('#p3k-btn-next-scenario');
    if (btnNextScenario) {
      btnNextScenario.addEventListener('click', () => {
        playUIClick();
        answeredScenarios.push({
          scenarioId: scenarios[scenarioIndex].id,
          ...selectedScenarioFeedback
        });
        selectedScenarioFeedback = null;
        scenarioIndex++;

        if (scenarioIndex >= scenarios.length) {
          completedModes[2] = true;
          try { playSuccess(); } catch (e) {}
        }
        render();
      });
    }

    // 5. Tombol Lanjut Mode
    const btnNextMode = container.querySelector('#p3k-btn-next-mode');
    if (btnNextMode) {
      btnNextMode.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        if (currentModeIndex < modeHeaders.length - 1) {
          currentModeIndex++;
          render();
        }
      });
    }

    // 6. Tombol Buka Ringkasan Akhir
    const btnSummary = container.querySelector('#p3k-btn-view-summary') || container.querySelector('#p3k-btn-open-summary');
    if (btnSummary) {
      btnSummary.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        showFinalSummary = true;
        render();
      });
    }

    // 7. Tombol Tinjau Per Mode dari Ringkasan
    const btnViewModes = container.querySelector('#p3k-btn-view-modes');
    if (btnViewModes) {
      btnViewModes.addEventListener('click', () => {
        playUIClick();
        clearFeedback();
        showFinalSummary = false;
        currentModeIndex = 0;
        render();
      });
    }

    // 8. Tombol Acak Ulang Mode Ini
    const btnShuffle = container.querySelector('#p3k-btn-shuffle');
    if (btnShuffle) {
      btnShuffle.addEventListener('click', () => {
        playUIClick();
        resetCurrentMode();
        render();
      });
    }

    // 9. Tombol Ulangi Seluruh Simulasi
    const btnRestartAll = container.querySelector('#p3k-btn-restart-all');
    if (btnRestartAll) {
      btnRestartAll.addEventListener('click', () => {
        playUIClick();
        resetAllModes();
        render();
      });
    }
  }

  render();
}
