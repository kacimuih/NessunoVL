// Interactive 3-Phase Voltage Measurement (Fasa-Netral vs Fasa-Fasa) Widget - Virtual Lab IPL
import { playUIClick } from '../utils/audioFeedback.js';

export function renderVoltageMeasureWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const points = [
    { id: 'R', label: 'Fasa R', color: '#ef4444', cx: 40, cy: 50, type: 'phase' },
    { id: 'S', label: 'Fasa S', color: '#facc15', cx: 100, cy: 50, type: 'phase' },
    { id: 'T', label: 'Fasa T', color: '#38bdf8', cx: 160, cy: 50, type: 'phase' },
    { id: 'N', label: 'Netral (N)', color: '#3b82f6', cx: 220, cy: 50, type: 'neutral' },
    { id: 'PE', label: 'Ground (PE)', color: '#10b981', cx: 280, cy: 50, type: 'earth' }
  ];

  let selected = []; // Array of point IDs, max 2 items

  function getMeasurementInfo() {
    if (selected.length < 2) {
      if (selected.length === 1) {
        return {
          voltage: '-- V',
          type: `Titik 1 dipilih: ${selected[0]}`,
          desc: 'Klik satu titik lagi untuk mengukur beda potensial (tegangan) di antara kedua titik.'
        };
      }
      return {
        voltage: '-- V',
        type: 'Belum ada titik dipilih',
        desc: 'Klik 2 titik lingkaran di atas untuk menempatkan probe multimeter pengukur tegangan.'
      };
    }

    const [p1, p2] = selected;
    const isPhase1 = ['R', 'S', 'T'].includes(p1);
    const isPhase2 = ['R', 'S', 'T'].includes(p2);

    if (p1 === p2) {
      return {
        voltage: '0 Volt',
        type: 'Titik yang Sama',
        desc: 'Mengukur pada titik yang sama menghasilkan beda potensial nol.'
      };
    }

    // Fasa ke Fasa (V_LL)
    if (isPhase1 && isPhase2) {
      return {
        voltage: '380 Volt AC',
        type: `Tegangan Fasa-Fasa (V_LL: ${p1}-${p2})`,
        desc: 'Tegangan diukur antara 2 fasa aktif dengan pergeseran sudut fase 120°. Rumus: V_LL = V_LN x √3 ≈ 220V x 1,732 ≈ 380V. Digunakan untuk beban industri/motor 3-fasa.'
      };
    }

    // Fasa ke Netral (V_LN)
    if ((isPhase1 && p2 === 'N') || (p1 === 'N' && isPhase2)) {
      const ph = isPhase1 ? p1 : p2;
      return {
        voltage: '220 Volt AC',
        type: `Tegangan Fasa-Netral (V_LN: ${ph}-N)`,
        desc: 'Tegangan standar 1-fasa antara penghantar fasa aktif dan kawat netral. Inilah tegangan 220V yang disuplai ke instalasi penerangan rumah tinggal/ruangan.'
      };
    }

    // Fasa ke Ground (PE)
    if ((isPhase1 && p2 === 'PE') || (p1 === 'PE' && isPhase2)) {
      const ph = isPhase1 ? p1 : p2;
      return {
        voltage: '220 Volt AC',
        type: `Tegangan Fasa-Ground (V_L-PE: ${ph}-PE)`,
        desc: 'Pada sistem TN-S atau TT yang dibumikan baik, beda potensial fasa ke tanah sama dengan fasa ke netral (220V).'
      };
    }

    // Netral ke Ground (PE)
    if ((p1 === 'N' && p2 === 'PE') || (p1 === 'PE' && p2 === 'N')) {
      return {
        voltage: '~0 Volt (Ideal)',
        type: 'Netral ke Ground (N-PE)',
        desc: 'Keduanya seharusnya berpotensial nol terhadap bumi. Nilai terukur normal biasanya 0V hingga maksimal <2V. Jika terukur tegangan tinggi (>5V), menandakan grounding buruk atau kawat netral putus (floating neutral)!'
      };
    }

    return { voltage: '0 V', type: 'Pengukuran', desc: '' };
  }

  function render() {
    const info = getMeasurementInfo();
    const pt1 = selected[0] ? points.find(p => p.id === selected[0]) : null;
    const pt2 = selected[1] ? points.find(p => p.id === selected[1]) : null;

    container.innerHTML = `
      <div class="mcb-widget" style="padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
        <h4 style="margin: 0 0 6px 0; color: #f8fafc; text-align: center; font-size: 1rem;">
          <i class="bi bi-speedometer2" style="color: #38bdf8; margin-right: 6px;"></i>Simulasi Pengukuran Multimeter 3-Fasa
        </h4>
        <p style="margin: 0 0 12px 0; color: #a8b6ca; font-size: 0.85rem; text-align: center;">
          Klik dua titik terminal di bawah ini untuk mengukur beda potensialnya:
        </p>

        <!-- Diagram Terminal & Kabel Probe SVG -->
        <div style="max-width: 360px; margin: 0 auto 12px auto;">
          <svg viewBox="0 0 320 120" style="width: 100%; display: block; background: #1e293b; border-radius: 10px; border: 1px solid #475569;">
            <!-- Jalur Rel Busbar Simbolik -->
            <rect x="20" y="85" width="280" height="24" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="160" y="101" fill="#a8b6ca" font-size="8" font-weight="bold" text-anchor="middle">TERMINAL REL DISTRIBUSI PHB</text>

            <!-- Garis Penghubung Probe Multimeter Jika 2 Titik Dipilih -->
            ${pt1 && pt2 ? `
              <path d="M ${pt1.cx} ${pt1.cy} Q ${(pt1.cx + pt2.cx) / 2} 10 ${pt2.cx} ${pt2.cy}"
                stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4,3" fill="none"
              />
            ` : ''}

            <!-- 5 Titik Terminal Klik -->
            ${points.map(pt => {
              const isSel = selected.includes(pt.id);
              const selIdx = selected.indexOf(pt.id);
              return `
                <g class="probe-target" data-pt-id="${pt.id}" style="cursor: pointer;">
                  <!-- Ring luar saat terpilih -->
                  ${isSel ? `
                    <circle cx="${pt.cx}" cy="${pt.cy}" r="18" fill="none" stroke="${selIdx === 0 ? '#ef4444' : '#38bdf8'}" stroke-width="2.5" stroke-dasharray="3,2"/>
                  ` : ''}
                  
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="12" fill="${pt.color}" stroke="#ffffff" stroke-width="1.5"/>
                  <text x="${pt.cx}" y="${pt.cy + 4}" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">${pt.id}</text>
                  <text x="${pt.cx}" y="${pt.cy + 25}" fill="#cbd5e1" font-size="8" font-weight="600" text-anchor="middle">${pt.label}</text>
                </g>
              `;
            }).join('')}
          </svg>
        </div>

        <!-- Panel Display Voltmeter Digital -->
        <div style="
          background: #020617; border: 2px solid #334155; border-radius: 8px;
          padding: 12px; margin-bottom: 12px; text-align: center;
        ">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 4px;">
            ${info.type}
          </div>
          <div style="
            font-family: monospace; font-size: 1.8rem; font-weight: bold;
            color: ${info.voltage.includes('380') ? '#f43f5e' : info.voltage.includes('220') ? '#38bdf8' : '#10b981'};
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
          ">
            ${info.voltage}
          </div>
        </div>

        <!-- Keterangan Teori Interaktif -->
        <p style="
          background: #1e293b; border-radius: 6px; padding: 10px 12px; margin: 0 0 12px 0;
          font-size: 0.83rem; color: #cbd5e1; line-height: 1.45; border-left: 3px solid var(--accent-color);
        ">
          ${info.desc}
        </p>

        <!-- Tombol Preset Pengujian Cepat & Reset -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
          <button class="btn-mcb-demo btn-preset-measure" data-pair="R,N" style="font-size: 0.78rem; padding: 6px 10px;">R - N (220V)</button>
          <button class="btn-mcb-demo btn-preset-measure" data-pair="R,S" style="font-size: 0.78rem; padding: 6px 10px;">R - S (380V)</button>
          <button class="btn-mcb-demo btn-preset-measure" data-pair="S,T" style="font-size: 0.78rem; padding: 6px 10px;">S - T (380V)</button>
          <button class="btn-mcb-demo btn-preset-measure" data-pair="N,PE" style="font-size: 0.78rem; padding: 6px 10px;">N - PE (~0V)</button>
          <button id="btn-measure-reset" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.78rem; padding: 6px 10px;">
            <i class="bi bi-arrow-counterclockwise"></i> Reset
          </button>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.probe-target').forEach(tgt => {
      tgt.addEventListener('click', () => {
        playUIClick();
        const ptId = tgt.getAttribute('data-pt-id');
        if (selected.includes(ptId)) {
          selected = selected.filter(id => id !== ptId);
        } else {
          if (selected.length >= 2) {
            selected = [ptId];
          } else {
            selected.push(ptId);
          }
        }
        render();
      });
    });

    container.querySelectorAll('.btn-preset-measure').forEach(btn => {
      btn.addEventListener('click', () => {
        playUIClick();
        const pair = btn.getAttribute('data-pair').split(',');
        selected = pair;
        render();
      });
    });

    const resetBtn = container.querySelector('#btn-measure-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playUIClick();
        selected = [];
        render();
      });
    }
  }

  render();
}
