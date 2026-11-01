// Interactive Safety Signs (Rambu K3) Comprehensive Widget - Virtual Lab IPL
import { playUIClick, playError, playSuccess } from '../utils/audioFeedback.js';

export function renderRambuMatchingWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Master SVG Simbol Kelistrikan Spesifik (ISO 7010 & SNI)
  const SVG_SYMBOLS = {
    warning_electric: `
      <polygon points="25,5 45,42 5,42" fill="#fbbf24" stroke="#000000" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M23 15 L19 26 H25 L21 37 L30 24 H24 L28 15 Z" fill="#000000"/>
    `,
    prohibition_switch: `
      <circle cx="25" cy="25" r="21" fill="#ffffff" stroke="#dc2626" stroke-width="4"/>
      <rect x="18" y="16" width="14" height="18" rx="2" fill="#334155"/>
      <circle cx="25" cy="22" r="2.5" fill="#cbd5e1"/>
      <line x1="10" y1="10" x2="40" y2="40" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
    `,
    mandatory_gloves: `
      <circle cx="25" cy="25" r="22" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
      <path d="M16 34 C16 30 17 26 18 22 C15 23 13 25 12 23 C11 21 14 19 17 19 C18 19 18 17 18 13 C18 11 21 11 21 13 L21 18 L23 11 C23 9 26 9 26 11 L26 18 L27 12 C27 10 30 10 30 12 L30 18 L32 15 C32 13 35 13 35 15 C35 19 33 28 31 34 Z" fill="#ffffff"/>
      <rect x="16" y="33" width="15" height="3" rx="1" fill="#cbd5e1"/>
    `,
    safe_exit: `
      <rect x="4" y="4" width="42" height="42" rx="5" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
      <rect x="30" y="10" width="8" height="30" rx="1" fill="#ffffff"/>
      <circle cx="18" cy="15" r="3" fill="#ffffff"/>
      <path d="M17 20 L21 26 L27 24 L24 32 L19 37 L16 30 L13 35" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 24 L13 20 L9 23" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    `,
    prohibition_touch: `
      <circle cx="25" cy="25" r="21" fill="#ffffff" stroke="#dc2626" stroke-width="4"/>
      <path d="M18 34 V22 L20 18 C20 16 23 16 23 18 L23 23 L25 19 C25 17 28 17 28 19 L28 24 L30 20 C30 18 33 18 33 20 L33 26 C33 30 30 34 26 34 Z" fill="#000000"/>
      <line x1="10" y1="10" x2="40" y2="40" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
    `,
    mandatory_helmet: `
      <circle cx="25" cy="25" r="22" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
      <path d="M13 28 C13 18 20 14 25 14 C30 14 37 18 37 28 H13 Z" fill="#ffffff"/>
      <rect x="10" y="27" width="30" height="4" rx="1.5" fill="#ffffff"/>
      <path d="M21 31 L25 36 L29 31" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
    `,
    safe_p3k: `
      <rect x="4" y="4" width="42" height="42" rx="5" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
      <rect x="21" y="12" width="8" height="26" rx="2" fill="#ffffff"/>
      <rect x="12" y="21" width="26" height="8" rx="2" fill="#ffffff"/>
    `,
    warning_panel: `
      <polygon points="25,5 45,42 5,42" fill="#fbbf24" stroke="#000000" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="17" y="16" width="16" height="22" rx="2" fill="#000000"/>
      <line x1="21" y1="20" x2="29" y2="20" stroke="#fbbf24" stroke-width="1.5"/>
      <line x1="21" y1="25" x2="29" y2="25" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="27" cy="32" r="1.5" fill="#fbbf24"/>
    `,
    mandatory_boots: `
      <circle cx="25" cy="25" r="22" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
      <path d="M14 18 H22 V27 L33 27 C36 27 38 29 37 32 H14 V18 Z" fill="#ffffff"/>
      <line x1="14" y1="33" x2="37" y2="33" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/>
    `,
    prohibition_noentry: `
      <circle cx="25" cy="25" r="21" fill="#ffffff" stroke="#dc2626" stroke-width="4"/>
      <circle cx="25" cy="15" r="2.5" fill="#000000"/>
      <path d="M22 20 L25 18 L28 20 L26 27 L30 33 M24 27 L20 33" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="10" y1="10" x2="40" y2="40" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
    `
  };

  // 1. Data Pemanasan (Matching 3 Simbol Inti Kelistrikan)
  const warmUpSigns = [
    {
      id: 'peringatan',
      type: 'warning',
      shape: 'Segitiga Kuning',
      shortShape: 'Segitiga Kuning (Kilat)',
      symbolSvg: SVG_SYMBOLS.warning_electric,
      meaning: 'Rambu Peringatan (Kuning, Segitiga): Memperingatkan potensi bahaya (contoh: Awas Bahaya Tegangan Listrik).'
    },
    {
      id: 'larangan',
      type: 'prohibition',
      shape: 'Lingkaran Merah dengan Garis Diagonal',
      shortShape: 'Lingkaran Merah Bergaris Diagonal',
      symbolSvg: SVG_SYMBOLS.prohibition_switch,
      meaning: 'Rambu Larangan (Merah, Lingkaran dengan Garis Diagonal): Melarang perbuatan berbahaya (contoh: Dilarang Menyalakan Sakelar).'
    },
    {
      id: 'wajib',
      type: 'mandatory',
      shape: 'Lingkaran Biru',
      shortShape: 'Lingkaran Biru (Sarung Tangan)',
      symbolSvg: SVG_SYMBOLS.mandatory_gloves,
      meaning: 'Rambu Wajib / Perintah (Biru, Lingkaran): Mengharuskan pemakaian APD kelistrikan (contoh: Wajib Pakai Sarung Tangan Isolasi).'
    }
  ];

  // 2. Data Level 1: Kenali Kategori (10 Rambu Spesifik Kelistrikan)
  const level1Cards = [
    {
      id: 'r_electric',
      name: 'Awas Bahaya Tegangan Listrik',
      category: 'peringatan',
      svg: SVG_SYMBOLS.warning_electric,
      explanation: 'Benar! Bentuk segitiga warna kuning bertepi hitam adalah Rambu Peringatan (Warning) untuk bahaya sengatan listrik.'
    },
    {
      id: 'r_switch',
      name: 'Dilarang Menyalakan Sakelar',
      category: 'larangan',
      svg: SVG_SYMBOLS.prohibition_switch,
      explanation: 'Benar! Lingkaran merah dengan garis diagonal memotong adalah Rambu Larangan (Prohibition) agar sakelar tidak dinyalakan saat perbaikan.'
    },
    {
      id: 'r_gloves',
      name: 'Wajib Pakai Sarung Tangan Isolasi',
      category: 'wajib',
      svg: SVG_SYMBOLS.mandatory_gloves,
      explanation: 'Benar! Lingkaran biru pekat dengan piktogram putih adalah Rambu Kewajiban/Perintah (Mandatory) untuk menggunakan APD isolasi.'
    },
    {
      id: 'r_exit',
      name: 'Jalur Evakuasi Darurat Keluar',
      category: 'aman',
      svg: SVG_SYMBOLS.safe_exit,
      explanation: 'Benar! Bentuk bujur sangkar/persegi panjang warna hijau adalah Rambu Kondisi Aman & Darurat (Safe Condition) untuk arah evakuasi.'
    },
    {
      id: 'r_touch',
      name: 'Dilarang Menyentuh Komponen Bertegangan',
      category: 'larangan',
      svg: SVG_SYMBOLS.prohibition_touch,
      explanation: 'Benar! Lingkaran merah bergaris diagonal melarang tangan menyentuh permukaan atau kawat konduktor terbuka.'
    },
    {
      id: 'r_helmet',
      name: 'Wajib Memakai Helm Pelindung',
      category: 'wajib',
      svg: SVG_SYMBOLS.mandatory_helmet,
      explanation: 'Benar! Lingkaran biru menginstruksikan kewajiban memakai helm safety saat bekerja di bawah instalasi kabel atau gardu.'
    },
    {
      id: 'r_p3k',
      name: 'Kotak Pertolongan Pertama (P3K)',
      category: 'aman',
      svg: SVG_SYMBOLS.safe_p3k,
      explanation: 'Benar! Warna hijau dengan palang putih menunjukkan fasilitas kondisi aman dan peralatan P3K darurat di bengkel.'
    },
    {
      id: 'r_panel',
      name: 'Awas Bahaya Panel Listrik Terbuka',
      category: 'peringatan',
      svg: SVG_SYMBOLS.warning_panel,
      explanation: 'Benar! Segitiga kuning memberi tanda waspada agar berhati-hati di dekat pintu panel instalasi yang sedang aktif.'
    },
    {
      id: 'r_boots',
      name: 'Wajib Memakai Sepatu Safety Berisolasi',
      category: 'wajib',
      svg: SVG_SYMBOLS.mandatory_boots,
      explanation: 'Benar! Lingkaran biru mewajibkan alas kaki berisolasi tanpa logam konduktif untuk memutus aliran arus ke tanah.'
    },
    {
      id: 'r_noentry',
      name: 'Dilarang Masuk bagi yang Tidak Berkepentingan',
      category: 'larangan',
      svg: SVG_SYMBOLS.prohibition_noentry,
      explanation: 'Benar! Lingkaran merah bergaris diagonal membatasi akses hanya untuk teknisi berwenang di area gardu daya.'
    }
  ];

  // 3. Data Level 2: Pasang Rambu yang Tepat (4 Skenario Kasus Nyata)
  const level2Scenarios = [
    {
      id: 'scen_repair',
      context: 'Kasus 1: Perbaikan Sirkuit Penerangan',
      question: 'Teknisi sedang mengganti kabel pada instalasi penerangan di plafon. Agar tidak ada yang menyalakan sakelar MCB secara tidak sengaja, rambu apa yang wajib dipasang pada tuas sakelar?',
      options: [
        {
          id: 'opt_1a',
          text: 'Segitiga Kuning (Awas Tegangan Listrik)',
          svg: SVG_SYMBOLS.warning_electric,
          isCorrect: false,
          reason: 'Kurang tepat: Rambu peringatan hanya memberi tahu adanya tegangan, bukan melarang pengoperasian tuas.'
        },
        {
          id: 'opt_1b',
          text: 'Lingkaran Merah Diagonal (Dilarang Menyalakan Sakelar)',
          svg: SVG_SYMBOLS.prohibition_switch,
          isCorrect: true,
          reason: 'TEPAT SEKALI! Rambu larangan bergaris diagonal merah (bersama gembok LOTO) secara tegas melarang siapapun menaikkan tuas sakelar saat perbaikan berlangsung.'
        },
        {
          id: 'opt_1c',
          text: 'Lingkaran Biru (Wajib Pakai Helm)',
          svg: SVG_SYMBOLS.mandatory_helmet,
          isCorrect: false,
          reason: 'Kurang tepat: Rambu ini merupakan kewajiban APD kepala, bukan penanda penguncian sakelar.'
        },
        {
          id: 'opt_1d',
          text: 'Persegi Hijau (Pintu Evakuasi)',
          svg: SVG_SYMBOLS.safe_exit,
          isCorrect: false,
          reason: 'Salah: Rambu hijau berfungsi untuk penunjuk jalan keluar darurat.'
        }
      ]
    },
    {
      id: 'scen_substation',
      context: 'Kasus 2: Pintu Masuk Gardu Distribusi 380V',
      question: 'Di depan pintu pagar atau dinding ruang gardu trafo distribusi yang menyimpan tegangan listrik berbahaya, rambu apa yang wajib dipasang untuk memperingatkan orang umum?',
      options: [
        {
          id: 'opt_2a',
          text: 'Segitiga Kuning Simbol Kilat Petir (Awas Bahaya Tegangan Listrik)',
          svg: SVG_SYMBOLS.warning_electric,
          isCorrect: true,
          reason: 'TEPAT SEKALI! Segitiga kuning dengan simbol petir adalah rambu peringatan universal untuk memberi tahu potensi sengatan tegangan tinggi di dalam ruangan.'
        },
        {
          id: 'opt_2b',
          text: 'Lingkaran Biru (Wajib Pakai Sarung Tangan)',
          svg: SVG_SYMBOLS.mandatory_gloves,
          isCorrect: false,
          reason: 'Kurang tepat: APD sarung tangan hanya dipakai saat bekerja di dalam, sedangkan pintu pagar luar membutuhkan rambu peringatan umum.'
        },
        {
          id: 'opt_2c',
          text: 'Persegi Hijau (Kotak P3K)',
          svg: SVG_SYMBOLS.safe_p3k,
          isCorrect: false,
          reason: 'Salah: Kotak P3K menunjukkan sarana medis, bukan peringatan bahaya tegangan.'
        },
        {
          id: 'opt_2d',
          text: 'Lingkaran Merah (Dilarang Menyentuh)',
          svg: SVG_SYMBOLS.prohibition_touch,
          isCorrect: false,
          reason: 'Kurang tepat: Rambu larangan menyentuh dipasang pada bodi peralatan terbuka, bukan sebagai peringatan utama area gardu.'
        }
      ]
    },
    {
      id: 'scen_ppe',
      context: 'Kasus 3: Pengukuran Tegangan & Penyambungan Kabel Fasa',
      question: 'Sebelum siswa mulai melakukan pengukuran tegangan dan menyambung terminal kawat fasa pada panel kontrol, rambu APD apa yang wajib dipatuhi untuk melindungi tangan?',
      options: [
        {
          id: 'opt_3a',
          text: 'Lingkaran Biru Simbol Sarung Tangan Isolasi',
          svg: SVG_SYMBOLS.mandatory_gloves,
          isCorrect: true,
          reason: 'TEPAT SEKALI! Lingkaran biru sarung tangan isolasi mewajibkan proteksi isolasi pada tangan dari kontak fisik langsung dengan kawat bertegangan.'
        },
        {
          id: 'opt_3b',
          text: 'Persegi Hijau (Jalur Evakuasi Keluar)',
          svg: SVG_SYMBOLS.safe_exit,
          isCorrect: false,
          reason: 'Salah: Jalur evakuasi adalah sarana penyelamatan jalan keluar.'
        },
        {
          id: 'opt_3c',
          text: 'Segitiga Kuning (Awas Panel Terbuka)',
          svg: SVG_SYMBOLS.warning_panel,
          isCorrect: false,
          reason: 'Kurang tepat: Rambu segitiga memperingatkan bahaya, namun tidak mewajibkan penggunaan APD spesifik pada tangan.'
        },
        {
          id: 'opt_3d',
          text: 'Lingkaran Merah (Dilarang Masuk)',
          svg: SVG_SYMBOLS.prohibition_noentry,
          isCorrect: false,
          reason: 'Kurang tepat: Siswa yang berpraktik memiliki izin masuk di bawah arahan guru.'
        }
      ]
    },
    {
      id: 'scen_fire_evac',
      context: 'Kasus 4: Keadaan Darurat Korsleting & Kebakaran di Bengkel',
      question: 'Jika terjadi korsleting parah yang memicu kepulan asap di bengkel praktikum dan seluruh siswa harus segera keluar menuju titik kumpul, rambu apa yang harus dijadikan panduan arah?',
      options: [
        {
          id: 'opt_4a',
          text: 'Segitiga Kuning (Awas Tegangan Listrik)',
          svg: SVG_SYMBOLS.warning_electric,
          isCorrect: false,
          reason: 'Salah: Rambu segitiga kuning tidak menunjukkan jalur penyelamatan.'
        },
        {
          id: 'opt_4b',
          text: 'Persegi Hijau (Jalur Evakuasi Darurat & Pintu Keluar)',
          svg: SVG_SYMBOLS.safe_exit,
          isCorrect: true,
          reason: 'TEPAT SEKALI! Rambu kondisi aman persegi hijau memandu arah pintu keluar darurat dan titik kumpul (assembly point) yang aman dari bahaya api.'
        },
        {
          id: 'opt_4c',
          text: 'Lingkaran Merah (Dilarang Menyalakan Sakelar)',
          svg: SVG_SYMBOLS.prohibition_switch,
          isCorrect: false,
          reason: 'Salah: Rambu larangan sakelar tidak berhubungan dengan rute penyelamatan jiwa.'
        },
        {
          id: 'opt_4d',
          text: 'Lingkaran Biru (Wajib Sepatu Safety)',
          svg: SVG_SYMBOLS.mandatory_boots,
          isCorrect: false,
          reason: 'Kurang tepat: Sepatu safety adalah APD kerja harian, bukan petunjuk jalur evakuasi.'
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
  let currentTab = 0; // 0: Pemanasan, 1: Level 1 (Kenali), 2: Level 2 (Skenario)
  const completedTabs = [false, false, false];
  const tabMistakes = [0, 0, 0];
  let showFinalSummary = false;

  // Tab 0 State (Pemanasan Matching)
  let warmUpSelectedId = null;
  let warmUpMatches = {};
  let warmUpShuffledDescs = shuffle(warmUpSigns.map(s => ({ id: s.id, text: s.meaning })));

  // Tab 1 State (Level 1: Kenali Kategori)
  let level1Index = 0;
  let level1Pool = shuffle(level1Cards);
  let level1Feedback = null; // { isCorrect, message }

  // Tab 2 State (Level 2: Skenario Kasus)
  let level2Index = 0;
  let level2Pool = shuffle(level2Scenarios);
  let level2Feedback = null; // { optId, isCorrect, reason }

  let pendingFocusSelector = null;

  function resetCurrentTab() {
    tabMistakes[currentTab] = 0;
    completedTabs[currentTab] = false;

    if (currentTab === 0) {
      warmUpSelectedId = null;
      warmUpMatches = {};
      warmUpShuffledDescs = shuffle(warmUpSigns.map(s => ({ id: s.id, text: s.meaning })));
    } else if (currentTab === 1) {
      level1Index = 0;
      level1Pool = shuffle(level1Cards);
      level1Feedback = null;
    } else if (currentTab === 2) {
      level2Index = 0;
      level2Pool = shuffle(level2Scenarios);
      level2Feedback = null;
    }
  }

  function resetAllTabs() {
    showFinalSummary = false;
    currentTab = 0;
    for (let i = 0; i < 3; i++) {
      completedTabs[i] = false;
      tabMistakes[i] = 0;
    }
    warmUpSelectedId = null;
    warmUpMatches = {};
    warmUpShuffledDescs = shuffle(warmUpSigns.map(s => ({ id: s.id, text: s.meaning })));
    level1Index = 0;
    level1Pool = shuffle(level1Cards);
    level1Feedback = null;
    level2Index = 0;
    level2Pool = shuffle(level2Scenarios);
    level2Feedback = null;
  }

  function render() {
    const isAllCompleted = completedTabs.every(Boolean);
    const totalMistakes = tabMistakes[0] + tabMistakes[1] + tabMistakes[2];

    const tabDefinitions = [
      { id: 'tab_warm', title: 'Pemanasan: 3 Simbol', badge: 'Bagian 1: Pengenalan Bentuk Dasar' },
      { id: 'tab_lvl1', title: 'Level 1: Kenali Kategori', badge: 'Bagian 2: Uji Kategori 10 Rambu' },
      { id: 'tab_lvl2', title: 'Level 2: Skenario Kasus', badge: 'Bagian 3: Studi Kasus Lapangan' }
    ];

    let contentHtml = '';

    if (showFinalSummary && isAllCompleted) {
      // Tampilan Ringkasan Akhir
      let evaluationBadge = 'Pakar Rambu K3 & Cermat 🌟';
      if (totalMistakes > 0 && totalMistakes <= 3) {
        evaluationBadge = 'Bagus & Sangat Memahami 👍';
      } else if (totalMistakes > 3) {
        evaluationBadge = 'Cukup & Perlu Disiplin Rambu ⚠️';
      }

      contentHtml = `
        <div class="rambu-final-summary">
          <div style="text-align: center; margin-bottom: 12px;">
            <i class="bi bi-patch-check-fill" style="font-size: 2rem; color: #10b981;"></i>
            <h4 style="margin: 8px 0 4px 0; color: #10b981; font-size: 1.1rem; font-weight: 700;">
              Luar Biasa! Semua Level Rambu K3 Kelistrikan Berhasil Dikuasai!
            </h4>
            <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">
              Anda telah menguasai aturan bentuk, warna, dan pemilihan rambu pada instalasi penerangan listrik.
            </p>
          </div>

          <div style="display: flex; justify-content: space-around; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; margin-bottom: 14px; text-align: center;">
            <div>
              <strong style="display: block; font-size: 1.05rem; color: #0284c7;">${evaluationBadge}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Predikat K3</span>
            </div>
            <div>
              <strong style="display: block; font-size: 1.05rem; color: #ef4444;">${totalMistakes}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Total Kesalahan</span>
            </div>
            <div>
              <strong style="display: block; font-size: 1.05rem; color: #10b981;">100%</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Pemahaman Rambu</span>
            </div>
          </div>

          <!-- Tabel Rangkuman Cepat Bentuk & Warna -->
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            <i class="bi bi-table" style="color: #0284c7; margin-right: 6px;"></i>Aturan Cepat: Membaca Rambu K3 (ISO 7010 &amp; SNI)
          </div>
          <div class="rambu-summary-table-wrap">
            <table class="rambu-summary-table">
              <thead>
                <tr>
                  <th>Kategori Rambu</th>
                  <th>Bentuk Geometris</th>
                  <th>Warna Keselamatan</th>
                  <th>Makna / Tindakan</th>
                  <th>Contoh Kelistrikan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="color: #f59e0b; font-weight: 700;">Peringatan (Warning)</td>
                  <td>Segitiga Sama Sisi</td>
                  <td>Kuning (Tepi Hitam)</td>
                  <td>Waspada adanya potensi bahaya</td>
                  <td>Awas Tegangan Listrik (Kilat)</td>
                </tr>
                <tr>
                  <td style="color: #ef4444; font-weight: 700;">Larangan (Prohibition)</td>
                  <td>Lingkaran</td>
                  <td>Merah &amp; Garis Diagonal</td>
                  <td>Dilarang melakukan tindakan</td>
                  <td>Dilarang Menyalakan Sakelar</td>
                </tr>
                <tr>
                  <td style="color: #3b82f6; font-weight: 700;">Kewajiban (Mandatory)</td>
                  <td>Lingkaran</td>
                  <td>Biru Pekat</td>
                  <td>Wajib memakai APD / perintah</td>
                  <td>Wajib Pakai Sarung Tangan Isolasi</td>
                </tr>
                <tr>
                  <td style="color: #10b981; font-weight: 700;">Kondisi Aman (Safe)</td>
                  <td>Persegi / Persegi Panjang</td>
                  <td>Hijau</td>
                  <td>Petunjuk keselamatan / P3K</td>
                  <td>Jalur Evakuasi Keluar &amp; Kotak P3K</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
            <button id="rambu-btn-view-tabs" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.82rem; padding: 8px 14px; min-height: 44px;">
              <i class="bi bi-arrow-left"></i> Tinjau Per Bagian
            </button>
            <button id="rambu-btn-restart-all" class="btn-mcb-demo btn-mcb-demo-primary" style="font-size: 0.82rem; padding: 8px 16px; min-height: 44px; background: #0284c7;">
              <i class="bi bi-arrow-counterclockwise"></i> Ulangi Seluruh Modul
            </button>
          </div>
        </div>
      `;
    } else {
      const activeDef = tabDefinitions[currentTab];
      const isCurrentCompleted = completedTabs[currentTab];

      let tabBodyHtml = '';

      if (currentTab === 0) {
        // ==================== TAB 0: PEMANASAN MATCHING ====================
        const matchedCount = Object.keys(warmUpMatches).length;
        const allMatched = matchedCount === warmUpSigns.length;

        tabBodyHtml = `
          <!-- Sticky Bar mobile -->
          <div class="rambu-sticky-bar" id="rambu-sticky-bar" style="display: ${allMatched ? 'none' : 'flex'};">
            <div class="rambu-sticky-info" id="rambu-sticky-info">
              ${warmUpSelectedId ? `
                <div class="rambu-sticky-svg"><svg viewBox="0 0 50 50">${warmUpSigns.find(s => s.id === warmUpSelectedId).symbolSvg}</svg></div>
                <span class="rambu-sticky-text">${warmUpSigns.find(s => s.id === warmUpSelectedId).shortShape}</span>
              ` : `
                <span class="rambu-sticky-text">Langkah 1: Pilih simbol rambu di atas</span>
              `}
            </div>
            <div class="rambu-sticky-hint">
              ${warmUpSelectedId ? '<i class="bi bi-arrow-down-short"></i> Pilih artinya di bawah' : '<i class="bi bi-hand-index-thumb"></i> Pilih Simbol'}
            </div>
          </div>

          <div class="rambu-columns" id="rambu-columns">
            <!-- Kolom Simbol Rambu -->
            <div class="rambu-col-symbols">
              <div class="rambu-col-header">1. Simbol Rambu K3:</div>
              <div class="rambu-symbols-list">
                ${warmUpSigns.map(sign => {
                  const isMatched = !!warmUpMatches[sign.id];
                  const isSelected = warmUpSelectedId === sign.id;
                  return `
                    <button type="button" class="rambu-symbol-card ${isSelected ? 'is-selected' : ''} ${isMatched ? 'is-matched' : ''}"
                            data-sign-id="${sign.id}"
                            ${isMatched ? 'disabled' : ''}
                            aria-pressed="${isSelected ? 'true' : 'false'}"
                            aria-label="Simbol ${sign.shape}">
                      <div class="rambu-symbol-svg">
                        <svg viewBox="0 0 50 50" aria-hidden="true">${sign.symbolSvg}</svg>
                      </div>
                      <div class="rambu-symbol-info">
                        <span class="rambu-symbol-label rambu-shape-desktop">${sign.shape}</span>
                        <span class="rambu-symbol-label rambu-shape-mobile">${sign.shortShape}</span>
                        ${isMatched ? `
                          <div class="rambu-symbol-status">
                            <i class="bi bi-check-circle-fill"></i> Cocok
                          </div>
                        ` : ''}
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Kolom Deskripsi Arti -->
            <div class="rambu-col-descs">
              <div class="rambu-col-header">2. Deskripsi &amp; Makna:</div>
              <div class="rambu-descs-list ${!warmUpSelectedId && !allMatched ? 'is-waiting' : ''}">
                ${warmUpShuffledDescs.map(desc => {
                  const isMatched = !!warmUpMatches[desc.id];
                  return `
                    <button type="button" class="rambu-desc-card ${isMatched ? 'is-matched' : ''}"
                            data-desc-id="${desc.id}"
                            ${isMatched ? 'disabled' : ''}
                            aria-label="Deskripsi: ${desc.text}">
                      <i class="bi bi-check-circle-fill rambu-desc-icon" aria-hidden="true"></i>
                      <span>${desc.text}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      } else if (currentTab === 1) {
        // ==================== TAB 1: LEVEL 1 KENALI KATEGORI ====================
        const isDoneLevel1 = level1Index >= level1Pool.length;

        if (!isDoneLevel1) {
          const activeCard = level1Pool[level1Index];
          tabBodyHtml = `
            <div class="rambu-quiz-deck">
              <div class="rambu-quiz-progress">
                Soal ${level1Index + 1} dari ${level1Pool.length}
              </div>

              <div class="rambu-quiz-svg-wrap">
                <svg viewBox="0 0 50 50" aria-label="Rambu ${activeCard.name}">${activeCard.svg}</svg>
              </div>

              <div class="rambu-quiz-name">${activeCard.name}</div>
              <div class="rambu-quiz-question">Termasuk dalam kategori rambu keselamatan apa simbol di atas?</div>

              <div class="rambu-cat-options">
                <button type="button" class="rambu-cat-btn is-warning" data-cat="peringatan" ${level1Feedback ? 'disabled' : ''} aria-label="Kategori Peringatan (Kuning Segitiga)">
                  <i class="bi bi-exclamation-triangle-fill" style="color: #f59e0b;"></i>
                  <span><strong>Peringatan</strong><br/><small style="color: var(--text-secondary);">Kuning &bull; Segitiga</small></span>
                </button>
                <button type="button" class="rambu-cat-btn is-prohibition" data-cat="larangan" ${level1Feedback ? 'disabled' : ''} aria-label="Kategori Larangan (Merah Lingkaran Diagonal)">
                  <i class="bi bi-slash-circle-fill" style="color: #ef4444;"></i>
                  <span><strong>Larangan</strong><br/><small style="color: var(--text-secondary);">Merah &bull; Lingkaran Diagonal</small></span>
                </button>
                <button type="button" class="rambu-cat-btn is-mandatory" data-cat="wajib" ${level1Feedback ? 'disabled' : ''} aria-label="Kategori Kewajiban (Biru Lingkaran)">
                  <i class="bi bi-check-circle-fill" style="color: #3b82f6;"></i>
                  <span><strong>Kewajiban</strong><br/><small style="color: var(--text-secondary);">Biru &bull; Lingkaran</small></span>
                </button>
                <button type="button" class="rambu-cat-btn is-safe" data-cat="aman" ${level1Feedback ? 'disabled' : ''} aria-label="Kategori Kondisi Aman (Hijau Persegi)">
                  <i class="bi bi-shield-fill-check" style="color: #10b981;"></i>
                  <span><strong>Kondisi Aman</strong><br/><small style="color: var(--text-secondary);">Hijau &bull; Persegi</small></span>
                </button>
              </div>

              ${level1Feedback ? `
                <div class="rambu-feedback-box ${level1Feedback.isCorrect ? 'is-success' : 'is-error'}" role="status" aria-live="polite" style="margin-top: 12px;">
                  <i class="bi ${level1Feedback.isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
                  <div>
                    <strong>${level1Feedback.isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat:'}</strong>
                    <p style="margin: 3px 0 0 0; font-size: 0.82rem;">${level1Feedback.message}</p>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                  <button type="button" id="rambu-btn-next-lvl1" class="btn-mcb-demo btn-mcb-demo-primary" style="font-size: 0.82rem; padding: 6px 14px; min-height: 44px; background: #0284c7;">
                    ${level1Index < level1Pool.length - 1 ? 'Soal Berikutnya <i class="bi bi-arrow-right"></i>' : 'Selesaikan Level 1 <i class="bi bi-check-lg"></i>'}
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }
      } else {
        // ==================== TAB 2: LEVEL 2 SKENARIO KASUS ====================
        const isDoneLevel2 = level2Index >= level2Pool.length;

        if (!isDoneLevel2) {
          const activeScen = level2Pool[level2Index];
          tabBodyHtml = `
            <div class="rambu-scenario-box">
              <span class="rambu-scenario-badge">${activeScen.context} (Soal ${level2Index + 1}/${level2Pool.length})</span>
              <div class="rambu-scenario-question">${activeScen.question}</div>

              <div class="rambu-scenario-options">
                ${activeScen.options.map((opt, oIdx) => {
                  let optStateClass = '';
                  if (level2Feedback) {
                    if (opt.id === level2Feedback.optId) {
                      optStateClass = opt.isCorrect ? 'is-correct' : 'is-wrong';
                    } else if (opt.isCorrect) {
                      optStateClass = 'is-correct';
                    }
                  }
                  return `
                    <button type="button" class="rambu-scenario-opt-btn ${optStateClass}" data-opt-id="${opt.id}" ${level2Feedback ? 'disabled' : ''} aria-label="Pilihan ${String.fromCharCode(65 + oIdx)}: ${opt.text}">
                      <div class="rambu-scenario-opt-thumb">
                        <svg viewBox="0 0 50 50" aria-hidden="true">${opt.svg}</svg>
                      </div>
                      <div style="flex: 1;">
                        <span style="font-weight: 600;">${String.fromCharCode(65 + oIdx)}. ${opt.text}</span>
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>

              ${level2Feedback ? `
                <div class="rambu-feedback-box ${level2Feedback.isCorrect ? 'is-success' : 'is-error'}" role="status" aria-live="polite">
                  <i class="bi ${level2Feedback.isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
                  <div>
                    <strong>${level2Feedback.isCorrect ? 'Pilihan Tepat!' : 'Pilihan Keliru:'}</strong>
                    <p style="margin: 3px 0 0 0; font-size: 0.82rem;">${level2Feedback.reason}</p>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                  <button type="button" id="rambu-btn-next-lvl2" class="btn-mcb-demo btn-mcb-demo-primary" style="font-size: 0.82rem; padding: 6px 14px; min-height: 44px; background: #0284c7;">
                    ${level2Index < level2Pool.length - 1 ? 'Skenario Berikutnya <i class="bi bi-arrow-right"></i>' : 'Lihat Evaluasi Akhir <i class="bi bi-patch-check"></i>'}
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }
      }

      // Banner Tahap Selesai
      const completeBannerHtml = isCurrentCompleted ? `
        <div class="rambu-success-card" style="display: block; margin-top: 12px;">
          <p class="rambu-success-text" style="margin-bottom: 8px;">
            <i class="bi bi-check-circle-fill" style="margin-right: 6px;"></i>${activeDef.title} Berhasil Diselesaikan!
          </p>
          ${currentTab < 2 ? `
            <button type="button" id="rambu-btn-next-tab" class="btn-mcb-demo btn-mcb-demo-primary" style="font-size: 0.82rem; padding: 8px 16px; min-height: 44px; background: #10b981;">
              Lanjut ke ${tabDefinitions[currentTab + 1].title} <i class="bi bi-arrow-right"></i>
            </button>
          ` : `
            <button type="button" id="rambu-btn-view-summary" class="btn-mcb-demo btn-mcb-demo-primary" style="font-size: 0.82rem; padding: 8px 16px; min-height: 44px; background: #10b981;">
              <i class="bi bi-patch-check-fill"></i> Buka Ringkasan Akhir Rambu K3
            </button>
          `}
        </div>
      ` : '';

      contentHtml = `
        <div class="rambu-progress-wrap">
          <span class="rambu-progress-text">${activeDef.badge}</span>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">
            Kesalahan: <strong>${tabMistakes[currentTab]}</strong>
          </span>
        </div>

        <div class="rambu-tabs-nav" role="tablist" aria-label="Level Pembelajaran Rambu K3">
          ${tabDefinitions.map((t, idx) => {
            const isCompleted = completedTabs[idx];
            const isActive = idx === currentTab;
            return `
              <button type="button" class="rambu-tab-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}"
                      role="tab"
                      aria-selected="${isActive ? 'true' : 'false'}"
                      aria-label="${t.title} ${isCompleted ? '(Selesai)' : ''}"
                      data-tab="${idx}">
                ${isCompleted ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>' : ''}
                <span>${t.title}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${tabBodyHtml}
        ${completeBannerHtml}

        <div style="display: flex; justify-content: center; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
          <button type="button" id="rambu-btn-reset-tab" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.82rem; padding: 8px 14px; min-height: 44px;">
            <i class="bi bi-arrow-counterclockwise"></i> Ulangi Bagian Ini
          </button>
          ${isAllCompleted ? `
            <button type="button" id="rambu-btn-open-summary" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.82rem; padding: 8px 14px; min-height: 44px;">
              <i class="bi bi-journal-check"></i> Ringkasan Lengkap Rambu
            </button>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="rambu-widget">
        <div class="rambu-header">
          <h4 class="rambu-title">
            <i class="bi bi-cone-striped" aria-hidden="true"></i>Simulasi Standar Rambu K3 Kelistrikan (ISO 7010 &amp; SNI)
          </h4>
          <p class="rambu-subtitle">
            Pelajari aturan bentuk geometris, warna keselamatan, serta pemilihan rambu yang tepat pada instalasi listrik.
          </p>
        </div>

        ${contentHtml}

        <!-- Screen reader live announcer -->
        <div class="sr-only" aria-live="polite" id="rambu-live-announcer"></div>
      </div>
    `;

    attachEventListeners();

    if (pendingFocusSelector) {
      const el = container.querySelector(pendingFocusSelector);
      if (el) el.focus();
      pendingFocusSelector = null;
    }
  }

  function announce(msg) {
    const el = container.querySelector('#rambu-live-announcer');
    if (el) el.textContent = msg;
  }

  function attachEventListeners() {
    // 1. Tab Navigasi
    container.querySelectorAll('.rambu-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playUIClick();
        const tabIdx = parseInt(btn.getAttribute('data-tab'), 10);
        if (!isNaN(tabIdx) && tabIdx !== currentTab) {
          currentTab = tabIdx;
          showFinalSummary = false;
          render();
        }
      });
    });

    // 2. Event Handlers Tab 0 (Pemanasan Matching)
    if (currentTab === 0) {
      container.querySelectorAll('.rambu-symbol-card').forEach(sBtn => {
        sBtn.addEventListener('click', () => {
          const signId = sBtn.getAttribute('data-sign-id');
          if (!signId || warmUpMatches[signId]) return;

          playUIClick();
          if (warmUpSelectedId === signId) {
            warmUpSelectedId = null;
            announce('Pilihan simbol dibatalkan.');
          } else {
            warmUpSelectedId = signId;
            const sign = warmUpSigns.find(s => s.id === signId);
            announce(`Simbol ${sign ? sign.shortShape : ''} dipilih. Sekarang pilih artinya.`);
          }
          render();
        });
      });

      container.querySelectorAll('.rambu-desc-card').forEach(dBtn => {
        dBtn.addEventListener('click', () => {
          const descId = dBtn.getAttribute('data-desc-id');
          if (!descId || warmUpMatches[descId]) return;

          if (!warmUpSelectedId) {
            try { playError(); } catch (e) {}
            announce('Pilih salah satu simbol rambu terlebih dahulu.');
            return;
          }

          if (warmUpSelectedId === descId) {
            // Cocok!
            playUIClick();
            warmUpMatches[warmUpSelectedId] = true;
            warmUpSelectedId = null;

            if (Object.keys(warmUpMatches).length === warmUpSigns.length) {
              completedTabs[0] = true;
              try { playSuccess(); } catch (e) {}
              announce('Sempurna! Semua 3 rambu dasar berhasil dicocokkan.');
              pendingFocusSelector = '#rambu-btn-next-tab';
            } else {
              announce('Tepat! Simbol berhasil dicocokkan.');
            }
            render();
          } else {
            // Salah!
            try { playError(); } catch (e) {}
            tabMistakes[0]++;
            announce('Jawaban belum tepat, silakan coba baca deskripsi lainnya.');
            dBtn.classList.add('rambu-shake');
            setTimeout(() => {
              dBtn.classList.remove('rambu-shake');
            }, 400);
          }
        });
      });
    }

    // 3. Event Handlers Tab 1 (Level 1: Kenali Kategori)
    if (currentTab === 1) {
      container.querySelectorAll('.rambu-cat-btn').forEach(cBtn => {
        cBtn.addEventListener('click', () => {
          const chosenCat = cBtn.getAttribute('data-cat');
          const activeCard = level1Pool[level1Index];
          if (!activeCard || level1Feedback) return;

          if (chosenCat === activeCard.category) {
            playSuccess();
            level1Feedback = {
              isCorrect: true,
              message: activeCard.explanation
            };
            announce(`Benar! ${activeCard.explanation}`);
          } else {
            playError();
            tabMistakes[1]++;
            level1Feedback = {
              isCorrect: false,
              message: `Simbol "${activeCard.name}" bukan kategori tersebut. ${activeCard.explanation}`
            };
            announce(`Kurang tepat. ${activeCard.explanation}`);
          }
          render();
        });
      });

      const nextLvl1Btn = container.querySelector('#rambu-btn-next-lvl1');
      if (nextLvl1Btn) {
        nextLvl1Btn.addEventListener('click', () => {
          playUIClick();
          level1Feedback = null;
          level1Index++;
          if (level1Index >= level1Pool.length) {
            completedTabs[1] = true;
            try { playSuccess(); } catch (e) {}
            pendingFocusSelector = '#rambu-btn-next-tab';
          }
          render();
        });
      }
    }

    // 4. Event Handlers Tab 2 (Level 2: Skenario Kasus)
    if (currentTab === 2) {
      container.querySelectorAll('.rambu-scenario-opt-btn').forEach(oBtn => {
        oBtn.addEventListener('click', () => {
          const optId = oBtn.getAttribute('data-opt-id');
          const activeScen = level2Pool[level2Index];
          if (!activeScen || level2Feedback) return;

          const chosenOpt = activeScen.options.find(o => o.id === optId);
          if (chosenOpt) {
            if (chosenOpt.isCorrect) {
              playSuccess();
            } else {
              playError();
              tabMistakes[2]++;
            }
            level2Feedback = {
              optId,
              isCorrect: chosenOpt.isCorrect,
              reason: chosenOpt.reason
            };
            announce(chosenOpt.reason);
            render();
          }
        });
      });

      const nextLvl2Btn = container.querySelector('#rambu-btn-next-lvl2');
      if (nextLvl2Btn) {
        nextLvl2Btn.addEventListener('click', () => {
          playUIClick();
          level2Feedback = null;
          level2Index++;
          if (level2Index >= level2Pool.length) {
            completedTabs[2] = true;
            try { playSuccess(); } catch (e) {}
            pendingFocusSelector = '#rambu-btn-view-summary';
          }
          render();
        });
      }
    }

    // 5. Tombol Lanjut Tab Berikutnya
    const btnNextTab = container.querySelector('#rambu-btn-next-tab');
    if (btnNextTab) {
      btnNextTab.addEventListener('click', () => {
        playUIClick();
        if (currentTab < 2) {
          currentTab++;
          render();
        }
      });
    }

    // 6. Tombol Buka Ringkasan Akhir
    const btnViewSummary = container.querySelector('#rambu-btn-view-summary') || container.querySelector('#rambu-btn-open-summary');
    if (btnViewSummary) {
      btnViewSummary.addEventListener('click', () => {
        playUIClick();
        showFinalSummary = true;
        render();
      });
    }

    // 7. Tombol Tinjau Per Bagian dari Ringkasan
    const btnViewTabs = container.querySelector('#rambu-btn-view-tabs');
    if (btnViewTabs) {
      btnViewTabs.addEventListener('click', () => {
        playUIClick();
        showFinalSummary = false;
        currentTab = 0;
        render();
      });
    }

    // 8. Tombol Reset Bagian Ini
    const btnResetTab = container.querySelector('#rambu-btn-reset-tab');
    if (btnResetTab) {
      btnResetTab.addEventListener('click', () => {
        playUIClick();
        resetCurrentTab();
        render();
      });
    }

    // 9. Tombol Restart Semua
    const btnRestartAll = container.querySelector('#rambu-btn-restart-all');
    if (btnRestartAll) {
      btnRestartAll.addEventListener('click', () => {
        playUIClick();
        resetAllTabs();
        render();
      });
    }
  }

  render();
}
