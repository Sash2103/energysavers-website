/* Energy Savers — page behaviour. Plain JS, no dependencies.
   Sections: helpers · header & menus · hero waveform · exploded blueprints · workplans ·
   product sheet · case sheet · certificates · rails · sectors · tabs · contact form · quick actions · logo
   The same file runs on every page; each block returns early when its elements are not on the page. */
(function () {
  'use strict';

  var root = document.documentElement;
  var motion = root.dataset.motion === 'on';
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  var desktop = window.matchMedia('(min-width: 960px)');

  /* ------------------------------------------------------------ header & menus */
  var header = $('#site-header');
  var megaBtn = $('.nav-trigger');
  var mega = $('#mega-products');
  var menuBtn = $('.menu-toggle');
  var mobileMenu = $('#mobile-menu');

  function setMega(open, focusFirst) {
    megaBtn.setAttribute('aria-expanded', String(open));
    mega.hidden = !open;
    if (open && focusFirst) { var first = $('a, button', mega); if (first) first.focus(); }
  }
  megaBtn.addEventListener('click', function (e) {
    var open = megaBtn.getAttribute('aria-expanded') !== 'true';
    // keyboard activation (detail === 0) moves focus into the panel, which sits after the bar in source order
    setMega(open, open && e.detail === 0);
  });
  mega.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMega(false); megaBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!mega.hidden && !mega.contains(e.target) && e.target !== megaBtn && !megaBtn.contains(e.target)) setMega(false);
  });
  mega.addEventListener('focusout', function (e) {
    if (e.relatedTarget && !mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false);
  });

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
    root.classList.toggle('menu-open', open);
    root.style.overflow = open ? 'hidden' : '';
    header.classList.remove('is-hidden');
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  mobileMenu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  desktop.addEventListener('change', function () { if (!mobileMenu.hidden) setMenu(false); });

  // Hide the header while scrolling down, bring it back on the way up.
  var lastY = window.scrollY;
  var headerTicking = false;
  window.addEventListener('scroll', function () {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      var menusOpen = !mega.hidden || !mobileMenu.hidden || header.contains(document.activeElement);
      if (y < 120 || y < lastY - 4 || menusOpen) header.classList.remove('is-hidden');
      else if (y > lastY + 4) { header.classList.add('is-hidden'); setMega(false); }
      lastY = y;
      headerTicking = false;
    });
  }, { passive: true });

  /* ------------------------------------------------------------ hero waveform */
  (function () {
    var wave = $('.scope__wave');
    var ref = $('.scope__ref');
    var sw = $('#ahf-switch');
    var pauseBtn = $('#scope-pause');
    var caption = $('.scope__caption');
    var hero = $('.hero');
    if (!wave || !sw) return;

    var bars = $$('.spectrum__bar[data-order]');
    var amps = { 5: -0.30, 7: -0.15, 11: 0.07, 13: 0.05 }; // typical six-pulse drive distortion
    var W = 1200, MID = 110, A = 72, N = 240, CYCLES = 3;
    var k = motion ? 1 : 0;      // harmonic content: 1 = filter off, 0 = filter on
    var target = k;
    var phase = 0;
    var paused = false;
    var visible = true;
    var raf = 0;
    var last = 0;
    var amber = [226, 163, 59], lime = [177, 213, 105];

    function f(t, kk) {
      return Math.sin(t) + kk * (amps[5] * Math.sin(5 * t) + amps[7] * Math.sin(7 * t) + amps[11] * Math.sin(11 * t) + amps[13] * Math.sin(13 * t));
    }
    function path(kk, ph) {
      var d = '';
      for (var i = 0; i <= N; i++) {
        var x = (W * i) / N;
        var y = MID - A * f((Math.PI * 2 * CYCLES * i) / N + ph, kk);
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      return d;
    }
    function draw() {
      wave.setAttribute('d', path(k, phase));
      ref.setAttribute('d', path(0, phase));
      var c = lime.map(function (v, i) { return Math.round(v + (amber[i] - v) * k); });
      var colour = 'rgb(' + c.join(',') + ')';
      wave.style.stroke = colour;
      caption.style.setProperty('--wave-colour', colour);
      bars.forEach(function (b) { b.style.setProperty('--h', (Math.abs(amps[b.dataset.order]) * k).toFixed(3)); });
    }
    function setTarget(on) {
      target = on ? 0 : 1;
      sw.setAttribute('aria-pressed', String(on));
      if (!motion) { k = target; draw(); return; }
      start();
    }
    function frame(now) {
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      k += (target - k) * Math.min(1, dt * 3.2);
      if (Math.abs(target - k) < 0.002) k = target;
      if (!paused) phase -= dt * (Math.PI * 2 / 3.2);
      draw();
      var settling = k !== target;
      if ((visible && !paused && !document.hidden) || settling) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    }
    function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

    sw.addEventListener('click', function () { setTarget(sw.getAttribute('aria-pressed') !== 'true'); });
    pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.classList.toggle('is-paused', paused);
      pauseBtn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
      if (!paused) start();
    });
    if (!motion) { pauseBtn.hidden = true; draw(); return; }

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && visible) start(); });

    // Start distorted, then switch the filter on so the visitor sees what it does.
    sw.setAttribute('aria-pressed', 'false');
    draw();
    start();
    setTimeout(function () { if (target === 1 && sw.getAttribute('aria-pressed') === 'false') setTarget(true); }, 1500);
  })();

  /* ------------------------------------------------------------ exploded blueprints (AHF, heat pump) */
  $$('.ahf').forEach(function (section) {
    var drawing = $('.ahf-drawing', section);
    var track = $('.ahf__track', section);
    if (!drawing || !track) return;

    var ticking = false;
    var mode = '';
    var played = false;

    function setE(e) { drawing.style.setProperty('--e', e.toFixed(3)); }
    function setStep(s) {
      if (s) section.dataset.step = String(s);
      else delete section.dataset.step;
    }
    function scrollMode() {
      var rect = track.getBoundingClientRect();
      var headerH = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 72;
      var travel = rect.height - (window.innerHeight - headerH);
      var p = clamp((headerH - rect.top) / Math.max(1, travel), 0, 1);
      setE(smooth(0.05, 0.34, p));
      setStep(p < 0.38 ? 0 : p < 0.58 ? 1 : p < 0.78 ? 2 : 3);
    }
    function update() {
      ticking = false;
      if (mode === 'scroll') scrollMode();
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    function playOnce() {
      if (played) return;
      played = true;
      var t0 = 0;
      requestAnimationFrame(function step(now) {
        if (!t0) t0 = now;
        var t = clamp((now - t0) / 1400, 0, 1);
        setE(smooth(0, 1, t));
        if (t < 1) requestAnimationFrame(step);
      });
    }

    function configure() {
      var next = !motion ? 'static' : desktop.matches ? 'scroll' : 'once';
      if (next === mode) return;
      mode = next;
      window.removeEventListener('scroll', onScroll);
      if (mode === 'static') { setE(1); setStep(0); return; }
      if (mode === 'scroll') {
        window.addEventListener('scroll', onScroll, { passive: true });
        scrollMode();
        return;
      }
      // small screens: assemble, then come apart once when the drawing is in view
      setStep(0);
      if (played) { setE(1); return; }
      setE(0);
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { playOnce(); io.disconnect(); }
      }, { threshold: 0.45 });
      io.observe(drawing);
    }
    configure();
    desktop.addEventListener('change', configure);
    window.addEventListener('resize', onScroll, { passive: true });
  });

  /* ------------------------------------------------------------ workplans: run the current once */
  // Each step lights when the current reaches it: --at is the step's position along the bus (0–1).
  function runWorkplan(w) {
    var steps = $('.workplan__steps', w);
    var across = getComputedStyle(steps).gridAutoFlow.indexOf('column') !== -1;
    var length = Math.max(1, across ? steps.clientWidth - 14 : steps.clientHeight - 40);
    $$('.wp', w).forEach(function (li) {
      var at = (across ? li.offsetLeft : li.offsetTop) / length;
      li.style.setProperty('--at', clamp(at, 0, 1).toFixed(3));
    });
    w.classList.add('is-live');
  }
  var workplanIO = ('IntersectionObserver' in window && motion) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      workplanIO.unobserve(en.target);
      // a short pause once it is in view, so the eye is there before the current starts
      setTimeout(function () { runWorkplan(en.target); }, 350);
    });
  }, { threshold: 0.6 }) : null;
  function watchWorkplans(ctx) {
    $$('[data-workplan]', ctx).forEach(function (w) {
      if (workplanIO) workplanIO.observe(w); else w.classList.add('is-live');
    });
  }
  watchWorkplans(document);

  /* ------------------------------------------------------------ dialogs (shared) */
  var opener = null;
  function openDialog(dlg) {
    opener = document.activeElement;
    setMega(false);
    if (!mobileMenu.hidden) setMenu(false);
    if (!dlg.open) dlg.showModal();
    root.classList.add('has-dialog');
    root.style.overflow = 'hidden';
  }
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      root.classList.remove('has-dialog');
      root.style.overflow = '';
      if (opener && document.contains(opener)) opener.focus();
    });
    dlg.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { dlg.close(); return; }
      if (e.target !== dlg) return;
      var r = dlg.getBoundingClientRect();
      var outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside) dlg.close();
    });
  });

  /* ------------------------------------------------------------ product sheet */
  (function () {
    var dlg = $('#product-sheet');
    if (!dlg) return;
    var chips = $('#product-chips');
    var lineLabel = $('#product-sheet-line');
    var articles = $$('.product', dlg);
    var vt = motion && typeof document.startViewTransition === 'function';

    articles.forEach(function (a) {
      var h = $('.product__name', a);
      if (h) h.id = a.id + '-title';
    });

    function show(id) {
      var art = $('#product-' + id);
      if (!art) return;
      var line = art.dataset.line;
      lineLabel.textContent = line;
      if (chips.dataset.line !== line) {
        chips.dataset.line = line;
        chips.innerHTML = '';
        articles.filter(function (a) { return a.dataset.line === line; }).forEach(function (a) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'chip';
          b.dataset.chip = a.id.replace('product-', '');
          b.textContent = $('.product__name', a).textContent;
          chips.appendChild(b);
        });
      }
      $$('.chip', chips).forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.chip === id)); });
      articles.forEach(function (a) { a.hidden = a !== art; });
      dlg.setAttribute('aria-labelledby', art.id + '-title');
      $('.sheet__body', dlg).scrollTop = 0;
      dlg.scrollTop = 0;
    }

    function open(id, sourceImg) {
      if (vt && sourceImg && !dlg.open) {
        sourceImg.style.viewTransitionName = 'product-media';
        var tr = document.startViewTransition(function () {
          sourceImg.style.viewTransitionName = '';
          show(id);
          openDialog(dlg);
        });
        tr.finished.finally(function () { sourceImg.style.viewTransitionName = ''; });
        return;
      }
      show(id);
      openDialog(dlg);
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-product]');
      if (!t) return;
      e.preventDefault();
      var img = t.classList.contains('line__media') ? $('img', t) : null;
      open(t.dataset.product, img);
    });

    chips.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c || c.getAttribute('aria-pressed') === 'true') return;
      if (vt) document.startViewTransition(function () { show(c.dataset.chip); });
      else show(c.dataset.chip);
    });

    // "Contact us" inside a product: close the sheet and start an enquiry about it
    dlg.addEventListener('click', function (e) {
      var a = e.target.closest('[data-enquire]');
      if (!a) return;
      e.preventDefault();
      dlg.close();
      startEnquiry('Product enquiry', 'Product: ' + a.dataset.enquire);
    });
  })();

  /* ------------------------------------------------------------ case sheet */
  (function () {
    var dlg = $('#case-sheet');
    if (!dlg) return;
    var body = $('#case-sheet-body');
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-case]');
      if (!t) return;
      var src = document.getElementById('case-' + t.dataset.case);
      if (!src) return;
      var copy = src.cloneNode(true);
      copy.removeAttribute('id');
      $$('[data-workplan]', copy).forEach(function (w) { w.classList.remove('is-live'); });
      body.innerHTML = '';
      body.appendChild(copy);
      var name = $('.case__client', copy);
      dlg.setAttribute('aria-label', name ? name.textContent : 'Case study');
      openDialog(dlg);
      dlg.scrollTop = 0;
      watchWorkplans(copy);
    });
  })();

  /* ------------------------------------------------------------ certificates */
  (function () {
    var dlg = $('#cert-lightbox');
    if (!dlg) return;
    $$('[data-cert]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-cert-view]', dlg).forEach(function (f) { f.hidden = f.dataset.certView !== b.dataset.cert; });
        openDialog(dlg);
      });
    });
  })();

  /* ------------------------------------------------------------ rails (services): buttons, counter, drag */
  $$('.rail').forEach(function (rail) {
    var cards = Array.prototype.slice.call(rail.children);
    var controls = $('[data-rail-controls="' + rail.id + '"]');
    var dots = $$('[data-rail-dots="' + rail.id + '"] span');
    var prev = controls && $('[data-rail-prev]', controls);
    var next = controls && $('[data-rail-next]', controls);
    var counter = controls && $('[data-rail-index]', controls);
    var behavior = motion ? 'smooth' : 'auto';
    var ticking = false;

    function step() { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth; }
    function atEnd() { return rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2; }
    function index() { return atEnd() ? cards.length - 1 : clamp(Math.round(rail.scrollLeft / step()), 0, cards.length - 1); }
    function sync() {
      ticking = false;
      var i = index();
      if (counter) counter.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = atEnd();
    }
    rail.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: behavior }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: behavior }); });

    // drag with a mouse (touch and trackpads already scroll natively)
    var down = false, dragged = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; dragged = false; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 6) { dragged = true; rail.classList.add('is-dragging'); }
      if (dragged) rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (!dragged) return;
      rail.classList.remove('is-dragging');
      rail.scrollTo({ left: index() * step(), behavior: behavior });
      setTimeout(function () { dragged = false; }, 0);
    });
    rail.addEventListener('click', function (e) { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
    sync();
  });

  /* ------------------------------------------------------------ sectors: sticky photo follows the list */
  (function () {
    var items = $$('.sector');
    var frames = $$('.sectors__frame-img');
    if (!items.length || !('IntersectionObserver' in window)) return;
    function activate(key) {
      items.forEach(function (i) { i.classList.toggle('is-active', i.dataset.sector === key); });
      frames.forEach(function (f) { f.classList.toggle('is-active', f.dataset.sector === key); });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) activate(en.target.dataset.sector); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(function (i) {
      io.observe(i);
      i.addEventListener('mouseenter', function () { activate(i.dataset.sector); });
      i.addEventListener('focusin', function () { activate(i.dataset.sector); });
    });
    activate(items[0].dataset.sector);
  })();

  /* ------------------------------------------------------------ tabs (sector pages): the phases become tabs */
  // Without the script every phase shows, one after another, under its own heading.
  $$('[data-tabs]').forEach(function (box, n) {
    var panels = $$('.phase', box);
    if (panels.length < 2) return;
    var list = document.createElement('div');
    list.className = 'tabs__list';
    list.setAttribute('role', 'tablist');
    var tabs = panels.map(function (panel, i) {
      var title = $('.phase__title', panel);
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tabs__tab';
      tab.id = 'tab-' + n + '-' + i;
      tab.textContent = title.textContent;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      list.appendChild(tab);
      return tab;
    });
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        panels[j].hidden = i !== j;
      });
      if (focus) tabs[i].focus();
    }
    list.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) select(tabs.indexOf(t));
    });
    list.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      e.preventDefault();
      select((next + tabs.length) % tabs.length, true);
    });
    box.insertBefore(list, panels[0]);
    box.classList.add('is-tabbed');
    select(0);
  });

  /* ------------------------------------------------------------ contact form */
  var form = $('#enquiry');
  var contact = $('#contact');
  function startEnquiry(interest, note) {
    if (!form || !contact) return;
    var sel = $('#f-interest');
    if (interest) sel.value = interest;
    var msg = $('#f-message');
    if (note && !msg.value.trim()) msg.value = note + '\n\n';
    contact.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
    $('#f-name').focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(null, '', '#contact');
  }
  $$('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!mobileMenu.hidden) setMenu(false);
      startEnquiry(a.dataset.interest, a.dataset.note);
    });
  });

  if (form) {
    var fields = [
      { el: $('#f-name'), err: $('#f-name-error') },
      { el: $('#f-email'), err: $('#f-email-error') },
      { el: $('#f-message'), err: $('#f-message-error') }
    ];
    function check(f) {
      var ok = f.el.value.trim() !== '' && f.el.checkValidity();
      f.el.setAttribute('aria-invalid', String(!ok));
      if (ok) f.el.removeAttribute('aria-describedby'); else f.el.setAttribute('aria-describedby', f.err.id);
      f.err.hidden = ok;
      return ok;
    }
    fields.forEach(function (f) {
      f.el.addEventListener('blur', function () { if (f.el.value) check(f); });
      f.el.addEventListener('input', function () { if (f.el.getAttribute('aria-invalid') === 'true') check(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { bad[0].el.focus(); return; }
      var name = fields[0].el.value.trim();
      var email = fields[1].el.value.trim();
      var message = fields[2].el.value.trim();
      var interest = $('#f-interest').value;
      var text = 'Name: ' + name + '\nEmail: ' + email + '\nInterested in: ' + interest + '\n\n' + message;
      var via = e.submitter && e.submitter.value === 'whatsapp' ? 'whatsapp' : 'email';
      if (via === 'whatsapp') {
        window.open('https://wa.me/971525360124?text=' + encodeURIComponent(text), '_blank', 'noopener');
      } else {
        window.location.href = 'mailto:sales@energysavers.me?subject=' + encodeURIComponent('Website enquiry: ' + interest) + '&body=' + encodeURIComponent(text);
      }
    });
  }

  /* ------------------------------------------------------------ quick actions (call + WhatsApp) */
  (function () {
    var qa = $('#quick-actions');
    var hero = $('.hero, .page-head');
    if (!qa || !hero || !contact || !('IntersectionObserver' in window)) { if (qa) qa.classList.add('is-visible'); return; }
    document.body.classList.add('has-quick-bar');
    var pastHero = false, atContact = false;
    function sync() { qa.classList.toggle('is-visible', pastHero && !atContact); }
    new IntersectionObserver(function (en) { pastHero = !en[0].isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(function (en) { atContact = en[0].isIntersecting; sync(); }, { threshold: 0.15 }).observe(contact);
  })();

  /* ------------------------------------------------------------ logo: energize once per session */
  (function () {
    if (!motion) return;
    var seen = false;
    try { seen = sessionStorage.getItem('es-logo') === '1'; sessionStorage.setItem('es-logo', '1'); } catch (err) { /* private mode */ }
    if (seen) return;
    // wait until the type is ready (and the loader, if it showed, has gone) so nothing overlaps
    var go = function () { root.classList.add('logo-intro'); };
    if (root.classList.contains('type-ready') && !root.classList.contains('is-loading')) go();
    else window.addEventListener('es:loaded', go, { once: true });
  })();
})();
