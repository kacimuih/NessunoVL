// Universal App Modal Dialog Component - Virtual Lab IPL
import { playUIClick } from './audioFeedback.js';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DEFAULT_ICONS = {
  error: 'bi-x-circle-fill',
  success: 'bi-check-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill'
};

/**
 * Tampilkan dialog popup modal kustom bergaya kelayakan jobsheet (.vr-*)
 * @returns {Promise<boolean>} true jika tombol konfirmasi ditekan, false jika batal/Esc/klik luar
 */
export function showAppDialog({
  variant = 'error',
  icon,
  title = '',
  badge = '',
  message = '',
  noteHTML = '',
  details = [],
  confirmText = 'Mengerti',
  cancelText
}) {
  return new Promise((resolve) => {
    // 1. Bersihkan dialog lama jika masih ada (cegah popup dobel)
    const existing = document.getElementById('app-dialog-overlay');
    if (existing) {
      if (existing._cleanup) existing._cleanup(false);
      existing.remove();
    }

    const previousActiveElement = document.activeElement;

    // 2. Buat overlay elemen
    const overlay = document.createElement('div');
    overlay.id = 'app-dialog-overlay';
    overlay.className = 'vr-overlay';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'app-dialog-title');

    const iconClass = icon || DEFAULT_ICONS[variant] || 'bi-info-circle-fill';

    const detailsHTML = (Array.isArray(details) && details.length > 0) ? `
      <div class="vr-details-list">
        ${details.map(d => `
          <div class="vr-detail-item">
            <span class="vr-detail-label">${escapeHtml(d.label)}:</span>
            <span class="vr-detail-value">${escapeHtml(d.value)}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    const cancelButtonHTML = cancelText ? `
      <button id="app-dialog-cancel" class="vr-btn-secondary">
        ${escapeHtml(cancelText)}
      </button>
    ` : '';

    overlay.innerHTML = `
      <div class="vr-dialog vr-${variant}">
        <div class="vr-header">
          <span class="vr-icon"><i class="bi ${iconClass}"></i></span>
          <div class="vr-title-group">
            <h3 class="vr-title" id="app-dialog-title">${escapeHtml(title)}</h3>
            ${badge ? `<div class="vr-badge-jobsheet">${escapeHtml(badge)}</div>` : ''}
          </div>
        </div>

        ${message ? `<p class="vr-body">${escapeHtml(message)}</p>` : ''}

        ${noteHTML ? `<div class="vr-note-box">${noteHTML}</div>` : ''}

        ${detailsHTML}

        <div class="vr-actions">
          ${cancelButtonHTML}
          <button id="app-dialog-confirm" class="vr-btn-primary-${variant}">
            ${escapeHtml(confirmText)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    let isCleanedUp = false;
    function cleanup(result) {
      if (isCleanedUp) return;
      isCleanedUp = true;
      document.removeEventListener('keydown', handleKeyDown);
      overlay.remove();
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        try {
          previousActiveElement.focus();
        } catch (_) {}
      }
      resolve(result);
    }
    overlay._cleanup = cleanup;

    // Focus Trap & Keyboard Navigation
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        cleanup(false);
        return;
      }

      if (e.key === 'Tab') {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusables = Array.from(overlay.querySelectorAll(focusableSelectors));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !overlay.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !overlay.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Click outside to cancel
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        playUIClick();
        cleanup(false);
      }
    });

    // Buttons listener
    const btnConfirm = overlay.querySelector('#app-dialog-confirm');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        playUIClick();
        cleanup(true);
      });
    }

    const btnCancel = overlay.querySelector('#app-dialog-cancel');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        playUIClick();
        cleanup(false);
      });
    }

    // Auto-focus primary button
    setTimeout(() => {
      const primaryBtn = btnConfirm || btnCancel;
      if (primaryBtn) primaryBtn.focus();
    }, 50);
  });
}

/**
 * Dialog konfirmasi (Ya/Batal)
 */
export function showConfirmDialog({
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'warning'
}) {
  return showAppDialog({
    variant,
    title,
    message,
    confirmText,
    cancelText
  });
}

/**
 * Dialog alert sederhana (informasi/sukses)
 */
export function showAlertDialog({
  variant = 'info',
  title,
  message,
  confirmText = 'Mengerti'
}) {
  return showAppDialog({
    variant,
    title,
    message,
    confirmText
  }).then(() => {});
}

/**
 * Dialog khusus peringatan korsleting (Trip Breaker)
 */
export function showShortCircuitDialog({ message, location, isTroubleshoot = false }) {
  const details = [];
  if (!isTroubleshoot && location) {
    details.push({ label: 'Di mana', value: location });
  }

  const finalMessage = isTroubleshoot
    ? 'Terjadi hubungan singkat (korsleting) pada rangkaian sehingga MCB trip otomatis untuk mengamankan instalasi.'
    : (message || 'Terjadi hubungan singkat (korsleting) pada rangkaian.');

  const noteHTML = '<i class="bi bi-shield-fill-exclamation" style="margin-right:4px;"></i> MCB trip otomatis (atau sekring putus) untuk mengamankan instalasi dari arus hubung singkat.';

  return showAppDialog({
    variant: 'error',
    icon: 'bi-lightning-charge-fill',
    title: 'TRIP BREAKER (KORSLETING)!',
    message: finalMessage,
    noteHTML,
    details,
    confirmText: 'Mengerti'
  }).then(() => {});
}

// Pesan singkat yang tidak memblokir (hilang sendiri). Dibaca pembaca layar lewat aria-live.
export function showToast(message, ms = 2600) {
  document.getElementById('app-toast')?.remove();
  const el = document.createElement('div');
  el.id = 'app-toast'; el.className = 'app-toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => { el.classList.remove('is-visible'); setTimeout(() => el.remove(), 250); }, ms);
}
