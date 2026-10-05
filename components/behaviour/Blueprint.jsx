'use client';
import { useEffect } from 'react';
import { $, clamp, smooth, motionOn, desktopQuery } from './dom';

// Exploded blueprint (AHF, heat pump): on desktop the drawing comes apart as the section scrolls and the
// part for the current callout lights up; on phones it plays once in view; static with reduced motion.
export default function Blueprint({ section: id }) {
  useEffect(() => {
    const section = document.getElementById(id);
    const drawing = $('.ahf-drawing', section);
    const track = $('.ahf__track', section);
    if (!drawing || !track) return;
    const root = document.documentElement;
    const motion = motionOn();
    const desktop = desktopQuery();

    let ticking = false;
    let mode = '';
    let played = false;
    let raf = 0;
    let io = null;

    const setE = e => drawing.style.setProperty('--e', e.toFixed(3));
    function setStep(s) {
      if (s) section.dataset.step = String(s);
      else delete section.dataset.step;
    }
    function scrollMode() {
      const rect = track.getBoundingClientRect();
      const headerH = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 72;
      const travel = rect.height - (window.innerHeight - headerH);
      const p = clamp((headerH - rect.top) / Math.max(1, travel), 0, 1);
      setE(smooth(0.05, 0.34, p));
      setStep(p < 0.38 ? 0 : p < 0.58 ? 1 : p < 0.78 ? 2 : 3);
    }
    function update() {
      ticking = false;
      if (mode === 'scroll') scrollMode();
    }
    function onScroll() { if (!ticking) { ticking = true; raf = requestAnimationFrame(update); } }

    function playOnce() {
      if (played) return;
      played = true;
      let t0 = 0;
      raf = requestAnimationFrame(function step(now) {
        if (!t0) t0 = now;
        const t = clamp((now - t0) / 1400, 0, 1);
        setE(smooth(0, 1, t));
        if (t < 1) raf = requestAnimationFrame(step);
      });
    }

    function configure() {
      const next = !motion ? 'static' : desktop.matches ? 'scroll' : 'once';
      if (next === mode) return;
      mode = next;
      window.removeEventListener('scroll', onScroll);
      if (mode === 'static') { setE(1); setStep(0); return; }
      if (mode === 'scroll') {
        window.addEventListener('scroll', onScroll, { passive: true });
        scrollMode();
        return;
      }
      // small screens: assemble, then come apart once when the drawing is in view
      setStep(0);
      if (played) { setE(1); return; }
      setE(0);
      if (io) io.disconnect();
      io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { playOnce(); io.disconnect(); }
      }, { threshold: 0.45 });
      io.observe(drawing);
    }
    configure();
    desktop.addEventListener('change', configure);
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      desktop.removeEventListener('change', configure);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll);
      if (io) io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [id]);
  return null;
}
