'use client';
import { useEffect } from 'react';
import { $$ } from './dom';

// Sectors (desktop): the sticky photo follows the sector in the middle of the screen, or under the pointer.
export default function SectorFrames() {
  useEffect(() => {
    const items = $$('.sector');
    const frames = $$('.sectors__frame-img');
    if (!items.length || !('IntersectionObserver' in window)) return;
    const activate = key => {
      items.forEach(i => i.classList.toggle('is-active', i.dataset.sector === key));
      frames.forEach(f => f.classList.toggle('is-active', f.dataset.sector === key));
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) activate(en.target.dataset.sector); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    const off = items.map(i => {
      const on = () => activate(i.dataset.sector);
      io.observe(i);
      i.addEventListener('mouseenter', on);
      i.addEventListener('focusin', on);
      return () => { i.removeEventListener('mouseenter', on); i.removeEventListener('focusin', on); };
    });
    activate(items[0].dataset.sector);
    return () => { io.disconnect(); off.forEach(f => f()); };
  }, []);
  return null;
}
