import Icon from '@/components/shared/Icon';

// The four solutions, as photo tiles that link to their pages.
export default function Solutions() {
  return (
    <div className="wrap">
      <h2 className="section-title" id="solutions-title">Energy efficient building solutions</h2>
      <ol className="solutions">
        <li className="solution">
          <figure className="solution__media"><img src="/assets/img/field-panel-analyser-960.webp" srcSet="/assets/img/field-panel-analyser-480.webp 480w, /assets/img/field-panel-analyser-960.webp 960w, /assets/img/field-panel-analyser-1203.webp 1203w" sizes="(min-width: 1100px) 330px, (min-width: 720px) 46vw, 120px" width="1203" height="902" alt="A power quality analyser connected inside an open electrical panel during an audit" loading="lazy" decoding="async" /></figure>
          <div className="solution__body">
            <p className="solution__num" aria-hidden="true">01</p>
            <h3 className="solution__name"><a href="/energy-audit/">Energy Audit<Icon name="arrow" /></a></h3>
            <p className="solution__text">Audit is a stepping stone to implement any cost saving measures.</p>
          </div>
        </li>
        <li className="solution">
          <figure className="solution__media"><img src="/assets/img/field-pq-install-1-632.webp" srcSet="/assets/img/field-pq-install-1-480.webp 480w, /assets/img/field-pq-install-1-632.webp 632w" sizes="(min-width: 1100px) 330px, (min-width: 720px) 46vw, 120px" width="632" height="463" alt="Power quality equipment connected in an electrical panel on site" loading="lazy" decoding="async" /></figure>
          <div className="solution__body">
            <p className="solution__num" aria-hidden="true">02</p>
            <h3 className="solution__name"><a href="/power-quality-solutions/">Power Quality Solutions<Icon name="arrow" /></a></h3>
            <p className="solution__text">Active harmonic filters (AHF), power factor correctors (SVG) and voltage optimization (DVR) comprise our solutions.</p>
          </div>
        </li>
        <li className="solution">
          <figure className="solution__media"><img src="/assets/img/field-plant-room-960.webp" srcSet="/assets/img/field-plant-room-480.webp 480w, /assets/img/field-plant-room-960.webp 960w, /assets/img/field-plant-room-1306.webp 1306w" sizes="(min-width: 1100px) 330px, (min-width: 720px) 46vw, 120px" width="1306" height="854" alt="Plant room with chilled water pumps and pipework" loading="lazy" decoding="async" /></figure>
          <div className="solution__body">
            <p className="solution__num" aria-hidden="true">03</p>
            <h3 className="solution__name"><a href="/hvac-optimization/">HVAC Optimisation<Icon name="arrow" /></a></h3>
            <p className="solution__text">We are specialized in water-sourced heat pumps and adsorption (solar thermal chillers).</p>
          </div>
        </li>
        <li className="solution">
          <figure className="solution__media"><img src="/assets/img/solution-automation-960.webp" srcSet="/assets/img/solution-automation-480.webp 480w, /assets/img/solution-automation-960.webp 960w" sizes="(min-width: 1100px) 330px, (min-width: 720px) 46vw, 120px" width="960" height="640" alt="An operator using the touch panel of an industrial control cabinet" loading="lazy" decoding="async" /></figure>
          <div className="solution__body">
            <p className="solution__num" aria-hidden="true">04</p>
            <h3 className="solution__name"><a href="/automation-solutions/">Automation / BMS<Icon name="arrow" /></a></h3>
            <p className="solution__text">We offer an open-ended SCADA network to integrate any third-party product with Modbus output.</p>
          </div>
        </li>
      </ol>
    </div>
  );
}
