'use client';
import { useEffect } from 'react';
import { $, motionOn } from './dom';

// A background film (the hero's, and the inner page heads'): plays muted in a loop while its section is
// on screen, and fades in over the still frame once it is actually playing. It is never loaded with
// reduced motion, Save-Data or a 2G connection, and the section's button pauses and resumes it.
// section, video, button: selectors of the section, its <video> and its pause button.
export default function FilmPlayer({ section, video: videoSel, button }) {
  useEffect(() => {
    const box = $(section);
    const video = $(videoSel);
    const btn = $(button);
    if (!box || !video || !btn) return;
    const net = navigator.connection;
    if (!motionOn() || (net && (net.saveData || /2g$/.test(net.effectiveType || '')))) return;

    let paused = false;
    let visible = true;
    video.muted = true; // React does not write the muted attribute, and autoplay needs it

    const label = () => {
      btn.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    };
    const sync = () => {
      if (paused || !visible || document.hidden) { video.pause(); return; }
      const p = video.play();
      // e.g. iOS Low Power Mode refuses autoplay: stay on the still, and let the button start it
      if (p) p.catch(() => { paused = true; label(); });
    };
    const onPlaying = () => video.classList.add('is-playing');
    const onClick = () => { paused = !paused; label(); sync(); };

    video.addEventListener('playing', onPlaying);
    btn.addEventListener('click', onClick);
    btn.hidden = false;
    const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    io.observe(box);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.removeEventListener('playing', onPlaying);
      btn.removeEventListener('click', onClick);
      video.pause();
    };
  }, [section, videoSel, button]);
  return null;
}
