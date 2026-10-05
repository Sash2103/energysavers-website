#!/usr/bin/env node
// Generates the isometric, exploded line drawing of an air-to-water heat pump
// and writes it as the React component components/drawings/HeatPumpDrawing.jsx.
//
// Usage: node tools/draw-heat-pump.mjs
//
// Same drawing language as tools/draw-ahf.mjs. The unit follows the heat pump on energysavers.me:
// three V-shaped finned coil blocks with fans on top, scroll compressors and a plate heat exchanger
// in the open lower bay, and the electrical cabinet at one end. Each part is an SVG group; CSS moves
// the groups apart using --e (0 = assembled, 1 = exploded) and the per-part --dx/--dy set here.

import { writeDrawing } from './write-drawing.mjs';

const C = Math.cos(Math.PI / 6); // 0.866
const S = 0.5;
const iso = (x, y, z) => [(x - y) * C, (x + y) * S - z];

// Unit size (arbitrary units): x along the unit, y front to back (the front is y = D), z up
const L = 520;          // coil and machinery section
const CAB = 100;        // electrical cabinet at the right end
const D = 300;
const Z = { base: 14, deck: 140, top: 290 };

// Part explode offsets in screen units (dy up)
const PARTS = {
  base:   { dx: 0,    dy: 0 },
  comp:   { dx: 0,    dy: 0 },
  hx:     { dx: -100, dy: -58 },   // slides out of the open front
  frame:  { dx: 0,    dy: 0 },
  coils:  { dx: 0,    dy: 175 },
  fans:   { dx: 0,    dy: 340 },
  cab:    { dx: 150,  dy: -87 },   // slides off along +x
};
// which callout step lights each part up
const FOCUS = { coils: 1, comp: 2, hx: 3 };

const parts = Object.fromEntries(Object.keys(PARTS).map((k) => [k, []]));
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
const n = (v) => (Math.round(v * 10) / 10).toString();
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
function polyline(points, cls = 'pipe') {
  const p = points.map(([x, y, z]) => iso(x, y, z));
  emit(`<path class="${cls}" d="M${p.map(pt).join('L')}"/>`, p);
}

// Box with its three visible faces: top, front (y = y1), right (x = x1)
function box(x0, y0, z0, w, d, h, opts = {}) {
  const x1 = x0 + w, y1 = y0 + d, z1 = z0 + h, extra = opts.cls ? ' ' + opts.cls : '';
  poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'f-f' + extra);
  poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 'f-r' + extra);
  poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'f-t' + extra);
}

// Vertical cylinder, optionally with a domed top (compressors)
function cylinder(cx, cy, z0, r, h, opts = {}) {
  const a = r * C * Math.SQRT2, b = r * S * Math.SQRT2;
  const [bx, by] = iso(cx, cy, z0);
  const [, ty] = iso(cx, cy, z0 + h);
  const extra = opts.cls ? ' ' + opts.cls : '';
  const side = `M${n(bx - a)} ${n(ty)}L${n(bx - a)} ${n(by)}A${n(a)} ${n(b)} 0 0 0 ${n(bx + a)} ${n(by)}L${n(bx + a)} ${n(ty)}Z`;
  emit(`<path class="f-f${extra}" d="${side}"/>`, [[bx - a, ty], [bx + a, by + b]]);
  for (let k = 1; k <= (opts.bands || 0); k++) {
    const y = by - (h * k) / (opts.bands + 1);
    emit(`<path class="d" d="M${n(bx - a)} ${n(y)}A${n(a)} ${n(b)} 0 0 0 ${n(bx + a)} ${n(y)}"/>`);
  }
  if (opts.dome) {
    const dh = r * 0.95;
    emit(`<path class="f-t${extra}" d="M${n(bx - a)} ${n(ty)}A${n(a)} ${n(b + dh)} 0 0 1 ${n(bx + a)} ${n(ty)}A${n(a)} ${n(b)} 0 0 1 ${n(bx - a)} ${n(ty)}Z"/>`, [[bx - a, ty - b - dh], [bx + a, ty + b]]);
  } else {
    emit(`<ellipse class="f-t${extra}" cx="${n(bx)}" cy="${n(ty)}" rx="${n(a)}" ry="${n(b)}"/>`, [[bx - a, ty - b], [bx + a, ty + b]]);
  }
  return [bx, ty - (opts.dome ? r * 0.95 : 0)];
}
// Flat circle lying at height z (fan guards)
function ring(cx, cy, z, r, cls = 'd') {
  const a = r * C * Math.SQRT2, b = r * S * Math.SQRT2;
  const [x, y] = iso(cx, cy, z);
  emit(`<ellipse class="${cls}" cx="${n(x)}" cy="${n(y)}" rx="${n(a)}" ry="${n(b)}"/>`, [[x - a, y - b], [x + a, y + b]]);
}

// ---------------------------------------------------------------- base frame and the back wall of the lower bay
current = 'base';
box(0, 0, 0, L + CAB, D, Z.base);
for (const x of [60, 250, 440]) poly([[x, D, 2], [x + 34, D, 2], [x + 34, D, 12], [x, D, 12]], 'f-f lift');
box(0, 0, Z.base, L, 8, Z.deck - Z.base);
for (let i = 0; i < 6; i++) line([20, 8, 30 + i * 18], [L - 20, 8, 30 + i * 18]);

// ---------------------------------------------------------------- compressors and the refrigerant lines
current = 'comp';
box(40, 70, Z.base, 250, 150, 6);
const tops = [[90, 120], [170, 175], [250, 120]].map(([cx, cy]) => {
  box(cx - 34, cy - 34, Z.base + 6, 68, 68, 5);
  return cylinder(cx, cy, Z.base + 11, 30, 74, { bands: 1, dome: true });
});
polyline([[90, 120, 126], [90, 120, 132], [170, 175, 132], [250, 120, 132], [300, 150, 132], [330, 205, 118]]);
polyline([[60, 90, 40], [40, 60, 40], [40, 60, 128], [300, 60, 128]]);
for (const [cx, cy] of [[90, 120], [170, 175], [250, 120]]) box(cx + 22, cy + 10, Z.base + 44, 16, 14, 14);
const anchorComp = tops[1];

// ---------------------------------------------------------------- plate heat exchanger: hot water one side, chilled water the other
current = 'hx';
const hx = { x: 330, y: 175, w: 54, d: 90, z: Z.base + 6, h: 100 };
box(hx.x, hx.y, hx.z, 7, hx.d, hx.h);
box(hx.x + 7, hx.y + 6, hx.z + 4, hx.w - 14, hx.d - 12, hx.h - 8);
for (let i = 1; i < 12; i++) line([hx.x + 7 + i * ((hx.w - 14) / 12), hx.y + hx.d - 6, hx.z + 8], [hx.x + 7 + i * ((hx.w - 14) / 12), hx.y + hx.d - 6, hx.z + hx.h - 8]);
box(hx.x + hx.w - 7, hx.y, hx.z, 7, hx.d, hx.h);
const stubs = [[hx.x + 16, hx.y + 22, 'hot'], [hx.x + 16, hx.y + 66, 'hot'], [hx.x + 38, hx.y + 22, 'cold'], [hx.x + 38, hx.y + 66, 'cold']];
for (const [sx, sy, cls] of stubs) cylinder(sx, sy, hx.z + hx.h, 7, 16, { cls });
const anchorHx = iso(hx.x + hx.w, hx.y + hx.d, hx.z + hx.h + 16);

// ---------------------------------------------------------------- front corner posts of the open lower bay
current = 'frame';
for (const x of [0, 250, L - 10]) box(x, D - 10, Z.base, 10, 10, Z.deck - Z.base);

// ---------------------------------------------------------------- coil section: deck and three V-shaped finned coil blocks
current = 'coils';
box(0, 0, Z.deck, L, D, 8);
const zb = Z.deck + 8, zt = Z.top, inner = 26, outer = 12;
let anchorCoils;
for (const [x0, x1] of [[6, 172], [176, 342], [346, 514]]) {
  // back coil (inner face, seen into the V) and front coil (outer face), then the end cap
  poly([[x0, outer, zt], [x1, outer, zt], [x1, D / 2 - inner, zb], [x0, D / 2 - inner, zb]], 'f-t');
  poly([[x0, D / 2 + inner, zb], [x1, D / 2 + inner, zb], [x1, D - outer, zt], [x0, D - outer, zt]], 'f-f');
  for (let x = x0 + 5; x < x1 - 2; x += 5) line([x, D / 2 + inner, zb], [x, D - outer, zt]);
  for (const f of [0.25, 0.5, 0.75]) {
    const y = D / 2 + inner + (D / 2 - inner - outer) * f, z = zb + (zt - zb) * f;
    line([x0, y, z], [x1, y, z], 'd tube');
  }
  poly([[x1, outer, zt], [x1, D - outer, zt], [x1, D / 2 + inner, zb], [x1, D / 2 - inner, zb]], 'f-r');
  if (x0 === 176) anchorCoils = iso((x0 + x1) / 2, D - outer - 20, zt - 20);
}

// ---------------------------------------------------------------- top deck with four fans
current = 'fans';
box(0, 0, Z.top, L, D, 8);
for (const cx of [66, 196, 326, 456]) {
  cylinder(cx, D / 2, Z.top + 8, 58, 24);
  const z = Z.top + 32;
  for (const r of [54, 38, 22]) ring(cx, D / 2, z, r);
  ring(cx, D / 2, z, 7, 'f-t');
  for (let k = 0; k < 8; k++) {
    const t = (k / 8) * Math.PI * 2;
    line([cx + 7 * Math.cos(t), D / 2 + 7 * Math.sin(t), z], [cx + 54 * Math.cos(t), D / 2 + 54 * Math.sin(t), z]);
  }
}

// ---------------------------------------------------------------- electrical cabinet
current = 'cab';
box(L, 0, Z.base, CAB, D, Z.top + 8 - Z.base);
const xf = L + CAB;
const door = (y0, y1, z0, z1) => poly([[xf, y0, z0], [xf, y1, z0], [xf, y1, z1], [xf, y0, z1]], 'd');
door(16, D / 2 - 4, 30, Z.top - 10);
door(D / 2 + 4, D - 16, 30, Z.top - 10);
for (const y of [D / 2 - 18, D / 2 + 12]) poly([[xf, y, 150], [xf, y + 6, 150], [xf, y + 6, 182], [xf, y, 182]], 'f-r');
poly([[L + 22, D, 220], [L + 78, D, 220], [L + 78, D, 252], [L + 22, D, 252]], 'f-f screen');
for (let i = 0; i < 6; i++) line([L + 18, D, 50 + i * 9], [L + 82, D, 50 + i * 9]);

// ---------------------------------------------------------------- assemble
const pad = 30;
const markerSize = 30;
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

const order = ['base', 'comp', 'hx', 'frame', 'coils', 'fans', 'cab'];
const group = (k) => `<g class="ahf-part" data-part="${k}"${FOCUS[k] ? ` data-focus="${FOCUS[k]}"` : ''} style="--dx:${PARTS[k].dx};--dy:${PARTS[k].dy}">${parts[k].join('')}</g>`;
const svg =
  `<svg class="ahf-drawing" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" role="img" aria-labelledby="hp-drawing-title">` +
  `<title id="hp-drawing-title">Exploded line drawing of an air-to-water heat pump: fans, V-shaped finned coils, scroll compressors, plate heat exchanger and electrical cabinet</title>` +
  order.map(group).join('') +
  marker(1, 'coils', anchorCoils) + marker(2, 'comp', anchorComp) + marker(3, 'hx', anchorHx) +
  `</svg>`;

writeDrawing('HeatPumpDrawing', svg, 'draw-heat-pump.mjs');
console.log(`Heat pump drawing: ${(svg.length / 1024).toFixed(1)} KB, viewBox ${vbX} ${vbY} ${vbW} ${vbH}`);
