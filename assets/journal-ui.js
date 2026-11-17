/* Independent parchment, bronze rail, and draggable amethyst for the Quest Journal.
 * Does not change adventure.js, progress, chapter unlocks, or the Curios panel.
 */
(() => {
  const assetRoot = 'assets/journal/';
  const files = {
    page: assetRoot + 'journal_page.webp',
    track: assetRoot + 'bronze_scrollbar_track.webp',
    gem: assetRoot + 'amethyst_slider.webp'
  };
  const minGemTop = 17.19;
  const maxGemTop = 65.76;
  const gemHeight = 14.45;
  const load = src => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
  function mount() {
    const sheet = document.querySelector('.rpg-sheet');
    const body = document.getElementById('rpg-sheet-body');
    const title = document.getElementById('rpg-sheet-title');
    if (!sheet || !body || !title || sheet.dataset.illustratedJournal) return;
    sheet.dataset.illustratedJournal = 'loading';
    // Keep the established sheet unchanged until all three artwork files load.
    Promise.all(Object.values(files).map(load)).then(() => {
      const art = document.createElement('div');
      art.className = 'journal-illustration';
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = `<img class="journal-page-art" src="${files.page}" alt="" draggable="false"><img class="journal-track-art" src="${files.track}" alt="" draggable="false"><img class="journal-gem-art" src="${files.gem}" alt="" draggable="false">`;
      art.hidden = true;
      const gem = art.querySelector('.journal-gem-art');
      const rail = document.createElement('div');
      rail.className = 'journal-drag-rail';
      rail.hidden = true;
      rail.tabIndex = 0;
      rail.setAttribute('role', 'scrollbar');
      rail.setAttribute('aria-label', 'Scroll the adventure journal');
      rail.setAttribute('aria-controls', 'rpg-sheet-body');
      rail.setAttribute('aria-orientation', 'vertical');
      rail.setAttribute('aria-valuemin', '0');
      rail.setAttribute('aria-valuemax', '100');
      sheet.prepend(art, rail);
      const maxScroll = () => Math.max(0, body.scrollHeight - body.clientHeight);
      function updateGem() {
        const max = maxScroll();
        const fraction = max ? Math.min(1, Math.max(0, body.scrollTop / max)) : 0;
        gem.style.top = `${(minGemTop + fraction * (maxGemTop - minGemTop)).toFixed(3)}%`;
        rail.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
        rail.setAttribute('aria-valuetext', `${Math.round(fraction * 100)} percent through journal`);
      }
      function scrollToPointer(y) {
        const rect = sheet.getBoundingClientRect();
        const yFraction = (y - rect.top) / rect.height;
        const fraction = (yFraction * 100 - minGemTop - gemHeight / 2) / (maxGemTop - minGemTop);
        body.scrollTop = Math.min(1, Math.max(0, fraction)) * maxScroll();
        updateGem();
      }
      rail.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        event.preventDefault();
        rail.setPointerCapture(event.pointerId);
        scrollToPointer(event.clientY);
      });
      rail.addEventListener('pointermove', event => {
        if (rail.hasPointerCapture(event.pointerId)) scrollToPointer(event.clientY);
      });
      rail.addEventListener('pointerup', event => {
        if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      });
      rail.addEventListener('pointercancel', event => {
        if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      });
      rail.addEventListener('wheel', event => {
        event.preventDefault();
        body.scrollTop += event.deltaY;
      }, { passive: false });
      rail.addEventListener('keydown', event => {
        const max = maxScroll();
        const delta = ({ArrowDown: .08, ArrowUp: -.08, PageDown: .3, PageUp: -.3})[event.key];
        if (delta !== undefined) body.scrollTop += delta * max;
        else if (event.key === 'Home') body.scrollTop = 0;
        else if (event.key === 'End') body.scrollTop = max;
        else return;
        event.preventDefault();
        updateGem();
      });
      body.addEventListener('scroll', updateGem, { passive: true });
      window.addEventListener('resize', updateGem, { passive: true });
      if ('ResizeObserver' in window) new ResizeObserver(updateGem).observe(body);
      function syncPanel() {
        const active = !sheet.hidden && title.textContent.trim() === 'The Rogue Witch’s Journal';
        sheet.classList.toggle('is-illustrated-journal', active);
        art.hidden = !active;
        rail.hidden = !active;
        if (active) requestAnimationFrame(updateGem);
      }
      const observer = new MutationObserver(syncPanel);
      observer.observe(title, { childList: true, characterData: true, subtree: true });
      observer.observe(sheet, { attributes: true, attributeFilter: ['hidden'] });
      sheet.dataset.illustratedJournal = 'ready';
      syncPanel();
    }).catch(() => {
      sheet.dataset.illustratedJournal = 'unavailable';
      // Missing assets: retain the original functional Journal panel.
      console.warn('Illustrated journal assets are not yet available; original panel retained.');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
