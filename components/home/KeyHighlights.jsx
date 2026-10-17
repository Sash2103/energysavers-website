import { HIGHLIGHTS, SUPPLIERS } from '@/components/shared/About';
import Pic from '@/lib/pic';

const SIZES = '(min-width: 1100px) 320px, (min-width: 560px) 46vw, 38vw';

// Straight after the hero: the company's key highlights, three with their own site photos, and the
// brands it represents, named.
const PHOTOS = [
  { src: '/assets/img/highlight-adsorption-chiller-800.webp',
    srcSet: '/assets/img/highlight-adsorption-chiller-480.webp 480w, /assets/img/highlight-adsorption-chiller-800.webp 800w',
    width: 800, height: 485, alt: 'The adsorption chiller plant Energy Savers commissioned for Jumeirah Group at Mina A’Salam' },
  { src: '/assets/img/field-pq-install-2-691.webp',
    srcSet: '/assets/img/field-pq-install-2-480.webp 480w, /assets/img/field-pq-install-2-691.webp 691w',
    width: 691, height: 574, alt: 'Power quality analysers connected at an open switchboard on site' },
  { src: '/assets/img/field-plant-room-960.webp',
    srcSet: '/assets/img/field-plant-room-480.webp 480w, /assets/img/field-plant-room-960.webp 960w, /assets/img/field-plant-room-1306.webp 1306w',
    width: 1306, height: 854, alt: 'Plant room with chilled water pumps and pipework' },
];

export default function KeyHighlights() {
  return (
    <section className="keys" aria-labelledby="keys-title">
      <div className="wrap">
        <h2 className="section-title" id="keys-title">Key highlights</h2>
        <ul className="keys__list">
          {PHOTOS.map((p, i) => (
            <li className="key" key={p.src}>
              <figure className="key__media">
                <Pic src={p.src} srcSet={p.srcSet} sizes={SIZES} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
              </figure>
              <p className="key__text">{HIGHLIGHTS[i]}</p>
            </li>
          ))}
          {/* the sentence comes first for screen readers; the panel of names is drawn above it */}
          <li className="key key--brands">
            <p className="key__text">{HIGHLIGHTS[3]}</p>
            <ul className="key__media key__brands">
              {SUPPLIERS.map(n => <li key={n}>{n}</li>)}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
}
