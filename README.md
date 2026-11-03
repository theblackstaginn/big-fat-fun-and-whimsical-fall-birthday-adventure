# Jess’s Big, Fat, Fun & Whimsical Birthday Adventure

A mobile-first fantasy adventure for Jess’s birthday in Helen, Georgia, on Monday, November 16, 2026. Built as static HTML, CSS, JavaScript, and original SVG artwork for GitHub Pages. The eight sequential chapters begin with candle-making, go south to Ruby Mae's and Wonderland, then turn north through Helen to an Unicoi Hill Park-area finale. Four illustrated scenes unlock only as their first chapter is reached.

## Preview locally

Open `index.html` in a browser, or run a small local web server from the repository root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. The step-by-step journey uses that browser’s local storage. The illustrated overview works offline; Nearby Streets loads map tiles and address lookup only when opened. Google Maps and Apple Maps direction links need a connection when opened.

## Map and vegetation

The overview remains the approved illustrated fantasy map. Nearby Streets uses OpenStreetMap roads, buildings, and water with a MapLibre 3D village renderer. Its car-free Leaflet fallback uses OpenStreetMap tiles.

The Pages workflow builds synthetic, transparent ground-cover textures and a vegetation mask from 2023 USDA NAIP imagery. The public site receives the illustrated assets only; it does not publish the aerial photograph. The renderer uses the canopy mask for tree placement and checks mapped roads, buildings, water, and hardscape before placing trees. OpenStreetMap is attributed in the map view.

## Deploy with GitHub Pages

The workflow at `.github/workflows/pages.yml` assembles the public site in `dist/`, generates the illustrated vegetation assets, and publishes commits to `main` or `feat/helens-quest-map-v1`. The repository notes and planning files are not included in the deployed site. The site URL is:

`https://theblackstaginn.github.io/big-fat-fun-and-whimsical-fall-birthday-adventure/`

## Files

- `index.html` — page content and accessible structure
- `styles.css` — responsive design, reduced-motion support, print rules
- `adventure.js` — chapter details, sequential quest markers, real-street map, and saved progress
- `assets/helen-landscape.js` — low-poly trees and NAIP mask placement
- `tools/build-vegetation.py` — synthetic ground texture and mask generation
- `assets/helen-quest-map.svg` — original scalable parchment fantasy map
- `ROUTE-RESEARCH.md` — source links, checked hours, and open logistics
