// Lab Canvas Component - Core SVG Interactive Area - Virtual Lab IPL

import { COMPONENT_TYPES, getComponentRealisticSVG } from './SVGAssets.js';
import { getComponentWiringSVG } from './WiringSymbols.js';
import { updateState, state, pushHistory } from '../main.js';
import { evaluateCircuit, detectAllErrors, getComponentLabel, getWireLabel } from '../utils/circuitEvaluator.js';
import { playSwitchClick, playConnect, playShortCircuit, playError, playWarning, playCriticalAlertSiren, playUIClick } from '../utils/audioFeedback.js';
import { showShortCircuitDialog, showConfirmDialog, showToast } from '../utils/appDialog.js';
import { compBox, pinAbs, pinExit, routeOrthogonal, roundedPath, snap as gridSnap, normalizePath, segmentsOfOtherNets } from '../utils/wireRouting.js';
import { moveSegment, insertJog, anchorsFromPath } from '../utils/wireManual.js';
import { computeLanes, displayPath } from '../utils/wireLanes.js';
import { placeMenu } from '../utils/menuPlacement.js';

// Holds intermediate drawing wire state
let drawingWire = null; // { from: {type, componentId, pinName, x, y}, path: [{x,y}], tempEnd: {x,y} }
let activeDragComponentId = null;
let dragOffset = { x: 0, y: 0 };
let isPanning = false;
let panStart = { x: 0, y: 0 };
let pendingTap = null;
let selectedPaletteType = null; // For mobile tap-to-place
let activeDragWaypoint = null; // { wireId, wpId: string }
let activeDragSegment = null; // { wireId, segIndex, startPath, currentPath, startCoord, orient }
let _hasShownSegToast = false;
let _segToastActive = false;
let _segToastTimeout = null;

let _laneSig = {};
let _refreshLanesRaf = null;

function getEffectiveWires(overrideWireId = null, overridePath = null) {
  const wires = state.canvas.wires || [];
  if (!overrideWireId || !overridePath) return wires;
  return wires.map(w => (w.id === overrideWireId ? { ...w, path: overridePath } : w));
}

function refreshWireDisplays() {
  if (!_canvasWrapper) return;
  if (_refreshLanesRaf) return;
  _refreshLanesRaf = requestAnimationFrame(() => {
    _refreshLanesRaf = null;
    const effWires = getEffectiveWires(activeDragSegment?.wireId, activeDragSegment?.currentPath);
    const orthoWires = effWires.filter(w => w.mode === 'ortho');
    if (!orthoWires.length) return;
    const currentLanes = computeLanes(effWires);
    orthoWires.forEach(wire => {
      const offs = currentLanes[wire.id];
      const sig = offs ? [...offs.entries()].map(([k, v]) => `${k}:${v}`).join(',') : '';
      if (_laneSig[wire.id] !== sig) {
        _laneSig[wire.id] = sig;
        const group = _canvasWrapper.querySelector(`.wire-group[data-id="${wire.id}"]`);
        if (!group) return;
        const shown = displayPath(wire.path, offs);
        const d = roundedPath(shown, 8);
        group.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
        if (state.canvas.selectedId === wire.id) {
          const layer = group.querySelector('.seg-handles-layer');
          if (layer) layer.innerHTML = renderSegHandlesHTML(wire, shown);
        }
      }
    });
  });
}

// Pelacak kartu error yang sudah dibunyikan sirenenya
let _announcedErrorAlertIds = new Set();
let _alertsMinimized = false;
const isMobileView = () => window.matchMedia('(max-width: 900px)').matches;

function setAlertsMinimized(value) {
  _alertsMinimized = value;
  const overlay = document.getElementById('alerts-overlay');
  if (overlay) overlay.classList.toggle('is-minimized', value);
  const pill = document.getElementById('alerts-pill');
  if (pill) pill.setAttribute('aria-expanded', String(!value));
}

export function resetAnnouncedErrorAlerts() {
  _announcedErrorAlertIds.clear();
  _alertsMinimized = false;
}

let _winAC = null;

// State reset helper for canvas dragging & panning interactions
function resetInteractionState() {
  activeDragComponentId = null;
  activeDragWaypoint = null;
  activeDragSegment = null;
  isPanning = false;
  pendingTap = null;
  const guideGroup = _canvasWrapper && _canvasWrapper.querySelector('#guide-lines');
  if (guideGroup) guideGroup.innerHTML = '';
}

function checkShowSegToast(wire) {
  if (_hasShownSegToast) return;
  if (!wire || wire.mode !== 'ortho') return;
  _hasShownSegToast = true;
  _segToastActive = true;
  const toast = _canvasWrapper?.querySelector('#canvas-wire-toast');
  if (toast) {
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
  }

  if (_segToastTimeout) clearTimeout(_segToastTimeout);
  _segToastTimeout = setTimeout(() => {
    _segToastActive = false;
    const t = _canvasWrapper?.querySelector('#canvas-wire-toast');
    if (t) t.classList.remove('show');
  }, 4000);
}

function renderSegHandlesHTML(wire, path) {
  if (!path || path.length < 2) return '';
  const zoom = state.canvas.zoom || 1;
  const s = 1 / zoom;
  const n = path.length;
  let html = '';
  for (let i = 0; i < n - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    const len = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
    const touchesPin = (i === 0 || i === n - 2);
    const minLen = touchesPin ? 60 : 30;
    if (len >= minLen) {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const isHoriz = p1.y === p2.y;
      const cursor = isHoriz ? 'ns-resize' : 'ew-resize';
      const rx = 4 * s;
      const strokeW = 1.2 * s;

      const pillW = isHoriz ? 22 * s : 8 * s;
      const pillH = isHoriz ? 8 * s : 22 * s;
      const pillX = midX - pillW / 2;
      const pillY = midY - pillH / 2;

      const hitW = Math.max(40 * s, pillW);
      const hitH = Math.max(40 * s, pillH);
      const hitX = midX - hitW / 2;
      const hitY = midY - hitH / 2;

      html += `
        <g class="seg-handle" data-wire-id="${wire.id}" data-seg-index="${i}" style="cursor: ${cursor};">
          <rect x="${hitX}" y="${hitY}" width="${hitW}" height="${hitH}" fill="transparent" stroke="transparent"/>
          <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${rx}"
                fill="var(--accent-color, #f59e0b)" stroke="#ffffff" stroke-width="${strokeW}" />
        </g>
      `;
    }
  }
  return html;
}

function _updateContextMenuPosition() {
  if (!_canvasWrapper) return;
  const menu = _canvasWrapper.querySelector('.context-menu');
  if (!menu) return;
  const selectedId = state.canvas.selectedId;
  const selectedType = state.canvas.selectedType;
  if (!selectedId) return;

  const zoom = state.canvas.zoom;
  const pan = state.canvas.pan;
  let objBox = null;

  if (selectedType === 'component') {
    const comp = state.canvas.components.find(c => c.id === selectedId);
    if (!comp) return;
    const info = COMPONENT_TYPES[comp.type] || { width: 80, height: 80 };
    objBox = [comp.x * zoom + pan.x, comp.y * zoom + pan.y, (comp.x + info.width) * zoom + pan.x, (comp.y + info.height) * zoom + pan.y];
  } else if (selectedType === 'wire') {
    const wire = state.canvas.wires.find(w => w.id === selectedId);
    if (!wire || !wire.path || wire.path.length === 0) return;
    const midIdx = Math.floor(wire.path.length / 2);
    const mx = wire.path[midIdx].x * zoom + pan.x;
    const my = wire.path[midIdx].y * zoom + pan.y;
    objBox = [mx - 14, my - 14, mx + 14, my + 14];
  }
  if (!objBox) return;
  menu.dataset.obj = objBox.join(',');
  positionContextMenu(_canvasWrapper);
}

export function applyViewportTransform() {
  if (!_canvasWrapper) return;
  const { pan, zoom } = state.canvas;
  const vp = _canvasWrapper.querySelector('#viewport');
  if (vp) vp.setAttribute('transform', `translate(${pan.x}, ${pan.y}) scale(${zoom})`);
  const t = `translate(${pan.x} ${pan.y}) scale(${zoom})`;
  _canvasWrapper.querySelectorAll('#grid-minor, #grid-major').forEach(p => p.setAttribute('patternTransform', t));
  // zoom sangat kecil: sembunyikan grid halus agar tidak menjadi "kabut"
  const minor = _canvasWrapper.querySelector('#grid-minor-rect');
  if (minor) {
    minor.style.display = zoom < 0.5 ? 'none' : '';
    minor.style.opacity = zoom < 0.5 ? '0' : '1';
  }
  _updateContextMenuPosition();
}

// Touch vs synthetic mouse tracking (prevent double firing on mobile touch devices)
let lastTouchAt = 0;
const markTouch = () => { lastTouchAt = Date.now(); };
const isEmulatedMouse = () => Date.now() - lastTouchAt < 700;



// Performance: rAF guard — ensures at most one visual update per frame for hot-path moves
let _rafPending = false;
let _canvasWrapper = null; // persistent reference to avoid repeated DOM queries

export function fitToView(wrapper = _canvasWrapper) {
  const container = wrapper || _canvasWrapper || document.getElementById('canvas-container');
  if (!container) return;

  const comps = state.canvas.components || [];
  const wires = state.canvas.wires || [];

  if (comps.length === 0 && wires.length === 0) {
    state.canvas.zoom = 1;
    state.canvas.pan = { x: 0, y: 0 };
    applyViewportTransform();
    return;
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  comps.forEach(c => {
    const info = COMPONENT_TYPES[c.type] || { width: 80, height: 80 };
    minX = Math.min(minX, c.x);
    minY = Math.min(minY, c.y);
    maxX = Math.max(maxX, c.x + info.width);
    maxY = Math.max(maxY, c.y + info.height);
  });

  wires.forEach(w => {
    (w.path || []).forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });

  if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
    state.canvas.zoom = 1;
    state.canvas.pan = { x: 0, y: 0 };
    applyViewportTransform();
    return;
  }

  const padding = 36;
  const bbWidth = (maxX - minX) + padding * 2;
  const bbHeight = (maxY - minY) + padding * 2;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const rect = container.getBoundingClientRect();
  const viewW = rect.width || window.innerWidth;
  const viewH = rect.height || (window.innerHeight - 80);

  if (viewW <= 0 || viewH <= 0) {
    state.canvas.zoom = 1;
    state.canvas.pan = { x: 0, y: 0 };
    applyViewportTransform();
    return;
  }

  const scaleX = viewW / bbWidth;
  const scaleY = viewH / bbHeight;
  let fitZoom = Math.min(scaleX, scaleY);
  fitZoom = Math.max(0.4, Math.min(1.0, fitZoom));
  fitZoom = parseFloat(fitZoom.toFixed(2));

  const panX = Math.round(viewW / 2 - centerX * fitZoom);
  const panY = Math.round(viewH / 2 - centerY * fitZoom);

  state.canvas.zoom = fitZoom;
  state.canvas.pan = { x: panX, y: panY };
  applyViewportTransform();
}

function scheduleRaf(fn) {
  if (_rafPending) return;
  _rafPending = true;
  requestAnimationFrame(() => {
    fn();
    _rafPending = false;
  });
}

// List of all component types and their configurations
// Generate a stable unique ID for a waypoint that persists through array splice operations.
function generateWpId() {
  return 'wp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

// Migration: assign IDs to any legacy waypoints that were saved without one.
// Called once when canvas state is loaded from localStorage (old format has plain {x,y} objects).
export function migrateWaypointIds(canvasState) {
  if (!canvasState || !canvasState.wires) return canvasState;
  canvasState.wires.forEach(wire => {
    if (wire.path) {
      wire.path.forEach(wp => {
        if (!wp.id) wp.id = generateWpId();
      });
    }
    // Also migrate endpoint references: old { type:'wire', waypointIndex } → { type:'wire', waypointId }
    function migrateEndpoint(ep, wire) {
      if (ep && ep.type === 'wire' && ep.waypointIndex !== undefined && !ep.waypointId) {
        // Find the parent wire to resolve index → id
        const parentWire = canvasState.wires.find(w => w.id === ep.wireId);
        if (parentWire && parentWire.path[ep.waypointIndex]) {
          ep.waypointId = parentWire.path[ep.waypointIndex].id;
        } else {
          ep.waypointId = generateWpId(); // fallback: create orphan id, will not match but won't crash
        }
        delete ep.waypointIndex;
      }
    }
    migrateEndpoint(wire.from, wire);
    migrateEndpoint(wire.to, wire);
  });
  return canvasState;
}


export const PALETTE_ITEMS = [
  { type: "Source_1P", name: "Sumber 1-Fasa", icon: "bi-lightning-charge-fill" },
  { type: "Source_3P", name: "Sumber 3-Fasa", icon: "bi-lightning-charge-fill" },
  { type: "MCB_1P", name: "MCB 1-Fasa", icon: "bi-toggle-on" },
  { type: "MCB_3P", name: "MCB 3-Fasa", icon: "bi-toggles" },
  { type: "PanelPHB", name: "PHB 3-Fasa", icon: "bi-hdd-rack-fill" },
  { type: "Fuse", name: "Sekring (Fuse)", icon: "bi-shield-fill-check" },
  { type: "SwitchSingle", name: "Saklar Tunggal", icon: "bi-toggle-off" },
  { type: "SwitchDouble", name: "Saklar Seri", icon: "bi-toggles2" },
  { type: "SwitchWay3", name: "Saklar Tukar", icon: "bi-arrow-left-right" },
  { type: "SwitchCross", name: "Saklar Silang", icon: "bi-x-diamond-fill" },
  { type: "Socket", name: "Stop Kontak", icon: "bi-outlet" },
  { type: "Lamp", name: "Lampu", icon: "bi-lightbulb-fill" },
  { type: "LampTL", name: "Lampu TL (Neon)", icon: "bi-grip-horizontal" },
  { type: "TerminalBlock", name: "Terminal Block", icon: "bi-hdd-stack-fill" }
];




export function getAvailablePaletteItems(jobsheetId) {
  if (!jobsheetId) return PALETTE_ITEMS; // Free mode gets everything
  
  // Specific jobsheets filter items to the minimal set needed for that task
  switch(jobsheetId) {
    case 'js1':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'SwitchSingle', 'Lamp'].includes(i.type));
    case 'js2':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'SwitchSingle', 'Lamp'].includes(i.type));
    case 'js3':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'SwitchDouble', 'Lamp'].includes(i.type));
    case 'js4':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'Socket'].includes(i.type));
    case 'js5':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'SwitchWay3', 'Lamp'].includes(i.type));
    case 'js6':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'SwitchWay3', 'SwitchCross', 'Lamp'].includes(i.type));
    case 'js7':
      return PALETTE_ITEMS.filter(i => ['Source_1P', 'MCB_1P', 'SwitchSingle', 'Lamp', 'Socket'].includes(i.type));
    case 'js8':
      return PALETTE_ITEMS.filter(i => ['Source_3P', 'MCB_3P', 'MCB_1P', 'PanelPHB', 'Lamp', 'TerminalBlock'].includes(i.type));
    default:
      return PALETTE_ITEMS;
  }
}


// Main Render Function for Interactive Canvas
export function renderLabCanvas(wrapper) {
  if (!wrapper) return;
  
  _winAC?.abort();
  _winAC = new AbortController();
  const signal = _winAC.signal;

  // Store persistent reference for hot-path direct DOM updates
  _canvasWrapper = wrapper;

  const canvas = state.canvas;
  const components = canvas.components;
  const wires = canvas.wires;
  const zoom = canvas.zoom;
  const pan = canvas.pan;

  // Real-time evaluation if simulating
  let evalResult = { components, wires, alerts: [], shortCircuit: false };
  if (canvas.isSimulating) {
    evalResult = evaluateCircuit(canvas);
    
    const errorAlerts = evalResult.alerts.filter(a => a.type === 'error');
    if (errorAlerts.length > 0) {
      // Auto-stop simulation immediately when any fatal error is detected
      canvas.components = evalResult.components;
      canvas.isSimulating = false;
      const isTroubleshoot = state.currentView === 'troubleshoot';
      canvas.alerts = isTroubleshoot ? [] : evalResult.alerts;
      
      if (evalResult.shortCircuit) {
        playShortCircuit();
      } else {
        playError();
      }

      // Update simulation blocked banner if present in DOM
      const banner = document.getElementById('sim-blocked-banner');
      if (banner && !isTroubleshoot) {
        banner.innerHTML = `<span><i class="bi bi-x-octagon-fill" style="color: #ef4444; margin-right: 6px;"></i> <strong>Simulasi Dihentikan</strong> — Terjadi kesalahan fatal pada rangkaian (${errorAlerts.length} masalah). Klik kartu peringatan untuk melihat lokasi komponen bermasalah.</span>`;
        banner.style.display = 'flex';
      }
      
      // Notify if short circuit occurs
      const firstErr = errorAlerts[0] || {};
      const wasShortCircuit = evalResult.shortCircuit;

      updateState({ canvas });

      if (wasShortCircuit) {
        showShortCircuitDialog({
          message: firstErr.problem || firstErr.text,
          location: firstErr.location,
          isTroubleshoot
        });
      }
    }
  }

  // Collect highlighted error/warning item IDs for canvas visual indicators
  // In Troubleshoot mode, do NOT show error/warning highlights on components/wires
  const isTroubleshoot = state.currentView === 'troubleshoot';
  const activeAlerts = (canvas.alerts && canvas.alerts.length > 0)
    ? canvas.alerts
    : (canvas.blockingErrors && canvas.blockingErrors.length > 0 ? canvas.blockingErrors : evalResult.alerts);

  const errorIds = new Set();
  const warningIds = new Set();
  if (!isTroubleshoot) {
    (activeAlerts || []).forEach(a => {
      (a.relatedIds || []).forEach(id => {
        if (a.type === 'error') {
          errorIds.add(id);
        } else if (a.type === 'warning' && !errorIds.has(id)) {
          warningIds.add(id);
        }
      });
    });
  }

  // Draw SVG Workspace
  // NOTE: touch-action:none prevents browser scroll/zoom interference during canvas interactions
  let svgHTML = `
    <svg class="interactive-canvas ${drawingWire ? 'drawing-wire' : ''}" id="lab-svg" width="100%" height="100%" style="touch-action:none;">
      <!-- Grid pattern definitions -->
      <defs>
        <pattern id="grid-minor" width="20" height="20" patternUnits="userSpaceOnUse"
                 patternTransform="translate(${pan.x} ${pan.y}) scale(${zoom})">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" stroke-width="0.6" opacity="0.22"/>
        </pattern>
        <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse"
                 patternTransform="translate(${pan.x} ${pan.y}) scale(${zoom})">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--grid-line)" stroke-width="0.9" opacity="0.32"/>
        </pattern>
      </defs>
      
      <!-- Infinite Background Grid -->
      <rect id="grid-minor-rect" class="grid-bg" width="100%" height="100%" fill="url(#grid-minor)" style="${zoom < 0.5 ? 'display:none; opacity:0;' : ''}"/>
      <rect id="grid-major-rect" class="grid-bg" width="100%" height="100%" fill="url(#grid-major)"/>
      
      <!-- Transforming Canvas Group -->
      <g id="viewport" transform="translate(${pan.x}, ${pan.y}) scale(${zoom})">
        <!-- Alignment Guide Lines -->
        <g id="guide-lines" style="pointer-events:none;"></g>

        <!-- Orthogonal Wire Guide Lines -->
        <g id="wire-ortho-guides" style="pointer-events:none;"></g>
        
        <!-- Render Cable/Wire connections -->
        <g id="wires-group">
          ${(() => {
            const lanes = computeLanes(wires);
            wires.forEach(w => {
              const offs = lanes[w.id];
              _laneSig[w.id] = offs ? [...offs.entries()].map(([k, v]) => `${k}:${v}`).join(',') : '';
            });
            return wires.map(wire => renderWire(wire, evalResult, errorIds, warningIds, lanes)).join('');
          })()}
        </g>

        <!-- Drawing wire preview — stable IDs so hot-path only updates attributes -->
        <path id="drawing-wire-preview" d="" stroke="var(--accent-color)" stroke-width="3"
              stroke-dasharray="4,4" fill="none" style="pointer-events:none; display:${drawingWire ? 'block' : 'none'};"/>
        <g id="drawing-preview-dots"></g>
        
        <!-- Render Components -->
        <g id="components-group">
          ${evalResult.components.map(comp => renderComponent(comp, errorIds, warningIds)).join('')}
        </g>

        <!-- Render Snapping Highlight Circle -->
        <circle id="snap-highlight" cx="0" cy="0" r="8" fill="none" stroke="var(--accent-color)" stroke-width="2" style="display:none; pointer-events:none;"/>
      </g>
    </svg>

    <!-- Context Floating Menu -->
    ${renderContextMenu()}

    <!-- Educational toast for orthogonal wire bend manipulation -->
    <div id="canvas-wire-toast" class="canvas-toast ${_segToastActive ? 'show' : ''}" role="status" aria-live="polite">
      <i class="bi bi-info-circle-fill" style="color: var(--accent-color, #f59e0b); margin-right: 6px;"></i>
      Seret pegangan di tengah garis untuk menggeser belokan.
    </div>

    <!-- Active drawing overlay guide — always present, visibility toggled by class -->
    <div id="drawing-overlay" class="canvas-drawing-overlay" style="display: ${drawingWire ? 'flex' : 'none'};">
      <span><i class="bi bi-pencil-square" style="margin-right: 6px;"></i>Sedang menggambar kabel...</span>
      <div class="drawing-overlay-actions">
        <button type="button" id="btn-undo-waypoint" class="btn-wire-action" style="display: ${drawingWire && ((state.canvas.wireMode !== 'free' && drawingWire.from && drawingWire.from.type === 'pin') ? (drawingWire.anchors && drawingWire.anchors.length > 0) : (drawingWire.path && drawingWire.path.length > 1)) ? 'inline-flex' : 'none'};">
          <i class="bi bi-arrow-counterclockwise"></i> Hapus Titik
        </button>
        <button type="button" id="btn-cancel-wire" class="btn-wire-action">
          ${('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Batal' : 'Batal (Esc)'}
        </button>
      </div>
    </div>
  `;

  wrapper.innerHTML = svgHTML;
  wrapper.classList.toggle('grid-hidden', state.canvas.showGrid === false);

  // Render warning badges into overlay HUD in parent DOM
  renderAlertsHUD(activeAlerts);
  positionContextMenu(wrapper);


  // Prime the preview elements with current state (handles case where drawingWire is active on re-render)
  if (drawingWire) _updateDrawingPreview();

  // Setup Event Bindings
  bindCanvasEvents(wrapper, signal);

  if (canvas.selectedType === 'wire') {
    const selWire = canvas.wires.find(w => w.id === canvas.selectedId);
    if (selWire && selWire.mode === 'ortho') {
      checkShowSegToast(selWire);
    }
  }
}


// Recompute orthogonal routing path for an existing wire
function recomputeOrthoWirePath(wire) {
  if (wire.mode !== 'ortho') return;
  if (!wire.from || !wire.to || wire.from.type !== 'pin' || wire.to.type !== 'pin') return;

  const compA = state.canvas.components.find(c => c.id === wire.from.componentId);
  const pinDefA = compA && COMPONENT_TYPES[compA.type]?.pins.find(p => p.name === wire.from.pinName);
  const compB = state.canvas.components.find(c => c.id === wire.to.componentId);
  const pinDefB = compB && COMPONENT_TYPES[compB.type]?.pins.find(p => p.name === wire.to.pinName);
  if (!compA || !pinDefA || !compB || !pinDefB) return;

  const pinA = pinAbs(compA, pinDefA);
  const exitA = pinExit(compA, pinDefA);
  const pinB = pinAbs(compB, pinDefB);
  const exitB = pinExit(compB, pinDefB);
  const boxes = state.canvas.components.map(c => compBox(c, 6));

  let opts = {};
  if (wire.manual) {
    opts = { keepStraight: true, keepAnchors: true };
  } else {
    const fromKey = `${wire.from.componentId}.${wire.from.pinName}`;
    const toKey = `${wire.to.componentId}.${wire.to.pinName}`;
    opts = { others: segmentsOfOtherNets(state.canvas.wires, fromKey, toKey, wire.id) };
  }
  const routedPts = routeOrthogonal(pinA, exitA, wire.anchors || [], pinB, exitB, boxes, opts);
  wire.from.x = pinA.x;
  wire.from.y = pinA.y;
  wire.to.x = pinB.x;
  wire.to.y = pinB.y;

  const oldPts = wire.path || [];
  wire.path = routedPts.map(pt => {
    const existing = oldPts.find(op => op.x === pt.x && op.y === pt.y);
    return { id: existing?.id || generateWpId(), x: pt.x, y: pt.y };
  });
  if (wire.path.length > 0) {
    wire.path[0].x = pinA.x;
    wire.path[0].y = pinA.y;
    wire.path[wire.path.length - 1].x = pinB.x;
    wire.path[wire.path.length - 1].y = pinB.y;
  }
}

// Draw a wire connection with layout and junction dot markers
function renderWire(wire, evalResult, errorIds = null, warningIds = null, lanes = null) {
  const isSelected = state.canvas.selectedId === wire.id && state.canvas.selectedType === 'wire';
  const wireLanes = lanes ? lanes[wire.id] : (computeLanes(state.canvas.wires)[wire.id] || null);
  const shown = wire.mode === 'ortho' ? displayPath(wire.path, wireLanes) : wire.path;
  const pathData = wire.mode === 'ortho' ? roundedPath(shown, 8) : generateSvgPath(wire.path);
  
  // Color configuration: default wire style
  let strokeColor = "#64748b";
  if (wire.color === 'red')    strokeColor = "var(--accent-fasa-r)";
  else if (wire.color === 'yellow') strokeColor = "var(--accent-fasa-s)";
  else if (wire.color === 'black')  strokeColor = "#475569"; // fasa T
  else if (wire.color === 'blue')   strokeColor = "var(--accent-netral)";
  else if (wire.color === 'green')  strokeColor = "var(--accent-ground)";

  // Check which type of potential this wire carries (from DSU-based eval data)
  const isEnergized = checkWireEnergized(wire, evalResult);
  let flowStyle = '';
  let displayColor = strokeColor;
  const isReverse = evalResult && evalResult.wireFlowDirection && evalResult.wireFlowDirection[wire.id] === 'reverse';
  const animKeyframe = isReverse ? 'wirePulseReverse' : 'wirePulseForward';
  const flowClass = isReverse ? 'wire-flow-reverse' : 'wire-flow-forward';

  if (isEnergized) {
    const { potentials, wireEndpointToRoot } = evalResult;
    const root = wireEndpointToRoot && wireEndpointToRoot[wire.id];
    const pot = root && potentials && potentials[root];

    if (pot && (pot.R || pot.S || pot.T)) {
      // Fasa wire — tetap warna asli (merah/kuning/hitam sesuai R/S/T), tambah animasi pulse
      flowStyle = `stroke-dasharray: 6,6; animation: ${animKeyframe} 0.5s linear infinite; stroke-width: 4.5px;`;
    } else if (pot && pot.N) {
      // Netral wire — pulse in its own blue, no amber override
      flowStyle = `stroke-dasharray: 6,6; animation: ${animKeyframe} 0.7s linear infinite; stroke-width: 4px; opacity: 0.9;`;
    } else if (pot && pot.PE) {
      // Ground/PE wire — pulse in its own green
      flowStyle = `stroke-dasharray: 4,4; animation: ${animKeyframe} 1s linear infinite; stroke-width: 3.5px; opacity: 0.85;`;
    }
  }

  const hasWireError = errorIds && errorIds.has(wire.id);
  const hasWireWarning = warningIds && warningIds.has(wire.id);
  const wireStatusClass = hasWireError ? 'wire-has-error' : (hasWireWarning ? 'wire-has-warning' : '');

  let html = `
    <g class="wire-group ${wireStatusClass} ${flowClass}" data-id="${wire.id}">
      <!-- Thick invisible hover helper target -->
      <path d="${pathData}" stroke="transparent" stroke-width="12" fill="none" class="svg-wire-hover" style="cursor:pointer;"/>
      <!-- Actual cable line -->
      <path d="${pathData}" stroke="${hasWireError ? 'var(--color-error)' : (hasWireWarning ? '#f59e0b' : displayColor)}" stroke-width="${isSelected ? '5' : '3.5'}" fill="none" class="svg-wire ${flowClass} ${isSelected ? 'selected' : ''}" style="${flowStyle}"/>
  `;

  // Draw Junction Dots if another wire branches from waypoints of this wire
  wire.path.forEach((wp, idx) => {
    // Ensure every waypoint has a stable id (auto-assign if missing, e.g. from old saves)
    if (!wp.id) wp.id = generateWpId();

    const isJunction = checkJunctionDot(wire.id, wp.id);
    if (isJunction) {
      const pt = (wire.mode === 'ortho' && shown[idx]) ? shown[idx] : wp;
      html += `<circle cx="${pt.x}" cy="${pt.y}" r="5" class="junction-dot" />`;
    }

    // If selected and free wire, draw handles on waypoints to allow editing/dragging
    if (isSelected && wire.mode !== 'ortho') {
      html += `
        <circle cx="${wp.x}" cy="${wp.y}" r="4" class="waypoint-handle" data-wire-id="${wire.id}" data-wp-id="${wp.id}"/>
      `;
    }
  });

  // When ortho wire is selected, draw handles only at anchors
  if (isSelected && wire.mode === 'ortho' && wire.anchors) {
    wire.anchors.forEach((anc, idx) => {
      html += `
        <circle cx="${anc.x}" cy="${anc.y}" r="4" class="waypoint-handle" data-wire-id="${wire.id}" data-anchor-idx="${idx}"/>
      `;
    });
  }

  // When ortho wire is selected and has no branches, draw handles at segment centers
  if (isSelected && wire.mode === 'ortho') {
    const hasBranch = state.canvas.wires.some(w =>
      (w.from?.type === 'wire' && w.from?.wireId === wire.id) ||
      (w.to?.type === 'wire' && w.to?.wireId === wire.id)
    );
    if (!hasBranch) {
      html += `<g class="seg-handles-layer">${renderSegHandlesHTML(wire, shown)}</g>`;
    }
  }

  html += `</g>`;
  return html;
}

// Checks if a wire is carrying any electrical potential (Phase/Neutral/PE)
// Uses the accurate DSU-based potential data returned by circuitEvaluator.
function checkWireEnergized(wire, evalResult) {
  if (!state.canvas.isSimulating) return false;
  // During a short circuit all breakers trip — nothing is energized visually
  if (evalResult.shortCircuit) return false;

  const { potentials, wireEndpointToRoot, pinToRoot, activeCircuitRoots } = evalResult;
  if (!potentials || !wireEndpointToRoot) return false;

  // Strategy: resolve the DSU root of this wire's electrical node.
  // wireEndpointToRoot[wire.id] was pre-computed from the wire's 'from' endpoint —
  // but both endpoints share the same DSU group, so either gives the same root.
  let root = wireEndpointToRoot[wire.id];

  // Fallback: if for any reason the wire isn't in the map (e.g. newly added),
  // try resolving directly from endpoints via pinToRoot.
  if (!root && pinToRoot) {
    if (wire.from.type === 'pin') {
      root = pinToRoot[`${wire.from.componentId}_${wire.from.pinName}`];
    }
    if (!root && wire.to.type === 'pin') {
      root = pinToRoot[`${wire.to.componentId}_${wire.to.pinName}`];
    }
  }

  if (!root) return false;

  const pot = potentials[root];
  if (!pot) return false;

  // Phase wire: energized if carries Phase voltage
  if (pot.R || pot.S || pot.T) return true;

  // Neutral wire: only energized if part of an active closed circuit with an energized load
  if (pot.N) {
    return !!(activeCircuitRoots && activeCircuitRoots.has(root));
  }

  // PE / Ground wire: no active current in normal operation
  return false;
}


// Checks if another wire starts or ends on a specific waypoint of this wire (by stable ID)
function checkJunctionDot(wireId, wpId) {
  return state.canvas.wires.some(w =>
    w.id !== wireId && (
      (w.from.type === 'wire' && w.from.wireId === wireId && w.from.waypointId === wpId) ||
      (w.to.type   === 'wire' && w.to.wireId   === wireId && w.to.waypointId   === wpId)
    )
  );
}

// Renders a single component group on canvas
function renderComponent(comp, errorIds = null, warningIds = null) {
  const isSelected = state.canvas.selectedId === comp.id && state.canvas.selectedType === 'component';
  const typeInfo = COMPONENT_TYPES[comp.type];
  if (!typeInfo) return '';
  
  const rot = comp.rotation || 0;
  const isRealistic = state.canvas.viewMode === 'realistic';
  
  const hasError = errorIds && errorIds.has(comp.id);
  const hasWarning = warningIds && warningIds.has(comp.id);
  const hasSolution = state.canvas.highlightedComponentIds && state.canvas.highlightedComponentIds.includes(comp.id);
  const statusClass = hasError ? 'comp-has-error' : (hasSolution ? 'comp-has-solution' : (hasWarning ? 'comp-has-warning' : ''));

  let html = `
    <g class="svg-component-node ${statusClass} ${isSelected ? 'selected' : ''}" 
       id="${comp.id}" 
       transform="translate(${comp.x}, ${comp.y}) rotate(${rot}, ${typeInfo.width / 2}, ${typeInfo.height / 2})">
       
      <!-- Component Body SVG (Wiring or Realistic) -->
      ${isRealistic ? getComponentRealisticSVG(comp.type, comp.state, comp.id) : getComponentWiringSVG(comp.type, comp.state, rot)}

      <!-- Warning/Solution Badge indicator above component -->
      ${hasError ? `
        <g class="comp-alert-badge error" transform="translate(${typeInfo.width / 2}, -14)" pointer-events="none">
          <circle cx="0" cy="0" r="11" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
          <text x="0" y="4" font-size="11" text-anchor="middle" fill="#ffffff" font-weight="bold">⚠️</text>
        </g>
      ` : (hasSolution ? `
        <g class="comp-alert-badge solution" transform="translate(${typeInfo.width / 2}, -14)" pointer-events="none">
          <circle cx="0" cy="0" r="11" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" />
          <text x="0" y="4" font-size="11" text-anchor="middle" fill="#ffffff" font-weight="bold">🔍</text>
        </g>
      ` : (hasWarning ? `
        <g class="comp-alert-badge warning" transform="translate(${typeInfo.width / 2}, -14)" pointer-events="none">
          <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" />
          <text x="0" y="3.5" font-size="10" text-anchor="middle" fill="#ffffff" font-weight="bold">⚠️</text>
        </g>
      ` : ''))}

      <!-- Invisible selection stroke -->
      <rect width="${typeInfo.width}" height="${typeInfo.height}" rx="6" fill="transparent" stroke="transparent" stroke-width="4" class="select-box"/>

      
      <!-- Terminal Pin Circles (subtle ring/opacity in realistic mode) -->
      ${typeInfo.pins.map(pin => {
        // Find if pin is highlighted as snapping target
        const isHigh = drawingWire && drawingWire.snapTarget && 
                       drawingWire.snapTarget.type === 'pin' &&
                       drawingWire.snapTarget.componentId === comp.id &&
                       drawingWire.snapTarget.pinName === pin.name;

        const pinOpacity = isRealistic ? '0.75' : '1.0';
        const pinStrokeWidth = isRealistic ? '2' : '1.5';
                        
        return `
          <circle cx="${pin.x}" cy="${pin.y}" r="4.5" fill="${pin.color}" 
                  stroke="#ffffff" stroke-width="${pinStrokeWidth}" opacity="${pinOpacity}"
                  class="pin-terminal ${isHigh ? 'highlighted' : ''}" 
                  data-comp-id="${comp.id}" data-pin-name="${pin.name}" title="${pin.label}"/>
        `;
      }).join('')}
    </g>
  `;
  return html;
}


// Generate path string from point arrays
function generateSvgPath(points) {
  if (!points || points.length === 0) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  return path;
}

// ─── Hot-path Direct DOM Helpers (no innerHTML rebuild) ───────────────────────

// Update drawing-wire preview path + waypoint dots directly in existing DOM elements
function _updateDrawingPreview() {
  if (!_canvasWrapper) return;
  const previewPath = _canvasWrapper.querySelector('#drawing-wire-preview');
  const previewDots = _canvasWrapper.querySelector('#drawing-preview-dots');
  const overlay = _canvasWrapper.querySelector('#drawing-overlay');
  const orthoGuides = _canvasWrapper.querySelector('#wire-ortho-guides');

  if (!drawingWire) {
    if (previewPath) { previewPath.setAttribute('d', ''); previewPath.style.display = 'none'; }
    if (previewDots) previewDots.innerHTML = '';
    if (overlay) overlay.style.display = 'none';
    if (orthoGuides) orthoGuides.innerHTML = '';
    return;
  }

  const isOrtho = state.canvas.wireMode !== 'free' && drawingWire.from && drawingWire.from.type === 'pin';
  let d = '';
  let dotPoints = [];

  if (isOrtho) {
    const compA = state.canvas.components.find(c => c.id === drawingWire.from.componentId);
    const pinDefA = compA && COMPONENT_TYPES[compA.type]?.pins.find(p => p.name === drawingWire.from.pinName);

    if (compA && pinDefA) {
      const pinA = pinAbs(compA, pinDefA);
      const exitA = pinExit(compA, pinDefA);
      const anchors = drawingWire.anchors || [];
      const boxes = state.canvas.components.map(c => compBox(c, 6));

      let ujung = drawingWire.tempEnd || pinA;
      let exitB = null;

      if (drawingWire.snapTarget && drawingWire.snapTarget.type === 'pin') {
        const compB = state.canvas.components.find(c => c.id === drawingWire.snapTarget.componentId);
        const pinDefB = compB && COMPONENT_TYPES[compB.type]?.pins.find(p => p.name === drawingWire.snapTarget.pinName);
        if (compB && pinDefB) {
          ujung = pinAbs(compB, pinDefB);
          exitB = pinExit(compB, pinDefB);
        }
      }

      const fromKey = drawingWire.from?.type === 'pin' ? `${drawingWire.from.componentId}.${drawingWire.from.pinName}` : null;
      const toKey = drawingWire.snapTarget && drawingWire.snapTarget.type === 'pin' ? `${drawingWire.snapTarget.componentId}.${drawingWire.snapTarget.pinName}` : null;
      const others = segmentsOfOtherNets(state.canvas.wires, fromKey, toKey);
      const routedPts = routeOrthogonal(pinA, exitA, anchors, ujung, exitB, boxes, { others });
      d = roundedPath(routedPts, 8);
      dotPoints = anchors; // Gambar titik hanya di anchor
      if (orthoGuides) orthoGuides.innerHTML = '';
    }
  }

  if (!d) {
    const points = [...drawingWire.path];
    if (drawingWire.tempEnd) points.push(drawingWire.tempEnd);
    d = generateSvgPath(points);
    dotPoints = points;

    // Orthogonal wire guide lines from the last placed point toward current cursor/finger
    if (orthoGuides && drawingWire.path && drawingWire.path.length > 0) {
      const lastPt = drawingWire.path[drawingWire.path.length - 1];
      const curPt = drawingWire.tempEnd || lastPt;
      const zoom = state.canvas.zoom || 1;
      const strokeW = (1 / zoom).toFixed(2);
      orthoGuides.innerHTML = `
        <line x1="${lastPt.x}" y1="${lastPt.y}" x2="${curPt.x}" y2="${lastPt.y}" stroke="var(--accent-color)" stroke-width="${strokeW}" stroke-dasharray="3 3" opacity="0.35"/>
        <line x1="${lastPt.x}" y1="${lastPt.y}" x2="${lastPt.x}" y2="${curPt.y}" stroke="var(--accent-color)" stroke-width="${strokeW}" stroke-dasharray="3 3" opacity="0.35"/>
      `;
    } else if (orthoGuides) {
      orthoGuides.innerHTML = '';
    }
  }

  if (previewPath) {
    previewPath.setAttribute('d', d);
    previewPath.style.display = 'block';
  }

  if (previewDots) {
    // Rebuild dot markers — these are few and cheap
    previewDots.innerHTML = dotPoints.map(p =>
      `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="var(--accent-color)" stroke-width="1.5" style="pointer-events:none;"/>`
    ).join('');
  }

  if (overlay) {
    overlay.style.display = 'flex';
    const btnUndo = overlay.querySelector('#btn-undo-waypoint');
    if (btnUndo) {
      const count = isOrtho ? (drawingWire.anchors?.length || 0) : (drawingWire.path && drawingWire.path.length > 1 ? drawingWire.path.length - 1 : 0);
      btnUndo.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }
}

// Update a single component's SVG transform directly in the DOM
function _applyComponentTransform(compId) {
  if (!_canvasWrapper) return;
  const comp = state.canvas.components.find(c => c.id === compId);
  if (!comp) return;
  const typeInfo = COMPONENT_TYPES[comp.type];
  if (!typeInfo) return;
  const el = _canvasWrapper.querySelector(`#${compId}`);
  if (!el) return;
  const rot = comp.rotation || 0;
  el.setAttribute('transform',
    `translate(${comp.x}, ${comp.y}) rotate(${rot}, ${typeInfo.width / 2}, ${typeInfo.height / 2})`
  );
}

// Update a wire's SVG path(s) directly in the DOM (both visual + invisible hover target)
function _applyWirePath(wireId, customPath = null) {
  if (!_canvasWrapper) return;
  const wire = state.canvas.wires.find(w => w.id === wireId);
  if (!wire) return;
  const currentPath = customPath || wire.path;
  let shown = currentPath;
  if (wire.mode === 'ortho') {
    const lanes = computeLanes(getEffectiveWires(customPath ? wireId : null, customPath));
    const offs = lanes[wireId];
    _laneSig[wireId] = offs ? [...offs.entries()].map(([k, v]) => `${k}:${v}`).join(',') : '';
    shown = displayPath(currentPath, offs);
  }
  const d = wire.mode === 'ortho' ? roundedPath(shown, 8) : generateSvgPath(shown);
  // Wire group contains 2 paths: hover helper (transparent, wide) + actual wire
  const group = _canvasWrapper.querySelector(`.wire-group[data-id="${wireId}"]`);
  if (!group) return;
  group.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
  // Also update waypoint handles if selected
  const isSelected = state.canvas.selectedId === wireId;
  if (isSelected) {
    if (wire.mode === 'ortho') {
      const layer = group.querySelector('.seg-handles-layer');
      if (layer) {
        layer.innerHTML = renderSegHandlesHTML(wire, shown);
      }
    }
    group.querySelectorAll('.waypoint-handle').forEach(h => {
      const anchorIdx = h.getAttribute('data-anchor-idx');
      if (anchorIdx !== null && anchorIdx !== undefined && wire.mode === 'ortho' && wire.anchors) {
        const anc = wire.anchors[parseInt(anchorIdx, 10)];
        if (anc) {
          h.setAttribute('cx', anc.x);
          h.setAttribute('cy', anc.y);
        }
      } else {
        const wpId = h.getAttribute('data-wp-id');
        const wp = wpId && currentPath.find(p => p.id === wpId);
        if (wp) {
          h.setAttribute('cx', wp.x);
          h.setAttribute('cy', wp.y);
        }
      }
    });
  }
}


// Tempatkan menu konteks di ruang bebas: di dalam kanvas, tidak menimpa kartu peringatan dan tidak menutupi objek terpilih.
export function positionContextMenu(wrapper = _canvasWrapper) {
  const menu = wrapper && wrapper.querySelector('.context-menu');
  if (!menu || !menu.dataset.obj) return;
  const wr = wrapper.getBoundingClientRect(), m = menu.getBoundingClientRect();
  const [l, t, r, b] = menu.dataset.obj.split(',').map(Number);
  const obj = { l: l + wr.left, t: t + wr.top, r: r + wr.left, b: b + wr.top };
  const avoid = [...document.querySelectorAll('#alerts-overlay .alert-card, #alerts-overlay .alerts-pill')]
    .filter(el => el.offsetParent !== null)
    .map(el => { const q = el.getBoundingClientRect(); return { l: q.left - 8, t: q.top - 8, r: q.right + 8, b: q.bottom + 8 }; });
  const p = placeMenu(obj, { w: m.width, h: m.height }, { l: wr.left, t: wr.top, r: wr.right, b: wr.bottom }, avoid);
  menu.style.transform = 'none';
  menu.style.left = (p.x - wr.left) + 'px';
  menu.style.top = (p.y - wr.top) + 'px';
}

// Renders the floating context menu for deletions/rotation
function renderContextMenu() {
  const selectedId = state.canvas.selectedId;
  const selectedType = state.canvas.selectedType;
  
  if (!selectedId) return '';
  
  const hasAlerts = (state.canvas.alerts && state.canvas.alerts.length > 0) || (state.canvas.blockingErrors && state.canvas.blockingErrors.length > 0);
  if (isMobileView() && hasAlerts && !_alertsMinimized) return '';
  
  let itemX = 0;
  let itemY = 0;
  let objBox = null;
  
  const zoom = state.canvas.zoom;
  const pan = state.canvas.pan;
  
  let itemLabel = '';
  if (selectedType === 'component') {
    const comp = state.canvas.components.find(c => c.id === selectedId);
    if (!comp) return '';
    const info = COMPONENT_TYPES[comp.type] || { width: 80, height: 80 };
    itemLabel = getComponentLabel(comp, state.canvas.components);
    // Position menu above the component
    itemX = comp.x * zoom + pan.x + (info.width * zoom) / 2;
    itemY = comp.y * zoom + pan.y - 45;
    objBox = [comp.x * zoom + pan.x, comp.y * zoom + pan.y, (comp.x + info.width) * zoom + pan.x, (comp.y + info.height) * zoom + pan.y];
  } else if (selectedType === 'wire') {
    const wire = state.canvas.wires.find(w => w.id === selectedId);
    if (!wire || wire.path.length === 0) return '';
    itemLabel = getWireLabel(wire, state.canvas.components);
    // Position at wire midpoint
    const midIdx = Math.floor(wire.path.length / 2);
    const mx = wire.path[midIdx].x * zoom + pan.x;
    const my = wire.path[midIdx].y * zoom + pan.y;
    itemX = mx;
    itemY = my - 45;
    objBox = [mx - 14, my - 14, mx + 14, my + 14];
  }
  
  // Style wrapper
  return `
    <div class="context-menu" data-obj="${objBox ? objBox.join(',') : ''}" style="left: ${itemX}px; top: ${itemY}px; transform: translate(-50%, -50%);">
      <div class="context-menu-label" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 4px; text-align: center; white-space: nowrap; max-width: 260px; overflow: hidden; text-overflow: ellipsis;" title="${itemLabel}">
        ${itemLabel}
      </div>
      <div class="context-menu-actions" style="display: flex; gap: 4px; justify-content: center; align-items: center;">
        ${selectedType === 'component' ? 
          `<button class="btn-context" id="btn-context-rotate"><i class="bi bi-arrow-clockwise"></i> Putar</button>` : ''
        }
        ${(() => {
          if (selectedType !== 'component') return '';
          const comp = state.canvas.components.find(c => c.id === selectedId);
          if (comp && comp.type === 'PanelPHB') {
            const hidden = comp.state && comp.state.labelsHidden;
            return `<button class="btn-context" id="btn-context-toggle-labels"><i class="bi ${hidden ? 'bi-eye-fill' : 'bi-eye-slash-fill'}"></i> ${hidden ? 'Tampilkan Label' : 'Sembunyikan Label'}</button>`;
          }
          return '';
        })()}
        ${(() => {
          if (selectedType !== 'component') return '';
          const comp = state.canvas.components.find(c => c.id === selectedId);
          if (comp && comp.type === 'Fuse' && comp.state && comp.state.blown) {
            return `<button class="btn-context success" id="btn-context-replace-fuse"><i class="bi bi-arrow-repeat"></i> Ganti Sekring Baru</button>`;
          }
          return '';
        })()}
        ${(() => {
          if (selectedType !== 'wire') return '';
          const wire = state.canvas.wires.find(w => w.id === selectedId);
          if (!wire) return '';
          if (wire.mode !== 'ortho' && wire.from?.type === 'pin' && wire.to?.type === 'pin') {
            return `<button class="btn-context" id="btn-context-ortho-wire"><i class="bi bi-arrow-return-right"></i> Rapikan Kabel</button>`;
          }
          if (wire.mode === 'ortho' && wire.manual) {
            return `<button class="btn-context" id="btn-context-auto-wire"><i class="bi bi-magic"></i> Rapikan Otomatis</button>`;
          }
          return '';
        })()}
        <button class="btn-context delete" id="btn-context-delete"><i class="bi bi-trash3-fill"></i> Hapus</button>
      </div>
    </div>
  `;
}

// Render dynamic alarm cards onto screen wrapper with interactive click-to-focus
function renderAlertsHUD(alerts) {
  const overlay = document.getElementById('alerts-overlay');
  if (!overlay) return;
  
  if (state.currentView === 'troubleshoot' || !alerts || alerts.length === 0) {
    overlay.innerHTML = '';
    _alertsMinimized = false;
    overlay.classList.remove('is-minimized');
    if (!alerts || alerts.length === 0) {
      _announcedErrorAlertIds.clear();
    }
    return;
  }

  // Deteksi kemunculan BARU kartu error (pengecualian khusus mode Trouble Shoot)
  if (state.currentView !== 'troubleshoot') {
    const currentErrorAlerts = alerts.filter(a => a.type === 'error');
    const currentErrorKeys = new Set(currentErrorAlerts.map(a => a.id || `${a.title}_${a.location}`).filter(Boolean));

    // Bersihkan id error yang sudah tidak aktif
    for (const key of _announcedErrorAlertIds) {
      if (!currentErrorKeys.has(key)) {
        _announcedErrorAlertIds.delete(key);
      }
    }

    let hasNewError = false;
    currentErrorAlerts.forEach(alert => {
      const key = alert.id || `${alert.title}_${alert.location}`;
      if (!_announcedErrorAlertIds.has(key)) {
        _announcedErrorAlertIds.add(key);
        hasNewError = true;
      }
    });

    if (hasNewError) {
      _alertsMinimized = false;
      playCriticalAlertSiren();
    }
  }
  
  const firstTitle = (alerts[0] && alerts[0].title) ? alerts[0].title : 'Peringatan Rangkaian';
  const pillHtml = `
    <button id="alerts-pill" class="alerts-pill" type="button" aria-expanded="${!_alertsMinimized}">
      <i class="bi bi-exclamation-octagon-fill"></i>
      <span class="alerts-pill-text">${alerts.length} peringatan · ${firstTitle}</span>
      <i class="bi bi-chevron-down"></i>
    </button>
  `;

  overlay.innerHTML = pillHtml + alerts.map(alert => {
    const relatedStr = (alert.relatedIds || []).join(',');
    return `
      <div class="alert-card ${alert.type}" data-related="${relatedStr}" title="Klik untuk fokus & sorot lokasi komponen bermasalah">
        <div class="alert-card-header">
          <span class="alert-icon"><i class="bi ${alert.type === 'error' ? 'bi-exclamation-octagon-fill' : 'bi-exclamation-triangle-fill'}" style="color:${alert.type === 'error' ? '#ef4444' : '#f59e0b'};"></i></span>
          <span class="alert-card-title">${alert.title}</span>
          ${alert.relatedIds && alert.relatedIds.length > 0 ? '<button type="button" class="alert-focus-tag"><i class="bi bi-search"></i> Lihat</button>' : ''}
        </div>
        <div class="alert-card-content">
          <div class="alert-detail-row">
            <span class="alert-detail-label"><i class="bi bi-geo-alt-fill"></i> Di mana:</span>
            <span class="alert-detail-val">${alert.location || 'Rangkaian'}</span>
          </div>
          ${alert.problem ? `
            <div class="alert-detail-row">
              <span class="alert-detail-label"><i class="bi bi-lightning-charge-fill"></i> Masalah:</span>
              <span class="alert-detail-val">${alert.problem}</span>
            </div>
          ` : ''}
          ${alert.danger ? `
            <div class="alert-detail-row">
              <span class="alert-detail-label"><i class="bi bi-exclamation-triangle-fill"></i> Bahaya:</span>
              <span class="alert-detail-val">${alert.danger}</span>
            </div>
          ` : ''}
          ${alert.fix ? `
            <div class="alert-detail-row">
              <span class="alert-detail-label"><i class="bi bi-wrench-adjustable"></i> Perbaikan:</span>
              <span class="alert-detail-val">${alert.fix}</span>
            </div>
          ` : ''}
          ${!alert.problem && alert.text ? `<p class="alert-detail-plain">${alert.text}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  overlay.classList.toggle('is-minimized', isMobileView() && _alertsMinimized);

  // Pil: buka kembali kartu
  const pillEl = overlay.querySelector('#alerts-pill');
  if (pillEl) {
    pillEl.addEventListener('click', (e) => {
      e.stopPropagation();
      setAlertsMinimized(false);
      // Sembunyikan menu konteks saat kartu terbuka di HP
      if (isMobileView()) {
        state.canvas.selectedId = null;
        state.canvas.selectedType = null;
        updateState({ canvas: state.canvas });
      }
    });
  }

  // Bind click on alert cards / Lihat button to auto-pan / focus on problem item
  overlay.querySelectorAll('.alert-card').forEach(card => {
    const ids = (card.getAttribute('data-related') || '').split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return;

    const doFocus = (e) => {
      e.stopPropagation();
      if (isMobileView()) {
        setAlertsMinimized(true);                         // 1) kecilkan dulu
        setTimeout(() => focusOnCanvasObject(ids[0]), 260); // 2) lalu fokus + menu Hapus
      } else {
        focusOnCanvasObject(ids[0]);
      }
    };

    const tag = card.querySelector('.alert-focus-tag');
    if (isMobileView()) {
      // Mobile: hanya tombol "Lihat" yang memicu fokus, supaya teks kartu bisa dibaca tanpa terpicu
      if (tag) tag.addEventListener('click', doFocus);
    } else {
      card.addEventListener('click', doFocus);
    }
  });
}

function getFreeCenterX(wrapW, wrapRect) {
  // pusat horizontal area bebas: wrapper dikurangi kartu peringatan di sisi kanan (hanya layar lebar)
  const cards = [...document.querySelectorAll('#alerts-overlay .alert-card')].filter(el => el.offsetParent !== null);
  if (!cards.length || isMobileView()) return wrapW / 2;
  const minLeft = Math.min(...cards.map(el => el.getBoundingClientRect().left)) - wrapRect.left;
  return Math.max(wrapW * 0.45, minLeft - 16) / 2;
}

/**
 * Focus and pan canvas directly to a problem component or wire
 */
export function focusOnCanvasObject(targetId) {
  if (!targetId || !_canvasWrapper) return;
  
  const comp = state.canvas.components.find(c => c.id === targetId);
  if (comp) {
    const typeInfo = COMPONENT_TYPES[comp.type] || { width: 80, height: 80 };
    const wrapRect = _canvasWrapper.getBoundingClientRect();
    const wrapW = wrapRect.width || 800;
    const wrapH = wrapRect.height || 600;
    const zoom = state.canvas.zoom || 1;

    // Center on this component
    const centerX = comp.x + typeInfo.width / 2;
    const centerY = comp.y + typeInfo.height / 2;
    
    state.canvas.pan.x = Math.round(getFreeCenterX(wrapW, wrapRect) - centerX * zoom);
    state.canvas.pan.y = Math.round((wrapH / 2) - centerY * zoom);
    state.canvas.selectedId = comp.id;
    state.canvas.selectedType = 'component';
    
    playWarning();
    updateState({ canvas: state.canvas });
    return;
  }

  const wire = state.canvas.wires.find(w => w.id === targetId);
  if (wire && wire.path && wire.path.length > 0) {
    const midIdx = Math.floor(wire.path.length / 2);
    const midPt = wire.path[midIdx];
    const wrapRect = _canvasWrapper.getBoundingClientRect();
    const wrapW = wrapRect.width || 800;
    const wrapH = wrapRect.height || 600;
    const zoom = state.canvas.zoom || 1;

    state.canvas.pan.x = Math.round(getFreeCenterX(wrapW, wrapRect) - midPt.x * zoom);
    state.canvas.pan.y = Math.round((wrapH / 2) - midPt.y * zoom);
    state.canvas.selectedId = wire.id;
    state.canvas.selectedType = 'wire';
    
    playWarning();
    updateState({ canvas: state.canvas });
  }
}


// Main Drag, Snap, Click router events handler
function bindCanvasEvents(wrapper, signal = _winAC?.signal) {
  const svg = wrapper.querySelector('#lab-svg');
  if (!svg) return;
  
  // Transform coord relative
  function getCanvasCoords(e) {
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const pan = state.canvas.pan;
    const zoom = state.canvas.zoom;
    
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }

  // Find snapping point (pins or waypoints, or mid-segment of an existing wire)
  function findSnapTarget(coords, isTouch = false) {
    const zoom = state.canvas.zoom || 1;
    const effectiveIsTouch = isTouch || (Date.now() - lastTouchAt < 1000);
    // Pada input sentuhan, gunakan radius ±28px layar dibagi zoom agar ukuran fisik di layar konsisten
    const snapRadius = effectiveIsTouch ? (28 / zoom) : 15;
    let nearest = null;
    let minDist = snapRadius;

    // --- Phase 1: Component pins (highest priority) ---
    state.canvas.components.forEach(comp => {
      const typeInfo = COMPONENT_TYPES[comp.type];
      const rot = comp.rotation || 0;

      typeInfo.pins.forEach(pin => {
        const cx = typeInfo.width / 2;
        const cy = typeInfo.height / 2;
        const rad = (rot * Math.PI) / 180;

        const rx = Math.cos(rad) * (pin.x - cx) - Math.sin(rad) * (pin.y - cy) + cx;
        const ry = Math.sin(rad) * (pin.x - cx) + Math.cos(rad) * (pin.y - cy) + cy;

        const pinX = comp.x + rx;
        const pinY = comp.y + ry;

        const dist = Math.hypot(coords.x - pinX, coords.y - pinY);
        if (dist < minDist) {
          minDist = dist;
          nearest = {
            type: 'pin',
            componentId: comp.id,
            pinName: pin.name,
            x: pinX,
            y: pinY
          };
        }
      });
    });

    // --- Phase 2: Existing wire vertex/waypoints (mid-priority) ---
    state.canvas.wires.forEach(wire => {
      if (drawingWire && wire.id === drawingWire.id) return;

      wire.path.forEach((wp, idx) => {
        if (!wp.id) wp.id = generateWpId(); // ensure id exists
        const dist = Math.hypot(coords.x - wp.x, coords.y - wp.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = {
            type: 'wire',
            wireId: wire.id,
            waypointId: wp.id,
            x: wp.x,
            y: wp.y
          };
        }
      });
    });

    // --- Phase 3: Mid-segment of existing wires (fallback, only if Phase 1+2 found nothing) ---
    // This allows snapping to the BODY of a straight wire, not just its endpoints.
    if (!nearest) {
      state.canvas.wires.forEach(wire => {
        if (drawingWire && wire.id === drawingWire.id) return;

        for (let i = 0; i < wire.path.length - 1; i++) {
          const ax = wire.path[i].x,     ay = wire.path[i].y;
          const bx = wire.path[i + 1].x, by = wire.path[i + 1].y;

          // Project coords onto segment [a, b], clamped to [0, 1]
          const abx = bx - ax, aby = by - ay;
          const abLen2 = abx * abx + aby * aby;
          if (abLen2 === 0) continue; // degenerate segment

          let t = ((coords.x - ax) * abx + (coords.y - ay) * aby) / abLen2;
          t = Math.max(0, Math.min(1, t));

          // Avoid snapping to the endpoints themselves (already handled in Phase 2)
          if (t <= 0.01 || t >= 0.99) continue;

          const closestX = ax + t * abx;
          const closestY = ay + t * aby;
          const dist = Math.hypot(coords.x - closestX, coords.y - closestY);

          if (dist < minDist) {
            minDist = dist;
            nearest = {
              type: 'wire',
              wireId: wire.id,
              // Signal that this is a mid-segment snap — a new waypoint must be inserted
              insertAfterIndex: i,
              x: Math.round(closestX),
              y: Math.round(closestY)
            };
          }
        }
      });
    }

    return nearest;
  }

  // Helper: finalise an in-progress wire when a valid snap target is confirmed.
  // Handles the special case where the snap target lies on the MIDDLE of an existing
  // wire segment (targetSnap.insertAfterIndex defined) — in that case we first splice a new
  // waypoint into the target wire so the junction is explicit.
  function completeDrawingWire(targetSnap) {
    try {
      if (!drawingWire) return;
      if (!isDifferentEndpoint(drawingWire.from, targetSnap)) return;

      let resolvedSnap = targetSnap;

      // Mid-segment snap: insert a new waypoint into the target wire first
      if (targetSnap.type === 'wire' && targetSnap.insertAfterIndex !== undefined) {
        const targetWire = state.canvas.wires.find(w => w.id === targetSnap.wireId);
        if (targetWire) {
          const insertIdx = targetSnap.insertAfterIndex + 1;
          // Assign a permanent stable ID to the new waypoint — index may shift later due to
          // further splices, but the ID will never change.
          const newWpId = generateWpId();
          targetWire.path.splice(insertIdx, 0, { id: newWpId, x: targetSnap.x, y: targetSnap.y });

          // Resolve as a stable waypointId snap (not index-based)
          resolvedSnap = {
            type: 'wire',
            wireId: targetSnap.wireId,
            waypointId: newWpId,
            x: targetSnap.x,
            y: targetSnap.y
          };
        }
      }

      const isOrtho = state.canvas.wireMode !== 'free' && drawingWire.from.type === 'pin' && resolvedSnap.type === 'pin';
      let wirePath = [];
      let anchors = [];

      if (isOrtho) {
        const compA = state.canvas.components.find(c => c.id === drawingWire.from.componentId);
        const pinDefA = compA && COMPONENT_TYPES[compA.type]?.pins.find(p => p.name === drawingWire.from.pinName);
        const compB = state.canvas.components.find(c => c.id === resolvedSnap.componentId);
        const pinDefB = compB && COMPONENT_TYPES[compB.type]?.pins.find(p => p.name === resolvedSnap.pinName);

        if (compA && pinDefA && compB && pinDefB) {
          const pinA = pinAbs(compA, pinDefA);
          const exitA = pinExit(compA, pinDefA);
          const pinB = pinAbs(compB, pinDefB);
          const exitB = pinExit(compB, pinDefB);
          anchors = (drawingWire.anchors || []).map(a => ({ x: gridSnap(a.x), y: gridSnap(a.y) }));
          const boxes = state.canvas.components.map(c => compBox(c, 6));

          const fromKey = `${drawingWire.from.componentId}.${drawingWire.from.pinName}`;
          const toKey = `${resolvedSnap.componentId}.${resolvedSnap.pinName}`;
          const others = segmentsOfOtherNets(state.canvas.wires, fromKey, toKey);
          const routedPts = routeOrthogonal(pinA, exitA, anchors, pinB, exitB, boxes, { others });
          wirePath = routedPts.map(pt => ({ id: generateWpId(), x: pt.x, y: pt.y }));
          if (wirePath.length > 0) {
            wirePath[0].x = pinA.x;
            wirePath[0].y = pinA.y;
            wirePath[wirePath.length - 1].x = pinB.x;
            wirePath[wirePath.length - 1].y = pinB.y;
          }
        }
      }

      if (wirePath.length === 0) {
        wirePath = [...drawingWire.path, { x: resolvedSnap.x, y: resolvedSnap.y }].map(pt => ({
          id: pt.id || generateWpId(),
          x: pt.x,
          y: pt.y
        }));
      }

      const newWire = {
        id: 'wire_' + Date.now() + '_' + Math.floor(Math.random() * 100),
        color: getWireColorForPin(drawingWire.from, resolvedSnap),
        path: wirePath,
        from: drawingWire.from,
        to: resolvedSnap,
        mode: isOrtho ? 'ortho' : 'free'
      };
      if (isOrtho) {
        newWire.anchors = anchors;
      }

      state.canvas.wires.push(newWire);
      drawingWire = null;
      state.canvas.alerts = [];
      state.canvas.blockingErrors = [];
      playConnect();
      pushHistory();
      updateState({ canvas: state.canvas });
    } catch (err) {
      console.error('Error completing wire:', err);
      showToast('Kabel gagal tersambung. Coba lagi atau tekan Batal.');
    }
  }

  let pinchStartDist = 0;
  let pinchStartZoom = 1;

  // --- Mouse / Touch DOWN ---
  function handleStart(e) {
    if (isMobileView() && !_alertsMinimized && document.querySelector('#alerts-overlay .alert-card')) {
      setAlertsMinimized(true);
    }

    if (e.touches && e.touches.length === 2) {
      pinchStartDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinchStartZoom = state.canvas.zoom;
      isPanning = false;
      return;
    }

    if (activeDragComponentId || activeDragWaypoint || isPanning) {
      // Sisa gestur sebelumnya (touchend/touchcancel hilang). Bersihkan agar
      // sentuhan baru tidak memindahkan komponen lama.
      resetInteractionState();
    }

    const coords = getCanvasCoords(e);
    const isTouch = !!(e.touches && e.touches.length > 0);
    const target = e.target;
    
    // CASE A: Clicked on a component pin
    if (target.classList.contains('pin-terminal')) {
      e.stopPropagation();
      if (state.canvas.isSimulating) return; // disable editing during simulation
      
      const snapTarget = findSnapTarget(coords, isTouch);
      if (snapTarget) {
        if (drawingWire) {
          // Already drawing — complete wire to this snap target
          completeDrawingWire(snapTarget);
        } else {
          // Start a new wire from this pin
          drawingWire = {
            from: snapTarget,
            path: [{ x: snapTarget.x, y: snapTarget.y }],
            anchors: [],
            tempEnd: { x: snapTarget.x, y: snapTarget.y },
            snapTarget: null,
            justStarted: true
          };
          updateState({ canvas: state.canvas });
        }
      }
      return;
    }

    // CASE AAA: Clicked on a segment handle (.seg-handle)
    const segHandle = target.closest('.seg-handle');
    if (segHandle) {
      e.stopPropagation();
      if (state.canvas.isSimulating) return;

      const wireId = segHandle.getAttribute('data-wire-id');
      let segIdx = parseInt(segHandle.getAttribute('data-seg-index'), 10);
      const wire = state.canvas.wires.find(w => w.id === wireId);
      if (!wire || !wire.path || wire.path.length < 2) return;

      let startPath = wire.path.map(p => ({ ...p }));
      const isTouchingPin = (segIdx === 0 || segIdx === startPath.length - 2);

      if (isTouchingPin) {
        const jog = insertJog(startPath, segIdx);
        if (jog) {
          startPath = jog.pts;
          segIdx = jog.index;
        } else {
          return;
        }
      }

      const pA = startPath[segIdx];
      const pB = startPath[segIdx + 1];
      const orientType = pA.y === pB.y ? 'h' : (pA.x === pB.x ? 'v' : null);
      if (!orientType) return;

      activeDragSegment = {
        wireId,
        segIndex: segIdx,
        startPath,
        currentPath: startPath,
        startCoord: { ...coords },
        orient: orientType
      };
      return;
    }

    // CASE AA: Clicked on a waypoint-handle to drag it
    if (target.classList.contains('waypoint-handle')) {
      e.stopPropagation();
      if (state.canvas.isSimulating) return;
      if (drawingWire) {
        const snapTarget = findSnapTarget(coords, isTouch);
        if (snapTarget && isDifferentEndpoint(drawingWire.from, snapTarget)) {
          completeDrawingWire(snapTarget);
        } else if (isTouch) {
          drawingWire.tempEnd = coords;
          drawingWire.snapTarget = null;
          _updateDrawingPreview();
        }
        return;
      }
      const wireId = target.getAttribute('data-wire-id');
      const wpId = target.getAttribute('data-wp-id');
      const anchorIdx = target.getAttribute('data-anchor-idx');
      activeDragWaypoint = {
        wireId,
        wpId,
        anchorIdx: (anchorIdx !== null && anchorIdx !== undefined) ? parseInt(anchorIdx, 10) : null
      };
      return;
    }
    
    // CASE B: Clicked on placing selection (Touch tap-to-place)
    if (selectedPaletteType) {
      e.stopPropagation();
      spawnComponent(selectedPaletteType, coords.x, coords.y);
      selectedPaletteType = null;
      // remove palette item highlight in DOM
      wrapper.querySelectorAll('.palette-item').forEach(el => el.style.borderColor = '');
      return;
    }

    // CASE C: Clicked on placed component to start DRAGGING
    const compEl = target.closest('.svg-component-node');
    if (compEl) {
      e.stopPropagation();
      const compId = compEl.id;
      
      // If simulating, check if component is interactive (switches, MCBs)
      if (state.canvas.isSimulating) {
        toggleComponentState(compId, coords, compEl);
        return;
      }

      if (drawingWire) {
        const snapTarget = findSnapTarget(coords, isTouch);
        if (snapTarget && isDifferentEndpoint(drawingWire.from, snapTarget)) {
          completeDrawingWire(snapTarget);
        } else if (isTouch) {
          drawingWire.tempEnd = coords;
          drawingWire.snapTarget = null;
          _updateDrawingPreview();
        }
        return;
      }
      
      // Selection highlight
      updateState(draft => {
        draft.canvas.selectedId = compId;
        draft.canvas.selectedType = 'component';
      });
      
      activeDragComponentId = compId;
      const comp = state.canvas.components.find(c => c.id === compId);
      dragOffset = {
        x: coords.x - comp.x,
        y: coords.y - comp.y
      };
      return;
    }

    // CASE D: Clicked on a wire — behavior depends on whether we're mid-draw
    if (target.classList.contains('svg-wire-hover') || target.classList.contains('svg-wire')) {
      e.stopPropagation();
      if (state.canvas.isSimulating) return;

      if (drawingWire) {
        // We're actively drawing — treat click on wire body as an attempt to connect here.
        // findSnapTarget Phase 3 will find the nearest mid-segment projection point.
        const snapTarget = findSnapTarget(coords, isTouch);
        if (snapTarget && isDifferentEndpoint(drawingWire.from, snapTarget)) {
          completeDrawingWire(snapTarget);
        } else if (isTouch) {
          drawingWire.tempEnd = coords;
          drawingWire.snapTarget = null;
          _updateDrawingPreview();
        }
        // If no valid snap found (e.g. too far from the segment), do nothing —
        // don't accidentally select the wire or clear the drawing state.
        return;
      }

      // Not drawing — normal wire selection
      const wireGroup = target.closest('.wire-group');
      if (!wireGroup) return;
      const wireId = wireGroup.getAttribute('data-id');
      const clickedWire = state.canvas.wires.find(w => w.id === wireId);
      if (clickedWire && clickedWire.mode === 'ortho') {
        checkShowSegToast(clickedWire);
      }
      updateState(draft => {
        draft.canvas.selectedId = wireId;
        draft.canvas.selectedType = 'wire';
      });
      return;
    }


    // CASE E: Clicked on empty canvas background
    if (target.classList.contains('grid-bg') || target.id === 'grid-minor-rect' || target.id === 'grid-major-rect' || target === svg || target.id === 'viewport' || target.id === 'wires-group' || target.id === 'components-group') {
      if (drawingWire) {
        e.stopPropagation();
        
        if (isTouch) {
          const clientX = e.touches[0].clientX;
          const clientY = e.touches[0].clientY;
          pendingTap = {
            x0: clientX,
            y0: clientY,
            coords,
            moved: false,
            panStart: { ...state.canvas.pan }
          };
          return;
        }

        // Desktop mouse:
        const snapTarget = findSnapTarget(coords, false);
        if (snapTarget && isDifferentEndpoint(drawingWire.from, snapTarget)) {
          // Complete wire — completeDrawingWire handles mid-segment insertion too
          completeDrawingWire(snapTarget);
        } else {
          // No snap nearby — add a plain waypoint belokan to the active path
          const snapGrid = state.canvas.snapToGrid !== false;
          const wpX = snapGrid ? gridSnap(coords.x) : Math.round(coords.x);
          const wpY = snapGrid ? gridSnap(coords.y) : Math.round(coords.y);
          if (state.canvas.wireMode !== 'free' && drawingWire.from && drawingWire.from.type === 'pin') {
            if (!drawingWire.anchors) drawingWire.anchors = [];
            const lastA = drawingWire.anchors[drawingWire.anchors.length - 1];
            if (!lastA || lastA.x !== wpX || lastA.y !== wpY) {
              drawingWire.anchors.push({ x: wpX, y: wpY });
            }
          } else {
            drawingWire.path.push({ x: wpX, y: wpY });
          }
          drawingWire.tempEnd = { x: wpX, y: wpY };
          drawingWire.snapTarget = null;
          const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
          if (ring) ring.style.display = 'none';
          updateState({ canvas: state.canvas });
          _updateDrawingPreview();
        }
        return;
      }
      
      // Clear contextual selection
      updateState(draft => {
        draft.canvas.selectedId = null;
        draft.canvas.selectedType = null;
      });

      isPanning = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      panStart = {
        x: clientX - state.canvas.pan.x,
        y: clientY - state.canvas.pan.y
      };
    }
  }

  // --- Mouse / Touch MOVE ---
  function handleMove(e) {
    // 2-finger touch pinch zoom
    if (e.touches && e.touches.length === 2 && pinchStartDist > 0) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const factor = dist / pinchStartDist;
      const newZoom = Math.min(2.5, Math.max(0.4, pinchStartZoom * factor));
      state.canvas.zoom = parseFloat(newZoom.toFixed(2));
      applyViewportTransform();
      return;
    }

    // Mouse tanpa tombol ditekan = gestur sudah berakhir
    if (e.type === 'mousemove' && e.buttons === 0 &&
        (activeDragComponentId || activeDragWaypoint || isPanning)) {
      handleEnd(e);
      return;
    }

    // Touch tap vs pan during drawingWire
    if (pendingTap) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - pendingTap.x0;
      const dy = clientY - pendingTap.y0;
      if (!pendingTap.moved && Math.hypot(dx, dy) > 10) {
        pendingTap.moved = true;
      }
      if (pendingTap.moved) {
        state.canvas.pan = {
          x: pendingTap.panStart.x + dx,
          y: pendingTap.panStart.y + dy
        };
        applyViewportTransform();
      }
      return;
    }

    const coords = getCanvasCoords(e);
    const isMoveTouch = !!(e.touches && e.touches.length > 0);

    // CASE AA: Dragging a wire waypoint — direct DOM, no full re-render
    if (activeDragWaypoint) {
      const { wireId, wpId, anchorIdx } = activeDragWaypoint;
      const wire = state.canvas.wires.find(w => w.id === wireId);
      if (wire) {
        const snapGrid = state.canvas.snapToGrid !== false;
        let targetX = snapGrid ? gridSnap(coords.x) : Math.round(coords.x);
        let targetY = snapGrid ? gridSnap(coords.y) : Math.round(coords.y);

        // Alignment guides for waypoint against other targets
        const zoom = state.canvas.zoom || 1;
        const snapThreshold = 4 / zoom;
        const guideLinesGroup = _canvasWrapper && _canvasWrapper.querySelector('#guide-lines');

        let matchedGuideX = null;
        let matchedGuideY = null;

        const otherTargetsX = [];
        const otherTargetsY = [];
        state.canvas.components.forEach(o => {
          const oInfo = COMPONENT_TYPES[o.type];
          if (!oInfo) return;
          otherTargetsX.push(o.x + oInfo.width / 2);
          otherTargetsY.push(o.y + oInfo.height / 2);
          if (oInfo.pins) {
            oInfo.pins.forEach(pin => {
              const pt = getRotatedPinCoords(o, pin, oInfo, o.rotation || 0);
              otherTargetsX.push(pt.x);
              otherTargetsY.push(pt.y);
            });
          }
        });
        state.canvas.wires.forEach(w => {
          (w.path || []).forEach(p => {
            if (p.id !== wpId) {
              otherTargetsX.push(p.x);
              otherTargetsY.push(p.y);
            }
          });
        });

        for (const tx of otherTargetsX) {
          if (Math.abs(tx - targetX) <= snapThreshold) {
            targetX = tx;
            matchedGuideX = tx;
            break;
          }
        }
        for (const ty of otherTargetsY) {
          if (Math.abs(ty - targetY) <= snapThreshold) {
            targetY = ty;
            matchedGuideY = ty;
            break;
          }
        }

        if (guideLinesGroup) {
          let linesSvg = '';
          const strokeW = (1 / zoom).toFixed(2);
          if (matchedGuideX !== null) {
            linesSvg += `<line x1="${matchedGuideX}" y1="-3000" x2="${matchedGuideX}" y2="5000" stroke="var(--accent-color)" stroke-width="${strokeW}" opacity="0.7" stroke-dasharray="4 3"/>`;
          }
          if (matchedGuideY !== null) {
            linesSvg += `<line x1="-3000" y1="${matchedGuideY}" x2="5000" y2="${matchedGuideY}" stroke="var(--accent-color)" stroke-width="${strokeW}" opacity="0.7" stroke-dasharray="4 3"/>`;
          }
          guideLinesGroup.innerHTML = linesSvg;
        }

        if (anchorIdx !== null && anchorIdx !== undefined && wire.mode === 'ortho' && wire.anchors && wire.anchors[anchorIdx]) {
          wire.anchors[anchorIdx] = { x: gridSnap(targetX), y: gridSnap(targetY) };
          recomputeOrthoWirePath(wire);
          scheduleRaf(() => {
            _applyWirePath(wireId);
            refreshWireDisplays();
            const handle = _canvasWrapper?.querySelector(`.waypoint-handle[data-wire-id="${wireId}"][data-anchor-idx="${anchorIdx}"]`);
            if (handle) {
              handle.setAttribute('cx', gridSnap(targetX));
              handle.setAttribute('cy', gridSnap(targetY));
            }
          });
        } else {
          // Find waypoint by stable ID (index may have shifted due to splices)
          const wp = wire.path.find(p => p.id === wpId);
          if (wp) {
            wp.x = targetX;
            wp.y = targetY;
            const branchIds = [];
            updateBranchWires(wireId, wpId, { x: targetX, y: targetY }, branchIds);
            scheduleRaf(() => {
              _applyWirePath(wireId);
              branchIds.forEach(id => _applyWirePath(id));
            });
          }
        }
      }
      return;
    }

    // CASE AA-SEG: Dragging wire segment handle (.seg-handle)
    if (activeDragSegment) {
      const { wireId, segIndex, startPath, orient } = activeDragSegment;
      const delta = orient === 'h' ? (coords.y - activeDragSegment.startCoord.y) : (coords.x - activeDragSegment.startCoord.x);
      const snapOn = state.canvas.snapToGrid !== false;
      const np = moveSegment(startPath, segIndex, delta, snapOn);
      if (np) {
        activeDragSegment.currentPath = np;
        scheduleRaf(() => {
          _applyWirePath(wireId, np);
          refreshWireDisplays();
        });
      }
      return;
    }

    // CASE A: Drawing wire preview — direct DOM, no full re-render
    if (drawingWire) {
      const snapTarget = findSnapTarget(coords, isMoveTouch);
      if (snapTarget) {
        drawingWire.tempEnd = { x: snapTarget.x, y: snapTarget.y };
        drawingWire.snapTarget = snapTarget;
        // Update snap ring position directly
        const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
        if (ring) { ring.setAttribute('cx', snapTarget.x); ring.setAttribute('cy', snapTarget.y); ring.style.display = 'block'; }
      } else {
        drawingWire.tempEnd = coords;
        drawingWire.snapTarget = null;
        const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
        if (ring) ring.style.display = 'none';
      }
      scheduleRaf(_updateDrawingPreview);
      return;
    }

    // CASE B: Dragging placed component — direct DOM, no full re-render
    if (activeDragComponentId) {
      const comp = state.canvas.components.find(c => c.id === activeDragComponentId);
      if (comp) {
        const typeInfo = COMPONENT_TYPES[comp.type] || { width: 80, height: 80 };
        const snapGrid = state.canvas.snapToGrid !== false;
        let rawX = coords.x - dragOffset.x;
        let rawY = coords.y - dragOffset.y;
        if (snapGrid) {
          rawX = Math.round(rawX / 10) * 10;
          rawY = Math.round(rawY / 10) * 10;
        }
        comp.x = rawX;
        comp.y = rawY;

        // Alignment guides
        const zoom = state.canvas.zoom || 1;
        const snapThreshold = 4 / zoom;
        const guideLinesGroup = _canvasWrapper && _canvasWrapper.querySelector('#guide-lines');

        let matchedGuideX = null;
        let matchedGuideY = null;

        // Collect target X and Y from other components: center and pins
        const otherTargetsX = [];
        const otherTargetsY = [];
        state.canvas.components.forEach(o => {
          if (o.id === comp.id) return;
          const oInfo = COMPONENT_TYPES[o.type];
          if (!oInfo) return;
          otherTargetsX.push(o.x + oInfo.width / 2);
          otherTargetsY.push(o.y + oInfo.height / 2);
          if (oInfo.pins) {
            oInfo.pins.forEach(pin => {
              const pt = getRotatedPinCoords(o, pin, oInfo, o.rotation || 0);
              otherTargetsX.push(pt.x);
              otherTargetsY.push(pt.y);
            });
          }
        });

        // Test points of the dragged component: center and pins
        const myPoints = [];
        myPoints.push({ x: comp.x + typeInfo.width / 2, y: comp.y + typeInfo.height / 2 });
        if (typeInfo.pins) {
          typeInfo.pins.forEach(pin => {
            const pt = getRotatedPinCoords(comp, pin, typeInfo, comp.rotation || 0);
            myPoints.push({ x: pt.x, y: pt.y });
          });
        }

        // Find best X match
        let bestDiffX = null;
        for (const pt of myPoints) {
          for (const tx of otherTargetsX) {
            const diff = tx - pt.x;
            if (Math.abs(diff) <= snapThreshold) {
              if (bestDiffX === null || Math.abs(diff) < Math.abs(bestDiffX)) {
                bestDiffX = diff;
                matchedGuideX = tx;
              }
            }
          }
        }
        if (bestDiffX !== null) {
          comp.x += bestDiffX;
        }

        // Find best Y match
        let bestDiffY = null;
        for (const pt of myPoints) {
          for (const ty of otherTargetsY) {
            const diff = ty - pt.y;
            if (Math.abs(diff) <= snapThreshold) {
              if (bestDiffY === null || Math.abs(diff) < Math.abs(bestDiffY)) {
                bestDiffY = diff;
                matchedGuideY = ty;
              }
            }
          }
        }
        if (bestDiffY !== null) {
          comp.y += bestDiffY;
        }

        // Render guide lines
        if (guideLinesGroup) {
          let linesSvg = '';
          const strokeW = (1 / zoom).toFixed(2);
          if (matchedGuideX !== null) {
            linesSvg += `<line x1="${matchedGuideX}" y1="-3000" x2="${matchedGuideX}" y2="5000" stroke="var(--accent-color)" stroke-width="${strokeW}" opacity="0.7" stroke-dasharray="4 3"/>`;
          }
          if (matchedGuideY !== null) {
            linesSvg += `<line x1="-3000" y1="${matchedGuideY}" x2="5000" y2="${matchedGuideY}" stroke="var(--accent-color)" stroke-width="${strokeW}" opacity="0.7" stroke-dasharray="4 3"/>`;
          }
          guideLinesGroup.innerHTML = linesSvg;
        }

        // Collect IDs of wires whose paths need updating
        const attachedWireIds = getAttachedWireIds(comp);
        updateAttachedWires(comp); // update wire.path coordinates in state
        scheduleRaf(() => {
          _applyComponentTransform(activeDragComponentId);
          attachedWireIds.forEach(id => _applyWirePath(id));
          refreshWireDisplays();
        });
      }
      return;
    }

    // CASE C: Panning canvas viewport — direct DOM, no full re-render
    if (isPanning) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      state.canvas.pan = { x: clientX - panStart.x, y: clientY - panStart.y };
      applyViewportTransform();
    }
  }

  // --- Mouse / Touch UP ---
  function handleEnd(e) {
    pinchStartDist = 0;
    const wasDraggingComp = !!activeDragComponentId;
    const wasDraggingWP   = !!activeDragWaypoint;
    const wasDraggingSeg  = !!activeDragSegment;
    const activeSegData   = activeDragSegment;
    const currentPendingTap = (e && e.type === 'touchcancel') ? null : pendingTap;

    resetInteractionState();

    if (wasDraggingSeg && activeSegData) {
      const { wireId, currentPath } = activeSegData;
      const wire = state.canvas.wires.find(w => w.id === wireId);
      if (wire) {
        const normCurrent = normalizePath(currentPath);
        const isSame = (
          wire.path.length === normCurrent.length &&
          wire.path.every((p, idx) => p.x === normCurrent[idx].x && p.y === normCurrent[idx].y)
        );

        if (!isSame) {
          wire.manual = true;
          const oldPts = wire.path || [];
          wire.path = normCurrent.map(p => {
            const matched = oldPts.find(op => op.x === p.x && op.y === p.y);
            return { id: matched?.id || generateWpId(), x: p.x, y: p.y };
          });
          wire.anchors = anchorsFromPath(normCurrent);
          pushHistory();
        }
      }
      updateState({ canvas: state.canvas });
      return;
    }

    if (currentPendingTap) {
      if (!currentPendingTap.moved) {
        if (drawingWire) {
          const snapTarget = findSnapTarget(currentPendingTap.coords, true);
          if (snapTarget && isDifferentEndpoint(drawingWire.from, snapTarget)) {
            completeDrawingWire(snapTarget);
          } else {
            const snapGrid = state.canvas.snapToGrid !== false;
            const wpX = snapGrid ? gridSnap(currentPendingTap.coords.x) : Math.round(currentPendingTap.coords.x);
            const wpY = snapGrid ? gridSnap(currentPendingTap.coords.y) : Math.round(currentPendingTap.coords.y);
            if (state.canvas.wireMode !== 'free' && drawingWire.from && drawingWire.from.type === 'pin') {
              if (!drawingWire.anchors) drawingWire.anchors = [];
              const lastA = drawingWire.anchors[drawingWire.anchors.length - 1];
              if (!lastA || lastA.x !== wpX || lastA.y !== wpY) {
                drawingWire.anchors.push({ x: wpX, y: wpY });
              }
            } else {
              drawingWire.path.push({ x: wpX, y: wpY });
            }
            drawingWire.tempEnd = { x: wpX, y: wpY };
            drawingWire.snapTarget = null;
            const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
            if (ring) ring.style.display = 'none';
            updateState({ canvas: state.canvas });
            _updateDrawingPreview();
          }
        }
      } else {
        updateState({ canvas: state.canvas });
      }
    }

    if (drawingWire && drawingWire.justStarted) {
      drawingWire.justStarted = false;
    }

    // After any drag ends, do ONE structural re-render to sync DOM fully
    // (includes wires, components, context menu, alerts, etc.)
    if (wasDraggingComp || wasDraggingWP) {
      pushHistory();
      updateState({ canvas: state.canvas });
    }
  }

  // Attach core events
  svg.addEventListener('touchstart', markTouch, { passive: true, capture: true });
  svg.addEventListener('touchend', markTouch, { passive: true, capture: true });
  svg.addEventListener('touchcancel', markTouch, { passive: true, capture: true });

  svg.addEventListener('mousedown', (e) => { if (!isEmulatedMouse()) handleStart(e); });
  svg.addEventListener('mousemove', (e) => { if (!isEmulatedMouse()) handleMove(e); });
  window.addEventListener('mouseup', (e) => { if (!isEmulatedMouse()) handleEnd(e); }, { signal });

  svg.addEventListener('touchstart', handleStart, { passive: false });
  // Only call preventDefault when an active canvas operation is underway to avoid
  // blocking scroll on the rest of the page and reduce mobile overhead
  svg.addEventListener('touchmove', (e) => {
    if (activeDragComponentId || activeDragWaypoint || activeDragSegment || drawingWire || isPanning || pendingTap) {
      e.preventDefault();
    }
    handleMove(e);
  }, { passive: false });
  window.addEventListener('touchend', handleEnd, { signal });
  window.addEventListener('touchcancel', handleEnd, { signal });
  window.addEventListener('blur', handleEnd, { signal });

  // Orientation change & resize handler: auto fitToView when rotating to landscape
  let _lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  const handleWindowResizeOrOrient = () => {
    const curOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    const orientChanged = curOrientation !== _lastOrientation;
    _lastOrientation = curOrientation;

    if (orientChanged && curOrientation === 'landscape') {
      setTimeout(() => {
        fitToView(wrapper);
      }, 100);
    }
  };

  window.addEventListener('resize', handleWindowResizeOrOrient, { signal });
  window.addEventListener('orientationchange', () => {
    setTimeout(handleWindowResizeOrOrient, 150);
  }, { signal });

  // --- Mouse wheel zoom toward cursor ---
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(2.5, Math.max(0.4, state.canvas.zoom * zoomFactor));
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const curZoom = state.canvas.zoom;
    state.canvas.pan.x = Math.round(mouseX - (mouseX - state.canvas.pan.x) * (newZoom / curZoom));
    state.canvas.pan.y = Math.round(mouseY - (mouseY - state.canvas.pan.y) * (newZoom / curZoom));
    state.canvas.zoom = parseFloat(newZoom.toFixed(2));
    applyViewportTransform();
  }, { passive: false });

  // Helper: delete currently selected component or wire (with confirm for power source)
  async function deleteSelectedObject() {
    const selId = state.canvas.selectedId;
    const selType = state.canvas.selectedType;
    if (!selId) return;

    if (selType === 'component') {
      const comp = state.canvas.components.find(c => c.id === selId);
      if (comp && comp.type.startsWith('Source_') && state.activeJobsheetId) {
        const ok = await showConfirmDialog({
          title: 'Hapus Sumber Listrik?',
          message: 'Sumber bisa ditambahkan lagi dari palet.',
          confirmText: 'Ya, Hapus'
        });
        if (!ok) return;
      }
      // Delete component and all connected wires
      state.canvas.components = state.canvas.components.filter(c => c.id !== selId);
      state.canvas.wires = state.canvas.wires.filter(w =>
        !(w.from.type === 'pin' && w.from.componentId === selId) &&
        !(w.to.type === 'pin' && w.to.componentId === selId)
      );
    } else if (selType === 'wire') {
      state.canvas.wires = state.canvas.wires.filter(w => w.id !== selId);
    }

    state.canvas.selectedId = null;
    state.canvas.selectedType = null;
    state.canvas.alerts = [];
    state.canvas.blockingErrors = [];
    pushHistory();
    updateState({ canvas: state.canvas });
  }

  // --- Keyboard cancel wire & delete selected listener ---
  const keyHandler = async (e) => {
    if (e.key === 'Escape' && drawingWire) {
      if (!document.getElementById('lab-svg')) {
        return;
      }
      drawingWire = null;
      _updateDrawingPreview();
      const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
      if (ring) ring.style.display = 'none';
      updateState({ canvas: state.canvas });
      return;
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && !state.canvas.isSimulating) {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (state.canvas.selectedId) {
        e.preventDefault();
        await deleteSelectedObject();
      }
    }
  };
  window.addEventListener('keydown', keyHandler, { signal });

  // --- Undo Waypoint on overlay click ---
  const btnUndoWaypoint = wrapper.querySelector('#btn-undo-waypoint');
  if (btnUndoWaypoint) {
    btnUndoWaypoint.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawingWire) {
        if (state.canvas.wireMode !== 'free' && drawingWire.from && drawingWire.from.type === 'pin') {
          if (drawingWire.anchors && drawingWire.anchors.length > 0) {
            drawingWire.anchors.pop();
            const last = drawingWire.anchors[drawingWire.anchors.length - 1] || drawingWire.from;
            drawingWire.tempEnd = { x: last.x, y: last.y };
            drawingWire.snapTarget = null;
            const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
            if (ring) ring.style.display = 'none';
            _updateDrawingPreview();
          }
        } else if (drawingWire.path && drawingWire.path.length > 1) {
          drawingWire.path.pop();
          const last = drawingWire.path[drawingWire.path.length - 1];
          drawingWire.tempEnd = { x: last.x, y: last.y };
          drawingWire.snapTarget = null;
          const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
          if (ring) ring.style.display = 'none';
          _updateDrawingPreview();
        }
      }
    });
  }

  // --- Batal button on overlay click ---
  const btnCancelWire = wrapper.querySelector('#btn-cancel-wire');
  if (btnCancelWire) {
    btnCancelWire.addEventListener('click', (e) => {
      e.stopPropagation();
      drawingWire = null;
      _updateDrawingPreview();
      const ring = _canvasWrapper && _canvasWrapper.querySelector('#snap-highlight');
      if (ring) ring.style.display = 'none';
      updateState({ canvas: state.canvas });
    });
  }

  // --- Double Click to Insert Waypoint on Existing Wire ---
  svg.addEventListener('dblclick', (e) => {
    const target = e.target;
    if (target.classList.contains('svg-wire-hover') || target.classList.contains('svg-wire')) {
      e.stopPropagation();
      if (state.canvas.isSimulating) return;
      
      const coords = getCanvasCoords(e);
      const wireGroup = target.closest('.wire-group');
      if (!wireGroup) return;
      const wireId = wireGroup.getAttribute('data-id');
      const wire = state.canvas.wires.find(w => w.id === wireId);
      
      if (wire) {
        const insertIdx = findBestWaypointInsertionIndex(wire.path, coords);
        wire.path.splice(insertIdx, 0, {
          x: Math.round(coords.x / 10) * 10,
          y: Math.round(coords.y / 10) * 10
        });
        
        state.canvas.selectedId = wireId;
        state.canvas.selectedType = 'wire';
        pushHistory();
        updateState({ canvas: state.canvas });
      }
    }
  });

  // --- Drag and Drop on Desktop wrapper ---
  const paletteDrawer = document.getElementById('palette-drawer');
  if (paletteDrawer) {
    const items = paletteDrawer.querySelectorAll('.palette-item');
    items.forEach(el => {
      // Desktop standard drag
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', el.getAttribute('data-type'));
      });
      
      // Mobile tap-to-place selection toggle
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        items.forEach(item => item.style.borderColor = '');
        selectedPaletteType = el.getAttribute('data-type');
        el.style.borderColor = 'var(--accent-color)';
        el.style.borderWidth = '2px';
      });
    });
  }

  // Accept desktop drops
  wrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  wrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (type) {
      const rect = svg.getBoundingClientRect();
      const pan = state.canvas.pan;
      const zoom = state.canvas.zoom;
      
      const dropX = (e.clientX - rect.left - pan.x) / zoom;
      const dropY = (e.clientY - rect.top - pan.y) / zoom;
      
      spawnComponent(type, dropX, dropY);
    }
  });

  // Float Context actions listener bindings
  const rotateBtn = wrapper.querySelector('#btn-context-rotate');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const compId = state.canvas.selectedId;
      const comp = state.canvas.components.find(c => c.id === compId);
      if (comp) {
        comp.rotation = ((comp.rotation || 0) + 90) % 360;
        updateAttachedWires(comp);
        pushHistory();
        updateState({ canvas: state.canvas });
      }
    });
  }

  const deleteBtn = wrapper.querySelector('#btn-context-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteSelectedObject();
    });
  }

  const replaceFuseBtn = wrapper.querySelector('#btn-context-replace-fuse');
  if (replaceFuseBtn) {
    replaceFuseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selId = state.canvas.selectedId;
      const comp = state.canvas.components.find(c => c.id === selId);
      if (comp && comp.type === 'Fuse') {
        comp.state = comp.state || {};
        comp.state.blown = false;

        const freshErrors = detectAllErrors(state.canvas);
        state.canvas.alerts = freshErrors;
        state.canvas.blockingErrors = freshErrors;

        pushHistory();
        updateState({ canvas: state.canvas });
      }
    });
  }

  const toggleLabelsBtn = wrapper.querySelector('#btn-context-toggle-labels');
  if (toggleLabelsBtn) {
    toggleLabelsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selId = state.canvas.selectedId;
      const comp = state.canvas.components.find(c => c.id === selId);
      if (comp && comp.type === 'PanelPHB') {
        comp.state = comp.state || {};
        comp.state.labelsHidden = !comp.state.labelsHidden;
        updateState({ canvas: state.canvas });
      }
    });
  }

  const orthoWireBtn = wrapper.querySelector('#btn-context-ortho-wire');
  if (orthoWireBtn) {
    orthoWireBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selId = state.canvas.selectedId;
      const wire = state.canvas.wires.find(w => w.id === selId);
      if (wire && wire.from?.type === 'pin' && wire.to?.type === 'pin') {
        playUIClick();
        wire.mode = 'ortho';
        const intermediatePts = wire.path.slice(1, -1);
        wire.anchors = intermediatePts.map(p => ({ x: gridSnap(p.x), y: gridSnap(p.y) }));
        recomputeOrthoWirePath(wire);
        pushHistory();
        updateState({ canvas: state.canvas });
      }
    });
  }

  const autoWireBtn = wrapper.querySelector('#btn-context-auto-wire');
  if (autoWireBtn) {
    autoWireBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selId = state.canvas.selectedId;
      const wire = state.canvas.wires.find(w => w.id === selId);
      if (wire && wire.mode === 'ortho' && wire.manual) {
        playUIClick();
        wire.manual = false;
        wire.anchors = [];
        recomputeOrthoWirePath(wire);
        pushHistory();
        updateState({ canvas: state.canvas });
      }
    });
  }
}

// Helper: check if two wire endpoints refer to different locations (prevents zero-length self-loop)
function isDifferentEndpoint(a, b) {
  if (!a || !b) return false;
  if (a.type === 'pin' && b.type === 'pin') {
    return !(a.componentId === b.componentId && a.pinName === b.pinName);
  }
  if (a.type === 'wire' && b.type === 'wire') {
    // Compare by stable waypointId if available; fall back to insertAfterIndex inequality
    if (a.waypointId && b.waypointId) {
      return !(a.wireId === b.wireId && a.waypointId === b.waypointId);
    }
    // Mid-segment snap (insertAfterIndex only) — always treat as different from existing points
    return true;
  }
  // Mixed types are always different
  return true;
}

// Helper: when a waypoint moves, update any wires that branch from it.
// Uses stable waypointId to look up branches — immune to array index shifts from splice.
function updateBranchWires(parentWireId, wpId, newPos, branchIds) {
  state.canvas.wires.forEach(w => {
    if (w.from.type === 'wire' && w.from.wireId === parentWireId && w.from.waypointId === wpId) {
      w.path[0] = { id: w.path[0] && w.path[0].id, x: newPos.x, y: newPos.y };
      if (branchIds) branchIds.push(w.id);
    }
    if (w.to.type === 'wire' && w.to.wireId === parentWireId && w.to.waypointId === wpId) {
      const last = w.path.length - 1;
      w.path[last] = { id: w.path[last] && w.path[last].id, x: newPos.x, y: newPos.y };
      if (branchIds && !branchIds.includes(w.id)) branchIds.push(w.id);
    }
  });
}

// Helper: find the best segment index to insert a new waypoint (closest segment)
function findBestWaypointInsertionIndex(path, point) {
  let bestIdx = 1;
  let bestDist = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const ax = path[i].x, ay = path[i].y;
    const bx = path[i + 1].x, by = path[i + 1].y;

    // Distance from point to segment [a, b]
    const abx = bx - ax, aby = by - ay;
    const abLen2 = abx * abx + aby * aby;
    let t = abLen2 === 0 ? 0 : ((point.x - ax) * abx + (point.y - ay) * aby) / abLen2;
    t = Math.max(0, Math.min(1, t));

    const closestX = ax + t * abx;
    const closestY = ay + t * aby;
    const dist = Math.hypot(point.x - closestX, point.y - closestY);

    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i + 1;
    }
  }
  return bestIdx;
}

// Spawn component helper
function spawnComponent(type, x, y) {
  const typeInfo = COMPONENT_TYPES[type];
  if (!typeInfo) return;

  // Jobsheet: hanya boleh ada satu sumber listrik. Jika sudah ada, pilih yang ada dan beri tahu siswa.
  if (type.startsWith('Source_') && state.activeJobsheetId) {
    const existing = state.canvas.components.find(c => c.type.startsWith('Source_'));
    if (existing) {
      showToast('Sumber listrik sudah ada di kanvas.');
      focusOnCanvasObject(existing.id);
      return;
    }
  }
  
  // Align coordinates to center of component box
  const snapGrid = state.canvas.snapToGrid !== false;
  const rawX = x - typeInfo.width / 2;
  const rawY = y - typeInfo.height / 2;
  const spawnX = snapGrid ? Math.round(rawX / 10) * 10 : Math.round(rawX);
  const spawnY = snapGrid ? Math.round(rawY / 10) * 10 : Math.round(rawY);
  
  const newComp = {
    id: type.toLowerCase() + '_' + Date.now().toString().slice(-4),
    type: type,
    x: spawnX,
    y: spawnY,
    rotation: 0,
    state: initializeComponentState(type)
  };
  
  state.canvas.components.push(newComp);
  state.canvas.alerts = [];
  state.canvas.blockingErrors = [];
  pushHistory();
  updateState({ canvas: state.canvas });

}

// State variables instantiation per component type
function initializeComponentState(type) {
  switch (type) {
    case 'MCB_1P':
    case 'MCB_3P':
      return { on: false, tripped: false };
    case 'PanelPHB':
      return {
        mainOn: false, mainTripped: false,
        group1On: false, group1Tripped: false,
        group2On: false, group2Tripped: false,
        group3On: false, group3Tripped: false,
        labelsHidden: false
      };
    case 'SwitchSingle':
    case 'SwitchWay3':
    case 'SwitchCross':
      return { on: false };
    case 'SwitchDouble':
      return { on1: false, on2: false };
    case 'Lamp':
    case 'LampTL':
      return { on: false };
    default:
      return {};
  }
}

// Determine cable insulation color based on standard safety rules
function getWireColorForPin(from, to) {
  // Helper: resolve color from a 'wire' endpoint by looking up the parent wire's color
  function colorFromWireEndpoint(ep) {
    if (ep.type !== 'wire') return null;
    const parentWire = state.canvas.wires.find(w => w.id === ep.wireId);
    return parentWire ? parentWire.color : null;
  }

  // If one of the endpoints is a ground/arde pin, color green-yellow
  if ((from.type === 'pin' && (from.pinName === 'PE' || from.pinName === 'in_PE' || from.pinName === 'out_PE')) ||
      (to.type === 'pin' && (to.pinName === 'PE' || to.pinName === 'in_PE' || to.pinName === 'out_PE'))) {
    return 'green';
  }
  // Netral gets blue
  if ((from.type === 'pin' && (from.pinName === 'N' || from.pinName === 'in_N' || from.pinName === 'out_N')) ||
      (to.type === 'pin' && (to.pinName === 'N' || to.pinName === 'in_N' || to.pinName === 'out_N'))) {
    return 'blue';
  }

  // 3-Phase specific Phase assignments
  if (from.type === 'pin') {
    if (from.pinName === 'R' || from.pinName === 'in_R' || from.pinName === 'out_R' || from.pinName === 'out1_L') return 'red';
    if (from.pinName === 'S' || from.pinName === 'in_S' || from.pinName === 'out_S' || from.pinName === 'out2_L') return 'yellow';
    if (from.pinName === 'T' || from.pinName === 'in_T' || from.pinName === 'out_T' || from.pinName === 'out3_L') return 'black';
  }
  if (to.type === 'pin') {
    if (to.pinName === 'R' || to.pinName === 'in_R' || to.pinName === 'out_R' || to.pinName === 'out1_L') return 'red';
    if (to.pinName === 'S' || to.pinName === 'in_S' || to.pinName === 'out_S' || to.pinName === 'out2_L') return 'yellow';
    if (to.pinName === 'T' || to.pinName === 'in_T' || to.pinName === 'out_T' || to.pinName === 'out3_L') return 'black';
  }

  // Wire-to-wire junction: inherit color from the parent wire
  const fromWireColor = colorFromWireEndpoint(from);
  if (fromWireColor) return fromWireColor;
  const toWireColor = colorFromWireEndpoint(to);
  if (toWireColor) return toWireColor;

  return 'red'; // Default fasa R
}


// Re-calculate coordinates for attached wires when a component moves or rotates
// Helper: return IDs of all wires connected to any pin of a component (for hot-path DOM update)
function getAttachedWireIds(comp) {
  return state.canvas.wires
    .filter(w =>
      (w.from.type === 'pin' && w.from.componentId === comp.id) ||
      (w.to.type   === 'pin' && w.to.componentId   === comp.id)
    )
    .map(w => w.id);
}

function updateAttachedWires(comp) {
  const typeInfo = COMPONENT_TYPES[comp.type];
  const rot = comp.rotation || 0;
  
  state.canvas.wires.forEach(wire => {
    let attached = false;
    // Check if wire starts at this component
    if (wire.from.type === 'pin' && wire.from.componentId === comp.id) {
      const pin = typeInfo.pins.find(p => p.name === wire.from.pinName);
      const coord = getRotatedPinCoords(comp, pin, typeInfo, rot);
      wire.from.x = coord.x;
      wire.from.y = coord.y;
      wire.path[0] = { ...wire.path[0], x: coord.x, y: coord.y };
      attached = true;
    }
    
    // Check if wire ends at this component
    if (wire.to.type === 'pin' && wire.to.componentId === comp.id) {
      const pin = typeInfo.pins.find(p => p.name === wire.to.pinName);
      const coord = getRotatedPinCoords(comp, pin, typeInfo, rot);
      wire.to.x = coord.x;
      wire.to.y = coord.y;
      wire.path[wire.path.length - 1] = { ...wire.path[wire.path.length - 1], x: coord.x, y: coord.y };
      attached = true;
    }

    if (attached && wire.mode === 'ortho') {
      const hasBranch = state.canvas.wires.some(w => (w.from?.type === 'wire' && w.from?.wireId === wire.id) || (w.to?.type === 'wire' && w.to?.wireId === wire.id));
      if (!hasBranch && wire.from.type === 'pin' && wire.to.type === 'pin') {
        recomputeOrthoWirePath(wire);
      }
    }
  });
}

// Helper to get absolute coordinates of pin considering component rotation
function getRotatedPinCoords(comp, pin, typeInfo, rot) {
  const cx = typeInfo.width / 2;
  const cy = typeInfo.height / 2;
  const rad = (rot * Math.PI) / 180;
  
  const rx = Math.cos(rad) * (pin.x - cx) - Math.sin(rad) * (pin.y - cy) + cx;
  const ry = Math.sin(rad) * (pin.x - cx) + Math.cos(rad) * (pin.y - cy) + cy;
  
  return {
    x: comp.x + rx,
    y: comp.y + ry
  };
}

// Toggle component internal states (Switches / Breakers) on click during simulation
function toggleComponentState(compId, coords, compEl) {
  const comp = state.canvas.components.find(c => c.id === compId);
  if (!comp) return;
  
  // Sekring (Fuse) kawat lebur putus permanen dan tidak dapat di-klik untuk toggle/reset layaknya saklar/MCB
  if (comp.type === 'Fuse') {
    return;
  }
  
  // Audio effect click
  playSwitchClick();

  if (comp.type === 'PanelPHB') {
    const info = COMPONENT_TYPES.PanelPHB || { width: 140, height: 160 };
    const rot = comp.rotation || 0;
    const cx = info.width / 2;
    const cy = info.height / 2;
    const rad = (-rot * Math.PI) / 180;
    const dx = coords.x - comp.x - cx;
    const dy = coords.y - comp.y - cy;
    const localX = Math.cos(rad) * dx - Math.sin(rad) * dy + cx;
    const localY = Math.sin(rad) * dx + Math.cos(rad) * dy + cy;

    comp.state = comp.state || {
      mainOn: false, mainTripped: false,
      group1On: false, group1Tripped: false,
      group2On: false, group2Tripped: false,
      group3On: false, group3Tripped: false,
      labelsHidden: false
    };

    // Area ATAS komponen (kira-kira 0-45% tinggi komponen dari atas) -> Main
    if (localY < info.height * 0.45) {
      comp.state.mainOn = !comp.state.mainOn;
      comp.state.mainTripped = false;
    } else {
      // Area BAWAH dibagi 3 zona kolom secara horizontal (Grup 1, Grup 2, Grup 3)
      const colWidth = info.width / 3;
      if (localX < colWidth) {
        comp.state.group1On = !comp.state.group1On;
        comp.state.group1Tripped = false;
      } else if (localX < colWidth * 2) {
        comp.state.group2On = !comp.state.group2On;
        comp.state.group2Tripped = false;
      } else {
        comp.state.group3On = !comp.state.group3On;
        comp.state.group3Tripped = false;
      }
    }
  } else if (comp.type === 'SwitchDouble') {
    // Series switch has two independent halves. Detect which half was clicked.
    // Coordinates are local.
    const clickX = coords.x - comp.x;
    
    comp.state = comp.state || { on1: false, on2: false };
    if (clickX < 40) {
      comp.state.on1 = !comp.state.on1;
    } else {
      comp.state.on2 = !comp.state.on2;
    }
  } else {
    // Single poles switches / MCBs
    comp.state = comp.state || {};
    comp.state.on = !comp.state.on;
    
    // Reset tripped state if manually resetting breaker
    if (comp.type === 'MCB_1P' || comp.type === 'MCB_3P') {
      comp.state.tripped = false;
    }
  }
  
  // Re-run evaluation instantly to show animated flow update
  updateState({ canvas: state.canvas });
}

export function disposeLabCanvas() {
  _winAC?.abort();
  _winAC = null;
  resetInteractionState();
}

