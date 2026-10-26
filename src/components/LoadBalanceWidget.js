// Interactive Load Balancing (Penyeimbangan Beban 3-Fasa) Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderLoadBalanceWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Nilai beban awal dalam Watt (rentang 0 - 2000W)
  let loadR = 800;
  let loadS = 850;
  let loadT = 820;

  function calculateBalancing() {
    const loads = [loadR, loadS, loadT];
    const maxLoad = Math.max(...loads);
    const minLoad = Math.min(...loads);
    const avgLoad = (loadR + loadS + loadT) / 3;

    // Persentase ketidakseimbangan terhadap rata-rata beban
    // Threshold PUIL/standard evaluasi: selisih > 20% dianggap tidak seimbang
    const diffPercent = avgLoad > 0 ? ((maxLoad - minLoad) / avgLoad) * 100 : 0;
    const isUnbalanced = diffPercent > 20;

    // Perkiraan arus netral (I_N) kasar akibat unbalance
    const approxNeutralWatt = Math.round(Math.abs(maxLoad - minLoad));

    return { maxLoad, minLoad, avgLoad, diffPercent, isUnbalanced, approxNeutralWatt };
  }

  function render() {
    const calc = calculateBalancing();

    // Tinggi batang bar chart (skala max 2000W = 100px)
    const hR = Math.min(100, Math.max(4, (loadR / 2000) * 100));
    const hS = Math.min(100, Math.max(4, (loadS / 2000) * 100));
    const hT = Math.min(100, Math.max(4, (loadT / 2000) * 100));

    container.innerHTML = `
      <div class="mcb-widget" style="padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
        <h4 style="margin: 0 0 6px 0; color: #f8fafc; text-align: center; font-size: 1rem;">
          <i class="bi bi-sliders" style="color: #10b981; margin-right: 6px;"></i>Simulasi Penyeimbangan Beban (Load Balancing) 3-Fasa
        </h4>
        <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 0.85rem; text-align: center;">
          Geser slider beban masing-masing fasa untuk mengamati kestabilan neraca beban dan dampaknya pada kawat netral:
        </p>

        <!-- Status Box Seimbang vs Tidak Seimbang -->
        <div style="
          background: ${calc.isUnbalanced ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
          border: 1px solid ${calc.isUnbalanced ? '#ef4444' : '#10b981'};
          border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; text-align: center;
        ">
          <div style="
            font-size: 0.92rem; font-weight: bold;
            color: ${calc.isUnbalanced ? '#ef4444' : '#10b981'};
            margin-bottom: 4px;
          ">
            ${calc.isUnbalanced ? '⚠️ Beban Tidak Seimbang (> 20% Selisih)' : '✅ Beban Seimbang Antar Fasa (Toleransi < 20%)'}
          </div>
          <div style="font-size: 0.8rem; color: #cbd5e1;">
            ${calc.isUnbalanced
              ? 'Arus balik kawat Netral meningkat! Pertimbangkan untuk memindahkan sebagian grup beban lampu ke fasa yang lebih ringan.'
              : 'Penyaluran arus simetris. Arus pada kawat Netral mendekati nol, trafo distribusi bekerja efisien dan dingin.'}
          </div>
        </div>

        <!-- Visualisasi Grafik Batang & Neraca 3 Lengan -->
        <div style="max-width: 360px; margin: 0 auto 14px auto;">
          <svg viewBox="0 0 300 150" style="width: 100%; display: block; background: #1e293b; border-radius: 10px; border: 1px solid #475569;">
            <!-- Batas Toleransi Ideal (Garis Horizontal Putus-putus Rata-rata) -->
            <line x1="20" y1="${120 - (calc.avgLoad / 2000) * 100}" x2="280" y2="${120 - (calc.avgLoad / 2000) * 100}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="275" y="${115 - (calc.avgLoad / 2000) * 100}" fill="#94a3b8" font-size="7.5" text-anchor="end">Rata-rata: ${Math.round(calc.avgLoad)}W</text>

            <!-- Batang Fasa R -->
            <rect x="50" y="${120 - hR}" width="40" height="${hR}" rx="4" fill="#ef4444" style="transition: all 0.2s;"/>
            <text x="70" y="135" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">Fasa R</text>
            <text x="70" y="${112 - hR}" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">${loadR}W</text>

            <!-- Batang Fasa S -->
            <rect x="130" y="${120 - hS}" width="40" height="${hS}" rx="4" fill="#facc15" style="transition: all 0.2s;"/>
            <text x="150" y="135" fill="#facc15" font-size="9" font-weight="bold" text-anchor="middle">Fasa S</text>
            <text x="150" y="${112 - hS}" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">${loadS}W</text>

            <!-- Batang Fasa T -->
            <rect x="210" y="${120 - hT}" width="40" height="${hT}" rx="4" fill="#38bdf8" style="transition: all 0.2s;"/>
            <text x="230" y="135" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">Fasa T</text>
            <text x="230" y="${112 - hT}" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">${loadT}W</text>

            <!-- Garis Alas Lantai -->
            <line x1="20" y1="120" x2="280" y2="120" stroke="#475569" stroke-width="2"/>
          </svg>
        </div>

        <!-- Kontrol Slider untuk 3 Fasa -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
          <!-- Slider R -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 2px;">
              <span style="color: #ef4444;">Beban Fasa R:</span>
              <span style="color: #f8fafc;">${loadR} Watt</span>
            </div>
            <input type="range" class="slider-load" id="range-load-r" min="0" max="2000" step="50" value="${loadR}" style="width: 100%; accent-color: #ef4444;"/>
          </div>

          <!-- Slider S -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 2px;">
              <span style="color: #facc15;">Beban Fasa S:</span>
              <span style="color: #f8fafc;">${loadS} Watt</span>
            </div>
            <input type="range" class="slider-load" id="range-load-s" min="0" max="2000" step="50" value="${loadS}" style="width: 100%; accent-color: #facc15;"/>
          </div>

          <!-- Slider T -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 2px;">
              <span style="color: #38bdf8;">Beban Fasa T:</span>
              <span style="color: #f8fafc;">${loadT} Watt</span>
            </div>
            <input type="range" class="slider-load" id="range-load-t" min="0" max="2000" step="50" value="${loadT}" style="width: 100%; accent-color: #38bdf8;"/>
          </div>
        </div>

        <!-- Tombol Contoh Preset -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
          <button id="btn-preset-balanced" class="btn-mcb-demo" style="font-size: 0.78rem; padding: 6px 12px;">
            Set Beban Seimbang (800W, 800W, 800W)
          </button>
          <button id="btn-preset-unbalanced" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.78rem; padding: 6px 12px;">
            Set Ekstrem Tidak Seimbang (1600W, 200W, 400W)
          </button>
        </div>
      </div>
    `;

    // Event listeners slider
    const inputR = container.querySelector('#range-load-r');
    const inputS = container.querySelector('#range-load-s');
    const inputT = container.querySelector('#range-load-t');

    if (inputR) {
      inputR.addEventListener('input', (e) => {
        loadR = parseInt(e.target.value, 10);
        render();
      });
    }

    if (inputS) {
      inputS.addEventListener('input', (e) => {
        loadS = parseInt(e.target.value, 10);
        render();
      });
    }

    if (inputT) {
      inputT.addEventListener('input', (e) => {
        loadT = parseInt(e.target.value, 10);
        render();
      });
    }

    const btnBal = container.querySelector('#btn-preset-balanced');
    if (btnBal) {
      btnBal.addEventListener('click', () => {
        playUIClick();
        loadR = 800;
        loadS = 800;
        loadT = 800;
        render();
      });
    }

    const btnUnbal = container.querySelector('#btn-preset-unbalanced');
    if (btnUnbal) {
      btnUnbal.addEventListener('click', () => {
        playUIClick();
        loadR = 1600;
        loadS = 200;
        loadT = 400;
        render();
      });
    }
  }

  render();
}
