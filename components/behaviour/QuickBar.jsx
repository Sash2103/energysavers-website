'use client';
import { useEffect } from 'react';
import { $ } from './dom';

// Show the floating Call/WhatsApp buttons once the page head is out of view, and hide them at the contact section.
export default function QuickBar() {
  useEffect(() => {
    const qa = $('#quick-actions');
    const hero = $('.hero, .page-head');
    const contact = $('#contact');
    if (!hero || !contact || !('IntersectionObserver' in window)) { qa.classList.add('is-visible'); return; }
    document.body.classList.add('has-quick-bar');
    let pastHero = false, atContact = false;
    const sync = () => qa.classList.toggle('is-visible', pastHero && !atContact);
    const a = new IntersectionObserver(en => { pastHero = !en[0].isIntersecting; sync(); });
    const b = new IntersectionObserver(en => { atContact = en[0].isIntersecting; sync(); }, { threshold: 0.15 });
    a.observe(hero);
    b.observe(contact);
    return () => { a.disconnect(); b.disconnect(); document.body.classList.remove('has-quick-bar'); };
  }, []);
  return null;
}
