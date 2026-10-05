#!/usr/bin/env node
// Generates the isometric, exploded line drawing of an active harmonic filter module
// and writes it as the React component components/drawings/AhfDrawing.jsx.
//
// Usage: node tools/draw-ahf.mjs
//
// The drawing is original (built from boxes and cylinders below), modelled on the
// layer structure described on energysavers.me: an upper PCBA with an auxiliary air
// duct, an IGBT PCBA, and a lower layer holding the inductors and IGBT heatsink.
// Each part is an SVG group; CSS moves the groups apart using --e (0 = assembled,
// 1 = exploded) and the per-part --dx/--dy set here.

import { writeDrawing } from './write-drawing.mjs';

const C = Math.cos(Math.PI / 6); // 0.866
const S = 0.5;
const iso = (x, y, z) => [(x - y) * C, (x + y) * S - z];

// Module size (arbitrary units, roughly millimetres)
const W = 440; // x, left to right along the front panel
const D = 400; // y, front to back
const FRONT = D; // the front panel sits on the y = D face

// Part explode offsets in screen units: up and to the right
const PARTS = {
  base:   { dx: 0,   dy: 0 },
  lower:  { dx: 0,   dy: 0 },
  igbt:   { dx: 46,  dy: 118 },
  upper:  { dx: 92,  dy: 236 },
  front:  { dx: -40, dy: -26 },
  side:   { dx: 165, dy: -95 },   // slides out along +x
  cover:  { dx: 118, dy: 350 },
};

const parts = Object.fromEntries(Object.keys(PARTS).map(k => [k, []]));
const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
let current = 'base';

function track(pts) {
  const { dx, dy } = PARTS[current];
  for (const [x, y] of pts) {
    for (const [ox, oy] of [[0, 0], [dx, -dy]]) {
      bounds.minX = Math.min(bounds.minX, x + ox);
      bounds.maxX = Math.max(bounds.maxX, x + ox);
      bounds.minY = Math.min(bounds.minY, y + oy);
      bounds.maxY = Math.max(bounds.maxY, y + oy);
    }
  }
}
const n = v => (Math.round(v * 10) / 10).toString();
const pt = ([x, y]) => `${n(x)} ${n(y)}`;
function emit(svg, pts = []) { track(pts); parts[current].push(svg); }

function poly(points, cls) {
  const p = points.map(([x, y, z]) => iso(x, y, z));
  emit(`<path class="${cls}" d="M${p.map(pt).join('L')}Z"/>`, p);
}
function line(a, b, cls = 'd') {
  const p = [iso(...a), iso(...b)];
  emit(`<path class="${cls}" d="M${pt(p[0])}L${pt(p[1])}"/>`, p);
}

// Box with its three visible faces: top, front (y = y1), right (x = x1)
function box(x0, y0, z0, w, d, h, opts = {}) {
  const x1 = x0 + w, y1 = y0 + d, z1 = z0 + h;
  poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'f-f' + (opts.cls ? ' ' + opts.cls : ''));
  poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 'f-r' + (opts.cls ? ' ' + opts.cls : ''));
  poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'f-t' + (opts.cls ? ' ' + opts.cls : ''));
}

// Vertical cylinder; optional winding lines on the visible half
function cylinder(cx, cy, z0, r, h, opts = {}) {
  const a = r * C * Math.SQRT2, b = r * S * Math.SQRT2;
  const [bx, by] = iso(cx, cy, z0);
  const [, ty] = iso(cx, cy, z0 + h);
  const side = `M${n(bx - a)} ${n(ty)}L${n(bx - a)} ${n(by)}A${n(a)} ${n(b)} 0 0 0 ${n(bx + a)} ${n(by)}L${n(bx + a)} ${n(ty)}Z`;
  emit(`<path class="f-f" d="${side}"/>`, [[bx - a, ty], [bx + a, by + b]]);
  for (let k = 1; k <= (opts.windings || 0); k++) {
    const y = by - (h * k) / (opts.windings + 1);
    emit(`<path class="d" d="M${n(bx - a)} ${n(y)}A${n(a)} ${n(b)} 0 0 0 ${n(bx + a)} ${n(y)}"/>`);
  }
  emit(`<ellipse class="f-t" cx="${n(bx)}" cy="${n(ty)}" rx="${n(a)}" ry="${n(b)}"/>`, [[bx - a, ty - b], [bx + a, ty + b]]);
  if (opts.core) emit(`<ellipse class="d" cx="${n(bx)}" cy="${n(ty)}" rx="${n(a * opts.core)}" ry="${n(b * opts.core)}"/>`);
}

// Circle lying in the vertical plane x = const (used for fans on the right face)
function circleX(x, cy, cz, r, cls = 'f-r', steps = 40) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    pts.push(iso(x, cy + r * Math.cos(t), cz + r * Math.sin(t)));
  }
  emit(`<path class="${cls}" d="M${pts.map(pt).join('L')}Z"/>`, pts);
}

// ---------------------------------------------------------------- base tray
current = 'base';
box(0, 0, 0, W, D - 10, 6);

// ---------------------------------------------------------------- lower layer
current = 'lower';
box(12, 12, 6, W - 24, D - 34, 4);
// heatsink base and fins (fins are thin plates running left to right)
box(28, 34, 10, 214, 292, 8);
for (let i = 0; i < 18; i++) box(28, 36 + i * 16, 18, 214, 4, 54);
// fan frames on the right end of the heatsink tunnel
for (const fy of [52, 194]) {
  box(250, fy, 10, 26, 118, 62);
  circleX(276, fy + 59, 41, 27, 'd');
  circleX(276, fy + 59, 41, 6, 'd');
  for (let k = 0; k < 5; k++) {
    const t = (k / 5) * Math.PI * 2;
    line([276, fy + 59 + 7 * Math.cos(t), 41 + 7 * Math.sin(t)], [276, fy + 59 + 25 * Math.cos(t + 0.6), 41 + 25 * Math.sin(t + 0.6)]);
  }
}
// three inductors
for (const cy of [74, 178, 282]) cylinder(356, cy, 10, 36, 76, { windings: 5, core: 0.42 });
const anchorLower = iso(356, 282, 86);

// ---------------------------------------------------------------- IGBT layer
current = 'igbt';
box(16, 16, 100, W - 32, D - 42, 5);
// DC bus capacitors in a row along the back
for (let i = 0; i < 6; i++) cylinder(62 + i * 52, 76, 105, 17, 44, { windings: 0, core: 0.3 });
// gate driver ICs
for (let i = 0; i < 7; i++) box(44 + i * 40, 176, 105, 16, 12, 4);
// IGBT modules with screw terminals
for (const x of [40, 126, 212]) {
  box(x, 232, 105, 70, 52, 18);
  for (const tx of [x + 14, x + 35, x + 56]) cylinder(tx, 258, 123, 5, 4);
}
// connector strip on the right
box(W - 74, 44, 105, 30, 280, 10);
for (let i = 0; i < 9; i++) line([W - 70, 60 + i * 30, 115], [W - 48, 60 + i * 30, 115]);
const anchorIgbt = iso(161, 258, 127);

// ---------------------------------------------------------------- upper layer
current = 'upper';
box(16, 16, 150, W - 32, D - 42, 5);
// processor and support chips
box(70, 236, 155, 46, 46, 6);
for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) box(40 + c * 34, 150 + r * 34, 155, 18, 14, 4);
// a row of small capacitors
for (let i = 0; i < 8; i++) cylinder(46 + i * 22, 320, 155, 6, 12);
// ribbon connector
box(34, 46, 155, 130, 14, 7);
// auxiliary air duct: two side walls and a slotted top plate
box(236, 56, 155, 4, 262, 36);
box(398, 56, 155, 4, 262, 36);
box(236, 56, 191, 166, 262, 4);
for (let i = 0; i < 10; i++) line([256, 76 + i * 24, 195], [382, 76 + i * 24, 195]);
const anchorUpper = iso(400, 318, 195);

// ---------------------------------------------------------------- front panel
current = 'front';
box(0, FRONT - 10, 0, W, 10, 214);
const face = (pts, cls = 'd') => poly(pts.map(([x, z]) => [x, FRONT, z]), cls);
face([[40, 118], [176, 118], [176, 178], [40, 178]], 'f-f screen');
face([[48, 126], [168, 126], [168, 170], [48, 170]], 'd');
for (let i = 0; i < 3; i++) face([[196 + i * 18, 166], [206 + i * 18, 166], [206 + i * 18, 176], [196 + i * 18, 176]], 'd led');
for (let i = 0; i < 9; i++) line([250, FRONT, 40 + i * 10], [406, FRONT, 40 + i * 10]);
for (const hx of [14, W - 26]) face([[hx, 32], [hx + 12, 32], [hx + 12, 190], [hx, 190]], 'd');

// ---------------------------------------------------------------- right side panel
current = 'side';
box(W - 6, 0, 6, 6, D - 10, 202);
for (let i = 0; i < 8; i++) line([W, 40 + i * 14, 150], [W, 40 + i * 14, 190]);

// ---------------------------------------------------------------- cover
current = 'cover';
box(0, 0, 208, W, D - 10, 6);
for (let i = 0; i < 6; i++) line([44, 26 + i * 12, 214], [W - 44, 26 + i * 12, 214]);

// ---------------------------------------------------------------- assemble
const pad = 30;
const markerSize = 30;
// leave room on the right for marker labels
bounds.maxX += 120;
bounds.minY -= markerSize;
const vbX = Math.floor(bounds.minX - pad), vbY = Math.floor(bounds.minY - pad);
const vbW = Math.ceil(bounds.maxX - bounds.minX + pad * 2), vbH = Math.ceil(bounds.maxY - bounds.minY + pad * 2);

function marker(num, part, [ax, ay]) {
  const { dx, dy } = PARTS[part];
  const lx = ax + 96, ly = ay - 36;
  return `<g class="ahf-marker" data-step="${num}" style="--dx:${dx};--dy:${dy}">` +
    `<path class="ahf-marker__lead" d="M${n(ax)} ${n(ay)}L${n(lx - markerSize / 2)} ${n(ly)}"/>` +
    `<circle class="ahf-marker__dot" cx="${n(ax)}" cy="${n(ay)}" r="3.5"/>` +
    `<rect class="ahf-marker__box" x="${n(lx - markerSize / 2)}" y="${n(ly - markerSize / 2)}" width="${markerSize}" height="${markerSize}"/>` +
    `<text class="ahf-marker__num" x="${n(lx)}" y="${n(ly + 1)}">${num}</text></g>`;
}

const order = ['base', 'lower', 'igbt', 'upper', 'front', 'side', 'cover'];
// data-focus ties a part to the callout step that lights it up (see .ahf[data-step] in app/globals.css)
const FOCUS = { upper: 1, igbt: 2, lower: 3 };
const group = k => `<g class="ahf-part" data-part="${k}"${FOCUS[k] ? ` data-focus="${FOCUS[k]}"` : ''} style="--dx:${PARTS[k].dx};--dy:${PARTS[k].dy}">${parts[k].join('')}</g>`;
const svg =
  `<svg class="ahf-drawing" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" role="img" aria-labelledby="ahf-drawing-title">` +
  `<title id="ahf-drawing-title">Exploded line drawing of an active harmonic filter module: cover, upper PCBA with air duct, IGBT PCBA, and the lower layer with inductors, heatsink and fans</title>` +
  order.map(group).join('') +
  marker(1, 'upper', anchorUpper) + marker(2, 'igbt', anchorIgbt) + marker(3, 'lower', anchorLower) +
  `</svg>`;

writeDrawing('AhfDrawing', svg, 'draw-ahf.mjs');
console.log(`AHF drawing: ${(svg.length / 1024).toFixed(1)} KB, viewBox ${vbX} ${vbY} ${vbW} ${vbH}`);
