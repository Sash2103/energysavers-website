import Stats from './Stats';
import CaseStudies from './CaseStudies';

// Proof straight after the hero: the figures, then the case studies.
export default function Proof() {
  return (
    <section className="proof" id="case-studies" aria-labelledby="cases-title">
      <div className="wrap">
        <Stats />
        <CaseStudies />
      </div>
    </section>
  );
}
