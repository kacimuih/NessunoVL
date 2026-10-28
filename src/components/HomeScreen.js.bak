import { navigate } from '../main.js';
import { playUIClick } from '../utils/audioFeedback.js';

export function renderHomeScreen() {
  const container = document.getElementById('app');
  
  container.innerHTML = `
    <div class="home-container">
      <header class="home-header">
        <div style="font-size: 3.5rem; margin-bottom: 10px; color: var(--accent-color);"><i class="bi bi-lightning-charge-fill"></i></div>
        <h1>Virtual Laboratory</h1>
        <p style="font-size: 1.3rem; font-weight: 600; color: var(--accent-color); margin-bottom: 8px;">
          Instalasi Penerangan Listrik (IPL)
        </p>
        <p>Media Pendamping Pembelajaran Praktik Kelistrikan Interaktif Kelas XI TITL</p>
      </header>

      <main class="home-grid">
        <!-- Card 1: Materi -->
        <div class="menu-card" id="card-materi">
          <div class="menu-card-icon"><i class="bi bi-book"></i></div>
          <div class="menu-card-content">
            <h3>Teori Singkat</h3>
            <p>Pelajari konsep keselamatan kerja kelistrikan, alat-alat ukur kelistrikan, simbol standar PUIL, dan sistem kelistrikan 3-fasa.</p>
          </div>
          <button class="btn-card">
            <span>Buka Materi</span>
            <span><i class="bi bi-arrow-right"></i></span>
          </button>
        </div>

        <!-- Card 2: Jobsheet -->
        <div class="menu-card" id="card-jobsheet">
          <div class="menu-card-icon"><i class="bi bi-clipboard-check"></i></div>
          <div class="menu-card-content">
            <h3>Latihan Terstruktur</h3>
            <p>8 Jobsheet praktik terbimbing mulai dari rangkaian saklar tunggal dasar hingga pembagian grup beban panel distribusi 3-fasa.</p>
          </div>
          <button class="btn-card">
            <span>Mulai Praktik</span>
            <span><i class="bi bi-arrow-right"></i></span>
          </button>
        </div>

        <!-- Card 3: Free Mode -->
        <div class="menu-card" id="card-free">
          <div class="menu-card-icon"><i class="bi bi-tools"></i></div>
          <div class="menu-card-content">
            <h3>Merakit Bebas</h3>
            <p>Eksplorasi tanpa batas! Rancang sirkuit penerangan impian Anda, simulasikan aliran arus, dan uji sistem pengaman kelistrikan secara mandiri.</p>
          </div>
          <button class="btn-card">
            <span>Buka Kanvas</span>
            <span><i class="bi bi-arrow-right"></i></span>
          </button>
        </div>

        <!-- Card 4: Trouble Shoot -->
        <div class="menu-card" id="card-troubleshoot">
          <div class="menu-card-icon"><i class="bi bi-search"></i></div>
          <div class="menu-card-content">
            <h3>Trouble Shoot</h3>
            <p>Diagnosis dan perbaiki kesalahan pada rangkaian yang sudah terpasang, berdasarkan laporan keluhan seperti kondisi nyata di lapangan.</p>
          </div>
          <button class="btn-card">
            <span>Mulai Diagnosis</span>
            <span><i class="bi bi-arrow-right"></i></span>
          </button>
        </div>

        <!-- Card 5: Settings / Tutorial -->
        <div class="menu-card" id="card-settings">
          <div class="menu-card-icon"><i class="bi bi-gear-fill"></i></div>
          <div class="menu-card-content">
            <h3>Pengaturan & Tutorial</h3>
            <p>Pelajari panduan interaktif cara menggambar kabel dan menaruh komponen, ganti tema visual, dan atur volume suara notifikasi simulasi.</p>
          </div>
          <button class="btn-card">
            <span>Konfigurasi</span>
            <span><i class="bi bi-arrow-right"></i></span>
          </button>
        </div>
      </main>

      <footer style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 20px;">
        <p>&copy; 2026 Virtual Lab IPL - SMK Jurusan Teknik Instalasi Tenaga Listrik (TITL)</p>
      </footer>
    </div>
  `;

  // Attach navigation event listeners
  document.getElementById('card-materi').addEventListener('click', () => {
    playUIClick();
    navigate('materi');
  });
  document.getElementById('card-jobsheet').addEventListener('click', () => {
    playUIClick();
    navigate('jobsheet');
  });
  document.getElementById('card-free').addEventListener('click', () => {
    playUIClick();
    navigate('canvas_free');
  });
  document.getElementById('card-troubleshoot').addEventListener('click', () => {
    playUIClick();
    navigate('troubleshoot');
  });
  document.getElementById('card-settings').addEventListener('click', () => {
    playUIClick();
    navigate('settings');
  });
}
