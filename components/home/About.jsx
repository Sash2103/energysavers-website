import { ABOUT_LEDE, CLIENTS, Certs } from '@/components/shared/About';
import TypedText from '@/components/behaviour/TypedText';

// About: the statement types itself out once it is in view (components/behaviour/TypedText.jsx). It is
// in the page whole, for screen readers, search engines and visitors without script or with reduced
// motion. The suppliers are named in Key highlights; the About page has both lists.
// On desktop "About us" and "Our certifications" share one ruled header row; the clients run below as
// one block of names.
// The typed copy keeps "on-shore" on one line: a word joiner after the hyphen (invisible, no glyph needed).
const TYPED = ABOUT_LEDE.replace('on-shore', 'on-⁠shore');

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <h2 className="about__label about__title" id="about-title">About us</h2>
        <p className="about__lede">
          <span className="vh">{ABOUT_LEDE}</span>
          <span className="typed" data-typed="" aria-hidden="true">
            <span className="typed__done">{TYPED}</span><span className="typed__caret" /><span className="typed__rest" />
          </span>
        </p>
        <div className="about__certs">
          <h3 className="about__label">Our certifications</h3>
          <Certs />
        </div>
        <div className="about__clients">
          <h3 className="about__label">Our clients</h3>
          <ul className="clients">
            {CLIENTS.map(n => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </div>
      <TypedText />
    </section>
  );
}
