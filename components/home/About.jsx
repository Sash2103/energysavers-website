import { ABOUT_LEDE, Certs, Highlights, Names } from '@/components/shared/About';

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <div className="about__copy">
          <h2 className="section-title" id="about-title">About us</h2>
          <p className="about__lede">{ABOUT_LEDE}</p>
          <Certs />
        </div>
        <figure className="about__photo">
          <img src="/assets/img/about-business-bay-960.webp" srcSet="/assets/img/about-business-bay-480.webp 480w, /assets/img/about-business-bay-960.webp 960w, /assets/img/about-business-bay-1440.webp 1440w, /assets/img/about-business-bay-1920.webp 1920w" sizes="(min-width: 1100px) 56vw, 100vw" width="1920" height="1200" alt="Business Bay, Dubai, at dusk" loading="lazy" decoding="async" />
        </figure>
        <Highlights />
        <Names />
      </div>
    </section>
  );
}
