// The five services. On the homepage they are a rail of cards (swipe, arrows, drag); on the Services
// page the same cards sit in a grid, with page-level headings.
const HOME_SIZES = '(min-width: 960px) 420px, 84vw';
const PAGE_SIZES = '(min-width: 1100px) 400px, (min-width: 640px) 45vw, 90vw';

export default function ServiceCards({ page = false }) {
  const Name = page ? 'h2' : 'h3';
  const sizes = page ? PAGE_SIZES : HOME_SIZES;
  const items = (
    <>
      <li className="svc">
        <figure className="svc__media svc__media--photo"><img src="/assets/img/field-pq-install-2-691.webp" srcSet="/assets/img/field-pq-install-2-480.webp 480w, /assets/img/field-pq-install-2-691.webp 691w" sizes={sizes} width="691" height="574" alt="Two power quality analysers logging at an open switchboard during an audit" loading="lazy" decoding="async" /></figure>
        <div className="svc__body">
          <p className="svc__num" aria-hidden="true">01</p>
          <Name className="svc__name"><a href="/energy-audit/">Energy Audit</a></Name>
          <p className="svc__text">An energy audit is an inspection and analysis of energy use and flows for energy conservation in a building, process or system to reduce the amount of energy input into the system without negatively affecting the output.</p>
        </div>
      </li>
      <li className="svc">
        <figure className="svc__media svc__media--photo"><img src="/assets/img/field-analyser-screen-830.webp" srcSet="/assets/img/field-analyser-screen-480.webp 480w, /assets/img/field-analyser-screen-830.webp 830w" sizes={sizes} width="830" height="622" alt="Power quality analyser screen showing live readings during a measurement" loading="lazy" decoding="async" /></figure>
        <div className="svc__body">
          <p className="svc__num" aria-hidden="true">02</p>
          <Name className="svc__name"><a href="/pq-audit-and-measurement/">PQ Audit and Measurement</a></Name>
          <p className="svc__text">PQ Audit and Measurement is a process of measuring and evaluating the performance of an electrical system. It is used to identify potential problems, make recommendations for improvement, and monitor performance over time.</p>
        </div>
      </li>
      <li className="svc">
        <figure className="svc__media svc__media--doc"><img src="/assets/img/report-thd-624.webp" width="624" height="340" alt="Report excerpt: total harmonic distortion in voltage recorded over the measurement period" loading="lazy" decoding="async" /></figure>
        <div className="svc__body">
          <p className="svc__num" aria-hidden="true">03</p>
          <Name className="svc__name"><a href="/harmonic-studies/">Harmonic Studies</a></Name>
          <p className="svc__text">Harmonic studies in power quality involve the analysis of the harmonic content of a power system. This involves the measurement of the voltage, current, and other power system parameters to determine the harmonic content, and to identify and quantify any harmonic distortion.</p>
        </div>
      </li>
      <li className="svc">
        <figure className="svc__media svc__media--doc"><img src="/assets/img/report-spectrum-624.webp" width="624" height="374" alt="Report excerpt: harmonic spectrum of the current, by harmonic order" loading="lazy" decoding="async" /></figure>
        <div className="svc__body">
          <p className="svc__num" aria-hidden="true">04</p>
          <Name className="svc__name"><a href="/harmonic-simulation-studies/">Harmonic Simulation Studies</a></Name>
          <p className="svc__text">Harmonic simulation studies in power quality involve the use of computer simulation to analyze the impact of harmonics on power systems.</p>
        </div>
      </li>
      <li className="svc">
        <figure className="svc__media svc__media--product"><img src="/assets/img/pq-rental-kit-900.webp" srcSet="/assets/img/pq-rental-kit-480.webp 480w, /assets/img/pq-rental-kit-900.webp 900w" sizes={sizes} width="900" height="656" alt="PQ-Box power quality analyser kit in its carry case" loading="lazy" decoding="async" /></figure>
        <div className="svc__body">
          <p className="svc__num" aria-hidden="true">05</p>
          <Name className="svc__name"><a href="/pq-equipment-rental/">PQ Equipment Rental</a></Name>
          {/* Replaces the old text (which described renting backhoes and forklifts) with their own PQ analyser wording. TODO(owner): supply rental-specific text if wanted. */}
          <p className="svc__text">Power Quality Mobile Analyzer is a handheld device used to analyze the power quality of an electrical system. It measures and records voltage, current, frequency, power factor, harmonics, and other power quality parameters.</p>
          <p className="svc__models">PQ-Box 50 · PQ-Box 150 · PQ-Box 200 · PQ-Box 300</p>
        </div>
      </li>
    </>
  );
  return page
    ? <ol className="svc-grid">{items}</ol>
    : <ol className="rail services__rail" id="services-rail" aria-label="Services">{items}</ol>;
}
