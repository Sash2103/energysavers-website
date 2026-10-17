// Images with their AVIF copies (tools/build-avif.py): the same picture as the WebP file, about a third
// smaller, for the browsers that read AVIF. Server components only: it checks the files when the site
// is built.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');

/** The AVIF version of a WebP src or srcset, or null unless every file in it has an AVIF copy. */
export function avifOf(set) {
  if (!set) return null;
  const urls = set.split(',').map(part => part.trim().split(/\s+/)[0]);
  const all = urls.every(u => u.endsWith('.webp') && existsSync(join(PUBLIC, u.slice(0, -5) + '.avif')));
  return all ? set.replace(/\.webp(?=\s|,|$)/g, '.avif') : null;
}

/** An <img>, inside a <picture> with an AVIF source when its AVIF copies exist. The <picture> is
 *  display: contents, so the layout is the same as for the bare <img>. */
export default function Pic(props) {
  const avif = avifOf(props.srcSet || props.src);
  const img = <img {...props} />;
  if (!avif) return img;
  return (
    <picture className="pic">
      <source type="image/avif" srcSet={avif} sizes={props.srcSet ? props.sizes : undefined} />
      {img}
    </picture>
  );
}
