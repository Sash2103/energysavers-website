#!/usr/bin/env python3
"""Save the inner pages and blog posts of energysavers.me as structured content for tools/build-pages.py.

Usage:  python3 tools/scrape-pages.py
Writes: content/pages/<slug>.json, content/posts/<slug>.json
Raw HTML is cached in tools/.cache/pages/ (git-ignored).

Each page keeps the old site's own sections, in order. A section holds blocks:
  {"t": "h2".."h6", "text"} · {"t": "p", "text"} · {"t": "ul", "items": [...]}
  {"t": "img", "src": "<uploads path>", "alt"} · {"t": "pdf", "href": "<uploads path>", "text"}
Blocks inside a link to another page of the site carry "href": "<slug>"; a card's trailing
"Read more" link becomes {"t": "link", "href": "<slug>"}. A bold lead-in is kept as "lead".
Wording is kept; only the obvious typos and third-person phrasing are fixed (see FIXES).
"""
import html, json, os, re, subprocess
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "tools", ".cache", "pages")
OUT = os.path.join(ROOT, "content")
SITE = "https://www.energysavers.me/"

PAGES = """about products power-quality ahf static-var-generator voltage-optimizers uninterrupted-power-supply
power-quality-mobile-anlayser pq-box-50 pq-box-150-the-mobile-power-quality-allrounder pq-box-200-the-mobile-tool-for-the-expert
pq-box-300-the-mobile-high-frequency-power-quality-tool hvac heat-pumps adsorption-chiller air-purifiers-smoke-filters
automation bms-servers-controllers sensors power-supply smart-meters ev-chargers 360480kw-distributed-charger
sec-200-240kw-integrated-charger sec-series sec-40-80kw-integrated-charger interstellar-ac-charger mira-ac-charger
ser-series ser-series-40kw-power-module solutions power-quality-audits power-quality-solutions hvac-optimization
automation-solutions indoor-air-quality-improvement smart-metering-lighting services energy-audit pq-audit-and-measurement
harmonic-studies harmonic-simulation-studies pq-equipment-rental sectors hospitality industrial-plants data-centres-telecom
commercial-facilities cooling-plants case-studies emicool-in-motor-city-dubai-2021 mina-asalam-jumeirah-group-dubai-2021
wild-wadi-jumeirah-group-dubai-2021 dubai-medical-university-hospital-dubai bid-factory-al-quoz-dubai-2021
dp-world-dubai-2021 burj-al-arab-jumeirah-group-dubai-2021 contact-us""".split()

# Typos and third person, fixed as agreed (wording otherwise unchanged)
FIXES = [
    (r"\bAnlayser\b", "Analyser"), (r"\bAnlayzer\b", "Analyzer"), (r"\bINSUSTRIAL\b", "Industrial"),
    (r"\bSevers\b", "Servers"), (r"\bCharing\b", "Charging"), (r"\bthses\b", "these"), (r"\bbenifit\b", "benefit"),
    (r"\bwhch\b", "which"), (r"\bCostumers\b", "Customers"), (r"\bENERY\b", "ENERGY"), (r"\bseachclick\b", ""),
    (r"\bThey provide\b", "We provide"), (r"\bThey specialize\b", "We specialize"), (r"\bTheir mission\b", "Our mission"),
    (r"\bThey strive\b", "We strive"), (r"\bThey have experience\b", "We have experience"),
    (r"\bWe are pioneer in\b", "We are pioneers in"), (r"more than 150\+ installations", "more than 150 installations"),
    (r"\bThey offer a wide range\b", "We offer a wide range"), (r"\bThey also provide energy audits\b", "We also provide energy audits"),
    (r"\bTheir solutions are tailored\b", "Our solutions are tailored"),
    (r"\bthey strive to ensure that their customers\b", "we strive to ensure that our customers"),
    (r"([a-z])\.([A-Z][a-z]+ )", r"\1. \2"),                       # "systems.It includes"
    (r"Power Factor Characters", "Power Factor Correctors"), (r"PQ ?[-–] ?Box", "PQ-Box"), (r"\bIn to\b", "Into"), (r"\bin to existing\b", "into existing"),
    # template placeholders left inside the old pages' text
    (r"\s*\b(Sample Description|Sample Title|Content missing)\b", ""),
    # punctuation only: the old sentence ran its phrases together
    (r"Technology upgradation The core pursuit is Strong energy Accurate control Stable system SVG works",
     "Technology upgradation, the core pursuit is strong energy, accurate control, stable system. SVG works"),
    (r"[ \t]+([,.;:])", r"\1"), (r"[ \t]{2,}", " "), (r" *\n *", "\n"), (r"\n{2,}", "\n"),
    # two download labels were cut short on the old site
    (r"Charger Bro\.\.\.$", "Charger Brochure"), (r"(DC Charger Series)\.\.\.$", r"\1"),
]
SKIP_TEXT = re.compile(r"^(read more|download|contact us|learn more|view more|know more|x|×)$", re.I)


def fix(text):
    t = html.unescape(text).replace("\u00a0", " ").strip()
    for a, b in FIXES:
        t = re.sub(a, b, t)
    return t.strip()


def uploads(url):
    if not url:
        return None
    m = re.search(r"/wp-content/uploads/(.+?)(?:\?.*)?$", url)
    return m.group(1) if m else None


def page_slug(url):
    """'https://www.energysavers.me/heat-pumps/' -> 'heat-pumps' (None for anything else)."""
    m = re.match(r"^https?://(?:www\.)?energysavers\.me/([a-z0-9-]+)/?(?:[?#].*)?$", url or "")
    return m.group(1) if m and m.group(1) not in ("wp-content", "wp-json") else None


class _Closed(list):
    """A finished lead-in: flush() reads it, handle_data() no longer appends to it."""


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.sections = []
        self.cur = None
        self.buf = None          # text being collected for a block
        self.kind = None
        self.list = None
        self.skip = 0            # inside script/style/svg/form
        self.links = []          # open <a> elements: [slug or None, pdf block or None, text parts]
        self.href = None         # page link for the block being collected
        self.closed_pdf_labels = []
        self.lead = None         # text of a <strong> that opens the block
        self.stop = False

    def section(self, ident=""):
        self.flush()
        self.cur = {"id": ident, "blocks": []}
        self.sections.append(self.cur)

    def linked(self):
        """The page a new block links to, if it starts inside a link."""
        for slug, _, _, _ in reversed(self.links):
            if slug:
                return slug
        return None

    def start(self, kind):
        self.flush()
        self.kind = kind
        self.buf = []
        self.href = self.linked()
        self.lead = None

    def flush(self):
        if self.buf is not None and self.kind:
            text = fix(" ".join(self.buf))
            # a link's own label ("Interstellar AC Charger Brochure") lives on its pdf block
            pdf_labels = [b.get("text") for _, b, _, _ in self.links if b] + self.closed_pdf_labels
            if text and not SKIP_TEXT.match(text) and text not in pdf_labels:
                lead = fix(" ".join(self.lead)) if isinstance(self.lead, _Closed) else None
                lead = lead.rstrip(":") if lead and text.startswith(lead) and lead != text else None
                if self.kind == "li":
                    if self.list is not None:
                        item = {"text": text}
                        if self.href:
                            item["href"] = self.href
                        if lead:
                            item["lead"] = lead
                        self.list.append(item if len(item) > 1 else text)
                elif self.kind == "h1" and not self.title:
                    self.title = text
                else:
                    if self.cur is None:
                        self.section()
                    block = {"t": self.kind, "text": text}
                    if self.href:
                        block["href"] = self.href
                    if lead and self.kind == "p":
                        block["lead"] = lead
                    self.cur["blocks"].append(block)
        self.buf = None
        self.lead = None
        self.kind = None
        self.href = None
        self.closed_pdf_labels = []

    def handle_starttag(self, tag, attrs):
        if self.stop:
            return
        a = dict(attrs)
        if a.get("id") == "contact-us" or tag == "footer":
            self.flush(); self.stop = True; return
        if tag in ("script", "style", "svg", "noscript", "form", "select", "button"):
            self.skip += 1; return
        if self.skip:
            return
        if tag == "section":
            self.section(a.get("id", ""))
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6", "p", "li"):
            self.start(tag)
        elif tag in ("ul", "ol"):
            self.flush()
            if self.cur is None:
                self.section()
            self.list = []
            self.cur["blocks"].append({"t": "ul", "items": self.list})
        elif tag == "br" and self.buf is not None:
            self.buf.append("\n")             # kept as a line break; headings turn it into a space
        elif tag == "img":
            src = uploads(a.get("data-src") or a.get("src"))
            if src:
                if self.cur is None:
                    self.section()
                block = {"t": "img", "src": src, "alt": fix(a.get("alt") or "")}
                if self.linked():
                    block["href"] = self.linked()
                self.cur["blocks"].append(block)
        elif tag == "a":
            href = a.get("href") or ""
            pdf = None
            if href.lower().endswith(".pdf") and uploads(href):
                if self.cur is None:
                    self.section()
                pdf = {"t": "pdf", "href": uploads(href)}
                self.cur["blocks"].append(pdf)
            slug = page_slug(href)
            self.links.append([slug, pdf, [], self.buf is None])
            if slug and self.buf is not None and not self.href:
                self.href = slug          # <h3><a href="…">Title</a></h3>
        elif tag in ("strong", "b") and self.buf is not None and not "".join(self.buf).strip() and self.lead is None:
            self.lead = []

    def handle_endtag(self, tag):
        if self.stop:
            return
        if tag in ("script", "style", "svg", "noscript", "form", "select", "button"):
            self.skip = max(0, self.skip - 1); return
        if self.skip:
            return
        if tag in ("strong", "b") and isinstance(self.lead, list):
            self.lead = tuple(self.lead)          # closed: no more text goes into the lead
            self.lead = list(self.lead) if self.lead else None
            if self.lead is not None:
                self.lead = _Closed(self.lead)
            return
        if tag == "a" and self.links:
            slug, pdf, parts, loose = self.links.pop()
            label = fix(" ".join(parts))
            if slug and loose and pdf is None and (not label or SKIP_TEXT.match(label) or label.lower() in ("view more", "read more")):
                if self.cur is None:
                    self.section()
                self.cur["blocks"].append({"t": "link", "href": slug})   # a card's "Read more"
                return
            if pdf is not None:
                if label and not re.match(r"^(download|download data ?sheet|datasheet|view more)$", label, re.I):
                    pdf["text"] = label
                    self.closed_pdf_labels.append(label)
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6", "p", "li") and self.kind == tag:
            self.flush()
        elif tag in ("ul", "ol"):
            self.flush()
            self.list = None
        elif tag in ("div", "section") and self.kind in ("p",) and self.buf:
            self.flush()

    def handle_data(self, data):
        if self.stop or self.skip:
            return
        data = re.sub(r"\s+", " ", data)        # as a browser does; only <br> makes a line break
        for link in self.links:
            link[2].append(data)
        if type(self.lead) is list:
            self.lead.append(data)
        if self.buf is not None:
            self.buf.append(data)
        elif data.strip() and self.cur is not None and not SKIP_TEXT.match(data.strip()):
            # loose text inside a div (no <p>): keep it as a paragraph
            self.start("p"); self.buf = [data]


def fetch(slug):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, slug + ".html")
    if not os.path.exists(path):
        r = subprocess.run(["curl", "-sfL", "-A", "Mozilla/5.0", "-o", path, SITE + slug + "/"])
        if r.returncode:
            raise SystemExit("download failed: " + slug)
    return open(path, encoding="utf-8", errors="replace").read()


def clean(sections):
    out, seen = [], set()
    for s in sections:
        blocks = []
        for b in s["blocks"]:
            if b["t"] == "ul":
                b["items"] = [i for i in b["items"] if i and not SKIP_TEXT.match(i if isinstance(i, str) else i["text"])]
                if not b["items"]:
                    continue
            key = json.dumps(b, sort_keys=True)
            if b["t"] in ("p", "ul") and key in seen:
                continue                     # the old pages repeat whole paragraphs
            seen.add(key)
            blocks.append(b)
        if blocks:
            out.append({"id": s["id"], "blocks": blocks})
    return out


def page(slug):
    raw = fetch(slug)
    start = raw.find("</header>")
    p = Extract()
    p.feed(raw[start:] if start > 0 else raw)
    p.flush()
    m = re.search(r'<meta name="description" content="([^"]*)"', raw)
    return {"slug": slug, "title": p.title, "description": fix(m.group(1)) if m else "", "sections": clean(p.sections)}


def posts():
    src = os.path.join(CACHE, "posts.json")
    if not os.path.exists(src):
        r = subprocess.run(["curl", "-sfL", "-A", "Mozilla/5.0", "-o", src, SITE + "wp-json/wp/v2/posts?per_page=100&_embed=1"])
        if r.returncode:
            raise SystemExit("download failed: posts")
    out = []
    for item in json.load(open(src, encoding="utf-8")):
        p = Extract()
        p.section("article")
        p.feed(item["content"]["rendered"])
        p.flush()
        media = (item.get("_embedded") or {}).get("wp:featuredmedia") or [{}]
        out.append({
            "slug": item["slug"], "title": fix(re.sub(r"<[^>]+>", "", item["title"]["rendered"])),
            "date": item["date"][:10], "excerpt": fix(re.sub(r"<[^>]+>", " ", item["excerpt"]["rendered"])),
            "image": uploads(media[0].get("source_url")), "sections": clean(p.sections),
        })
    return out


def main():
    os.makedirs(os.path.join(OUT, "pages"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "posts"), exist_ok=True)
    for slug in PAGES:
        data = page(slug)
        json.dump(data, open(os.path.join(OUT, "pages", slug + ".json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        print(f"{slug:58s} {len(data['sections'])} sections")
    ps = posts()
    for p in ps:
        json.dump(p, open(os.path.join(OUT, "posts", p["slug"] + ".json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(f"{len(ps)} posts")


if __name__ == "__main__":
    main()
