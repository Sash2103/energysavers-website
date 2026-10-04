#!/usr/bin/env python3
"""Build the inner pages and the blog from the old site's content.

Usage:  python3 tools/build-pages.py
Reads:  content/pages/*.json and content/posts/*.json (written by tools/scrape-pages.py), and index.html,
        whose icon sprite, header, contact section, footer and case studies every page shares.
Writes: <slug>/index.html for every page and post, blog/index.html, and assets/img/up/*.webp.
        Images are downloaded once into tools/.cache/uploads/ and re-encoded (needs Pillow).

The words come from the content files as they are. This script decides the layout and adds only
UI labels (breadcrumbs, "Before"/"After", "Previous"/"Next"). Run it again after editing index.html.
"""
import html, json, os, re, subprocess, sys
from PIL import Image, ImageSequence

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
CACHE = os.path.join(ROOT, "tools", ".cache", "uploads")
IMG_DIR = "assets/img/up"
UPLOADS = "https://www.energysavers.me/wp-content/uploads/"
UP = "../"   # every generated page sits one folder below the site root
HEADINGS = ("h2", "h3", "h4", "h5", "h6")

# ------------------------------------------------------------------ site map (labels are the old menu's)
CASES = [  # homepage article id -> old page slug, in the old site's order
    ("dubai-medical", "dubai-medical-university-hospital-dubai"),
    ("emicool", "emicool-in-motor-city-dubai-2021"),
    ("bid-factory", "bid-factory-al-quoz-dubai-2021"),
    ("dp-world", "dp-world-dubai-2021"),
    ("burj-al-arab", "burj-al-arab-jumeirah-group-dubai-2021"),
    ("wild-wadi", "wild-wadi-jumeirah-group-dubai-2021"),
    ("mina-asalam", "mina-asalam-jumeirah-group-dubai-2021"),
]
TREE = [
    ("about", "About", []),
    ("products", "Products", [
        ("power-quality", "Power Quality", [
            ("ahf", "Active Harmonic Filter", []),
            ("static-var-generator", "Static Var Generator", []),
            ("voltage-optimizers", "Voltage Optimization", []),
            ("uninterrupted-power-supply", "Uninterrupted Power Supply", []),
            ("power-quality-mobile-anlayser", "Power Quality Mobile Analyser", [
                ("pq-box-50", "PQ-Box 50", []),
                ("pq-box-150-the-mobile-power-quality-allrounder", "PQ-Box 150", []),
                ("pq-box-200-the-mobile-tool-for-the-expert", "PQ-Box 200", []),
                ("pq-box-300-the-mobile-high-frequency-power-quality-tool", "PQ-Box 300", []),
            ]),
        ]),
        ("hvac", "HVAC", [
            ("heat-pumps", "Heat Pumps System", []),
            ("adsorption-chiller", "Adsorption Chiller", []),
            ("air-purifiers-smoke-filters", "Air Purifiers / Smoke Filters", []),
        ]),
        ("automation", "Automation", [
            ("bms-servers-controllers", "BMS Servers & Controllers", []),
            ("sensors", "Sensors", []),
            ("power-supply", "Power Supply", []),
            ("smart-meters", "Smart Meters", []),
        ]),
        ("ev-chargers", "EV Chargers", [
            ("360480kw-distributed-charger", "360~480kW Distributed Charger", []),
            ("sec-200-240kw-integrated-charger", "SEC 200-240kW Integrated Charger", []),
            ("sec-series", "SEC 60-160kW Integrated Charger", []),
            ("sec-40-80kw-integrated-charger", "SEC 40-80kW Integrated Charger", []),
            ("interstellar-ac-charger", "Interstellar AC Charger", []),
            ("mira-ac-charger", "Mira AC Charger", []),
            ("ser-series", "SER 20kW Power Module", []),
            ("ser-series-40kw-power-module", "SER 40kW Power Module", []),
        ]),
    ]),
    ("solutions", "Solutions", [
        ("power-quality-audits", "Power Quality Audits", []),
        ("power-quality-solutions", "Power Quality Solutions", []),
        ("hvac-optimization", "HVAC Optimization", []),
        ("automation-solutions", "Automation Solutions", []),
        ("indoor-air-quality-improvement", "Indoor Air Quality Improvement", []),
        ("smart-metering-lighting", "Smart Metering & Lighting", []),
    ]),
    ("services", "Services", [
        ("energy-audit", "Energy Audit", []),
        ("pq-audit-and-measurement", "PQ Audit and Measurement", []),
        ("harmonic-studies", "Harmonic Studies", []),
        ("harmonic-simulation-studies", "Harmonic Simulation Studies", []),
        ("pq-equipment-rental", "PQ Equipment Rental", []),
    ]),
    ("sectors", "Sectors", [
        ("hospitality", "Hospitality", []),
        ("industrial-plants", "Industrial Plants", []),
        ("data-centres-telecom", "Data Centers / Telecom", []),
        ("commercial-facilities", "Commercial Facilities", []),
        ("cooling-plants", "Cooling Plants", []),
    ]),
    ("case-studies", "Case studies", [(slug, key, []) for key, slug in CASES]),   # labels filled in from index.html
    ("blog", "Blog", []),
    ("contact-us", "Contact", []),
]
LABEL, PARENT, CHILDREN = {}, {}, {}


def walk(nodes, parent=None):
    for slug, label, kids in nodes:
        LABEL[slug], PARENT[slug] = label, parent
        CHILDREN.setdefault(parent, []).append(slug)
        walk(kids, slug)


walk(TREE)
LINE_OF_KEY = {"pq": "power-quality", "hvac": "hvac", "auto": "automation", "ev": "ev-chargers"}
PRODUCT_KEYS = {  # the homepage's product-sheet keys
    "ahf": "ahf", "svg": "static-var-generator", "oskar": "voltage-optimizers", "ups": "uninterrupted-power-supply",
    "pq-mobile": "power-quality-mobile-anlayser", "heat-pump": "heat-pumps", "adsorption": "adsorption-chiller",
    "air-purifier": "air-purifiers-smoke-filters", "bms": "bms-servers-controllers", "sensors": "sensors",
    "power-supply": "power-supply", "smart-meters": "smart-meters", "ev-360-480": "360480kw-distributed-charger",
    "ev-200-240": "sec-200-240kw-integrated-charger", "ev-60-160": "sec-series", "ev-40-80": "sec-40-80kw-integrated-charger",
    "ev-interstellar": "interstellar-ac-charger", "ev-mira": "mira-ac-charger",
}
SECTOR_KEYS = {"hospitality": "hospitality", "industrial-plants": "industrial", "data-centres-telecom": "datacentre",
               "commercial-facilities": "commercial", "cooling-plants": "cooling"}
INTEREST = {"energy-audit": "Energy audit", "power-quality-audits": "Power quality audit", "pq-audit-and-measurement": "Power quality audit",
            "harmonic-studies": "Power quality audit", "harmonic-simulation-studies": "Power quality audit"}

# Text that is corrected or flagged, as already done on the homepage (see NOTES.md)
OVERRIDES = {
    "voltage-optimizers": {
        "todo": "the old page credits OSKAR to Schneider Electric with an unusual acronym expansion; OSKAR appears to be an A. Eberle product. That sentence is left out until confirmed, as in the homepage sheet.",
        "replace": [("Voltage Optimization-OSKAR (Operational Systematic K-band Analogue Reduction) is a cutting-edge technology developed by Schneider Electric which optimizes the electricity supply voltage to reduce energy consumption and improve energy efficiency within a building or facility. ", "")],
    },
    "pq-equipment-rental": {
        "todo": "the old text described renting backhoes and forklifts. As approved for the homepage, it is replaced with their own PQ analyser wording; supply rental-specific text if wanted.",
        "replace": [(re.compile(r"^PQ Equipment Rental is a business that provides rental services for a variety of heavy equipment.*$"),
                     "Power Quality Mobile Analyzer is a handheld device used to analyze the power quality of an electrical system. It measures and records voltage, current, frequency, power factor, harmonics, and other power quality parameters.")],
    },
    "adsorption-chiller": {"todo": "the “Advanced Cooling Solutions” paragraph describes another company (as on the old page). Check whether it belongs here."},
    "ev-chargers": {"todo": "on the old page the SER 20kW Power Module card linked to the SEC Series page; it now links to the SER Series page."},
}
FIX_LINKS = {("ev-chargers", "SER 20kW Power Module"): "ser-series"}
# Graphics drawn for the old site's dark sections (white labels): their band is set on ink
DARK_GROUND = {"2023/01/dlm-left-min.png", "2023/01/dml-right-min.png", "2023/04/constant-power.png",
               "2023/04/ultra-wide-output.png", "2023/04/equipped.png"}

JUNK = re.compile(r"^(×|\+|-|sample title|sample description|description|content missing|"
                  r"get it on google play download on the app store|download data ?sheet|view more)$", re.I)
ACRONYMS = set("AHF SVG ASVG UPS HVAC PQ BMS SCADA IEEE OSKAR EV AC DC ES COP VFD VFDS LED LEDS IAQ PFC UAE KSA ISO FFT "
               "PCBA IGBT HEPA VOC VOCS CO2 DEWA OTA APP CPO SOC DVR MEP FZE LLC AMR IOT PLC HMI THD PF DESC SER SEC WLAN".split())
PROPER = {"energy savers": "Energy Savers", "sinexcel": "Sinexcel", "siemens": "Siemens", "dubai": "Dubai"}
UPPER = set("AHF SVG UPS HVAC PQ BMS SCADA IEEE LED IAQ HEPA EV VFD COP".split())   # "Bms" and "hvac" in old headings
FIGURE = re.compile(r"^[\d.,~+%<>≥≤-]+\s?[%A-Za-z]{0,3}$")
MOBILE = re.compile(r"(-m-\d|mobile)", re.I)
WARN = []
SQ_LIST = '<ul class="sq-list">'


# ------------------------------------------------------------------ small helpers
def read(path):
    return open(os.path.join(ROOT, path), encoding="utf-8").read()


def esc(t):
    return html.escape(t, quote=False)


def attr(t):
    return html.escape(t, quote=True)


def lines(t):
    return "<br>".join(esc(x) for x in t.split("\n"))


def one_line(t):
    return re.sub(r"\s*\n\s*", " ", t).strip()


def lvl(b):
    return int(b["t"][1])


def text_of(item):
    return item if isinstance(item, str) else item["text"]


def tidy(t):
    """Old headings are often in capitals. Show them in sentence case, keeping acronyms and names."""
    t = one_line(t).rstrip(":").strip()
    letters = [c for c in t if c.isalpha()]
    if not letters:
        return t
    shouting = len(letters) > 3 and sum(c.isupper() for c in letters) / len(letters) > .75

    def word(m):
        w = m.group(0)
        core = re.sub(r"[^A-Za-z0-9]", "", w)
        if core.upper() in UPPER:
            return w.upper()
        if not core or core.upper() in ACRONYMS or any(ch.isdigit() for ch in core):
            return w
        if w.isupper() and (shouting or len(core) >= 4):
            return w.lower()
        return w

    out = re.sub(r"[A-Za-z0-9][A-Za-z0-9'’&.-]*", word, t)
    if shouting:
        for k, v in PROPER.items():
            out = re.sub(r"\b" + k + r"\b", v, out)
    if out[:1] != t[:1] or shouting:                  # a lowered first word starts with a capital again
        out = out[:1].upper() + out[1:]
    return out


def accent(title):
    """The last word in the body serif's italic, as in the homepage headings."""
    words = one_line(title).split(" ")
    if len(words) < 2:
        return esc(words[0])
    return esc(" ".join(words[:-1])) + ' <span class="accent">' + esc(words[-1]) + "</span>"


def norm(t):
    return re.sub(r"[^a-z0-9]+", " ", one_line(t).lower().replace("about ", "")).strip()


def href(slug):
    return UP + slug + "/"


def inline(b):
    """A paragraph or list item, with its bold lead-in."""
    t = b if isinstance(b, str) else b["text"]
    lead = None if isinstance(b, str) else b.get("lead")
    if lead and t.startswith(lead):
        rest = t[len(lead):]
        sep = "" if rest[:1] in (":", "-", "–", " ") else " "
        return f"<strong>{lines(lead)}</strong>{sep}{lines(rest)}"
    return lines(t)


# ------------------------------------------------------------------ images
_images = {}


def image(path):
    """Download (once) and encode an old-site image. Returns its size, WebP files and tone."""
    if path in _images:
        return _images[path]
    src = os.path.join(CACHE, path)
    if not os.path.exists(src) or not os.path.getsize(src):
        os.makedirs(os.path.dirname(src), exist_ok=True)
        if subprocess.run(["curl", "-sfL", "-A", "Mozilla/5.0", "-o", src, UPLOADS + path]).returncode:
            raise SystemExit("download failed: " + path)
    im = Image.open(src)
    W, H = im.size
    stem = re.sub(r"[^a-z0-9]+", "-", path.lower().rsplit(".", 1)[0]).strip("-")
    os.makedirs(os.path.join(ROOT, IMG_DIR), exist_ok=True)
    info = {"w": W, "h": H, "files": [], "still": None}
    rgba = im.convert("RGBA")
    info["alpha"] = rgba.getextrema()[3][0] < 250
    if getattr(im, "is_animated", False):
        w = min(W, 800)
        out, still = f"{IMG_DIR}/{stem}-{w}.webp", f"{IMG_DIR}/{stem}-{w}-still.webp"
        if not os.path.exists(os.path.join(ROOT, out)):
            frames, durations = [], []
            for fr in ImageSequence.Iterator(im):
                durations.append(fr.info.get("duration", 80))
                f = fr.convert("RGBA")
                frames.append(f if w == W else f.resize((w, round(H * w / W)), Image.LANCZOS))
            frames[0].save(os.path.join(ROOT, out), "WEBP", save_all=True, append_images=frames[1:],
                           duration=durations, loop=0, quality=72, method=4)
            frames[0].save(os.path.join(ROOT, still), "WEBP", quality=82, method=6)
        info["files"], info["still"] = [(w, out)], still
    else:
        ladder = [W] if W <= 960 else [960, W] if W <= 1600 else [960, 1600]
        base = rgba if info["alpha"] else rgba.convert("RGB")
        for w in ladder:
            out = f"{IMG_DIR}/{stem}-{w}.webp"
            if not os.path.exists(os.path.join(ROOT, out)):
                r = base if w == W else base.resize((w, round(H * w / W)), Image.LANCZOS)
                photo = path.lower().endswith((".jpg", ".jpeg"))
                r.save(os.path.join(ROOT, out), "WEBP", quality=80 if photo else 88, method=6)
            info["files"].append((w, out))
    # a product shot on white has white corners; a photo does not
    rgb = rgba.convert("RGB")
    corners = [rgb.getpixel((x, y)) for x in (0, W - 1) for y in (0, H - 1)]
    info["white_corners"] = all(min(c) >= 238 for c in corners)
    # how light the visible pixels are: decides whether an icon set sits on ink or paper
    small = rgba.resize((32, 32))
    px = [p for p in small.getdata() if p[3] > 128]
    info["tone"] = (sum(.2126 * r + .7152 * g + .0722 * b for r, g, b, _ in px) / len(px) / 255) if px else 1
    _images[path] = info
    return info


def is_icon(path):
    return image(path)["w"] <= 160


def is_cutout(path):
    """A product shot on a transparent or white ground (not a photo)."""
    info = image(path)
    return info["alpha"] or info["white_corners"]


def img(path, alt="", sizes="(min-width: 960px) 50vw, 100vw", cls="", mobile=None, eager=False):
    info = image(path)
    files = info["files"]
    w, rel = files[-1]
    h = round(info["h"] * w / info["w"])
    a = []
    if cls:
        a.append(f'class="{cls}"')
    a.append(f'src="{UP}{files[0][1]}"')
    if len(files) > 1:
        a.append('srcset="' + ", ".join(f"{UP}{r} {fw}w" for fw, r in files) + f'" sizes="{sizes}"')
    a.append(f'width="{w}" height="{h}" alt="{attr(alt)}"')
    if not eager:
        a.append('loading="lazy"')
    a.append('decoding="async"')
    tag = "<img " + " ".join(a) + ">"
    sources = []
    if info["still"]:
        sources.append(f'<source media="(prefers-reduced-motion: reduce)" srcset="{UP}{info["still"]}">')
    if mobile:
        m = image(mobile)
        mw, mrel = m["files"][-1]
        sources.append(f'<source media="(max-width: 719px)" srcset="{UP}{mrel}" width="{mw}" height="{round(m["h"] * mw / m["w"])}">')
    return f"<picture>{''.join(sources)}{tag}</picture>" if sources else tag


def home_img(name, alt="", sizes="100vw", cls="", eager=False):
    """One of the homepage's own images (assets/img/<name>-<width>.webp)."""
    found = sorted((int(m.group(1)), f) for f in os.listdir(os.path.join(ROOT, "assets/img"))
                   for m in [re.match(re.escape(name) + r"-(\d+)\.webp$", f)] if m)
    if not found:
        raise SystemExit("missing homepage image: " + name)
    w, f = found[-1]
    im = Image.open(os.path.join(ROOT, "assets/img", f))
    default = next((f2 for w2, f2 in found if w2 >= 960), f)
    srcset = ", ".join(f"{UP}assets/img/{f2} {w2}w" for w2, f2 in found)
    lazy = "" if eager else ' loading="lazy"'
    c = f'class="{cls}" ' if cls else ""
    return (f'<img {c}src="{UP}assets/img/{default}" srcset="{srcset}" sizes="{sizes}" width="{w}" height="{im.height}" '
            f'alt="{attr(alt)}"{lazy} decoding="async">')


# ------------------------------------------------------------------ shared parts, from index.html
HOME = read("index.html")


def cut(pattern):
    m = re.search(pattern, HOME, re.S)
    if not m:
        raise SystemExit("index.html: missing " + pattern[:60])
    return m.group(0)


def relink(markup):
    """index.html's relative links, seen from one folder down."""
    def one(url):
        return url if re.match(r"^(https?:|mailto:|tel:|#|/|data:|\.\./)", url) else UP + url
    markup = re.sub(r'\b(href|src)="([^"]*)"', lambda m: f'{m.group(1)}="{one(m.group(2))}"', markup)
    return re.sub(r'srcset="([^"]*)"', lambda m: 'srcset="' + ", ".join(one(p.strip()) for p in m.group(1).split(",")) + '"', markup)


HEAD = relink(cut(r"<meta name=\"robots\".*?</head>"))
SPRITE = cut(r'<svg class="sprite".*?</svg>')
LOADER = cut(r'<!-- Shown only when.*?\n</div>')
HEADER = relink(cut(r'<header class="site-header".*?\n</header>')).replace(
    '<a class="brand" href="#top" aria-label="Energy Savers, back to top">', f'<a class="brand" href="{UP}" aria-label="Energy Savers, home">')
CONTACT = relink(cut(r'  <!-- =+ CONTACT =+ -->\n  <section class="contact.*?\n  </section>'))
FOOTER = relink(cut(r'<footer class="site-footer.*?</footer>')).replace(
    'href="#top" aria-label="Energy Savers, back to top"', f'href="{UP}" aria-label="Energy Savers, home"')
QUICK = cut(r'<div class="quick-actions".*?\n</div>')
CERTS = relink(cut(r'<!-- =+ CERTIFICATE VIEWER =+ -->\n<dialog.*?</dialog>'))

ARTICLES = {m.group(1): m.group(0) for m in re.finditer(r'<article class="case" id="case-([a-z-]+)">.*?</article>', HOME, re.S)}
REGISTER = {}
for m in re.finditer(r'<tr>\s*<td class="register__year">(\d+)</td>\s*<th scope="row"><button class="register__open" type="button" '
                     r'data-case="([a-z-]+)">(.*?)</button></th>\s*<td>(.*?)</td>\s*<td class="register__result">(.*?)</td>', HOME, re.S):
    REGISTER[m.group(2)] = {"year": m.group(1), "name": m.group(3), "scope": m.group(4), "result": m.group(5)}
for key, slug in CASES:
    client = re.search(r'<h3 class="case__client">(.*?)</h3>', ARTICLES[key]).group(1)
    LABEL[slug] = html.unescape(client)
SECTOR_ITEMS = {m.group(1): m.group(0) for m in re.finditer(r'<li class="sector" data-sector="([a-z]+)">.*?\n        </li>', HOME, re.S)}


def header_for(slug):
    top = slug
    while PARENT.get(top):
        top = PARENT[top]
    h = HEADER
    if top == "products":
        h = h.replace('<button class="nav-trigger" type="button"', '<button class="nav-trigger is-current" type="button"', 1)
    else:
        cur = ' aria-current="page"' if top == slug else ' class="is-current"'
        h = h.replace(f'<li><a href="{UP}{top}/">', f'<li><a href="{UP}{top}/"{cur}>')   # desktop and mobile menus
    return h


def page(slug, title, desc, main, extra="", contact=True):
    head = re.sub(r"<title>.*?</title>", "", HEAD)
    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{esc(title) if len(title) > 52 else esc(title) + " — Energy Savers"}</title>
<meta name="description" content="{attr(desc)}">
<!-- Private preview of a proposed redesign. Keep it out of search engines until the owner approves it. -->
{head}
<body>
<!-- Generated by tools/build-pages.py from content/{"posts" if PARENT.get(slug) == "blog" else "pages"}/. Edit the content or the script, not this file. -->
{SPRITE}

<a class="skip-link" href="#main">Skip to content</a>

{LOADER}

{header_for(slug)}

<main id="main">
{main}
{CONTACT if contact else ""}
</main>

{FOOTER}

{QUICK}
{extra}
<script src="{UP}script.js" defer></script>
</body>
</html>
"""
    out = os.path.join(ROOT, slug, "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(re.sub(r"\n{3,}", "\n\n", doc))


# ------------------------------------------------------------------ building blocks
def crumbs(slug):
    trail, p = [], PARENT.get(slug)
    while p:
        trail.insert(0, p)
        p = PARENT.get(p)
    items = [f'<li><a href="{UP}">Home</a></li>'] + [f'<li><a href="{href(s)}">{esc(LABEL[s])}</a></li>' for s in trail]
    return f'<nav class="crumbs" aria-label="Breadcrumb"><ol>{"".join(items)}</ol></nav>'


def page_head(slug, title, kicker=None, lede=None, actions="", media="", wide=False, todo=None):
    k = f'\n        <p class="page-head__kicker">{kicker}</p>' if kicker else ""
    l = f'\n        <div class="page-head__lede">{lede}</div>' if lede else ""
    a = f'\n        <div class="page-head__actions">{actions}</div>' if actions else ""
    t = f"\n  <!-- TODO(owner): {esc(todo)} -->" if todo else ""
    grid = " page-head__grid--media" if media and not wide else ""
    m = ""
    if media:
        m = f'\n      <figure class="page-head__media{" page-head__media--wide" if wide else ""}">{media}</figure>'
    return f"""{t}
  <section class="page-head" aria-labelledby="page-title">
    <div class="wrap page-head__grid{grid}">
      <div class="page-head__text">
        {crumbs(slug)}{k}
        <h1 class="page-title" id="page-title">{title}</h1>{l}{a}
      </div>{m}
    </div>
  </section>
"""


def doc_link(b, label=None):
    label = b.get("text") or label or "Download"
    return (f'<a class="text-link" href="{UPLOADS}{b["href"]}">{esc(label)} (PDF) '
            f'<svg class="i" aria-hidden="true"><use href="#i-external"/></svg></a>')


def ul_html(b):
    items = b["items"]
    rows = [text_of(i).split("\n") for i in items]
    if len(rows) >= 3 and len({len(r) for r in rows}) == 1 and len(rows[0]) >= 3:
        # a table built out of list items on the old page (rows of cells)
        head = "".join(f'<th scope="col">{esc(c)}</th>' for c in rows[0])
        body = "".join("<tr>" + "".join((f'<th scope="row">{esc(c)}</th>' if j == 0 else f"<td>{esc(c)}</td>") for j, c in enumerate(r)) + "</tr>" for r in rows[1:])
        return f'<div class="table-scroll"><table class="data-table"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'
    li = []
    for i in items:
        target = i.get("href") if isinstance(i, dict) else None
        content = inline(i)
        if target and target in LABEL:
            content = f'<a href="{href(target)}">{content}</a>'
        li.append(f"<li>{content}</li>")
    return f'<ul class="sq-list">{"".join(li)}</ul>'


def figure(b, sizes="(min-width: 960px) 50vw, 100vw", cls="fig"):
    return f'<figure class="{cls}">{img(b["src"], b.get("alt") or "", sizes=sizes, mobile=b.get("mobile"))}</figure>'


def compare(b):
    return ('<div class="compare">'
            f'<figure class="compare__side">{img(b["before"], "", sizes="(min-width: 960px) 30vw, 50vw")}<figcaption>Before</figcaption></figure>'
            f'<figure class="compare__side">{img(b["after"], "", sizes="(min-width: 960px) 30vw, 50vw")}<figcaption>After</figcaption></figure>'
            "</div>")


def prose(blocks, hl=3, keep_levels=False):
    """Running text. Headings become level hl, or keep their own level (blog posts)."""
    out, docs = [], []

    def flush_docs():
        if docs:
            out.append('<ul class="docs">' + "".join(f"<li>{doc_link(d)}</li>" for d in docs) + "</ul>")
            docs.clear()

    for b in blocks:
        if b["t"] == "pdf":
            docs.append(b)
            continue
        flush_docs()
        t = b["t"]
        if t == "p":
            out.append(f"<p>{inline(b)}</p>")
        elif t in HEADINGS:
            n = max(2, lvl(b)) if keep_levels else hl
            out.append(f"<h{n}>{esc(tidy(b['text']))}</h{n}>")
        elif t == "ul":
            out.append(ul_html(b))
        elif t == "img":
            out.append(figure(b))
        elif t == "compare":
            out.append(compare(b))
    flush_docs()
    return "\n".join(out)


# ------------------------------------------------------------------ reading a section
def normalize(blocks, slug):
    """Clean one old section: drop UI leftovers, merge tab labels into their panels, pair phone images."""
    out = []
    for b in blocks:
        b = dict(b)
        if b["t"] in ("p",) + HEADINGS:
            for old, new in OVERRIDES.get(slug, {}).get("replace", []):
                b["text"] = old.sub(new, b["text"]) if hasattr(old, "sub") else b["text"].replace(old, new)
            if not b["text"].strip() or JUNK.match(b["text"].strip()):
                continue
            m = re.match(r"^\+\s*-\s*(.+)$", b["text"], re.S)
            if m and b["t"] == "p":
                b = {"t": "h4", "text": m.group(1)}          # an accordion title on the old page
        if b["t"] == "ul":
            b["items"] = [i for i in b["items"] if not JUNK.match(text_of(i).strip())]
            if not b["items"]:
                continue
        if b["t"] == "img" and out and out[-1]["t"] == "img" and MOBILE.search(b["src"]) and not MOBILE.search(out[-1]["src"]):
            out[-1]["mobile"] = b["src"]                      # the phone version of the image before it
            continue
        colon = re.match(r"^([^:.\n]{3,60}):\s+(.+)$", b.get("text", ""), re.S) if b["t"] == "p" else None
        if b["t"] == "p" and (b.get("lead") or colon) and out and out[-1]["t"] == "img" and is_icon(out[-1]["src"]):
            lead = b.get("lead") or colon.group(1)
            rest = b["text"][len(lead):].lstrip(" :–-")
            out.append({"t": "h4", "text": lead})
            if rest:
                out.append({"t": "p", "text": rest})
            continue
        if b["t"] == "img" and out and out[-1]["t"] == "img" and b.get("alt") == "After image" and out[-1].get("alt") == "Before image":
            out[-1] = {"t": "compare", "before": out[-1]["src"], "after": b["src"]}
            continue
        out.append(b)
    # tabs: a row of labels (often with icons) followed by panels that repeat each label
    seen = {}
    for i, b in enumerate(out):
        if b["t"] in HEADINGS:
            seen.setdefault(norm(b["text"]), []).append(i)
    drop = set()
    for idx in seen.values():
        if len(idx) == 2:
            first, second = idx
            nxt = out[first + 1] if first + 1 < len(out) else None
            label_only = nxt is None or nxt["t"] in HEADINGS or (nxt["t"] == "img" and is_icon(nxt["src"]))
            if not label_only:
                continue                                  # the same heading twice, each with its own text
            if first > 0 and out[first - 1]["t"] == "img" and is_icon(out[first - 1]["src"]):
                out[second] = dict(out[second], icon=out[first - 1]["src"])
                drop.add(first - 1)
            drop.add(first)
    return [b for i, b in enumerate(out) if i not in drop]


def layout(blocks):
    """Split a section into its heading run, the text before any item, the items, and trailing images."""
    i = 0
    while i < len(blocks) and blocks[i]["t"] in HEADINGS:
        i += 1
    run, rest = blocks[:i], blocks[i:]
    later = {lvl(b) for b in rest if b["t"] in HEADINGS}
    if run and lvl(run[-1]) in later:                 # the last heading opens the first item
        run, rest = run[:-1], blocks[i - 1:]
    intro, items, cur, lead, loose = [], [], None, None, []
    for k, b in enumerate(rest):
        nxt = rest[k + 1] if k + 1 < len(rest) else None
        if b["t"] == "img" and nxt is not None and nxt["t"] in HEADINGS and not is_icon(b["src"]) \
                and any(it["media"] and is_icon(it["media"][0]["src"]) for it in items):
            loose.append(b)
            continue
        if b["t"] in HEADINGS:
            cur = {"title": b, "media": [lead] if lead else [], "body": [],
                   "href": b.get("href") or (lead or {}).get("href")}
            lead = None
            items.append(cur)
        elif b["t"] == "img" and nxt is not None and nxt["t"] in HEADINGS:
            if lead:
                (cur["body"] if cur else intro).append(lead)
            lead = b
        elif b["t"] == "link":
            if cur is not None and not cur["href"]:
                cur["href"] = b["href"]
        else:
            (cur["body"] if cur else intro).append(b)
    if lead:
        (cur["body"] if cur else intro).append(lead)
    tail = loose
    if len(items) >= 2 and not any(x["t"] == "img" for it in items[:-1] for x in it["body"]):
        last = items[-1]["body"]
        while last and last[-1]["t"] in ("img", "compare"):
            tail.insert(0, last.pop())
    if len(items) == 1:                                # a single sub-heading is just part of the text
        it = items[0]
        if not run:
            run, intro = [it["title"]], intro + it["media"] + it["body"]
        else:
            intro = intro + [it["title"]] + it["media"] + it["body"]
        items = []
    return run, intro, items, tail


# ------------------------------------------------------------------ bands
class Ids:
    def __init__(self):
        self.n = 0

    def next(self):
        self.n += 1
        return f"s{self.n}"


def title_html(run, ids, level=2, cls="band__title"):
    if not run:
        return "", None
    texts = [tidy(h["text"]) for h in run]
    labels, main = texts[:-1], texts[-1]
    i = ids.next()
    lab = "".join(f'<span class="band__label">{esc(t)}</span> ' for t in labels)
    long = " band__title--long" if len(" ".join(texts)) > 56 else ""
    return f'<h{level} class="{cls}{long}" id="{i}">{lab}{accent(main)}</h{level}>', i


def resolve(slug, item):
    target = item.get("href")
    title = one_line(item["title"]["text"])
    target = FIX_LINKS.get((slug, title), target)
    if target and target not in LABEL:
        WARN.append(f"{slug}: link to an unknown page {target}")
        target = None
    if not target:                                    # match the card title to a child page
        for kid in CHILDREN.get(slug, []):
            a, b = norm(title).rstrip("s"), norm(LABEL[kid]).rstrip("s")
            if a and (a == b or a.startswith(b) or b.startswith(a)):
                target = kid
    return target


def tiles(slug, items, kind, hl):
    out = []
    for it in items:
        t = tidy(it["title"]["text"])
        target = resolve(slug, it)
        media = it["media"][0] if it["media"] else None
        icon = it["title"].get("icon") or (media["src"] if media and is_icon(media["src"]) else None)
        parts = []
        if icon:
            parts.append(img(icon, "", cls="tile__icon"))
        elif media:
            cut = " tile__media--cutout" if is_cutout(media["src"]) else ""
            parts.append(f'<figure class="tile__media{cut}">{img(media["src"], "", sizes="(min-width: 960px) 30vw, 90vw", mobile=media.get("mobile"))}</figure>')
        name = f'<a href="{href(target)}">{esc(t)}</a>' if target else esc(t)
        parts.append(f'<h{hl} class="tile__title">{name}</h{hl}>')
        body = prose(it["body"], hl + 1)
        if body:
            parts.append(f'<div class="tile__body">{body}</div>')
        out.append(f'<li class="tile{" tile--link" if target else ""}">' + "".join(parts) + "</li>")
    return f'<ul class="tiles tiles--{kind}">' + "".join(out) + "</ul>"


def grid_kind(items):
    def has_icon(it):
        return it["title"].get("icon") or (it["media"] and is_icon(it["media"][0]["src"]))
    if all(has_icon(it) for it in items):
        return "icons"
    if sum(1 for it in items if it["media"]) >= len(items) / 2:
        big = any(image(it["media"][0]["src"])["w"] >= 900 for it in items if it["media"])
        return "photos" if big else "cards"
    return "text"


def icon_tone(items):
    tones = [image(it["title"].get("icon") or it["media"][0]["src"])["tone"] for it in items]
    return "light" if min(tones) >= .55 else "dark"


def media_html(blocks):
    """Images of a text band: one modest image sits beside the text, anything bigger gets the full width."""
    figs = []
    for b in blocks:
        if b["t"] == "compare":
            figs.append(compare(b))
        else:
            figs.append(figure(b, sizes="(min-width: 960px) 40vw, 100vw"))
    return "".join(figs)


def stats_band(blocks, ids):
    cells = []
    for j in range(0, len(blocks), 2):
        cells.append(f'<div class="figures__cell"><dt>{esc(tidy(blocks[j + 1]["text"]))}</dt>'
                     f'<dd><span class="figures__num">{esc(blocks[j]["text"])}</span></dd></div>')
    return f'  <div class="band band--stats">\n    <div class="wrap"><dl class="figures">{"".join(cells)}</dl></div>\n  </div>\n'


def is_stats(blocks):
    return (len(blocks) >= 4 and len(blocks) % 2 == 0 and all(b["t"] in HEADINGS for b in blocks)
            and all(FIGURE.match(blocks[j]["text"]) for j in range(0, len(blocks), 2)))


def band(slug, blocks, ids):
    if is_stats(blocks):
        return stats_band(blocks, ids)
    run, intro, items, tail = layout(blocks)
    h, hid = title_html(run, ids)
    kind = grid_kind(items) if items else None
    srcs = {b["src"] for b in intro + tail if b["t"] == "img"} | {m["src"] for it in items for m in it["media"]} \
        | {b["src"] for it in items for b in it["body"] if b["t"] == "img"}
    ink = (kind == "icons" and icon_tone(items) == "light") or bool(srcs & DARK_GROUND)
    cls = ["band"] + (["on-ink"] if ink else []) + ([] if h else ["band--untitled"])
    parts = []
    if h:
        parts.append(h)
    intro_imgs = [b for b in intro if b["t"] in ("img", "compare")]
    intro_text = [b for b in intro if b["t"] not in ("img", "compare")]
    aside, wide = [], []
    for b in intro_imgs + tail:
        if b["t"] == "img":
            info = image(b["src"])
            modest = info["w"] <= 1100 and info["w"] / info["h"] <= 1.7 and not items
            (aside if modest and not aside else wide).append(b)
        else:
            wide.append(b)
    if aside and not intro_text and not items:        # an image on its own: give it the room
        wide, aside = aside + wide, []
    if intro_text:
        parts.append(f'<div class="band__body prose">{prose(intro_text)}</div>')
    if aside:
        parts.append(f'<div class="band__aside">{media_html(aside)}</div>')
    if items:
        parts.append(f'<div class="band__wide">{tiles(slug, items, kind, 3 if h else 2)}</div>')
    if wide:
        n = len([b for b in wide if b["t"] == "img"])
        parts.append(f'<div class="band__wide band__gallery band__gallery--{min(n, 3)}">{media_html(wide)}</div>')
    if not parts:
        return ""
    label = f' aria-labelledby="{hid}"' if hid else ""
    tag = "section" if hid else "div"
    return f'  <{tag} class="{" ".join(cls)}"{label}>\n    <div class="wrap band__grid">\n      ' + "\n      ".join(parts) + f"\n    </div>\n  </{tag}>\n"


def siblings(slug):
    parent = PARENT.get(slug)
    if not parent or parent == "blog" or len(CHILDREN.get(parent, [])) < 2:
        return ""
    lis = "".join(f'<li><a href="{href(k)}"' + (' aria-current="page"' if k == slug else "") + f">{esc(LABEL[k])}</a></li>"
                  for k in CHILDREN[parent])
    return f"""  <nav class="band band--siblings" aria-labelledby="siblings-title">
    <div class="wrap band__grid">
      <h2 class="band__title" id="siblings-title"><a href="{href(parent)}">{accent(LABEL[parent])}</a></h2>
      <ul class="siblings">{lis}</ul>
    </div>
  </nav>
"""


def contact_button(slug, title):
    in_products = False
    p = slug
    while p:
        in_products = in_products or p == "products"
        p = PARENT.get(p)
    if in_products:
        return (f'<a class="btn btn--primary" href="#contact" data-interest="Product enquiry" data-note="Product: {attr(one_line(title))}">'
                f'Contact us <svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></a>')
    return (f'<a class="btn btn--primary" href="#contact" data-interest="{INTEREST.get(slug, "Other")}">'
            f'Contact us <svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></a>')


def load(kind, slug):
    return json.load(open(os.path.join(CONTENT, kind, slug + ".json"), encoding="utf-8"))


def description(d, fallback):
    if d.get("description"):
        return d["description"]
    return fallback


# ------------------------------------------------------------------ page types
def generic(slug, hero=True, title=None, lede_html=None, head_media=None):
    d = load("pages", slug)
    secs = [normalize(s["blocks"], slug) for s in d["sections"]]
    secs = [s for s in secs if s]
    title = title or d.get("title") or LABEL[slug]
    ids = Ids()
    kicker, lede, docs, media = [], None, [], None
    if hero and secs:
        first = secs.pop(0)
        if slug == "ev-chargers":                      # a slider: its first slide is the page head
            run, intro, items, tail = layout(first)
            s1 = items.pop(0)
            title = one_line(s1["title"]["text"])
            media = s1["media"][0] if s1["media"] else None
            lede = next((b for b in s1["body"] if b["t"] == "p"), None)
            rest = [x for it in items for x in ([dict(it["media"][0], href=it.get("href"))] if it["media"] else []) + [it["title"]] + it["body"]]
        else:
            i = 0
            while i < len(first) and first[i]["t"] in HEADINGS:
                i += 1
            run = first[:i]
            later = {lvl(b) for b in first[i:] if b["t"] in HEADINGS}
            if run and lvl(run[-1]) in later:
                run, i = run[:-1], i - 1
            for h in run:
                a, b = norm(h["text"]), norm(title)
                if not (a in b or b in a):
                    kicker.append(tidy(h["text"]))
            rest = []
            for b in first[i:]:
                text_started = any(x["t"] in HEADINGS for x in rest)
                if lede is None and b["t"] == "p" and not text_started:
                    lede = b
                elif b["t"] == "pdf" and not text_started:
                    docs.append(b)
                elif media is None and b["t"] == "img" and not text_started and not is_icon(b["src"]):
                    media = b
                else:
                    rest.append(b)
        if rest:
            secs.insert(0, rest)
    actions = "".join(doc_link(b) for b in docs[:2])
    if hero:
        actions = contact_button(slug, title) + actions
    m, wide = "", False
    if head_media:
        m, wide = head_media
    elif media:
        info = image(media["src"])
        wide = info["w"] / info["h"] > 1.7
        alt = one_line(title) if is_cutout(media["src"]) else ""
        m = img(media["src"], alt, sizes="(min-width: 960px) 42vw, 100vw" if not wide else "100vw", mobile=media.get("mobile"), eager=True,
                cls="is-cutout" if is_cutout(media["src"]) and not wide else "")
    lede_out = lede_html or (f"<p>{inline(lede)}</p>" if lede else None)
    todo = OVERRIDES.get(slug, {}).get("todo")
    out = page_head(slug, accent(title), " · ".join(esc(k) for k in kicker) or None, lede_out, actions, m, wide, todo)
    for s in secs:
        out += band(slug, s, ids)
    out += siblings(slug)
    desc = description(d, one_line(lede["text"]) if lede else LABEL[slug])
    page(slug, one_line(title), desc, out)


def render_products():
    shelf = relink(cut(r'<div class="bench__shelf">.*?\n      </div>\n    </div>\n  </section>'))
    shelf = shelf[:shelf.rindex("</div>\n    </div>\n  </section>")] + "</div>"

    def line(m):
        art = m.group(0)
        slug = LINE_OF_KEY[m.group(1)]
        art = re.sub(r'<button class="line__media" type="button" data-product="[a-z0-9-]+" (aria-label="[^"]*")>(.*?)</button>',
                     lambda x: f'<a class="line__media" href="{href(slug)}" {x.group(1)}>{x.group(2)}</a>', art, flags=re.S)
        art = re.sub(r'<h3 class="line__name">(.*?)</h3>', lambda x: f'<h2 class="line__name"><a href="{href(slug)}">{x.group(1)}</a></h2>', art)
        art = re.sub(r'<button type="button" data-product="([a-z0-9-]+)">(.*?)</button>',
                     lambda x: f'<a href="{href(PRODUCT_KEYS[x.group(1)])}">{x.group(2)}</a>', art)
        return art

    shelf = re.sub(r'<article class="line" data-line="([a-z]+)">.*?</article>', line, shelf, flags=re.S)
    d = load("pages", "products")
    out = page_head("products", "Our <span class=\"accent\">products</span>")
    out += f'  <div class="bench bench--page">\n    <div class="wrap">\n      {shelf.strip()}\n    </div>\n  </div>\n'
    page("products", "Products", d["description"], out)


def render_services():
    rail = relink(cut(r'<ol class="rail services__rail" id="services-rail" aria-label="Services">.*?</ol>'))
    rail = rail.replace('<ol class="rail services__rail" id="services-rail" aria-label="Services">', '<ol class="svc-grid">')
    rail = rail.replace('<h3 class="svc__name">', '<h2 class="svc__name">').replace("</a></h3>", "</a></h2>")
    rail = re.sub(r'sizes="[^"]*"', 'sizes="(min-width: 1100px) 400px, (min-width: 640px) 45vw, 90vw"', rail)
    d = load("pages", "services")
    out = page_head("services", "Our <span class=\"accent\">services</span>")
    out += f'  <div class="band band--untitled">\n    <div class="wrap">\n      {rail}\n    </div>\n  </div>\n'
    page("services", "Services", d["description"], out)


def render_index(slug, title_html, title_text, lede=None):
    """A list page (Solutions): the old cards, each linking to its page."""
    d = load("pages", slug)
    ids = Ids()
    out = page_head(slug, title_html, lede=lede)
    for s in d["sections"]:
        out += band(slug, normalize(s["blocks"], slug), ids)
    page(slug, title_text, d["description"], out)


def render_sectors():
    d = load("pages", "sectors")
    intro = re.search(r'<div class="sectors__intro">.*?<p>(.*?)</p>', HOME, re.S).group(1)
    cards = []
    for slug in CHILDREN["sectors"]:
        key = SECTOR_KEYS[slug]
        item = SECTOR_ITEMS[key]
        areas = re.search(r'<p class="sector__areas">(.*?)</p>', item).group(1)
        name = re.search(r'<h3 class="sector__name">(.*?)</h3>', item).group(1)
        cards.append(f'<li class="tile tile--link"><figure class="tile__media tile__media--photo">'
                     f'{home_img("sector-" + key, sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw")}</figure>'
                     f'<h2 class="tile__title"><a href="{href(slug)}">{name}</a></h2><div class="tile__body"><p>{areas}</p></div></li>')
    out = page_head("sectors", "Our <span class=\"accent\">sectors</span>", lede=f"<p>{intro}</p>")
    out += f'  <div class="band band--untitled">\n    <div class="wrap band__grid">\n      <div class="band__wide"><ul class="tiles tiles--photos">{"".join(cards)}</ul></div>\n    </div>\n  </div>\n'
    page("sectors", "Sectors", d["description"], out)


def case_cards(keys, hl=2):
    cards = []
    for key in keys:
        slug = dict(CASES)[key]
        art = ARTICLES[key]
        photo = relink(re.search(r'<figure class="case__photo">(.*?)</figure>', art, re.S).group(1))
        photo = re.sub(r'sizes="[^"]*"', 'sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw"', photo)
        r = REGISTER[key]
        where = re.search(r'<p class="case__where">(.*?)</p>', art).group(1)
        cards.append(f'<li class="tile tile--link tile--case"><figure class="tile__media tile__media--photo">{photo}</figure>'
                     f'<p class="tile__meta">{where}</p>'
                     f'<h{hl} class="tile__title"><a href="{href(slug)}">{esc(LABEL[slug])}</a></h{hl}>'
                     f'<div class="tile__body"><p>{r["scope"]}</p><p class="tile__result">{r["result"]}</p></div></li>')
    return f'<ul class="tiles tiles--photos">{"".join(cards)}</ul>'


def render_cases_index():
    out = page_head("case-studies", "Case <span class=\"accent\">studies</span>")
    out += f'  <div class="band band--untitled">\n    <div class="wrap band__grid">\n      <div class="band__wide">{case_cards([k for k, _ in CASES])}</div>\n    </div>\n  </div>\n'
    page("case-studies", "Case studies", "Power quality, HVAC and automation projects by Energy Savers in Dubai.", out)


def render_case(key, slug):
    art = ARTICLES[key]
    photo = relink(re.search(r'<figure class="case__photo">(.*?)</figure>', art, re.S).group(1))
    photo = re.sub(r'sizes="[^"]*"', 'sizes="(min-width: 960px) 42vw, 100vw"', photo).replace(' loading="lazy"', "")
    where = re.search(r'<p class="case__where">(.*?)</p>', art).group(1)
    where = re.sub(r"\s*<span>(.*?)</span>", r" · \1", where)
    scope = re.search(r'<p class="case__scope">(.*?)</p>', art, re.S).group(1)
    findings = re.search(r'<div class="case__findings">(.*?)\n\s*</div>', art, re.S).group(1)
    groups = re.findall(r"<h4>(.*?)</h4>\s*(<ul>.*?</ul>)", findings, re.S)
    workplan = re.search(r'<figure class="workplan".*?</figure>', art, re.S)
    todos = re.findall(r"<!-- TODO\(owner\).*?-->", art + HOME[HOME.find('id="cases-title"'):HOME.find('<article class="case" id="case-emicool"')])
    ids = Ids()
    cols = "".join(f'<div class="findings__group"><h2 class="findings__title" id="{ids.next()}">{t}</h2>{u.replace("<ul>", SQ_LIST)}</div>'
                   for t, u in groups)
    out = page_head(slug, accent(html.unescape(LABEL[slug])), where, f'<p>{scope.strip()}</p>', contact_button(slug, LABEL[slug]), photo)
    plan = ""
    if workplan:
        plan = ("\n      " + todos[0] if todos else "") + f'\n      <div class="band__wide">{workplan.group(0)}</div>'
    out += f'  <div class="band">\n    <div class="wrap band__grid">\n      <div class="band__wide findings">{cols}</div>{plan}\n    </div>\n  </div>\n'
    out += siblings(slug)
    page(slug, html.unescape(LABEL[slug]), html.unescape(re.sub(r"<[^>]+>", " ", scope)).strip(), out)


def render_sector(slug):
    d = load("pages", slug)
    secs = d["sections"]
    banner = secs[0]["blocks"]
    name = next((b["text"] for b in banner if b["t"] == "h2"), LABEL[slug])
    intro = [b for b in banner if b["t"] == "p"]
    key = SECTOR_KEYS[slug]
    phases, cur, topic = [], None, None
    for b in secs[1]["blocks"]:
        if b["t"] == "p" and b["text"].strip() in ("Challenges", "Root Cause Analysis", "Solutions", "Benefits"):
            cur = {"name": b["text"].strip(), "topics": []}
            phases.append(cur)
        elif b["t"] in HEADINGS and cur is not None:
            topic = {"name": tidy(b["text"]), "blocks": []}
            cur["topics"].append(topic)
        elif topic is not None:
            topic["blocks"].append(b)
    ids = Ids()
    panels = []
    for ph in phases:
        pid = "phase-" + re.sub(r"[^a-z]+", "-", ph["name"].lower()).strip("-")
        topics = "".join(f'<section class="topic"><h3 class="topic__title">{esc(t["name"])}</h3>{prose(t["blocks"])}</section>' for t in ph["topics"])
        panels.append(f'<div class="phase" id="{pid}"><h2 class="phase__title">{esc(tidy(ph["name"]))}</h2>'
                      f'<div class="topics">{topics}</div></div>')
    lede = "".join(f"<p>{inline(b)}</p>" for b in intro)
    media = home_img("sector-" + key, sizes="100vw", eager=True, cls="sector-photo sector-photo--" + key)
    out = page_head(slug, accent(name), lede=lede, actions=contact_button(slug, name), media=media, wide=True)
    out += f'  <div class="band band--phases">\n    <div class="wrap">\n      <div class="phases" data-tabs>{"".join(panels)}</div>\n    </div>\n  </div>\n'
    for s in secs[2:]:
        out += band(slug, normalize(s["blocks"], slug), ids)
    cases = re.findall(r'data-case="([a-z-]+)"', SECTOR_ITEMS[key])
    if cases:
        out += (f'  <section class="band" aria-labelledby="sector-cases">\n    <div class="wrap band__grid">\n      '
                f'<h2 class="band__title" id="sector-cases">Case <span class="accent">studies</span></h2>\n      '
                f'<div class="band__wide">{case_cards(cases, 3)}</div>\n    </div>\n  </section>\n')
    out += siblings(slug)
    page(slug, name, d["description"] or one_line(intro[0]["text"]), out)


def render_about():
    d = load("pages", "about")
    blocks = d["sections"][0]["blocks"]
    paras = [b for b in blocks if b["t"] == "p"]
    lede = re.search(r'<p class="about__lede">(.*?)</p>', HOME, re.S).group(1)
    certs = relink(re.search(r'<ul class="certs">.*?\n        </ul>', HOME, re.S).group(0))
    highlights = re.search(r'<ul class="highlights">.*?</ul>', HOME, re.S).group(0)
    names = re.search(r'<div class="names">.*?\n      </div>\n', HOME, re.S).group(0)
    areas_h = next(b for b in blocks if b["t"] == "h2")
    areas = next(b for b in blocks if b["t"] == "ul")
    certified = next(p for p in paras if p["text"].startswith("Energy Savers is certified"))
    focus = next(p for p in paras if p["text"].startswith("Energy Savers focuses"))
    photo = home_img("about-business-bay", "Business Bay, Dubai, at dusk", sizes="100vw", eager=True)
    photo_alt = re.search(r'<figure class="about__photo">\s*<img [^>]*alt="([^"]*)"', HOME, re.S)
    if photo_alt:
        photo = home_img("about-business-bay", html.unescape(photo_alt.group(1)), sizes="100vw", eager=True)
    out = page_head("about", "About <span class=\"accent\">us</span>", lede=f"<p>{lede}</p>", media=photo, wide=True)
    out += f"""  <section class="band" aria-labelledby="about-areas">
    <div class="wrap band__grid">
      <h2 class="band__title band__title--long" id="about-areas">{accent(tidy(areas_h["text"]))}</h2>
      <div class="band__body prose">{ul_html(areas)}<p>{inline(certified)}</p></div>
    </div>
  </section>
  <section class="band on-ink" aria-labelledby="about-focus">
    <div class="wrap band__grid">
      <h2 class="band__title" id="about-focus">Sustainability in <span class="accent">energy</span></h2>
      <div class="band__body prose"><p>{inline(focus)}</p></div>
      <div class="band__wide">{highlights}</div>
    </div>
  </section>
  <section class="band" aria-labelledby="about-certs">
    <div class="wrap band__grid">
      <h2 class="band__title" id="about-certs">Our <span class="accent">certifications</span></h2>
      <div class="band__body">{certs}</div>
    </div>
  </section>
  <div class="band">
    <div class="wrap">
      {names}
    </div>
  </div>
"""
    page("about", "About us", d["description"], out, extra=CERTS)


def render_contact():
    contact = CONTACT.replace('<section class="contact on-ink" id="contact" aria-labelledby="contact-title">',
                              '<section class="contact contact--page on-ink" id="contact" aria-labelledby="contact-title">')
    out = page_head("contact-us", "Contact <span class=\"accent\">us</span>") + contact
    page("contact-us", "Contact us", "Contact Energy Savers in Dubai and Riyadh: phone, email, WhatsApp and office addresses.", out, contact=False)


def fmt_date(iso):
    y, m, d = iso.split("-")
    months = "January February March April May June July August September October November December".split()
    return f"{int(d)} {months[int(m) - 1]} {y}"


def render_blog(posts):
    intro = re.search(r'<div class="insights__head">.*?<p>(.*?)</p>', HOME, re.S).group(1)
    years = {}
    for p in posts:
        years.setdefault(p["date"][:4], []).append(p)
    groups = []
    for y in sorted(years, reverse=True):
        lis = "".join(f'<li class="post"><a href="{href(p["slug"])}"><time datetime="{p["date"]}">{fmt_date(p["date"])}</time>'
                      f'<span class="post__title">{esc(p["title"])}</span><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></a></li>'
                      for p in years[y])
        groups.append(f'<section class="blog-year" aria-labelledby="y{y}"><h2 class="blog-year__title" id="y{y}">{y}</h2><ul class="posts">{lis}</ul></section>')
    out = page_head("blog", "Our latest <span class=\"accent\">news</span>", lede=f"<p>{intro}</p>")
    out += f'  <div class="band band--untitled">\n    <div class="wrap">\n      {"".join(groups)}\n    </div>\n  </div>\n'
    page("blog", "Blog", intro, out)


def render_post(p, prev, nxt):
    LABEL[p["slug"]], PARENT[p["slug"]] = p["title"], "blog"
    blocks = [b for s in p["sections"] for b in normalize(s["blocks"], p["slug"])]
    body = prose(blocks, keep_levels=True)
    nav = []
    if prev:
        nav.append(f'<a class="post-nav__link" href="{href(prev["slug"])}" rel="prev"><span class="post-nav__dir">Previous</span>{esc(prev["title"])}</a>')
    if nxt:
        nav.append(f'<a class="post-nav__link post-nav__link--next" href="{href(nxt["slug"])}" rel="next"><span class="post-nav__dir">Next</span>{esc(nxt["title"])}</a>')
    out = page_head(p["slug"], accent(p["title"]), f'<time datetime="{p["date"]}">{fmt_date(p["date"])}</time>').replace(
        '<section class="page-head"', '<section class="page-head page-head--post"', 1)
    out += f'  <article class="band band--article" aria-labelledby="page-title">\n    <div class="wrap">\n      <div class="article prose">{body}</div>\n    </div>\n  </article>\n'
    if nav:
        out += f'  <nav class="band post-nav" aria-label="More posts">\n    <div class="wrap post-nav__grid">{"".join(nav)}</div>\n  </nav>\n'
    page(p["slug"], p["title"], p["excerpt"].replace(" [&hellip;]", "").replace(" […]", "")[:300], out)


# ------------------------------------------------------------------ run
def main():
    special = {"about", "products", "services", "solutions", "sectors", "case-studies", "contact-us", "blog"}
    done = 0
    render_about(); render_products(); render_services(); render_sectors(); render_cases_index(); render_contact()
    render_index("solutions", "Our <span class=\"accent\">solutions</span>", "Solutions")
    done += 7
    for slug in CHILDREN["sectors"]:
        render_sector(slug); done += 1
    for key, slug in CASES:
        render_case(key, slug); done += 1
    for slug in LABEL:
        if slug in special or PARENT.get(slug) in ("sectors", "case-studies"):
            continue
        generic(slug); done += 1
    posts = sorted((json.load(open(os.path.join(CONTENT, "posts", f), encoding="utf-8")) for f in os.listdir(os.path.join(CONTENT, "posts"))),
                   key=lambda p: (p["date"], p["slug"]), reverse=True)
    render_blog(posts)
    for i, p in enumerate(posts):
        render_post(p, posts[i + 1] if i + 1 < len(posts) else None, posts[i - 1] if i else None)
    print(f"{done + 1} pages and {len(posts)} posts written; {len(_images)} images in {IMG_DIR}/")
    for w in WARN:
        print("warning:", w)


if __name__ == "__main__":
    main()
