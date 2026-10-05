'use client';
import { useEffect } from 'react';
import { $, $$, openDialog, watchWorkplans } from './dom';

// Any [data-case] button opens the case sheet with a copy of that case's write-up.
export default function CaseSheetControls() {
  useEffect(() => {
    const dlg = $('#case-sheet');
    if (!dlg) return;
    const body = $('#case-sheet-body');
    const onClick = e => {
      const t = e.target.closest('[data-case]');
      if (!t) return;
      const src = document.getElementById('case-' + t.dataset.case);
      if (!src) return;
      const copy = src.cloneNode(true);
      copy.removeAttribute('id');
      $$('[data-workplan]', copy).forEach(w => w.classList.remove('is-live'));
      body.innerHTML = '';
      body.appendChild(copy);
      const name = $('.case__client', copy);
      dlg.setAttribute('aria-label', name ? name.textContent : 'Case study');
      openDialog(dlg);
      dlg.scrollTop = 0;
      watchWorkplans(copy);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
