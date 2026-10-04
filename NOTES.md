# Energy Savers redesign: notes

Private preview of a proposed redesign of energysavers.me: the homepage, every inner page and the blog. It is not published anywhere, and every page carries `noindex`.

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
9. **Photo rights.** Some photos look like stock images: the other sector photos, the Dubai Medical and BID Factory photos, and the Siemens WinCC photo from their blog. Check that the licences cover the new site.
   - The old site only had 360–650 px copies of several photos, which looked blurry on the new layout. These are now sharper photos of the same places. The free Pexels ones are under the Pexels licence, which allows commercial use without credit:
     - Hospitality sector: Burj Al Arab at night, by Abbas Mohammed (pexels.com/photo/3680902)
     - Mina A'Salam: the hotel on the Madinat Jumeirah waterway, by Magda Ehlers (pexels.com/photo/35171522)
     - Wild Wadi: the park with the Burj Al Arab behind, by Mauricio Krupka Buendia (pexels.com/photo/36168069)
     - About: Business Bay at dusk, by Leon Macapagal (pexels.com/photo/13398520)
   - These two Pexels photos only illustrate the client's site, so their alt text doesn't name the client:
     - Emicool: a chilled-water plant room, by Manouar (pexels.com/photo/17232659)
     - DP World: a container terminal at night, by Oleksiy Yeshtokyn (pexels.com/photo/39621561)
   - Burj Al Arab case: the 2000 px photo from their own media library (`51664-burj-al-arab-hotel-min.jpg`).
   - Dubai Medical and BID Factory still use the old 450 px photos; they only appear in the case sheet. Better originals are needed.
10. **Contact details.** Which phone is primary (+971 4 568 6557 is used in the header), the WhatsApp number (+971 52 536 0124), and whether there are social accounts besides LinkedIn.
11. **Claims to confirm.** "Funding assistance" and "energy model development" were in the old hero; they were dropped from About for length. "First Solar Thermal Chiller installation in the UAE" is shown, and "ROI less than 12 months in most cases" appears on the heat pump sheet.

## Second round (owner feedback)

- **Headings:** display headings now end on one word in Source Serif 4 italic, at the same size as the sentence ("Let us make it *together*"), as on Fixa. "Carbon offset" is the muted first line of that heading instead of a smaller label.
- **Workplans:** the current runs at a steady 4.5 s with a lime pulse at its tip, and each step lights when the current reaches it.
- **Photos:** sharper case-study, hospitality and About photos (see item 9). Sector photos now have 2000 px versions for the tall frame. Solutions photos are shown at sizes their originals can fill.
- **About photo:** Business Bay at dusk replaces the analyser-in-panel photo, which now illustrates Energy Audit under Solutions.
- **Solutions and Services:** the four solutions are photo tiles that link to their pages. The five services are a rail of cards (swipe on phones; arrows, drag and keyboard on desktop) with their field photo, report excerpt or kit photo.
- **Heat pump blueprint:** a second exploded line drawing, in the same style as the AHF, for the Heat Pumps System. Its three callouts use their own text: two of the heat pump advantages and the Mina A'Salam solution sentence. It is generated by `tools/draw-heat-pump.mjs`.
- **Tried and reverted:** a three.js 3D product stage for the four product lines. The owner found it low quality and laggy, so it was removed completely. The AHF blueprint and the product bench are back exactly as before.
- **Not done (needs permission):** AI upscaling of their own low-resolution field photos. Running the upscaler (Real-ESRGAN) was blocked by the safety check, so it wasn't used.

## Third round: the rest of the site

**What exists now**
- All 58 inner pages of the old site, at the same addresses, so existing links and search results keep working:
  - About and Contact
  - Products, the four product lines and 24 product pages (including the PQ-Box and SER module pages)
  - Solutions (6), Services (5), Sectors (5) and Case studies (7), each with its list page
- The blog: a list page and all 58 posts, also at their old addresses.
- The pages are generated by `tools/build-pages.py` from the old site's text (`content/`, saved by `tools/scrape-pages.py`). The header, contact section and footer come from the homepage.
- Layout: the homepage's system throughout. There is a light page head with breadcrumb, the title with its italic last word, and the first paragraph. Each old section becomes a band, with its title on the left and its text on the right. Repeated items become ruled tiles, benefit icons sit on ink, and every page ends with the other pages of its group and the contact form.
- Sector pages show Challenges, Root cause analysis, Solutions and Benefits as tabs. Without the script they all show, one after another.
- Case-study pages reuse the homepage's case write-ups and animated workplans.

**Homepage changes that come with it**
- The menus and footer now link to the pages instead of scrolling the homepage. The Products menu links to each product and line page.
- The product bench and the blueprint sections still open the quick-view sheet. Each product's name in the sheet now links to its full page.
- "Our latest news" and the Blog link now open the posts on this site.

**Content decisions (please confirm)**
- **Blog images.** Posts are shown without their stock featured images, following the approved removal of the blog stock thumbnails. The posts have no other images.
- **About page.** It follows the homepage trims you approved. It keeps the facts, the seven service areas, the certification paragraph, the sustainability paragraph, the highlights, the certificates and the supplier and client names. The filler paragraphs listed under "About, trimmed" are left out, and the logos are shown as names.
- **OSKAR** (Voltage Optimization page). The sentence crediting Schneider Electric is left out, as in the homepage sheet (item 8).
- **PQ Equipment Rental.** The backhoe and forklift text is replaced with their PQ analyser wording, as approved for the homepage (item 5).
- **Adsorption chiller.** The "Advanced Cooling Solutions" paragraph, which describes another company, is still shown. It is marked `TODO(owner)` in the page.
- **Template leftovers removed:** "Sample Title", "Sample Description", "Description" and "Content missing" (adsorption chiller, Mira charger), plus the app-store badge text on the Mira page, which has no badges to go with it.
- **Fixed on the old pages:**
  - The SER 20kW Power Module card linked to the SEC Series page.
  - Two download labels were cut short ("…Charger Bro...", "…DC Charger Series...").
  - "Bms"/"hvac" in headings now read BMS/HVAC.
  - Headings typed in capitals are shown in sentence case.
  - The HVAC page's "They offer… Their solutions…" is now first person.
  - The SVG page's run-on sentence has punctuation.
  - A missing space after a full stop is fixed.
- **Tabs and duplicates.** Tab labels that the old pages repeated above their panels are merged. Each phone-only copy of an image is used as the phone version of the same image.
- **Downloads.** The PDF brochures and data sheets still link to the old site (`energysavers.me/wp-content/uploads/…`). Copy them across before the old site is switched off.
- **Images.** 236 of the old pages' images are re-encoded to WebP (8.8 MB in `assets/img/up/`).
  - The 7.7 MB animated cable-management GIF is now a 1.2 MB animated WebP, with a still frame for reduced motion.
  - Five graphics drawn for the old site's dark sections (white labels) sit on ink bands so their labels stay readable.
  - Several product and spec images are small originals (300–900 px), so they are shown at modest sizes.

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
- `npx html-validate index.html */index.html`: all 118 pages are clean. Two style rules are switched off: uppercase DOCTYPE, and the 70-character title limit, because several blog post titles are longer than that.
- Link check: all 10,323 local links and image references on the 118 pages resolve.
- Phone width: no page scrolls sideways at 360 px.
- No console errors on the homepage, a product page, a sector page, a case page, About, Products, Services, Contact, the blog list or a post.
- Lighthouse, mobile and desktop: see the results in the hand-off message.
- Manual checks:
  - phone, tablet and desktop layouts
  - product sheet: open, switch variants, "Contact us" pre-fill
  - case sheet
  - certificate viewer
  - mega menu (click and Esc), on the homepage and inner pages
  - sector tabs (click and arrow keys)
  - inner-page "Contact us" pre-fills the enquiry ("Product enquiry", "Product: …")
  - form validation and the WhatsApp link (nothing was sent)

## Blacklist audit (from `~/energy savers/Claude outputs/`)

Pass means the site does not do it.

- **Colour.** Pass on all items.
  - No gradients, glow, mesh, glass, neon or eco teal, and no indigo.
  - Two colours from the logo do the work.
  - No grey-on-white body text: the lowest body contrast is 7.1:1.
  - No dot or line grid backgrounds. Rules divide content only.
- **Type.** Pass, with one owner-requested exception.
  - Archivo + Source Serif 4, neither on the font list.
  - No eyebrows above every heading, no gradient text.
  - The serif-italic last word in display headings was asked for by the owner (the Fixa reference). It uses Source Serif 4, the body font, not Instrument Serif.
  - Headlines are left-aligned with normal tracking.
- **Layout.** Pass.
  - No three identical cards, bento, zigzag, stats bar under the hero, logo wall or marquee, testimonials, pricing, FAQ or "how it works".
  - The nav is not blurred or a pill. There is no CTA banner, and widths vary by section.
- **Copy.** Pass. No buzzwords and no "Learn more". One primary button per view. Figures are the owner's (flagged).
- **Components.** Pass.
  - Square corners, no hover lifts or glows, no rounded icon boxes, no fake browser frames.
  - No chat pop-up, cookie banner, modal on load, back-to-top or progress bar.
- **Imagery.** Pass. Real project and field photos, no stock handshakes, holograms or 3D shapes. Sector photos are kept as approved. Where the old copies were too small, photos of the same real places were used (item 9).
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
| `node tools/draw-ahf.mjs` | Regenerates the exploded AHF drawing and re-inlines it into `index.html` |
| `node tools/draw-heat-pump.mjs` | Regenerates the exploded heat pump drawing and re-inlines it into `index.html` |
| `node tools/contrast-check.mjs` | Contrast audit |
| `python3 tools/scrape-pages.py` | Saves the old site's pages and posts as JSON in `content/` |
| `python3 tools/build-pages.py` | Regenerates every inner page and post, and their images |
