import Icon from '@/components/shared/Icon';
import HeroVideo from '@/components/behaviour/HeroVideo';

// Phones held upright get a portrait crop of the film; everything else gets the 16:9 one.
// The 16:9 sources come first and carry the media query, so a browser that ignores media on
// <source> plays the 16:9 film everywhere.
const WIDE = '(min-width: 641px), (orientation: landscape)';

// First view: what the company does and how to reach it, over a blurred film of a crew at work in a
// plant room (tools/build-hero-video.sh). The still frame shows until the film plays, and instead of it
// with reduced motion or Save-Data.
export default function Hero() {
  return (
    <section className="hero on-ink" id="top" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <picture>
          <source media={WIDE} type="image/avif" srcSet="/assets/img/hero-plant-room-960.avif" />
          <source media={WIDE} type="image/webp" srcSet="/assets/img/hero-plant-room-960.webp" />
          <source type="image/avif" srcSet="/assets/img/hero-plant-room-360.avif" />
          <img className="hero__still" src="/assets/img/hero-plant-room-360.webp" width="360" height="640" alt="" fetchPriority="high" />
        </picture>
        <video className="hero__video" muted loop playsInline preload="none" disablePictureInPicture disableRemotePlayback tabIndex={-1}>
          <source media={WIDE} type='video/mp4; codecs="av01.0.04M.10"' src="/assets/video/hero-plant-room-960x540.av1.mp4" />
          <source media={WIDE} type='video/mp4; codecs="avc1.640028"' src="/assets/video/hero-plant-room-960x540.h264.mp4" />
          <source type='video/mp4; codecs="av01.0.01M.10"' src="/assets/video/hero-plant-room-360x640.av1.mp4" />
          <source type='video/mp4; codecs="avc1.64001F"' src="/assets/video/hero-plant-room-360x640.h264.mp4" />
        </video>
      </div>
      <div className="hero__grid wrap">
        <h1 className="hero__title" id="hero-title">Power quality and energy efficiency <span className="accent">solutions</span></h1>
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
      <div className="hero__foot wrap">
        <ul className="hero__facts">
          <li>Established 2013</li>
          <li>150+ installations</li>
          <li>Dubai · Riyadh</li>
          <li>ISO 9001:2015</li>
        </ul>
        {/* shown by HeroVideo once the film can play */}
        <button className="icon-btn hero__pause" type="button" aria-label="Pause background video" hidden>
          <Icon name="pause" className="i--pause" />
          <Icon name="play" className="i--play" />
        </button>
      </div>
      <HeroVideo />
    </section>
  );
}
