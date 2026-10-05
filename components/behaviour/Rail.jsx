'use client';
import { useEffect } from 'react';
import { $, $$, clamp, motionOn } from './dom';

// A horizontal rail of cards (services): previous/next buttons, counter and dots, drag with a mouse.
// Touch and trackpads scroll it natively.
export default function Rail({ id }) {
  useEffect(() => {
    const rail = document.getElementById(id);
    const cards = Array.prototype.slice.call(rail.children);
    const controls = $('[data-rail-controls="' + id + '"]');
    const dots = $$('[data-rail-dots="' + id + '"] span');
    const prev = controls && $('[data-rail-prev]', controls);
    const next = controls && $('[data-rail-next]', controls);
    const counter = controls && $('[data-rail-index]', controls);
    const behavior = motionOn() ? 'smooth' : 'auto';
    let ticking = false;
    let raf = 0;

    const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth);
    const atEnd = () => rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
    const index = () => (atEnd() ? cards.length - 1 : clamp(Math.round(rail.scrollLeft / step()), 0, cards.length - 1));
    function sync() {
      ticking = false;
      const i = index();
      if (counter) counter.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = atEnd();
    }
    const onScroll = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(sync); } };
    const onPrev = () => rail.scrollBy({ left: -step(), behavior });
    const onNext = () => rail.scrollBy({ left: step(), behavior });

    // drag with a mouse (touch and trackpads already scroll natively)
    let down = false, dragged = false, startX = 0, startLeft = 0;
    const onDown = e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; dragged = false; startX = e.clientX; startLeft = rail.scrollLeft;
    };
    const onMove = e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 6) { dragged = true; rail.classList.add('is-dragging'); }
      if (dragged) rail.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!dragged) return;
      rail.classList.remove('is-dragging');
      rail.scrollTo({ left: index() * step(), behavior });
      setTimeout(() => { dragged = false; }, 0);
    };
    const onClickCapture = e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } };
    const onDragStart = e => e.preventDefault();

    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    if (prev) prev.addEventListener('click', onPrev);
    if (next) next.addEventListener('click', onNext);
    rail.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    rail.addEventListener('click', onClickCapture, true);
    rail.addEventListener('dragstart', onDragStart);
    sync();
    return () => {
      rail.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', sync);
      if (prev) prev.removeEventListener('click', onPrev);
      if (next) next.removeEventListener('click', onNext);
      rail.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      rail.removeEventListener('click', onClickCapture, true);
      rail.removeEventListener('dragstart', onDragStart);
      cancelAnimationFrame(raf);
    };
  }, [id]);
  return null;
}
