import { preload } from 'react-dom';
import './globals.css';
import Sprite from '@/components/site/Sprite';
import Loader from '@/components/site/Loader';

// Private preview of a proposed redesign. Keep it out of search engines until the owner approves it.
export const metadata = {
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/assets/svg/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/img/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/assets/img/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0C1B22',
};

// Runs before first paint: decide on motion, and show the logo loader only on slow connections.
const BEFORE_PAINT = `(function () {
  var d = document.documentElement;
  var off = /[?&]motion=off\\b/.test(location.search) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.classList.add('js');
  d.dataset.motion = off ? 'off' : 'on';
  var done = false;
  function finish() {
    if (done) return;
    done = true;
    d.classList.add('type-ready');
    var announce = function () { window.dispatchEvent(new Event('es:loaded')); };
    if (!d.classList.contains('is-loading')) return announce();
    d.classList.add('is-loaded');
    setTimeout(function () { d.classList.remove('is-loading', 'is-loaded'); announce(); }, 350);
  }
  if (off || !document.fonts || !document.fonts.load) return finish();
  Promise.all([document.fonts.load('600 1em Archivo'), document.fonts.load('1em "Source Serif 4"')]).then(finish, finish);
  setTimeout(function () { if (!done) d.classList.add('is-loading'); }, 400);
  setTimeout(finish, 3000);
})();`;

export default function RootLayout({ children }) {
  // the two fonts every page uses straight away (the italic loads when a heading needs it)
  preload('/assets/fonts/archivo-var.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/assets/fonts/source-serif-4-var.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  return (
    // The script above sets classes and data-motion on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* suppressHydrationWarning: browser extensions often inject their own <script> into <head> */}
        <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} suppressHydrationWarning />
      </head>
      <body>
        <Sprite />
        <a className="skip-link" href="#main">Skip to content</a>
        <Loader />
        {children}
      </body>
    </html>
  );
}
