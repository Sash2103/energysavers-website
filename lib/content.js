// The old site's words, saved as JSON by tools/scrape-pages.py, read at build time.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT = join(process.cwd(), 'content');
const cache = new Map();

function readJson(path) {
  if (!cache.has(path)) cache.set(path, JSON.parse(readFileSync(path, 'utf8')));
  return cache.get(path);
}

export const loadPage = slug => readJson(join(CONTENT, 'pages', slug + '.json'));

let posts;
/** Every blog post, newest first (date, then slug, descending). */
export function loadPosts() {
  if (!posts) {
    posts = readdirSync(join(CONTENT, 'posts')).filter(f => f.endsWith('.json'))
      .map(f => readJson(join(CONTENT, 'posts', f)))
      .sort((a, b) => (a.date === b.date ? (a.slug < b.slug ? 1 : a.slug > b.slug ? -1 : 0) : a.date < b.date ? 1 : -1));
  }
  return posts;
}

const MONTHS = 'January February March April May June July August September October November December'.split(' ');
export function fmtDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
