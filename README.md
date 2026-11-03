# Jess’s Big, Fat, Fun & Whimsical Birthday Adventure

A mobile-first, offline-friendly fantasy adventure for Jess’s birthday in Helen, Georgia, on Monday, November 16, 2026. Built as static HTML, CSS, JavaScript, and original SVG artwork for GitHub Pages.

## Preview locally

Open `index.html` in a browser, or run a small local web server from the repository root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. The step-by-step journey uses that browser’s local storage. Google Maps and Apple Maps links need a connection when opened.

## Deploy with GitHub Pages

The workflow at `.github/workflows/pages.yml` packages only the website files into `dist/` and publishes them when commits reach `main`. Planning notes and repository documentation are not included in the deployed site. To enable it after reviewing this branch:

1. Merge the reviewed implementation into `main`.
2. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
3. The workflow will publish the static site. Its URL will be `https://theblackstaginn.github.io/big-fat-fun-and-whimsical-fall-birthday-adventure/`.

The Pages configuration is not enabled from this branch. Do not treat the illustrated map as real navigation; its positions and trail are deliberately symbolic. Each chapter links to current map searches for actual destinations.

## Files

- `index.html` — page content and accessible structure
- `styles.css` — responsive design, reduced-motion support, print rules
- `adventure.js` — chapter details, map hotspots, and local progress
- `assets/helen-quest-map.svg` — original scalable parchment fantasy map
- `ROUTE-RESEARCH.md` — source links, checked hours, and open logistics

## Privacy

This is a public repository. Keep personal contact details and any private birthday plans out of committed files. The public quest describes only the destinations and adventure; any personal surprise belongs offline.
