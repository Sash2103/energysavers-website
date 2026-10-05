// Helpers shared by the behaviour components (browser only). The markup is rendered as static HTML;
// these components add behaviour to it after load, exactly as the old script.js did.

export const $ = (sel, ctx) => (ctx || document).querySelector(sel);
export const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// Set before first paint by the script in app/layout.jsx: off with prefers-reduced-motion or ?motion=off
export const motionOn = () => document.documentElement.dataset.motion === 'on';
export const desktopQuery = () => window.matchMedia('(min-width: 960px)');

/* ------------------------------------------------------------ menus */
export function setMega(open, focusFirst) {
  const btn = $('.nav-trigger');
  const mega = $('#mega-products');
  if (!btn || !mega) return;
  btn.setAttribute('aria-expanded', String(open));
  mega.hidden = !open;
  if (open && focusFirst) { const first = $('a, button', mega); if (first) first.focus(); }
}

export const menuOpen = () => { const m = $('#mobile-menu'); return !!m && !m.hidden; };

export function setMenu(open) {
  const root = document.documentElement;
  $('.menu-toggle').setAttribute('aria-expanded', String(open));
  $('#mobile-menu').hidden = !open;
  root.classList.toggle('menu-open', open);
  root.style.overflow = open ? 'hidden' : '';
  $('#site-header').classList.remove('is-hidden');
}

/* ------------------------------------------------------------ dialogs */
let opener = null;

export function openDialog(dlg) {
  const root = document.documentElement;
  opener = document.activeElement;
  setMega(false);
  if (menuOpen()) setMenu(false);
  if (!dlg.open) dlg.showModal();
  root.classList.add('has-dialog');
  root.style.overflow = 'hidden';
}

export function dialogClosed() {
  const root = document.documentElement;
  root.classList.remove('has-dialog');
  root.style.overflow = '';
  if (opener && document.contains(opener)) opener.focus();
}

/* ------------------------------------------------------------ contact form */
export function startEnquiry(interest, note) {
  const form = $('#enquiry');
  const contact = $('#contact');
  if (!form || !contact) return;
  const sel = $('#f-interest');
  if (interest) sel.value = interest;
  const msg = $('#f-message');
  if (note && !msg.value.trim()) msg.value = note + '\n\n';
  contact.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'start' });
  $('#f-name').focus({ preventScroll: true });
  if (history.replaceState) history.replaceState(history.state, '', '#contact');
}

/* ------------------------------------------------------------ workplans: run the current once */
// Each step lights when the current reaches it: --at is the step's position along the bus (0–1).
function runWorkplan(w) {
  const steps = $('.workplan__steps', w);
  const across = getComputedStyle(steps).gridAutoFlow.indexOf('column') !== -1;
  const length = Math.max(1, across ? steps.clientWidth - 14 : steps.clientHeight - 40);
  $$('.wp', w).forEach(li => {
    const at = (across ? li.offsetLeft : li.offsetTop) / length;
    li.style.setProperty('--at', clamp(at, 0, 1).toFixed(3));
  });
  w.classList.add('is-live');
}

let workplanIO;  // undefined until first use; null when the current is shown without animation
const pending = new Set();

function observer() {
  if (workplanIO === undefined) {
    workplanIO = ('IntersectionObserver' in window && motionOn()) ? new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        workplanIO.unobserve(en.target);
        // a short pause once it is in view, so the eye is there before the current starts
        const t = setTimeout(() => { pending.delete(t); runWorkplan(en.target); }, 350);
        pending.add(t);
      });
    }, { threshold: 0.6 }) : null;
  }
  return workplanIO;
}

export function watchWorkplans(ctx) {
  const io = observer();
  $$('[data-workplan]', ctx).forEach(w => { if (io) io.observe(w); else w.classList.add('is-live'); });
}

export function unwatchWorkplans(ctx) {
  const io = observer();
  if (io) $$('[data-workplan]', ctx).forEach(w => io.unobserve(w));
  pending.forEach(clearTimeout);
  pending.clear();
}
