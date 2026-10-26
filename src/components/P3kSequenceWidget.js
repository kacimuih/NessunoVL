// Interactive Electrical Shock First Aid (P3K) Sequence Widget - Virtual Lab IPL
import { playUIClick, playError, playSuccess } from '../utils/audioFeedback.js';

export function renderP3kSequenceWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const p3kSteps = [
    {
      id: 'step_power',
      text: 'Putuskan Aliran Listrik (Matikan MCB / Pisahkan korban dengan isolator)',
      isCriticalFirst: true
    },
    {
      id: 'step_help',
      text: 'Panggil Bantuan Medis & Guru Pembimbing Segera',
      isCriticalFirst: false
    },
    {
      id: 'step_cpr',
      text: 'Periksa Kesadaran & Pernapasan (Lakukan RJP/CPR jika korban tak bernapas)',
      isCriticalFirst: false
    },
    {
      id: 'step_burn',
      text: 'Amankan Luka Bakar (Tutup dengan kain bersih steril tanpa salep sembarangan)',
      isCriticalFirst: false
    }
  ];

  let placedSteps = [];
  let availableSteps = [];
  let warningMessage = '';

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function init() {
    placedSteps = [];
    availableSteps = shuffle(p3kSteps);
    warningMessage = '';
  }

  init();

  function render() {
    const isCompleted = placedSteps.length === p3kSteps.length;

    container.innerHTML = `
      <div class="mcb-widget" style="padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
        <h4 style="margin: 0 0 6px 0; color: #f8fafc; text-align: center; font-size: 1rem;">
          <i class="bi bi-heart-pulse-fill" style="color: #ef4444; margin-right: 6px;"></i>Simulasi Prosedur P3K Sengatan Listrik
        </h4>
        <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 0.85rem; text-align: center;">
          Susun langkah penyelamatan korban tersengat listrik sesuai urutan prioritas yang benar:
        </p>

        <!-- Pesan Tegas Keselamatan Penolong -->
        ${warningMessage ? `
          <div style="
            background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; border-radius: 8px;
            padding: 10px 14px; margin-bottom: 12px; text-align: center; animation: pulse 0.5s;
          ">
            <p style="margin: 0; color: #fca5a5; font-weight: bold; font-size: 0.85rem;">
              ${warningMessage}
            </p>
          </div>
        ` : ''}

        <!-- Slot Urutan Terpasang -->
        <div style="background: #1e293b; border-radius: 8px; padding: 12px; margin-bottom: 14px; border: 1px dashed #475569;">
          <div style="font-size: 0.85rem; font-weight: bold; color: #cbd5e1; margin-bottom: 8px;">
            Alur Penyelamatan Pasien:
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${p3kSteps.map((correctStep, idx) => {
              const placed = placedSteps[idx];
              return `
                <div style="
                  display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px;
                  background: ${placed ? 'rgba(16, 185, 129, 0.15)' : '#0f172a'};
                  border: 1px solid ${placed ? '#10b981' : '#334155'};
                  color: ${placed ? '#34d399' : '#64748b'};
                  font-size: 0.85rem;
                ">
                  <span style="
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 24px; height: 24px; border-radius: 50%;
                    background: ${placed ? '#10b981' : '#334155'};
                    color: ${placed ? '#ffffff' : '#94a3b8'};
                    font-size: 0.8rem; font-weight: bold; flex-shrink: 0;
                  ">${idx + 1}</span>
                  <span style="flex: 1;">${placed ? placed.text : '<em>Pilih langkah berikutnya dari daftar di bawah...</em>'}</span>
                  ${placed ? '<i class="bi bi-check-lg" style="color: #10b981; font-weight: bold;"></i>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Pilihan Kartu Teracak -->
        ${availableSteps.length > 0 ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 6px;">Pilih langkah penyelamatan berikutnya:</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${availableSteps.map(step => `
                <button class="btn-p3k-card" data-step-id="${step.id}" style="
                  text-align: left; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 500;
                  background: #1e293b; color: #f1f5f9; border: 1px solid #475569; cursor: pointer;
                  transition: all 0.15s ease;
                ">
                  <i class="bi bi-hand-index-thumb" style="color: #ef4444; margin-right: 8px;"></i>${step.text}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${isCompleted ? `
          <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; border-radius: 8px; padding: 12px; margin-bottom: 12px; text-align: center;">
            <p style="margin: 0; color: #34d399; font-weight: bold; font-size: 0.95rem;">
              ✅ Prosedur Penyelamatan Sempurna!
            </p>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 0.8rem;">
              Dengan mendahulukan pemutusan arus listrik, penolong terhindar dari menjadi korban kedua (double victims), sehingga tindakan P3K dapat berjalan optimal.
            </p>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: center;">
          <button id="btn-p3k-reset" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.85rem; padding: 8px 16px;">
            <i class="bi bi-arrow-counterclockwise" style="margin-right: 4px;"></i>Ulangi Simulasi
          </button>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.btn-p3k-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const stepId = btn.getAttribute('data-step-id');
        const targetStep = p3kSteps[placedSteps.length];

        // Jika baru di langkah pertama dan siswa BUKAN memilih Putuskan Aliran Listrik:
        if (placedSteps.length === 0 && stepId !== 'step_power') {
          try { playError(); } catch (e) {}
          warningMessage = '⚠️ BAHAYA! Jangan sentuh korban dulu! Putuskan aliran listrik terlebih dahulu demi keselamatan penolong!';
          render();
          return;
        }

        // Pengecekan urutan umum
        if (stepId === targetStep.id) {
          playUIClick();
          warningMessage = '';
          const chosen = availableSteps.find(s => s.id === stepId);
          placedSteps.push(chosen);
          availableSteps = availableSteps.filter(s => s.id !== stepId);
          if (placedSteps.length === p3kSteps.length) {
            try { playSuccess(); } catch (e) {}
          }
          render();
        } else {
          try { playError(); } catch (e) {}
          warningMessage = 'Bukan langkah yang tepat untuk urutan ini. Prioritaskan tindakan yang paling mendesak!';
          render();
        }
      });
    });

    const resetBtn = container.querySelector('#btn-p3k-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playUIClick();
        init();
        render();
      });
    }
  }

  render();
}
