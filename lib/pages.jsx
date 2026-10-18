// Every inner page and blog post, built from the old site's content (content/*.json) at build time.
// Ported from tools/build-pages.py: the words come from the content files as they are; this decides
// the layout and adds only UI labels (breadcrumbs, "Before"/"After", "Previous"/"Next").
import Contact from '@/components/site/Contact';
import CertViewer from '@/components/shared/CertViewer';
import ProductLines from '@/components/shared/ProductLines';
import ServiceCards from '@/components/shared/ServiceCards';
import PostLink from '@/components/shared/PostLink';
import Workplan from '@/components/shared/Workplan';
import { CasePhoto, Scope } from '@/components/shared/CaseArticle';
import { ABOUT_LEDE, Certs, Highlights, Names } from '@/components/shared/About';
import { INSIGHTS_INTRO } from '@/components/home/Insights';
import PhaseTabs from '@/components/behaviour/PhaseTabs';
import { Fold, PageHead, band, chars, columns, contactButton, docLink, inline, joinHeadings, list, nextId, onPlate, pageText, prose, siblings, ulHtml } from '@/components/inner/parts';
import { CASES, caseByKey } from '@/data/cases';
import { SECTOR_PAGES, SECTORS_INTRO, sectorByKey } from '@/data/sectors';
import { SUMMARIES } from '@/data/summaries';
import { loadPage, loadPosts, fmtDate } from './content';
import { normalize, layout } from './blocks';
import { HomeImg, Img, image, isIcon, isCutout } from './images';
import { LABEL, PARENT, CHILDREN, HEAD_IMAGE, HEAD_HOME_IMAGE, filmOf, href, topOf } from './site';
import { flat, isHeading, len, lvl, norm, oneLine, opening, sentences, tidy } from './text';

const SPECIAL = new Set(['about', 'products', 'services', 'solutions', 'sectors', 'case-studies', 'contact-us', 'blog']);

// the site map's parents, plus the blog posts under Blog
const parents = new Map(PARENT);
for (const p of loadPosts()) parents.set(p.slug, 'blog');

const newCtx = (slug, known = s => LABEL.has(s)) => ({ slug, ids: { n: 0 }, known });

/* ------------------------------------------------------------------ page types */
// TODO(owner) notes for single pages (OSKAR, PQ Equipment Rental, Adsorption Chiller, EV Chargers) are in OVERRIDES, lib/site.js.
function generic(slug) {
  const d = loadPage(slug);
  const ctx = newCtx(slug);
  const secs = d.sections.map(s => normalize(s.blocks, slug)).filter(s => s.length);
  let title = d.title || LABEL.get(slug);
  const kicker = [];
  const docs = [];
  let lede = null;
  let media = null;
  let more = [];
  if (secs.length) {
    const first = secs.shift();
    let rest = [];
    if (slug === 'ev-chargers') {                    // a slider: its first slide is the page head
      const { items } = layout(first);
      const s1 = items.shift();
      title = oneLine(s1.title.text);
      media = s1.media.length ? s1.media[0] : null;
      lede = s1.body.find(b => b.t === 'p') || null;
      rest = items.flatMap(it => [...(it.media.length ? [{ ...it.media[0], href: it.href }] : []), it.title, ...it.body]);
    } else {
      let i = 0;
      while (i < first.length && isHeading(first[i])) i++;
      let run = first.slice(0, i);
      const later = new Set(first.slice(i).filter(isHeading).map(lvl));
      const isTitle = h => { const a = norm(h.text), b = norm(title); return b.includes(a) || a.includes(b); };
      // a heading that repeats the page title stays the head's, even when a section of its level follows
      if (run.length && later.has(lvl(run[run.length - 1])) && !isTitle(run[run.length - 1])) { run = run.slice(0, -1); i -= 1; }
      for (const h of run) {
        if (!isTitle(h)) kicker.push(tidy(h.text));
      }
      for (const b of first.slice(i)) {
        const textStarted = rest.some(isHeading);
        if (lede === null && b.t === 'p' && !textStarted) lede = b;
        else if (b.t === 'pdf' && !textStarted) docs.push(b);
        else if (media === null && b.t === 'img' && !textStarted && !isIcon(b.src)) media = b;
        else rest.push(b);
      }
    }
    // the head's paragraphs after its first one belong with it (a list stays in view, in a band)
    let k = 0;
    while (slug !== 'ev-chargers' && k < rest.length && rest[k].t === 'p') k++;
    more = rest.slice(0, k);
    rest = rest.slice(k);
    if (rest.length) secs.unshift(rest);
  }
  const { lede: summary, points, fold, text } = summarize(slug, lede, more, !secs.length);
  const actions = <>{contactButton(slug, title)}{list(docs.slice(0, 2).map(b => docLink(b)))}</>;
  let m = null;
  let crop = false;
  let plate = false;
  let plateWidth = 480;
  const src = media ? media.src : HEAD_IMAGE[slug];
  if (src) {
    const info = image(src);
    // a product made on white stands on its plate, whatever its shape; a wide photo (the EV Chargers
    // banner) sits beside the text, cut to the product, rather than across the page
    plate = onPlate(src);
    crop = !plate && info.w / info.h > 1.7;
    plateWidth = info.w;
    m = <Img path={src} alt={isCutout(src) ? oneLine(title) : ''} sizes="(min-width: 960px) 36vw, 100vw" mobile={media && media.mobile} eager />;
  } else if (HEAD_HOME_IMAGE[slug]) {
    plate = true;
    m = <HomeImg name={HEAD_HOME_IMAGE[slug]} alt={oneLine(title)} sizes="(min-width: 960px) 36vw, 100vw" eager />;
  }
  return {
    title: oneLine(title),
    description: d.description || (lede ? oneLine(lede.text) : LABEL.get(slug)),
    main: <>
      <PageHead slug={slug} title={oneLine(title)} kicker={kicker.join(' · ') || null}
        lede={summary.length ? list(summary.map(b => (b.t === 'p' ? <p>{inline(b)}</p> : ulHtml(b, ctx)))) : null}
        points={points} actions={actions} media={m} plate={plate} plateWidth={plateWidth} crop={crop} film={filmOf(slug)} />
      {fold && <Fold blocks={fold} ctx={ctx} />}
      {text && band(slug, text, ctx)}
      {list(joinHeadings(secs).map(s => band(slug, s, ctx)))}
      {siblings(slug)}
    </>,
  };
}

/** What a page head says: a short summary of the first paragraph and the key points (data/summaries.js),
 *  with the whole text in the fold under the head. Short texts show in full, with no fold.
 *  lede: the first paragraph; more: the head's paragraphs after it.
 *  alone: the text is all the page has. Then it isn't folded away: it follows the head in full (text). */
function summarize(slug, lede, more, alone = false) {
  const sum = SUMMARIES[slug] || {};
  const points = (sum.points || []).map(p => {
    if (!pageText(slug).includes(flat(p))) throw new Error(`data/summaries.js: "${p}" is not in the text of /${slug}/`);
    return Array.from(p)[0].toUpperCase() + Array.from(p).slice(1).join('');
  });
  const all = [...(lede ? [lede] : []), ...more];
  const text = lede ? oneLine(lede.text) : '';
  const shown = 'lede' in sum ? sentences(text).slice(0, sum.lede).join(' ') : len(text) > 300 ? opening(text) : text;
  if (chars(all) - len(shown) <= 120) return { lede: all, points, fold: null, text: null };
  const keep = shown && lede.lead && shown.startsWith(lede.lead) ? { lead: lede.lead } : {};
  const head = shown ? [{ t: 'p', text: shown, ...keep }] : [];
  if (alone) return { lede: head, points, fold: null, text: shown === text ? more : all };
  return { lede: head, points, fold: all, text: null };
}

function products() {
  return {
    title: 'Products',
    description: loadPage('products').description,
    main: <>
      <PageHead slug="products" title="Our products" film={filmOf('products')} />
      <div className="bench bench--page">
        <div className="wrap">
          <ProductLines page />
        </div>
      </div>
    </>,
  };
}

function services() {
  return {
    title: 'Services',
    description: loadPage('services').description,
    main: <>
      <PageHead slug="services" title="Our services" film={filmOf('services')} />
      <div className="band band--untitled">
        <div className="wrap">
          <ServiceCards page />
        </div>
      </div>
    </>,
  };
}

/** A list page (Solutions): the old cards, each linking to its page */
function solutions() {
  const d = loadPage('solutions');
  const ctx = newCtx('solutions');
  return {
    title: 'Solutions',
    description: d.description,
    main: <>
      <PageHead slug="solutions" title="Our solutions" film={filmOf('solutions')} />
      {list(d.sections.map(s => band('solutions', normalize(s.blocks, 'solutions'), ctx)))}
    </>,
  };
}

function sectorsIndex() {
  return {
    title: 'Sectors',
    description: loadPage('sectors').description,
    main: <>
      <PageHead slug="sectors" title="Our sectors" lede={<p>{SECTORS_INTRO}</p>} film={filmOf('sectors')} />
      <div className="band band--untitled">
        <div className="wrap band__grid">
          <div className="band__wide">
            <ul className={`tiles tiles--photos tiles--c${columns('photos', CHILDREN.get('sectors').length)}`}>
              {CHILDREN.get('sectors').map(slug => {
                const s = sectorByKey(SECTOR_PAGES[slug]);
                return (
                  <li className="tile tile--link" key={slug}>
                    <figure className="tile__media tile__media--photo"><HomeImg name={'sector-' + s.key} sizes="(min-width: 1100px) 40vw, (min-width: 640px) 58vw, 116vw" /></figure>
                    <h2 className="tile__title"><a href={href(slug)}>{s.name}</a></h2>
                    <div className="tile__body"><p>{s.areas}</p></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>,
  };
}

// at least three to a row: two case photos are too small to fill half the page each
function caseCards(keys, hl = 2) {
  const H = 'h' + hl;
  return (
    <ul className={`tiles tiles--photos tiles--c${Math.max(3, columns('photos', keys.length))}`}>
      {keys.map(key => {
        const c = caseByKey(key);
        return (
          <li className="tile tile--link tile--case" key={key}>
            <figure className="tile__media tile__media--photo"><CasePhoto photo={c.photo} sizes="(min-width: 1100px) 40vw, (min-width: 640px) 58vw, 116vw" /></figure>
            <p className="tile__meta">{c.place} <span>{c.year}</span></p>
            <H className="tile__title"><a href={href(c.slug)}>{c.client}</a></H>
            <div className="tile__body"><p>{c.register.scope}</p><p className="tile__result">{c.register.result}</p></div>
          </li>
        );
      })}
    </ul>
  );
}

function casesIndex() {
  return {
    title: 'Case studies',
    description: 'Power quality, HVAC and automation projects by Energy Savers in Dubai.',
    main: <>
      <PageHead slug="case-studies" title="Case studies" film={filmOf('case-studies')} />
      <div className="band band--untitled">
        <div className="wrap band__grid">
          <div className="band__wide">{caseCards(CASES.map(c => c.key))}</div>
        </div>
      </div>
    </>,
  };
}

function casePage(c) {
  const ctx = newCtx(c.slug);
  return {
    title: c.client,
    // the old scope text with its line break read as a space
    description: c.scope.join('  '),
    main: <>
      <PageHead slug={c.slug} title={oneLine(c.client)} kicker={`${c.place} · ${c.year}`} lede={<p><Scope lines={c.scope} /></p>}
        actions={contactButton(c.slug, c.client)} media={<CasePhoto photo={c.photo} sizes="(min-width: 960px) 36vw, 100vw" lazy={false} />}
        film={filmOf(c.slug)} />
      <div className="band">
        <div className="wrap band__grid">
          <div className="band__wide findings">
            {c.findings.map(f => (
              <div className="findings__group" key={f.title}>
                <h2 className="findings__title" id={nextId(ctx)}>{f.title}</h2>
                <ul className="sq-list">{f.items.map(i => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          {/* TODO(owner) notes on the workplan figures are in data/cases.js */}
          <div className="band__wide"><Workplan {...c.workplan} /></div>
        </div>
      </div>
      {siblings(c.slug)}
    </>,
  };
}

function sectorPage(slug) {
  const d = loadPage(slug);
  const ctx = newCtx(slug);
  const banner = d.sections[0].blocks;
  const h2 = banner.find(b => b.t === 'h2');
  const name = h2 ? h2.text : LABEL.get(slug);
  const intro = banner.filter(b => b.t === 'p');
  const key = SECTOR_PAGES[slug];
  const phases = [];
  let cur = null;
  let topic = null;
  for (const b of d.sections[1].blocks) {
    if (b.t === 'p' && ['Challenges', 'Root Cause Analysis', 'Solutions', 'Benefits'].includes(b.text.trim())) {
      cur = { name: b.text.trim(), topics: [] };
      phases.push(cur);
    } else if (isHeading(b) && cur !== null) {
      topic = { name: tidy(b.text), blocks: [] };
      cur.topics.push(topic);
    } else if (topic !== null) {
      topic.blocks.push(b);
    }
  }
  const cases = sectorByKey(key).cases.map(([k]) => k);
  const { lede: summary, fold } = summarize(slug, intro[0] || null, intro.slice(1));
  return {
    title: name,
    description: d.description || oneLine(intro[0].text),
    main: <>
      <PageHead slug={slug} title={oneLine(name)} lede={summary.length ? list(summary.map(b => <p>{inline(b)}</p>)) : null}
        actions={contactButton(slug, name)}
        backdrop={<HomeImg name={'sector-' + key} sizes="(max-width: 959px) 160vw, 100vw" eager className={`page-head__photo sector-photo--${key}`} />} />
      {fold && <Fold blocks={fold} ctx={ctx} />}
      <div className="band band--phases">
        <div className="wrap">
          <div className="phases" data-tabs="">
            {phases.map(ph => (
              <div className="phase" id={'phase-' + ph.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-+|-+$/g, '')} key={ph.name}>
                <h2 className="phase__title">{tidy(ph.name)}</h2>
                <div className="topics">
                  {list(ph.topics.map(t => (
                    <section className="topic"><h3 className="topic__title">{t.name}</h3><div className="topic__body">{list(prose(t.blocks, ctx))}</div></section>
                  )))}
                </div>
              </div>
            ))}
          </div>
          <PhaseTabs />
        </div>
      </div>
      {list(d.sections.slice(2).map(s => band(slug, normalize(s.blocks, slug), ctx)))}
      {cases.length > 0 && (
        <section className="band" aria-labelledby="sector-cases">
          <div className="wrap band__grid">
            <h2 className="band__title" id="sector-cases">Case studies</h2>
            <div className="band__wide">{caseCards(cases, 3)}</div>
          </div>
        </section>
      )}
      {siblings(slug)}
    </>,
  };
}

function about() {
  const d = loadPage('about');
  const ctx = newCtx('about');
  const blocks = d.sections[0].blocks;
  const paras = blocks.filter(b => b.t === 'p');
  const areasHeading = blocks.find(b => b.t === 'h2');
  const areas = blocks.find(b => b.t === 'ul');
  const certified = paras.find(p => p.text.startsWith('Energy Savers is certified'));
  const focus = paras.find(p => p.text.startsWith('Energy Savers focuses'));
  return {
    title: 'About us',
    description: d.description,
    extra: <CertViewer />,
    main: <>
      <PageHead slug="about" title="About us" lede={<p>{ABOUT_LEDE}</p>}
        backdrop={<HomeImg name="about-business-bay" alt="Business Bay, Dubai, at dusk" sizes="(max-width: 959px) 160vw, 100vw" eager className="page-head__photo" />} />
      <section className="band" aria-labelledby="about-areas">
        <div className="wrap band__grid">
          <h2 className="band__title band__title--long" id="about-areas">{tidy(areasHeading.text)}</h2>
          <div className="band__body prose">{ulHtml(areas, ctx)}</div>
        </div>
      </section>
      <section className="band on-ink-2" aria-labelledby="about-focus">
        <div className="wrap band__grid">
          <h2 className="band__title" id="about-focus">Sustainability in energy</h2>
          <div className="band__body prose"><p>{inline(focus)}</p></div>
          <div className="band__wide"><Highlights /></div>
        </div>
      </section>
      {/* the sentence about the certificates sits under the heading, the certificates beside both */}
      <section className="band band--certs" aria-labelledby="about-certs">
        <div className="wrap band__grid">
          <h2 className="band__title" id="about-certs">Our certifications</h2>
          <div className="band__body prose"><p>{inline(certified)}</p></div>
          <div className="band__certs"><Certs /></div>
        </div>
      </section>
      <div className="band">
        <div className="wrap">
          <Names />
        </div>
      </div>
    </>,
  };
}

function contactPage() {
  return {
    title: 'Contact us',
    description: 'Contact Energy Savers in Dubai and Riyadh: phone, email, WhatsApp and office addresses.',
    contact: false,
    main: <>
      <PageHead slug="contact-us" title="Contact us" film={filmOf('contact-us')} />
      <Contact page />
    </>,
  };
}

function blog() {
  const years = new Map();
  for (const p of loadPosts()) {
    const y = p.date.slice(0, 4);
    if (!years.has(y)) years.set(y, []);
    years.get(y).push(p);
  }
  return {
    title: 'Blog',
    description: INSIGHTS_INTRO,
    main: <>
      <PageHead slug="blog" title="Our latest news" lede={<p>{INSIGHTS_INTRO}</p>} film={filmOf('blog')} />
      <div className="band band--untitled">
        <div className="wrap">
          {[...years.keys()].sort().reverse().map(y => (
            <section className="blog-year" aria-labelledby={'y' + y} key={y}>
              <h2 className="blog-year__title" id={'y' + y}>{y}</h2>
              <ul className="posts">{years.get(y).map(p => <PostLink post={p} key={p.slug} />)}</ul>
            </section>
          ))}
        </div>
      </div>
    </>,
  };
}

function post(i) {
  const posts = loadPosts();
  const p = posts[i];
  const prev = posts[i + 1];       // older
  const next = i ? posts[i - 1] : null;
  // Links to other posts only count once that post exists, newest first, as when the pages were generated one by one
  const known = new Set(posts.slice(0, i + 1).map(x => x.slug));
  const ctx = newCtx(p.slug, s => LABEL.has(s) || known.has(s));
  const blocks = p.sections.flatMap(s => normalize(s.blocks, p.slug));
  return {
    title: p.title,
    description: Array.from(p.excerpt.split(' [&hellip;]').join('').split(' […]').join('')).slice(0, 300).join(''),
    main: <>
      <PageHead slug={p.slug} title={oneLine(p.title)} kicker={<time dateTime={p.date}>{fmtDate(p.date)}</time>} post parents={parents}
        film={filmOf(p.slug, parents)} />
      <article className="band band--article" aria-labelledby="page-title">
        <div className="wrap">
          <div className="article prose">{list(prose(blocks, ctx, 3, true))}</div>
        </div>
      </article>
      {(prev || next) && (
        <nav className="band post-nav" aria-label="More posts">
          <div className="wrap post-nav__grid">
            {prev && <a className="post-nav__link" href={href(prev.slug)} rel="prev"><span className="post-nav__dir">Previous</span>{prev.title}</a>}
            {next && <a className="post-nav__link post-nav__link--next" href={href(next.slug)} rel="next"><span className="post-nav__dir">Next</span>{next.title}</a>}
          </div>
        </nav>
      )}
    </>,
  };
}

/* ------------------------------------------------------------------ routing */

/** Every inner page and post, in the old site's order */
export function allSlugs() {
  return [...LABEL.keys(), ...loadPosts().map(p => p.slug)];
}

const built = new Map();
/** { title, description, top, main, contact, extra } for one page */
export function buildPage(slug) {
  if (built.has(slug)) return built.get(slug);
  const i = loadPosts().findIndex(p => p.slug === slug);
  const page =
    i >= 0 ? post(i)
      : slug === 'about' ? about()
        : slug === 'products' ? products()
          : slug === 'services' ? services()
            : slug === 'solutions' ? solutions()
              : slug === 'sectors' ? sectorsIndex()
                : slug === 'case-studies' ? casesIndex()
                  : slug === 'contact-us' ? contactPage()
                    : slug === 'blog' ? blog()
                      : PARENT.get(slug) === 'sectors' ? sectorPage(slug)
                        : PARENT.get(slug) === 'case-studies' ? casePage(CASES.find(c => c.slug === slug))
                          : generic(slug);
  const result = { contact: true, extra: null, ...page, top: topOf(slug, parents) };
  built.set(slug, result);
  return result;
}

/** The <title>: long titles stand alone, short ones get the company name */
export const pageTitle = t => (len(t) > 52 ? t : `${t} — Energy Savers`);
export { SPECIAL };
