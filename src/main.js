// Main Application Routing and State Management - Virtual Lab IPL

import { renderSplashScreen } from './components/SplashScreen.js';
import { renderHomeScreen } from './components/HomeScreen.js';
import { renderMateriView } from './components/MateriView.js';
import { renderJobsheetView } from './components/JobsheetView.js';
import { renderTroubleshootView } from './components/TroubleshootView.js';
import { renderSettingsView } from './components/SettingsView.js';
import { renderComponentDetailPage } from './components/ComponentDetailView.js';
import { MATERI_PRESETS } from './data/materiPresets.js';
import { TROUBLESHOOT_SCENARIOS } from './data/troubleshootData.js';
import { resetAnnouncedErrorAlerts, disposeLabCanvas } from './components/LabCanvas.js';
import { playUIClick } from './utils/audioFeedback.js';

// Safe localStorage wrapper
export const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : v;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* abaikan: penyimpanan diblokir */
    }
  },
  getJSON(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : (JSON.parse(v) ?? d);
    } catch {
      return d;
    }
  },
};

// Global Background Music (BGM) instance
export const bgmAudio = new Audio();
bgmAudio.loop = true;
bgmAudio.preload = 'none';
bgmAudio.volume = 0; // diatur ulang oleh applyBgmSettings()

export function applyBgmSettings() {
  bgmAudio.volume = (state.bgmEnabled ? state.bgmVolume : 0) / 100;
  if (!state.bgmEnabled && !bgmAudio.paused) {
    bgmAudio.pause();
  } else if (state.bgmEnabled && bgmAudio.paused) {
    if (!bgmAudio.src) {
      bgmAudio.src = 'src/assets/audio/bgm.mp3';
    }
    bgmAudio.play().catch(() => {});
  }
}

// Fallback jika file audio belum ada / gagal dimuat
bgmAudio.addEventListener('error', () => {
  console.warn('File BGM belum tersedia atau gagal dimuat — BGM dinonaktifkan sementara.');
});

// Global application state
export const state = {
  currentView: 'splash', // 'splash', 'home', 'materi', 'jobsheet', 'canvas_free', 'troubleshoot', 'settings'
  theme: store.get('theme', 'dark'),
  fontSize: store.get('fontSize', 'medium'),
  volume: parseInt(store.get('volume', '50'), 10) || 50,
  bgmEnabled: store.get('bgmEnabled', 'true') !== 'false', // default: true (nyala)
  bgmVolume: parseInt(store.get('bgmVolume', '40'), 10) || 40,
  
  // Materi State
  activeMateriId: 'k3lh',
  activeComponentDetailId: null,
  
  // Jobsheet State
  activeJobsheetId: null, // null means "Free Mode" if view is 'canvas_free'
  jobsheetProgress: store.getJSON('jobsheetProgress', {}),
  // Validation results keyed by jobsheet ID, persists across re-renders
  jobsheetValidation: {}, // { [jsId]: { checked: bool, success: bool, message: string } }
  
  // Trouble Shoot State
  activeTroubleshootId: null,
  troubleshootProgress: store.getJSON('troubleshootProgress', {}),
  troubleshootState: {
    currentHintIndex: 0,
    solutionRevealed: false
  },

  // Lab Canvas & Wiring State
  canvas: {
    components: [], // { id, type, x, y, rotation, state: { on: false } }
    wires: [],      // { id, color, path: [{x, y}, ...], from: { type: 'pin'|'wire', ... }, to: { type: 'pin'|'wire', ... } }
    pan: { x: 0, y: 0 },
    zoom: 1,
    selectedId: null, // ID of selected component or wire
    selectedType: null, // 'component' or 'wire'
    isSimulating: false,
    alerts: [], // [{ id, type: 'error'|'warning'|'success', title, text }]
    blockingErrors: [],
    highlightedComponentIds: [],
    viewMode: store.get('viewMode', 'schematic'), // 'schematic' | 'realistic'
    showGrid: store.get('showGrid', 'true') !== 'false',
    snapToGrid: store.get('snapToGrid', 'true') !== 'false',
    wireMode: store.get('wireMode', 'ortho'), // 'ortho' | 'free'
  },


  
  // History for Undo/Redo
  history: [],
  historyIndex: -1
};

// Initialize app-level styles based on theme
function applyInitialTheme() {
  if (state.theme === 'light') {
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
  }
}

// Update state and trigger re-render of current view
export function updateState(updater) {
  if (typeof updater === 'function') {
    updater(state);
  } else {
    Object.assign(state, updater);
  }
  renderView();
}

// Router to switch views
export function navigate(view, extras = {}) {
  // Save settings or progress before navigating if needed
  saveProgress();

  const prevIsCanvas = state.currentView === 'canvas_free' || 
    (state.currentView === 'jobsheet' && state.activeJobsheetId) || 
    (state.currentView === 'troubleshoot' && state.activeTroubleshootId);
  const nextIsCanvas = view === 'canvas_free' || 
    (view === 'jobsheet' && extras.jobsheetId) || 
    (view === 'troubleshoot' && extras.scenarioId);

  if (prevIsCanvas && !nextIsCanvas) {
    disposeLabCanvas();
  }

  // Play UI click except when entering Jobsheet or Free Mode canvas
  const isEnteringCanvas = (view === 'canvas_free') || (view === 'jobsheet' && extras.jobsheetId);
  if (!isEnteringCanvas) {
    playUIClick();
  }

  state.currentView = view;
  
  // Configure states based on view
  if (view === 'canvas_free') {
    state.activeJobsheetId = null;
    resetCanvasState();

    if (extras.presetKey && MATERI_PRESETS[extras.presetKey]) {
      const preset = MATERI_PRESETS[extras.presetKey];
      state.canvas.components = JSON.parse(JSON.stringify(preset.components));
      state.canvas.wires = JSON.parse(JSON.stringify(preset.wires));
      state.canvas.activePreset = {
        key: extras.presetKey,
        label: preset.label
      };
    } else {
      state.canvas.activePreset = null;
    }
  } else if (view === 'jobsheet') {
    // If opening jobsheets, use specific jobsheetId if provided; otherwise null to show selection list
    if (extras.jobsheetId) {
      state.activeJobsheetId = extras.jobsheetId;
    } else {
      state.activeJobsheetId = null;
    }
    resetCanvasState();
  } else if (view === 'troubleshoot') {
    if (extras.scenarioId) {
      state.activeTroubleshootId = extras.scenarioId;
      resetCanvasState();
      const scenario = TROUBLESHOOT_SCENARIOS.find(s => s.id === extras.scenarioId);
      if (scenario) {
        state.canvas.components = JSON.parse(JSON.stringify(scenario.initialComponents));
        state.canvas.wires = JSON.parse(JSON.stringify(scenario.initialWires));
        state.troubleshootState = { currentHintIndex: 0, solutionRevealed: false };
      }
    } else {
      state.activeTroubleshootId = null;
    }
  } else if (view === 'component_detail') {
    state.activeComponentDetailId = extras.detailId || null;
  }


  // Record history baseline for canvas
  if (view === 'canvas_free' || view === 'jobsheet' || (view === 'troubleshoot' && state.activeTroubleshootId)) {
    initHistory();
  }

  renderView();
}

// Reset canvas variables for a clean slate
function resetCanvasState() {
  resetAnnouncedErrorAlerts();
  const currentViewMode = state.canvas ? (state.canvas.viewMode || 'schematic') : 'schematic';
  const currentShowGrid = state.canvas ? (state.canvas.showGrid !== false) : true;
  const currentSnapToGrid = state.canvas ? (state.canvas.snapToGrid !== false) : true;
  const currentWireMode = state.canvas ? (state.canvas.wireMode || 'ortho') : 'ortho';
  state.canvas.components = [];
  state.canvas.wires = [];
  state.canvas.pan = { x: 0, y: 0 };
  state.canvas.zoom = 1;
  state.canvas.selectedId = null;
  state.canvas.selectedType = null;
  state.canvas.isSimulating = false;
  state.canvas.alerts = [];
  state.canvas.blockingErrors = [];
  state.canvas.highlightedComponentIds = [];
  state.canvas.viewMode = currentViewMode;
  state.canvas.showGrid = currentShowGrid;
  state.canvas.snapToGrid = currentSnapToGrid;
  state.canvas.wireMode = currentWireMode;
  state.canvas.activePreset = null;
  
  // Add initial power source depending on jobsheet (skip for troubleshoot as scenarios define their own)
  if (state.currentView !== 'troubleshoot') {
    initPowerSource();
  }
}


// Place initial power source automatically on canvas load
export function initPowerSource() {
  if (state.activeJobsheetId === 'js8') {
    // 3-Phase Jobsheet needs 3-Phase Source
    state.canvas.components.push({
      id: 'src_3p',
      type: 'Source_3P',
      x: 80,
      y: 180,
      rotation: 0,
      state: {}
    });
  } else {
    // Other jobsheets and Free Mode need 1-Phase Source
    state.canvas.components.push({
      id: 'src_1p',
      type: 'Source_1P',
      x: 80,
      y: 200,
      rotation: 0,
      state: {}
    });
  }
}

// Save data to localStorage via safe store wrapper
export function saveProgress() {
  store.set('theme', state.theme);
  store.set('fontSize', state.fontSize);
  store.set('volume', state.volume.toString());
  store.set('bgmEnabled', state.bgmEnabled.toString());
  store.set('bgmVolume', state.bgmVolume.toString());
  store.set('jobsheetProgress', JSON.stringify(state.jobsheetProgress));
  store.set('troubleshootProgress', JSON.stringify(state.troubleshootProgress || {}));
  if (state.canvas && state.canvas.viewMode) {
    store.set('viewMode', state.canvas.viewMode);
  }
}


// Clear all data
export function resetAllProgress() {
  state.jobsheetProgress = {};
  state.troubleshootProgress = {};
  saveProgress();
  navigate('home');
}

// --- Canvas Undo/Redo History Manager ---
export function initHistory() {
  state.history = [JSON.stringify({
    components: state.canvas.components,
    wires: state.canvas.wires
  })];
  state.historyIndex = 0;
}

export function pushHistory() {
  // Slice any forward history if we were in middle of undo
  if (state.historyIndex < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1);
  }
  
  const snapshot = JSON.stringify({
    components: state.canvas.components,
    wires: state.canvas.wires
  });

  // Only push if different from last snapshot
  if (snapshot !== state.history[state.historyIndex]) {
    state.history.push(snapshot);
    state.historyIndex++;
    
    // Cap history size to 50 items
    if (state.history.length > 50) {
      state.history.shift();
      state.historyIndex--;
    }
  }
}

export function undo() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    const snapshot = JSON.parse(state.history[state.historyIndex]);
    state.canvas.components = snapshot.components;
    state.canvas.wires = snapshot.wires;
    state.canvas.selectedId = null;
    state.canvas.selectedType = null;
    state.canvas.alerts = [];
    state.canvas.blockingErrors = [];
    renderView();
  }
}

export function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    const snapshot = JSON.parse(state.history[state.historyIndex]);
    state.canvas.components = snapshot.components;
    state.canvas.wires = snapshot.wires;
    state.canvas.selectedId = null;
    state.canvas.selectedType = null;
    state.canvas.alerts = [];
    state.canvas.blockingErrors = [];
    renderView();
  }
}


// --- Core Renderer ---
function renderViewInternal() {
  const view = state.currentView;
  
  if (view === 'splash') {
    renderSplashScreen();
    return;
  }
  if (view === 'home') {
    renderHomeScreen();
  } else if (view === 'materi') {
    renderMateriView();
  } else if (view === 'jobsheet' || view === 'canvas_free') {
    renderJobsheetView();
  } else if (view === 'troubleshoot') {
    renderTroubleshootView();
  } else if (view === 'settings') {
    renderSettingsView();
  } else if (view === 'component_detail') {
    renderComponentDetailPage(state.activeComponentDetailId);
  }
}

let _lastViewKey = null;

export function renderView() {
  const key = [state.currentView, state.activeComponentDetailId || '', state.activeJobsheetId || '', state.activeTroubleshootId || ''].join('|');
  const viewChanged = key !== _lastViewKey;
  _lastViewKey = key;

  renderViewInternal();

  if (viewChanged) {
    const isCanvasView = state.currentView === 'canvas_free' || 
      (state.currentView === 'jobsheet' && state.activeJobsheetId) || 
      (state.currentView === 'troubleshoot' && state.activeTroubleshootId);
    if (!isCanvasView) {
      document.body.classList.remove('canvas-active');
      disposeLabCanvas();
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll('.materi-content, .component-detail-page, .materi-container')
      .forEach(el => { el.scrollTop = 0; });
  }
}

// Initialize Application on Window Load
window.addEventListener('DOMContentLoaded', () => {
  applyInitialTheme();
  renderView();
});
