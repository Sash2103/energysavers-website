import Icon from '@/components/shared/Icon';
import Waveform from '@/components/behaviour/Waveform';

// First view: what the company does, how to reach it, and the harmonic filter demonstration.
export default function Hero() {
  return (
    <section className="hero on-ink" id="top" aria-labelledby="hero-title">
      <div className="hero__grid wrap">
        <h1 className="hero__title" id="hero-title">Power quality and energy efficiency <span className="accent">solutions</span></h1>
        <div className="hero__copy">
          <p className="hero__lede">Energy Savers is a UAE based engineering company focusing on implementing Power Quality/HVAC/SCADA solutions to industrial and commercial clients, thereby leading to energy efficiency, regulatory compliance and sustainability in energy.</p>
          <div className="hero__spec">
            <p className="hero__spec-label" id="spec-label">Specializing in</p>
            <ul className="hero__spec-list" aria-labelledby="spec-label">
              <li>Harmonic solutions</li>
              <li>Power quality</li>
              <li>Sustainable HVAC solutions</li>
              <li>Automation/SCADA/BMS</li>
            </ul>
          </div>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact" data-interest="Energy audit">Request an audit <Icon name="arrow" /></a>
            <p className="hero__reach">
              <a href="tel:+97145686557">+971&nbsp;4&nbsp;568&nbsp;6557</a>
              <a href="https://wa.me/971525360124"><Icon name="whatsapp" />WhatsApp</a>
            </p>
          </div>
        </div>
        <div className="scope__panel" role="group" aria-label="Harmonic filter demonstration">
          <div className="spectrum" aria-hidden="true">
            <div className="spectrum__bars">
              <span className="spectrum__bar spectrum__bar--fund"><b>1</b></span>
              <span className="spectrum__bar" data-order="5"><b>5</b></span>
              <span className="spectrum__bar" data-order="7"><b>7</b></span>
              <span className="spectrum__bar" data-order="11"><b>11</b></span>
              <span className="spectrum__bar" data-order="13"><b>13</b></span>
            </div>
            <p className="spectrum__label">Harmonic order</p>
          </div>
          <div className="scope__controls">
            <button className="switch" id="ahf-switch" type="button" aria-pressed="true">
              <span className="switch__label">Active Harmonic Filter</span>
              <span className="switch__track" aria-hidden="true"><span className="switch__off">Off</span><span className="switch__on">On</span></span>
            </button>
            <button className="icon-btn" id="scope-pause" type="button" aria-label="Pause animation">
              <Icon name="pause" className="i--pause" />
              <Icon name="play" className="i--play" />
            </button>
          </div>
        </div>
      </div>
      <figure className="scope">
        <svg className="scope__svg" viewBox="0 0 1200 220" preserveAspectRatio="none" role="img" aria-labelledby="scope-desc">
          <desc id="scope-desc">Diagram of load current. With the active harmonic filter off, the current is distorted by harmonics; switched on, it becomes a clean sine wave.</desc>
          <line className="scope__axis" x1="0" y1="110" x2="1200" y2="110" />
          <path className="scope__ref" d="M0 110.0L12 96.0L25 82.4L38 70.0L50 59.1L62 50.1L75 43.5L88 39.4L100 38.0L112 39.4L125 43.5L138 50.1L150 59.1L162 70.0L175 82.4L188 96.0L200 110.0L212 124.0L225 137.6L238 150.0L250 160.9L262 169.9L275 176.5L288 180.6L300 182.0L312 180.6L325 176.5L338 169.9L350 160.9L362 150.0L375 137.6L388 124.0L400 110.0L412 96.0L425 82.4L438 70.0L450 59.1L462 50.1L475 43.5L488 39.4L500 38.0L512 39.4L525 43.5L538 50.1L550 59.1L562 70.0L575 82.4L588 96.0L600 110.0L612 124.0L625 137.6L638 150.0L650 160.9L662 169.9L675 176.5L688 180.6L700 182.0L712 180.6L725 176.5L738 169.9L750 160.9L762 150.0L775 137.6L788 124.0L800 110.0L812 96.0L825 82.4L838 70.0L850 59.1L862 50.1L875 43.5L888 39.4L900 38.0L912 39.4L925 43.5L938 50.1L950 59.1L962 70.0L975 82.4L988 96.0L1000 110.0L1012 124.0L1025 137.6L1038 150.0L1050 160.9L1062 169.9L1075 176.5L1088 180.6L1100 182.0L1112 180.6L1125 176.5L1138 169.9L1150 160.9L1162 150.0L1175 137.6L1188 124.0L1200 110.0" />
          <path className="scope__wave" d="M0 110.0L12 96.0L25 82.4L38 70.0L50 59.1L62 50.1L75 43.5L88 39.4L100 38.0L112 39.4L125 43.5L138 50.1L150 59.1L162 70.0L175 82.4L188 96.0L200 110.0L212 124.0L225 137.6L238 150.0L250 160.9L262 169.9L275 176.5L288 180.6L300 182.0L312 180.6L325 176.5L338 169.9L350 160.9L362 150.0L375 137.6L388 124.0L400 110.0L412 96.0L425 82.4L438 70.0L450 59.1L462 50.1L475 43.5L488 39.4L500 38.0L512 39.4L525 43.5L538 50.1L550 59.1L562 70.0L575 82.4L588 96.0L600 110.0L612 124.0L625 137.6L638 150.0L650 160.9L662 169.9L675 176.5L688 180.6L700 182.0L712 180.6L725 176.5L738 169.9L750 160.9L762 150.0L775 137.6L788 124.0L800 110.0L812 96.0L825 82.4L838 70.0L850 59.1L862 50.1L875 43.5L888 39.4L900 38.0L912 39.4L925 43.5L938 50.1L950 59.1L962 70.0L975 82.4L988 96.0L1000 110.0L1012 124.0L1025 137.6L1038 150.0L1050 160.9L1062 169.9L1075 176.5L1088 180.6L1100 182.0L1112 180.6L1125 176.5L1138 169.9L1150 160.9L1162 150.0L1175 137.6L1188 124.0L1200 110.0" />
        </svg>
        <figcaption className="scope__caption"><span className="scope__legend scope__legend--live">Load current</span><span className="scope__legend scope__legend--ref">Clean sine</span></figcaption>
      </figure>
      <ul className="hero__facts wrap">
        <li>Established 2013</li>
        <li>150+ installations</li>
        <li>Dubai · Riyadh</li>
        <li>ISO 9001:2015</li>
      </ul>
      <Waveform />
    </section>
  );
}
