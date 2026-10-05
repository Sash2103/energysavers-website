'use client';
import { useEffect } from 'react';
import { $$, dialogClosed } from './dom';

// Every sheet and lightbox: close with the close button, Esc (native) or a click on the backdrop.
export default function Dialogs() {
  useEffect(() => {
    const off = $$('dialog').map(dlg => {
      const onClose = () => dialogClosed();
      const onClick = e => {
        if (e.target.closest('[data-close]')) { dlg.close(); return; }
        if (e.target !== dlg) return;
        const r = dlg.getBoundingClientRect();
        const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        if (outside) dlg.close();
      };
      dlg.addEventListener('close', onClose);
      dlg.addEventListener('click', onClick);
      return () => { dlg.removeEventListener('close', onClose); dlg.removeEventListener('click', onClick); };
    });
    return () => off.forEach(f => f());
  }, []);
  return null;
}
