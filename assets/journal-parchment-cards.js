/* 2026-11-05: Illustrated parchment cards.
 * Presentation-only. Existing HTML controls and listeners are moved, never
 * cloned or replaced. No change to quest/GPS/progress/photo behavior.
 */
(() => {
  "use strict";
  const sheet = document.querySelector(".rpg-sheet");
  const body = document.getElementById("rpg-sheet-body");
  if (!sheet || !body || sheet.dataset.parchmentCards) return;
  sheet.dataset.parchmentCards = "loading";

  const root = "assets/parchment/";
  const images = [
    "parchment_small_card.webp",
    "parchment_top.webp",
    "parchment_middle.webp",
    "parchment_bottom.webp"
  ];
  const load = url => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => img.naturalWidth ? resolve(img) : reject(new Error(url));
    img.onerror = reject;
    img.src = url;
  });
  const panelSelectors = [
    ".chapter-detail",
    ".quest-arrival-card",
    ".quest-memory-card"
  ];
  const stampSelectors = [
    [".quest-arrival-card #quest-start-gps", "starfen", 148],
    [".quest-arrival-card #quest-confirm-arrival", "emberfjord", 145],
    [".quest-memory-card #witch-memory-save", "starfen", 160],
    [".quest-memory-card label[for='curios-photo-input']", "emberfjord", 160],
    [".quest-memory-card button:not(.journal-stamp):not(#witch-memory-save)", "starfen", 158]
  ];
  const observedCopies = new WeakSet();
  const panelSet = new Set();
  let observer = null;
  let pending = false;
  let sizePending = false;

  function addStamp(el, origin, width) {
    if (!el || el.classList.contains("journal-stamp")) return;
    el.classList.add("parchment-action-stamp", "stamp-" + origin);
    el.style.setProperty("--action-width", width + "px");
  }

  function wrapCard(card) {
    if (card.classList.contains("parchment-stretch-card")) return;
    const art = document.createElement("div");
    art.className = "parchment-stretch-art";
    art.setAttribute("aria-hidden", "true");

    const top = document.createElement("img");
    top.className = "parchment-stretch-top";
    top.src = root + images[1];
    top.alt = "";
    top.draggable = false;

    const middle = document.createElement("div");
    middle.className = "parchment-stretch-middle";

    const bottom = document.createElement("img");
    bottom.className = "parchment-stretch-bottom";
    bottom.src = root + images[3];
    bottom.alt = "";
    bottom.draggable = false;
    art.append(top, middle, bottom);

    const copy = document.createElement("div");
    copy.className = "parchment-stretch-copy";
    // Moving child nodes retains original event listeners, IDs and state.
    while (card.firstChild) copy.append(card.firstChild);
    card.classList.add("parchment-stretch-card");
    card.append(art, copy);
    panelSet.add(card);
    if (observer && !observedCopies.has(copy)) {
      observer.observe(copy);
      observedCopies.add(copy);
    }
  }

  function layoutOne(card) {
    if (!card.isConnected || !sheet.classList.contains("is-illustrated-journal")) return;
    const copy = card.querySelector(":scope > .parchment-stretch-copy");
    const art = card.querySelector(":scope > .parchment-stretch-art");
    const middle = art?.querySelector(".parchment-stretch-middle");
    if (!copy || !middle) return;
    const width = card.getBoundingClientRect().width;
    if (!width) return;

    const topHeight = width * 334 / 1090;
    const tileHeight = width * 256 / 1090;
    const bottomHeight = width * 261 / 1090;
    const necessary = copy.getBoundingClientRect().height;
    const repeats = Math.max(1, Math.ceil((necessary - topHeight - bottomHeight + 1) / tileHeight));
    const height = topHeight + repeats * tileHeight + bottomHeight;

    // The center tile is never stretched vertically: repeat an integer number
    // of full-height tiles, so all seams retain identical pixel edge rows.
    if (middle.dataset.repeats !== String(repeats) ||
        middle.dataset.width !== width.toFixed(2)) {
      middle.style.height = (repeats * tileHeight) + "px";
      middle.style.backgroundSize = "100% " + tileHeight + "px";
      middle.dataset.repeats = String(repeats);
      middle.dataset.width = width.toFixed(2);
    }
    if (card.style.minHeight !== height + "px") card.style.minHeight = height + "px";
  }

  function layoutAll() {
    sizePending = false;
    for (const card of panelSet) {
      if (!card.isConnected) { panelSet.delete(card); continue; }
      layoutOne(card);
    }
  }
  function requestLayout() {
    if (sizePending) return;
    sizePending = true;
    requestAnimationFrame(layoutAll);
  }

  function apply() {
    pending = false;
    if (!sheet.classList.contains("is-illustrated-journal")) return;
    for (const selector of panelSelectors) {
      body.querySelectorAll(selector).forEach(wrapCard);
    }
    for (const [selector, origin, width] of stampSelectors) {
      body.querySelectorAll(selector).forEach(el => addStamp(el, origin, width));
    }
    requestLayout();
  }

  function scheduleApply() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(apply);
  }

  Promise.all(images.map(name => load(root + name))).then(() => {
    observer = "ResizeObserver" in window
      ? new ResizeObserver(requestLayout)
      : null;
    sheet.classList.add("has-parchment-cards");
    sheet.dataset.parchmentCards = "ready";
    // Watch newly revealed chapter UI, not attribute changes from size updates.
    new MutationObserver(scheduleApply).observe(body, { childList: true, subtree: true });
    new MutationObserver(scheduleApply).observe(sheet, {
      attributes: true, attributeFilter: ["class", "hidden"]
    });
    window.addEventListener("resize", requestLayout, { passive: true });
    scheduleApply();
  }).catch(() => {
    sheet.dataset.parchmentCards = "unavailable";
    console.info("Parchment asset pack missing; original cards preserved.");
  });
})();
