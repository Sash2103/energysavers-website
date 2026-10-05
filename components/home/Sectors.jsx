import { SECTORS, SECTORS_INTRO } from '@/data/sectors';
import SectorFrames from '@/components/behaviour/SectorFrames';

const Photo = ({ p, className }) => (
  <img className={className} src={p.src} srcSet={p.srcSet} sizes={p.sizes} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
);

// Sectors: on desktop a sticky photo follows the list; on phones each sector has its own photo.
export default function Sectors() {
  return (
    <section className="sectors on-ink" id="sectors" aria-labelledby="sectors-title">
      <div className="wrap sectors__grid">
        <div className="sectors__intro">
          <h2 className="section-title" id="sectors-title">Our sectors</h2>
          <p>{SECTORS_INTRO}</p>
        </div>
        <div className="sectors__frame" aria-hidden="true">
          {SECTORS.map((s, i) => (
            <img className={i === 0 ? 'sectors__frame-img is-active' : 'sectors__frame-img'} data-sector={s.key} key={s.key}
              src={s.frame.src} srcSet={s.frame.srcSet} sizes={s.frame.sizes} width={s.frame.width} height={s.frame.height} alt="" loading="lazy" decoding="async" />
          ))}
        </div>
        <ol className="sector-list">
          {SECTORS.map(s => (
            <li className="sector" data-sector={s.key} key={s.key}>
              <Photo p={s.photo} className="sector__photo" />
              <h3 className="sector__name">{s.name}</h3>
              <p className="sector__areas">{s.areas}</p>
              <div className="sector__cols">
                <div>
                  <h4>Challenges</h4>
                  <ul>
                    {s.challenges.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
                <div>
                  <h4>Solutions</h4>
                  <p>{s.solution}</p>
                </div>
              </div>
              {s.cases.length > 0 && (
                <p className="sector__cases"><span>Case studies</span>
                  {s.cases.map(([key, label]) => <button type="button" data-case={key} key={key}>{label}</button>)}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
      <SectorFrames />
    </section>
  );
}
