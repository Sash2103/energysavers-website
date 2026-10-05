'use client';
import { useEffect } from 'react';
import { $, setMega, setMenu, menuOpen, desktopQuery } from './dom';

// Products mega menu, the phone menu, and hiding the header while scrolling down.
export default function HeaderMenus() {
  useEffect(() => {
    const header = $('#site-header');
    const megaBtn = $('.nav-trigger');
    const mega = $('#mega-products');
    const menuBtn = $('.menu-toggle');
    const mobileMenu = $('#mobile-menu');
    const desktop = desktopQuery();

    const onMegaClick = e => {
      const open = megaBtn.getAttribute('aria-expanded') !== 'true';
      // keyboard activation (detail === 0) moves focus into the panel, which sits after the bar in source order
      setMega(open, open && e.detail === 0);
    };
    const onMegaKey = e => { if (e.key === 'Escape') { setMega(false); megaBtn.focus(); } };
    const onDocClick = e => {
      if (!mega.hidden && !mega.contains(e.target) && e.target !== megaBtn && !megaBtn.contains(e.target)) setMega(false);
    };
    const onMegaFocusOut = e => {
      if (e.relatedTarget && !mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false);
    };
    const onMenuClick = () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    const onMobileClick = e => { if (e.target.closest('a')) setMenu(false); };
    const onDocKey = e => { if (e.key === 'Escape' && menuOpen()) { setMenu(false); menuBtn.focus(); } };
    const onBreakpoint = () => { if (menuOpen()) setMenu(false); };

    // Hide the header while scrolling down, bring it back on the way up.
    let lastY = window.scrollY;
    let ticking = false;
    let raf = 0;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const menusOpen = !mega.hidden || menuOpen() || header.contains(document.activeElement);
        if (y < 120 || y < lastY - 4 || menusOpen) header.classList.remove('is-hidden');
        else if (y > lastY + 4) { header.classList.add('is-hidden'); setMega(false); }
        lastY = y;
        ticking = false;
      });
    };

    megaBtn.addEventListener('click', onMegaClick);
    mega.addEventListener('keydown', onMegaKey);
    document.addEventListener('click', onDocClick);
    mega.addEventListener('focusout', onMegaFocusOut);
    menuBtn.addEventListener('click', onMenuClick);
    mobileMenu.addEventListener('click', onMobileClick);
    document.addEventListener('keydown', onDocKey);
    desktop.addEventListener('change', onBreakpoint);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      megaBtn.removeEventListener('click', onMegaClick);
      mega.removeEventListener('keydown', onMegaKey);
      document.removeEventListener('click', onDocClick);
      mega.removeEventListener('focusout', onMegaFocusOut);
      menuBtn.removeEventListener('click', onMenuClick);
      mobileMenu.removeEventListener('click', onMobileClick);
      document.removeEventListener('keydown', onDocKey);
      desktop.removeEventListener('change', onBreakpoint);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
