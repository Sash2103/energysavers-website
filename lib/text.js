// Text helpers for the inner pages, ported from tools/build-pages.py. They keep Python's behaviour
// (its whitespace set, rounding and character counts) so the pages come out exactly as before.

// Python's str.isspace() set, used for \s and strip()
const WS = '\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000';
const LINEBREAKS = new RegExp(`[${WS}]*\\n[${WS}]*`, 'g');
const EDGES = new RegExp(`^[${WS}]+|[${WS}]+$`, 'g');

export const strip = t => t.replace(EDGES, '');
export const oneLine = t => strip(t.replace(LINEBREAKS, ' '));
/** Length in characters (code points), as Python's len() */
export const len = t => Array.from(t).length;
/** Python's round(): halves go to the even neighbour */
export function pyRound(x) {
  const f = Math.floor(x);
  const d = x - f;
  if (d > 0.5) return f + 1;
  if (d < 0.5) return f;
  return f % 2 === 0 ? f : f + 1;
}

export const HEADINGS = ['h2', 'h3', 'h4', 'h5', 'h6'];
export const isHeading = b => HEADINGS.includes(b.t);
export const lvl = b => Number(b.t[1]);
export const textOf = item => (typeof item === 'string' ? item : item.text);

const ACRONYMS = new Set(('AHF SVG ASVG UPS HVAC PQ BMS SCADA IEEE OSKAR EV AC DC ES COP VFD VFDS LED LEDS IAQ PFC UAE KSA ISO FFT ' +
  'PCBA IGBT HEPA VOC VOCS CO2 DEWA OTA APP CPO SOC DVR MEP FZE LLC AMR IOT PLC HMI THD PF DESC SER SEC WLAN').split(' '));
const PROPER = { 'energy savers': 'Energy Savers', sinexcel: 'Sinexcel', siemens: 'Siemens', dubai: 'Dubai' };
const UPPER = new Set('AHF SVG UPS HVAC PQ BMS SCADA IEEE LED IAQ HEPA EV VFD COP'.split(' '));   // "Bms" and "hvac" in old headings

/** Old headings are often in capitals. Show them in sentence case, keeping acronyms and names. */
export function tidy(input) {
  const t = strip(oneLine(input).replace(/:+$/, ''));
  const letters = Array.from(t).filter(c => /\p{L}/u.test(c));
  if (!letters.length) return t;
  const shouting = letters.length > 3 && letters.filter(c => /\p{Lu}/u.test(c)).length / letters.length > 0.75;
  let out = t.replace(/[A-Za-z0-9][A-Za-z0-9'’&.-]*/g, w => {
    const core = w.replace(/[^A-Za-z0-9]/g, '');
    if (UPPER.has(core.toUpperCase())) return w.toUpperCase();
    if (!core || ACRONYMS.has(core.toUpperCase()) || /[0-9]/.test(core)) return w;
    const isUpper = /[A-Z]/.test(w) && !/[a-z]/.test(w);
    if (isUpper && (shouting || core.length >= 4)) return w.toLowerCase();
    return w;
  });
  if (shouting) {
    for (const [k, v] of Object.entries(PROPER)) out = out.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
  }
  const first = s => Array.from(s)[0] || '';
  if (first(out) !== first(t) || shouting) out = first(out).toUpperCase() + Array.from(out).slice(1).join('');
  return out;
}

/** Heading text compared loosely (tab labels, titles) */
export const norm = t => strip(oneLine(t).toLowerCase().split('about ').join('').replace(/[^a-z0-9]+/g, ' '));
