'use client';
import { useEffect } from 'react';
import { $, $$, motionOn } from './dom';

// Hero waveform: load current with the 5th, 7th, 11th and 13th harmonics, which decay when the
// Active Harmonic Filter switch is on. Pauses off-screen and on request; static with reduced motion.
export default function Waveform() {
  useEffect(() => {
    const wave = $('.scope__wave');
    const ref = $('.scope__ref');
    const sw = $('#ahf-switch');
    const pauseBtn = $('#scope-pause');
    const caption = $('.scope__caption');
    const hero = $('.hero');
    if (!wave || !sw) return;
    const motion = motionOn();

    const bars = $$('.spectrum__bar[data-order]');
    const amps = { 5: -0.30, 7: -0.15, 11: 0.07, 13: 0.05 }; // typical six-pulse drive distortion
    const W = 1200, MID = 110, A = 72, N = 240, CYCLES = 3;
    let k = motion ? 1 : 0;      // harmonic content: 1 = filter off, 0 = filter on
    let target = k;
    let phase = 0;
    let paused = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    const amber = [226, 163, 59], lime = [177, 213, 105];

    const f = (t, kk) => Math.sin(t) + kk * (amps[5] * Math.sin(5 * t) + amps[7] * Math.sin(7 * t) + amps[11] * Math.sin(11 * t) + amps[13] * Math.sin(13 * t));
    function path(kk, ph) {
      let d = '';
      for (let i = 0; i <= N; i++) {
        const x = (W * i) / N;
        const y = MID - A * f((Math.PI * 2 * CYCLES * i) / N + ph, kk);
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      return d;
    }
    function draw() {
      wave.setAttribute('d', path(k, phase));
      ref.setAttribute('d', path(0, phase));
      const c = lime.map((v, i) => Math.round(v + (amber[i] - v) * k));
      const colour = 'rgb(' + c.join(',') + ')';
      wave.style.stroke = colour;
      caption.style.setProperty('--wave-colour', colour);
      bars.forEach(b => b.style.setProperty('--h', (Math.abs(amps[b.dataset.order]) * k).toFixed(3)));
    }
    function setTarget(on) {
      target = on ? 0 : 1;
      sw.setAttribute('aria-pressed', String(on));
      if (!motion) { k = target; draw(); return; }
      start();
    }
    function frame(now) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      k += (target - k) * Math.min(1, dt * 3.2);
      if (Math.abs(target - k) < 0.002) k = target;
      if (!paused) phase -= dt * (Math.PI * 2 / 3.2);
      draw();
      const settling = k !== target;
      if ((visible && !paused && !document.hidden) || settling) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    }
    function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

    const onSwitch = () => setTarget(sw.getAttribute('aria-pressed') !== 'true');
    const onPause = () => {
      paused = !paused;
      pauseBtn.classList.toggle('is-paused', paused);
      pauseBtn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
      if (!paused) start();
    };
    sw.addEventListener('click', onSwitch);
    pauseBtn.addEventListener('click', onPause);
    const unbind = () => { sw.removeEventListener('click', onSwitch); pauseBtn.removeEventListener('click', onPause); };
    if (!motion) { pauseBtn.hidden = true; draw(); return unbind; }

    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    });
    io.observe(hero);
    const onVisibility = () => { if (!document.hidden && visible) start(); };
    document.addEventListener('visibilitychange', onVisibility);

    // Start distorted, then switch the filter on so the visitor sees what it does.
    sw.setAttribute('aria-pressed', 'false');
    draw();
    start();
    const t = setTimeout(() => { if (target === 1 && sw.getAttribute('aria-pressed') === 'false') setTarget(true); }, 1500);
    return () => {
      unbind();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(t);
      cancelAnimationFrame(raf);
      raf = 0;
    };
  }, []);
  return null;
}
