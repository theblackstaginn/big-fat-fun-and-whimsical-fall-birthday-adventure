# The Rogue Witch's Excursion — Game Audit

**Audit date:** November 5, 2026  
**Repository:** theblackstaginn/big-fat-fun-and-whimsical-fall-birthday-adventure  
**Branch reviewed:** feat/helens-quest-map-v1  
**Latest successful workflow observed:** 4ed7cb8 (GitHub Actions success)

## Scope and limitations
Read-only source and workflow review. No gameplay code changed during this audit. GitHub Actions success confirms the build/deployment workflow completed, not that every feature was tested in a mobile browser. Findings below are code-level unless explicitly noted.

## High-priority findings

### 1. Treasure Haul inventory is display-only
- `assets/satchel-inventory.js` creates nine empty placeholder slots.
- Slot click handlers are no-ops; the inventory does not read stored keepsake photos.
- `assets/overworld-fog.js` independently stores journal notes and photos in IndexedDB (`rogue-witch-birthday-keepsakes`, `stops` object store).
- Connect saved photos to matching slots, update the collection counter, and preserve the approved visual design and Lazy Susan geometry.

### 2. Eight quest chapters versus nine oddities jars
- `adventure.js` defines eight chapters: ruby, wonderland, candle, town, river, dinner, sweet, park.
- `assets/satchel-carousel.js` defines nine jar items: ruby, wonderland, candle, glass, zuzu, river, dinner, sweet, park.
- Glassblowing and ZuZu's both map to chapter index 3 (`town`).
- Decide how two distinct treasure photos/jars are earned within that shared chapter before wiring inventory. Do not change the nine approved jars or their positioning as a shortcut.

### 3. Public home test feature
- `adventure.js` still contains a hard-coded home testing location and map controls to navigate there.
- Remove or disable the publicly accessible home-test feature before the birthday launch; avoid publishing the address in documentation.

## Confirmed implemented systems
- Sequential chapter unlock and localStorage progress (`jess-birthday-quest-progress-v3`).
- Journal note and photo persistence in browser IndexedDB.
- GPS watch-based arrival recognition with a manual arrival option (`assets/party-gps.js`).
- Preview mode that snapshots/restores in-memory progress without saving simulated completion (`assets/adventure-preview.js`).
- Illustrated scene reveal and finale letter implementation.
- Latest observed GitHub Pages workflow completed successfully.

These are implementation checks, not full end-to-end test passes.

## Further verification required
1. **Keepsake durability:** Browser-local photos have no confirmed export or remote backup. Clearing site data or changing devices can lose them. Consider a user-initiated export.
2. **Reset semantics:** Chapter progress, arrival state, and IndexedDB keepsakes are stored separately. Verify restart behavior and explain whether keepsakes persist.
3. **Mobile performance:** Test the combined 3D carousel, fog, animated leaves, dust, and nightfall effects on an actual iPhone.
4. **Panel artwork:** Verify the remaining Incoming Transmission and Adventure Settings panels against the approved art and button family.
5. **End-to-end flow:** Exercise every stop, photo/note save, achievement, reveal, map mode, and moonlit finale in a real browser.
6. **Navigation and accessibility:** Verify modal scroll boundaries, close controls, focus, contrast, reduced-motion handling, and offline/poor-network fallback.

## Recommended repair sequence
1. Resolve eight-chapter/nine-treasure mapping without changing existing jar assets or positions.
2. Connect saved Curios photos to the nine-slot Treasure Haul inventory.
3. Remove public home-test location and controls.
4. Finish the remaining illustrated panels and consistent button family.
5. Perform full Preview Mode walkthrough on iPhone.
6. Verify persistence, resets, and keepsake export/recovery.

## Preserve the known-good baseline
- Do **not** change the approved Lazy Susan's scale, position, rotation, perspective, or jar alignment without explicit approval.
- Preserve working maps, quest progression, GPS, previews, and illustrated panels.
- Apply and test one targeted change at a time.
