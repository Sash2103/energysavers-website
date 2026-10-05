'use client';
import { useEffect } from 'react';
import { motionOn } from './dom';

// The logo energizes once per session, after the type is ready (and the loader, if it showed, has gone).
let firstVisit; // decided once per page load, so a re-run of the effect (React dev mode) keeps the decision

export default function LogoIntro() {
  useEffect(() => {
    if (!motionOn()) return;
    if (firstVisit === undefined) {
      let seen = false;
      try { seen = sessionStorage.getItem('es-logo') === '1'; sessionStorage.setItem('es-logo', '1'); } catch (err) { /* private mode */ }
      firstVisit = !seen;
    }
    if (!firstVisit) return;
    const root = document.documentElement;
    const go = () => root.classList.add('logo-intro');
    if (root.classList.contains('type-ready') && !root.classList.contains('is-loading')) { go(); return; }
    window.addEventListener('es:loaded', go, { once: true });
    return () => window.removeEventListener('es:loaded', go);
  }, []);
  return null;
}
