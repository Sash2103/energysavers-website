import { SECTORS, SECTORS_INTRO } from '@/data/sectors';
import Icon from '@/components/shared/Icon';
import SectorFrames from '@/components/behaviour/SectorFrames';
import Pic from '@/lib/pic';

// The panel is the full screen height and holds 4:5 crops, so a crop is height-bound (about 80vh wide)
// unless the screen is wider than 20:11, when the panel's width (about 44vw) decides. Below 1100px the
// panel is hidden, and its lazy images never load.
const FRAME_SIZES = '(min-width: 1100px) and (min-aspect-ratio: 20/11) 44vw, (min-width: 1100px) 80vh, 1px';
const pad = n => String(n).padStart(2, '0');

// Sectors. Desktop: the list on the left; on the right a full-height photo panel, which changes to the
// sector in the middle of the screen (or under the pointer) and carries a title block naming it.
// Phones and tablets: each sector has its own photo above it.
export default function Sectors() {
  return (
    <section className="sectors on-ink" id="sectors" aria-labelledby="sectors-title">
      <div className="sectors__grid">
        <div className="sectors__text">
          <div className="sectors__intro">
            <h2 className="section-title" id="sectors-title">Our sectors</h2>
            <p>{SECTORS_INTRO}</p>
          </div>
          <ol className="sector-list">
            {SECTORS.map((s, i) => (
              <li className="sector" data-sector={s.key} data-index={pad(i + 1)} key={s.key}>
                <Pic className="sector__photo" src={s.photo.src} srcSet={s.photo.srcSet} sizes={s.photo.sizes}
                  width={s.photo.width} height={s.photo.height} alt={s.photo.alt} loading="lazy" decoding="async" />
                <h3 className="sector__name">{s.name}</h3>
                <p className="sector__areas">{s.areas}</p>
                <div className="sector__cols">
                  <div className="sector__challenges">
                    <h4>Challenges</h4>
                    <ul>
                      {s.challenges.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                  <div className="sector__solution">
                    <h4>Solutions</h4>
                    <p>{s.solution}</p>
                  </div>
                </div>
                {s.cases.length > 0 && (
                  <p className="sector__cases"><span>Case studies</span>
                    {s.cases.map(([key, label]) => (
                      <button type="button" data-case={key} key={key}>{label}<Icon name="arrow" /></button>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div className="sectors__frame" aria-hidden="true">
          {SECTORS.map((s, i) => (
            <Pic className={i === 0 ? 'sectors__frame-img is-active' : 'sectors__frame-img'} data-sector={s.key} key={s.key}
              src={s.frame.src} srcSet={s.frame.srcSet} sizes={FRAME_SIZES} width={s.frame.width} height={s.frame.height}
              alt="" loading="lazy" decoding="async" />
          ))}
          {/* a drawing's title block: which sector the photo shows */}
          <div className="plate">
            <p className="plate__row">
              <span className="plate__label">Sector</span>
              <span className="plate__count"><b data-plate-num="">01</b> / {pad(SECTORS.length)}</span>
            </p>
            <p className="plate__name" data-plate-name="">{SECTORS[0].name}</p>
            <ol className="plate__steps">
              {SECTORS.map((s, i) => <li className={i === 0 ? 'is-active' : undefined} data-sector={s.key} key={s.key} />)}
            </ol>
          </div>
        </div>
      </div>
      <SectorFrames />
    </section>
  );
}
