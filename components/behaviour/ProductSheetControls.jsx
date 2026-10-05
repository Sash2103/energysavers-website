'use client';
import { useEffect } from 'react';
import { $, $$, motionOn, openDialog, startEnquiry } from './dom';

// Product quick-view: any [data-product] opens the sheet on that product, with chips for the other
// products of its line. "Contact us" inside a product closes the sheet and starts an enquiry about it.
export default function ProductSheetControls() {
  useEffect(() => {
    const dlg = $('#product-sheet');
    if (!dlg) return;
    const chips = $('#product-chips');
    const lineLabel = $('#product-sheet-line');
    const articles = $$('.product', dlg);
    const vt = motionOn() && typeof document.startViewTransition === 'function';

    articles.forEach(a => {
      const h = $('.product__name', a);
      if (h) h.id = a.id + '-title';
    });

    function show(id) {
      const art = $('#product-' + id);
      if (!art) return;
      const line = art.dataset.line;
      lineLabel.textContent = line;
      if (chips.dataset.line !== line) {
        chips.dataset.line = line;
        chips.innerHTML = '';
        articles.filter(a => a.dataset.line === line).forEach(a => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'chip';
          b.dataset.chip = a.id.replace('product-', '');
          b.textContent = $('.product__name', a).textContent;
          chips.appendChild(b);
        });
      }
      $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', String(c.dataset.chip === id)));
      articles.forEach(a => { a.hidden = a !== art; });
      dlg.setAttribute('aria-labelledby', art.id + '-title');
      $('.sheet__body', dlg).scrollTop = 0;
      dlg.scrollTop = 0;
    }

    function open(id, sourceImg) {
      if (vt && sourceImg && !dlg.open) {
        sourceImg.style.viewTransitionName = 'product-media';
        const tr = document.startViewTransition(() => {
          sourceImg.style.viewTransitionName = '';
          show(id);
          openDialog(dlg);
        });
        tr.finished.finally(() => { sourceImg.style.viewTransitionName = ''; });
        return;
      }
      show(id);
      openDialog(dlg);
    }

    const onDocClick = e => {
      const t = e.target.closest('[data-product]');
      if (!t) return;
      e.preventDefault();
      const img = t.classList.contains('line__media') ? $('img', t) : null;
      open(t.dataset.product, img);
    };
    const onChip = e => {
      const c = e.target.closest('.chip');
      if (!c || c.getAttribute('aria-pressed') === 'true') return;
      if (vt) document.startViewTransition(() => show(c.dataset.chip));
      else show(c.dataset.chip);
    };
    const onEnquire = e => {
      const a = e.target.closest('[data-enquire]');
      if (!a) return;
      e.preventDefault();
      dlg.close();
      startEnquiry('Product enquiry', 'Product: ' + a.dataset.enquire);
    };
    document.addEventListener('click', onDocClick);
    chips.addEventListener('click', onChip);
    dlg.addEventListener('click', onEnquire);
    return () => {
      document.removeEventListener('click', onDocClick);
      chips.removeEventListener('click', onChip);
      dlg.removeEventListener('click', onEnquire);
    };
  }, []);
  return null;
}
