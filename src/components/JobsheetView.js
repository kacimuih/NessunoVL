// Jobsheet View & Workspace Component - Virtual Lab IPL

import { jobsheetData } from '../data/jobsheetData.js';
import { updateState, state, navigate, saveProgress, undo, redo, pushHistory, store, initPowerSource } from '../main.js';
import { validateJobsheet } from '../utils/jobsheetValidator.js';
import { detectAllErrors, diagnoseCircuit } from '../utils/circuitEvaluator.js';
import { playBeep, playSuccess, playError, playWarning, playShortCircuit, playUIClick } from '../utils/audioFeedback.js';
import { showConfirmDialog } from '../utils/appDialog.js';
import { renderLabCanvas, getAvailablePaletteItems, applyViewportTransform, fitToView } from './LabCanvas.js';
import { getPaletteThumbnail } from '../data/realisticAssets.js';


// Session memory for active tab per jobsheet
const _jobsheetTabMemory = new Map();

export function renderJobsheetView() {
  const container = document.getElementById('app');
  
  // CASE 1: If currentView is 'jobsheet' and no specific jobsheet is active, show the jobsheet selection grid
  if (state.currentView === 'jobsheet' && !state.activeJobsheetId) {
    renderJobsheetSelectionList(container);
    return;
  }

  // CASE 2: Active jobsheet workspace (or Free Mode)
  const isFreeMode = state.currentView === 'canvas_free';
  const js = isFreeMode ? null : jobsheetData.find(j => j.id === state.activeJobsheetId);
  if (!isFreeMode && !js) {
    renderJobsheetSelectionList(container);
    return;
  }

  if (!isFreeMode && state.activeJobsheetId) {
    if (!_jobsheetTabMemory.has(state.activeJobsheetId)) {
      const isLandscapeMobile = window.matchMedia('(max-width: 768px) and (orientation: landscape) and (max-height: 520px)').matches;
      _jobsheetTabMemory.set(state.activeJobsheetId, isLandscapeMobile);
      state.instructionCollapsed = isLandscapeMobile;
    } else {
      state.instructionCollapsed = !!_jobsheetTabMemory.get(state.activeJobsheetId);
    }
  }
  const isInstructionCollapsed = !isFreeMode && !!state.instructionCollapsed;
  const progress = state.jobsheetProgress[state.activeJobsheetId] || 'todo';

  // Proactively detect all fatal errors across all switch combinations
  if (!state.canvas.isSimulating) {
    state.canvas.blockingErrors = detectAllErrors(state.canvas);
  } else {
    state.canvas.blockingErrors = [];
  }
  const blockingErrors = state.canvas.blockingErrors || [];
  const isBlocked = !state.canvas.isSimulating && blockingErrors.length > 0;

  // Sync canvas alerts so highlights and HUD reflect the CURRENT state
  if (!state.canvas.isSimulating) {
    state.canvas.alerts = isBlocked ? blockingErrors : [];
  }

  const fullTitle  = isFreeMode ? 'Mode Merakit Bebas' : js.title;
  const shortTitle = isFreeMode ? 'Rakit Bebas' : ((js.title.match(/^Jobsheet\s+\d+/i) || [js.title])[0]);

  let html = `
    <!-- Top Workspace Navbar -->
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-back-to-list" title="${isFreeMode ? 'Kembali ke Beranda' : 'Kembali ke Daftar Latihan'}" aria-label="Kembali">
          <i class="bi bi-arrow-left"></i><span class="btn-back-text"> ${isFreeMode ? 'Home' : 'Daftar Latihan'}</span>
        </button>
        ${!isFreeMode ? `
          <button class="btn-toolbar" id="btn-toggle-instruction" 
                  title="${isInstructionCollapsed ? 'Tampilkan Instruksi' : 'Sembunyikan Instruksi'}"
                  aria-label="${isInstructionCollapsed ? 'Tampilkan Instruksi' : 'Sembunyikan Instruksi'}">
            <i class="bi ${isInstructionCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}"></i>
          </button>
        ` : ''}
        <span class="nav-jobsheet-title" title="${fullTitle}">
          <span class="t-full">${fullTitle}</span><span class="t-short">${shortTitle}</span>
        </span>
      </div>
      
      <div class="nav-actions">
        <!-- Undo/Redo & Canvas Actions -->
        <button class="btn-toolbar" id="btn-undo" title="Undo (Ctrl+Z)" aria-label="Undo"><span class="btn-icon"><i class="bi bi-arrow-counterclockwise"></i></span><span class="btn-text"> Undo</span></button>
        <button class="btn-toolbar" id="btn-redo" title="Redo (Ctrl+Y)" aria-label="Redo"><span class="btn-icon"><i class="bi bi-arrow-clockwise"></i></span><span class="btn-text"> Redo</span></button>
        <button class="btn-toolbar" id="btn-clear" style="color: var(--color-error);" title="Reset Sirkuit" aria-label="Reset Sirkuit"><span class="btn-icon"><i class="bi bi-trash3"></i></span><span class="btn-text"> Reset</span></button>
        
        <div class="nav-divider" style="width: 1px; height: 24px; background: var(--border-color); margin: 0 2px;"></div>
        
        <!-- View Mode Segmented Control: Schematic vs Realistic -->
        <div class="view-mode-toggle">
          <button class="btn-view-mode ${state.canvas.viewMode !== 'realistic' ? 'active' : ''}" id="btn-view-schematic" title="Mode Simbol Wiring Diagram" aria-label="Mode Simbol Wiring Diagram">
            <i class="bi bi-diagram-3"></i><span class="btn-mode-text"> Wiring</span>
          </button>
          <button class="btn-view-mode ${state.canvas.viewMode === 'realistic' ? 'active' : ''}" id="btn-view-realistic" title="Mode Foto Komponen Realistis" aria-label="Mode Foto Komponen Realistis">
            <i class="bi bi-camera"></i><span class="btn-mode-text"> Realistis</span>
          </button>
        </div>

        <div class="nav-divider" style="width: 1px; height: 24px; background: var(--border-color); margin: 0 2px;"></div>

        <!-- Simulation Toggle Switch -->
        <button class="btn-toolbar ${state.canvas.isSimulating ? 'btn-stop active' : 'btn-primary-action'}" 
                id="btn-toggle-sim" 
                style="font-weight: 700;"
                title="${state.canvas.isSimulating ? 'Stop Simulasi' : (isBlocked ? 'Simulasikan (ada kesalahan terdeteksi)' : 'Simulasikan')}"
                aria-label="${state.canvas.isSimulating ? 'Hentikan simulasi' : 'Simulasikan'}">
          <span class="btn-icon"><i class="bi ${state.canvas.isSimulating ? 'bi-stop-fill' : 'bi-play-fill'}"></i></span><span class="btn-text"> ${state.canvas.isSimulating ? 'Stop' : 'Simulasikan'}</span>
        </button>


        ${!isFreeMode ? `
          <button class="btn-toolbar btn-accent-outline" id="btn-validate" style="font-weight:700;" title="Pengecekan Rangkaian" aria-label="Pengecekan Rangkaian">
            <span class="btn-icon"><i class="bi bi-check-circle-fill"></i></span><span class="btn-text"> Pengecekan Rangkaian</span>
          </button>
        ` : `
          <button class="btn-toolbar" id="btn-check-free" style="font-weight:700;" title="Cek Kesalahan Rangkaian" aria-label="Cek Kesalahan Rangkaian">
            <span class="btn-icon"><i class="bi bi-search"></i></span><span class="btn-text"> Cek Kesalahan</span>
          </button>
        `}
      </div>
    </nav>

    ${!isFreeMode ? `
      <!-- Mobile Tabs (Screens <= 768px) -->
      <div class="mobile-tabs" role="tablist" aria-label="Tampilan">
        <button role="tab" id="tab-instr" aria-selected="${!isInstructionCollapsed}" aria-controls="panel-instr" style="touch-action: manipulation;">
          <i class="bi bi-journal-text"></i> Instruksi
        </button>
        <button role="tab" id="tab-canvas" aria-selected="${isInstructionCollapsed}" aria-controls="panel-canvas" style="touch-action: manipulation;">
          <i class="bi bi-diagram-3"></i> Kanvas
        </button>
      </div>
    ` : ''}

    <!-- Split Workspace -->
    <div class="jobsheet-workspace ${isInstructionCollapsed ? 'instruction-collapsed' : ''} ${isFreeMode ? 'is-free-mode' : ''}">


      
      <!-- Left instruction panel (Hidden in Free Mode) -->
      ${!isFreeMode ? `
        <aside class="jobsheet-instruction-panel" id="panel-instr" style="border-right: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div style="display:flex; justify-content: space-between; align-items:center;">
            <h3>Instruksi Praktik</h3>
            <span class="jobsheet-badge ${progress === 'done' ? 'done' : 'todo'}">
              ${progress === 'done' ? '<i class="bi bi-check-lg"></i> LULUS' : 'BELUM SELESAI'}
            </span>
          </div>
          
          <div>
            <h4 style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 4px;">Tujuan Pembelajaran:</h4>
            <p>${js.competency}</p>
          </div>

          <div>
            <h4 style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 4px;">Alat & Bahan Yang Dibutuhkan:</h4>
            <ul style="margin-left: 16px; font-size: 0.85rem;">
              ${js.toolsAndMaterials.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>

          <div style="flex: 1;">
            <h4 style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 4px;">Langkah Kerja:</h4>
            <ol style="margin-left: 16px; font-size: 0.85rem; display:flex; flex-direction:column; gap:8px;">
              ${js.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
          </div>

          <!-- Functional Check Status Info -->
          <div class="validation-box ${(() => {
            const v = state.jobsheetValidation[state.activeJobsheetId];
            if (!v || !v.checked) return '';
            return v.success ? 'success' : 'error';
          })()}" id="jobsheet-validation-status">
            <p style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px;">Status Kelayakan:</p>
            <p style="font-size: 0.8rem; ${(() => {
              const v = state.jobsheetValidation[state.activeJobsheetId];
              if (!v || !v.checked) return 'color: var(--text-secondary);';
              return v.success ? 'color: var(--color-success);' : 'color: var(--color-error);';
            })()}" id="validation-msg">
              ${(() => {
                const v = state.jobsheetValidation[state.activeJobsheetId];
                if (!v || !v.checked) {
                  return 'Sirkuit belum dicek. Klik "Pengecekan Rangkaian" di pojok kanan atas setelah merangkai.';
                }
                if (v.success) {
                  return `<strong><i class="bi bi-check-circle-fill"></i> LULUS!</strong><br>${v.message}`;
                }
                return `<strong><i class="bi bi-x-circle-fill"></i> BELUM LULUS:</strong><br>${v.message}`;
              })()}
            </p>
          </div>

          <button type="button" class="mobile-cta" id="btn-start-build" style="touch-action: manipulation;">
            Mulai Merakit <i class="bi bi-arrow-right"></i>
          </button>
        </aside>
      ` : ''}

      <!-- Right Area: Component Palette + Canvas -->
      <main class="lab-container" id="panel-canvas">
        <div class="lab-workspace">
          
          <!-- Palette Sidebar -->
          <aside class="palette-panel" id="palette-drawer">
            <div class="palette-header">Palet Komponen</div>
            <div class="palette-items">
              ${getAvailablePaletteItems(state.activeJobsheetId).map(item => {
                const thumb = getPaletteThumbnail(item.type);
                return `
                  <div class="palette-item" data-type="${item.type}" draggable="true">
                    <div class="palette-item-icon ${!thumb ? 'is-fallback' : ''}" style="display:flex; align-items:center; justify-content:center;">
                      ${thumb ? `
                        <img src="${thumb}" alt="${item.name}" 
                             class="palette-thumb-img"
                             loading="lazy"
                             decoding="async"
                             width="36" height="36"
                             style="width: 36px; height: 36px; object-fit: contain; border-radius: 4px;"
                             onerror="this.style.display='none'; this.parentElement.classList.add('is-fallback'); this.nextElementSibling.style.display='inline';" />

                         <span style="display:none; font-size: 1.25rem;">${item.icon.startsWith('bi-') ? `<i class="bi ${item.icon}"></i>` : item.icon}</span>
                      ` : `
                        <span style="font-size: 1.25rem;">${item.icon.startsWith('bi-') ? `<i class="bi ${item.icon}"></i>` : item.icon}</span>
                      `}
                    </div>
                    <div class="palette-item-name">${item.name}</div>
                  </div>
                `;
              }).join('')}
            </div>

            
            <!-- Mobile Guide Note -->
            <div style="padding: 10px; font-size: 0.7rem; color: var(--text-muted); border-top: 1px solid var(--border-color);">
              <i class="bi bi-lightbulb"></i> Ketuk komponen lalu ketuk kanvas untuk menempatkan (HP/Touch).
            </div>
          </aside>

          <!-- Drawer Toggle for Mobile Viewports -->
          <button id="btn-toggle-palette" class="drawer-toggle" title="Palet Komponen" aria-label="Palet Komponen">
            <i class="bi bi-plus-lg"></i>
          </button>

          <!-- Preset Circuit Active Banner (when loaded from Materi) -->
          ${isFreeMode && state.canvas.activePreset ? `
            <div id="preset-active-banner" class="preset-active-banner" style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); z-index: 105; background: var(--bg-secondary); border: 1.5px solid var(--accent-color); padding: 6px 14px; border-radius: 20px; box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">
              <span><i class="bi bi-lightbulb-fill" style="color: #f59e0b;"></i> ${state.canvas.activePreset.label}</span>
              <button id="btn-clear-preset" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; transition: all 0.2s;">
                <i class="bi bi-x-lg"></i> Bersihkan & Mulai dari Kosong
              </button>
            </div>
          ` : ''}

          <!-- Simulation Blocked Alert Banner -->
          <div id="sim-blocked-banner" class="sim-blocked-banner" style="display:none;"></div>

          <!-- Main Canvas Area -->
          <div class="canvas-wrapper" id="canvas-container">
            <!-- Lab Canvas will render here dynamically -->
          </div>

          <!-- HUD Overlay for Simulation Alerts / Fault Warning Badges -->
          <div class="lab-alerts-overlay" id="alerts-overlay">
            <!-- Simulated Alerts render here -->
          </div>


          <!-- Canvas Zoom controls floating -->
          <div class="zoom-controls-floating">
            <button class="btn-toolbar" id="btn-zoom-in" title="Zoom In" aria-label="Perbesar Tampilan (Zoom In)">+</button>
            <button class="btn-toolbar" id="btn-zoom-out" title="Zoom Out" aria-label="Perkecil Tampilan (Zoom Out)">-</button>
            <button class="btn-toolbar ${state.canvas.showGrid !== false ? 'active' : ''}" id="btn-toggle-grid" title="Tampilkan grid" aria-label="Tampilkan grid" aria-pressed="${state.canvas.showGrid !== false}"><i class="bi bi-grid-3x3"></i></button>
            <button class="btn-toolbar ${state.canvas.snapToGrid !== false ? 'active' : ''}" id="btn-toggle-snap" title="Tempel ke grid" aria-label="Tempel ke grid" aria-pressed="${state.canvas.snapToGrid !== false}"><i class="bi bi-magnet"></i></button>
            <button class="btn-toolbar ${state.canvas.wireMode !== 'free' ? 'active' : ''}" id="btn-toggle-wiremode" title="Kabel siku-siku" aria-label="Kabel siku-siku" aria-pressed="${state.canvas.wireMode !== 'free'}"><i class="bi bi-arrow-return-right"></i></button>
            <button class="btn-toolbar" id="btn-zoom-fit" title="Zoom Fit" aria-label="Sesuaikan Ukuran Tampilan (Zoom Fit)">FIT</button>
          </div>
        </div>
      </main>
    </div>

  `;

  container.innerHTML = html;
  document.body.classList.toggle('canvas-active', isFreeMode || isInstructionCollapsed);

  // Render SVG Lab Canvas inside its wrapper
  renderLabCanvas(document.getElementById('canvas-container'));

  // Attach Event Listeners
  document.getElementById('btn-back-to-list').addEventListener('click', () => {
    playUIClick();
    document.body.classList.remove('canvas-active');
    if (isFreeMode) {
      navigate('home');
    } else {
      updateState({ activeJobsheetId: null }); // Go back to list selection
    }
  });

  // Canvas visibility helper & tab switching router
  const ensureCanvasVisible = () => {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer || !state.canvas.components.length) return;
    fitToView(canvasContainer);
  };

  const btnToggleInstruction = document.getElementById('btn-toggle-instruction');

  const switchToTab = (tabName) => {
    playUIClick();
    const workspace = document.querySelector('.jobsheet-workspace');
    if (!workspace) return;
    const isCollapsed = tabName === 'canvas';
    workspace.classList.toggle('instruction-collapsed', isCollapsed);
    state.instructionCollapsed = isCollapsed;
    if (state.activeJobsheetId) {
      _jobsheetTabMemory.set(state.activeJobsheetId, isCollapsed);
    }
    document.body.classList.toggle('canvas-active', isCollapsed);

    const tabInstr = document.getElementById('tab-instr');
    const tabCanvas = document.getElementById('tab-canvas');
    if (tabInstr) tabInstr.setAttribute('aria-selected', !isCollapsed);
    if (tabCanvas) tabCanvas.setAttribute('aria-selected', isCollapsed);

    if (btnToggleInstruction) {
      btnToggleInstruction.innerHTML = isCollapsed ? '<i class="bi bi-chevron-right"></i>' : '<i class="bi bi-chevron-left"></i>';
      btnToggleInstruction.title = isCollapsed ? 'Tampilkan Instruksi' : 'Sembunyikan Instruksi';
      btnToggleInstruction.setAttribute('aria-label', isCollapsed ? 'Tampilkan Instruksi' : 'Sembunyikan Instruksi');
    }

    if (!isCollapsed) {
      const panel = document.getElementById('panel-instr');
      if (panel) panel.scrollTop = 0;
    } else {
      window.dispatchEvent(new Event('resize'));
      ensureCanvasVisible();
    }
  };

  if (!isFreeMode) {
    const tabInstr = document.getElementById('tab-instr');
    if (tabInstr) {
      tabInstr.addEventListener('click', () => switchToTab('instr'));
    }
    const tabCanvas = document.getElementById('tab-canvas');
    if (tabCanvas) {
      tabCanvas.addEventListener('click', () => switchToTab('canvas'));
    }
    const btnStartBuild = document.getElementById('btn-start-build');
    if (btnStartBuild) {
      btnStartBuild.addEventListener('click', () => switchToTab('canvas'));
    }
  }

  // Toggle Instruction Panel Listener
  if (btnToggleInstruction && !isFreeMode) {
    btnToggleInstruction.addEventListener('click', () => {
      const workspace = document.querySelector('.jobsheet-workspace');
      const isCurrentlyCollapsed = workspace ? workspace.classList.contains('instruction-collapsed') : false;
      switchToTab(isCurrentlyCollapsed ? 'instr' : 'canvas');
    });
  }


  // Undo/Redo
  document.getElementById('btn-undo').addEventListener('click', undo);
  document.getElementById('btn-redo').addEventListener('click', redo);

  // Clear / Reset Canvas sirkuit
  // Reset canvas listener
  document.getElementById('btn-clear').addEventListener('click', async () => {
    const ok = await showConfirmDialog({
      title: 'Reset Sirkuit?',
      message: 'Semua komponen dan kabel akan dihapus dari kanvas kerja. Sumber listrik tetap dipertahankan.',
      confirmText: 'Ya, Reset',
      cancelText: 'Batal'
    });
    if (!ok) return;

    state.canvas.activePreset = null;
      state.canvas.components = state.canvas.components.filter(c => c.type.startsWith('Source_') || c.id.startsWith('src_')); // Keep power source
      if (!state.canvas.components.some(c => c.type === 'Source_1P' || c.type === 'Source_3P')) {
        initPowerSource(); // tipe sumber mengikuti Jobsheet (js8 = 3 fasa)
      }
      state.canvas.wires = [];
      state.canvas.isSimulating = false;
      state.canvas.selectedId = null;
      state.canvas.selectedType = null;
      state.canvas.alerts = [];
      state.canvas.blockingErrors = [];
      // Clear validation result so status returns to "belum dicek"
      if (state.activeJobsheetId) {
        state.jobsheetValidation[state.activeJobsheetId] = { checked: false, success: false, message: '' };
      }
      hideSimulationBlockedBanner();
      pushHistory();
      renderJobsheetView();
  });

  // Clear preset banner button listener
  const btnClearPreset = document.getElementById('btn-clear-preset');
  if (btnClearPreset) {
    btnClearPreset.addEventListener('click', () => {
      state.canvas.activePreset = null;
      state.canvas.components = state.canvas.components.filter(c => c.type.startsWith('Source_') || c.id.startsWith('src_'));
      if (!state.canvas.components.some(c => c.type === 'Source_1P' || c.type === 'Source_3P')) {
        initPowerSource(); // tipe sumber mengikuti Jobsheet (js8 = 3 fasa)
      }
      state.canvas.wires = [];
      state.canvas.isSimulating = false;
      state.canvas.selectedId = null;
      state.canvas.selectedType = null;
      state.canvas.alerts = [];
      state.canvas.blockingErrors = [];
      hideSimulationBlockedBanner();
      pushHistory();
      renderJobsheetView();
    });
  }


  // View Mode Switcher listeners (Schematic vs Realistic)
  const btnSchematic = document.getElementById('btn-view-schematic');
  const btnRealistic = document.getElementById('btn-view-realistic');

  if (btnSchematic) {
    btnSchematic.addEventListener('click', () => {
      playUIClick();
      if (state.canvas.viewMode !== 'schematic') {
        updateState(draft => {
          draft.canvas.viewMode = 'schematic';
        });
        saveProgress();
      }
    });
  }

  if (btnRealistic) {
    btnRealistic.addEventListener('click', () => {
      playUIClick();
      if (state.canvas.viewMode !== 'realistic') {
        updateState(draft => {
          draft.canvas.viewMode = 'realistic';
        });
        saveProgress();
      }
    });
  }


  // Banner helpers for simulation blocked notification
  function showSimulationBlockedBanner(errorCount) {
    const banner = document.getElementById('sim-blocked-banner');
    if (banner) {
      banner.innerHTML = `<span><i class="bi bi-x-octagon-fill" style="color: #ef4444; margin-right: 6px;"></i> <strong>Simulasi Ditolak</strong> — Ada <strong>${errorCount} kesalahan fatal</strong> yang harus diperbaiki dulu. Klik kartu peringatan untuk melihat lokasi komponen bermasalah.</span>`;
      banner.style.display = 'flex';
    }
  }

  function hideSimulationBlockedBanner() {
    const banner = document.getElementById('sim-blocked-banner');
    if (banner) {
      banner.style.display = 'none';
      banner.innerHTML = '';
    }
  }

  // Ensure banner is hidden on initial render (it now only appears inside the confirmation dialog)
  hideSimulationBlockedBanner();

  // ─── Confirmation Dialog Helper ──────────────────────────────────────────
  function showSimConfirmDialog(errorAlerts, onProceed) {
    // Remove any existing dialog first
    const existing = document.getElementById('sim-confirm-overlay');
    if (existing) existing.remove();

    const isShortCircuit = errorAlerts.some(a => a.id === 'short_circuit');

    const errorListHTML = errorAlerts.map(a => `
      <div style="display:flex; gap:8px; align-items:flex-start; padding:6px 0; border-bottom:1px solid var(--border-color);">
        <span style="font-size:1.1rem; flex-shrink:0;"><i class="bi ${a.type === 'error' ? 'bi-x-circle-fill' : 'bi-exclamation-triangle-fill'}" style="color:${a.type === 'error' ? '#ef4444' : '#f59e0b'};"></i></span>
        <div>
          <div style="font-weight:600; font-size:0.82rem; color:var(--text-primary);">${a.title || 'Kesalahan'}</div>
          <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">${(a.where || a.text || '').split('<br>')[0]}</div>
        </div>
      </div>
    `).join('');

    const overlay = document.createElement('div');
    overlay.id = 'sim-confirm-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9000;
      background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    `;

    overlay.innerHTML = `
      <div id="sim-confirm-dialog" style="
        background: var(--bg-primary);
        border: 1.5px solid var(--color-error);
        border-radius: 14px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        max-width: 480px;
        width: 100%;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        animation: sim-dialog-in 0.18s ease;
      ">
        <!-- Header -->
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.8rem; color:var(--color-error);"><i class="bi bi-exclamation-triangle-fill"></i></span>
          <div>
            <div style="font-weight:800; font-size:1rem; color:var(--color-error); line-height:1.3;">
              Peringatan: Ditemukan ${errorAlerts.length} Kesalahan pada Rangkaian
            </div>
          </div>
        </div>

        <!-- Error list -->
        <div style="background:var(--bg-secondary); border-radius:8px; padding:10px 12px; max-height:180px; overflow-y:auto;">
          ${errorListHTML}
        </div>

        <!-- Explanation -->
        <p style="font-size:0.83rem; color:var(--text-secondary); line-height:1.55; margin:0;">
          ${isShortCircuit
            ? '<i class="bi bi-lightning-charge-fill" style="color:var(--color-error); margin-right:4px;"></i> Rangkaian mengandung kondisi <strong style="color:var(--color-error);">hubung singkat (korsleting)</strong>. Menjalankan simulasi akan menunjukkan animasi MCB trip atau Sekring putus, lalu simulasi berhenti otomatis.'
            : '<i class="bi bi-search" style="margin-right:4px;"></i> Menjalankan simulasi dengan kondisi ini dapat mengakibatkan perilaku rangkaian yang salah atau berbahaya (disimulasikan). Anda tetap bisa melanjutkan untuk melihat konsekuensinya.'
          }
          <br><br>
          Anda bisa <strong>memperbaiki dulu</strong> sebelum mensimulasikan, atau <strong>tetap lanjutkan</strong> untuk melihat apa yang terjadi sebagai pembelajaran.
        </p>

        <!-- Action buttons -->
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
          <button id="sim-confirm-fix" style="
            padding: 9px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
            background: transparent; border: 1.5px solid var(--border-color);
            color: var(--text-primary); cursor: pointer;
            transition: background 0.15s;
          "><i class="bi bi-wrench-adjustable" style="margin-right:4px;"></i> Perbaiki Dulu</button>
          <button id="sim-confirm-proceed" style="
            padding: 9px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
            background: var(--color-error); border: none;
            color: #fff; cursor: pointer;
            transition: opacity 0.15s;
          "><i class="bi bi-lightning-charge-fill" style="margin-right:4px;"></i> Tetap Lanjutkan Simulasi</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close helpers
    const closeDialog = () => overlay.remove();

    document.getElementById('sim-confirm-fix').addEventListener('click', () => {
      closeDialog();
      // Leave canvas with error highlights — no simulation started
    });

    document.getElementById('sim-confirm-proceed').addEventListener('click', () => {
      closeDialog();
      onProceed();
    });

    // Click outside dialog to cancel
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDialog();
    });
  }

  // ─── Validation Result Dialog Modal Helper ──────────────────────────────────
  function showValidationResultDialog({ success, variant, title, message, errorAlerts = [], jobsheetTitle = '', confirmText, onFix }) {
    // Remove any existing dialog first (avoid duplicate popups)
    const existing = document.getElementById('validation-result-overlay');
    if (existing) {
      if (existing._dialogAC) {
        existing._dialogAC.abort();
      } else if (existing._handleKeyDown) {
        document.removeEventListener('keydown', existing._handleKeyDown);
      }
      existing.remove();
    }

    const dialogVariant = variant || (success ? 'success' : 'error');
    const isShortCircuit = errorAlerts.some(a => a.id === 'short_circuit');

    const overlay = document.createElement('div');
    overlay.id = 'validation-result-overlay';
    overlay.className = 'vr-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'vr-modal-title');

    const errorListHTML = (errorAlerts.length > 0) ? `
      <div class="vr-error-list">
        ${errorAlerts.map(a => `
          <div class="vr-error-item">
            <span class="vr-error-icon">
              <i class="bi ${a.type === 'error' ? 'bi-x-circle-fill' : 'bi-exclamation-triangle-fill'}" style="color:${a.type === 'error' ? 'var(--color-error)' : '#f59e0b'};"></i>
            </span>
            <div class="vr-error-content">
              <div class="vr-error-title">${a.title || 'Kesalahan'}</div>
              <div class="vr-error-loc">${(a.where || a.location || a.problem || a.text || '').split('<br>')[0]}</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '';

    if (dialogVariant === 'success') {
      overlay.innerHTML = `
        <div class="vr-dialog vr-success">
          <!-- Header -->
          <div class="vr-header">
            <span class="vr-icon"><i class="bi bi-check-circle-fill"></i></span>
            <div class="vr-title-group">
              <h3 class="vr-title" id="vr-modal-title">${title || 'Rangkaian Lulus Pengecekan!'}</h3>
              ${jobsheetTitle ? `<div class="vr-badge-jobsheet">${jobsheetTitle}</div>` : ''}
            </div>
          </div>

          <!-- Body -->
          <p class="vr-body">${message}</p>

          <!-- Actions -->
          <div class="vr-actions">
            <button id="vr-btn-close" class="vr-btn-secondary">
              <i class="bi bi-x-lg"></i> ${confirmText || 'Tutup'}
            </button>
          </div>
        </div>
      `;
    } else if (dialogVariant === 'warning') {
      overlay.innerHTML = `
        <div class="vr-dialog vr-warning">
          <!-- Header -->
          <div class="vr-header">
            <span class="vr-icon"><i class="bi bi-exclamation-triangle-fill"></i></span>
            <div class="vr-title-group">
              <h3 class="vr-title" id="vr-modal-title">${title || 'Peringatan Rangkaian'}</h3>
              ${jobsheetTitle ? `<div class="vr-badge-jobsheet">${jobsheetTitle}</div>` : ''}
            </div>
          </div>

          <!-- Body -->
          <p class="vr-body" style="font-weight: 600; color: var(--text-primary); margin: 0;">${message}</p>

          ${errorListHTML}

          <!-- Actions -->
          <div class="vr-actions">
            <button id="vr-btn-fix" class="vr-btn-primary-warning">
              <i class="bi bi-wrench-adjustable"></i> ${confirmText || 'Periksa Dulu'}
            </button>
          </div>
        </div>
      `;
    } else if (dialogVariant === 'info') {
      overlay.innerHTML = `
        <div class="vr-dialog vr-info">
          <!-- Header -->
          <div class="vr-header">
            <span class="vr-icon"><i class="bi bi-info-circle-fill"></i></span>
            <div class="vr-title-group">
              <h3 class="vr-title" id="vr-modal-title">${title || 'Informasi Rangkaian'}</h3>
              ${jobsheetTitle ? `<div class="vr-badge-jobsheet">${jobsheetTitle}</div>` : ''}
            </div>
          </div>

          <!-- Body -->
          <p class="vr-body" style="color: var(--text-primary); margin: 0;">${message}</p>

          <!-- Actions -->
          <div class="vr-actions">
            <button id="vr-btn-close" class="vr-btn-primary-info">
              <i class="bi bi-check-lg"></i> ${confirmText || 'Mengerti'}
            </button>
          </div>
        </div>
      `;
    } else {
      overlay.innerHTML = `
        <div class="vr-dialog vr-error">
          <!-- Header -->
          <div class="vr-header">
            <span class="vr-icon"><i class="bi bi-x-circle-fill"></i></span>
            <div class="vr-title-group">
              <h3 class="vr-title" id="vr-modal-title">${title || 'Belum Lulus Pengecekan'}</h3>
              ${jobsheetTitle ? `<div class="vr-badge-jobsheet">${jobsheetTitle}</div>` : ''}
            </div>
          </div>

          <!-- Body -->
          <p class="vr-body" style="font-weight: 600; color: var(--text-primary); margin: 0;">${message}</p>

          ${isShortCircuit ? `
            <div style="font-size:0.83rem; color:var(--color-error); background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:8px 12px; line-height:1.45;">
              <i class="bi bi-lightning-charge-fill" style="margin-right:4px;"></i> Rangkaian mengandung kondisi <strong>hubung singkat (korsleting)</strong>. Menjalankan simulasi akan memicu pengaman trip atau putus.
            </div>
          ` : ''}

          ${errorListHTML}

          <!-- Actions -->
          <div class="vr-actions">
            <button id="vr-btn-fix" class="vr-btn-primary-error">
              <i class="bi bi-wrench-adjustable"></i> ${confirmText || 'Perbaiki Dulu'}
            </button>
          </div>
        </div>
      `;
    }

    document.body.appendChild(overlay);

    const dialogAC = new AbortController();
    overlay._dialogAC = dialogAC;

    // Close helper
    const closeDialog = () => {
      dialogAC.abort();
      overlay.remove();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog();
        if ((dialogVariant === 'error' || dialogVariant === 'warning') && onFix) onFix();
      }
    };
    document.addEventListener('keydown', handleKeyDown, { signal: dialogAC.signal });

    // Click outside dialog to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        playUIClick();
        closeDialog();
        if ((dialogVariant === 'error' || dialogVariant === 'warning') && onFix) onFix();
      }
    });

    // Close button
    const btnClose = overlay.querySelector('#vr-btn-close');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        playUIClick();
        closeDialog();
      });
    }

    // Fix button
    const btnFix = overlay.querySelector('#vr-btn-fix');
    if (btnFix) {
      btnFix.addEventListener('click', () => {
        playUIClick();
        closeDialog();
        if (onFix) onFix();
      });
    }

    // Auto focus primary button
    setTimeout(() => {
      const primaryBtn = btnFix || btnClose;
      if (primaryBtn) primaryBtn.focus();
    }, 50);
  }

  // ─── Toggle Simulation State ──────────────────────────────────────────────
  document.getElementById('btn-toggle-sim').addEventListener('click', () => {
    const isCurrentlySimulating = state.canvas.isSimulating;
    
    if (!isCurrentlySimulating) {
      // PRE-SIMULATION CHECK: Detect all errors across ALL switch combinations
      const errorAlerts = detectAllErrors(state.canvas);
      
      if (errorAlerts.length > 0) {
        // Show errors on canvas so student can see highlights BEFORE deciding
        state.canvas.blockingErrors = errorAlerts;
        state.canvas.alerts = errorAlerts;
        updateState({ canvas: state.canvas });

        // Show confirmation dialog — let student decide
        showSimConfirmDialog(errorAlerts, () => {
          // Student chose to proceed — start simulation normally
          // Existing short-circuit / trip / blown logic will fire naturally during simulation
          playBeep(450, 0.08);
          hideSimulationBlockedBanner();
          updateState(draft => {
            draft.canvas.isSimulating = true;
            draft.canvas.blockingErrors = [];
            draft.canvas.alerts = [];
          });
        });
        return;
      }

      // No errors detected — safe to start simulation!
      playBeep(450, 0.08);
      hideSimulationBlockedBanner();

      updateState(draft => {
        draft.canvas.isSimulating = true;
        draft.canvas.blockingErrors = [];
        draft.canvas.alerts = [];
      });
    } else {
      // Turning OFF simulation
      playBeep(300, 0.08);
      hideSimulationBlockedBanner();

      updateState(draft => {
        draft.canvas.isSimulating = false;
        // Reset active dynamic states (keeps physical toggle positions)
        draft.canvas.components.forEach(c => {
          if (c.type === 'Lamp' || c.type === 'LampTL') c.state.on = false;
          if (c.type === 'Socket') c.state.on = false;
        });
        draft.canvas.alerts = [];
      });
    }
  });

  // Validate current circuit against jobsheet goals
  if (!isFreeMode) {
    document.getElementById('btn-validate').addEventListener('click', () => {
      const res = validateJobsheet(state.activeJobsheetId, state.canvas);
      
      // Proactively detect all errors to sync with simulation button
      const currentErrors = detectAllErrors(state.canvas);
      state.canvas.blockingErrors = currentErrors;

      const passed = res.success && currentErrors.length === 0;

      // --- PERSIST result in state BEFORE updateState (so re-render reads new value) ---
      state.jobsheetValidation[state.activeJobsheetId] = {
        checked: true,
        success: passed,
        message: res.message
      };

      const isShortCircuit = currentErrors.some(a => a.id === 'short_circuit');

      if (passed) {
        playSuccess(); // cheerful rising note

        // Update jobsheet progress status
        state.jobsheetProgress[state.activeJobsheetId] = 'done';
        saveProgress();
        hideSimulationBlockedBanner();
      } else {
        if (isShortCircuit) {
          playShortCircuit();
        } else {
          playError(); // failure buzz
        }
        if (currentErrors.length > 0) {
          state.canvas.alerts = currentErrors;
          showSimulationBlockedBanner(currentErrors.length);
        }
      }

      // Re-render canvas alerts, visual markers, AND validation status box
      updateState({ canvas: state.canvas });

      // Show Validation Result Modal Popup
      showValidationResultDialog({
        success: passed,
        message: res.message,
        errorAlerts: currentErrors,
        jobsheetTitle: js ? js.title : '',
        onFix: () => {
          // close popup, canvas tetap menampilkan highlight error
        }
      });
    });
  }

  // Check circuit faults in Free Mode (without jobsheet scoring)
  if (isFreeMode) {
    const btnCheckFree = document.getElementById('btn-check-free');
    if (btnCheckFree) {
      btnCheckFree.addEventListener('click', () => {
        const diag = diagnoseCircuit(state.canvas);
        const issues = [...diag.errors, ...diag.warnings];
        state.canvas.blockingErrors = diag.errors;
        state.canvas.alerts = issues;

        if (diag.notes && diag.notes.length > 0 && diag.errors.length === 0 && diag.warnings.length === 0) {
          showValidationResultDialog({
            variant: 'info',
            title: 'Informasi Rangkaian',
            message: diag.notes[0],
            confirmText: 'Mengerti',
            jobsheetTitle: 'Mode Merakit Bebas'
          });
        } else if (diag.errors.length > 0) {
          const isShort = diag.errors.some(a => a.id === 'short_circuit');
          if (isShort) {
            playShortCircuit();
          } else {
            playError();
          }
          showSimulationBlockedBanner(diag.errors.length);
          showValidationResultDialog({
            variant: 'error',
            title: `Ditemukan ${diag.errors.length} Kesalahan`,
            message: 'Rangkaian belum dapat disimulasikan dengan benar. Perbaiki kesalahan di bawah ini:',
            errorAlerts: diag.errors,
            confirmText: 'Perbaiki Rangkaian',
            jobsheetTitle: 'Mode Merakit Bebas',
            onFix: () => {}
          });
        } else if (diag.warnings.length > 0) {
          playWarning();
          showValidationResultDialog({
            variant: 'warning',
            title: `Peringatan: Ditemukan ${diag.warnings.length} Catatan`,
            message: 'Rangkaian dapat disimulasikan, tetapi ada catatan atau kabel yang perlu diperiksa:',
            errorAlerts: diag.warnings,
            confirmText: 'Periksa Rangkaian',
            jobsheetTitle: 'Mode Merakit Bebas',
            onFix: () => {}
          });
        } else {
          playSuccess();
          hideSimulationBlockedBanner();
          showValidationResultDialog({
            variant: 'success',
            title: 'Rangkaian Siap Disimulasikan!',
            message: 'Semua sambungan kabel dan polaritas komponen sudah benar. Anda dapat mengaktifkan simulasi.',
            jobsheetTitle: 'Mode Merakit Bebas'
          });
        }

        // Re-render canvas alerts and visual markers
        updateState({ canvas: state.canvas });
      });
    }
  }



  // Mobile Palette Slide-Out Drawer Toggle
  const btnTogglePalette = document.getElementById('btn-toggle-palette');
  const paletteDrawer = document.getElementById('palette-drawer');
  btnTogglePalette.addEventListener('click', () => {
    playUIClick();
    paletteDrawer.classList.toggle('open');
    btnTogglePalette.innerHTML = paletteDrawer.classList.contains('open') ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-plus-lg"></i>';
  });

  // Zoom & Grid & Snap bindings
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    state.canvas.zoom = parseFloat(Math.min(2.5, state.canvas.zoom + 0.15).toFixed(2));
    applyViewportTransform();
  });
  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    state.canvas.zoom = parseFloat(Math.max(0.4, state.canvas.zoom - 0.15).toFixed(2));
    applyViewportTransform();
  });
  document.getElementById('btn-zoom-fit').addEventListener('click', () => {
    fitToView();
  });

  const btnToggleGrid = document.getElementById('btn-toggle-grid');
  if (btnToggleGrid) {
    btnToggleGrid.addEventListener('click', () => {
      playUIClick();
      state.canvas.showGrid = state.canvas.showGrid === false ? true : false;
      store.set('showGrid', String(state.canvas.showGrid));
      const wrapper = document.getElementById('canvas-container');
      if (wrapper) wrapper.classList.toggle('grid-hidden', !state.canvas.showGrid);
      btnToggleGrid.setAttribute('aria-pressed', String(state.canvas.showGrid));
      btnToggleGrid.classList.toggle('active', state.canvas.showGrid);
    });
  }

  const btnToggleSnap = document.getElementById('btn-toggle-snap');
  if (btnToggleSnap) {
    btnToggleSnap.addEventListener('click', () => {
      playUIClick();
      state.canvas.snapToGrid = state.canvas.snapToGrid === false ? true : false;
      store.set('snapToGrid', String(state.canvas.snapToGrid));
      btnToggleSnap.setAttribute('aria-pressed', String(state.canvas.snapToGrid));
      btnToggleSnap.classList.toggle('active', state.canvas.snapToGrid);
    });
  }

  const btnToggleWireMode = document.getElementById('btn-toggle-wiremode');
  if (btnToggleWireMode) {
    btnToggleWireMode.addEventListener('click', () => {
      playUIClick();
      state.canvas.wireMode = state.canvas.wireMode === 'free' ? 'ortho' : 'free';
      store.set('wireMode', state.canvas.wireMode);
      const isOrtho = state.canvas.wireMode !== 'free';
      btnToggleWireMode.setAttribute('aria-pressed', String(isOrtho));
      btnToggleWireMode.classList.toggle('active', isOrtho);
    });
  }
}

// Render the grid selection view for structured jobsheets
function renderJobsheetSelectionList(container) {
  document.body.classList.remove('canvas-active');
  let html = `
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-back-home" title="Kembali ke Beranda" aria-label="Kembali ke Beranda">
          <i class="bi bi-arrow-left"></i><span class="btn-back-text"> Kembali</span>
        </button>
        <span class="nav-title">Daftar Jobsheet Latihan</span>
      </div>
      <div class="nav-actions">
        <span class="nav-meta">Latihan Terstruktur</span>
      </div>
    </nav>

    <div class="home-container jobsheet-selection-page">
      <header style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 1.8rem; font-weight:800; margin-bottom: 6px;">Evaluasi Praktikum Kelistrikan</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem;">Selesaikan 8 Jobsheet berikut secara berurutan untuk melatih kompetensi penerangan listrik Anda.</p>
      </header>

      <div class="home-grid" style="grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));">
  `;

  jobsheetData.forEach((js, index) => {
    const status = state.jobsheetProgress[js.id] || 'todo';
    const isDone = status === 'done';
    
    html += `
      <div class="menu-card" id="card-${js.id}" style="padding: 20px; min-height: 200px;">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom: 8px;">
          <span class="jobsheet-module-badge">MODUL ${index + 1}</span>
          <span class="jobsheet-badge ${isDone ? 'done' : 'todo'}">
            ${isDone ? '<i class="bi bi-check-lg"></i> LULUS' : 'BELUM'}
          </span>
        </div>
        
        <div class="menu-card-content" style="margin-bottom: 16px;">
          <h3 style="font-size: 1.05rem; line-height: 1.3; margin-bottom: 6px;">${js.title}</h3>
          <p style="font-size: 0.8rem; height: 60px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
            ${js.competency}
          </p>
        </div>

        <button class="btn-card" style="font-size:0.8rem;">
          <span>Mulai Merangkai</span>
          <span><i class="bi bi-arrow-right"></i></span>
        </button>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;


  container.innerHTML = html;

  // Add click events
  document.getElementById('btn-back-home').addEventListener('click', () => {
    playUIClick();
    navigate('home');
  });

  jobsheetData.forEach(js => {
    document.getElementById(`card-${js.id}`).addEventListener('click', () => {
      playUIClick();
      updateState({ activeJobsheetId: js.id });
    });
  });
}
