# Energy Savers redesign: notes

Private preview of a proposed redesign of energysavers.me: the homepage, every inner page and the blog. It is not published anywhere, and every page carries `noindex`.

## What the owner needs to confirm

Each item is also marked `TODO(owner)` in the source: `components/home/Stats.jsx`, `components/home/CaseStudies.jsx`, `data/cases.js`, `components/home/ProductSheet.jsx`, `components/shared/ServiceCards.jsx`, `components/shared/About.jsx` and, for single inner pages, `lib/site.js`.

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
   - Added in the sixth round, also under the Pexels licence:
     - Hero film: "Industrial Factory Workers Operating Machinery" by Usman AbdulrasheedGambo (pexels.com/video/32243444). It shows a pump-room crew, not an Energy Savers site, so it has no caption or alt text naming anyone.
     - Data Centres / Telecom sector: "Server Racks on Data Center" by Brett Sayles (pexels.com/photo/4508751), replacing the old 3D render.
   - Key highlights uses their own photo of the adsorption chiller plant at Mina A'Salam (the image of their blog post about it, 800 px).
   - Added in the seventh round, also under the Pexels licence: the films behind the inner page heads (`tools/build-head-films.sh`). None shows an Energy Savers site, so none is captioned:
     - Power quality: a worker at the electrical panels of a plant, by aksinfo7 universe (pexels.com/video/30295544)
     - HVAC: cooling tower fans and steam from above, by K (pexels.com/video/9339477)
     - Automation: a control room with a video wall, by Kiwi and Camera (pexels.com/video/38779095)
     - EV chargers: a charging plug in an electric car, by Kindel Media (pexels.com/video/9790000)
     - Solutions: a glass office tower at dusk, by K M (pexels.com/video/9874596)
     - Services: measuring on an electronics bench, by José Alfredo Munguía Lira (pexels.com/video/3466611)
     - Sectors: the Dubai skyline at dusk, by Denys Gromov (pexels.com/video/35972202)
10. **Contact details.** Which phone is primary (+971 4 568 6557 is used in the header), the WhatsApp number (+971 52 536 0124), and whether there are social accounts besides LinkedIn.
11. **Claims to confirm.** "Funding assistance" and "energy model development" were in the old hero; they were dropped from About for length. "First Solar Thermal Chiller installation in the UAE" is shown, and "ROI less than 12 months in most cases" appears on the heat pump sheet.

## Second round (owner feedback)

- **Headings:** display headings ended on one word in Source Serif 4 italic, as on Fixa. In the fifth round this was cut back to the hero only. "Carbon offset" is the muted first line of that heading instead of a smaller label.
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
- The pages are built by `lib/pages.jsx` from the old site's text (`content/`, saved by `tools/scrape-pages.py`). The header, contact section and footer are the homepage's components. (Until the Next.js port this was `tools/build-pages.py`.)
- Layout: the homepage's system throughout. There is a light page head with breadcrumb, the title and the first paragraph. Each old section becomes a band, with its title on the left and its text on the right. Repeated items become ruled tiles, benefit icons sit on ink, and every page ends with the other pages of its group and the contact form.
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
- **Images.** 236 of the old pages' images are re-encoded to WebP (8.8 MB in `public/assets/img/up/`).
  - The 7.7 MB animated cable-management GIF became a 1.2 MB animated WebP; since the sixth round it is its first frame, a 10 KB still.
  - Five graphics drawn for the old site's dark sections (white labels) sit on ink bands so their labels stay readable.
  - Several product and spec images are small originals (300–900 px), so they are shown at modest sizes.

## Fourth round: Next.js port

The same site, rebuilt with Next.js (App Router) as a static export, so it runs with `npm run dev` and is made of reusable components. Nothing was redesigned and no content changed.

- **What moved:** `index.html` became `app/page.jsx` and the components in `components/`; `styles.css` became `app/globals.css` (only the font paths changed); `script.js` became small client components in `components/behaviour/`; `assets/` moved to `public/assets/` (the addresses stay `/assets/…`). The 117 generated folders are gone: `app/[slug]/page.jsx` builds the same pages from `content/` when the site is built.
- **Tools:** `tools/build-pages.py` is replaced by `lib/pages.jsx` (layout) and `tools/build-images.py` (image sizes and WebP files). The AHF and heat pump generators now write React components.
- **Owner notes:** the `TODO(owner)` markers are kept, in the source files listed at the top. HTML comments don't survive React, so they no longer appear in the built pages' source.
- **Checks run:**
  - The built pages' DOM was compared with the old static pages, element by element (text, attributes, links, images, head tags): all 118 are identical.
  - In Chrome, every element's position, size and computed style was compared at 1440 px and 390 px on all 118 pages: identical within half a pixel. No page scrolls sideways at 360 px.
  - All 11,209 local links and image references in `out/` resolve. No console errors on the homepage, a product, sector, case, About, Contact, EV chargers and a blog page.
  - Interactions checked on the build: mega menu (click and Esc), phone menu, product sheet and chips, "Contact us" pre-fill, case sheet, certificate viewer, services rail, sector tabs (click and arrow keys), form validation and the WhatsApp hand-off (nothing was sent), skip link and back button, `?motion=off`.
  - `node tools/contrast-check.mjs`: all 32 pairs pass.
- **Costs of Next.js:** each page now carries React's data alongside its HTML, and loads React and Next's runtime. The homepage HTML is 81 KB compressed (38 KB before), and about 135 KB of compressed JavaScript loads instead of 7 KB. The look is unchanged; first load on slow phones will be somewhat slower.

## Fifth round: the italic word, toned down

The owner found the italic word overdone: it ended every heading on every page, including each inner page, case study and blog post title. It is now used the way Fixa uses it.

- **What Fixa does** (fixaplan.com, checked in the browser): one italic word on the whole page, in the hero ("Plan your day without *overwhelm*"). The sans there (Switzer) is regular weight with tight tracking, and the italic matches it in size, spacing and colour. Every other heading is plain sans.
- **Now:** the italic appears once, as the last word of the homepage hero ("Power quality and energy efficiency *solutions*"). The hero's Archivo changed from semibold at 118% width to weight 450 at normal width, tracked −0.022em, so the sans and the italic look equally heavy.
- **Plain again:** every other heading on the homepage and the inner pages, including "Let us make it together" and "Case studies". The automatic italic last word on inner page, case study and blog post titles is gone.
- **Unchanged:** the wording, the other headings' Archivo styling, and the fonts themselves.

## Sixth round (owner feedback, 17 October 2026)

**Hero**
- The waveform, the harmonic-order chart and the filter switch are gone. The hero now fills the screen, over a blurred film of a crew at work in a plant room (credit in item 9).
- The film is blurred, slightly desaturated and looped once, when it is made (`tools/build-hero-video.sh`), so the browser plays a plain video and blurs nothing itself. The loop crossfades its end into its start, so it never jumps.
- Size: 173 KB (AV1, for current browsers) or 307 KB (H.264, for the rest) on desktop; phones held upright get a 9:16 crop of 96 KB or 166 KB. The still frame that shows first is 14 KB. The old site's hero video was 8.7 MB.
- Readability: an ink scrim, darkest behind the text. Checked on every half second of the film, the dimmest text (the grey lede) keeps at least 5.9:1 on desktop and 5.3:1 on phones (AA asks for 4.5:1).
- It plays only while the hero is on screen. A pause button sits at the end of the facts row (top corner on phones). With reduced motion, Save-Data or a 2G connection the film never loads and the still stays.

**Key highlights, straight after the hero**
- The four highlights moved up from the bottom of About and are now large: their own photos for three (the adsorption chiller plant, analysers at a switchboard, a plant room) and, for "Represents top brands…", the brands named in an ink panel.
- The heading is "Key highlights", from the old site's "Key highlights of the company". The supplier names moved here from About's "Our suppliers" (the About page still has both lists).

**Sectors**
- On desktop the photo now fills the right side of the screen, full height, and changes as you scroll. A small title block in its corner names the sector shown (01 / 05, the name, five squares).
- The orange square bullets and the serif lists are gone: challenges are ruled rows in the sans, the solution sits behind a lime rule (lime means "corrected" on this site), and case studies are underlined links.
- Data Centres / Telecom has a real photo of a data centre aisle instead of the 3D render (credit in item 9). The panel uses 4:5 crops at the most each original allows: 1600 px wide for hospitality and data centres. Industrial, commercial and cooling come from 2000 × 1333 originals, so on a full-height retina panel they are shown about 1.3 times their size. Sharper photos of the same subjects can replace them if you want.

**About**
- The Business Bay photo is gone from the homepage's About. The About page still uses it as its header photo; say if it should go there too.
- The statement is set large and types itself out once it scrolls into view (about 5 seconds, with a lime square caret). The whole sentence is in the page for screen readers and search engines, and shows at once with reduced motion.
- Below it: "Our certifications" (the two certificates, as before) and "Our clients" as a ruled list.

**Workplans**
- The current runs in 3 s instead of 4.5 s.

**Lighter pages**
- Every photo and graphic now also has an AVIF copy, which browsers that read AVIF (nearly all current ones) download instead of the WebP. Each copy's quality is the lowest whose SSIM against the original is at least the WebP's, so it looks the same. Across the site: 10.1 MB of WebP → 7.4 MB of AVIF (27% smaller). Two images where AVIF did not help keep WebP only (`tools/build-avif.py`).
- The SEC 200–240 kW page's cable-management animation (a 10 fps GIF that looked choppy, 1.2 MB) is now its first frame, a 10 KB still. The other four old animations are slow slideshows (1–2 frames a second) and stay as they were.
- Measured in Chrome on a 1710 px retina window, scrolling the whole homepage now downloads 2.5 MB of images plus the 0.17 MB film, against 3.0 MB of images before: about 10% less, with the film and the new photos included.

**Blacklist exceptions, asked for by the owner**
- Items 85 and 96 (a dimmed background video behind the hero text). It is film of plant-room work, graded and scrimmed in the site's ink, and pausable.
- Item 91 (typewriter text). It is used once, on the About statement, not on the hero headline.

## Seventh round (owner feedback, 18 October 2026)

The owner found the inner pages empty, unbalanced and too wordy, and the paper background too bright, and asked to organise the whole site. Choices made with the owner: the whole site dark, films in the page heads, product text as a summary with key points and a fold, and the "100%" figures kept as on the old site.

**Dark, everywhere**
- Every page and homepage section is now on ink, in the hero's scheme: paper text, soft grey for longer text, lime for links and accents. Raised surfaces (cards, the product bench, the contact section, sheets) are a step lighter (ink-2).
- Product shots and drawings made on white stand on small light plates, at their own size or smaller, so they don't look cut out and the page doesn't light up. Wide diagrams are capped at 1040 px. The old site's graphics drawn for dark sections, and photos, have no plate; dark icons get a small one.
- Home: the About and news sections no longer leave a heading column empty. News is a heading row over three cards.

**Page heads**
- Every inner page opens like the hero: over a short blurred film of its product line or section, or, for the sector pages and About, over their own photo. The page's picture sits on the right; Static Var Generator, UPS and Automation, which had none, show their card's picture from the line page or the homepage bench.
- Films: seven new loops, made like the hero film (credits in item 9). 66–216 KB each in AV1 (H.264 for the rest). They play only while the head is on screen, have a pause button, and never load with reduced motion, Save-Data or 2G. Case studies, the blog and Contact reuse the hero film.
- Two kinds of loop, so none jumps: still shots crossfade end into start, as the hero does; moving shots (and two still ones given a slow pan) play forward, then back.
- Readability: measured over every half second of every film and over each backdrop photo. The dimmest head text keeps at least 5.6:1 over the films and 5.9:1 over the photos. In heads, the muted grey is lifted to the soft grey, as in the hero.

**Less text, nothing deleted**
- Product pages: the head shows one or two of the page's own sentences and three or four key points picked word for word from its text (`data/summaries.js`; the build stops if a point isn't in the page's text). The full original text is in the closed "Full description" fold right under the head.
- Other pages with a long first paragraph show its opening sentences, with the full text in the fold. Where the text is all a page has (Energy Audit), it is shown in full in two columns instead.
- Solutions page: each long card shows its opening sentences, with the rest behind "Read more". (The pages they link to don't have all of that text, so it stays on this page.)

**Organised**
- Cards: repeated items (products, features, benefits) are now cards. Pictures in a row share one shape and size. Rows fill evenly: 6 cards are 3 + 3, not 4 + 2. Where only some cards have a picture, the pictures sit at the foot so the titles line up. A card with no picture, among cards with pictures, uses the picture its page opens with (PQ-Box 50 on PQ Equipment Rental).
- Bands are shaped by what they hold, so no column is left empty: a title beside short text, a title above long text in two columns, or a short untitled paragraph set large.
- "Plug suite" (Static Var Generator) and "With powerful adaptive regulation" (Voltage Optimization) open with their picture on the old page; they are now one section each, not two half-empty cards. The two rules over Plug suite are one.
- Sector pages: each topic (Power quality, HVAC efficiency…) is a ruled row, its name beside its points in two columns, instead of ragged lists in a grid.
- Lead-ins such as "Solutions as below:" now title the list that follows them (HVAC Optimization, Automation Solutions, Power Quality Solutions, Smart Metering & Lighting).
- Interstellar: the "7kW" and "22kW" tab labels are a row of chips, the Dust/Rain/Heat/Cold icons sit beside their words, and the charger stands beside the text. Mira: "Smart charging functions for optimized charging", a heading with nothing under it, now introduces the app section.
- The other pages of a group are a row of chips under a ruled label, the current one in lime, instead of a heading alone in a column.
- About: the certification sentence sits under "Our certifications", beside the two certificates. The blog lists each year's posts in two columns under the year.
- PQ Equipment Rental's four analysers now link to their product pages.
- Typo fixed: two headings on the SER 40kW page repeated their own text ("High current output of 133AHigh current output of 133A").

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

Last run in the seventh round, 18 October 2026, unless noted.

- `node tools/contrast-check.mjs`: all 23 colour pairs of the dark site meet WCAG 2.2 AA. Text over the hero film and the page-head films and photos was measured separately, frame by frame (see the sixth and seventh rounds).
- Every page at 360 and 1440 px in headless Chrome: no sideways scrolling, no console errors, and no picture drawn larger than its file (the blurred film stills aside).
- The page-head films play (AV1) and show their pause button; with reduced motion nothing loads and the button stays hidden.
- `npx html-validate "out/**/index.html"`: all 119 pages are clean. Switched off: uppercase DOCTYPE and the 70-character title limit (several blog post titles are longer), plus four rules about how React writes HTML (`<img/>`, `async=""`, `charSet`, empty attributes); ids are checked with the HTML5 rules, because Next names one of its scripts `_R_`. Next's own 404 page is skipped (`.htmlvalidateignore`).
- All 11,884 local links, image, AVIF and video references on the 119 pages resolve.
- Lighthouse, mobile, on a local server without compression or caching: Static Var Generator 79 performance, 100 accessibility, 100 best practices (the homepage, measured the same way, 69). SEO is 63 only because the preview is `noindex` on purpose. Compression and caching on a real host would raise both performance scores.
- Sixth round, in Chrome: the hero film plays (AV1), fades in over its still, pauses and resumes from its button, pauses when scrolled away and resumes on return; with `?motion=off` no film is downloaded, the button is hidden and the About statement shows whole. The sector photo and its title block follow the sector in the middle of the screen. The About statement types out in about 5 s. Phone (390, 360) and tablet (768) layouts of the hero, Key highlights, sectors and About. Browsers that read AVIF get the AVIF copies, and the sector page heads keep their 21:9 crop.
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
  - No gradients, glow, mesh, glass, neon or eco teal, and no indigo. The only gradients are the scrims over the films and head photos.
  - Two colours from the logo do the work.
  - No low-contrast grey text: on the dark site the dimmest small text, muted grey on a card, is 7.5:1.
  - No dot or line grid backgrounds. Rules divide content only.
- **Type.** Pass, with one owner-requested exception.
  - Archivo + Source Serif 4, neither on the font list.
  - No eyebrows above every heading, no gradient text.
  - The single serif-italic word in the homepage hero was asked for by the owner (the Fixa reference). It uses Source Serif 4, the body font, not Instrument Serif.
  - Headlines are left-aligned. Only the hero is tracked slightly tight (−0.022em at display size); it is not centred and has no gradient word, so it is not item 17.
- **Layout.** Pass.
  - No three identical cards, bento, zigzag, stats bar under the hero, logo wall or marquee, testimonials, pricing, FAQ or "how it works".
  - The nav is not blurred or a pill. There is no CTA banner, and widths vary by section.
- **Copy.** Pass. No buzzwords and no "Learn more". One primary button per view. Figures are the owner's (flagged).
- **Components.** Pass.
  - Square corners, no hover lifts or glows, no rounded icon boxes, no fake browser frames.
  - No chat pop-up, cookie banner, modal on load, back-to-top or progress bar.
- **Imagery.** Pass, with one owner-requested exception. Real project and field photos, no stock handshakes, holograms or 3D shapes. Sector photos are kept as approved; the data centre's 3D render is now a real photo. Where the old copies were too small, photos of the same real places were used (item 9). The hero's film behind dimmed text (items 85 and 96) was asked for by the owner in the sixth round.
- **Motion.** Pass, with two owner-requested exceptions.
  - No scroll-reveal, counters, parallax, rotating words or cursor effects.
  - Asked for by the owner in the sixth round: the hero's background film (item 96), which pauses off screen, has a pause button and never loads with reduced motion; and the typed About statement (item 91), once, not in the hero.
  - The logo animation never delays content: the loader only appears if the fonts aren't ready after 400 ms, capped at 3 s.
- **Seventh round, asked for by the owner.** The whole site is dark, and the inner page heads have blurred films too (items 85 and 96 again). Like the hero's, they are graded into the site's ink, pause off screen, have a pause button and never load with reduced motion. Their scrims are the only gradients on the site.
- **Judgement calls.**
  - The hero film shows plant-room work, the kind of site the company works in, graded into the site's ink rather than dimmed with black.
  - Repeated items on the inner pages (products, features, benefits) are now cards, so that rows line up, as the owner asked. The cards hold the old pages' own items, and their count and content vary; there is no generic three-card feature row.
  - The AHF section and the sectors' photo panel use sticky positioning, but scrolling stays native (no scroll-jacking).

## Teardown "before you call it done"

- **Icons.** None depend on a font; all are inline SVG.
- **Contact.** The phone, WhatsApp, email and form are reachable above the fold (header and hero) and again at the bottom.
- **Text.** No truncated text: every "…" from the old site is gone.
- **Duplicates.** The duplicate "Our Services" heading is resolved by keeping each group under its own original heading.
- **Figures.** Formatted with separators. Case studies come straight after the figures.

## Rebuilding assets

| Command | Does |
|---|---|
| `python3 tools/fetch-assets.py [NAME…]` | Re-downloads and re-encodes the images listed in its manifest (or only the named ones) |
| `python3 tools/build-avif.py` | Writes AVIF copies of the WebP images, at the same SSIM, where they save at least 10% |
| `sh tools/build-hero-video.sh` | Makes the hero film (blurred, graded, looped) and its still frames from the Pexels clip |
| `node tools/draw-ahf.mjs` | Regenerates the exploded AHF drawing as `components/drawings/AhfDrawing.jsx` |
| `node tools/draw-heat-pump.mjs` | Regenerates the exploded heat pump drawing as `components/drawings/HeatPumpDrawing.jsx` |
| `node tools/contrast-check.mjs` | Contrast audit |
| `python3 tools/scrape-pages.py` | Saves the old site's pages and posts as JSON in `content/` |
| `python3 tools/build-images.py` | Measures the inner pages' images into `content/images.json`; with `--encode`, writes missing WebP files. The pages themselves are built by `npm run build` |
