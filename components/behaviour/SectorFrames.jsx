'use client';
import { useEffect } from 'react';
import { $, $$ } from './dom';

// Sectors (desktop): the full-height photo and its title block follow the sector in the middle of the
// screen, or under the pointer.
export default function SectorFrames() {
  useEffect(() => {
    const items = $$('.sector');
    const frames = $$('.sectors__frame-img');
    const steps = $$('.plate__steps li');
    const num = $('[data-plate-num]');
    const name = $('[data-plate-name]');
    if (!items.length || !('IntersectionObserver' in window)) return;
    const activate = key => {
      items.forEach(i => i.classList.toggle('is-active', i.dataset.sector === key));
      frames.forEach(f => f.classList.toggle('is-active', f.dataset.sector === key));
      steps.forEach(s => s.classList.toggle('is-active', s.dataset.sector === key));
      const item = items.find(i => i.dataset.sector === key);
      if (num && item) num.textContent = item.dataset.index;
      if (name && item) name.textContent = $('.sector__name', item).textContent;
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
