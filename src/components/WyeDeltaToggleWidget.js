// Interactive Wye (Star) vs Delta (Mesh) Toggle & Comparison Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderWyeDeltaToggleWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let mode = 'wye'; // 'wye' | 'delta'

  function render() {
    const isWye = mode === 'wye';

    container.innerHTML = `
      <div class="mcb-widget" style="padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
        <h4 style="margin: 0 0 6px 0; color: #f8fafc; text-align: center; font-size: 1rem;">
          <i class="bi bi-diagram-3-fill" style="color: var(--accent-color); margin-right: 6px;"></i>Komparasi Sambungan Bintang (Wye / Y) vs Segitiga (Delta / Δ)
        </h4>

        <!-- Toggle Mode Buttons -->
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 14px;">
          <button id="btn-show-wye" class="btn-mcb-demo ${isWye ? '' : 'btn-mcb-demo-secondary'}" style="font-size: 0.85rem;">
            ⭐ Sambungan Bintang (Wye / Y)
          </button>
          <button id="btn-show-delta" class="btn-mcb-demo ${!isWye ? '' : 'btn-mcb-demo-secondary'}" style="font-size: 0.85rem;">
            🔺 Sambungan Segitiga (Delta / Δ)
          </button>
        </div>

        <!-- SVG Diagram Wye / Delta dengan Transisi Dinamis -->
        <div style="max-width: 340px; margin: 0 auto 14px auto;">
          <svg viewBox="0 0 280 200" style="width: 100%; display: block; background: #1e293b; border-radius: 10px; border: 1px solid #475569;">
            ${isWye ? `
              <!-- SAMBUNGAN WYE (Y) -->
              <!-- Titik Netral Pusat (N) -->
              <circle cx="140" cy="115" r="7" fill="#3b82f6" stroke="#93c5fd" stroke-width="2"/>
              <text x="140" y="119" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">N</text>
              <line x1="140" y1="115" x2="140" y2="175" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4,3"/>
              <text x="140" y="190" fill="#93c5fd" font-size="9" font-weight="bold" text-anchor="middle">Kawat Netral (N)</text>

              <!-- Kumparan Fasa R (Atas) -->
              <line x1="140" y1="115" x2="140" y2="35" stroke="#ef4444" stroke-width="3.5"/>
              <circle cx="140" cy="30" r="6" fill="#ef4444"/>
              <text x="140" y="20" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">Fasa R (L1)</text>
              <!-- Simbol Lilitan R -->
              <rect x="133" y="55" width="14" height="30" rx="3" fill="#f87171" stroke="#b91c1c" stroke-width="1"/>

              <!-- Kumparan Fasa S (Kiri Bawah) -->
              <line x1="140" y1="115" x2="65" y2="155" stroke="#facc15" stroke-width="3.5"/>
              <circle cx="60" cy="158" r="6" fill="#facc15"/>
              <text x="45" y="175" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">Fasa S</text>
              <!-- Simbol Lilitan S -->
              <rect x="90" y="125" width="28" height="14" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="1" transform="rotate(-30 104 132)"/>

              <!-- Kumparan Fasa T (Kanan Bawah) -->
              <line x1="140" y1="115" x2="215" y2="155" stroke="#38bdf8" stroke-width="3.5"/>
              <circle cx="220" cy="158" r="6" fill="#38bdf8"/>
              <text x="235" y="175" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Fasa T</text>
              <!-- Simbol Lilitan T -->
              <rect x="162" y="125" width="28" height="14" rx="3" fill="#7dd3fc" stroke="#0284c7" stroke-width="1" transform="rotate(30 176 132)"/>
            ` : `
              <!-- SAMBUNGAN DELTA (Δ) -->
              <!-- Segitiga 3 Kumparan Tertutup -->
              <!-- Garis Sisi R-S (Kiri) -->
              <line x1="140" y1="35" x2="60" y2="155" stroke="#ef4444" stroke-width="3.5"/>
              <!-- Garis Sisi S-T (Bawah) -->
              <line x1="60" y1="155" x2="220" y2="155" stroke="#facc15" stroke-width="3.5"/>
              <!-- Garis Sisi T-R (Kanan) -->
              <line x1="220" y1="155" x2="140" y2="35" stroke="#38bdf8" stroke-width="3.5"/>

              <!-- Simbol Lilitan di 3 Sisi -->
              <rect x="85" y="85" width="28" height="14" rx="3" fill="#f87171" stroke="#b91c1c" stroke-width="1" transform="rotate(56 99 92)"/>
              <rect x="126" y="148" width="28" height="14" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
              <rect x="167" y="85" width="28" height="14" rx="3" fill="#7dd3fc" stroke="#0284c7" stroke-width="1" transform="rotate(-56 181 92)"/>

              <!-- 3 Titik Sudut Terminal Luar -->
              <circle cx="140" cy="30" r="7" fill="#ef4444"/>
              <text x="140" y="20" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">Terminal R</text>

              <circle cx="55" cy="158" r="7" fill="#facc15"/>
              <text x="45" y="180" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">Terminal S</text>

              <circle cx="225" cy="158" r="7" fill="#38bdf8"/>
              <text x="235" y="180" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Terminal T</text>

              <!-- Tanpa Titik Netral -->
              <text x="140" y="110" fill="#94a3b8" font-size="9" font-style="italic" text-anchor="middle">Tanpa Titik Netral (N)</text>
            `}
          </svg>
        </div>

        <!-- Tabel Perbandingan Karakteristik -->
        <div style="
          background: #1e293b; border-radius: 8px; padding: 12px; margin-bottom: 12px;
          border-left: 3px solid ${isWye ? '#3b82f6' : '#f59e0b'};
        ">
          <div style="font-weight: bold; color: ${isWye ? '#60a5fa' : '#fde047'}; font-size: 0.9rem; margin-bottom: 6px;">
            Karakteristik ${isWye ? 'Sambungan Bintang (Wye / Y)' : 'Sambungan Segitiga (Delta / Δ)'}:
          </div>
          <ul style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 0.83rem; line-height: 1.5;">
            ${isWye ? `
              <li><strong>Titik Netral:</strong> Memiliki titik temu netral (N) di tengah kumparan.</li>
              <li><strong>Tegangan yang Dihasilkan:</strong> Dua level tegangan sekaligus: <strong>220V</strong> (Fasa-Netral) & <strong>380V</strong> (Fasa-Fasa).</li>
              <li><strong>Aplikasi Utama:</strong> Sangat ideal untuk sistem distribusi gedung dan instalasi penerangan perumahan karena menyediakan jalur kawat netral untuk beban 1-fasa.</li>
              <li><strong>Hubungan Matematis:</strong> $V_{LL} = \\sqrt{3} \\times V_{LN}$ dan $I_L = I_{ph}$.</li>
            ` : `
              <li><strong>Titik Netral:</strong> Tidak memiliki titik netral (hanya 3 kabel fasa).</li>
              <li><strong>Tegangan yang Dihasilkan:</strong> Hanya satu level tegangan antar fasa ($V_{LL} = V_{ph} = 380V$).</li>
              <li><strong>Aplikasi Utama:</strong> Sangat umum untuk menyuplai beban tenaga 3-fasa seimbang berdaya besar seperti motor induksi industri.</li>
              <li><strong>Hubungan Matematis:</strong> $V_L = V_{ph}$ dan $I_L = \\sqrt{3} \\times I_{ph}$. Arus fasa lebih kecil dibanding arus line.</li>
            `}
          </ul>
        </div>
      </div>
    `;

    // Event listeners
    const btnWye = container.querySelector('#btn-show-wye');
    const btnDelta = container.querySelector('#btn-show-delta');

    if (btnWye) {
      btnWye.addEventListener('click', () => {
        playUIClick();
        mode = 'wye';
        render();
      });
    }

    if (btnDelta) {
      btnDelta.addEventListener('click', () => {
        playUIClick();
        mode = 'delta';
        render();
      });
    }
  }

  render();
}
