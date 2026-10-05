// Site map: the old site's pages and menu labels, and the keys that tie pages to homepage content.
// Ported from tools/build-pages.py (which generated the inner pages before the Next.js port).
import { CASES } from '@/data/cases';

const TREE = [
  ['about', 'About', []],
  ['products', 'Products', [
    ['power-quality', 'Power Quality', [
      ['ahf', 'Active Harmonic Filter', []],
      ['static-var-generator', 'Static Var Generator', []],
      ['voltage-optimizers', 'Voltage Optimization', []],
      ['uninterrupted-power-supply', 'Uninterrupted Power Supply', []],
      ['power-quality-mobile-anlayser', 'Power Quality Mobile Analyser', [
        ['pq-box-50', 'PQ-Box 50', []],
        ['pq-box-150-the-mobile-power-quality-allrounder', 'PQ-Box 150', []],
        ['pq-box-200-the-mobile-tool-for-the-expert', 'PQ-Box 200', []],
        ['pq-box-300-the-mobile-high-frequency-power-quality-tool', 'PQ-Box 300', []],
      ]],
    ]],
    ['hvac', 'HVAC', [
      ['heat-pumps', 'Heat Pumps System', []],
      ['adsorption-chiller', 'Adsorption Chiller', []],
      ['air-purifiers-smoke-filters', 'Air Purifiers / Smoke Filters', []],
    ]],
    ['automation', 'Automation', [
      ['bms-servers-controllers', 'BMS Servers & Controllers', []],
      ['sensors', 'Sensors', []],
      ['power-supply', 'Power Supply', []],
      ['smart-meters', 'Smart Meters', []],
    ]],
    ['ev-chargers', 'EV Chargers', [
      ['360480kw-distributed-charger', '360~480kW Distributed Charger', []],
      ['sec-200-240kw-integrated-charger', 'SEC 200-240kW Integrated Charger', []],
      ['sec-series', 'SEC 60-160kW Integrated Charger', []],
      ['sec-40-80kw-integrated-charger', 'SEC 40-80kW Integrated Charger', []],
      ['interstellar-ac-charger', 'Interstellar AC Charger', []],
      ['mira-ac-charger', 'Mira AC Charger', []],
      ['ser-series', 'SER 20kW Power Module', []],
      ['ser-series-40kw-power-module', 'SER 40kW Power Module', []],
    ]],
  ]],
  ['solutions', 'Solutions', [
    ['power-quality-audits', 'Power Quality Audits', []],
    ['power-quality-solutions', 'Power Quality Solutions', []],
    ['hvac-optimization', 'HVAC Optimization', []],
    ['automation-solutions', 'Automation Solutions', []],
    ['indoor-air-quality-improvement', 'Indoor Air Quality Improvement', []],
    ['smart-metering-lighting', 'Smart Metering & Lighting', []],
  ]],
  ['services', 'Services', [
    ['energy-audit', 'Energy Audit', []],
    ['pq-audit-and-measurement', 'PQ Audit and Measurement', []],
    ['harmonic-studies', 'Harmonic Studies', []],
    ['harmonic-simulation-studies', 'Harmonic Simulation Studies', []],
    ['pq-equipment-rental', 'PQ Equipment Rental', []],
  ]],
  ['sectors', 'Sectors', [
    ['hospitality', 'Hospitality', []],
    ['industrial-plants', 'Industrial Plants', []],
    ['data-centres-telecom', 'Data Centers / Telecom', []],
    ['commercial-facilities', 'Commercial Facilities', []],
    ['cooling-plants', 'Cooling Plants', []],
  ]],
  // case pages are labelled with the client's name from the case write-ups
  ['case-studies', 'Case studies', CASES.map(c => [c.slug, c.client, []])],
  ['blog', 'Blog', []],
  ['contact-us', 'Contact', []],
];

export const LABEL = new Map();
export const PARENT = new Map();
export const CHILDREN = new Map();
(function walk(nodes, parent) {
  for (const [slug, label, kids] of nodes) {
    LABEL.set(slug, label);
    PARENT.set(slug, parent);
    if (!CHILDREN.has(parent)) CHILDREN.set(parent, []);
    CHILDREN.get(parent).push(slug);
    walk(kids, slug);
  }
})(TREE, null);

export const href = slug => `/${slug}/`;

/** The top-level section a page belongs to (posts belong to the blog). */
export function topOf(slug, parents = PARENT) {
  let top = slug;
  while (parents.get(top)) top = parents.get(top);
  return top;
}

export function inProducts(slug) {
  for (let p = slug; p; p = PARENT.get(p)) if (p === 'products') return true;
  return false;
}

export const LINE_OF_KEY = { pq: 'power-quality', hvac: 'hvac', auto: 'automation', ev: 'ev-chargers' };
// the homepage's product-sheet keys -> product pages
export const PRODUCT_KEYS = {
  ahf: 'ahf', svg: 'static-var-generator', oskar: 'voltage-optimizers', ups: 'uninterrupted-power-supply',
  'pq-mobile': 'power-quality-mobile-anlayser', 'heat-pump': 'heat-pumps', adsorption: 'adsorption-chiller',
  'air-purifier': 'air-purifiers-smoke-filters', bms: 'bms-servers-controllers', sensors: 'sensors',
  'power-supply': 'power-supply', 'smart-meters': 'smart-meters', 'ev-360-480': '360480kw-distributed-charger',
  'ev-200-240': 'sec-200-240kw-integrated-charger', 'ev-60-160': 'sec-series', 'ev-40-80': 'sec-40-80kw-integrated-charger',
  'ev-interstellar': 'interstellar-ac-charger', 'ev-mira': 'mira-ac-charger',
};
export const INTEREST = {
  'energy-audit': 'Energy audit', 'power-quality-audits': 'Power quality audit', 'pq-audit-and-measurement': 'Power quality audit',
  'harmonic-studies': 'Power quality audit', 'harmonic-simulation-studies': 'Power quality audit',
};

// Text that is corrected or flagged, as already done on the homepage (see NOTES.md)
export const OVERRIDES = {
  'voltage-optimizers': {
    todo: 'TODO(owner): the old page credits OSKAR to Schneider Electric with an unusual acronym expansion; OSKAR appears to be an A. Eberle product. That sentence is left out until confirmed, as in the homepage sheet.',
    replace: [['Voltage Optimization-OSKAR (Operational Systematic K-band Analogue Reduction) is a cutting-edge technology developed by Schneider Electric which optimizes the electricity supply voltage to reduce energy consumption and improve energy efficiency within a building or facility. ', '']],
  },
  'pq-equipment-rental': {
    todo: 'TODO(owner): the old text described renting backhoes and forklifts. As approved for the homepage, it is replaced with their own PQ analyser wording; supply rental-specific text if wanted.',
    replace: [[/^PQ Equipment Rental is a business that provides rental services for a variety of heavy equipment.*$/,
      'Power Quality Mobile Analyzer is a handheld device used to analyze the power quality of an electrical system. It measures and records voltage, current, frequency, power factor, harmonics, and other power quality parameters.']],
  },
  'adsorption-chiller': { todo: 'TODO(owner): the “Advanced Cooling Solutions” paragraph describes another company (as on the old page). Check whether it belongs here.' },
  'ev-chargers': { todo: 'TODO(owner): on the old page the SER 20kW Power Module card linked to the SEC Series page; it now links to the SER Series page.' },
};
export const FIX_LINKS = { 'ev-chargers\u0000SER 20kW Power Module': 'ser-series' };
// Graphics drawn for the old site's dark sections (white labels): their band is set on ink
export const DARK_GROUND = new Set(['2023/01/dlm-left-min.png', '2023/01/dml-right-min.png', '2023/04/constant-power.png',
  '2023/04/ultra-wide-output.png', '2023/04/equipped.png']);
export const UPLOADS = 'https://www.energysavers.me/wp-content/uploads/';
