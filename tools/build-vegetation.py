#!/usr/bin/env python3
"""Generate car-free illustrated ground cover from public USDA/USGS NAIP imagery.

RGB-NIR sample from 2023 Georgia NAIP is classified once at build time.
NO photographed vehicles, buildings or aerial pixels are published. Only a
synthetic colorized grass/woodland texture and a compact vegetation class mask
are included in the static website. Pixel locations are approximate.
"""
import io
import math
import os
import random
import sys
import urllib.parse
import urllib.request

from PIL import Image, ImageFilter

WEST, SOUTH, EAST, NORTH = -83.739, 34.691, -83.709, 34.713
WIDTH, HEIGHT = 1152, 1024
OUTPUT = "dist/assets"
SOURCES = (
    "https://imagery.geoplatform.gov/iipp/rest/services/NAIP/NAIP2023_CONUS/ImageServer/exportImage",
    "https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage",
)


def fetch_false_color():
    """Ask ArcGIS to export bands NIR, RED, GREEN as the RGB channels."""
    params = urllib.parse.urlencode({
        "bbox": f"{WEST},{SOUTH},{EAST},{NORTH}",
        "bboxSR": "4326", "imageSR": "4326",
        "size": f"{WIDTH},{HEIGHT}",
        "format": "png32",
        "pixelType": "U8",
        "bandIds": "3,0,1",
        "f": "image",
    })
    errors = []
    for endpoint in SOURCES:
        url = endpoint + "?" + params
        try:
            request = urllib.request.Request(url, headers={
                "User-Agent": "JessBirthdayAdventure/1.0 (research; NAIP derived map)",
                "Accept": "image/png,*/*",
            })
            with urllib.request.urlopen(request, timeout=95) as response:
                raw = response.read(12_000_000)
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status}")
                if not raw.startswith(b"\x89PNG"):
                    raise RuntimeError(f"Not PNG: {raw[:180]!r}")
            im = Image.open(io.BytesIO(raw)).convert("RGB")
            if im.size != (WIDTH, HEIGHT):
                raise RuntimeError(f"Unexpected imagery size {im.size}")
            print(f"NAIP source: {endpoint}; {len(raw)} source bytes")
            return im
        except Exception as e:
            errors.append(f"{endpoint}: {type(e).__name__}: {e}")
            print(f"NAIP source failed: {errors[-1]}", file=sys.stderr)
    raise RuntimeError("Unable to acquire public imagery: " + "; ".join(errors))


def run():
    im = fetch_false_color()
    # When bandIds=3,0,1, the pixel's R is NIR and G is red.
    nir, red, green = im.split()
    nirpx = nir.load()
    redpx = red.load()
    # Small-window contrast separates textured tree crowns from smooth lawns.
    high = red.filter(ImageFilter.MaxFilter(5)).load()
    low = red.filter(ImageFilter.MinFilter(5)).load()
    binary = Image.new("L", im.size, 0)
    binpx = binary.load()
    ndvi_bytes = bytearray(WIDTH * HEIGHT)
    for y in range(HEIGHT):
        for x in range(WIDTH):
            n, r = nirpx[x, y], redpx[x, y]
            ndvi = (n - r) / max(1, n + r)
            k = y * WIDTH + x
            ndvi_bytes[k] = max(0, min(255, round((ndvi + 0.05) * 320)))
            if n > 48 and ndvi > .155:
                binpx[x, y] = 255
    # Remove isolated sensor noise without expanding vegetation into roads.
    binary = binary.filter(ImageFilter.MedianFilter(3))
    clean = binary.load()
    # Broad watercolor-like tonal patches replace per-pixel noise. The source
    # photograph is never copied into the published texture.
    coarse_w, coarse_h = max(4, WIDTH // 24), max(4, HEIGHT // 24)
    texture_rng = random.Random(7319)
    coarse = Image.new("L", (coarse_w, coarse_h))
    coarse.putdata([128 + texture_rng.randint(-18, 18)
                    for _ in range(coarse_w * coarse_h)])
    texture = coarse.resize(im.size, Image.Resampling.BICUBIC).filter(
        ImageFilter.GaussianBlur(6)
    )
    texture_px = texture.load()
    ground = Image.new("RGBA", im.size, (0, 0, 0, 0))
    data = Image.new("RGB", im.size, (0, 0, 0))
    gp = ground.load()
    dp = data.load()
    grass = 0
    canopy = 0
    for y in range(HEIGHT):
        for x in range(WIDTH):
            if clean[x, y] < 128:
                continue
            k = y * WIDTH + x
            n = nirpx[x, y]
            r = redpx[x, y]
            ndvi = (n - r) / max(1, n + r)
            contrast = high[x, y] - low[x, y]
            # Strong/rough vegetation is likely woodland; smooth is lawn.
            woody = ndvi > .32 and (contrast > 18 or n < 102)
            if woody:
                canopy += 1
                kind = 205
                base = (65, 92, 58)
                alpha = 228
            else:
                grass += 1
                kind = 75
                base = (124, 147, 92)
                alpha = 216
            # Gentle fine grain sits beneath the larger watercolor variation.
            patch = round((texture_px[x, y] - 128) * 0.65)
            grain = ((x * 37 + y * 91 + (x // 7) * 59) % 5) - 2
            noise = patch + grain
            gp[x, y] = (max(0, min(255, base[0] + noise)),
                         max(0, min(255, base[1] + noise // 2)),
                         max(0, min(255, base[2] + noise // 3)), alpha)
            dp[x, y] = (kind, min(255, round(max(0, ndvi) * 320)),
                         min(255, contrast))
    fraction = (grass + canopy) / (WIDTH * HEIGHT)
    print(f"Classified vegetation: grass={grass}, canopy={canopy}, fraction={fraction:.3f}")
    if not (.035 < fraction < .86) or grass < 1000 or canopy < 1000:
        raise RuntimeError(
            "NAIP classification implausible; refusing to publish inaccurate landscaping"
        )
    # Subtle feathering makes polygon boundaries read as painterly ground.
    a = ground.getchannel("A").filter(ImageFilter.GaussianBlur(.65))
    ground.putalpha(a)
    os.makedirs(OUTPUT, exist_ok=True)
    ground_path = os.path.join(OUTPUT, "helen-painted-ground.png")
    mask_path = os.path.join(OUTPUT, "helen-vegetation-data.png")
    ground.save(ground_path, optimize=True)
    data.save(mask_path, optimize=True)
    print("Published synthetic vegetation only:")
    for name in (ground_path, mask_path):
        print(f"  {name}: {os.path.getsize(name)} bytes")
    print("NAIP extent:", WEST, SOUTH, EAST, NORTH)


if __name__ == "__main__":
    run()
