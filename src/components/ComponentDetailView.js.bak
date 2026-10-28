// Component Detail View - Virtual Lab IPL
import { navigate, state } from '../main.js';
import { playUIClick } from '../utils/audioFeedback.js';
import { findGridItemDetail } from './MateriView.js';
import { resolveAssetUrl } from '../data/realisticAssets.js';
import { renderMcbMechanismWidget } from './McbMechanismWidget.js';
import { renderFuseMechanismWidget } from './FuseMechanismWidget.js';
import { renderSwitchSingleMechanismWidget } from './SwitchSingleMechanismWidget.js';
import { renderSwitchDoubleMechanismWidget } from './SwitchDoubleMechanismWidget.js';
import { renderSwitchWay3MechanismWidget } from './SwitchWay3MechanismWidget.js';
import { renderSwitchCrossMechanismWidget } from './SwitchCrossMechanismWidget.js';
import { renderSocketMechanismWidget } from './SocketMechanismWidget.js';
import { renderLampMechanismWidget } from './LampMechanismWidget.js';
import { renderFittingMechanismWidget } from './FittingMechanismWidget.js';
import { renderLampTLMechanismWidget } from './LampTLMechanismWidget.js';
import { renderMcb3PMechanismWidget } from './Mcb3PMechanismWidget.js';
import { renderApdChecklistWidget } from './ApdChecklistWidget.js';
import { renderSopSequenceWidget } from './SopSequenceWidget.js';
import { renderHazardSpotWidget } from './HazardSpotWidget.js';
import { renderP3kSequenceWidget } from './P3kSequenceWidget.js';
import { renderRambuMatchingWidget } from './RambuMatchingWidget.js';
import { renderVoltageMeasureWidget } from './VoltageMeasureWidget.js';
import { renderWyeDeltaToggleWidget } from './WyeDeltaToggleWidget.js';
import { renderLoadBalanceWidget } from './LoadBalanceWidget.js';

const mechanismWidgets = {
  komp_mcb1p: renderMcbMechanismWidget,
  komp_fuse: renderFuseMechanismWidget,
  komp_saklar_tunggal: renderSwitchSingleMechanismWidget,
  komp_saklar_seri: renderSwitchDoubleMechanismWidget,
  komp_saklar_tukar: renderSwitchWay3MechanismWidget,
  komp_saklar_silang: renderSwitchCrossMechanismWidget,
  komp_stop_kontak: renderSocketMechanismWidget,
  komp_lampu: renderLampMechanismWidget,
  komp_fitting: renderFittingMechanismWidget,
  komp_lampu_tl: renderLampTLMechanismWidget,
  komp_mcb3p: renderMcb3PMechanismWidget,
  // K3LH Interactive Widgets
  k3lh_apd: renderApdChecklistWidget,
  k3lh_sop: renderSopSequenceWidget,
  k3lh_bahaya: renderHazardSpotWidget,
  k3lh_p3k: renderP3kSequenceWidget,
  k3lh_rambu: renderRambuMatchingWidget,
  // Sistem 3 Fasa Interactive Widgets
  '3f_tegangan': renderVoltageMeasureWidget,
  '3f_sambungan': renderWyeDeltaToggleWidget,
  '3f_balancing': renderLoadBalanceWidget
};

export function renderComponentDetailPage(detailId) {
  const app = document.getElementById('app');
  const targetId = detailId || state.activeComponentDetailId;
  const item = findGridItemDetail(targetId);
  if (!item) {
    navigate('materi');
    return;
  }

  const imgSrc = item.imagePath || '';
  const partsImgSrc = item.detail && item.detail.partsImagePath ? resolveAssetUrl(item.detail.partsImagePath) : null;
  const parts = item.detail && item.detail.parts ? item.detail.parts : [];
  const detailItems = item.detail && item.detail.items ? item.detail.items : [];
  const sections = item.detail && item.detail.sections ? item.detail.sections : [];
  const renderSection = s => `
  <section class="detail-section">
    <h2><i class="bi ${s.icon || 'bi-journal-text'}" style="margin-right: 8px; color: var(--accent-color);"></i>${s.heading}</h2>
    <div class="detail-content">
      ${(s.paragraphs || []).map(p => `<p class="detail-p">${p}</p>`).join('')}
      ${s.figure ? `
        <figure class="detail-figure">
          <img src="${resolveAssetUrl(s.figure.src)}" alt="${s.figure.alt}" loading="lazy" decoding="async"
               width="${s.figure.width || 720}" height="${s.figure.height || 400}"
               onerror="this.parentElement.style.display='none'"/>
          <figcaption>${s.figure.caption || ''}</figcaption>
        </figure>` : ''}
      ${s.items && s.items.length ? `<ul class="detail-list">${s.items.map(it => `<li>${it}</li>`).join('')}</ul>` : ''}
      ${s.callout ? `<div class="detail-callout"><strong>${s.callout.title}</strong><p>${s.callout.text}</p></div>` : ''}
    </div>
  </section>`;

  app.innerHTML = `
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-nav-back-materi" title="Kembali ke Materi" aria-label="Kembali ke Materi">
          <span><i class="bi bi-arrow-left"></i></span><span class="btn-back-text"> Kembali ke Materi</span>
        </button>
        <span class="nav-title">Detail Materi & Komponen</span>
      </div>
      <div class="nav-actions">
        <span class="nav-meta">SMK TITL - Kelas XI</span>
      </div>
    </nav>

    <div class="component-detail-page">
      <button id="btn-back-to-materi" class="btn-back-link" title="Kembali ke Materi" aria-label="Kembali ke Materi">
        <i class="bi bi-arrow-left"></i> Kembali ke Materi
      </button>

      <div class="detail-hero">
        ${imgSrc ? `<img src="${imgSrc}" alt="${item.name}" class="detail-hero-img" fetchpriority="high" decoding="async" width="200" height="180" onerror="this.style.display='none'"/>` : ''}
        <h1>${item.name}</h1>
        <p class="detail-summary">${item.desc}</p>
      </div>

      <section class="detail-section">
        <h2><i class="bi bi-gear-wide-connected" style="margin-right: 8px; color: var(--accent-color);"></i>Penjelasan & Teori</h2>
        <div class="detail-content">
          ${item.detail.content ? `<p style="line-height: 1.6; margin-bottom: 12px;">${item.detail.content}</p>` : ''}
          ${detailItems.length ? `
            <ul style="padding-left: 20px; line-height: 1.6; color: var(--text-secondary);">
              ${detailItems.map(it => `<li style="margin-bottom: 8px;">${it}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </section>

      ${sections.map(renderSection).join('')}

      ${partsImgSrc || parts.length ? `
      <section class="detail-section">
        <h2><i class="bi bi-diagram-3-fill" style="margin-right: 8px; color: var(--accent-color);"></i>Bagian-Bagian Komponen</h2>
        ${partsImgSrc ? `
          <div class="detail-parts-img-wrapper">
            <img src="${partsImgSrc}" alt="Bagian-bagian ${item.name}" class="detail-parts-img" loading="lazy" decoding="async" width="600" height="400" onerror="this.parentElement.style.display='none'"/>
          </div>
        ` : ''}
        ${parts.length ? `
          <ol class="detail-parts-list">
            ${parts.map(p => `<li><strong>${p.name}</strong> &mdash; ${p.description}</li>`).join('')}
          </ol>
        ` : ''}
      </section>
      ` : ''}

      ${item.detail && item.detail.hasInteractiveMechanism ? `
      <section class="detail-section">
        <h2><i class="bi bi-cpu" style="margin-right: 8px; color: var(--accent-color);"></i>Aktivitas Interaktif & Simulasi</h2>
        <div id="mcb-mechanism-container"></div>
      </section>
      ` : ''}

      ${item.presetKey ? `
        <div style="margin-top: 32px; text-align: center;">
          <button class="btn-accent btn-try-simulator" data-preset="${item.presetKey}" style="padding: 12px 28px; font-size: 1rem; border-radius: 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
            <i class="bi bi-cpu-fill"></i> Coba di Simulator
          </button>
        </div>
      ` : ''}
    </div>
  `;

  // Render interactive widgets if enabled
  if (item.detail && item.detail.hasInteractiveMechanism && mechanismWidgets[item.detailId]) {
    mechanismWidgets[item.detailId]('mcb-mechanism-container');
  }

  const handleBack = () => {
    playUIClick();
    navigate('materi');
  };

  const btnNavBack = document.getElementById('btn-nav-back-materi');
  if (btnNavBack) btnNavBack.addEventListener('click', handleBack);

  const btnBack = document.getElementById('btn-back-to-materi');
  if (btnBack) btnBack.addEventListener('click', handleBack);

  const tryBtn = app.querySelector('.btn-try-simulator');
  if (tryBtn) {
    tryBtn.addEventListener('click', () => {
      playUIClick();
      navigate('canvas_free', { presetKey: item.presetKey });
    });
  }
}
