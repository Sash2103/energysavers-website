// Building blocks of the inner pages, ported from tools/build-pages.py. These are plain functions
// (not components) because a page numbers its section titles in order (ctx.ids).
// ctx: { slug, ids: { n }, known(slug) } — known() tells whether a page exists to link to.
import { Fragment } from 'react';
import Icon from '@/components/shared/Icon';
import { Img, image, isIcon, isCutout } from '@/lib/images';
import { layout } from '@/lib/blocks';
import { LABEL, PARENT, CHILDREN, FIX_LINKS, DARK_GROUND, INTEREST, UPLOADS, href, inProducts } from '@/lib/site';
import { HEADINGS, isHeading, lvl, len, norm, oneLine, textOf, tidy } from '@/lib/text';

/** An array of elements as children (keys by position) */
export const list = arr => arr.map((el, i) => <Fragment key={i}>{el}</Fragment>);

export const nextId = ctx => `s${++ctx.ids.n}`;

/** Text with its line breaks */
export function Lines({ text }) {
  return list(text.split('\n').map((x, i) => (i ? <><br />{x}</> : x)));
}

/** A paragraph or list item, with its bold lead-in */
export function inline(b) {
  const t = textOf(b);
  const lead = typeof b === 'string' ? null : b.lead;
  if (lead && t.startsWith(lead)) {
    const rest = t.slice(lead.length);
    const sep = [':', '-', '–', ' '].includes(Array.from(rest)[0]) ? '' : ' ';
    return <><strong><Lines text={lead} /></strong>{sep}<Lines text={rest} /></>;
  }
  return <Lines text={t} />;
}

function crumbs(slug, parents) {
  const trail = [];
  for (let p = parents.get(slug); p; p = parents.get(p)) trail.unshift(p);
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        {trail.map(s => <li key={s}><a href={href(s)}>{LABEL.get(s)}</a></li>)}
      </ol>
    </nav>
  );
}

/** The light page head: breadcrumb, kicker, title, first paragraph, actions, and the page's image.
 *  parents: the site map's parents, plus the blog posts (which sit under Blog). */
export function PageHead({ slug, title, kicker = null, lede = null, actions = null, media = null, wide = false, post = false, parents = PARENT }) {
  return (
    <section className={post ? 'page-head page-head--post' : 'page-head'} aria-labelledby="page-title">
      <div className={media && !wide ? 'wrap page-head__grid page-head__grid--media' : 'wrap page-head__grid'}>
        <div className="page-head__text">
          {crumbs(slug, parents)}
          {kicker && <p className="page-head__kicker">{kicker}</p>}
          <h1 className="page-title" id="page-title">{title}</h1>
          {lede && <div className="page-head__lede">{lede}</div>}
          {actions && <div className="page-head__actions">{actions}</div>}
        </div>
        {media && <figure className={wide ? 'page-head__media page-head__media--wide' : 'page-head__media'}>{media}</figure>}
      </div>
    </section>
  );
}

export function docLink(b, label) {
  return <a className="text-link" href={UPLOADS + b.href}>{b.text || label || 'Download'} (PDF) <Icon name="external" /></a>;
}

function ulHtml(b, ctx) {
  const rows = b.items.map(i => textOf(i).split('\n'));
  if (rows.length >= 3 && new Set(rows.map(r => r.length)).size === 1 && rows[0].length >= 3) {
    // a table built out of list items on the old page (rows of cells)
    return (
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr>{rows[0].map((c, j) => <th scope="col" key={j}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th scope="row" key={j}>{c}</th> : <td key={j}>{c}</td>))}</tr>)}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <ul className="sq-list">
      {b.items.map((i, k) => {
        const target = typeof i === 'string' ? null : i.href;
        const content = inline(i);
        return <li key={k}>{target && ctx.known(target) ? <a href={href(target)}>{content}</a> : content}</li>;
      })}
    </ul>
  );
}
export { ulHtml };

function figure(b, sizes = '(min-width: 960px) 50vw, 100vw') {
  return <figure className="fig"><Img path={b.src} alt={b.alt || ''} sizes={sizes} mobile={b.mobile} /></figure>;
}

function compare(b) {
  return (
    <div className="compare">
      <figure className="compare__side"><Img path={b.before} sizes="(min-width: 960px) 30vw, 50vw" /><figcaption>Before</figcaption></figure>
      <figure className="compare__side"><Img path={b.after} sizes="(min-width: 960px) 30vw, 50vw" /><figcaption>After</figcaption></figure>
    </div>
  );
}

/** Running text. Headings become level hl, or keep their own level (blog posts). Returns a list. */
export function prose(blocks, ctx, hl = 3, keepLevels = false) {
  const out = [];
  const docs = [];
  const flushDocs = () => {
    if (docs.length) out.push(<ul className="docs">{docs.map((d, i) => <li key={i}>{docLink(d)}</li>)}</ul>);
    docs.length = 0;
  };
  for (const b of blocks) {
    if (b.t === 'pdf') { docs.push(b); continue; }
    flushDocs();
    if (b.t === 'p') out.push(<p>{inline(b)}</p>);
    else if (isHeading(b)) {
      const H = 'h' + (keepLevels ? Math.max(2, lvl(b)) : hl);
      out.push(<H>{tidy(b.text)}</H>);
    } else if (b.t === 'ul') out.push(ulHtml(b, ctx));
    else if (b.t === 'img') out.push(figure(b));
    else if (b.t === 'compare') out.push(compare(b));
  }
  flushDocs();
  return out;
}

function titleHtml(run, ctx) {
  if (!run.length) return [null, null];
  const texts = run.map(h => tidy(h.text));
  const labels = texts.slice(0, -1);
  const main = texts[texts.length - 1];
  const id = nextId(ctx);
  const long = len(texts.join(' ')) > 56 ? ' band__title--long' : '';
  return [
    <h2 className={'band__title' + long} id={id}>
      {list(labels.map(t => <><span className="band__label">{t}</span>{' '}</>))}{oneLine(main)}
    </h2>,
    id,
  ];
}

function resolve(slug, item, ctx) {
  let target = item.href;
  const title = oneLine(item.title.text);
  target = FIX_LINKS[slug + '\u0000' + title] || target;
  if (target && !ctx.known(target)) target = null;   // a link to a page that does not exist
  if (!target) {                                     // match the card title to a child page
    for (const kid of CHILDREN.get(slug) || []) {
      const a = norm(title).replace(/s+$/, '');
      const b = norm(LABEL.get(kid)).replace(/s+$/, '');
      if (a && (a === b || a.startsWith(b) || b.startsWith(a))) target = kid;
    }
  }
  return target;
}

function tiles(slug, items, kind, hl, ctx) {
  const H = 'h' + hl;
  return (
    <ul className={`tiles tiles--${kind}`}>
      {items.map((it, k) => {
        const t = tidy(it.title.text);
        const target = resolve(slug, it, ctx);
        const media = it.media.length ? it.media[0] : null;
        const icon = it.title.icon || (media && isIcon(media.src) ? media.src : null);
        const body = prose(it.body, ctx, hl + 1);
        return (
          <li className={target ? 'tile tile--link' : 'tile'} key={k}>
            {icon
              ? <Img path={icon} className="tile__icon" />
              : media && (
                <figure className={isCutout(media.src) ? 'tile__media tile__media--cutout' : 'tile__media'}>
                  <Img path={media.src} sizes="(min-width: 960px) 30vw, 90vw" mobile={media.mobile} />
                </figure>
              )}
            <H className="tile__title">{target ? <a href={href(target)}>{t}</a> : t}</H>
            {body.length > 0 && <div className="tile__body">{list(body)}</div>}
          </li>
        );
      })}
    </ul>
  );
}

function gridKind(items) {
  const hasIcon = it => it.title.icon || (it.media.length && isIcon(it.media[0].src));
  if (items.every(hasIcon)) return 'icons';
  if (items.filter(it => it.media.length).length >= items.length / 2) {
    const big = items.some(it => it.media.length && image(it.media[0].src).w >= 900);
    return big ? 'photos' : 'cards';
  }
  return 'text';
}

function iconTone(items) {
  const tones = items.map(it => image(it.title.icon || it.media[0].src).tone);
  return Math.min(...tones) >= 0.55 ? 'light' : 'dark';
}

function mediaHtml(blocks) {
  return list(blocks.map(b => (b.t === 'compare' ? compare(b) : figure(b, '(min-width: 960px) 40vw, 100vw'))));
}

const FIGURE = /^[\p{Nd}.,~+%<>≥≤-]+\s?[%A-Za-z]{0,3}\n?$/u;
const isStats = blocks => blocks.length >= 4 && blocks.length % 2 === 0 && blocks.every(isHeading)
  && blocks.every((b, j) => j % 2 || FIGURE.test(b.text));

function statsBand(blocks) {
  const cells = [];
  for (let j = 0; j < blocks.length; j += 2) {
    cells.push(<div className="figures__cell"><dt>{tidy(blocks[j + 1].text)}</dt><dd><span className="figures__num">{blocks[j].text}</span></dd></div>);
  }
  return (
    <div className="band band--stats">
      <div className="wrap"><dl className="figures">{list(cells)}</dl></div>
    </div>
  );
}

/** One old section as a band: title on the left, text on the right; tiles and big images full width. */
export function band(slug, blocks, ctx) {
  if (isStats(blocks)) return statsBand(blocks);
  const { run, intro, items, tail } = layout(blocks);
  const [h, hid] = titleHtml(run, ctx);
  const kind = items.length ? gridKind(items) : null;
  const srcs = [
    ...intro.concat(tail).filter(b => b.t === 'img').map(b => b.src),
    ...items.flatMap(it => it.media.map(m => m.src)),
    ...items.flatMap(it => it.body.filter(b => b.t === 'img').map(b => b.src)),
  ];
  const ink = (kind === 'icons' && iconTone(items) === 'light') || srcs.some(s => DARK_GROUND.has(s));
  const cls = ['band', ...(ink ? ['on-ink'] : []), ...(h ? [] : ['band--untitled'])].join(' ');
  const parts = [];
  if (h) parts.push(h);
  const isMedia = b => b.t === 'img' || b.t === 'compare';
  const introText = intro.filter(b => !isMedia(b));
  let aside = [];
  let wide = [];
  for (const b of [...intro.filter(isMedia), ...tail]) {
    if (b.t === 'img') {
      const info = image(b.src);
      const modest = info.w <= 1100 && info.w / info.h <= 1.7 && !items.length;
      (modest && !aside.length ? aside : wide).push(b);
    } else wide.push(b);
  }
  if (aside.length && !introText.length && !items.length) { wide = [...aside, ...wide]; aside = []; }  // an image on its own: give it the room
  if (introText.length) parts.push(<div className="band__body prose">{list(prose(introText, ctx))}</div>);
  if (aside.length) parts.push(<div className="band__aside">{mediaHtml(aside)}</div>);
  if (items.length) parts.push(<div className="band__wide">{tiles(slug, items, kind, h ? 3 : 2, ctx)}</div>);
  if (wide.length) {
    const n = wide.filter(b => b.t === 'img').length;
    parts.push(<div className={`band__wide band__gallery band__gallery--${Math.min(n, 3)}`}>{mediaHtml(wide)}</div>);
  }
  if (!parts.length) return null;
  const Tag = hid ? 'section' : 'div';
  return <Tag className={cls} aria-labelledby={hid || undefined}><div className="wrap band__grid">{list(parts)}</div></Tag>;
}

/** The other pages of the page's group */
export function siblings(slug) {
  const parent = PARENT.get(slug);
  if (!parent || parent === 'blog' || (CHILDREN.get(parent) || []).length < 2) return null;
  return (
    <nav className="band band--siblings" aria-labelledby="siblings-title">
      <div className="wrap band__grid">
        <h2 className="band__title" id="siblings-title"><a href={href(parent)}>{LABEL.get(parent)}</a></h2>
        <ul className="siblings">
          {CHILDREN.get(parent).map(k => <li key={k}><a href={href(k)} aria-current={k === slug ? 'page' : undefined}>{LABEL.get(k)}</a></li>)}
        </ul>
      </div>
    </nav>
  );
}

/** "Contact us": scrolls to the form and fills in the subject (and the product, on product pages) */
export function contactButton(slug, title) {
  if (inProducts(slug)) {
    return <a className="btn btn--primary" href="#contact" data-interest="Product enquiry" data-note={`Product: ${oneLine(title)}`}>Contact us <Icon name="arrow" /></a>;
  }
  return <a className="btn btn--primary" href="#contact" data-interest={INTEREST[slug] || 'Other'}>Contact us <Icon name="arrow" /></a>;
}

export { HEADINGS };
