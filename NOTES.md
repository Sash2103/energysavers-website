# Energy Savers redesign: notes

Private preview of a proposed homepage for energysavers.me. It is not published anywhere, and the page carries `noindex`.

## What the owner needs to confirm

Each item is also marked `TODO(owner)` in `index.html`.

1. **Accumulated figures.** 331 GWh, 64,236 t CO2, AED 67,040,000 (the old site's counters), and whether the "+" belongs on them.
   - 64,236 t ÷ 331 GWh ≈ 0.19 t CO2 per MWh. That is about half the usual UAE grid emission factor, so one of the two figures may be off.
2. **Workplan figures.** These were read off the old case-study diagrams.
   - Were they achieved or projected? Emicool's diagram is titled "Recommended improvement workplan".
3. **Missing THD and savings figures.** Dubai Medical University Hospital, BID Factory and DP World show "Xx THD" and "% Savings" on the old site. The new page shows these as dashed "to be confirmed" placeholders.
   - The old site also reused BID Factory's diagram for DP World.
4. **Installation count.** "150+ installations" (hero, About) versus "Hundreds of PQ installations in the region" (key highlights). Which is right?
5. **PQ Equipment Rental text.** The old text described renting backhoes, forklifts and excavators. As approved, it now uses their own PQ analyser wording. The owner may want rental-specific wording.
6. **Client names.** These were read from logo files: "EKC" (gas cylinder logo) and "Dubai Airports (DXB)" (the file was named `db`).
7. **Sector mapping.** Case studies are linked under sectors as follows:
   - Hospitality: Burj Al Arab, Wild Wadi, Mina A'Salam
   - Industrial: BID Factory, DP World
   - Cooling: Emicool

   Dubai Medical University Hospital isn't mapped to a sector.
8. **OSKAR.** The old page says OSKAR was "developed by Schneider Electric" and expands it as "Operational Systematic K-band Analogue Reduction". OSKAR looks like an A. Eberle product (A. Eberle is on the supplier list), so that sentence was left out of the product sheet.
9. **Photo rights.** Some photos look like stock images: the sector photos and the Burj Al Arab / Wild Wadi aerials. Check that the licences cover the new site.
10. **Contact details.** Which phone is primary (+971 4 568 6557 is used in the header), the WhatsApp number (+971 52 536 0124), and whether there are social accounts besides LinkedIn.
11. **Claims to confirm.** "Funding assistance" and "energy model development" were in the old hero; they were dropped from About for length. "First Solar Thermal Chiller installation in the UAE" is shown, and "ROI less than 12 months in most cases" appears on the heat pump sheet.

## Placeholders visible on the page

- Dubai Medical, BID Factory and DP World workplans show dashed chips: "THD to be confirmed" and "THD and savings to be confirmed".

There is no other placeholder text, lorem ipsum or invented figure.

## Content changes

**Approved removals**
- The About page's AI double-exposure image, replaced with their own photo of an analyser connected inside a panel.
- The moss-heart "carbon offset" photo.
- The blog stock thumbnails.
- "Get notified through your emails."
- "Powered by aatma".

**Replaced (approved)**
- The PQ Equipment Rental blurb (see item 5 above).

**About, trimmed (requested: sleek, only what's required)**
- The two factual sentences, the certificates, four specific highlights, and suppliers and clients as name lists.
- Dropped as filler: "full-service … consulting firm / funding assistance / sustainability planning", the mission paragraph, "provider of innovative … solutions", "Team of highly qualified…" and "Introduction of new technology…".

**Kept as asked**
- Both services groups. "Energy efficient building solutions" and "Our services" sit side by side under their own headings.
- "100% Happy Customers · Experienced Team".
- The floating phone and WhatsApp buttons, restyled.
- "Wait for our latest news …". This is an optional cut; it stays unless the owner says otherwise.

**Typos and grammar fixed**
- "Costumers" → Customers; "All Right Reserved" → All rights reserved
- "We are pioneer … more than 150+" → "We are pioneers … more than 150"
- "They provide …" → first person
- "leadings" → leading
- "Power Factor Characters (SVG)" → correctors
- "observation (Solar Thermal Chillers)" → adsorption
- "Anlayser" → Analyser; "Severs" → Servers

**Fixed on the old site's chrome**
- Phone links now use `tel:` instead of `callto:`.
- The footer's Facebook icon pointed to LinkedIn. It is now a LinkedIn link.

**Selection rather than rewriting**
- Product sheets and sector panels use excerpts of the old pages' own sentences. The hero H1 is the old page title, minus "BEST" and the capitals.

**New words (UI only)**
- Buttons and controls: "Request an audit", "Active Harmonic Filter: Off/On", "Pause animation", Call, WhatsApp, Menu, Close, "Send by email", "Send on WhatsApp".
- The form's "Interested in" options.
- Diagram labels: "Load current", "Clean sine", "Harmonic order".
- "Map" links, alt text, and "Starting point / Result" text for screen readers.

## Problems found on the old site (worth fixing whatever happens)

- **Adsorption chiller page.**
  - The "Advanced Cooling Solutions" paragraph describes an unrelated company.
  - Template placeholders were left in: "Sample Title", "Sample Description", "Content missing" (also on the Mira charger page).
- **HVAC page.** It talks about "homes" and "financing options" in third person; this may not reflect the business.
- **Wrong alt text.**
  - The Dubai Energy Auditors accreditation certificate is labelled a "DESC" certificate.
  - The Helmholz logo is labelled "ifm Efector".
  - The hospitality photo is labelled "Energy Efficiency in Hospitals".
- **Page weight.** The homepage loads an 8.7 MB stock video (`electric-circuit-KUSQX641.mp4`) and a 1.6 MB AI image. This is the main reason it is slow.

## What could not be verified

- **Inspiration videos.** The Dribbble and Atlas videos would not stream in the automation browser. The design worked from their still frames, the live Atlas, Fixa and TinyWins pages, and the screenshots supplied.
- **The paste.** The "brief understanding of the website" text arrived as a placeholder, so the content came from the live site instead.
- **The figures above.** Image licensing and the facts in claims 1–11 come from the old site and are unverified.
- **Testing limits.**
  - Real phones were not tested. Phone widths were checked in 390 px and 360 px frames.
  - In the automation browser the tab is hidden, so animations only advance about once per second. The waveform, exploded view and workplans were checked by state, not watched at full frame rate.

## Checks run

- `node tools/contrast-check.mjs`: all 32 colour pairs meet WCAG 2.2 AA.
- `npx html-validate index.html`: clean. Only the uppercase-DOCTYPE style rule is switched off.
- Lighthouse, mobile and desktop: see the results in the hand-off message.
- Manual checks:
  - phone, tablet and desktop layouts
  - product sheet: open, switch variants, "Contact us" pre-fill
  - case sheet
  - certificate viewer
  - mega menu (click and Esc)
  - form validation and the WhatsApp link (nothing was sent)

## Blacklist audit (from `~/energy savers/Claude outputs/`)

Pass means the site does not do it.

- **Colour.** Pass on all items.
  - No gradients, glow, mesh, glass, neon or eco teal, and no indigo.
  - Two colours from the logo do the work.
  - No grey-on-white body text: the lowest body contrast is 7.1:1.
  - No dot or line grid backgrounds. Rules divide content only.
- **Type.** Pass.
  - Archivo + Source Serif 4, neither on the font list.
  - No eyebrows above every heading, no gradient text, no italic-serif accent word.
  - Headlines are left-aligned with normal tracking.
- **Layout.** Pass.
  - No three identical cards, bento, zigzag, stats bar under the hero, logo wall or marquee, testimonials, pricing, FAQ or "how it works".
  - The nav is not blurred or a pill. There is no CTA banner, and widths vary by section.
- **Copy.** Pass. No buzzwords and no "Learn more". One primary button per view. Figures are the owner's (flagged).
- **Components.** Pass.
  - Square corners, no hover lifts or glows, no rounded icon boxes, no fake browser frames.
  - No chat pop-up, cookie banner, modal on load, back-to-top or progress bar.
- **Imagery.** Pass. Real project and field photos, no stock handshakes, holograms or 3D shapes. Sector photos are kept as approved.
- **Motion.** Pass.
  - No scroll-reveal, counters, parallax, typewriter, rotating words, cursor effects or background video.
  - The logo animation never delays content: the loader only appears if the fonts aren't ready after 400 ms, capped at 3 s.
- **Judgement calls.**
  - The hero is dark with an animated diagram, not a video. It demonstrates the company's product.
  - The AHF section uses sticky scrolling, but scrolling stays native (no scroll-jacking).

## Teardown "before you call it done"

- **Icons.** None depend on a font; all are inline SVG.
- **Contact.** The phone, WhatsApp, email and form are reachable above the fold (header and hero) and again at the bottom.
- **Text.** No truncated text: every "…" from the old site is gone.
- **Duplicates.** The duplicate "Our Services" heading is resolved by keeping each group under its own original heading.
- **Figures.** Formatted with separators. Case studies come straight after the figures.

## Rebuilding assets

| Command | Does |
|---|---|
| `python3 tools/fetch-assets.py` | Re-downloads and re-encodes the images listed in its manifest |
| `node tools/draw-ahf.mjs` | Regenerates the exploded drawing and re-inlines it into `index.html` |
| `node tools/contrast-check.mjs` | Contrast audit |
