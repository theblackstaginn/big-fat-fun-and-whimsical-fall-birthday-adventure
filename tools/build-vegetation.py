#!/usr/bin/env python3
"""Generate full-coverage storybook grass from public USDA/USGS NAIP imagery.

RGB-NIR sample from 2023 Georgia NAIP is classified once at build time.
No photographed vehicles, buildings or aerial pixels are published. The
classification guides the tree mask and subtle texture variation only.
"""
import io
import math
import os
import random
import sys
import urllib.parse
import urllib.request

from PIL import Image, ImageChops, ImageDraw, ImageFilter

WEST, SOUTH, EAST, NORTH = -83.739, 34.691, -83.709, 34.713
WIDTH, HEIGHT = 1152, 1024
OUTPUT = "dist/assets"
SOURCES = (
    "https://imagery.geoplatform.gov/iipp/rest/services/NAIP/NAIP2023_CONUS/ImageServer/exportImage",
    "https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage",
)


def fetch_false_color(west=WEST, south=SOUTH, east=EAST, north=NORTH,
                      width=WIDTH, height=HEIGHT):
    """Ask ArcGIS to export bands NIR, RED, GREEN as the RGB channels."""
    params = urllib.parse.urlencode({
        "bbox": f"{west},{south},{east},{north}",
        "bboxSR": "4326", "imageSR": "4326",
        "size": f"{width},{height}",
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
            if im.size != (width, height):
                raise RuntimeError(f"Unexpected imagery size {im.size}; expected {(width, height)}")
            print(f"NAIP source: {endpoint}; {len(raw)} source bytes")
            return im
        except Exception as e:
            errors.append(f"{endpoint}: {type(e).__name__}: {e}")
            print(f"NAIP source failed: {errors[-1]}", file=sys.stderr)
    raise RuntimeError("Unable to acquire public imagery: " + "; ".join(errors))


def decorate_cover(image, mask, canopy, seed):
    """Paint small grass and leaf strokes inside vegetation, clipped to its mask."""
    width, height = image.size
    rng = random.Random(seed)
    details = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(details)
    grass_palette = ((77, 99, 62, 72), (157, 151, 97, 68),
                     (111, 130, 78, 60), (176, 145, 83, 48))
    woodland_palette = ((48, 68, 46, 72), (100, 115, 72, 64),
                        (136, 117, 72, 50), (77, 94, 61, 60))
    for _ in range(max(700, width * height // 430)):
        x, y = rng.randrange(width), rng.randrange(height)
        if mask.getpixel((x, y)) < 210:
            continue
        palette = woodland_palette if canopy.getpixel((x, y)) > 140 else grass_palette
        for _ in range(rng.randint(2, 4)):
            color = rng.choice(palette)
            dx, rise = rng.randint(-2, 2), rng.randint(3, 8)
            draw.line((x + dx, y, x + dx + rng.randint(-2, 2), y - rise),
                      fill=color, width=1)
        if rng.random() < 0.24:
            color = rng.choice(palette)
            radius = rng.choice((1, 1, 2))
            draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=color)
    details.putalpha(ImageChops.multiply(details.getchannel("A"), mask))
    image.alpha_composite(details)
    return image

def decorate_full_ground(image, seed):
    """Paint a quiet grass carpet with occasional clusters of autumn speckles."""
    width, height = image.size
    rng = random.Random(seed)
    details = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(details, "RGBA")

    # Small, round flecks suggest fallen leaves at map scale. Keep most of
    # them in loose patches, with varied spacing and a lot of untouched grass.
    leaf_palette = (
        (184, 94, 45, 188), (210, 145, 59, 180),
        (151, 72, 45, 178), (194, 116, 57, 184),
        (139, 132, 68, 166),
    )
    for _ in range(max(45, width * height // 9000)):
        cx, cy = rng.randrange(width), rng.randrange(height)
        spread = rng.uniform(7, 20)
        for _ in range(rng.randint(9, 19)):
            x = cx + rng.gauss(0, spread)
            y = cy + rng.gauss(0, spread * 0.72)
            radius_x = rng.uniform(0.55, 1.2)
            radius_y = radius_x * rng.uniform(0.72, 1.0)
            color = rng.choice(leaf_palette)
            draw.ellipse((x-radius_x, y-radius_y, x+radius_x, y+radius_y),
                         fill=color)

    # A very sparse scattering beyond the clusters keeps the ground alive
    # without making the whole surface read like confetti.
    for _ in range(max(80, width * height // 1800)):
        x, y = rng.randrange(width), rng.randrange(height)
        radius = rng.uniform(0.45, 0.85)
        color = rng.choice(leaf_palette)
        draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=color)

    # Low-contrast tufts soften the flat base without forming repeated stripes.
    tuft_palette = (
        (80, 105, 61, 24), (157, 150, 94, 22),
        (105, 126, 75, 20), (177, 139, 78, 18),
    )
    for _ in range(max(100, width * height // 320)):
        cx, cy = rng.randrange(width), rng.randrange(height)
        color = rng.choice(tuft_palette)
        for _ in range(rng.randint(2, 3)):
            x = cx + rng.randint(-2, 2)
            y = cy + rng.randint(-2, 2)
            radius = rng.choice((0.7, 1.0, 1.2))
            draw.ellipse((x-radius, y-radius, x+radius, y+radius),
                         fill=color)
    image.alpha_composite(details)
    return image

def run():
    im = fetch_false_color()
    # When bandIds=3,0,1, the pixel's R is NIR and G is red.
    nir, red, green = im.split()
    nirpx = nir.load()
    redpx = red.load()
    greenpx = green.load()
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
            if n > 42 and ndvi > .11:
                binpx[x, y] = 255
    # Preserve narrower downtown lawns and planted strips while removing isolated
    # pixel noise. At this output scale, 3 pixels represent about 7 meters.
    binary = binary.filter(ImageFilter.MedianFilter(3))
    # Digitized small fairway/putting-green patches from the 2023 NAIP detail
    # crop around Bavarian Mountain Mini Golf. The crop is 1024 px for
    # (-83.7237, 34.6965, -83.7205, 34.6995); these are green turf islands,
    # not the asphalt approaches or roof footprints.
    turf_crop = {"west": -83.7237, "south": 34.6965,
                 "east": -83.7205, "north": 34.6995}
    turf_patches = [
        [(131.6,466),(153.5,450.6),(178.7,453.9),(190.8,470.3),(176.5,486.8),(149.1,489),(133.8,479.1)],
        [(194.1,449.5),(224.8,453.9),(244.5,469.2),(237.9,483.5),(211.6,480.2),(195.2,467)],
        [(253.3,471.4),(279.6,476.9),(303.7,496.7),(293.8,513.1),(270.8,505.4),(254.4,489)],
        [(300.4,514.2),(327.8,526.3),(346.4,548.2),(342.1,567.9),(321.2,565.7),(303.7,544.9),(290.5,528.4)],
        [(302.6,567.9),(330,576.7),(337.7,594.2),(320.1,604.1),(301.5,590.9),(290.5,578.9)],
        [(235.7,599.7),(262,596.4),(280.7,610.7),(274.1,629.3),(251.1,635.9),(231.3,621.6)],
        [(193,567.9),(212.7,558),(231.3,573.4),(228,593.1),(209.4,600.8),(194.1,589.8)],
        [(149.1,510.9),(173.2,496.7),(193,513.1),(187.5,532.8),(168.8,542.7),(150.2,530.6)]
    ]
    draw = ImageDraw.Draw(binary)
    for patch in turf_patches:
        pixels=[]
        for sx,sy in patch:
            lon=turf_crop["west"]+sx/1024*(turf_crop["east"]-turf_crop["west"])
            lat=turf_crop["north"]-sy/1024*(turf_crop["north"]-turf_crop["south"])
            pixels.append(((lon-WEST)/(EAST-WEST)*WIDTH,
                           (NORTH-lat)/(NORTH-SOUTH)*HEIGHT))
        draw.polygon(pixels,fill=255)
    clean = binary.load()
    # Miniature-golf putting surfaces near Ruby Mae's have low NDVI because
    # the maintained turf is sparse/low contrast in 2023 NAIP. Within this
    # hand-checked footprint only, preserve visibly green turf pixels. Roads,
    # buildings, and mapped water remain above the resulting transparent mask.
    turf_roi = {"west": -83.72355, "south": 34.69725,
                "east": -83.72200, "north": 34.69835}
    tx0 = max(0, int((turf_roi["west"] - WEST) / (EAST - WEST) * WIDTH))
    tx1 = min(WIDTH, int((turf_roi["east"] - WEST) / (EAST - WEST) * WIDTH) + 1)
    ty0 = max(0, int((NORTH - turf_roi["north"]) / (NORTH - SOUTH) * HEIGHT))
    ty1 = min(HEIGHT, int((NORTH - turf_roi["south"]) / (NORTH - SOUTH) * HEIGHT) + 1)
    for y in range(ty0, ty1):
        for x in range(tx0, tx1):
            n, r, g = nirpx[x, y], redpx[x, y], greenpx[x, y]
            if n > 32 and g >= r + 8:
                clean[x, y] = 255
    # Keep vegetation color even across each mapped patch. A small residual
    # texture keeps it storybook-like without soft, cloudy color blooms.
    coarse_w, coarse_h = max(4, WIDTH // 12), max(4, HEIGHT // 12)
    texture_rng = random.Random(7319)
    coarse = Image.new("L", (coarse_w, coarse_h))
    coarse.putdata([128 + texture_rng.randint(-6, 6)
                    for _ in range(coarse_w * coarse_h)])
    texture = coarse.resize(im.size, Image.Resampling.BICUBIC).filter(
        ImageFilter.GaussianBlur(0.5)
    )
    texture_px = texture.load()
    ground = Image.new("RGBA", im.size, (124, 146, 96, 255))
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
                base = (116, 138, 92)
                alpha = 255
            else:
                grass += 1
                kind = 75
                base = (124, 146, 96)
                alpha = 255
            # Gentle fine grain sits beneath the larger watercolor variation.
            patch = round((texture_px[x, y] - 128) * 0.22)
            grain = ((x * 37 + y * 91 + (x // 7) * 59) % 3) - 1
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
    # A very light edge antialias avoids halos while keeping vegetation borders crisp.
    decorate_cover(ground, binary, data.getchannel("R"), seed=7319)
    decorate_full_ground(ground, seed=91731)
    os.makedirs(OUTPUT, exist_ok=True)
    ground_path = os.path.join(OUTPUT, "helen-painted-ground.png")
    mask_path = os.path.join(OUTPUT, "helen-vegetation-data.png")
    ground.save(ground_path, optimize=True)
    data.save(mask_path, optimize=True)
    print("Published synthetic vegetation only:")
    for name in (ground_path, mask_path):
        print(f"  {name}: {os.path.getsize(name)} bytes")
    print("NAIP extent:", WEST, SOUTH, EAST, NORTH)
    # A finer synthetic ground layer spans the entire playable downtown and river
    # corridor, including every hotel lawn, park, and planted strip in the map view.
    # At about 1 m/pixel, it preserves small greens without photographic imagery.
    core_west, core_south, core_east, core_north = -83.732, 34.694, -83.717, 34.708
    core_width = core_height = 1536
    core = fetch_false_color(core_west, core_south, core_east, core_north,
                             core_width, core_height)
    cnir, cred, cgreen = core.split()
    cn, cr, cg = cnir.load(), cred.load(), cgreen.load()
    chigh = cred.filter(ImageFilter.MaxFilter(5)).load()
    clow = cred.filter(ImageFilter.MinFilter(5)).load()
    core_mask = Image.new("L", core.size, 0)
    canopy_mask = Image.new("L", core.size, 0)
    cm, wm = core_mask.load(), canopy_mask.load()
    downtown_pixels = 0
    for y in range(core_height):
        for x in range(core_width):
            n, r, g = cn[x, y], cr[x, y], cg[x, y]
            ndvi = (n - r) / max(1, n + r)
            contrast = chigh[x, y] - clow[x, y]
            # NIR response plus a visible green advantage separates lawns from
            # asphalt, pale roofs, and parking surfaces in the dense street grid.
            if n > 28 and ndvi > .055 and g >= r + 3:
                cm[x, y] = 255
                downtown_pixels += 1
                if ndvi > .32 and contrast > 22:
                    wm[x, y] = 255
    # Close tiny spectral gaps inside lawns. Keep the binary edge firm so the
    # painted cover ends cleanly at parking and road margins.
    core_mask = core_mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    # Woodland is a regional texture class, not a pixel-by-pixel tree scatter.
    canopy_mask = canopy_mask.filter(ImageFilter.MedianFilter(5))
    rng = random.Random(48117)
    coarse = Image.new("L", (core_width // 12, core_height // 12))
    coarse.putdata([128 + rng.randint(-6, 6)
                    for _ in range(coarse.width * coarse.height)])
    texture = coarse.resize(core.size, Image.Resampling.BICUBIC).filter(
        ImageFilter.GaussianBlur(0.5)
    )
    tex, mpx, canopy_px = texture.load(), core_mask.load(), canopy_mask.load()
    core_ground = Image.new("RGBA", core.size, (124, 146, 96, 255))
    cgpx = core_ground.load()
    meadow_pixels = canopy_pixels = 0
    for y in range(core_height):
        for x in range(core_width):
            coverage = mpx[x, y]
            if coverage < 12:
                continue
            # Blend broad class patches so canopy stays woodland-colored while
            # smooth green areas become continuous meadow instead of tree speckles.
            canopy = canopy_px[x, y] / 255
            grass_rgb, wood_rgb = (126, 147, 98), (116, 138, 92)
            base = tuple(round(grass_rgb[i] * (1 - canopy) + wood_rgb[i] * canopy)
                         for i in range(3))
            canopy_pixels += round(canopy)
            meadow_pixels += 1 - round(canopy)
            # Restrained tonal variation keeps lawns consistent while fine marks add grain.
            noise = round((tex[x, y] - 128) * .18)
            cgpx[x, y] = (max(0, min(255, base[0] + noise)),
                          max(0, min(255, base[1] + noise // 2)),
                          max(0, min(255, base[2] + noise // 3)),
                          255)
    decorate_cover(core_ground, core_mask, canopy_mask, seed=48117)
    decorate_full_ground(core_ground, seed=91731)
    core_path = os.path.join(OUTPUT, "helen-painted-ground-downtown.png")
    core_ground.save(core_path, optimize=True)
    print(f"High-resolution downtown ground: meadow={meadow_pixels}, "
          f"woodland={canopy_pixels}, {downtown_pixels} candidate pixels; "
          f"{os.path.getsize(core_path)} bytes; extent "
          f"{core_west},{core_south},{core_east},{core_north}")


if __name__ == "__main__":
    run()
