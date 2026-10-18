// Building blocks of the inner pages, ported from tools/build-pages.py. These are plain functions
// (not components) because a page numbers its section titles in order (ctx.ids).
// ctx: { slug, ids: { n }, known(slug) } — known() tells whether a page exists to link to.
import { Fragment } from 'react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Icon from '@/components/shared/Icon';
import FilmPlayer from '@/components/behaviour/FilmPlayer';
import { Img, image, isIcon, isCutout } from '@/lib/images';
import { layout, normalize } from '@/lib/blocks';
import { loadPage } from '@/lib/content';
import { LABEL, PARENT, CHILDREN, FIX_LINKS, DARK_GROUND, INTEREST, UPLOADS, HEAD_IMAGE, href, inProducts } from '@/lib/site';
import { HEADINGS, flat, isHeading, lvl, len, norm, oneLine, opening, textOf, tidy } from '@/lib/text';

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

/** A picture made on white or on a transparent ground stands on a light plate. Photos don't, nor do the
 *  old site's graphics drawn for its dark sections (white labels). */
export const onPlate = src => isCutout(src) && !DARK_GROUND.has(src);

/** All the words of a page (after the corrections in lib/site.js OVERRIDES), on one line in lower case */
const TEXTS = new Map();
export function pageText(slug) {
  if (!TEXTS.has(slug)) {
    let t = '';
    if (LABEL.has(slug)) {
      const blocks = loadPage(slug).sections.flatMap(s => normalize(s.blocks, slug));
      t = flat(blocks.map(b => (b.t === 'ul' ? b.items.map(textOf).join(' ') : b.text || '')).join(' '));
    }
    TEXTS.set(slug, t);
  }
  return TEXTS.get(slug);
}

/** The picture a page opens with: the first one in its first section (or the one in HEAD_IMAGE) */
export function headImage(slug) {
  if (HEAD_IMAGE[slug]) return { t: 'img', src: HEAD_IMAGE[slug] };
  if (!LABEL.has(slug)) return null;
  const first = normalize(loadPage(slug).sections[0].blocks, slug);
  return first.find(b => b.t === 'img' && !isIcon(b.src)) || null;
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

const VIDEO = join(process.cwd(), 'public', 'assets', 'video');
/** A page head's film (tools/build-head-films.sh), blurred when it was made, with its first frame as
 *  the still. Until a section's film is made, the hero's stands in. */
function Film({ stem }) {
  const s = existsSync(join(VIDEO, `${stem}-960x540.av1.mp4`)) ? stem : 'hero-plant-room';
  return (
    <>
      <picture>
        <source type="image/avif" srcSet={`/assets/img/${s}-960.avif`} />
        <img className="page-head__still" src={`/assets/img/${s}-960.webp`} width="960" height="540" alt="" fetchPriority="high" />
      </picture>
      <video className="page-head__video" muted loop playsInline preload="none" disablePictureInPicture disableRemotePlayback tabIndex={-1}>
        <source type='video/mp4; codecs="av01.0.04M.10"' src={`/assets/video/${s}-960x540.av1.mp4`} />
        <source type='video/mp4; codecs="avc1.640028"' src={`/assets/video/${s}-960x540.h264.mp4`} />
      </video>
    </>
  );
}

/** The page head, on ink like the hero: breadcrumb, kicker, title, a short summary, the key points and
 *  the actions, over the section's film (or a photo: backdrop), with the page's picture on the right
 *  (on a light plate when it was made on white).
 *  parents: the site map's parents, plus the blog posts (which sit under Blog). */
export function PageHead({ slug, title, kicker = null, lede = null, points = null, actions = null, media = null, plate = false,
  plateWidth = null, crop = false, wide = false, film = null, backdrop = null, post = false, parents = PARENT }) {
  const side = media && !wide;
  const figCls = ['page-head__media', plate && 'page-head__media--plate plate-bg', crop && 'page-head__media--crop'].filter(Boolean).join(' ');
  // the plate leaves a margin round its picture, whatever the picture's size
  const plateStyle = plate && plateWidth ? { '--plate-w': `${Math.min(520, Math.max(320, plateWidth + 160))}px` } : undefined;
  return (
    <section className={['page-head', (film || backdrop) && 'page-head--bg', post && 'page-head--post'].filter(Boolean).join(' ')} aria-labelledby="page-title">
      {backdrop
        ? <div className="page-head__bg page-head__bg--photo" aria-hidden="true">{backdrop}</div>
        : film && <div className="page-head__bg" aria-hidden="true"><Film stem={film} /></div>}
      <div className={side ? 'wrap page-head__grid page-head__grid--media' : 'wrap page-head__grid'}>
        <div className="page-head__text">
          {crumbs(slug, parents)}
          {kicker && <p className="page-head__kicker">{kicker}</p>}
          <h1 className="page-title" id="page-title">{title}</h1>
          {lede && <div className="page-head__lede">{lede}</div>}
          {points && points.length > 0 && (
            <ul className="page-head__points" aria-label="Key points">{points.map((p, i) => <li key={i}>{p}</li>)}</ul>
          )}
          {actions && <div className="page-head__actions">{actions}</div>}
        </div>
        {side && <figure className={figCls} style={plateStyle}>{media}</figure>}
      </div>
      {media && wide && <div className="wrap"><figure className="page-head__media page-head__media--wide">{media}</figure></div>}
      {film && !backdrop && (
        <>
          {/* shown by FilmPlayer once the film can play */}
          <button className="icon-btn page-head__pause" type="button" aria-label="Pause background video" hidden>
            <Icon name="pause" className="i--pause" />
            <Icon name="play" className="i--play" />
          </button>
          <FilmPlayer section=".page-head" video=".page-head__video" button=".page-head__pause" />
        </>
      )}
    </section>
  );
}

/** The original text in full, in a closed fold under the page head */
export function Fold({ blocks, ctx }) {
  return (
    <div className="band band--fold">
      <div className="wrap">
        <details className="fold">
          <summary className="fold__summary">Full description</summary>
          <div className="fold__body prose">{list(prose(blocks, ctx))}</div>
        </details>
      </div>
    </div>
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
  if (b.icons) {
    return (
      <ul className="icon-list">
        {b.items.map((i, k) => (
          <li key={k}><span className={image(b.icons[k]).tone < .55 ? 'icon-list__icon plate-bg' : 'icon-list__icon'}><Img path={b.icons[k]} /></span>{inline(i)}</li>
        ))}
      </ul>
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
  return (
    <figure className={onPlate(b.src) ? 'fig fig--plate plate-bg' : 'fig'}>
      <Img path={b.src} alt={b.alt || ''} sizes={sizes} mobile={b.mobile} />
    </figure>
  );
}

function compare(b) {
  const side = (src, label) => (
    <figure className={onPlate(src) ? 'compare__side compare__side--plate' : 'compare__side'}>
      <div className={onPlate(src) ? 'plate-bg' : undefined}><Img path={src} sizes="(min-width: 960px) 30vw, 50vw" /></div>
      <figcaption>{label}</figcaption>
    </figure>
  );
  return <div className="compare">{side(b.before, 'Before')}{side(b.after, 'After')}</div>;
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
    else if (b.t === 'chips') out.push(<ul className="chips">{b.items.map((t, k) => <li key={k}>{tidy(t)}</li>)}</ul>);
    else if (b.t === 'img') out.push(figure(b));
    else if (b.t === 'compare') out.push(compare(b));
  }
  flushDocs();
  return out;
}

/** How much there is to read in some blocks, in characters */
export const chars = blocks => blocks.reduce((n, b) => n + (b.t === 'p' ? len(b.text) : b.t === 'ul' ? b.items.reduce((m, i) => m + len(textOf(i)), 0) : 0), 0);

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

/** A card's text. Long text shows its opening sentences (Solutions: one card read as an essay). When
 *  the page the card links to already has all of it, that is enough; otherwise the rest waits in a
 *  "Read more" fold, so nothing is lost. */
function tileBody(it, target, ctx, hl) {
  const paras = it.body.filter(b => b.t === 'p');
  if (chars(it.body) <= 300 || !paras.length || !it.body.every(b => b.t === 'p')) return prose(it.body, ctx, hl + 1);
  const first = opening(paras[0].text, 220);
  if (target && paras.every(b => pageText(target).includes(flat(b.text)))) return [<p>{first}</p>];
  const restOfFirst = oneLine(paras[0].text).slice(first.length).trim();
  const rest = [...(restOfFirst ? [{ ...paras[0], text: restOfFirst, lead: undefined }] : []), ...paras.slice(1)];
  return [
    <p>{first}</p>,
    <details className="tile__more">
      <summary>Read more</summary>
      {list(prose(rest, ctx, hl + 1))}
    </details>,
  ];
}

/** Columns on a wide screen: as few empty places in the last row as the count allows (6 cards: 3 + 3,
 *  not 4 + 2); up to four cards share one row. */
export function columns(kind, n) {
  if (n <= 4) return Math.max(n, 2);
  const empty = c => (c - (n % c)) % c;
  return (kind === 'icons' ? [4, 3] : [3, 4]).reduce((best, c) => (empty(c) < empty(best) ? c : best));
}

function tiles(slug, items, kind, hl, ctx) {
  const H = 'h' + hl;
  const withMedia = kind === 'cards' || kind === 'photos';
  // when only some cards have a picture (and no page to borrow one from), pictures go to the foot of
  // their card, so the titles still line up
  const pictured = items.filter(it => it.media.length || it.title.icon || (withMedia && resolve(slug, it, ctx) && headImage(resolve(slug, it, ctx))));
  const mixed = pictured.length && pictured.length < items.length;
  // with icons, the cards without one keep the icon's room instead
  const iconsOnly = mixed && pictured.every(it => it.title.icon || (it.media.length && isIcon(it.media[0].src)));
  return (
    <ul className={`tiles tiles--${kind} tiles--c${columns(kind, items.length)}${mixed ? (iconsOnly ? ' tiles--mixed-icons' : ' tiles--mixed') : ''}`}>
      {items.map((it, k) => {
        const t = tidy(it.title.text);
        const target = resolve(slug, it, ctx);
        // a card without a picture among cards with pictures gets the picture its page opens with
        const media = it.media.length ? it.media[0] : withMedia && target ? headImage(target) : null;
        const icon = it.title.icon || (media && isIcon(media.src) ? media.src : null);
        const body = tileBody(it, target, ctx, hl);
        // a photo too small to fill its card stands on the plate at its own size, never enlarged
        const plate = media && !icon && onPlate(media.src);
        const small = media && !icon && !plate && image(media.src).w < 340;
        const mediaCls = plate ? 'tile__media tile__media--plate plate-bg'
          : small ? 'tile__media tile__media--plate tile__media--small plate-bg' : 'tile__media tile__media--photo';
        return (
          <li className={target ? 'tile tile--link' : 'tile'} key={k}>
            {icon
              ? <span className={image(icon).tone < .55 ? 'tile__icon plate-bg' : 'tile__icon'}><Img path={icon} /></span>
              : media && (
                <figure className={mediaCls}>
                  {/* photos are cut to the card's shape, so they are asked for a little wider than the card */}
                  <Img path={media.src} sizes="(min-width: 1100px) 40vw, (min-width: 640px) 58vw, 116vw" mobile={media.mobile} />
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

/** Pictures beside the text (aside: a third of the page), or across it in a row of n (gallery) */
function mediaHtml(blocks, n = 0) {
  const sizes = n ? `(min-width: 1440px) ${Math.round(1360 / n)}px, (min-width: 720px) ${Math.round(100 / n)}vw, 100vw` : '(min-width: 960px) 34vw, 100vw';
  return list(blocks.map(b => (b.t === 'compare' ? compare(b) : figure(b, sizes))));
}

const FIGURE = /^[\p{Nd}.,~+%<>≥≤-]+\s?[%A-Za-z]{0,3}\n?$/u;
const isStats = blocks => blocks.length >= 4 && blocks.length % 2 === 0 && blocks.every(isHeading)
  && blocks.every((b, j) => j % 2 || FIGURE.test(b.text));

/** Sections that are only a heading introduce the section after them: they join its title, as its label,
 *  instead of standing alone as an empty band. Rows of figures stay as they are. */
export function joinHeadings(secs) {
  const out = [];
  let held = [];
  for (const s of secs) {
    if (s.every(isHeading) && !isStats(s)) { held = [...held, ...s]; continue; }
    out.push([...held, ...s]);
    held = [];
  }
  if (held.length) out.push(held);
  return out;
}

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

/** One old section as a band. Its shape depends on what it holds, so no column is left empty:
 *  - split: title on the left, text on the right (short text, or a picture under the title);
 *  - stacked: title above long text, which runs in two columns;
 *  - statement: a short untitled paragraph, set large across the page;
 *  - columns: longer untitled text, in two columns.
 *  Cards, big pictures and tables take the full width below. */
export function band(slug, blocks, ctx) {
  if (isStats(blocks)) return statsBand(blocks);
  const { run, intro, items, tail } = layout(blocks);
  const [h, hid] = titleHtml(run, ctx);
  const kind = items.length ? gridKind(items) : null;
  const parts = [];
  if (h) parts.push(h);
  const isMedia = b => b.t === 'img' || b.t === 'compare';
  let introText = intro.filter(b => !isMedia(b));
  // small icons that match a list item for item stand beside its items (Dust, Rain, Heat, Cold)
  const icons = [...intro, ...tail].filter(b => b.t === 'img' && isIcon(b.src));
  const iconList = icons.length > 1 ? introText.find(b => b.t === 'ul' && b.items.length === icons.length) : null;
  if (iconList) introText = introText.map(b => (b === iconList ? { ...b, icons: icons.map(i => i.src) } : b));
  let aside = [];
  let wide = [];
  for (const b of [...intro.filter(isMedia), ...tail].filter(b => !(iconList && icons.includes(b)))) {
    if (b.t === 'img') {
      const info = image(b.src);
      const modest = info.w <= 1100 && info.w / info.h <= 1.7 && !items.length;
      (modest && !aside.length ? aside : wide).push(b);
    } else wide.push(b);
  }
  if (aside.length && !introText.length && !items.length) { wide = [...aside, ...wide]; aside = []; }  // an image on its own: give it the room
  const size = chars(introText);
  const tables = introText.some(b => b.t === 'ul' && b.items.some(i => textOf(i).includes('\n')));
  let shape;
  if (h) shape = aside.length || size <= 600 || tables ? 'split' : 'stacked';
  else if (aside.length) shape = 'split';
  else shape = introText.length === 1 && introText[0].t === 'p' && size <= 320 ? 'statement' : size > 480 && !tables ? 'columns' : 'plain';
  if (introText.length) parts.push(<div className="band__body prose">{list(prose(introText, ctx))}</div>);
  if (aside.length) parts.push(<div className="band__aside">{mediaHtml(aside)}</div>);
  if (items.length) parts.push(<div className="band__wide">{tiles(slug, items, kind, h ? 3 : 2, ctx)}</div>);
  if (wide.length) {
    const n = wide.filter(b => b.t === 'img').length;
    parts.push(<div className={`band__wide band__gallery band__gallery--${Math.min(n, 3)}`}>{mediaHtml(wide, Math.max(1, Math.min(n, 3)))}</div>);
  }
  if (!parts.length) return null;
  // icon grids stand on a raised band, for a change of pace down the page
  const cls = ['band', `band--${shape}`, ...(kind === 'icons' ? ['on-ink-2'] : []), ...(h ? [] : ['band--untitled'])].join(' ');
  const Tag = hid ? 'section' : 'div';
  return <Tag className={cls} aria-labelledby={hid || undefined}><div className="wrap band__grid">{list(parts)}</div></Tag>;
}

/** The other pages of the page's group: a ruled label, then the pages in columns */
export function siblings(slug) {
  const parent = PARENT.get(slug);
  if (!parent || parent === 'blog' || (CHILDREN.get(parent) || []).length < 2) return null;
  return (
    <nav className="band band--siblings" aria-labelledby="siblings-title">
      <div className="wrap">
        <h2 className="siblings__title" id="siblings-title"><a href={href(parent)}>{LABEL.get(parent)}</a></h2>
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
