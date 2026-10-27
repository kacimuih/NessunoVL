import { updateState, state, navigate, applyBgmSettings, store } from '../main.js';
import { playUIClick } from '../utils/audioFeedback.js';
import { showConfirmDialog, showAlertDialog } from '../utils/appDialog.js';
import { resolveAssetUrl } from '../data/realisticAssets.js';
import { getComponentWiringSVG } from '../components/WiringSymbols.js';

export function renderSettingsView() {
  const container = document.getElementById('app');
  const switchSchematicSvg = getComponentWiringSVG('SwitchSingle', { on: false });
  const switchPhotoUrl = resolveAssetUrl('saklar-tunggal-off.png');

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
          <!-- Sub-judul Kelompok A -->
          <div style="padding: 4px 0 2px 2px; border-bottom: 1px solid var(--border-color); margin-bottom: -4px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-color); margin: 0; display: flex; align-items: center; gap: 8px;">
              <i class="bi bi-tools"></i> Kelompok A — Dasar Merakit
            </h4>
          </div>

          <!-- 1. Menempatkan Komponen -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-box-arrow-in-down-right" style="color: var(--accent-color);"></i> 1. Menempatkan Komponen</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi menyeret atau mengetuk komponen dari palet ke kanvas">
                  <defs>
                    <marker id="tut-arrow-1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-color)"/>
                    </marker>
                  </defs>
                  <!-- Palet Kiri -->
                  <rect x="12" y="10" width="70" height="95" rx="6" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1.5"/>
                  <rect x="12" y="10" width="70" height="20" rx="6" fill="var(--bg-tertiary)" stroke="var(--border-color)" stroke-width="1.5"/>
                  <text x="47" y="24" fill="var(--text-muted)" font-size="8.5" font-weight="700" text-anchor="middle">PALET</text>
                  
                  <!-- Item 1 di palet (MCB) -->
                  <rect x="18" y="36" width="58" height="26" rx="4" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1"/>
                  <text x="47" y="52" fill="var(--text-secondary)" font-size="7.5" font-weight="600" text-anchor="middle">MCB 1P</text>
                  
                  <!-- Item 2 di palet (Lampu) - sedang disentuh / diseret -->
                  <rect x="18" y="68" width="58" height="26" rx="4" fill="rgba(245, 158, 11, 0.15)" stroke="var(--accent-color)" stroke-width="1.5"/>
                  <circle cx="32" cy="81" r="7" fill="none" stroke="var(--accent-color)" stroke-width="1.5"/>
                  <text x="56" y="84" fill="var(--accent-color)" font-size="7.5" font-weight="700" text-anchor="middle">LAMPU</text>

                  <!-- Tombol Palet Pojok Kiri Bawah (+ / x) -->
                  <circle cx="22" cy="98" r="8" fill="var(--accent-color)" stroke="var(--bg-primary)" stroke-width="1.5"/>
                  <text x="22" y="102" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">+</text>

                  <!-- Garis Lengkung Panah Drag -->
                  <path d="M 76 81 C 110 81, 120 45, 160 52" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#tut-arrow-1)"/>
                  
                  <!-- Ikon Jari / Kursor Touch -->
                  <circle cx="118" cy="58" r="10" fill="var(--bg-secondary)" stroke="var(--accent-color)" stroke-width="1.5"/>
                  <text x="118" y="62" fill="var(--accent-color)" font-size="11" text-anchor="middle">👆</text>

                  <!-- Area Kanvas Kanan -->
                  <rect x="165" y="10" width="103" height="95" rx="6" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1.5"/>
                  <!-- Grid halus di kanvas -->
                  <line x1="165" y1="35" x2="268" y2="35" stroke="var(--border-color)" stroke-width="0.8" stroke-dasharray="2,2"/>
                  <line x1="165" y1="60" x2="268" y2="60" stroke="var(--border-color)" stroke-width="0.8" stroke-dasharray="2,2"/>
                  <line x1="165" y1="85" x2="268" y2="85" stroke="var(--border-color)" stroke-width="0.8" stroke-dasharray="2,2"/>
                  <line x1="200" y1="10" x2="200" y2="105" stroke="var(--border-color)" stroke-width="0.8" stroke-dasharray="2,2"/>
                  <line x1="235" y1="10" x2="235" y2="105" stroke="var(--border-color)" stroke-width="0.8" stroke-dasharray="2,2"/>
                  
                  <!-- Target Drop Komponen Terpasang -->
                  <rect x="185" y="38" width="60" height="46" rx="5" fill="rgba(245, 158, 11, 0.12)" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="4,3"/>
                  <circle cx="215" cy="58" r="12" fill="var(--bg-secondary)" stroke="var(--text-primary)" stroke-width="1.5"/>
                  <line x1="206.5" y1="49.5" x2="223.5" y2="66.5" stroke="var(--text-primary)" stroke-width="1.5"/>
                  <line x1="223.5" y1="49.5" x2="206.5" y2="66.5" stroke="var(--text-primary)" stroke-width="1.5"/>
                  <text x="215" y="77" fill="var(--accent-color)" font-size="7" font-weight="700" text-anchor="middle">TERPASANG</text>
                </svg>
              </div>
              <div class="tut-text">
                <p><strong>Desktop:</strong> Seret (<em>drag</em>) komponen dari palet sebelah kiri lalu letakkan (<em>drop</em>) di area kanvas kerja.</p>
                <p><strong>HP/Tablet:</strong> Ketuk (<em>tap</em>) komponen di palet kiri, lalu ketuk di area kanvas kerja untuk menaruhnya secara presisi.</p>
                <p><strong>Buka/Tutup Palet:</strong> Di layar sentuh/HP, ketuk tombol palet (ikon <span class="tut-chip"><i class="bi bi-plus-lg"></i> / <i class="bi bi-x-lg"></i></span> di pojok kiri bawah) untuk membuka atau menutup laci palet komponen.</p>
              </div>
            </div>
          </div>

          <!-- 2. Menghubungkan Kabel -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-bezier2" style="color: var(--accent-color);"></i> 2. Menghubungkan Kabel</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi menghubungkan kabel dari pin komponen, belokan waypoint, dan percabangan junction dot">
                  <!-- Terminal Pin A -->
                  <circle cx="32" cy="65" r="9" fill="var(--bg-primary)" stroke="#ef4444" stroke-width="2.5"/>
                  <circle cx="32" cy="65" r="4" fill="#ef4444"/>
                  <text x="32" y="88" fill="var(--text-primary)" font-size="8" font-weight="700" text-anchor="middle">Pin A</text>

                  <!-- Jalur Kabel: Pin A -> Belokan (Waypoint) -> Junction Dot -> Pin B -->
                  <path d="M 32 65 H 95 V 35 H 175" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  
                  <!-- Waypoint Handle -->
                  <rect x="89" y="29" width="12" height="12" rx="2" fill="var(--bg-secondary)" stroke="var(--accent-color)" stroke-width="2"/>
                  <text x="95" y="20" fill="var(--accent-color)" font-size="7.5" font-weight="700" text-anchor="middle">Waypoint</text>

                  <!-- Percabangan (Junction Dot) -->
                  <path d="M 175 35 V 90" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                  <circle cx="175" cy="35" r="5.5" fill="#000" stroke="#fff" stroke-width="1.5"/>
                  <text x="175" y="20" fill="var(--text-primary)" font-size="7.5" font-weight="700" text-anchor="middle">Junction Dot</text>

                  <!-- Cabang Bawah -->
                  <circle cx="175" cy="90" r="7" fill="var(--bg-primary)" stroke="#ef4444" stroke-width="2"/>
                  <text x="175" y="104" fill="var(--text-muted)" font-size="7" font-weight="600" text-anchor="middle">Cabang ke Beban</text>

                  <!-- Sambungan ke Pin B -->
                  <path d="M 175 35 H 248" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                  <circle cx="248" cy="35" r="9" fill="var(--bg-primary)" stroke="#ef4444" stroke-width="2.5"/>
                  <circle cx="248" cy="35" r="4" fill="#ef4444"/>
                  <text x="248" y="58" fill="var(--text-primary)" font-size="8" font-weight="700" text-anchor="middle">Pin B</text>
                </svg>
              </div>
              <div class="tut-text">
                <p>Ketuk titik pin terminal komponen (fasa, netral, atau arde), tarik garis kabel, lalu ketuk pin tujuan untuk menyambung.</p>
                <p><strong>Titik Belok (Waypoint):</strong> Ketuk area kanvas kosong saat sedang menarik kabel untuk menambah titik belokan.</p>
                <p><strong>Percabangan:</strong> Ketuk ujung kabel baru ke bagian tengah kabel lain yang sudah ada. Titik sambungan bulat (<em>junction dot</em>) akan otomatis terbentuk.</p>
                <p><strong>Batal & Hapus Titik:</strong> Tekan tombol <span class="tut-chip danger"><i class="bi bi-x-circle"></i> Batal (Esc)</span> untuk membatalkan penarikan kabel. Gunakan tombol <span class="tut-chip"><i class="bi bi-arrow-counterclockwise"></i> Hapus Titik</span> untuk menghapus titik belok terakhir.</p>
              </div>
            </div>
          </div>

          <!-- 3. Warna Kabel (Standar PUIL) -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-palette-fill" style="color: var(--accent-color);"></i> 3. Warna Kabel (Standar PUIL)</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Diagram warna kabel instalasi listrik standar PUIL">
                  <defs>
                    <pattern id="tut-pe-pattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <rect width="5" height="10" fill="#22c55e"/>
                      <rect x="5" width="5" height="10" fill="#eab308"/>
                    </pattern>
                  </defs>

                  <!-- R (Merah) -->
                  <g transform="translate(16, 12)">
                    <circle cx="8" cy="7" r="5" fill="#ef4444"/>
                    <rect x="20" y="3" width="130" height="8" rx="4" fill="#ef4444"/>
                    <circle cx="156" cy="7" r="5" fill="#ef4444"/>
                    <text x="170" y="10" fill="var(--text-primary)" font-size="8.5" font-weight="700">R: Fasa 1 (Merah)</text>
                  </g>

                  <!-- S (Kuning) -->
                  <g transform="translate(16, 32)">
                    <circle cx="8" cy="7" r="5" fill="#eab308"/>
                    <rect x="20" y="3" width="130" height="8" rx="4" fill="#eab308"/>
                    <circle cx="156" cy="7" r="5" fill="#eab308"/>
                    <text x="170" y="10" fill="var(--text-primary)" font-size="8.5" font-weight="700">S: Fasa 2 (Kuning)</text>
                  </g>

                  <!-- T (Hitam) -->
                  <g transform="translate(16, 52)">
                    <circle cx="8" cy="7" r="5" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2"/>
                    <rect x="20" y="3" width="130" height="8" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
                    <circle cx="156" cy="7" r="5" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2"/>
                    <text x="170" y="10" fill="var(--text-primary)" font-size="8.5" font-weight="700">T: Fasa 3 (Hitam)</text>
                  </g>

                  <!-- N (Biru) -->
                  <g transform="translate(16, 72)">
                    <circle cx="8" cy="7" r="5" fill="#3b82f6"/>
                    <rect x="20" y="3" width="130" height="8" rx="4" fill="#3b82f6"/>
                    <circle cx="156" cy="7" r="5" fill="#3b82f6"/>
                    <text x="170" y="10" fill="var(--text-primary)" font-size="8.5" font-weight="700">N: Netral (Biru)</text>
                  </g>

                  <!-- PE (Kuning-Hijau) -->
                  <g transform="translate(16, 92)">
                    <circle cx="8" cy="7" r="5" fill="#22c55e" stroke="#eab308" stroke-width="1.5"/>
                    <rect x="20" y="3" width="130" height="8" rx="4" fill="url(#tut-pe-pattern)"/>
                    <circle cx="156" cy="7" r="5" fill="#22c55e" stroke="#eab308" stroke-width="1.5"/>
                    <text x="170" y="10" fill="var(--text-primary)" font-size="8.5" font-weight="700">PE: Arde (Kuning-Hijau)</text>
                  </g>
                </svg>
              </div>
              <div class="tut-text">
                <p>Warna isolasi kabel otomatis mengikuti standar PUIL (Persyaratan Umum Instalasi Listrik) berdasarkan terminal sambungannya:</p>
                <p>• <strong><span class="tut-chip" style="border-color:#ef4444; color:#ef4444;"><i class="bi bi-circle-fill"></i> Merah</span> / <span class="tut-chip" style="border-color:#eab308; color:#eab308;"><i class="bi bi-circle-fill"></i> Kuning</span> / <span class="tut-chip" style="border-color:#94a3b8; color:var(--text-primary);"><i class="bi bi-circle-fill"></i> Hitam</span>:</strong> Kabel Fasa (R, S, T).</p>
                <p>• <strong><span class="tut-chip" style="border-color:#3b82f6; color:#3b82f6;"><i class="bi bi-circle-fill"></i> Biru</span>:</strong> Kabel Netral (N).</p>
                <p>• <strong><span class="tut-chip" style="border-color:#22c55e; color:#22c55e;"><i class="bi bi-circle-fill"></i> Kuning-Hijau / Hijau</span>:</strong> Kabel Pengaman Pembumian (Ground / PE).</p>
              </div>
            </div>
          </div>

          <!-- 4. Memilih, Memutar & Menghapus -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-cursor-fill" style="color: var(--accent-color);"></i> 4. Memilih, Memutar & Menghapus</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi memilih item di kanvas dengan bingkai seleksi bercahaya dan menu melayang putar atau hapus">
                  <!-- Menu Aksi Melayang -->
                  <g transform="translate(50, 10)">
                    <rect x="0" y="0" width="180" height="28" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
                    <!-- Tombol Putar -->
                    <rect x="6" y="4" width="48" height="20" rx="4" fill="var(--bg-tertiary)"/>
                    <text x="30" y="17" fill="var(--text-primary)" font-size="7.5" font-weight="600" text-anchor="middle">↻ Putar</text>
                    <!-- Tombol Rapikan -->
                    <rect x="58" y="4" width="58" height="20" rx="4" fill="var(--bg-tertiary)"/>
                    <text x="87" y="17" fill="var(--text-primary)" font-size="7.5" font-weight="600" text-anchor="middle">⟍ Rapikan</text>
                    <!-- Tombol Hapus -->
                    <rect x="120" y="4" width="54" height="20" rx="4" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
                    <text x="147" y="17" fill="var(--color-error)" font-size="7.5" font-weight="700" text-anchor="middle">🗑 Hapus</text>
                  </g>

                  <!-- Garis Penunjuk dari Menu ke Komponen -->
                  <line x1="140" y1="38" x2="140" y2="48" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="2,2"/>

                  <!-- Komponen Terpilih dengan Highlight Box -->
                  <rect x="105" y="48" width="70" height="56" rx="6" fill="rgba(245, 158, 11, 0.08)" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="4,4"/>
                  
                  <!-- Gambar Saklar Skematik Mini di Dalam Box -->
                  <circle cx="140" cy="80" r="3" fill="var(--text-primary)"/>
                  <circle cx="140" cy="62" r="3" fill="none" stroke="var(--text-primary)" stroke-width="1.5"/>
                  <line x1="140" y1="80" x2="152" y2="64" stroke="var(--accent-color)" stroke-width="2"/>
                  <text x="140" y="96" fill="var(--accent-color)" font-size="7.5" font-weight="700" text-anchor="middle">TERPILIH</text>

                  <!-- Keterangan Keyboard Shortcut -->
                  <text x="220" y="78" fill="var(--text-muted)" font-size="7" font-weight="600">Keyboard:</text>
                  <rect x="215" y="83" width="52" height="18" rx="4" fill="var(--bg-tertiary)" stroke="var(--border-color)" stroke-width="1"/>
                  <text x="241" y="95" fill="var(--text-primary)" font-size="7" font-weight="700" text-anchor="middle">Delete / ⌫</text>
                </svg>
              </div>
              <div class="tut-text">
                <p>Ketuk komponen atau kabel di kanvas untuk <strong>memilih</strong> (ditandai bingkai seleksi bercahaya). Menu aksi kecil akan melayang di atas objek terpilih:</p>
                <p>• <strong>Putar:</strong> <span class="tut-chip"><i class="bi bi-arrow-repeat"></i> Putar</span> Memutar arah posisi komponen sebesar 90°.</p>
                <p>• <strong>Rapikan Kabel / Rapikan Otomatis:</strong> <span class="tut-chip"><i class="bi bi-bezier2"></i> Rapikan</span> Mengubah kabel bebas menjadi siku-siku 90° atau mengembalikan rute kabel otomatis. Anda juga dapat menyeret pegangan di tengah garis kabel untuk menggeser belokan.</p>
                <p>• <strong>Sembunyikan / Tampilkan Label:</strong> <span class="tut-chip"><i class="bi bi-tag"></i> Label</span> Khusus Panel PHB 3-Fasa, untuk menampilkan atau menyembunyikan teks label grup beban.</p>
                <p>• <strong>Ganti Sekring Baru:</strong> <span class="tut-chip success"><i class="bi bi-arrow-clockwise"></i> Ganti Sekring</span> Khusus komponen Sekring (Fuse) yang kawat leburnya sudah putus.</p>
                <p>• <strong>Hapus:</strong> <span class="tut-chip danger"><i class="bi bi-trash"></i> Hapus</span> Menghapus objek terpilih. Di desktop, tombol <span class="tut-chip">Delete</span> atau <span class="tut-chip">Backspace</span> pada keyboard juga dapat langsung menghapus item yang sedang dipilih.</p>
              </div>
            </div>
          </div>

          <!-- Sub-judul Kelompok B -->
          <div style="padding: 10px 0 2px 2px; border-bottom: 1px solid var(--border-color); margin-bottom: -4px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-color); margin: 0; display: flex; align-items: center; gap: 8px;">
              <i class="bi bi-sliders"></i> Kelompok B — Kontrol Kanvas
            </h4>
          </div>

          <!-- 5. Zoom, Grid & Snap -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-aspect-ratio" style="color: var(--accent-color);"></i> 5. Zoom, Grid & Snap</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi bilah tombol kontrol kanvas: zoom in, zoom out, fit, grid, snap magnet, dan kabel siku-siku">
                  <!-- Latar Belakang Grid Kanvas -->
                  <g stroke="var(--border-color)" stroke-width="0.8" opacity="0.6">
                    <line x1="15" y1="20" x2="175" y2="20"/>
                    <line x1="15" y1="45" x2="175" y2="45"/>
                    <line x1="15" y1="70" x2="175" y2="70"/>
                    <line x1="15" y1="95" x2="175" y2="95"/>
                    <line x1="30" y1="10" x2="30" y2="105"/>
                    <line x1="65" y1="10" x2="65" y2="105"/>
                    <line x1="100" y1="10" x2="100" y2="105"/>
                    <line x1="135" y1="10" x2="135" y2="105"/>
                    <line x1="170" y1="10" x2="170" y2="105"/>
                  </g>

                  <!-- Ilustrasi Efek Magnet Snap -->
                  <circle cx="100" cy="45" r="14" fill="rgba(245, 158, 11, 0.15)" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="2,2"/>
                  <circle cx="100" cy="45" r="4" fill="var(--accent-color)"/>
                  <text x="100" y="38" fill="var(--accent-color)" font-size="7" font-weight="800" text-anchor="middle">🧲 SNAP</text>

                  <!-- Kabel Siku-siku 90° -->
                  <path d="M 30 70 H 100 V 95" fill="none" stroke="#ef4444" stroke-width="2.5"/>
                  <circle cx="30" cy="70" r="3.5" fill="#ef4444"/>
                  <circle cx="100" cy="95" r="3.5" fill="#ef4444"/>
                  <text x="65" y="65" fill="var(--text-muted)" font-size="6.5" font-weight="600" text-anchor="middle">Siku 90°</text>

                  <!-- Bilah Melayang Tombol Kontrol Kanan -->
                  <rect x="195" y="8" width="72" height="98" rx="8" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.35))"/>
                  
                  <rect x="202" y="14" width="26" height="22" rx="4" fill="var(--bg-tertiary)"/>
                  <text x="215" y="29" fill="var(--text-primary)" font-size="12" font-weight="700" text-anchor="middle">+</text>

                  <rect x="234" y="14" width="26" height="22" rx="4" fill="var(--bg-tertiary)"/>
                  <text x="247" y="28" fill="var(--text-primary)" font-size="12" font-weight="700" text-anchor="middle">−</text>

                  <rect x="202" y="41" width="58" height="20" rx="4" fill="var(--bg-tertiary)"/>
                  <text x="231" y="55" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">FIT (Pas Layar)</text>

                  <rect x="202" y="66" width="26" height="22" rx="4" fill="var(--bg-tertiary)"/>
                  <text x="215" y="81" fill="var(--text-primary)" font-size="9" text-anchor="middle">▦</text>

                  <rect x="234" y="66" width="26" height="22" rx="4" fill="rgba(245, 158, 11, 0.2)" stroke="var(--accent-color)" stroke-width="1"/>
                  <text x="247" y="81" fill="var(--accent-color)" font-size="9" text-anchor="middle">🧲</text>

                  <text x="231" y="100" fill="var(--text-muted)" font-size="6.5" font-weight="600" text-anchor="middle">Kontrol Kanvas</text>
                </svg>
              </div>
              <div class="tut-text">
                <p>Gunakan bilah tombol melayang di pojok kanan bawah kanvas:</p>
                <p>• <strong>Zoom In (+) & Zoom Out (-):</strong> <span class="tut-chip"><i class="bi bi-zoom-in"></i> +</span> / <span class="tut-chip"><i class="bi bi-zoom-out"></i> -</span> Memperbesar atau memperkecil tampilan (bisa juga mencubit layar sentuh dengan 2 jari / roda putar mouse).</p>
                <p>• <strong>Zoom Fit (FIT):</strong> <span class="tut-chip">FIT</span> Menyesuaikan skala dan memusatkan seluruh rangkaian secara otomatis agar pas di layar.</p>
                <p>• <strong>Tampilkan Grid:</strong> <span class="tut-chip"><i class="bi bi-grid-3x3"></i> Grid</span> Menampilkan atau menyembunyikan garis-garis kotak bantu kanvas.</p>
                <p>• <strong>Tempel ke Grid (Snap):</strong> <span class="tut-chip"><i class="bi bi-magnet"></i> Snap</span> Mengunci posisi komponen dan titik kabel agar selalu menempel rapi pada kelipatan grid.</p>
                <p>• <strong>Kabel Siku-siku:</strong> <span class="tut-chip"><i class="bi bi-bounding-box-circles"></i> 90°</span> Beralih antara mode penarikan kabel siku 90° (ortogonal) dan mode kabel bebas.</p>
              </div>
            </div>
          </div>

          <!-- 6. Undo, Redo & Reset -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-arrow-counterclockwise" style="color: var(--accent-color);"></i> 6. Undo, Redo & Reset</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi navigasi riwayat perakitan: undo untuk langkah mundur, redo untuk langkah maju, dan tombol reset">
                  <!-- Baris Tombol Navbar -->
                  <g transform="translate(18, 14)">
                    <!-- Tombol Undo -->
                    <rect x="0" y="0" width="74" height="30" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="37" y="19" fill="var(--text-primary)" font-size="9.5" font-weight="700" text-anchor="middle">↶ Undo</text>
                    
                    <!-- Tombol Redo -->
                    <rect x="84" y="0" width="74" height="30" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="121" y="19" fill="var(--text-primary)" font-size="9.5" font-weight="700" text-anchor="middle">↷ Redo</text>

                    <!-- Tombol Reset Sirkuit -->
                    <rect x="168" y="0" width="76" height="30" rx="6" fill="rgba(239, 68, 68, 0.12)" stroke="var(--color-error)" stroke-width="1.2"/>
                    <text x="206" y="19" fill="var(--color-error)" font-size="9.5" font-weight="700" text-anchor="middle">🗑 Reset</text>
                  </g>

                  <!-- Garis Alur Riwayat Waktu -->
                  <line x1="30" y1="72" x2="250" y2="72" stroke="var(--border-color)" stroke-width="2"/>
                  
                  <!-- Titik-titik Riwayat -->
                  <circle cx="55" cy="72" r="6" fill="var(--bg-tertiary)" stroke="var(--border-color)" stroke-width="2"/>
                  <text x="55" y="92" fill="var(--text-muted)" font-size="7.5" font-weight="600" text-anchor="middle">Langkah N-1</text>

                  <circle cx="138" cy="72" r="9" fill="var(--accent-color)" stroke="var(--bg-primary)" stroke-width="2"/>
                  <text x="138" y="93" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">Sekarang (N)</text>

                  <circle cx="221" cy="72" r="6" fill="var(--bg-tertiary)" stroke="var(--border-color)" stroke-width="2"/>
                  <text x="221" y="92" fill="var(--text-muted)" font-size="7.5" font-weight="600" text-anchor="middle">Langkah N+1</text>

                  <!-- Panah Mundur / Maju -->
                  <path d="M 125 60 C 105 50, 75 52, 63 64" fill="none" stroke="var(--text-primary)" stroke-width="1.5" stroke-dasharray="3,2"/>
                  <path d="M 151 60 C 171 50, 201 52, 213 64" fill="none" stroke="var(--text-primary)" stroke-width="1.5" stroke-dasharray="3,2"/>
                  <text x="138" y="107" fill="var(--text-secondary)" font-size="7" font-weight="600" text-anchor="middle">Riwayat Perubahan Tersimpan Aman</text>
                </svg>
              </div>
              <div class="tut-text">
                <p>• <strong>Undo & Redo:</strong> Gunakan tombol <span class="tut-chip"><i class="bi bi-arrow-counterclockwise"></i> Undo</span> dan <span class="tut-chip"><i class="bi bi-arrow-clockwise"></i> Redo</span> di bilah navigasi atas untuk membatalkan atau mengulang langkah perakitan terakhir.</p>
                <p>• <strong>Reset Sirkuit:</strong> Gunakan tombol <span class="tut-chip danger"><i class="bi bi-trash3"></i> Reset</span> (ikon tempat sampah merah) di bilah atas untuk mengosongkan seluruh komponen dan kabel kanvas kembali bersih (sumber listrik tetap dipertahankan).</p>
              </div>
            </div>
          </div>

          <!-- 7. Mode Tampilan: Wiring & Realistis -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-eye-fill" style="color: var(--accent-color);"></i> 7. Mode Tampilan: Wiring & Realistis</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <div class="tut-compare-box">
                  <div class="tut-compare-item">
                    <span class="tut-compare-label"><i class="bi bi-diagram-3"></i> Wiring</span>
                    <svg viewBox="0 0 60 95" width="60" height="75" role="img" aria-label="Simbol skematik saklar tunggal">${switchSchematicSvg}</svg>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Simbol Skematik PUIL</span>
                  </div>
                  <div class="tut-compare-vs">VS</div>
                  <div class="tut-compare-item">
                    <span class="tut-compare-label"><i class="bi bi-image"></i> Realistis</span>
                    <img src="${switchPhotoUrl}" alt="Foto Realistis Saklar Tunggal" loading="lazy" />
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Foto Fisik Nyata 3D</span>
                  </div>
                </div>
              </div>
              <div class="tut-text">
                <p>Beralih gaya visual kanvas kapan saja melalui tombol di bilah navigasi atas:</p>
                <p>• <strong>Wiring:</strong> <span class="tut-chip"><i class="bi bi-diagram-3"></i> Wiring</span> Menampilkan rangkaian menggunakan simbol skematik diagram pengawatan standar teknik elektro (PUIL).</p>
                <p>• <strong>Realistis:</strong> <span class="tut-chip"><i class="bi bi-image"></i> Realistis</span> Menampilkan komponen dalam wujud foto fisik nyata 3D beresolusi tinggi untuk melatih pengenalan peralatan di bengkel kerja listrik.</p>
              </div>
            </div>
          </div>

          <!-- Sub-judul Kelompok C -->
          <div style="padding: 10px 0 2px 2px; border-bottom: 1px solid var(--border-color); margin-bottom: -4px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-color); margin: 0; display: flex; align-items: center; gap: 8px;">
              <i class="bi bi-lightning-charge"></i> Kelompok C — Simulasi, Pengecekan & Menu Lain
            </h4>
          </div>

          <!-- 8. Simulasikan -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-play-circle-fill" style="color: var(--accent-color);"></i> 8. Simulasikan</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi aliran arus listrik saat simulasi aktif, saklar tertutup, dan lampu menyala bercahaya">
                  <defs>
                    <filter id="tut-lamp-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <!-- Banner Status Simulasi Aktif -->
                  <rect x="18" y="8" width="130" height="20" rx="4" fill="rgba(245, 158, 11, 0.15)" stroke="var(--accent-color)" stroke-width="1"/>
                  <circle cx="28" cy="18" r="4" fill="#22c55e"/>
                  <text x="80" y="22" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">⚡ SIMULASI AKTIF (220V)</text>

                  <!-- Status Trip Callout Kanan -->
                  <rect x="156" y="8" width="106" height="20" rx="4" fill="rgba(239, 68, 68, 0.12)" stroke="var(--color-error)" stroke-width="1"/>
                  <text x="209" y="21" fill="var(--color-error)" font-size="7.5" font-weight="700" text-anchor="middle">⚠ Proteksi Trip Hubung Singkat</text>

                  <!-- Rangkaian Aktif -->
                  <!-- Sumber / MCB (Tertutup) -->
                  <g transform="translate(22, 45)">
                    <rect x="0" y="0" width="30" height="48" rx="4" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <line x1="15" y1="0" x2="15" y2="12" stroke="#ef4444" stroke-width="2.5"/>
                    <circle cx="15" cy="14" r="2.5" fill="#ef4444"/>
                    <circle cx="15" cy="34" r="2.5" fill="#ef4444"/>
                    <line x1="15" y1="14" x2="15" y2="34" stroke="#22c55e" stroke-width="2.5"/>
                    <line x1="15" y1="34" x2="15" y2="48" stroke="#ef4444" stroke-width="2.5"/>
                    <text x="15" y="44" fill="var(--text-muted)" font-size="5.5" font-weight="700" text-anchor="middle">MCB</text>
                  </g>

                  <!-- Kabel Fasa Berpulsa (Merah) -->
                  <path d="M 37 93 H 95 V 68 H 115" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                  <!-- Indikator Aliran Arus Listrik -->
                  <polygon points="65,90 72,93 65,96" fill="#fef08a"/>
                  
                  <!-- Saklar Tunggal ON (Tertutup) -->
                  <g transform="translate(115, 45)">
                    <rect x="0" y="0" width="36" height="48" rx="4" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <line x1="0" y1="23" x2="10" y2="23" stroke="#ef4444" stroke-width="2.5"/>
                    <circle cx="10" cy="23" r="2.5" fill="#ef4444"/>
                    <circle cx="26" cy="23" r="2.5" fill="#ef4444"/>
                    <line x1="10" y1="23" x2="26" y2="23" stroke="#22c55e" stroke-width="2.5"/>
                    <line x1="26" y1="23" x2="36" y2="23" stroke="#ef4444" stroke-width="2.5"/>
                    <text x="18" y="41" fill="var(--text-muted)" font-size="6" font-weight="700" text-anchor="middle">SAKLAR ON</text>
                  </g>

                  <!-- Kabel ke Lampu -->
                  <path d="M 151 68 H 195" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                  <polygon points="170,65 177,68 170,71" fill="#fef08a"/>

                  <!-- Lampu Menyala (Glowing Yellow) -->
                  <g transform="translate(195, 42)">
                    <!-- Pancaran Cahaya Glow -->
                    <circle cx="26" cy="26" r="24" fill="#fde047" opacity="0.35" filter="url(#tut-lamp-glow)"/>
                    <!-- Badan Lampu -->
                    <circle cx="26" cy="26" r="16" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
                    <line x1="15" y1="15" x2="37" y2="37" stroke="#854d0e" stroke-width="2"/>
                    <line x1="37" y1="15" x2="15" y2="37" stroke="#854d0e" stroke-width="2"/>
                    <text x="26" y="52" fill="#eab308" font-size="7" font-weight="800" text-anchor="middle">MENYALA</text>
                  </g>

                  <!-- Kabel Netral Kembali (Biru) -->
                  <path d="M 237 68 H 262 V 105 H 22 V 93" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <text x="140" y="103" fill="#3b82f6" font-size="7" font-weight="700" text-anchor="middle">Arus Kembali Netral (N)</text>
                </svg>
              </div>
              <div class="tut-text">
                <p>Ketuk tombol <span class="tut-chip accent"><i class="bi bi-play-fill"></i> Simulasikan</span> di bilah atas untuk mengalirkan arus listrik ke rangkaian:</p>
                <p>• Tombol akan berubah menjadi <span class="tut-chip danger"><i class="bi bi-stop-fill"></i> Stop</span> saat simulasi berjalan. Anda dapat mengetuk sakelar atau tuas MCB untuk menyalakan/mematikan lampu secara interaktif.</p>
                <p>• <strong>Aliran Arus:</strong> Kabel fasa (merah/kuning/hitam), netral (biru), dan arde (hijau) tetap mempertahankan warna aslinya dan berkedip dengan animasi pulsa saat teraliri arus listrik.</p>
                <p>• <strong>Pencegahan & Korsleting:</strong> Jika terdeteksi kesalahan fatal sebelum simulasi, simulasi akan <strong>diblokir</strong> dan lokasi kesalahan disebutkan. Jika terjadi hubung singkat saat pengujian, MCB akan langsung <span class="tut-chip danger"><i class="bi bi-lightning-charge"></i> TRIP</span> otomatis ke posisi OFF (atau kawat sekring putus permanen) disertai dialog edukatif.</p>
              </div>
            </div>
          </div>

          <!-- 9. Cek Kesalahan Rangkaian -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-shield-check" style="color: var(--accent-color);"></i> 9. Cek Kesalahan Rangkaian</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi kartu alert deteksi kesalahan rangkaian dengan tombol lihat yang menyorot komponen bermasalah">
                  <!-- Kartu Peringatan (Alert Card) -->
                  <g transform="translate(12, 14)">
                    <rect x="0" y="0" width="140" height="88" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
                    <!-- Garis Merah di Sisi Kiri -->
                    <path d="M 0 6 Q 0 0 6 0 L 6 0 L 6 88 L 6 88 Q 0 88 0 82 Z" fill="var(--color-error)"/>
                    <!-- Header Alert -->
                    <circle cx="18" cy="18" r="8" fill="rgba(239, 68, 68, 0.2)"/>
                    <text x="18" y="22" fill="var(--color-error)" font-size="10" font-weight="900" text-anchor="middle">⚠</text>
                    <text x="32" y="21" fill="var(--text-primary)" font-size="8" font-weight="800">Kabel Belum Konek</text>
                    <!-- Deskripsi Error -->
                    <text x="14" y="42" fill="var(--text-secondary)" font-size="7" font-weight="500">Pin netral Lampu L1</text>
                    <text x="14" y="54" fill="var(--text-secondary)" font-size="7" font-weight="500">belum tersambung ke sumber.</text>
                    <!-- Tombol Lihat -->
                    <rect x="14" y="62" width="60" height="18" rx="4" fill="var(--accent-color)"/>
                    <text x="44" y="74" fill="#0f172a" font-size="7.5" font-weight="800" text-anchor="middle">🔍 Lihat</text>
                  </g>

                  <!-- Garis Panah Sorot Kamera -->
                  <path d="M 80 84 C 115 105, 140 100, 185 82" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="3,3"/>
                  <polygon points="183,77 192,80 186,87" fill="var(--accent-color)"/>

                  <!-- Komponen yang Bermasalah di Kanvas -->
                  <g transform="translate(195, 20)">
                    <!-- Lingkaran Pulsa Merah -->
                    <circle cx="35" cy="35" r="32" fill="none" stroke="var(--color-error)" stroke-width="2" stroke-dasharray="4,4"/>
                    <!-- Simbol Komponen Lampu -->
                    <circle cx="35" cy="35" r="20" fill="var(--bg-secondary)" stroke="var(--color-error)" stroke-width="2"/>
                    <line x1="21" y1="21" x2="49" y2="49" stroke="var(--color-error)" stroke-width="2"/>
                    <line x1="49" y1="21" x2="21" y2="49" stroke="var(--color-error)" stroke-width="2"/>
                    
                    <!-- Badge Peringatan Menempel -->
                    <circle cx="55" cy="15" r="9" fill="var(--color-error)" stroke="#fff" stroke-width="1.5"/>
                    <text x="55" y="19" fill="#fff" font-size="10" font-weight="900" text-anchor="middle">!</text>
                    <text x="35" y="68" fill="var(--color-error)" font-size="7.5" font-weight="800" text-anchor="middle">Lampu 1 (Error)</text>
                  </g>
                </svg>
              </div>
              <div class="tut-text">
                <p>Di mode Merakit Bebas, tombol <span class="tut-chip"><i class="bi bi-shield-check"></i> Cek Kesalahan</span> di bilah atas menampilkan daftar kesalahan atau catatan tanpa penilaian kelulusan.</p>
                <p>• Ketuk kartu peringatan (atau tombol <span class="tut-chip"><i class="bi bi-eye"></i> Lihat</span>) untuk otomatis memfokuskan kamera kanvas dan menyorot letak komponen yang bermasalah.</p>
                <p>• Di layar HP, kartu peringatan dapat diminimalkan menjadi pil kecil agar pandangan ke kanvas tetap leluasa.</p>
              </div>
            </div>
          </div>

          <!-- 10. Jobsheet -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-journal-check" style="color: var(--accent-color);"></i> 10. Jobsheet (Latihan Terstruktur)</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi modul latihan Jobsheet dengan panel instruksi di kiri, kanvas di kanan, dan lencana status LULUS">
                  <!-- Panel Kiri: Instruksi Latihan -->
                  <g transform="translate(12, 10)">
                    <rect x="0" y="0" width="105" height="95" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <rect x="0" y="0" width="105" height="20" rx="6" fill="var(--bg-tertiary)"/>
                    <text x="52" y="14" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">📋 JOBSHEET 01</text>
                    
                    <!-- Checklist Tugas -->
                    <text x="10" y="36" fill="var(--color-success)" font-size="8" font-weight="800">✓</text>
                    <text x="22" y="36" fill="var(--text-secondary)" font-size="7" font-weight="600">Pasang MCB 1P</text>
                    
                    <text x="10" y="52" fill="var(--color-success)" font-size="8" font-weight="800">✓</text>
                    <text x="22" y="52" fill="var(--text-secondary)" font-size="7" font-weight="600">Pasang Saklar Tunggal</text>

                    <text x="10" y="68" fill="var(--color-success)" font-size="8" font-weight="800">✓</text>
                    <text x="22" y="68" fill="var(--text-secondary)" font-size="7" font-weight="600">Hubungkan 1 Lampu</text>

                    <!-- Tombol Cek -->
                    <rect x="8" y="75" width="89" height="15" rx="3" fill="var(--accent-color)"/>
                    <text x="52" y="86" fill="#0f172a" font-size="7" font-weight="800" text-anchor="middle">Cek Rangkaian</text>
                  </g>

                  <!-- Panel Kanan: Kanvas Perakitan -->
                  <g transform="translate(124, 10)">
                    <rect x="0" y="0" width="144" height="95" rx="6" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <!-- Garis Skema Rangkaian Sederhana -->
                    <line x1="20" y1="48" x2="50" y2="48" stroke="#ef4444" stroke-width="2"/>
                    <rect x="50" y="36" width="24" height="24" rx="3" fill="var(--bg-tertiary)" stroke="var(--border-color)"/>
                    <line x1="74" y1="48" x2="100" y2="48" stroke="#ef4444" stroke-width="2"/>
                    <circle cx="112" cy="48" r="12" fill="var(--bg-secondary)" stroke="var(--accent-color)" stroke-width="1.5"/>
                    <line x1="103.5" y1="39.5" x2="120.5" y2="56.5" stroke="var(--accent-color)" stroke-width="1.5"/>
                    <line x1="120.5" y1="39.5" x2="103.5" y2="56.5" stroke="var(--accent-color)" stroke-width="1.5"/>
                  </g>

                  <!-- Stempel / Lencana LULUS Melayang -->
                  <g transform="translate(160, 48)">
                    <rect x="0" y="0" width="96" height="34" rx="6" fill="var(--bg-secondary)" stroke="var(--color-success)" stroke-width="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))"/>
                    <circle cx="18" cy="17" r="10" fill="var(--color-success)"/>
                    <text x="18" y="21" fill="#fff" font-size="11" font-weight="900" text-anchor="middle">✓</text>
                    <text x="56" y="16" fill="var(--color-success)" font-size="9" font-weight="900" text-anchor="middle">LULUS</text>
                    <text x="56" y="27" fill="var(--text-secondary)" font-size="6.5" font-weight="700" text-anchor="middle">NILAI: 100 / 100</text>
                  </g>
                </svg>
              </div>
              <div class="tut-text">
                <p>Pelajari instalasi penerangan listrik secara terstruktur:</p>
                <p>• Baca <span class="tut-chip"><i class="bi bi-journal-text"></i> Instruksi Praktik</span> melalui tombol panah di navbar (atau tab <span class="tut-chip"><i class="bi bi-layout-split"></i> Instruksi / Kanvas</span> pada layar sentuh HP).</p>
                <p>• Rakit rangkaian sesuai petunjuk, lalu tekan tombol <span class="tut-chip"><i class="bi bi-check2-circle"></i> Pengecekan Rangkaian</span>.</p>
                <p>• Jika lulus, modul ditandai <span class="tut-chip success"><i class="bi bi-check-circle-fill"></i> LULUS</span> dan progres tersimpan permanen. Jika belum, dialog evaluasi akan menjelaskan poin kesalahan dan lokasinya secara rinci.</p>
              </div>
            </div>
          </div>

          <!-- 11. Trouble Shoot -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-tools" style="color: var(--accent-color);"></i> 11. Trouble Shoot (Pelacakan Kerusakan)</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi mode Trouble Shoot: laporan gangguan pelanggan, menemukan sambungan rusak, tombol petunjuk bertingkat dan lihat solusi">
                  <!-- Lembar Laporan Keluhan Pelanggan -->
                  <g transform="translate(12, 10)">
                    <rect x="0" y="0" width="112" height="95" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <rect x="0" y="0" width="112" height="20" rx="6" fill="rgba(245, 158, 11, 0.15)"/>
                    <text x="56" y="14" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">📋 LAPORAN KASUS</text>
                    <text x="10" y="34" fill="var(--text-primary)" font-size="7.5" font-weight="700">"Saklar dinyalakan,</text>
                    <text x="10" y="46" fill="var(--text-primary)" font-size="7.5" font-weight="700">lampu tetap padam."</text>
                    <text x="10" y="62" fill="var(--text-muted)" font-size="7" font-weight="500">Lokasi: Rangkaian L1</text>
                    
                    <!-- Tombol Uji Solusi -->
                    <rect x="8" y="72" width="96" height="17" rx="4" fill="var(--color-success)"/>
                    <text x="56" y="84" fill="#ffffff" font-size="7.5" font-weight="800" text-anchor="middle">▶ Uji Solusi Perbaikan</text>
                  </g>

                  <!-- Rangkaian Rusak di Lapangan -->
                  <g transform="translate(132, 10)">
                    <rect x="0" y="0" width="136" height="52" rx="6" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <!-- Kabel Terputus / Rusak -->
                    <line x1="15" y1="26" x2="48" y2="26" stroke="#ef4444" stroke-width="2.5"/>
                    <circle cx="48" cy="26" r="3" fill="#ef4444"/>
                    
                    <!-- Tanda Kerusakan / Putus -->
                    <circle cx="68" cy="26" r="10" fill="rgba(239, 68, 68, 0.15)" stroke="var(--color-error)" stroke-width="1.5" stroke-dasharray="2,2"/>
                    <text x="68" y="30" fill="var(--color-error)" font-size="10" font-weight="900" text-anchor="middle">✕</text>
                    
                    <line x1="88" y1="26" x2="120" y2="26" stroke="#ef4444" stroke-width="2.5"/>
                    <circle cx="88" cy="26" r="3" fill="#ef4444"/>
                    <text x="68" y="47" fill="var(--color-error)" font-size="6.5" font-weight="700" text-anchor="middle">Kabel Putus / Salah Pin</text>
                  </g>

                  <!-- Tombol Bantuan: Buka Petunjuk & Lihat Solusi -->
                  <g transform="translate(132, 68)">
                    <rect x="0" y="0" width="65" height="28" rx="5" fill="var(--bg-secondary)" stroke="var(--accent-color)" stroke-width="1"/>
                    <text x="32" y="18" fill="var(--accent-color)" font-size="7.5" font-weight="700" text-anchor="middle">💡 Petunjuk</text>

                    <rect x="71" y="0" width="65" height="28" rx="5" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1"/>
                    <text x="103" y="18" fill="var(--text-secondary)" font-size="7.5" font-weight="700" text-anchor="middle">🔑 Solusi</text>
                  </g>
                </svg>
              </div>
              <div class="tut-text">
                <p>Asah kemampuan pelacakan gangguan instalasi di lapangan:</p>
                <p>• Baca laporan keluhan pelanggan, lalu telusuri dan perbaiki sambungan sirkuit yang rusak di kanvas. Indikator kesalahan otomatis sengaja disembunyikan di mode ini agar siswa mencari masalah secara mandiri.</p>
                <p>• Jika mengalami kebuntuan, gunakan tombol <span class="tut-chip accent"><i class="bi bi-lightbulb"></i> Buka Petunjuk</span> untuk petunjuk bertingkat, atau tombol <span class="tut-chip"><i class="bi bi-key"></i> Lihat Solusi</span> untuk mengungkap letak kerusakan.</p>
                <p>• Tekan tombol <span class="tut-chip success"><i class="bi bi-play-circle"></i> Uji Solusi Perbaikan</span> untuk memvalidasi perbaikan Anda.</p>
              </div>
            </div>
          </div>

          <!-- 12. Materi -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-book-half" style="color: var(--accent-color);"></i> 12. Buku Materi IPL</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi 4 kategori modul buku materi teori IPL dengan tombol baca materi dan coba di simulator">
                  <!-- 4 Kotak Kategori Materi -->
                  <g transform="translate(12, 10)">
                    <!-- 1: K3LH -->
                    <rect x="0" y="0" width="60" height="42" rx="5" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="30" y="19" font-size="13" text-anchor="middle">🛡️</text>
                    <text x="30" y="34" fill="var(--text-primary)" font-size="6.5" font-weight="700" text-anchor="middle">K3LH</text>

                    <!-- 2: Alat & Bahan -->
                    <rect x="66" y="0" width="60" height="42" rx="5" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="96" y="19" font-size="13" text-anchor="middle">🔧</text>
                    <text x="96" y="34" fill="var(--text-primary)" font-size="6.5" font-weight="700" text-anchor="middle">Alat & Bahan</text>

                    <!-- 3: Komponen -->
                    <rect x="132" y="0" width="60" height="42" rx="5" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="162" y="19" font-size="13" text-anchor="middle">💡</text>
                    <text x="162" y="34" fill="var(--text-primary)" font-size="6.5" font-weight="700" text-anchor="middle">Komponen</text>

                    <!-- 4: 3 Fasa -->
                    <rect x="198" y="0" width="60" height="42" rx="5" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="228" y="19" font-size="13" text-anchor="middle">⚡</text>
                    <text x="228" y="34" fill="var(--text-primary)" font-size="6.5" font-weight="700" text-anchor="middle">Sistem 3 Fasa</text>
                  </g>

                  <!-- Tombol Aksi di Bawah Kartu -->
                  <g transform="translate(24, 62)">
                    <!-- Baca Selengkapnya -->
                    <rect x="0" y="0" width="110" height="26" rx="5" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="55" y="17" fill="var(--text-primary)" font-size="8" font-weight="700" text-anchor="middle">📖 Baca Selengkapnya</text>

                    <!-- Coba di Simulator -->
                    <rect x="122" y="0" width="110" height="26" rx="5" fill="rgba(245, 158, 11, 0.15)" stroke="var(--accent-color)" stroke-width="1.2"/>
                    <text x="177" y="17" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">⚡ Coba di Simulator</text>
                  </g>
                  <text x="140" y="104" fill="var(--text-muted)" font-size="6.5" font-weight="600" text-anchor="middle">Teori Terintegrasi Langsung ke Praktik Rangkaian</text>
                </svg>
              </div>
              <div class="tut-text">
                <p>Modul teori interaktif yang terbagi dalam 4 kategori besar: <strong>K3LH Kelistrikan</strong>, <strong>Alat dan Bahan Kerja IPL</strong>, <strong>Komponen Listrik (PUIL)</strong>, dan <strong>Sistem 3 Fasa</strong>.</p>
                <p>• Setiap kartu materi memiliki tombol <span class="tut-chip"><i class="bi bi-book"></i> Baca Selengkapnya</span> untuk melihat teori mendalam serta anatomi bagian alat/komponen interaktif.</p>
                <p>• Kartu komponen juga menyediakan tombol <span class="tut-chip accent"><i class="bi bi-cpu"></i> Coba di Simulator</span> untuk langsung membuka contoh sirkuit terkait ke dalam kanvas perakitan.</p>
              </div>
            </div>
          </div>

          <!-- 13. Suara -->
          <div class="tut-card">
            <h4 class="tut-card-title"><i class="bi bi-volume-up-fill" style="color: var(--accent-color);"></i> 13. Efek Suara & Musik Latar</h4>
            <div class="tut-card-body">
              <div class="tut-illustration">
                <svg viewBox="0 0 280 115" width="100%" role="img" aria-label="Ilustrasi sistem audio aplikasi: efek suara interaktif SFX dan musik instrumen latar BGM dengan kontrol volume">
                  <!-- Sisi Kiri: SFX (Suara Saklar, Kabel, Peringatan) -->
                  <g transform="translate(20, 12)">
                    <rect x="0" y="0" width="112" height="52" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="24" y="24" font-size="16">🔊</text>
                    <!-- Gelombang Suara -->
                    <path d="M 42 16 Q 48 22 42 28" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round"/>
                    <path d="M 48 12 Q 56 22 48 32" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round"/>
                    <text x="76" y="22" fill="var(--text-primary)" font-size="8" font-weight="800">Efek Suara (SFX)</text>
                    <text x="12" y="42" fill="var(--text-muted)" font-size="6.5" font-weight="600">Klik saklar, buzzer trip, nada lulus</text>
                  </g>

                  <!-- Sisi Kanan: BGM (Musik Latar) -->
                  <g transform="translate(148, 12)">
                    <rect x="0" y="0" width="112" height="52" rx="6" fill="var(--bg-secondary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    <text x="24" y="24" font-size="16">🎵</text>
                    <text x="44" y="20" font-size="11" fill="var(--accent-color)">♩ ♪ ♫</text>
                    <text x="76" y="22" fill="var(--text-primary)" font-size="8" font-weight="800">Musik Latar (BGM)</text>
                    <text x="12" y="42" fill="var(--text-muted)" font-size="6.5" font-weight="600">Instrumen latar kerja fokus lab</text>
                  </g>

                  <!-- Kontrol Slider & Toggle di Bawah -->
                  <g transform="translate(20, 74)">
                    <rect x="0" y="0" width="240" height="28" rx="6" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1.2"/>
                    
                    <!-- Ikon Speaker Kecil -->
                    <text x="16" y="18" fill="var(--text-muted)" font-size="10">🔉</text>
                    
                    <!-- Baris Slider Volume -->
                    <rect x="34" y="12" width="130" height="5" rx="2.5" fill="var(--bg-tertiary)"/>
                    <rect x="34" y="12" width="95" height="5" rx="2.5" fill="var(--accent-color)"/>
                    <circle cx="129" cy="14.5" r="7" fill="var(--accent-color)" stroke="var(--bg-primary)" stroke-width="1.5"/>
                    
                    <text x="180" y="18" fill="var(--text-primary)" font-size="7.5" font-weight="700">75%</text>

                    <!-- Badge Sakelar ON -->
                    <rect x="195" y="6" width="38" height="16" rx="8" fill="var(--accent-color)"/>
                    <circle cx="225" cy="14" r="6" fill="#0f172a"/>
                    <text x="208" y="17" fill="#0f172a" font-size="6.5" font-weight="900">ON</text>
                  </g>
                </svg>
              </div>
              <div class="tut-text">
                <p>Virtual Lab dilengkapi efek suara responsif untuk klik saklar, sambungan kabel, alarm korsleting, dan nada kelulusan (<span class="tut-chip"><i class="bi bi-volume-up-fill"></i> SFX</span>), serta musik instrumental latar (<span class="tut-chip"><i class="bi bi-music-note-beamed"></i> BGM</span>). Tingkat volume suara efek (SFX) serta sakelar nyala/mati dan volume musik latar dapat Anda sesuaikan pada seksi <strong>Pengaturan Dasar</strong> di bawah ini.</p>
              </div>
            </div>
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
