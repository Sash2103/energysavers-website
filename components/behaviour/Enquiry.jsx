'use client';
import { useEffect } from 'react';
import { $, menuOpen, setMenu, startEnquiry } from './dom';

// The contact form has no backend: it opens the visitor's email app or WhatsApp with the message filled in.
// Links with data-interest (e.g. "Request an audit") scroll to the form and pick the subject.
export default function Enquiry() {
  useEffect(() => {
    const onInterest = e => {
      const a = e.target.closest('[data-interest]');
      if (!a) return;
      e.preventDefault();
      if (menuOpen()) setMenu(false);
      startEnquiry(a.dataset.interest, a.dataset.note);
    };
    document.addEventListener('click', onInterest);

    const form = $('#enquiry');
    const fields = [
      { el: $('#f-name'), err: $('#f-name-error') },
      { el: $('#f-email'), err: $('#f-email-error') },
      { el: $('#f-message'), err: $('#f-message-error') },
    ];
    function check(f) {
      const ok = f.el.value.trim() !== '' && f.el.checkValidity();
      f.el.setAttribute('aria-invalid', String(!ok));
      if (ok) f.el.removeAttribute('aria-describedby'); else f.el.setAttribute('aria-describedby', f.err.id);
      f.err.hidden = ok;
      return ok;
    }
    const off = fields.map(f => {
      const onBlur = () => { if (f.el.value) check(f); };
      const onInput = () => { if (f.el.getAttribute('aria-invalid') === 'true') check(f); };
      f.el.addEventListener('blur', onBlur);
      f.el.addEventListener('input', onInput);
      return () => { f.el.removeEventListener('blur', onBlur); f.el.removeEventListener('input', onInput); };
    });
    const onSubmit = e => {
      e.preventDefault();
      const bad = fields.filter(f => !check(f));
      if (bad.length) { bad[0].el.focus(); return; }
      const name = fields[0].el.value.trim();
      const email = fields[1].el.value.trim();
      const message = fields[2].el.value.trim();
      const interest = $('#f-interest').value;
      const text = 'Name: ' + name + '\nEmail: ' + email + '\nInterested in: ' + interest + '\n\n' + message;
      const via = e.submitter && e.submitter.value === 'whatsapp' ? 'whatsapp' : 'email';
      if (via === 'whatsapp') {
        window.open('https://wa.me/971525360124?text=' + encodeURIComponent(text), '_blank', 'noopener');
      } else {
        window.location.href = 'mailto:sales@energysavers.me?subject=' + encodeURIComponent('Website enquiry: ' + interest) + '&body=' + encodeURIComponent(text);
      }
    };
    form.addEventListener('submit', onSubmit);
    return () => {
      document.removeEventListener('click', onInterest);
      off.forEach(f => f());
      form.removeEventListener('submit', onSubmit);
    };
  }, []);
  return null;
}
