#!/usr/bin/env python3
"""Measure (and encode) the old site's images used by the inner pages and blog posts.

Usage:  python3 tools/build-images.py                 # refresh content/images.json
        python3 tools/build-images.py --encode        # also write any missing WebP files
        python3 tools/build-images.py --encode PATH…  # write the WebP files for these images only
Reads:  every image referenced in content/pages/*.json and content/posts/*.json.
        Originals are downloaded once into tools/.cache/uploads/ (needs Pillow).
Writes: content/images.json (size, WebP files, transparency, white corners, tone) and, with --encode,
        public/assets/img/up/*.webp.

The Next.js build reads content/images.json to lay out the pages (app/[slug]/page.jsx, lib/images.jsx).
Not every referenced image is shown (some sit in sections the pages leave out), so WebP files are only
written on request; the build stops with the command to run if a page needs an image that is missing.
This was the image half of the old tools/build-pages.py; the measurements are unchanged.
"""
import json, os, re, subprocess, sys
from PIL import Image, ImageSequence

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
CACHE = os.path.join(ROOT, "tools", ".cache", "uploads")
PUBLIC = os.path.join(ROOT, "public")
IMG_DIR = "assets/img/up"   # under public/, served as /assets/img/up/
UPLOADS = "https://www.energysavers.me/wp-content/uploads/"


def original(path):
    src = os.path.join(CACHE, path)
    if not os.path.exists(src) or not os.path.getsize(src):
        os.makedirs(os.path.dirname(src), exist_ok=True)
        if subprocess.run(["curl", "-sfL", "-A", "Mozilla/5.0", "-o", src, UPLOADS + path]).returncode:
            raise SystemExit("download failed: " + path)
    return src


def measure(path, encode):
    """Size, WebP files and tone of one old-site image; writes the WebP files when encode is true."""
    im = Image.open(original(path))
    W, H = im.size
    stem = re.sub(r"[^a-z0-9]+", "-", path.lower().rsplit(".", 1)[0]).strip("-")
    info = {"w": W, "h": H, "files": [], "still": None}
    rgba = im.convert("RGBA")
    info["alpha"] = rgba.getextrema()[3][0] < 250
    if getattr(im, "is_animated", False):
        w = min(W, 800)
        out, still = f"{IMG_DIR}/{stem}-{w}.webp", f"{IMG_DIR}/{stem}-{w}-still.webp"
        if encode and not os.path.exists(os.path.join(PUBLIC, out)):
            frames, durations = [], []
            for fr in ImageSequence.Iterator(im):
                durations.append(fr.info.get("duration", 80))
                f = fr.convert("RGBA")
                frames.append(f if w == W else f.resize((w, round(H * w / W)), Image.LANCZOS))
            frames[0].save(os.path.join(PUBLIC, out), "WEBP", save_all=True, append_images=frames[1:],
                           duration=durations, loop=0, quality=72, method=4)
            frames[0].save(os.path.join(PUBLIC, still), "WEBP", quality=82, method=6)
        info["files"], info["still"] = [[w, out]], still
    else:
        ladder = [W] if W <= 960 else [960, W] if W <= 1600 else [960, 1600]
        base = rgba if info["alpha"] else rgba.convert("RGB")
        for w in ladder:
            out = f"{IMG_DIR}/{stem}-{w}.webp"
            if encode and not os.path.exists(os.path.join(PUBLIC, out)):
                r = base if w == W else base.resize((w, round(H * w / W)), Image.LANCZOS)
                photo = path.lower().endswith((".jpg", ".jpeg"))
                r.save(os.path.join(PUBLIC, out), "WEBP", quality=80 if photo else 88, method=6)
            info["files"].append([w, out])
    # a product shot on white has white corners; a photo does not
    rgb = rgba.convert("RGB")
    corners = [rgb.getpixel((x, y)) for x in (0, W - 1) for y in (0, H - 1)]
    info["white_corners"] = all(min(c) >= 238 for c in corners)
    # how light the visible pixels are: decides whether an icon set sits on ink or paper
    small = rgba.resize((32, 32))
    px = [p for p in small.getdata() if p[3] > 128]
    info["tone"] = (sum(.2126 * r + .7152 * g + .0722 * b for r, g, b, _ in px) / len(px) / 255) if px else 1
    return info


def referenced():
    paths = set()

    def walk(o):
        if isinstance(o, dict):
            if o.get("t") == "img" and o.get("src"):
                paths.add(o["src"])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for kind in ("pages", "posts"):
        for f in sorted(os.listdir(os.path.join(CONTENT, kind))):
            if f.endswith(".json"):
                walk(json.load(open(os.path.join(CONTENT, kind, f), encoding="utf-8")).get("sections"))
    return sorted(paths)


def main():
    args = sys.argv[1:]
    encode_all = args == ["--encode"]
    only = set(args[1:]) if args[:1] == ["--encode"] else set()
    os.makedirs(os.path.join(PUBLIC, IMG_DIR), exist_ok=True)
    out, missing = {}, 0
    for path in referenced():
        info = measure(path, encode_all or path in only)
        out[path] = info
        missing += any(not os.path.exists(os.path.join(PUBLIC, f)) for _, f in info["files"])
    json.dump(out, open(os.path.join(CONTENT, "images.json"), "w"), indent=1, sort_keys=True)
    print(f"{len(out)} images measured into content/images.json; {missing} have no WebP files yet (written on request with --encode)")


if __name__ == "__main__":
    main()
