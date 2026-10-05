// Reading the old site's sections (content/*.json): clean them up and split them into a title, intro
// text, repeated items and trailing images. Ported from tools/build-pages.py; the words are not changed.
import { OVERRIDES } from './site';
import { isHeading, lvl, norm, strip, textOf, len } from './text';
import { isIcon } from './images';

const JUNK = /^(×|\+|-|sample title|sample description|description|content missing|get it on google play download on the app store|download data ?sheet|view more)$/i;
const MOBILE = /(-m-\d|mobile)/i;
const WS = '[\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000]';
const ACCORDION = new RegExp(`^\\+${WS}*-${WS}*(.+)$`, 's');          // "+ - Title": an accordion title on the old page
const COLON = new RegExp(`^([^:.\\n]{3,60}):${WS}+(.+)$`, 's');        // "Lead: text"

const isJunk = t => JUNK.test(strip(t));

/** Clean one old section: drop UI leftovers, merge tab labels into their panels, pair phone images. */
export function normalize(blocks, slug) {
  const out = [];
  const last = () => out[out.length - 1];
  for (let b of blocks) {
    b = { ...b };
    if (b.t === 'p' || isHeading(b)) {
      for (const [old, rep] of (OVERRIDES[slug] && OVERRIDES[slug].replace) || []) {
        b.text = typeof old === 'string' ? b.text.split(old).join(rep) : b.text.replace(old, rep);
      }
      if (!strip(b.text) || isJunk(b.text)) continue;
      const m = b.text.match(ACCORDION);
      if (m && b.t === 'p') b = { t: 'h4', text: m[1] };
    }
    if (b.t === 'ul') {
      b.items = b.items.filter(i => !isJunk(textOf(i)));
      if (!b.items.length) continue;
    }
    if (b.t === 'img' && out.length && last().t === 'img' && MOBILE.test(b.src) && !MOBILE.test(last().src)) {
      last().mobile = b.src;                      // the phone version of the image before it
      continue;
    }
    const colon = b.t === 'p' ? (b.text || '').match(COLON) : null;
    if (b.t === 'p' && (b.lead || colon) && out.length && last().t === 'img' && isIcon(last().src)) {
      const lead = b.lead || colon[1];
      const rest = Array.from(b.text).slice(len(lead)).join('').replace(/^[ :–-]+/, '');
      out.push({ t: 'h4', text: lead });
      if (rest) out.push({ t: 'p', text: rest });
      continue;
    }
    if (b.t === 'img' && out.length && last().t === 'img' && b.alt === 'After image' && last().alt === 'Before image') {
      out[out.length - 1] = { t: 'compare', before: last().src, after: b.src };
      continue;
    }
    out.push(b);
  }
  // tabs: a row of labels (often with icons) followed by panels that repeat each label
  const seen = new Map();
  out.forEach((b, i) => {
    if (!isHeading(b)) return;
    const k = norm(b.text);
    if (!seen.has(k)) seen.set(k, []);
    seen.get(k).push(i);
  });
  const drop = new Set();
  for (const idx of seen.values()) {
    if (idx.length !== 2) continue;
    const [first, second] = idx;
    const nxt = first + 1 < out.length ? out[first + 1] : null;
    const labelOnly = nxt === null || isHeading(nxt) || (nxt.t === 'img' && isIcon(nxt.src));
    if (!labelOnly) continue;                     // the same heading twice, each with its own text
    if (first > 0 && out[first - 1].t === 'img' && isIcon(out[first - 1].src)) {
      out[second] = { ...out[second], icon: out[first - 1].src };
      drop.add(first - 1);
    }
    drop.add(first);
  }
  return out.filter((b, i) => !drop.has(i));
}

/** Split a section into its heading run, the text before any item, the items, and trailing images. */
export function layout(blocks) {
  let i = 0;
  while (i < blocks.length && isHeading(blocks[i])) i++;
  let run = blocks.slice(0, i);
  let rest = blocks.slice(i);
  const later = new Set(rest.filter(isHeading).map(lvl));
  if (run.length && later.has(lvl(run[run.length - 1]))) {   // the last heading opens the first item
    run = run.slice(0, -1);
    rest = blocks.slice(i - 1);
  }
  let intro = [];
  let items = [];
  let cur = null;
  let lead = null;
  const loose = [];
  const into = () => (cur ? cur.body : intro);
  rest.forEach((b, k) => {
    const nxt = k + 1 < rest.length ? rest[k + 1] : null;
    if (b.t === 'img' && nxt !== null && isHeading(nxt) && !isIcon(b.src)
      && items.some(it => it.media.length && isIcon(it.media[0].src))) {
      loose.push(b);
      return;
    }
    if (isHeading(b)) {
      cur = { title: b, media: lead ? [lead] : [], body: [], href: b.href || (lead || {}).href || null };
      lead = null;
      items.push(cur);
    } else if (b.t === 'img' && nxt !== null && isHeading(nxt)) {
      if (lead) into().push(lead);
      lead = b;
    } else if (b.t === 'link') {
      if (cur !== null && !cur.href) cur.href = b.href;
    } else {
      into().push(b);
    }
  });
  if (lead) into().push(lead);
  const tail = loose;
  if (items.length >= 2 && !items.slice(0, -1).some(it => it.body.some(x => x.t === 'img'))) {
    const last = items[items.length - 1].body;
    while (last.length && ['img', 'compare'].includes(last[last.length - 1].t)) tail.unshift(last.pop());
  }
  if (items.length === 1) {                        // a single sub-heading is just part of the text
    const it = items[0];
    if (!run.length) {
      run = [it.title];
      intro = [...intro, ...it.media, ...it.body];
    } else {
      intro = [...intro, it.title, ...it.media, ...it.body];
    }
    items = [];
  }
  return { run, intro, items, tail };
}
