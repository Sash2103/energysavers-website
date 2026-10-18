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
  - Static site: Next.js static export (plain HTML/CSS/JS in `out/`), no backend, no tracking.
  - Use the site's own words (typos fixed). Invent nothing.

## 2. Existing UI read
- **Strongest cue:** the logo, a 2×2 checker of blue #1474A3 and lime #B1D569 with a wide squarish wordmark. Also the company's own conventions: an amber → green workplan and distorted → pure sine images.
- **Removed:** eight unrelated section colours, a stock circuit video, a rotating headline, truncated text, a broken icon font and stock imagery.

## 3. Taste direction
- **Identity:** an engineering firm that measures, corrects and automates electrical and HVAC systems, with named UAE projects.
- **Direction: "engineering drawing set".** Documentation-grade and precise. Two colours from the logo (blue-ink and paper), with lime as the only accent, meaning "corrected / result / action".
- **Avoid:** a navy and neon cockpit, green-eco, and copying Atlas literally.
- **Distinctive:** a blurred film of a plant-room crew behind the hero, graded into the site's ink; an exploded AHF line drawing; workplans drawn as single-line diagrams; square geometry taken from the logo (the About caret, the sectors' title block).
- **Quiet:** body copy, lists and the footer.

## 4. References used, and how
| Reference | Taken | Kept out |
|---|---|---|
| Atlas | Technical line drawing on dark ground, content-dividing hairlines, square controls, step indicator | Pink, grid background, intro that blocks the page |
| Water bottle (Zajno) | A product that comes apart into labelled parts | — |
| Skincare (product page) | Product overview → product opens → variant chips | Prices, stars |
| TinyWins | Logo animation inside the nav while the page stays usable | Pill nav |
| Aristotle | Line work drawing itself on | — |
| Fixa | One serif-italic word, in the hero only, with the sans at regular weight so both read the same darkness | Italic on every heading |

## 5. Atmosphere
- **Thesis:** the site should feel like a well-made drawing set and test report.
- **First viewport:** "Power quality and energy efficiency solutions". One sentence on who it is for, the specialisms, "Request an audit" with phone and WhatsApp, the facts, all over a blurred film of a crew at work in a plant room (the owner asked for the film in place of the waveform).

## 6. Colour roles
The whole site is on ink, in the hero's scheme (seventh round: the owner found the paper pages too bright).

| Role | Value |
|---|---|
| Ink (page) | `#0C1B22` |
| Ink-2 (raised: cards, bench, contact, sheets, menus) | `#13262F` |
| Paper (text) | `#F2F0EA` |
| Soft (longer text, ledes) | `#D3DBDE` |
| Muted (labels, dates) | `#A9B6BC` |
| Lime (accent, links, results, CTA, focus) | `#B1D569` |
| Plate (light ground under product shots and drawings made on white; no text) | `#E4E1D8` |
| Amber (status only: starting / out-of-limit values) | `#E2A33B` |

- No gradients, glows or blur, except the films (owner's request): they are blurred when they are made, and their ink scrims are darkest behind the text. Over the films and head photos, the dimmest text (soft) keeps at least 5.6:1, measured frame by frame.
- Paper and blue only appear on plates, and plates carry no text.

## 7. Type
- **Archivo** (variable width + weight): headings at width 112–118%, weight 600, sentence case, left-aligned. Also nav, labels, buttons and tabular figures.
- **Source Serif 4** (optical size): paragraphs at 17–18px, 1.55 line height, max 62–68ch.
- **Accent word: once, in the homepage hero only** ("Power quality and energy efficiency *solutions*"). It is set in Source Serif 4 italic (display optical size) at the same size as the sentence. As on Fixa, the hero's sans is Archivo at regular weight (450) and normal width (100%), tracked −0.022em, so the sans and the italic look equally heavy. Every other heading is plain Archivo. The owner asked for the italic after seeing Fixa, then found it overdone when it ended every heading.
- The "Carbon offset" label is the muted first line of its heading, not a separate small eyebrow.
- No mono, no all-caps eyebrows.
- Lists that read as data (sector challenges, Key highlights, client names) are set in Archivo; the serif is for paragraphs.

## 8. Components
- **Buttons:** one primary per view, square, ink on lime. The arrow nudges 3px on hover. Secondary actions are underlined text links.
- **Nav:** solid ink. Hides on scroll down and returns on scroll up. Products open a mega menu of four ruled columns. Mobile gets a full-screen menu.
- **Sheets:** native `<dialog>` panels from the right. Product sheets have variant chips. Case sheets clone the case article.
- **Workplan:** `<ol>` single-line diagram, horizontal on tablet and up, vertical on phones.
- **Lists:** small lime square markers. Sector challenges are ruled rows with no markers, and a sector's result sits behind a 2px lime rule (the owner found the amber markers and serif lists generic).
- **Plates:** product shots and drawings made on white stand on a light plate, never larger than their file; wide diagrams are capped at 1040px. Photos and the old site's graphics drawn for dark grounds have no plate.
- **Key highlights:** straight after the hero. Four tiles in large Archivo: three with their own site photos, and the brands they represent named in an ink panel.
- **About (homepage):** "About us" and "Our certifications" are labels on one ruled header row. The statement, at display size, sits beside the two certificates (7:5, then 8:4 from 1360px), and the clients run below as one block of names with light slashes between them. There is no lone heading column: the owner found the empty space under it ugly.
- **Sector panel (desktop):** the photo fills the right side of the screen at full height, flush with the edge, and changes with the sector in the middle of the screen. A drawing-style title block in its corner names the sector (01 / 05, name, five squares).
- **Icons:** inline SVG sprite only.

## 8b. Inner pages
- **Page head:** like the hero. Over the film of its product line or section (sector pages and About: their own photo), darkest behind the text and fading into the page: breadcrumb, a kicker line if the old page had one (for example "IEEE 519 · Harmonic Control…"), the title, a short summary, the key points (product pages) and the actions ("Contact us" plus any download). The page's picture sits on the right, on a plate sized to it when it was made on white; a wide photo is cut to 4:3 around the product.
- **Summary, key points, fold:** the summary is the first one or two sentences of the page's first paragraph; the key points are 3–4 phrases picked word for word from the page (`data/summaries.js`, checked at build time). The whole original text waits in the closed "Full description" fold under the head. A page whose text is all it has shows it in two columns instead.
- **Bands:** one per old section, shaped by what they hold so no column is left empty: title left and short text right (with a modest picture under the title); title above long text in two columns; a short untitled paragraph set large. Cards, big pictures and tables take the full width. A section that is only a heading becomes the label of the next one.
- **Cards:** repeated items (products, features, benefits) are ink-2 cards. Pictures in a row share one shape (4:3, 16:9 for wide photos), on plates or cover-cropped; rows fill evenly (6 → 3 + 3). With pictures on only some cards, the pictures go to the foot and the titles line up. Long card text shows its opening, the rest behind "Read more". Icon grids stand on an ink-2 band.
- **Sector tabs:** Challenges / Root cause analysis / Solutions / Benefits. Each topic is a ruled row, its name beside its points in two columns. Built by the script; without it every phase shows in turn.
- **Group nav:** each page ends with the other pages of its group as square chips under a ruled label (the current one in lime), then the contact section (ink-2).
- **Blog:** each year above its posts, which run in two columns. A post is one centred 46rem column, with Previous/Next links.

## 9. Layout
- **Grid:** 12 columns, gutter `clamp(16px, 4vw, 56px)`, widths up to 1360px.
- **Rhythm:** all ink; raised ink-2 bands (the product bench, icon grids, the contact section) and hairlines change the pace: hero, key highlights and proof, AHF, heat pump, bench, offer, sectors, About, insights, contact.
- **Rules:** 1px hairlines divide content only. Headings change treatment between sections.
- **Breakpoints:** 640, 720, 960, 1000, 1100, 1180, 1360.

## 10. Motion
- **Purpose:** motion only explains a mechanism or confirms an action.
- **Hero film:** a 15 s loop, blurred and graded when it is made (`tools/build-hero-video.sh`), 173 KB in AV1. It plays only while the hero is on screen, has a pause button, and never loads with reduced motion, Save-Data or 2G; the still frame stays instead. (It replaced the harmonic waveform, which the owner found added nothing.)
- **Page-head films:** one per product line and section (`tools/build-head-films.sh`), made like the hero film, 66–216 KB in AV1. Still shots crossfade end into start; moving shots play forward then back, so no loop jumps. Same rules as the hero: on screen only, pause button, never with reduced motion, Save-Data or 2G (`components/behaviour/FilmPlayer.jsx`, shared with the hero).
- **AHF and heat pump:** the same blueprint treatment: a scroll-linked explode on desktop with three steps (no scroll-jacking); the part for the current step fills lime. The heat pump section is mirrored (drawing on the left). On phones each plays once. With reduced motion they are shown static and exploded.
- **Workplans:** the lime "current" runs once, at a steady 3 s with a pulse at its tip, lighting each step as it arrives (the owner found 1.6 s too fast to notice, then 4.5 s a little slow).
- **About statement:** typed out once when it scrolls into view, about 5 s, behind a lime square caret that blinks twice and goes. The whole sentence is in the page, and shows at once with reduced motion. The only typed text on the site.
- **Sector panel:** the photos crossfade (0.6 s) as the sector in the middle of the screen changes.
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
- **`app/page.jsx` + `components/home/`:** all homepage sections and sheets; the AHF and heat pump SVGs are `components/drawings/`. The header, contact and footer (`components/site/`) are shared by every page.
- **`app/[slug]/page.jsx` + `lib/pages.jsx`:** inner pages and posts, built from `content/` at build time; their parts (page head, fold, bands, cards) are `components/inner/parts.jsx`, and the product summaries and key points `data/summaries.js`.
- **`app/globals.css`:** tokens → components → sections → motion.
- **`components/behaviour/`:** behaviour, one small client component per job.
- **`public/assets/`:** fonts, images (WebP, with AVIF copies), the hero and page-head films (`video/`) and logo SVG. `lib/pic.jsx` offers the AVIF copies wherever they exist.
- **`tools/`:** asset pipeline (images, AVIF copies, hero film, page-head films), the two drawing generators and the contrast check.

## 13. Evaluation
Contrast script, html-validate, Lighthouse (mobile and desktop), visual checks at 1440, 768, 390 and 360, interaction checks, and the blacklist audit in NOTES.md.
