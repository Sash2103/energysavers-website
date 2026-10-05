'use client';
import { useEffect } from 'react';
import { $, $$ } from './dom';

// Sector pages: the phases (Challenges, Root cause analysis, Solutions, Benefits) become tabs.
// Without the script every phase shows, one after another, under its own heading.
export default function PhaseTabs() {
  useEffect(() => {
    const undo = $$('[data-tabs]').map((box, n) => {
      const panels = $$('.phase', box);
      if (panels.length < 2) return () => {};
      const list = document.createElement('div');
      list.className = 'tabs__list';
      list.setAttribute('role', 'tablist');
      const tabs = panels.map((panel, i) => {
        const title = $('.phase__title', panel);
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'tabs__tab';
        tab.id = 'tab-' + n + '-' + i;
        tab.textContent = title.textContent;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        list.appendChild(tab);
        return tab;
      });
      function select(i, focus) {
        tabs.forEach((t, j) => {
          t.setAttribute('aria-selected', String(i === j));
          t.tabIndex = i === j ? 0 : -1;
          panels[j].hidden = i !== j;
        });
        if (focus) tabs[i].focus();
      }
      list.addEventListener('click', e => {
        const t = e.target.closest('[role="tab"]');
        if (t) select(tabs.indexOf(t));
      });
      list.addEventListener('keydown', e => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (next === null) return;
        e.preventDefault();
        select((next + tabs.length) % tabs.length, true);
      });
      box.insertBefore(list, panels[0]);
      box.classList.add('is-tabbed');
      select(0);
      // back to the static markup (used when React re-runs the effect in development)
      return () => {
        list.remove();
        box.classList.remove('is-tabbed');
        panels.forEach(p => { p.hidden = false; p.removeAttribute('role'); p.removeAttribute('aria-labelledby'); p.removeAttribute('tabindex'); });
      };
    });
    return () => undo.forEach(f => f());
  }, []);
  return null;
}
