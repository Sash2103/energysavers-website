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
import { PageHead, band, contactButton, docLink, inline, list, nextId, prose, siblings, ulHtml } from '@/components/inner/parts';
import { CASES, caseByKey } from '@/data/cases';
import { SECTOR_PAGES, SECTORS_INTRO, sectorByKey } from '@/data/sectors';
import { loadPage, loadPosts, fmtDate } from './content';
import { normalize, layout } from './blocks';
import { HomeImg, Img, image, isIcon, isCutout } from './images';
import { LABEL, PARENT, CHILDREN, href, topOf } from './site';
import { isHeading, len, lvl, norm, oneLine, tidy } from './text';

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
      if (run.length && later.has(lvl(run[run.length - 1]))) { run = run.slice(0, -1); i -= 1; }
      for (const h of run) {
        const a = norm(h.text), b = norm(title);
        if (!(b.includes(a) || a.includes(b))) kicker.push(tidy(h.text));
      }
      for (const b of first.slice(i)) {
        const textStarted = rest.some(isHeading);
        if (lede === null && b.t === 'p' && !textStarted) lede = b;
        else if (b.t === 'pdf' && !textStarted) docs.push(b);
        else if (media === null && b.t === 'img' && !textStarted && !isIcon(b.src)) media = b;
        else rest.push(b);
      }
    }
    if (rest.length) secs.unshift(rest);
  }
  const actions = <>{contactButton(slug, title)}{list(docs.slice(0, 2).map(b => docLink(b)))}</>;
  let m = null;
  let wide = false;
  if (media) {
    const info = image(media.src);
    wide = info.w / info.h > 1.7;
    const cutout = isCutout(media.src);
    m = <Img path={media.src} alt={cutout ? oneLine(title) : ''} sizes={wide ? '100vw' : '(min-width: 960px) 42vw, 100vw'}
      mobile={media.mobile} eager className={cutout && !wide ? 'is-cutout' : ''} />;
  }
  return {
    title: oneLine(title),
    description: d.description || (lede ? oneLine(lede.text) : LABEL.get(slug)),
    main: <>
      <PageHead slug={slug} title={oneLine(title)} kicker={kicker.join(' · ') || null} lede={lede ? <p>{inline(lede)}</p> : null}
        actions={actions} media={m} wide={wide} />
      {list(secs.map(s => band(slug, s, ctx)))}
      {siblings(slug)}
    </>,
  };
}

function products() {
  return {
    title: 'Products',
    description: loadPage('products').description,
    main: <>
      <PageHead slug="products" title="Our products" />
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
      <PageHead slug="services" title="Our services" />
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
      <PageHead slug="solutions" title="Our solutions" />
      {list(d.sections.map(s => band('solutions', normalize(s.blocks, 'solutions'), ctx)))}
    </>,
  };
}

function sectorsIndex() {
  return {
    title: 'Sectors',
    description: loadPage('sectors').description,
    main: <>
      <PageHead slug="sectors" title="Our sectors" lede={<p>{SECTORS_INTRO}</p>} />
      <div className="band band--untitled">
        <div className="wrap band__grid">
          <div className="band__wide">
            <ul className="tiles tiles--photos">
              {CHILDREN.get('sectors').map(slug => {
                const s = sectorByKey(SECTOR_PAGES[slug]);
                return (
                  <li className="tile tile--link" key={slug}>
                    <figure className="tile__media tile__media--photo"><HomeImg name={'sector-' + s.key} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw" /></figure>
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

function caseCards(keys, hl = 2) {
  const H = 'h' + hl;
  return (
    <ul className="tiles tiles--photos">
      {keys.map(key => {
        const c = caseByKey(key);
        return (
          <li className="tile tile--link tile--case" key={key}>
            <figure className="tile__media tile__media--photo"><CasePhoto photo={c.photo} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw" /></figure>
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
      <PageHead slug="case-studies" title="Case studies" />
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
        actions={contactButton(c.slug, c.client)} media={<CasePhoto photo={c.photo} sizes="(min-width: 960px) 42vw, 100vw" lazy={false} />} />
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
  return {
    title: name,
    description: d.description || oneLine(intro[0].text),
    main: <>
      <PageHead slug={slug} title={oneLine(name)} lede={intro.length ? list(intro.map(b => <p>{inline(b)}</p>)) : null}
        actions={contactButton(slug, name)} wide
        media={<HomeImg name={'sector-' + key} sizes="100vw" eager className={`sector-photo sector-photo--${key}`} />} />
      <div className="band band--phases">
        <div className="wrap">
          <div className="phases" data-tabs="">
            {phases.map(ph => (
              <div className="phase" id={'phase-' + ph.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-+|-+$/g, '')} key={ph.name}>
                <h2 className="phase__title">{tidy(ph.name)}</h2>
                <div className="topics">
                  {list(ph.topics.map(t => <section className="topic"><h3 className="topic__title">{t.name}</h3>{list(prose(t.blocks, ctx))}</section>))}
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
      <PageHead slug="about" title="About us" lede={<p>{ABOUT_LEDE}</p>} wide
        media={<HomeImg name="about-business-bay" alt="Business Bay, Dubai, at dusk" sizes="100vw" eager />} />
      <section className="band" aria-labelledby="about-areas">
        <div className="wrap band__grid">
          <h2 className="band__title band__title--long" id="about-areas">{tidy(areasHeading.text)}</h2>
          <div className="band__body prose">{ulHtml(areas, ctx)}<p>{inline(certified)}</p></div>
        </div>
      </section>
      <section className="band on-ink" aria-labelledby="about-focus">
        <div className="wrap band__grid">
          <h2 className="band__title" id="about-focus">Sustainability in energy</h2>
          <div className="band__body prose"><p>{inline(focus)}</p></div>
          <div className="band__wide"><Highlights /></div>
        </div>
      </section>
      <section className="band" aria-labelledby="about-certs">
        <div className="wrap band__grid">
          <h2 className="band__title" id="about-certs">Our certifications</h2>
          <div className="band__body"><Certs /></div>
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
      <PageHead slug="contact-us" title="Contact us" />
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
      <PageHead slug="blog" title="Our latest news" lede={<p>{INSIGHTS_INTRO}</p>} />
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
      <PageHead slug={p.slug} title={oneLine(p.title)} kicker={<time dateTime={p.date}>{fmtDate(p.date)}</time>} post parents={parents} />
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
