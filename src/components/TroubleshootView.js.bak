// Trouble Shoot View & Workspace Component - Virtual Lab IPL
// Mode diagnosis dan perbaikan gangguan instalasi listrik berbasis laporan keluhan pelanggan

import { TROUBLESHOOT_SCENARIOS } from '../data/troubleshootData.js';
import { updateState, state, navigate, saveProgress, undo, redo, pushHistory, store } from '../main.js';
import { validateTroubleshoot } from '../utils/troubleshootValidator.js';
import { detectAllErrors } from '../utils/circuitEvaluator.js';
import { playBeep, playSuccess, playError, playWarning, playUIClick } from '../utils/audioFeedback.js';
import { showConfirmDialog } from '../utils/appDialog.js';
import { renderLabCanvas, getAvailablePaletteItems, applyViewportTransform, fitToView } from './LabCanvas.js';
import { getPaletteThumbnail } from '../data/realisticAssets.js';

// Session memory for active tab per troubleshoot scenario
const _troubleshootTabMemory = new Map();

export function renderTroubleshootView() {
  const container = document.getElementById('app');

  // CASE 1: No scenario selected — show scenario selection grid
  if (!state.activeTroubleshootId) {
    renderTroubleshootSelectionList(container);
    return;
  }

  // CASE 2: Active Trouble Shoot Workspace
  const scenario = TROUBLESHOOT_SCENARIOS.find(s => s.id === state.activeTroubleshootId);
  if (!scenario) {
    navigate('troubleshoot');
    return;
  }

  if (state.activeTroubleshootId) {
    if (!_troubleshootTabMemory.has(state.activeTroubleshootId)) {
      const isLandscapeMobile = window.matchMedia('(max-width: 768px) and (orientation: landscape) and (max-height: 520px)').matches;
      _troubleshootTabMemory.set(state.activeTroubleshootId, isLandscapeMobile);
      state.instructionCollapsed = isLandscapeMobile;
    } else {
      state.instructionCollapsed = !!_troubleshootTabMemory.get(state.activeTroubleshootId);
    }
  }
  const isInstructionCollapsed = !!state.instructionCollapsed;
  const progress = state.troubleshootProgress && state.troubleshootProgress[scenario.id] === 'done';

  // Ensure troubleshoot session state
  if (!state.troubleshootState) {
    state.troubleshootState = {
      currentHintIndex: 0,
      solutionRevealed: false
    };
  }

  // In Troubleshoot mode, do not show proactive blocking alert cards or component highlights
  state.canvas.blockingErrors = [];
  state.canvas.alerts = [];

  const fullTitle = scenario.title;
  const shortTitle = 'Trouble Shoot';

  let html = `
    <!-- Top Workspace Navbar -->
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-back-to-ts-list" title="Kembali ke Daftar Kasus" aria-label="Kembali ke Daftar Kasus">
          <i class="bi bi-arrow-left"></i><span class="btn-back-text"> Daftar Kasus</span>
        </button>
        <button class="btn-toolbar" id="btn-toggle-ts-instruction" 
                title="${isInstructionCollapsed ? 'Tampilkan Laporan' : 'Sembunyikan Laporan'}"
                aria-label="${isInstructionCollapsed ? 'Tampilkan Laporan' : 'Sembunyikan Laporan'}">
          <i class="bi ${isInstructionCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}"></i>
        </button>
        <span class="nav-jobsheet-title" title="${fullTitle}">
          <i class="bi bi-search" style="margin-right:4px;"></i><span class="t-full">${fullTitle}</span><span class="t-short">${shortTitle}</span>
        </span>
      </div>
      
      <div class="nav-actions">
        <!-- Undo/Redo & Canvas Actions -->
        <button class="btn-toolbar" id="btn-ts-undo" title="Undo (Ctrl+Z)" aria-label="Undo"><span class="btn-icon"><i class="bi bi-arrow-counterclockwise"></i></span><span class="btn-text"> Undo</span></button>
        <button class="btn-toolbar" id="btn-ts-redo" title="Redo (Ctrl+Y)" aria-label="Redo"><span class="btn-icon"><i class="bi bi-arrow-clockwise"></i></span><span class="btn-text"> Redo</span></button>
        <button class="btn-toolbar" id="btn-ts-reset" style="color: var(--color-error);" title="Reset Kasus Awal" aria-label="Reset Kasus Awal"><span class="btn-icon"><i class="bi bi-trash3"></i></span><span class="btn-text"> Reset</span></button>
        
        <div class="nav-divider" style="width: 1px; height: 24px; background: var(--border-color); margin: 0 2px;"></div>
        
        <!-- View Mode Segmented Control: Schematic vs Realistic -->
        <div class="view-mode-toggle">
          <button class="btn-view-mode ${state.canvas.viewMode !== 'realistic' ? 'active' : ''}" id="btn-ts-view-schematic" title="Mode Simbol Wiring Diagram" aria-label="Mode Simbol Wiring Diagram">
            <i class="bi bi-diagram-3"></i><span class="btn-mode-text"> Wiring</span>
          </button>
          <button class="btn-view-mode ${state.canvas.viewMode === 'realistic' ? 'active' : ''}" id="btn-ts-view-realistic" title="Mode Foto Komponen Realistis" aria-label="Mode Foto Komponen Realistis">
            <i class="bi bi-camera"></i><span class="btn-mode-text"> Realistis</span>
          </button>
        </div>

        <div class="nav-divider" style="width: 1px; height: 24px; background: var(--border-color); margin: 0 2px;"></div>

        <!-- Simulation Toggle Switch -->
        <button class="btn-toolbar ${state.canvas.isSimulating ? 'btn-stop active' : 'btn-primary-action'}" 
                id="btn-ts-toggle-sim" 
                style="font-weight: 700;"
                title="${state.canvas.isSimulating ? 'Stop Simulasi' : 'Simulasikan Rangkaian'}"
                aria-label="${state.canvas.isSimulating ? 'Hentikan simulasi' : 'Simulasikan'}">
          <span class="btn-icon"><i class="bi ${state.canvas.isSimulating ? 'bi-stop-fill' : 'bi-play-fill'}"></i></span><span class="btn-text"> ${state.canvas.isSimulating ? 'Stop' : 'Simulasikan'}</span>
        </button>

        <button class="btn-toolbar btn-accent-outline" id="btn-ts-validate" style="font-weight:700;" title="Validasi Perbaikan Rangkaian" aria-label="Validasi Perbaikan Rangkaian">
          <span class="btn-icon"><i class="bi bi-check-circle-fill"></i></span><span class="btn-text"> Validasi Perbaikan</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Tabs (Screens <= 768px) -->
    <div class="mobile-tabs" role="tablist" aria-label="Tampilan">
      <button role="tab" id="tab-instr" aria-selected="${!isInstructionCollapsed}" aria-controls="panel-instr" style="touch-action: manipulation;">
        <i class="bi bi-journal-text"></i> Laporan
      </button>
      <button role="tab" id="tab-canvas" aria-selected="${isInstructionCollapsed}" aria-controls="panel-canvas" style="touch-action: manipulation;">
        <i class="bi bi-diagram-3"></i> Kanvas
      </button>
    </div>

    <!-- Main Workspace Container -->
    <div class="jobsheet-workspace ${isInstructionCollapsed ? 'instruction-collapsed' : ''}">
      <!-- Left Panel: Trouble Shoot Investigation Panel -->
      <aside class="jobsheet-instruction-panel" id="panel-instr">
          
          <!-- Case Header & Badge -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:0.75rem; font-weight:800; background:rgba(245, 158, 11, 0.15); color:#f59e0b; padding:3px 8px; border-radius:4px; border:1px solid rgba(245, 158, 11, 0.3);">
              KASUS ${scenario.id.replace('ts_0', '#')}
            </span>
            <span class="jobsheet-badge ${progress ? 'done' : 'todo'}">
              ${progress ? '<i class="bi bi-check-lg"></i> TERPECAHKAN' : 'BELUM SELESAI'}
            </span>
          </div>

          <h2 style="font-size:1.25rem; font-weight:800; margin-bottom:14px; line-height:1.3; color:var(--text-primary);">
            ${scenario.title}
          </h2>

          <!-- Customer Report Quote Box -->
          <div class="troubleshoot-complaint-box" style="
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--accent-color);
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          ">
            <div style="font-size:0.78rem; font-weight:800; color:var(--accent-color); text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span><i class="bi bi-chat-quote-fill"></i> Laporan Keluhan Pelanggan:</span>
            </div>
            <p style="font-style: italic; font-size: 0.88rem; color: var(--text-primary); line-height: 1.55; margin: 0;">
              ${scenario.customerReport}
            </p>
          </div>

          <!-- Section 1: Progressive Hints -->
          <div style="margin-bottom: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:700; font-size:0.9rem; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <span><i class="bi bi-lightbulb-fill" style="color:#f59e0b;"></i></span> Petunjuk (Hint)
              </span>
              <span style="font-size:0.8rem; color:var(--text-muted);">
                ${state.troubleshootState.currentHintIndex} / ${scenario.hints.length} Terbuka
              </span>
            </div>

            <!-- Revealed Hints List -->
            <div id="hints-container" style="display:flex; flex-direction:column; gap:8px; margin-bottom:10px;">
              ${scenario.hints.slice(0, state.troubleshootState.currentHintIndex).map((hint, idx) => `
                <div style="
                  background: rgba(245, 158, 11, 0.08);
                  border: 1px solid rgba(245, 158, 11, 0.25);
                  border-radius: 6px;
                  padding: 10px 12px;
                  font-size: 0.84rem;
                  color: var(--text-primary);
                  line-height: 1.5;
                  animation: fadeIn 0.2s ease;
                ">
                  <div style="font-weight:700; font-size:0.75rem; color:#f59e0b; margin-bottom:3px;">
                    PETUNJUK #${idx + 1}:
                  </div>
                  <div>${hint}</div>
                </div>
              `).join('')}
            </div>

            <!-- Button to open next hint -->
            ${state.troubleshootState.currentHintIndex < scenario.hints.length ? `
              <button id="btn-reveal-hint" style="
                width: 100%;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px dashed var(--accent-color);
                background: transparent;
                color: var(--accent-color);
                font-weight: 700;
                font-size: 0.83rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: background 0.15s;
              ">
                <span><i class="bi bi-lightbulb"></i> Buka Petunjuk #${state.troubleshootState.currentHintIndex + 1}</span>
              </button>
            ` : `
              <div style="font-size:0.78rem; color:var(--text-muted); text-align:center; padding:4px;">
                Semua petunjuk sudah dibuka.
              </div>
            `}
          </div>

          <!-- Section 2: Solution Reveal -->
          <div style="margin-bottom: 24px; padding-top: 14px; border-top: 1px solid var(--border-color);">
            <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
              <span><i class="bi bi-key-fill" style="color:#22c55e;"></i></span> Solusi & Analisis
            </div>

            ${state.troubleshootState.solutionRevealed ? `
              <div style="
                background: rgba(34, 197, 94, 0.08);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                padding: 12px 14px;
                font-size: 0.84rem;
                color: var(--text-primary);
                line-height: 1.55;
              ">
                <div style="font-weight:700; color:#22c55e; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                  <span><i class="bi bi-search"></i> Titik Kerusakan Ditemukan:</span>
                </div>
                <div style="margin-bottom:8px;">${scenario.solution}</div>
                <div style="font-size:0.78rem; color:#f59e0b; display:flex; align-items:center; gap:4px;">
                  <span><i class="bi bi-stars"></i> Komponen terkait telah disorot dengan garis kuning di kanvas.</span>
                </div>
              </div>
            ` : `
              <button id="btn-open-solution-modal" style="
                width: 100%;
                padding: 9px 12px;
                border-radius: 6px;
                border: 1px solid var(--border-color);
                background: var(--bg-tertiary);
                color: var(--text-secondary);
                font-weight: 600;
                font-size: 0.83rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.15s;
              ">
                <span><i class="bi bi-unlock-fill"></i> Lihat Solusi</span>
              </button>
            `}
          </div>

          <!-- Section 3: Primary Validate Action Button -->
          <div style="margin-top: auto; padding-top: 12px;">
            <button id="btn-ts-sidebar-validate" class="btn-accent" style="
              width: 100%;
              padding: 11px 16px;
              border-radius: 8px;
              font-weight: 800;
              font-size: 0.92rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              cursor: pointer;
              box-shadow: var(--shadow-md);
            ">
              <span><i class="bi bi-check-circle-fill"></i> Validasi Perbaikan</span>
            </button>
          </div>

          <button type="button" class="mobile-cta" id="btn-start-ts" style="touch-action: manipulation;">
            Mulai Diagnosis <i class="bi bi-arrow-right"></i>
          </button>
      </aside>

      <!-- Right Area: Component Palette + Canvas -->
      <main class="lab-container" id="panel-canvas">
        <div class="lab-workspace">
          
          <!-- Palette Sidebar -->
          <aside class="palette-panel" id="palette-drawer">
            <div class="palette-header">Palet Komponen</div>
            <div class="palette-items">
              ${getAvailablePaletteItems(null).map(item => {
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
  document.body.classList.toggle('canvas-active', !!state.instructionCollapsed);

  // Render SVG Lab Canvas inside its wrapper
  renderLabCanvas(document.getElementById('canvas-container'));

  // ─── Attach Workspace Event Listeners ─────────────────────────────────────

  // Navigation: Back to selection list
  document.getElementById('btn-back-to-ts-list').addEventListener('click', () => {
    document.body.classList.remove('canvas-active');
    state.activeTroubleshootId = null;
    state.canvas.highlightedComponentIds = [];
    navigate('troubleshoot');
  });

  // Canvas visibility helper & tab switching router
  const ensureCanvasVisible = () => {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer || !state.canvas.components.length) return;
    fitToView(canvasContainer);
  };

  const btnToggleTsInstruction = document.getElementById('btn-toggle-ts-instruction');

  const switchToTab = (tabName) => {
    playUIClick();
    const ws = document.querySelector('.jobsheet-workspace');
    if (!ws) return;
    const isCollapsed = tabName === 'canvas';
    ws.classList.toggle('instruction-collapsed', isCollapsed);
    state.instructionCollapsed = isCollapsed;
    if (state.activeTroubleshootId) {
      _troubleshootTabMemory.set(state.activeTroubleshootId, isCollapsed);
    }
    document.body.classList.toggle('canvas-active', isCollapsed);

    const tabInstr = document.getElementById('tab-instr');
    const tabCanvas = document.getElementById('tab-canvas');
    if (tabInstr) tabInstr.setAttribute('aria-selected', !isCollapsed);
    if (tabCanvas) tabCanvas.setAttribute('aria-selected', isCollapsed);

    if (btnToggleTsInstruction) {
      btnToggleTsInstruction.innerHTML = isCollapsed ? '<i class="bi bi-chevron-right"></i>' : '<i class="bi bi-chevron-left"></i>';
      btnToggleTsInstruction.title = isCollapsed ? 'Tampilkan Laporan' : 'Sembunyikan Laporan';
      btnToggleTsInstruction.setAttribute('aria-label', isCollapsed ? 'Tampilkan Laporan' : 'Sembunyikan Laporan');
    }

    if (!isCollapsed) {
      const panel = document.getElementById('panel-instr');
      if (panel) panel.scrollTop = 0;
    } else {
      window.dispatchEvent(new Event('resize'));
      ensureCanvasVisible();
    }
  };

  const tabInstr = document.getElementById('tab-instr');
  if (tabInstr) {
    tabInstr.addEventListener('click', () => switchToTab('instr'));
  }
  const tabCanvas = document.getElementById('tab-canvas');
  if (tabCanvas) {
    tabCanvas.addEventListener('click', () => switchToTab('canvas'));
  }
  const btnStartTs = document.getElementById('btn-start-ts');
  if (btnStartTs) {
    btnStartTs.addEventListener('click', () => switchToTab('canvas'));
  }

  // Toggle instruction sidebar
  if (btnToggleTsInstruction) {
    btnToggleTsInstruction.addEventListener('click', () => {
      const ws = document.querySelector('.jobsheet-workspace');
      const isCurrentlyCollapsed = ws ? ws.classList.contains('instruction-collapsed') : false;
      switchToTab(isCurrentlyCollapsed ? 'instr' : 'canvas');
    });
  }

  // Undo / Redo
  document.getElementById('btn-ts-undo').addEventListener('click', () => undo());
  document.getElementById('btn-ts-redo').addEventListener('click', () => redo());

  // Reset to original scenario state
  document.getElementById('btn-ts-reset').addEventListener('click', async () => {
    const ok = await showConfirmDialog({
      title: 'Reset ke Kondisi Awal?',
      message: 'Semua editan Anda saat ini akan diulang dari awal.',
      confirmText: 'Ya, Reset',
      cancelText: 'Batal'
    });
    if (!ok) return;

    state.canvas.components = JSON.parse(JSON.stringify(scenario.initialComponents));
    state.canvas.wires = JSON.parse(JSON.stringify(scenario.initialWires));
    state.canvas.selectedId = null;
    state.canvas.selectedType = null;
    state.canvas.isSimulating = false;
    state.canvas.alerts = [];
    state.canvas.blockingErrors = [];
    state.canvas.highlightedComponentIds = state.troubleshootState.solutionRevealed ? scenario.faultHighlightIds : [];
    pushHistory();
    updateState({ canvas: state.canvas });
  });

  // View Mode: Schematic vs Realistic
  document.getElementById('btn-ts-view-schematic').addEventListener('click', () => {
    if (state.canvas.viewMode !== 'schematic') {
      updateState(draft => { draft.canvas.viewMode = 'schematic'; });
      saveProgress();
    }
  });

  document.getElementById('btn-ts-view-realistic').addEventListener('click', () => {
    if (state.canvas.viewMode !== 'realistic') {
      updateState(draft => { draft.canvas.viewMode = 'realistic'; });
      saveProgress();
    }
  });

  // Reveal next hint
  const btnRevealHint = document.getElementById('btn-reveal-hint');
  if (btnRevealHint) {
    btnRevealHint.addEventListener('click', () => {
      playUIClick();
      state.troubleshootState.currentHintIndex = (state.troubleshootState.currentHintIndex || 0) + 1;
      updateState();
    });
  }

  // Open Solution confirmation modal
  const btnOpenSolution = document.getElementById('btn-open-solution-modal');
  if (btnOpenSolution) {
    btnOpenSolution.addEventListener('click', () => {
      playUIClick();
      showSolutionConfirmModal(scenario, () => {
        state.troubleshootState.solutionRevealed = true;
        state.canvas.highlightedComponentIds = scenario.faultHighlightIds;
        playWarning();
        updateState({ canvas: state.canvas });
      });
    });
  }

  // Validation function
  const handleValidate = () => {
    const res = validateTroubleshoot(scenario.id, state.canvas);
    if (res.success) {
      playSuccess();
      state.troubleshootProgress = state.troubleshootProgress || {};
      state.troubleshootProgress[scenario.id] = 'done';
      saveProgress();
      showValidationSuccessModal(scenario, res.message);
    } else {
      playError();
      showValidationFailedModal(res.message);
    }
  };

  document.getElementById('btn-ts-validate').addEventListener('click', handleValidate);
  const btnSidebarValidate = document.getElementById('btn-ts-sidebar-validate');
  if (btnSidebarValidate) btnSidebarValidate.addEventListener('click', handleValidate);

  // Simulation Toggle
  document.getElementById('btn-ts-toggle-sim').addEventListener('click', () => {
    if (!state.canvas.isSimulating) {
      const errorAlerts = detectAllErrors(state.canvas);
      if (errorAlerts.length > 0) {
        showSimConfirmDialog(errorAlerts, () => {
          playBeep(450, 0.08);
          updateState(draft => {
            draft.canvas.isSimulating = true;
            draft.canvas.blockingErrors = [];
            draft.canvas.alerts = [];
          });
        });
        return;
      }

      playBeep(450, 0.08);
      updateState(draft => {
        draft.canvas.isSimulating = true;
        draft.canvas.blockingErrors = [];
        draft.canvas.alerts = [];
      });
    } else {
      playBeep(300, 0.08);
      updateState(draft => {
        draft.canvas.isSimulating = false;
        draft.canvas.components.forEach(c => {
          if (c.type === 'Lamp' || c.type === 'LampTL') c.state.on = false;
          if (c.type === 'Socket') c.state.on = false;
        });
        draft.canvas.alerts = [];
        draft.canvas.blockingErrors = [];
      });
    }
  });

  // Mobile Palette Slide-Out Drawer Toggle
  const btnTogglePalette = document.getElementById('btn-toggle-palette');
  const paletteDrawer = document.getElementById('palette-drawer');
  if (btnTogglePalette && paletteDrawer) {
    btnTogglePalette.addEventListener('click', () => {
      paletteDrawer.classList.toggle('open');
      btnTogglePalette.innerHTML = paletteDrawer.classList.contains('open') ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-plus-lg"></i>';
    });
  }

  // Zoom & Grid & Snap bindings
  const btnZoomIn = document.getElementById('btn-zoom-in');
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      state.canvas.zoom = parseFloat(Math.min(2.5, state.canvas.zoom + 0.15).toFixed(2));
      applyViewportTransform();
    });
  }
  const btnZoomOut = document.getElementById('btn-zoom-out');
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      state.canvas.zoom = parseFloat(Math.max(0.4, state.canvas.zoom - 0.15).toFixed(2));
      applyViewportTransform();
    });
  }
  const btnZoomFit = document.getElementById('btn-zoom-fit');
  if (btnZoomFit) {
    btnZoomFit.addEventListener('click', () => {
      fitToView();
    });
  }

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

// ─── Scenario Selection List ────────────────────────────────────────────────

function renderTroubleshootSelectionList(container) {
  document.body.classList.remove('canvas-active');
  let html = `
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-back-home" title="Kembali ke Beranda" aria-label="Kembali ke Beranda">
          <i class="bi bi-arrow-left"></i><span class="btn-back-text"> Kembali</span>
        </button>
        <span class="nav-title">Trouble Shoot Kelistrikan</span>
      </div>
      <div class="nav-actions">
        <span class="nav-meta">Investigasi Kasus Lapangan</span>
      </div>
    </nav>

    <div class="home-container jobsheet-selection-page">
      <header style="text-align: center; margin-bottom: 24px;">
        <h2 style="font-size: 1.8rem; font-weight:800; margin-bottom: 6px;">Pusat Diagnosis Gangguan Listrik</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem; max-width:640px; margin: 0 auto;">
          Selesaikan investigasi kerusakan pada instalasi yang sudah terpasang berdasarkan laporan keluhan pelanggan seperti kondisi nyata di lapangan.
        </p>
      </header>

      <div class="home-grid" style="grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));">
  `;

  TROUBLESHOOT_SCENARIOS.forEach((s, index) => {
    const isDone = state.troubleshootProgress && state.troubleshootProgress[s.id] === 'done';

    html += `
      <div class="menu-card" id="card-${s.id}" style="padding: 20px; min-height: 220px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom: 10px;">
            <span style="font-size:0.75rem; font-weight:800; background:rgba(245, 158, 11, 0.15); color:#f59e0b; padding:2px 8px; border-radius:4px; border:1px solid rgba(245, 158, 11, 0.3);">
              KASUS ${index + 1}
            </span>
            <span class="jobsheet-badge ${isDone ? 'done' : 'todo'}">
              ${isDone ? '<i class="bi bi-check-lg"></i> TERPECAHKAN' : 'BELUM'}
            </span>
          </div>

          <h3 style="font-size: 1.15rem; line-height: 1.3; margin-bottom: 10px; color:var(--text-primary);">
            ${s.title}
          </h3>

          <div style="
            font-style: italic;
            font-size: 0.83rem;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.04);
            border-left: 3px solid var(--accent-color);
            padding: 10px 12px;
            border-radius: 4px;
            margin-bottom: 16px;
            line-height: 1.5;
          ">
            ${s.customerReport}
          </div>
        </div>

        <button class="btn-card" style="font-size:0.85rem; width:100%; justify-content:space-between; margin-top:10px;">
          <span>Mulai Diagnosis</span>
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
    navigate('home');
  });

  TROUBLESHOOT_SCENARIOS.forEach(s => {
    const card = document.getElementById(`card-${s.id}`);
    if (card) {
      card.addEventListener('click', () => {
        navigate('troubleshoot', { scenarioId: s.id });
      });
    }
  });
}

// ─── Modal Helpers ──────────────────────────────────────────────────────────

function showSolutionConfirmModal(scenario, onConfirm) {
  const existing = document.getElementById('solution-confirm-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'solution-confirm-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9500;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
  `;

  overlay.innerHTML = `
    <div style="
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-width: 440px;
      width: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: sim-dialog-in 0.18s ease;
    ">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.8rem; color:var(--accent-color);"><i class="bi bi-unlock-fill"></i></span>
        <h3 style="margin:0; font-size:1.1rem; color:var(--text-primary);">Buka Kunci Solusi?</h3>
      </div>
      <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55; margin:0;">
        Yakin ingin melihat solusinya? Ini akan mengungkap letak kerusakan secara langsung dan menandai komponen yang bermasalah pada kanvas.
      </p>
      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button id="btn-cancel-solution" style="
          padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color);
          background: transparent; color: var(--text-primary); cursor: pointer; font-weight: 600;
        ">Batal</button>
        <button id="btn-confirm-solution" class="btn-accent" style="
          padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer;
        ">Ya, Buka Solusi</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('btn-cancel-solution').addEventListener('click', () => {
    playUIClick();
    close();
  });
  document.getElementById('btn-confirm-solution').addEventListener('click', () => {
    playUIClick();
    close();
    onConfirm();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

function showValidationSuccessModal(scenario, message) {
  const existing = document.getElementById('ts-result-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ts-result-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9500;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
  `;

  overlay.innerHTML = `
    <div style="
      background: var(--bg-primary);
      border: 2px solid #22c55e;
      border-radius: 14px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      max-width: 480px;
      width: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: center;
      animation: sim-dialog-in 0.2s ease;
    ">
      <div style="font-size:3rem; margin-top: -6px; color:#22c55e;"><i class="bi bi-trophy-fill"></i></div>
      <div>
        <h3 style="margin:0 0 6px 0; font-size:1.3rem; color:#22c55e; font-weight:800;">
          KASUS TERPECAHKAN!
        </h3>
        <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">
          ${scenario.title}
        </span>
      </div>
      <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin:0; text-align:left; background:var(--bg-secondary); padding:12px 14px; border-radius:8px; border:1px solid var(--border-color);">
        ${message}
      </p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:4px;">
        <button id="btn-ts-dialog-list" class="btn-accent" style="padding:10px 20px; font-weight:700; border-radius:8px; cursor:pointer;">
          <i class="bi bi-clipboard-check"></i> Daftar Kasus
        </button>
        <button id="btn-ts-dialog-close" style="padding:10px 18px; font-weight:600; border-radius:8px; border:1px solid var(--border-color); background:transparent; color:var(--text-primary); cursor:pointer;">
          Lanjut di Kanvas
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('btn-ts-dialog-close').addEventListener('click', close);
  document.getElementById('btn-ts-dialog-list').addEventListener('click', () => {
    close();
    state.activeTroubleshootId = null;
    navigate('troubleshoot');
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

function showValidationFailedModal(message) {
  const existing = document.getElementById('ts-result-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ts-result-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9500;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
  `;

  overlay.innerHTML = `
    <div style="
      background: var(--bg-primary);
      border: 1.5px solid var(--color-error);
      border-radius: 14px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      max-width: 460px;
      width: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: center;
      animation: sim-dialog-in 0.2s ease;
    ">
      <div style="font-size:2.8rem; margin-top: -4px; color:var(--color-error);"><i class="bi bi-x-circle-fill"></i></div>
      <div>
        <h3 style="margin:0 0 6px 0; font-size:1.25rem; color:var(--color-error); font-weight:800;">
          Belum Terpecahkan
        </h3>
        <p style="font-size:0.83rem; color:var(--text-muted); margin:0;">
          Rangkaian belum bekerja sesuai kondisi yang diharapkan pelanggan.
        </p>
      </div>
      <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55; margin:0; text-align:left; background:var(--bg-secondary); padding:12px 14px; border-radius:8px; border:1px solid var(--border-color);">
        ${message}
      </p>
      <div style="display:flex; justify-content:center; margin-top:4px;">
        <button id="btn-ts-dialog-close" class="btn-accent" style="padding:9px 24px; font-weight:700; border-radius:8px; cursor:pointer;">
          Periksa Lagi
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('btn-ts-dialog-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

function showSimConfirmDialog(errorAlerts, onProceed) {
  const existing = document.getElementById('sim-confirm-overlay');
  if (existing) existing.remove();

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
      border: 1.5px solid var(--color-warning, #f59e0b);
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      max-width: 460px;
      width: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: sim-dialog-in 0.18s ease;
    ">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.8rem; color:#f59e0b;"><i class="bi bi-exclamation-triangle-fill"></i></span>
        <div style="font-weight:800; font-size:1.05rem; color:var(--text-primary); line-height:1.3;">
          Peringatan Pengujian Rangkaian
        </div>
      </div>

      <div style="background:var(--bg-secondary); border-radius:8px; padding:14px 16px; border:1px solid var(--border-color);">
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6; margin:0;">
          <i class="bi bi-exclamation-triangle-fill" style="color:#f59e0b; margin-right:4px;"></i> Ada kemungkinan masalah pada rangkaian ini. Tetap lanjutkan simulasi untuk melihat hasilnya, atau periksa dulu instalasinya.
        </p>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button id="sim-confirm-fix" style="
          padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
          background: transparent; border: 1.5px solid var(--border-color);
          color: var(--text-primary); cursor: pointer;
        "><i class="bi bi-wrench-adjustable" style="margin-right:4px;"></i> Periksa Dulu</button>
        <button id="sim-confirm-proceed" class="btn-accent" style="
          padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer;
        "><i class="bi bi-lightning-charge-fill" style="margin-right:4px;"></i> Tetap Lanjutkan</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('sim-confirm-fix').addEventListener('click', close);
  document.getElementById('sim-confirm-proceed').addEventListener('click', () => {
    close();
    onProceed();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}
