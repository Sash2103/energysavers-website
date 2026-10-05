'use client';
import { useEffect } from 'react';
import { $, $$, openDialog } from './dom';

// Certificate thumbnails open the full certificate in the lightbox.
export default function CertControls() {
  useEffect(() => {
    const dlg = $('#cert-lightbox');
    if (!dlg) return;
    const off = $$('[data-cert]').map(b => {
      const onClick = () => {
        $$('[data-cert-view]', dlg).forEach(f => { f.hidden = f.dataset.certView !== b.dataset.cert; });
        openDialog(dlg);
      };
      b.addEventListener('click', onClick);
      return () => b.removeEventListener('click', onClick);
    });
    return () => off.forEach(f => f());
  }, []);
  return null;
}
