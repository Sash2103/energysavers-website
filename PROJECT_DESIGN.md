# PROJECT_DESIGN: Energy Savers

## 1. Product context
- **Product:** Energy Savers Technical Services LLC, an engineering contractor in Dubai and Riyadh.
  - Power quality: AHF, SVG, voltage optimisation, UPS, PQ analysers.
  - HVAC: heat pumps, adsorption chillers, air purification.
  - Automation/SCADA/BMS.
  - EV chargers.
- **Target users:** facility managers, electrical and MEP engineers, and procurement at hotels, hospitals, factories, ports, malls and cooling plants in the UAE and KSA.
- **Surface:** the marketing homepage. Inner pages follow on the same system.
- **Job to be done:** understand in seconds what the company fixes, see proof (figures, named projects), find the product, then call, WhatsApp, email or send an enquiry.
- **Success:** a credible first impression for technical buyers, proof within one scroll, and contact always within reach. Fast on mobile data.
- **Constraints:**
  - Static HTML/CSS/JS, no build step, no backend, no tracking.
  - Use the site's own words (typos fixed). Invent nothing.

## 2. Existing UI read
- **Strongest cue:** the logo, a 2×2 checker of blue #1474A3 and lime #B1D569 with a wide squarish wordmark. Also the company's own conventions: an amber → green workplan and distorted → pure sine images.
- **Removed:** eight unrelated section colours, a stock circuit video, a rotating headline, truncated text, a broken icon font and stock imagery.

## 3. Taste direction
- **Identity:** an engineering firm that measures, corrects and automates electrical and HVAC systems, with named UAE projects.
- **Direction: "engineering drawing set".** Documentation-grade and precise. Two colours from the logo (blue-ink and paper), with lime as the only accent, meaning "corrected / result / action".
- **Avoid:** a navy and neon cockpit, green-eco, and copying Atlas literally.
- **Distinctive:** a live harmonic waveform that becomes clean when the filter switches on; an exploded AHF line drawing; workplans drawn as single-line diagrams; square geometry taken from the logo.
- **Quiet:** body copy, lists and the footer.

## 4. References used, and how
| Reference | Taken | Kept out |
|---|---|---|
| Atlas | Technical line drawing on dark ground, content-dividing hairlines, square controls, step indicator | Pink, grid background, intro that blocks the page |
| Water bottle (Zajno) | A product that comes apart into labelled parts | — |
| Skincare (product page) | Product overview → product opens → variant chips | Prices, stars |
| TinyWins | Logo animation inside the nav while the page stays usable | Pill nav |
| Aristotle | Line work drawing itself on | — |
| Fixa | — (its cursive accent word is on the blacklist) | — |

## 5. Atmosphere
- **Thesis:** the site should feel like a well-made drawing set and test report.
- **First viewport:** "Power quality and energy efficiency solutions". One sentence on who it is for, the specialisms, "Request an audit" with phone and WhatsApp, and the waveform that demonstrates the product.

## 6. Colour roles
| Role | Value |
|---|---|
| Ink (dark surfaces, text on paper) | `#0C1B22` |
| Ink-2 (menus, form panel) | `#13262F` |
| Paper (light surfaces) | `#F2F0EA` |
| Paper-2 (product bench) | `#E7E4DA` |
| Lime (accent, results, CTA on ink, focus on ink) | `#B1D569` |
| Blue (links and markers on paper, focus on paper) | `#1474A3`; link text `#12689A` |
| Amber (status only: starting / out-of-limit values) | `#E2A33B` |
| Muted text | `#42525A` on paper, `#A9B6BC` on ink |

- No gradients, glows or blur.
- Lime is never used as text on paper.

## 7. Type
- **Archivo** (variable width + weight): headings at width 112–118%, weight 600, sentence case, left-aligned. Also nav, labels, buttons and tabular figures.
- **Source Serif 4** (optical size): paragraphs at 17–18px, 1.55 line height, max 62–68ch.
- **Accent word:** display headings end on one word set in Source Serif 4 italic (display optical size), at the same size as the sentence, e.g. "Let us make it *together*". The owner asked for this after seeing Fixa; it replaces the earlier "no italic accent words" rule. The "Carbon offset" label is the muted first line of that heading, not a separate small eyebrow.
- No mono, no all-caps eyebrows.

## 8. Components
- **Buttons:** one primary per view, square. Ink on lime on dark sections, paper on ink on light sections. The arrow nudges 3px on hover. Secondary actions are underlined text links.
- **Nav:** solid ink. Hides on scroll down and returns on scroll up. Products open a mega menu of four ruled columns. Mobile gets a full-screen menu.
- **Sheets:** native `<dialog>` panels from the right. Product sheets have variant chips. Case sheets clone the case article.
- **Workplan:** `<ol>` single-line diagram, horizontal on tablet and up, vertical on phones.
- **Lists:** small square markers, blue on paper and amber or lime on ink.
- **Icons:** inline SVG sprite only.

## 8b. Inner pages
- **Page head (paper):** breadcrumb, then a kicker line if the old page had one (for example "IEEE 519 · Harmonic Control…"). Then the title with its italic last word, the first paragraph, and the actions: "Contact us" plus any download. The page's first image goes on the right, or full width when it is a wide photo.
- **Bands:** one per old section. The title sits on the left (columns 1–5) and the text on the right (6–12). A modest image sits under the title, and big images, tiles and tables get the full width. Sections without a title are left-aligned prose.
- **Tiles:** a ruled grid for repeated items (products, features, applications). Linked tiles underline their title on hover. Benefit icons get a 4-column grid on ink when they are light.
- **Ink bands:** icon grids and graphics drawn for dark backgrounds. Everything else is on paper, with hairlines between bands.
- **Sector tabs:** Challenges / Root cause analysis / Solutions / Benefits. They are built by the script, so without it every phase shows in turn.
- **Group nav:** each page ends with the other pages of its group (paper-2 band), then the contact section.
- **Blog:** the list is grouped by year. A post is one centred 46rem column, with Previous/Next links.

## 9. Layout
- **Grid:** 12 columns, gutter `clamp(16px, 4vw, 56px)`, widths up to 1360px.
- **Rhythm:** sections alternate on purpose, ink and paper: hero, proof, AHF, heat pump, bench, offer, sectors, About, insights, contact.
- **Rules:** 1px hairlines divide content only. Headings change treatment between sections.
- **Breakpoints:** 640, 720, 960, 1000, 1100, 1180, 1360.

## 10. Motion
- **Purpose:** motion only explains a mechanism or confirms an action.
- **Waveform:** a Fourier sum with the 5th, 7th, 11th and 13th harmonics, which decay when the switch flips. There is a pause control, and it stops off-screen.
- **AHF and heat pump:** the same blueprint treatment: a scroll-linked explode on desktop with three steps (no scroll-jacking); the part for the current step fills lime. The heat pump section is mirrored (drawing on the left). On phones each plays once. With reduced motion they are shown static and exploded.
- **Workplans:** the lime "current" runs once, at a steady 4.5 s with a pulse at its tip, lighting each step as it arrives (the owner found the first 1.6 s version too fast to notice).
- **Logo:** the energize sequence runs once per session. The loader appears only on slow font loads.
- **Reduced motion:** honoured via `prefers-reduced-motion` and `?motion=off`.

## 11. Do / Don't
- **Do:**
  - Use the owner's own photos and words.
  - Flag unknowns as `TODO(owner)`.
  - Keep contact within one tap.
- **Don't:**
  - Add any item from the three blacklists.
  - Invent figures.
  - Hide content behind hover.

## 12. Implementation map
- **`index.html`:** all homepage sections, sheets and the inlined AHF and heat pump SVGs. Its header, contact and footer are shared by every page.
- **`<slug>/index.html`:** inner pages and posts, generated by `tools/build-pages.py` from `content/`.
- **`styles.css`:** tokens → components → sections → motion.
- **`script.js`:** behaviour.
- **`assets/`:** fonts, images and logo SVG.
- **`tools/`:** asset pipeline, the two drawing generators and the contrast check.

## 13. Evaluation
Contrast script, html-validate, Lighthouse (mobile and desktop), visual checks at 1440, 768, 390 and 360, interaction checks, and the blacklist audit in NOTES.md.
