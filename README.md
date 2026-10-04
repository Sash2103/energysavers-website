# Energy Savers website

Proposed redesign of the energysavers.me homepage: a static site with no build step and no dependencies.
It is a private preview, so the page carries `noindex`. Don't publish it or point a domain at it until the owner approves.

## Preview

```sh
python3 -m http.server 8080      # then open http://localhost:8080
```

You can also open `index.html` directly from disk. Add `?motion=off` to the URL to see the reduced-motion version.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole homepage, including the product and case-study sheets and the inlined AHF drawing |
| `styles.css` | Design tokens, components, sections, motion |
| `script.js` | Menus, hero waveform, AHF exploded view, sheets, workplans, contact form |
| `assets/fonts/` | Archivo and Source Serif 4, trimmed (OFL licences alongside) |
| `assets/img/` | WebP images from energysavers.me, resized by `tools/fetch-assets.py` |
| `assets/svg/` | Logo (vector trace of the original) and favicon |
| `tools/` | Dev-only scripts, see below |
| `PROJECT_DESIGN.md` | Design brief: palette, type, components, motion rules |
| `NOTES.md` | What the owner must confirm, content changes, checks run, blacklist audit |

## Tools

```sh
python3 tools/fetch-assets.py   # re-download and re-encode images (needs Pillow)
node tools/draw-ahf.mjs         # regenerate the exploded AHF drawing inside index.html
node tools/contrast-check.mjs   # WCAG AA contrast audit of the palette
sh tools/build-fonts.sh         # rebuild the trimmed fonts (needs fonttools + brotli)
npx html-validate index.html    # HTML checks (config in .htmlvalidate.json)
```

## Secrets

None are used. The contact form opens the visitor's email app or WhatsApp with the message filled in; nothing is sent to a server.
