import { updateState, state, navigate, applyBgmSettings, store } from '../main.js';
import { playUIClick } from '../utils/audioFeedback.js';
import { showConfirmDialog, showAlertDialog } from '../utils/appDialog.js';

export function renderSettingsView() {
  const container = document.getElementById('app');

  container.innerHTML = `
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-back-home" title="Kembali ke Beranda" aria-label="Kembali ke Beranda">
          <i class="bi bi-arrow-left"></i><span class="btn-back-text"> Kembali</span>
        </button>
        <span class="nav-title">Pengaturan & Tutorial</span>
      </div>
      <div class="nav-actions">
        <span class="nav-meta">Konfigurasi Lab</span>
      </div>
    </nav>

    <div class="settings-container">
      <!-- Section 1: Panduan / Tutorial -->
      <section class="settings-card">
        <h3><i class="bi bi-book"></i> Tutorial Penggunaan Lab Perakitan</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-sm); border-left: 4px solid var(--accent-color);">
            <h4 style="font-weight: 600; margin-bottom: 6px;">1. Menempatkan Komponen</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
              <strong>Desktop:</strong> Seret (drag) komponen dari palet sebelah kiri lalu jatuhkan (drop) di area kanvas kerja.<br>
              <strong>HP/Tablet:</strong> Ketuk (tap) komponen di palet kiri, lalu ketuk di area kanvas kerja untuk menaruhnya secara presisi.
            </p>
          </div>

          <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-sm); border-left: 4px solid var(--accent-color);">
            <h4 style="font-weight: 600; margin-bottom: 6px;">2. Menghubungkan Kabel (Fleksibel)</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
              Ketuk titik pin komponen (misal warna hitam/fasa, biru/netral), tarik garis kabel, lalu ketuk pin tujuan untuk menyambung.<br>
              <strong>Membuat Belokan:</strong> Ketuk di area kanvas kosong saat sedang menarik kabel untuk menambah titik belok (waypoint).<br>
              <strong>Percabangan:</strong> Ketuk ujung kabel baru ke bagian tengah kabel lain yang sudah ada. Titik sambungan bulat (junction dot) akan otomatis terbentuk.
            </p>
          </div>

          <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-sm); border-left: 4px solid var(--accent-color);">
            <h4 style="font-weight: 600; margin-bottom: 6px;">3. Memilih & Menghapus Item</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
              Ketuk komponen atau kabel di kanvas untuk **memilih** (ditandai garis highlight). Menu kecil akan melayang di atasnya. Klik tombol **Hapus** (ikon tempat sampah) di menu melayang tersebut untuk menghapusnya.
            </p>
          </div>

          <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-sm); border-left: 4px solid var(--accent-color);">
            <h4 style="font-weight: 600; margin-bottom: 6px;">4. Simulasi & Deteksi Hubung Singkat</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
              Ketuk tombol <strong>Simulasikan</strong> di atas kanvas. Anda dapat mengetuk sakelar sirkuit untuk menyalakan/mematikan lampu secara interaktif. Jika terjadi hubung singkat (fasa bertemu langsung netral tanpa beban), MCB akan langsung TRIP otomatis ke posisi OFF dan mengeluarkan peringatan edukatif.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 2: Pengaturan Aplikasi -->
      <section class="settings-card">
        <h3><i class="bi bi-gear-fill"></i> Pengaturan Dasar</h3>

        <!-- Tema visual -->
        <div class="setting-row">
          <div class="setting-info">
            <h4>Tema Aplikasi</h4>
            <p>Pilih tampilan tema gelap atau terang.</p>
          </div>
          <div class="setting-control">
            <select id="select-theme">
              <option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Gelap (Rekomendasi)</option>
              <option value="light" ${state.theme === 'light' ? 'selected' : ''}>Terang</option>
            </select>
          </div>
        </div>

        <!-- Ukuran Teks -->
        <div class="setting-row">
          <div class="setting-info">
            <h4>Ukuran Teks Deskripsi</h4>
            <p>Sesuaikan kenyamanan pembacaan materi.</p>
          </div>
          <div class="setting-control">
            <select id="select-font-size">
              <option value="small" ${state.fontSize === 'small' ? 'selected' : ''}>Kecil</option>
              <option value="medium" ${state.fontSize === 'medium' ? 'selected' : ''}>Sedang</option>
              <option value="large" ${state.fontSize === 'large' ? 'selected' : ''}>Besar</option>
            </select>
          </div>
        </div>

        <!-- Volume Suara SFX -->
        <div class="setting-row">
          <div class="setting-info">
            <h4>Volume Efek Suara (SFX)</h4>
            <p>Besar kecilnya suara klik saklar, kabel, dan alarm peringatan sirkuit.</p>
          </div>
          <div class="setting-control" style="display: flex; align-items: center; gap: 10px;">
            <input type="range" id="input-volume" min="0" max="100" value="${state.volume}" style="width: 120px;">
            <span id="volume-label" style="font-size: 0.9rem; font-weight: 600; width: 36px; text-align: right;">${state.volume}%</span>
          </div>
        </div>

        <!-- Toggle Musik Latar (BGM) -->
        <div class="setting-row">
          <div class="setting-info">
            <h4>Musik Latar (BGM)</h4>
            <p>Aktifkan atau matikan musik instrumen latar belakang aplikasi.</p>
          </div>
          <div class="setting-control">
            <button id="btn-toggle-bgm" class="btn-context" style="padding: 6px 14px; font-weight: 600; border: 1px solid var(--border-color); background: ${state.bgmEnabled ? 'var(--accent-color)' : 'var(--bg-tertiary)'}; color: ${state.bgmEnabled ? '#fff' : 'var(--text-secondary)'};">
              <i class="bi ${state.bgmEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}"></i> ${state.bgmEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>
        </div>

        <!-- Slider Volume BGM -->
        <div class="setting-row">
          <div class="setting-info">
            <h4>Volume Musik Latar</h4>
            <p>Atur tingkat kekerasan musik latar belakang.</p>
          </div>
          <div class="setting-control" style="display: flex; align-items: center; gap: 10px;">
            <input type="range" id="input-bgm-volume" min="0" max="100" value="${state.bgmVolume}" style="width: 120px;" ${!state.bgmEnabled ? 'disabled' : ''}>
            <span id="bgm-volume-label" style="font-size: 0.9rem; font-weight: 600; width: 36px; text-align: right; opacity: ${state.bgmEnabled ? '1' : '0.5'};">${state.bgmVolume}%</span>
          </div>
        </div>

        <!-- Reset Progress -->
        <div class="setting-row">
          <div class="setting-info">
            <h4>Reset Progres Praktik</h4>
            <p>Hapus semua status penyelesaian Jobsheet (kembali ke awal).</p>
          </div>
          <div class="setting-control">
            <button class="btn-context delete" id="btn-reset-progress" style="border: 1px solid var(--color-error); padding: 8px 16px;">
              Reset Progres
            </button>
          </div>
        </div>
      </section>
    </div>
  `;

  // Attach event listeners
  document.getElementById('btn-back-home').addEventListener('click', () => {
    playUIClick();
    navigate('home');
  });

  // Theme change
  const selectTheme = document.getElementById('select-theme');
  selectTheme.addEventListener('change', (e) => {
    playUIClick();
    const val = e.target.value;
    updateState({ theme: val });
    
    // Apply theme
    if (val === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    }
    store.set('theme', val);
  });

  // Font size change
  const selectFontSize = document.getElementById('select-font-size');
  selectFontSize.addEventListener('change', (e) => {
    playUIClick();
    const val = e.target.value;
    updateState({ fontSize: val });
    store.set('fontSize', val);
  });

  // Volume change
  const inputVolume = document.getElementById('input-volume');
  const volumeLabel = document.getElementById('volume-label');
  inputVolume.addEventListener('input', (e) => {
    const val = e.target.value;
    volumeLabel.textContent = `${val}%`;
  });

  inputVolume.addEventListener('change', (e) => {
    const val = e.target.value;
    updateState({ volume: val });
    store.set('volume', val);

    // Play a brief preview sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // 600 Hz beep
      gainNode.gain.setValueAtTime((val / 100) * 0.1, audioCtx.currentTime); // scale volume safely

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1); // play for 100ms
    } catch (err) {
      console.warn("AudioContext failed or is not supported: ", err);
    }
  });

  // Toggle BGM
  const btnToggleBgm = document.getElementById('btn-toggle-bgm');
  const inputBgmVolume = document.getElementById('input-bgm-volume');
  const bgmVolumeLabel = document.getElementById('bgm-volume-label');
  if (btnToggleBgm) {
    btnToggleBgm.addEventListener('click', () => {
      playUIClick();
      state.bgmEnabled = !state.bgmEnabled;
      store.set('bgmEnabled', state.bgmEnabled.toString());
      applyBgmSettings();

      // Update UI elements
      btnToggleBgm.style.background = state.bgmEnabled ? 'var(--accent-color)' : 'var(--bg-tertiary)';
      btnToggleBgm.style.color = state.bgmEnabled ? '#fff' : 'var(--text-secondary)';
      btnToggleBgm.innerHTML = `<i class="bi ${state.bgmEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}"></i> ${state.bgmEnabled ? 'Aktif' : 'Mati'}`;
      if (inputBgmVolume) inputBgmVolume.disabled = !state.bgmEnabled;
      if (bgmVolumeLabel) bgmVolumeLabel.style.opacity = state.bgmEnabled ? '1' : '0.5';
    });
  }

  // Volume BGM change (slider - no repeated click sound)
  if (inputBgmVolume) {
    inputBgmVolume.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.bgmVolume = val;
      if (bgmVolumeLabel) bgmVolumeLabel.textContent = `${val}%`;
      applyBgmSettings();
    });

    inputBgmVolume.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      state.bgmVolume = val;
      store.set('bgmVolume', val.toString());
      applyBgmSettings();
    });
  }

  // Reset progress
  const btnReset = document.getElementById('btn-reset-progress');
  btnReset.addEventListener('click', async () => {
    playUIClick();
    const ok = await showConfirmDialog({
      title: 'Reset Seluruh Progres?',
      message: 'Seluruh progres Jobsheet akan dihapus. Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Ya, Reset Progres',
      cancelText: 'Batal',
      variant: 'warning'
    });
    if (ok) {
      updateState({ jobsheetProgress: {} });
      store.set('jobsheetProgress', JSON.stringify({}));
      await showAlertDialog({
        variant: 'success',
        title: 'Progres Direset',
        message: 'Progres penyelesaian latihan berhasil diriset.'
      });
    }
  });
}
