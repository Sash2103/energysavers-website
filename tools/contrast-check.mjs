#!/usr/bin/env node
// Checks every text/UI colour pair used in app/globals.css against WCAG 2.2 AA.
// Usage: node tools/contrast-check.mjs   (exits 1 if any pair fails)

const hex = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16));
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
// colour seen when `fg` is drawn at `alpha` over `bg`
const mix = (fg, bg, alpha) => '#' + hex(fg).map((v, i) => Math.round(v * alpha + hex(bg)[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('');

const ink = '#0C1B22', ink2 = '#13262F', paper = '#F2F0EA';
const lime = '#B1D569', amber = '#E2A33B';
const mutedInk = '#A9B6BC', softInk = '#D3DBDE', field = '#60747E';

// [label, foreground, background, minimum] — 4.5 for text, 3 for large text and UI parts.
// The whole site is on ink (round 7); paper only shows as the plates under product shots, which carry
// no text. Text over the page-head films and photos is measured over every half second of each film
// (see NOTES.md): the dimmest, the soft text, keeps at least 5.6:1.
const pairs = [
  ['starting-value chip (ink on amber)', ink, amber, 4.5],
  ['result chip, current page chip (ink on lime)', ink, lime, 4.5],
  ['text on ink', paper, ink, 4.5],
  ['lede and body on ink', softInk, ink, 4.5],
  ['muted text on ink', mutedInk, ink, 4.5],
  ['lime labels on ink', lime, ink, 4.5],
  ['amber error text on ink', amber, ink, 4.5],
  ['primary button on ink (ink on lime)', ink, lime, 4.5],
  ['primary button hover on ink', ink, '#C6E287', 4.5],
  ['form field border on ink (UI)', field, ink, 3],
  ['form field border on form panel (UI)', field, ink2, 3],
  ['text on cards, bench, sheets, contact, mega menu (ink-2)', paper, ink2, 4.5],
  ['soft card text on ink-2', softInk, ink2, 4.5],
  ['lime links, titles and arrows on ink-2', lime, ink2, 4.5],
  ['muted text on ink-2', mutedInk, ink2, 4.5],
  ['quick action border on ink-2 (UI)', field, ink2, 3],
  ['active rail dot on ink (UI)', lime, ink, 3],
  ['inactive callout title (58% paper on ink)', mix(paper, ink, 0.58), ink, 4.5],
  ['inactive callout body (58% soft on ink)', mix(softInk, ink, 0.58), ink, 4.5],
  ['inactive sector text (70% paper on ink)', mix(paper, ink, 0.7), ink, 4.5],
  ['inactive sector muted (70% muted on ink)', mix(mutedInk, ink, 0.7), ink, 4.5],
  ['focus ring on ink (UI)', lime, ink, 3],
  ['focus ring on ink-2 (UI)', lime, ink2, 3],
];

let failed = 0;
for (const [label, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (needs ${min})  ${label}  ${fg} on ${bg}`);
}
console.log(failed ? `\n${failed} pair(s) below AA` : `\nAll ${pairs.length} pairs meet WCAG 2.2 AA`);
process.exit(failed ? 1 : 0);
