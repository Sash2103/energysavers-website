// The logo: the 2×2 mark and the wordmark. On the homepage it links back to the top, elsewhere home.
export default function Brand({ home, footer = false }) {
  return (
    <a
      className={footer ? 'brand brand--footer' : 'brand'}
      href={home ? '#top' : '/'}
      aria-label={home ? 'Energy Savers, back to top' : 'Energy Savers, home'}
    >
      <svg className="mark" viewBox="-8 -8 244 244" aria-hidden="true">
        {/* Square order matches the logo: blue top-left, lime top-right, blue bottom-right, lime bottom-left */}
        <rect className="mark__sq mark__sq--1" x="0" y="0" width="112" height="112" />
        <rect className="mark__sq mark__sq--2" x="116" y="0" width="112" height="112" />
        <rect className="mark__sq mark__sq--3" x="116" y="116" width="112" height="112" />
        <rect className="mark__sq mark__sq--4" x="0" y="116" width="112" height="112" />
        {/* the header's mark draws a wave through the squares once per session (see LogoIntro) */}
        {!footer && <path className="mark__wave" d="M-8 114c19 0 19-60 38-60s19 120 38 120 19-120 38-120 19 120 38 120 19-120 38-120 19 60 38 60" pathLength="1" />}
      </svg>
      <svg className="brand__word" viewBox="0 -2 1363 116" aria-hidden="true"><use href="#wordmark" /></svg>
    </a>
  );
}
