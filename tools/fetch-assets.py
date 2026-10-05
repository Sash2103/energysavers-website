#!/usr/bin/env python3
"""Download the curated images (from energysavers.me unless a full URL is given) and write web-ready copies.

Usage:  python3 tools/fetch-assets.py
Writes: public/assets/img/<name>-<width>.webp and public/assets/img/manifest.json
Source files are cached in tools/.cache/ (git-ignored).
"""
import io, json, os, subprocess, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "tools", ".cache")
OUT = os.path.join(ROOT, "public", "assets", "img")
BASE = "https://www.energysavers.me/wp-content/uploads/"


def pexels(photo_id):
    """A free Pexels photo (Pexels licence: commercial use allowed, no credit required)."""
    return f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg"


# name, source path, kind, output widths[, options]
#   options: {"crop": (left, top, right, bottom)} as fractions of the source, applied before resizing
#   photo   -> webp + jpg, cover crops handled in CSS
#   cutout  -> webp + png, keeps transparency, shown on paper with multiply
#   doc     -> webp + jpg (certificates)
MANIFEST = [
    # case-study site photos. The old site only has ~360px copies, so these are sharper photos of the
    # same places: the larger copy in their own media library, or free Pexels photos.
    # Dubai Medical and BID Factory have no better source yet (they only show in the case sheet).
    ("case-dubai-medical", "2023/02/dubai-medical-University-hospital-min.png", "photo", [453]),
    ("case-emicool",       pexels(17232659),                                    "photo", [480, 960, 1440], {"crop": (0, .13, 1, .63)}),
    ("case-bid-factory",   "2023/02/bif-factory-min.png",                       "photo", [453]),
    ("case-dp-world",      pexels(39621561),                                    "photo", [480, 960, 1440]),
    ("case-burj-al-arab",  "2023/01/51664-burj-al-arab-hotel-min.jpg",          "photo", [480, 960, 1440]),
    ("case-wild-wadi",     pexels(36168069),                                    "photo", [480, 960, 1440]),
    ("case-mina-asalam",   pexels(35171522),                                    "photo", [480, 960, 1440]),
    # their own field photos and report excerpts
    ("field-panel-analyser",  "2023/03/1.-Energy-Audit-min.png",              "photo", [480, 960, 1203]),
    ("field-analyser-screen", "2023/03/2.-PQ-Audit-Measurement-1-min.png",    "photo", [480, 830]),
    ("field-pq-install-1",    "2023/02/2.-Power-Quality-Solutions-1-min.png", "photo", [480, 632]),
    ("field-pq-install-2",    "2023/02/2.-Power-Quality-Solutions-2-min.png", "photo", [480, 691]),
    ("field-plant-room",      "2023/02/3.-HVAC-Optimization-min.png",         "photo", [480, 960, 1306]),
    ("report-waveforms",      "2023/02/1.-Power-Quality-Audit-2-min.png",     "doc",   [662]),
    ("report-thd",            "2023/04/Harmonic-Studies-1.png",               "doc",   [624]),
    ("report-spectrum",       "2023/04/Harmonic-Simulation-Studies-1.png",    "doc",   [624]),
    ("solution-automation",   "2026/04/Siemens-WinCC-in-UAE.jpg",             "photo", [480, 960]),
    ("pq-rental-kit",         "2023/01/PQ-300-feature-min.png",               "cutout", [480, 900]),
    # About: Business Bay, where the Dubai office is
    ("about-business-bay",    pexels(13398520),                               "photo", [480, 960, 1440, 1920]),
    # sector photos (2000px for the tall desktop frame, which crops wide photos)
    # hospitality: the old site's copy is only 650px wide, so this is a free Pexels photo
    # ("Architectural Building Lighted on Night Time" by Abbas Mohammed, pexels.com/photo/3680902)
    ("sector-hospitality", pexels(3680902),                                                "photo", [480, 960, 1440, 2000]),
    ("sector-industrial",  "2023/01/food-production-industry-min.jpg",                     "photo", [480, 960, 1440, 2000]),
    ("sector-datacentre",  "2023/01/server-room-interior-in-datacenter-3d-render-min.jpg", "photo", [480, 960, 1440, 2000]),
    ("sector-commercial",  "2023/01/woman-operating-pharmaceutical-production-min.jpg",    "photo", [480, 960, 1440, 2000]),
    ("sector-cooling",     "2023/01/industrial-blue-cooling-tower-min.jpg",                "photo", [480, 960, 1440, 2000]),
    # certificates
    ("cert-iso-9001",  "2023/11/pdfrendition1.png",           "doc", [360, 724]),
    ("cert-deaas",     "2023/04/Accredition-certificate.jpg", "doc", [360, 724]),
    # product lines (bench) - the other three lines reuse p-ahf, p-heat-pump, p-ev-360-480
    ("line-automation",    "2023/02/4.-Automation-Solutions-min.png", "cutout", [480, 960]),
    # products (sheets)
    ("p-ahf",            "2023/01/AHF-min.png",                       "cutout", [400, 700]),
    ("p-ahf-pro",        "2023/02/AHF-Pro.png",                       "cutout", [328]),
    ("p-svg",            "2023/01/Untitled-design-92-min.png",        "cutout", [200]),
    ("p-ups",            "2023/01/Untitled-design-93-min.png",        "cutout", [200]),
    ("p-oskar",          "2023/03/Voltage-Stabilizer.png",            "cutout", [267]),
    ("p-pq-mobile",      "2023/03/PQ-Mobile-Analyser.png",            "cutout", [480, 1124]),
    ("p-pq-box-50",      "2023/03/PQ-Box-50-min-1.jpg",               "photo",  [408]),
    ("p-pq-box-150",     "2023/03/PQ-Box-150-min-1.png",              "cutout", [395]),
    ("p-pq-box-200",     "2023/03/PQ-Box-200-min-1.png",              "cutout", [392]),
    ("p-pq-box-300",     "2023/03/PQ-Box-300-min-1.png",              "cutout", [386]),
    ("p-heat-pump",      "2023/01/heat-pumps-1-min.png",              "cutout", [420, 839]),
    ("p-adsorption",     "2023/03/Absorption-Chillers-min.png",       "cutout", [277]),
    ("p-air-purifier",   "2023/03/Air-Purifiers-min.png",             "cutout", [369]),
    ("p-bms",            "2023/03/1.-BMS-Servers-controllers.png",    "photo",  [250]),
    ("p-sensors",        "2023/03/3.-Sensor-1-min.png",               "cutout", [517]),
    ("p-power-supply",   "2023/03/4.-Power-Supply-min.png",           "cutout", [450]),
    ("p-smart-meters",   "2023/03/2.-Smart-Meters-min.png",           "cutout", [513]),
    ("p-ev-360-480",     "2023/04/sec-480kw.png",                     "cutout", [400, 662]),
    ("p-ev-200-240",     "2023/04/200-240kW-Integrated-Charger.png",  "cutout", [373]),
    ("p-ev-60-160",      "2023/04/60-160-kW-Integrated-Charger.png",  "cutout", [373]),
    ("p-ev-40-80",       "2023/04/40-80kW-Integrated-Charger.png",    "cutout", [373]),
    ("p-ev-interstellar", "2023/04/Interstellar-AC-Charger.png",      "cutout", [373]),
    ("p-ev-mira",        "2023/04/Mira-AC-Charger.png",               "cutout", [373]),
    # logo source (traced separately into public/assets/svg)
    ("logo-source",      "2025/05/cropped-cropped-ENERGY-SAVERS-scaled-1.png", "cutout", [1638]),
]


def fetch(path):
    os.makedirs(CACHE, exist_ok=True)
    url = path if "://" in path else BASE + path
    local = os.path.join(CACHE, path.rsplit("/", 1)[-1] if "://" in path else path.replace("/", "_"))
    if not os.path.exists(local):
        r = subprocess.run(["curl", "-sfL", "-A", "Mozilla/5.0", "-o", local, url])
        if r.returncode != 0:
            raise SystemExit(f"download failed: {path}")
    return local


def has_alpha(im):
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        a = im.convert("RGBA").getchannel("A")
        return a.getextrema()[0] < 250
    return False


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for name, path, kind, widths, *rest in MANIFEST:
        opts = rest[0] if rest else {}
        src = Image.open(fetch(path))
        if src.mode == "P":
            src = src.convert("RGBA")
        alpha = kind == "cutout" and has_alpha(src)
        im = src.convert("RGBA" if alpha else "RGB")
        if "crop" in opts:
            l, t, r, b = opts["crop"]
            im = im.crop((round(l * im.width), round(t * im.height), round(r * im.width), round(b * im.height)))
        w0, h0 = im.size
        files = []
        for w in sorted(set(min(w, w0) for w in widths)):
            h = round(h0 * w / w0)
            r = im.resize((w, h), Image.LANCZOS) if w != w0 else im
            base = os.path.join(OUT, f"{name}-{w}")
            # WebP only: every current browser supports it (Safari 14+, 2020)
            r.save(base + ".webp", "WEBP", quality=80 if kind != "doc" else 86, method=6)
            files.append(w)
        manifest[name] = {"src": path, "kind": kind, "w": w0, "h": h0, "alpha": alpha, "widths": files, **opts}
        print(f"{name:24s} {w0}x{h0} alpha={alpha} -> {files}")
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
