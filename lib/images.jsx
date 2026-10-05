// Images on the inner pages, at build time.
// - Old-site images: measured by tools/build-images.py into content/images.json, WebP files in public/assets/img/up/.
// - Homepage images (public/assets/img/<name>-<width>.webp), reused on the sector and About pages.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pyRound } from './text';

const PUBLIC = join(process.cwd(), 'public');
let IMAGES;

/** Size, WebP files, transparency, white corners and tone of an old-site image (path as on the old site). */
export function image(path) {
  if (!IMAGES) IMAGES = JSON.parse(readFileSync(join(process.cwd(), 'content', 'images.json'), 'utf8'));
  const info = IMAGES[path];
  if (!info) throw new Error(`content/images.json has no entry for ${path}. Run: python3 tools/build-images.py`);
  for (const f of [...info.files.map(([, f]) => f), ...(info.still ? [info.still] : [])]) {
    if (!existsSync(join(PUBLIC, f))) throw new Error(`public/${f} is missing (${path}). Run: python3 tools/build-images.py --encode ${path}`);
  }
  return info;
}

export const isIcon = path => image(path).w <= 160;
/** A product shot on a transparent or white ground (not a photo). */
export const isCutout = path => { const i = image(path); return i.alpha || i.white_corners; };

/** An old-site image: srcset from its WebP files, a still frame for reduced motion, a phone version. */
export function Img({ path, alt = '', sizes = '(min-width: 960px) 50vw, 100vw', className = '', mobile = null, eager = false }) {
  const info = image(path);
  const files = info.files;
  const [w] = files[files.length - 1];
  const h = pyRound(info.h * w / info.w);
  const many = files.length > 1;
  const tag = (
    <img className={className || undefined} src={'/' + files[0][1]}
      srcSet={many ? files.map(([fw, r]) => `/${r} ${fw}w`).join(', ') : undefined} sizes={many ? sizes : undefined}
      width={w} height={h} alt={alt} loading={eager ? undefined : 'lazy'} decoding="async" />
  );
  const sources = [];
  if (info.still) sources.push(<source media="(prefers-reduced-motion: reduce)" srcSet={'/' + info.still} key="still" />);
  if (mobile) {
    const m = image(mobile);
    const [mw, mrel] = m.files[m.files.length - 1];
    sources.push(<source media="(max-width: 719px)" srcSet={'/' + mrel} width={mw} height={pyRound(m.h * mw / m.w)} key="mobile" />);
  }
  return sources.length ? <picture>{sources}{tag}</picture> : tag;
}

/** Width and height of a WebP file, read from its header. */
function webpSize(file) {
  const b = readFileSync(file);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  throw new Error('not a WebP file: ' + file);
}

/** One of the homepage's own images (public/assets/img/<name>-<width>.webp), in all its widths. */
export function HomeImg({ name, alt = '', sizes = '100vw', className = '', eager = false }) {
  const dir = join(PUBLIC, 'assets', 'img');
  const re = new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)\\.webp$');
  const found = readdirSync(dir).map(f => [f.match(re), f]).filter(([m]) => m).map(([m, f]) => [Number(m[1]), f])
    .sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1));
  if (!found.length) throw new Error('missing homepage image: ' + name);
  const [w, f] = found[found.length - 1];
  const [, height] = webpSize(join(dir, f));
  const fallback = (found.find(([w2]) => w2 >= 960) || found[found.length - 1])[1];
  return (
    <img className={className || undefined} src={`/assets/img/${fallback}`} srcSet={found.map(([w2, f2]) => `/assets/img/${f2} ${w2}w`).join(', ')}
      sizes={sizes} width={w} height={height} alt={alt} loading={eager ? undefined : 'lazy'} decoding="async" />
  );
}
