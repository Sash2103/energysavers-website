'use client';
import { useEffect } from 'react';
import { $, $$, motionOn } from './dom';

const PER_CHAR = 21;   // ms
const PAUSE = { '.': 260, ',': 110 };

// [data-typed] text types itself out once, when it is in view. The untyped rest stays in place
// (visibility: hidden), so the paragraph keeps its shape and nothing below it moves. Shown whole with
// reduced motion.
export default function TypedText() {
  useEffect(() => {
    const els = $$('[data-typed]');
    if (!els.length || !motionOn() || !('IntersectionObserver' in window)) return;
    const frames = new Map(); // element -> its pending animation frame

    function type(el) {
      const done = $('.typed__done', el);
      const rest = $('.typed__rest', el);
      const text = el.dataset.text;
      // when each character appears: a steady rate, with a short pause after a full stop or comma
      const at = [];
      let t = 0;
      for (let i = 0; i < text.length; i++) {
        t += PER_CHAR + (i > 0 ? PAUSE[text[i - 1]] || 0 : 0);
        at.push(t);
      }
      el.classList.add('is-typing');
      const t0 = performance.now();
      let n = 0;
      const step = now => {
        while (n < text.length && at[n] <= now - t0) n++;
        done.textContent = text.slice(0, n);
        rest.textContent = text.slice(n);
        if (n < text.length) frames.set(el, requestAnimationFrame(step));
        else { frames.delete(el); el.classList.remove('is-typing'); el.classList.add('is-typed'); }
      };
      frames.set(el, requestAnimationFrame(step));
    }

    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      type(en.target);
    }), { threshold: 0.4 });
    els.forEach(el => {
      const done = $('.typed__done', el);
      const rest = $('.typed__rest', el);
      el.dataset.text = done.textContent;
      rest.textContent = done.textContent;
      done.textContent = '';
      io.observe(el);
    });
    return () => {
      io.disconnect();
      frames.forEach(id => cancelAnimationFrame(id));
      // leave the text whole
      els.forEach(el => { $('.typed__done', el).textContent = el.dataset.text; $('.typed__rest', el).textContent = ''; });
    };
  }, []);
  return null;
}
