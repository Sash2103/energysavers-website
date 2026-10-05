import { Fragment } from 'react';
import Workplan from './Workplan';

/** Scope lines, separated by line breaks as on the old site. */
export function Scope({ lines }) {
  return lines.map((l, i) => <Fragment key={i}>{i > 0 && <>{' '}<br /></>}{l}</Fragment>);
}

/** A case photo. sizes overrides the homepage's sizes where the photo has several widths. */
export function CasePhoto({ photo, sizes, lazy = true }) {
  return (
    <img src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? (sizes || photo.sizes) : undefined}
      width={photo.width} height={photo.height} alt={photo.alt} loading={lazy ? 'lazy' : undefined} decoding="async" />
  );
}

/** A case write-up as on the homepage (and copied into the case sheet when opened from the register). */
export default function CaseArticle({ c }) {
  return (
    <article className="case" id={`case-${c.key}`}>
      <figure className="case__photo"><CasePhoto photo={c.photo} /></figure>
      <div className="case__body">
        <header className="case__head">
          <h3 className="case__client">{c.client}</h3>
          <p className="case__where">{c.place} <span>{c.year}</span></p>
        </header>
        <p className="case__scope"><Scope lines={c.scope} /></p>
        <div className="case__findings">
          {c.findings.map(f => (
            <Fragment key={f.title}>
              <h4>{f.title}</h4>
              <ul>
                {f.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </Fragment>
          ))}
        </div>
      </div>
      <Workplan {...c.workplan} />
    </article>
  );
}
