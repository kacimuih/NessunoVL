// Materi View Component - Virtual Lab IPL

import { materiData } from '../data/materiData.js';
import { resolveAssetUrl } from '../data/realisticAssets.js';
import { MATERI_PRESETS } from '../data/materiPresets.js';
import { updateState, state, navigate } from '../main.js';
import { playUIClick } from '../utils/audioFeedback.js';


export function renderMateriView() {
  const container = document.getElementById('app');
  const activeId = state.activeMateriId || 'k3lh';
  const activeData = materiData[activeId];

  // Render header navbar
  let html = `
    <nav class="navbar">
      <div class="nav-brand">
        <button class="btn-nav-back" id="btn-back-home" title="Kembali ke Beranda" aria-label="Kembali ke Beranda">
          <span><i class="bi bi-arrow-left"></i></span><span class="btn-back-text"> Kembali</span>
        </button>
        <span class="nav-title">Buku Materi IPL</span>
      </div>
      <div class="nav-actions">
        <span class="nav-meta">SMK TITL - Kelas XI</span>
      </div>
    </nav>

    <div class="materi-container">
      <!-- Sidebar Navigation -->
      <aside class="materi-sidebar">
        <div class="materi-tab-header">Daftar Materi</div>
        <ul class="materi-list">
  `;

  // Generate sidebar list
  Object.keys(materiData).forEach(key => {
    const item = materiData[key];
    const isActive = key === activeId ? 'active' : '';
    const iconHtml = item.icon ? (item.icon.startsWith('bi-') ? `<i class="bi ${item.icon}"></i>` : item.icon) : '';
    html += `
      <li class="materi-item ${isActive}" data-id="${key}">
        <span>${iconHtml}</span>
        <span>${item.title}</span>
      </li>
    `;
  });

  html += `
        </ul>
      </aside>

      <!-- Main Materi Content -->
      <main class="materi-content">
        <article class="materi-body">
          <h2>${activeData.title}</h2>
  `;

  // Render sections
  activeData.sections.forEach(section => {
    html += `
      <section class="materi-section">
        <h3>${section.subtitle}</h3>
        ${section.content ? `<p>${section.content}</p>` : ''}
    `;

    // Render items if any
    if (section.items) {
      html += '<ul style="padding-left: 20px; margin-bottom: 20px; color: var(--text-secondary);">';
      section.items.forEach(item => {
        html += `<li style="margin-bottom: 8px; line-height: 1.5;">${item}</li>`;
      });
      html += '</ul>';
    }

    // Render grid items (Universal template for all categories)
    if (section.gridItems) {
      html += '<div class="grid-list">';
      section.gridItems.forEach((grid, gridIdx) => {
        const imgSrc = grid.imagePath ? resolveAssetUrl(grid.imagePath) : null;
        const symClass = grid.symbol ? (grid.symbol.startsWith('bi-') ? grid.symbol : `bi-${grid.symbol}`) : '';
        let placeholderHtml = '';

        if (!imgSrc && !grid.symbolPath && grid.symbol) {
          placeholderHtml = `<div class="icon-tile"><i class="bi ${symClass}"></i></div>`;
        } else if (imgSrc) {
          if (grid.symbolPath) {
            placeholderHtml = `
              <div class="alat-img-placeholder" style="display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="${imgSrc}" alt="${grid.name}" loading="lazy" decoding="async" width="120" height="90" style="width:100%; height:100%; object-fit:contain; border-radius:4px;" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';" />
                <div class="symbol-svg" style="display:none;">${grid.symbolPath}</div>
              </div>
            `;
          } else if (grid.symbol) {
            placeholderHtml = `
              <div class="alat-img-placeholder" style="display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="${imgSrc}" alt="${grid.name}" loading="lazy" decoding="async" width="120" height="90" style="width:100%; height:100%; object-fit:contain; border-radius:4px;" onerror="const p=this.parentElement; if(p){ p.className='icon-tile'; p.removeAttribute('style'); p.innerHTML='<i class=&quot;bi ${symClass}&quot;></i>'; }" />
              </div>
            `;
          } else {
            placeholderHtml = `
              <div class="alat-img-placeholder" style="display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="${imgSrc}" alt="${grid.name}" loading="lazy" decoding="async" width="120" height="90" style="width:100%; height:100%; object-fit:contain; border-radius:4px;" onerror="this.style.display='none';" />
              </div>
            `;
          }
        } else if (grid.symbolPath) {
          placeholderHtml = `
            <div class="alat-img-placeholder" style="display:flex; align-items:center; justify-content:center; overflow:hidden;">
              <div class="symbol-svg">${grid.symbolPath}</div>
            </div>
          `;
        } else if (grid.symbol) {
          placeholderHtml = `<div class="icon-tile"><i class="bi ${symClass}"></i></div>`;
        }

        html += `
          <div class="alat-card" ${grid.detail ? `data-detail-id="${grid.detailId}"` : ''} ${grid.detail ? 'style="cursor:pointer;"' : ''}>
            ${placeholderHtml}
            <h4>${grid.name}</h4>
            <p>${grid.desc}</p>
            ${grid.detail ? `<button class="btn-baca-selengkapnya" data-detail-id="${grid.detailId}" style="margin-top:8px; background:none; border:none; color: var(--accent-color); font-weight:600; cursor:pointer; padding:0; font-size:0.85rem;"><i class="bi bi-book-half"></i> Baca Selengkapnya</button>` : ''}
            ${grid.presetKey && MATERI_PRESETS && MATERI_PRESETS[grid.presetKey] ? `
              <div style="margin-top: 10px; width: 100%;">
                <button class="btn-accent btn-try-simulator" data-preset="${grid.presetKey}" style="width: 100%; font-size: 0.8rem; padding: 6px 10px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; border-radius: 6px; font-weight: 600;">
                  <i class="bi bi-wrench-adjustable"></i> Coba di Simulator
                </button>
              </div>
            ` : ''}
          </div>
        `;
      });
      html += '</div>';
    }

    html += `</section>`;
  });

  html += `
        </article>
      </main>
    </div>
  `;

  container.innerHTML = html;

  // Add event listeners
  document.getElementById('btn-back-home').addEventListener('click', () => {
    navigate('home');
  });

  const items = container.querySelectorAll('.materi-item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      playUIClick();
      const targetId = e.currentTarget.getAttribute('data-id');
      updateState({ activeMateriId: targetId });
      if (window.innerWidth <= 768) {
        const contentEl = document.querySelector('.materi-content');
        if (contentEl) {
          contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  const tryBtns = container.querySelectorAll('.btn-try-simulator');
  tryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const presetKey = btn.getAttribute('data-preset');
      if (presetKey) {
        navigate('canvas_free', { presetKey });
      }
    });
  });

  // Event listeners for detail page
  const detailCards = container.querySelectorAll('.alat-card[data-detail-id]');
  detailCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-try-simulator')) return;
      const detailId = card.getAttribute('data-detail-id');
      const item = findGridItemDetail(detailId);
      if (item) {
        playUIClick();
        navigate('component_detail', { detailId });
      }
    });
  });

  const bacaBtns = container.querySelectorAll('.btn-baca-selengkapnya');
  bacaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const detailId = btn.getAttribute('data-detail-id');
      const item = findGridItemDetail(detailId);
      if (item) {
        playUIClick();
        navigate('component_detail', { detailId });
      }
    });
  });
}

export function findGridItemDetail(detailId) {
  if (!detailId) return null;
  for (const key of Object.keys(materiData)) {
    const cat = materiData[key];
    if (cat.sections) {
      for (const sec of cat.sections) {
        if (sec.gridItems) {
          const found = sec.gridItems.find(item => item.detailId === detailId);
          if (found) return found;
        }
      }
    }
  }
  return null;
}

