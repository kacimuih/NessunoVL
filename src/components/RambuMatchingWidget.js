// Interactive Safety Signs (Rambu K3) Matching Widget - Virtual Lab IPL
import { playUIClick, playError, playSuccess } from '../utils/audioFeedback.js';

export function renderRambuMatchingWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const signs = [
    {
      id: 'peringatan',
      type: 'warning',
      shape: 'Segitiga Kuning',
      shortShape: 'Segitiga Kuning',
      symbolSvg: `
        <polygon points="25,5 45,40 5,40" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
        <path d="M 25 15 L 25 28 M 25 32 L 25 34" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
      `,
      meaning: 'Rambu Peringatan (Kuning, Segitiga): Memperingatkan adanya potensi bahaya (contoh: Bahaya Sengatan Listrik).'
    },
    {
      id: 'larangan',
      type: 'prohibition',
      shape: 'Lingkaran Merah dengan Garis Diagonal',
      shortShape: 'Lingkaran Merah Bergaris',
      symbolSvg: `
        <circle cx="25" cy="25" r="18" fill="#ffffff" stroke="#ef4444" stroke-width="4"/>
        <line x1="12" y1="12" x2="38" y2="38" stroke="#ef4444" stroke-width="4"/>
        <circle cx="25" cy="25" r="8" fill="none" stroke="#64748b" stroke-width="2"/>
      `,
      meaning: 'Rambu Larangan (Merah, Lingkaran Bergaris Silang): Melarang suatu perbuatan (contoh: Dilarang Menyalakan Sakelar).'
    },
    {
      id: 'wajib',
      type: 'mandatory',
      shape: 'Lingkaran Biru',
      shortShape: 'Lingkaran Biru',
      symbolSvg: `
        <circle cx="25" cy="25" r="19" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
        <path d="M 18 25 L 23 30 L 32 18" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      `,
      meaning: 'Rambu Wajib / Perintah (Biru, Lingkaran): Mengharuskan pemakaian APD atau tindakan wajib (contoh: Wajib Pakai Sarung Tangan).'
    }
  ];

  let selectedSignId = null;
  let matches = {}; // { 'peringatan': true, ... }
  let isShaking = false;

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Acak deskripsi arti di sebelah kanan
  let shuffledDescriptions = shuffle(signs.map(s => ({ id: s.id, text: s.meaning })));

  // Render scaffold DOM sekali saja
  container.innerHTML = `
    <div class="rambu-widget">
      <div class="rambu-header">
        <h4 class="rambu-title">
          <i class="bi bi-patch-check"></i>Cocokkan Bentuk Rambu K3 dengan Artinya
        </h4>
        <p class="rambu-subtitle">
          Klik simbol rambu di atas/kiri, lalu pilih deskripsi artinya yang sesuai di bawah/kanan:
        </p>
      </div>

      <div class="rambu-progress-wrap">
        <span class="rambu-progress-text" id="rambu-progress-label">Cocok: 0/${signs.length}</span>
        <div class="rambu-progress-bar-bg">
          <div class="rambu-progress-bar-fill" id="rambu-progress-fill"></div>
        </div>
      </div>

      <!-- Sticky Bar penunjuk simbol terpilih pada mobile -->
      <div class="rambu-sticky-bar" id="rambu-sticky-bar">
        <div class="rambu-sticky-info" id="rambu-sticky-info">
          <span class="rambu-sticky-text">Langkah 1: Pilih salah satu simbol rambu di atas</span>
        </div>
        <div class="rambu-sticky-hint" id="rambu-sticky-hint">
          <i class="bi bi-hand-index-thumb"></i> Pilih Simbol
        </div>
      </div>

      <div class="rambu-columns" id="rambu-columns">
        <!-- Kolom Simbol Rambu -->
        <div class="rambu-col-symbols">
          <div class="rambu-col-header">1. Simbol Rambu:</div>
          <div class="rambu-symbols-list" id="rambu-symbols-list">
            ${signs.map(sign => `
              <button type="button" class="rambu-symbol-card" data-sign-id="${sign.id}" aria-pressed="false" aria-label="Simbol ${sign.shape}">
                <div class="rambu-symbol-svg">
                  <svg viewBox="0 0 50 50">${sign.symbolSvg}</svg>
                </div>
                <div class="rambu-symbol-info">
                  <span class="rambu-symbol-label rambu-shape-desktop">${sign.shape}</span>
                  <span class="rambu-symbol-label rambu-shape-mobile">${sign.shortShape}</span>
                  <div class="rambu-symbol-status" style="display: none;">
                    <i class="bi bi-check-circle-fill"></i> Cocok
                  </div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Kolom Deskripsi Arti -->
        <div class="rambu-col-descs">
          <div class="rambu-col-header">2. Deskripsi & Arti:</div>
          <div class="rambu-descs-list is-waiting" id="rambu-descs-list"></div>
        </div>
      </div>

      <!-- Kartu Ringkasan Hasil Saat Semua Cocok -->
      <div class="rambu-success-card" id="rambu-success-card" style="display: none;">
        <p class="rambu-success-text">
          🎉 Sempurna! Anda berhasil mengenali ketiga kategori rambu keselamatan listrik PUIL/K3!
        </p>
        <div class="rambu-summary-list">
          ${signs.map(sign => `
            <div class="rambu-summary-item">
              <div class="rambu-summary-svg">
                <svg viewBox="0 0 50 50">${sign.symbolSvg}</svg>
              </div>
              <div>
                <strong>${sign.shape}</strong>: ${sign.meaning}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Screen reader polite announcer -->
      <div class="sr-only" aria-live="polite" id="rambu-live-announcer"></div>

      <div class="rambu-actions">
        <button type="button" id="btn-rambu-reset" class="btn-mcb-demo btn-mcb-demo-secondary btn-rambu-reset">
          <i class="bi bi-arrow-counterclockwise"></i> Acak Ulang & Reset
        </button>
      </div>
    </div>
  `;

  const progressLabel = container.querySelector('#rambu-progress-label');
  const progressFill = container.querySelector('#rambu-progress-fill');
  const stickyBar = container.querySelector('#rambu-sticky-bar');
  const stickyInfo = container.querySelector('#rambu-sticky-info');
  const stickyHint = container.querySelector('#rambu-sticky-hint');
  const descsList = container.querySelector('#rambu-descs-list');
  const successCard = container.querySelector('#rambu-success-card');
  const announcer = container.querySelector('#rambu-live-announcer');
  const resetBtn = container.querySelector('#btn-rambu-reset');
  const symbolButtons = container.querySelectorAll('.rambu-symbol-card');

  function announce(msg) {
    if (announcer) announcer.textContent = msg;
  }

  function updateUI() {
    const matchedCount = Object.keys(matches).length;
    const allMatched = matchedCount === signs.length;

    // 1. Progress
    if (progressLabel) progressLabel.textContent = `Cocok: ${matchedCount}/${signs.length}`;
    if (progressFill) progressFill.style.width = `${(matchedCount / signs.length) * 100}%`;

    // 2. Status tombol simbol
    symbolButtons.forEach(btn => {
      const id = btn.getAttribute('data-sign-id');
      const isMatched = !!matches[id];
      const isSelected = selectedSignId === id;
      const statusEl = btn.querySelector('.rambu-symbol-status');

      btn.classList.toggle('is-matched', isMatched);
      btn.classList.toggle('is-selected', isSelected);
      btn.disabled = isMatched;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (statusEl) statusEl.style.display = isMatched ? 'flex' : 'none';
    });

    // 3. Status tombol deskripsi
    const descButtons = descsList.querySelectorAll('.rambu-desc-card');
    descButtons.forEach(btn => {
      const id = btn.getAttribute('data-desc-id');
      const isMatched = !!matches[id];

      btn.classList.toggle('is-matched', isMatched);
      btn.disabled = isMatched;
    });

    // 4. State waiting pada daftar deskripsi
    descsList.classList.toggle('is-waiting', !selectedSignId && !allMatched);

    // 5. Sticky bar mobile
    if (allMatched) {
      stickyBar.style.display = 'none';
      if (successCard) successCard.style.display = 'block';
    } else {
      stickyBar.style.display = 'flex';
      if (successCard) successCard.style.display = 'none';

      if (selectedSignId) {
        stickyBar.classList.add('is-active');
        const activeSign = signs.find(s => s.id === selectedSignId);
        if (activeSign) {
          stickyInfo.innerHTML = `
            <div class="rambu-sticky-svg"><svg viewBox="0 0 50 50">${activeSign.symbolSvg}</svg></div>
            <span class="rambu-sticky-text">${activeSign.shortShape}</span>
          `;
          stickyHint.innerHTML = `<i class="bi bi-arrow-down-short" style="font-size: 1.2rem;"></i> Pilih artinya di bawah`;
        }
      } else {
        stickyBar.classList.remove('is-active');
        stickyInfo.innerHTML = `<span class="rambu-sticky-text">Langkah 1: Pilih simbol rambu di atas</span>`;
        stickyHint.innerHTML = `<i class="bi bi-hand-index-thumb"></i> Pilih Simbol`;
      }
    }
  }

  function handleSymbolClick(btn) {
    if (isShaking) return;
    const signId = btn.getAttribute('data-sign-id');
    if (!signId || matches[signId]) return;

    playUIClick();
    if (selectedSignId === signId) {
      selectedSignId = null;
      announce('Pilihan simbol dibatalkan.');
    } else {
      selectedSignId = signId;
      const sign = signs.find(s => s.id === signId);
      announce(`Simbol ${sign ? sign.shortShape : ''} dipilih. Sekarang pilih artinya di bawah.`);
    }
    updateUI();
  }

  function handleDescClick(btn) {
    if (isShaking) return;
    const descId = btn.getAttribute('data-desc-id');
    if (!descId || matches[descId]) return;

    if (!selectedSignId) {
      try { playError(); } catch (e) {}
      stickyBar.classList.add('rambu-shake');
      setTimeout(() => stickyBar.classList.remove('rambu-shake'), 400);
      announce('Pilih salah satu simbol rambu di atas terlebih dahulu.');
      return;
    }

    if (selectedSignId === descId) {
      // Cocok!
      playUIClick();
      matches[selectedSignId] = true;
      const matchedSign = signs.find(s => s.id === selectedSignId);
      selectedSignId = null;

      const totalMatched = Object.keys(matches).length;
      if (totalMatched === signs.length) {
        try { playSuccess(); } catch (e) {}
        announce('Sempurna! Semua 3 rambu K3 berhasil dicocokkan!');
      } else {
        announce(`Tepat! Simbol ${matchedSign ? matchedSign.shortShape : ''} berhasil dicocokkan.`);
      }
      updateUI();
    } else {
      // Salah pasang!
      try { playError(); } catch (e) {}
      isShaking = true;
      announce('Jawaban belum tepat, silakan coba baca deskripsi lainnya.');

      btn.classList.add('rambu-shake');
      const selectedSymbolBtn = container.querySelector(`.rambu-symbol-card[data-sign-id="${selectedSignId}"]`);
      if (selectedSymbolBtn) selectedSymbolBtn.classList.add('rambu-shake');

      setTimeout(() => {
        btn.classList.remove('rambu-shake');
        if (selectedSymbolBtn) selectedSymbolBtn.classList.remove('rambu-shake');
        isShaking = false;
      }, 400);
      // Simbol tetap terpilih agar siswa bisa langsung memilih deskripsi lain
    }
  }

  function buildDescriptionButtons() {
    descsList.innerHTML = shuffledDescriptions.map(desc => `
      <button type="button" class="rambu-desc-card" data-desc-id="${desc.id}" aria-label="Deskripsi: ${desc.text}">
        <i class="bi bi-check-circle-fill rambu-desc-icon"></i>
        <span>${desc.text}</span>
      </button>
    `).join('');

    descsList.querySelectorAll('.rambu-desc-card').forEach(btn => {
      btn.addEventListener('click', () => handleDescClick(btn));
    });
  }

  // Event listener tombol simbol
  symbolButtons.forEach(btn => {
    btn.addEventListener('click', () => handleSymbolClick(btn));
  });

  // Event listener tombol reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      playUIClick();
      matches = {};
      selectedSignId = null;
      isShaking = false;
      shuffledDescriptions = shuffle(signs.map(s => ({ id: s.id, text: s.meaning })));
      buildDescriptionButtons();
      updateUI();
      announce('Widget diacak ulang dan direset ke awal.');
    });
  }

  // Inisialisasi awal
  buildDescriptionButtons();
  updateUI();
}
