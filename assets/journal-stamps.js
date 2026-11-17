/* Fixed kingdom stamp assignments for existing clickable Journal controls.
   Never randomizes, rotates, or changes quest click listeners or progress.
   Gracefully leaves all buttons in their original state if artwork is absent. */
(() => {
  'use strict';
  const origins = ['moonreach', 'thornmere', 'starfen', 'emberfjord'];
  const stampFiles = origins.map(origin => 'assets/stamps/' + origin + '.webp');
  const loadStamp = url => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => image.naturalWidth ? resolve() : reject(new Error(url));
    image.onerror = reject;
    image.src = url;
  });

  /* Chapter order is stable even when new chapters unlock. The widths are
     intentionally different and long chapter titles get wider stamps. */
  const chapters = [
    ['moonreach', 168],
    ['emberfjord', 254],
    ['starfen', 239],
    ['thornmere', 193],
    ['starfen', 221],
    ['emberfjord', 248],
    ['moonreach', 180],
    ['thornmere', 201]
  ];
  const actions = [
    ['.progress-card .text-button', 'starfen', 218],
    ['#complete-button', 'emberfjord', 255]
  ];

  function mount() {
    const sheet = document.querySelector('.rpg-sheet');
    const body = document.querySelector('#rpg-sheet-body');
    if (!sheet || !body || sheet.dataset.kingdomStamps) return;
    sheet.dataset.kingdomStamps = 'loading';
    Promise.all(stampFiles.map(loadStamp)).then(() => {
      function decorate(button, origin, width) {
        if (!button || button.tagName !== 'BUTTON') return;
        if (button.dataset.stampOrigin !== origin) {
          for (const old of origins) button.classList.remove('stamp-' + old);
          button.classList.add('journal-stamp', 'stamp-' + origin);
          button.dataset.stampOrigin = origin;
        }
        if (button.style.getPropertyValue('--stamp-width') !== width + 'px') {
          button.style.setProperty('--stamp-width', width + 'px');
        }
      }
      let scheduled = false;
      function apply() {
        scheduled = false;
        if (!sheet.classList.contains('is-illustrated-journal')) return;
        body.querySelectorAll('.chapter-list > button.chapter-button').forEach((button, index) => {
          const choice = chapters[index];
          if (choice) decorate(button, choice[0], choice[1]);
        });
        for (const [selector, origin, width] of actions) {
          decorate(body.querySelector(selector), origin, width);
        }
      }
      function schedule() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(apply);
      }
      /* renderProgress reconstructs chapter buttons; reapply appearance only. */
      new MutationObserver(schedule).observe(body, { childList: true, subtree: true });
      new MutationObserver(schedule).observe(sheet, { attributes: true, attributeFilter: ['class', 'hidden'] });
      sheet.classList.add('has-kingdom-stamps');
      sheet.dataset.kingdomStamps = 'ready';
      schedule();
    }).catch(() => {
      /* Do not break the working notebook when a WebP is missing. */
      sheet.dataset.kingdomStamps = 'unavailable';
      console.info('Journal stamp pack unavailable; original buttons preserved.');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
