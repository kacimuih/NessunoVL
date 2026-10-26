// Interactive SOP Sequence Sorting Widget - Virtual Lab IPL
import { playUIClick, playError, playSuccess } from '../utils/audioFeedback.js';

export function renderSopSequenceWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categories = [
    {
      id: 'sebelum',
      title: '1. Sebelum Bekerja',
      steps: [
        'Pastikan MCB Pusat OFF & pasang LOTO (Lockout/Tagout)',
        'Gunakan tespen/multimeter memastikan nihil tegangan sisa',
        'Siapkan APD dan perkakas kerja berisolasi standar'
      ]
    },
    {
      id: 'saat',
      title: '2. Saat Bekerja',
      steps: [
        'Kenakan APD lengkap dan pastikan area tidak lembab/basah',
        'Lakukan perakitan tanpa tegangan',
        'Hindari menyentuh dua konduktor beda potensial bersamaan'
      ]
    },
    {
      id: 'setelah',
      title: '3. Setelah Bekerja',
      steps: [
        'Periksa kerapian sambungan & pastikan tiada kabel mengambang',
        'Bersihkan area kerja dari serpihan kawat tembaga',
        'Minta guru/instruktur memeriksa sebelum menyalakan MCB utama'
      ]
    }
  ];

  // State
  let currentCatIndex = 0; // 0: Sebelum, 1: Saat, 2: Setelah
  let completedCategories = [false, false, false];
  let placedSteps = []; // Langkah yang sudah benar ditempatkan untuk kategori aktif
  let poolSteps = []; // Sisa langkah yang masih diacak di pool

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initCategory(catIndex) {
    currentCatIndex = catIndex;
    placedSteps = [];
    poolSteps = shuffle(categories[catIndex].steps);
  }

  initCategory(0);

  function render() {
    const currentCat = categories[currentCatIndex];
    const isAllDone = completedCategories.every(c => c === true);

    container.innerHTML = `
      <div class="mcb-widget" style="padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
        <h4 style="margin: 0 0 8px 0; color: #f8fafc; text-align: center; font-size: 1rem;">
          <i class="bi bi-list-check" style="color: var(--accent-color); margin-right: 6px;"></i>Simulasi Urutan SOP Kerja Aman Kelistrikan
        </h4>
        <p style="margin: 0 0 14px 0; color: #94a3b8; font-size: 0.85rem; text-align: center;">
          Klik langkah-langkah kerja di bawah SESUAI URUTAN yang benar (dari tahap awal ke tahap akhir).
        </p>

        <!-- Tab Kategori -->
        <div style="display: flex; gap: 6px; margin-bottom: 14px; overflow-x: auto;">
          ${categories.map((cat, idx) => {
            const isCompleted = completedCategories[idx];
            const isCurrent = idx === currentCatIndex;
            return `
              <button class="btn-sop-tab" data-cat="${idx}" style="
                flex: 1; min-width: 90px; padding: 8px 6px; border-radius: 6px; font-size: 0.78rem; font-weight: 600;
                background: ${isCurrent ? '#3b82f6' : isCompleted ? '#065f46' : '#1e293b'};
                color: ${isCurrent || isCompleted ? '#ffffff' : '#94a3b8'};
                border: 1px solid ${isCurrent ? '#60a5fa' : isCompleted ? '#10b981' : '#475569'};
                cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;
              ">
                ${isCompleted ? '<i class="bi bi-check-circle-fill"></i>' : ''}
                <span>${cat.title.replace(/^\d+\.\s*/, '')}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Slot Urutan Terpasang (Drop / Placed Area) -->
        <div style="background: #1e293b; border-radius: 8px; padding: 12px; margin-bottom: 14px; border: 1px dashed #475569;">
          <div style="font-size: 0.85rem; font-weight: bold; color: #cbd5e1; margin-bottom: 8px;">
            Urutan Tahap: <span style="color: var(--accent-color);">${currentCat.title}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${currentCat.steps.map((correctStep, idx) => {
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
                    width: 22px; height: 22px; border-radius: 50%;
                    background: ${placed ? '#10b981' : '#334155'};
                    color: ${placed ? '#ffffff' : '#94a3b8'};
                    font-size: 0.75rem; font-weight: bold; flex-shrink: 0;
                  ">${idx + 1}</span>
                  <span style="flex: 1;">${placed || '<em>Klik kartu di bawah untuk mengisi urutan ini...</em>'}</span>
                  ${placed ? '<i class="bi bi-check-lg" style="color: #10b981; font-weight: bold;"></i>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Pool Kartu Pilihan Teracak -->
        ${poolSteps.length > 0 ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 6px;">Pilih langkah berikutnya:</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${poolSteps.map((step, idx) => `
                <button class="btn-sop-card" data-step="${step}" style="
                  text-align: left; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 500;
                  background: #1e293b; color: #f1f5f9; border: 1px solid #475569; cursor: pointer;
                  transition: all 0.15s ease;
                ">
                  <i class="bi bi-hand-index-thumb" style="color: var(--accent-color); margin-right: 8px;"></i>${step}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${completedCategories[currentCatIndex] ? `
          <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; text-align: center;">
            <p style="margin: 0; color: #34d399; font-weight: bold; font-size: 0.9rem;">
              ✅ Kategori ${currentCat.title} Berhasil Diurutkan!
            </p>
            ${currentCatIndex < 2 ? `
              <button id="btn-next-sop-cat" style="
                margin-top: 8px; padding: 6px 14px; background: #10b981; color: #fff; border: none;
                border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer;
              ">Lanjut ke Kategori Berikutnya ➡️</button>
            ` : ''}
          </div>
        ` : ''}

        ${isAllDone ? `
          <div style="background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; border-radius: 8px; padding: 12px; margin-bottom: 12px; text-align: center;">
            <p style="margin: 0; color: #60a5fa; font-weight: bold; font-size: 0.95rem;">
              🎉 Selamat! Seluruh SOP Sebelum, Saat, dan Sesudah Bekerja telah tersusun sempurna!
            </p>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: center; gap: 8px;">
          <button id="btn-sop-reset" class="btn-mcb-demo btn-mcb-demo-secondary" style="font-size: 0.85rem; padding: 8px 16px;">
            <i class="bi bi-arrow-counterclockwise" style="margin-right: 4px;"></i>Reset Urutan Kategori Ini
          </button>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.btn-sop-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        playUIClick();
        const catIdx = parseInt(tab.getAttribute('data-cat'), 10);
        if (!isNaN(catIdx)) {
          initCategory(catIdx);
          render();
        }
      });
    });

    container.querySelectorAll('.btn-sop-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const clickedStep = btn.getAttribute('data-step');
        const expectedNextStep = currentCat.steps[placedSteps.length];

        if (clickedStep === expectedNextStep) {
          playUIClick();
          placedSteps.push(clickedStep);
          poolSteps = poolSteps.filter(s => s !== clickedStep);
          if (placedSteps.length === currentCat.steps.length) {
            completedCategories[currentCatIndex] = true;
            try { playSuccess(); } catch (e) {}
          }
          render();
        } else {
          // Salah urutan: animasi getar / warna merah
          try { playError(); } catch (e) {}
          btn.style.borderColor = '#ef4444';
          btn.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          btn.style.color = '#fca5a5';
          btn.innerHTML = `<i class="bi bi-x-circle-fill" style="color: #ef4444; margin-right: 8px;"></i>Bukan urutan ini! Pikirkan urutan logisnya.`;
          setTimeout(() => {
            render();
          }, 900);
        }
      });
    });

    const nextBtn = container.querySelector('#btn-next-sop-cat');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        playUIClick();
        if (currentCatIndex < categories.length - 1) {
          initCategory(currentCatIndex + 1);
          render();
        }
      });
    }

    const resetBtn = container.querySelector('#btn-sop-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playUIClick();
        completedCategories[currentCatIndex] = false;
        initCategory(currentCatIndex);
        render();
      });
    }
  }

  render();
}
