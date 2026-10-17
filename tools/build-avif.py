#!/usr/bin/env python3
"""Write AVIF copies of the site's WebP images: the same quality, about a third smaller.

Usage:  python3 tools/build-avif.py          # images that have no AVIF copies yet
        python3 tools/build-avif.py --force  # all of them again
Reads:  public/assets/img/manifest.json (homepage images, tools/fetch-assets.py) and content/images.json
        (inner pages, tools/build-images.py), and the originals both tools cached in tools/.cache/.
Writes: an .avif file next to each .webp file. Its quality is the lowest whose SSIM against the resized
        original is at least the WebP file's own SSIM, so it looks the same. An image keeps its AVIF
        copies only if, all widths together, they are at least 10% smaller than its WebP files.
        Transparent images and animations are left as they are.
The pages offer the AVIF copies to browsers that read AVIF and keep the WebP files for the rest
(lib/pic.jsx, lib/images.jsx).
Needs Pillow 11.2+ (AVIF) and ffmpeg for the SSIM measurement (FFMPEG=/path/to/ffmpeg to pick one).
"""
import io, json, os, re, subprocess, sys, tempfile
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
CACHE = os.path.join(ROOT, "tools", ".cache")
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
SPEED = 5          # libavif speed, 0 (slowest, smallest) to 10
MIN_SAVING = .10   # keep an image's AVIF copies only if they save at least this much


def ssim(a, b, tmp):
    """SSIM (ffmpeg, all channels) between two images of the same size."""
    pa, pb = os.path.join(tmp, "a.png"), os.path.join(tmp, "b.png")
    a.save(pa)
    b.save(pb)
    r = subprocess.run([FFMPEG, "-hide_banner", "-i", pa, "-i", pb, "-lavfi", "ssim", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.search(r"All:([0-9.]+)", r.stderr)
    if not m:
        raise SystemExit("ffmpeg ssim failed:\n" + r.stderr[-400:])
    return float(m.group(1))


def avif(im, q):
    buf = io.BytesIO()
    im.save(buf, "AVIF", quality=q, speed=SPEED)
    return buf.getvalue()


def match(ref, webp_file, tmp):
    """The smallest AVIF of ref whose SSIM is at least the WebP file's. Returns (bytes, quality, ssims)."""
    target = ssim(Image.open(webp_file).convert("RGB"), ref, tmp)
    lo, hi, best = 20, 95, None
    while lo <= hi:  # SSIM rises with quality
        q = (lo + hi) // 2
        data = avif(ref, q)
        s = ssim(Image.open(io.BytesIO(data)).convert("RGB"), ref, tmp)
        if s >= target:
            best, hi = (data, q, (target, s)), q - 1
        else:
            lo = q + 1
    return best or (avif(ref, 95), 95, (target, None))


def job(task):
    """One image, all its widths: (label, webp bytes, avif bytes, kept, detail)."""
    label, source, crop, files = task
    im = Image.open(source)
    if im.mode == "P":
        im = im.convert("RGBA")
    im = im.convert("RGB")
    if crop:
        l, t, r, b = crop
        im = im.crop((round(l * im.width), round(t * im.height), round(r * im.width), round(b * im.height)))
    w0, h0 = im.size
    out, webp_total, avif_total, detail = [], 0, 0, []
    with tempfile.TemporaryDirectory() as tmp:
        for w, rel in files:
            webp_file = os.path.join(PUBLIC, rel)
            ref = im if w == w0 else im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
            if Image.open(webp_file).size != ref.size:
                return label, 0, 0, False, f"size mismatch at {w}px, skipped"
            data, q, (s_webp, s_avif) = match(ref, webp_file, tmp)
            out.append((webp_file[:-5] + ".avif", data))
            webp_total += os.path.getsize(webp_file)
            avif_total += len(data)
            detail.append(f"{w}:q{q}")
    kept = avif_total <= (1 - MIN_SAVING) * webp_total
    for path, data in out:
        if kept:
            with open(path, "wb") as f:
                f.write(data)
        elif os.path.exists(path):
            os.remove(path)
    return label, webp_total, avif_total, kept, " ".join(detail)


def tasks(force):
    def todo(files):
        return force or not all(os.path.exists(os.path.join(PUBLIC, f)[:-5] + ".avif") for _, f in files)

    # homepage images (tools/fetch-assets.py names Pexels downloads by file name, the rest by path)
    manifest = json.load(open(os.path.join(PUBLIC, "assets", "img", "manifest.json")))
    for name, m in manifest.items():
        if m["alpha"]:
            continue
        src = m["src"]
        source = os.path.join(CACHE, src.rsplit("/", 1)[-1] if "://" in src else src.replace("/", "_"))
        files = [[w, f"assets/img/{name}-{w}.webp"] for w in m["widths"]]
        if os.path.exists(source) and todo(files):
            yield name, source, m.get("crop"), files
    # inner-page images
    for path, info in json.load(open(os.path.join(ROOT, "content", "images.json"))).items():
        files = [f for f in info["files"] if f[1].endswith(".webp")]
        if info["alpha"] or info.get("still") or not files:
            continue
        if not all(os.path.exists(os.path.join(PUBLIC, f)) for _, f in files):
            continue  # not used by any page, so never encoded
        source = os.path.join(CACHE, "uploads", path)
        if os.path.exists(source) and todo(files):
            yield path, source, None, files


def main():
    force = "--force" in sys.argv[1:]
    work = list(tasks(force))
    print(f"{len(work)} images to do")
    webp_sum = avif_sum = 0
    with ProcessPoolExecutor() as pool:
        for label, webp_total, avif_total, kept, detail in pool.map(job, work):
            if kept:
                webp_sum += webp_total
                avif_sum += avif_total
            saving = 1 - avif_total / webp_total if webp_total else 0
            print(f"{'kept' if kept else 'skip'} {saving:6.1%}  {webp_total // 1024:5d} -> {avif_total // 1024:5d} KB  {label}  {detail}")
    if webp_sum:
        print(f"AVIF copies kept: {webp_sum // 1024} KB of WebP -> {avif_sum // 1024} KB ({1 - avif_sum / webp_sum:.0%} smaller)")


if __name__ == "__main__":
    main()
