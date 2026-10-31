/* Sekeping V24 | Standalone enhancement for the existing V23 filter drawer.
   No changes to camera, capture, filter export or the site's stored settings. */
(() => {
  'use strict';
  const app = document.getElementById('app');
  if (!app) return;
  const labels = {
    natural: ['Asli','Warna semula jadi'],
    klasik94: ['Klasik 94','Klasik & hangat'],
    kodak: ['Kodak Gold','Emas nostalgia'],
    fuji: ['Fuji 400','Filem lembut'],
    dreamy: ['Dreamy','Cahaya romantik'],
    bw: ['B&W Klasik','Hitam putih abadi']
  };
  const escapeText = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function selectedInfo(panel) {
    const selected = panel.querySelector('.filter-preview-card.active, .filter-preview-card[aria-pressed="true"]');
    const key = selected?.getAttribute('data-filter') || 'natural';
    const fallback = selected?.querySelector('.filter-name')?.textContent?.trim() || 'Asli';
    const [label,desc] = labels[key] || [fallback,'Gaya pilihan anda'];
    const filter = selected?.querySelector('.filter-landscape')?.style.filter || 'none';
    return { key, label, desc, filter };
  }

  function make(tag, cls, html) {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (html !== undefined) element.innerHTML = html;
    return element;
  }

  function augment(panel) {
    if (panel.dataset.sk24Enhanced === 'yes') return;
    panel.dataset.sk24Enhanced = 'yes';
    panel.classList.add('sk24-panel');
    const header=panel.querySelector('.filter-studio-header');
    const grid=panel.querySelector('.filter-preview-grid');
    const effectsHeading=panel.querySelector('.effects-heading');
    const effectsGrid=panel.querySelector('.effects-grid');
    if (!header || !grid || !effectsGrid) return;
    const count=grid.querySelectorAll('.filter-preview-card').length;
    const info=selectedInfo(panel);

    const hero=make('div','sk24-current-look',`
      <span class="sk24-current-scene" aria-hidden="true"><span class="sk24-mini-scene" style="filter:${info.filter}"><i></i><b></b><em></em></span></span>
      <span class="sk24-current-copy"><span class="sk24-meta">GAYA PILIHAN ANDA</span><strong class="sk24-active-name">${escapeText(info.label)}</strong><small class="sk24-active-desc">${escapeText(info.desc)}</small></span>
      <span class="sk24-active-pill"><span class="sk24-active-dot"></span> AKTIF</span>
    `);
    header.after(hero);

    const filterHeading=make('div','sk24-section-label',`<div><span class="sk24-section-index">01</span><strong>Koleksi filter</strong></div><small>${count} pilihan eksklusif</small>`);
    grid.before(filterHeading);
    const gridHint=make('p','sk24-grid-hint','Sentuh gaya untuk mencuba terus pada kamera.');
    grid.after(gridHint);

    if (effectsHeading) {
      effectsHeading.classList.add('sk24-effects-heading');
      const index=make('span','sk24-effects-index','02');
      effectsHeading.prepend(index);
    }
    effectsGrid.classList.add('sk24-effect-list');

    const button=panel.querySelector('.sk21-drawer-done');
    if (button) {
      button.classList.add('sk24-done');
      button.textContent='Selesai · Kembali ke kamera';
      button.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    }
    const originalTitle=header.querySelector('h2');
    if (originalTitle) originalTitle.textContent='Pilih suasana';
    const desc=header.querySelector('p');
    if (desc) desc.textContent='Sentuhan klasik untuk setiap kenangan.';
    const label=header.querySelector('.micro');
    if (label) label.textContent='SEKEPING  /  CAMERA STUDIO';
    panel.querySelector('.sk22-panel-active')?.classList.add('sk24-hide-original-active');
    panel.querySelector('.filter-category-row')?.classList.add('sk24-hide-categories');
  }

  let scheduled=false;
  function refresh() {
    scheduled=false;
    const panel=app.querySelector('.sek-camera-v23 #filterStudio, .sek-camera-v22 #filterStudio');
    if (!panel) return;
    augment(panel);
    const info=selectedInfo(panel);
    const name=panel.querySelector('.sk24-active-name');
    if (name && name.textContent!==info.label) name.textContent=info.label;
    const desc=panel.querySelector('.sk24-active-desc');
    if (desc && desc.textContent!==info.desc) desc.textContent=info.desc;
    const scene=panel.querySelector('.sk24-mini-scene');
    if (scene && scene.style.filter!==info.filter) scene.style.filter=info.filter;
  }
  function queueRefresh() {
    if (!scheduled) { scheduled=true; requestAnimationFrame(refresh); }
  }
  // app.js replaces the guest section whenever a filter is selected, so restyle
  // the new section automatically; use an idempotent marker to avoid loops.
  const observer=new MutationObserver(queueRefresh);
  observer.observe(app,{childList:true,subtree:true});
  app.addEventListener('click', event => {
    if (event.target.closest('#filterStudio [data-filter]')) queueRefresh();
  });
  queueRefresh();
})();
