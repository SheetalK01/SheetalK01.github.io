/* Sheetal Khadanga · Portfolio interactions (no dependencies) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    store.set('sk-theme', t);
    $('meta[name="theme-color"]').setAttribute('content', t === 'dark' ? '#07070d' : '#f7f7fb');
    syncShot();
  };
  const toggleTheme = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  $('#theme-toggle').addEventListener('click', toggleTheme);

  /* ---------- Small things ---------- */
  $('#year').textContent = new Date().getFullYear();
  if (!isMac) $$('.mod-key').forEach((el) => (el.textContent = 'Ctrl '));

  const toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  };

  const copyEmail = async () => {
    const email = 'khadangasheetal@gmail.com';
    try { await navigator.clipboard.writeText(email); toast('Email copied ✓'); }
    catch { window.location.href = `mailto:${email}`; }
  };
  $('#copy-email').addEventListener('click', copyEmail);

  /* ---------- Nav: scrolled state, active link, mobile menu ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = $('#menu-toggle');
  const menu = $('#mobile-menu');
  const closeMenu = () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('#mobile-menu a').forEach((a) => a.addEventListener('click', closeMenu));

  const links = $$('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'experience', 'projects', 'skills', 'contact'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 6) * 60, 300)}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Count-up stats ---------- */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const start = performance.now();
      const dur = 1400;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countObserver.observe(el));

  /* ---------- Spotlight (page + cards) ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
    }, { passive: true });
    $$('.spot').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--cx', `${e.clientX - r.left}px`);
        card.style.setProperty('--cy', `${e.clientY - r.top}px`);
      });
    });
    const term = $('#terminal');
    const visual = $('.hero-visual');
    visual.addEventListener('pointermove', (e) => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      term.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    visual.addEventListener('pointerleave', () => { term.style.transform = ''; });
  }

  /* ---------- Typed roles ---------- */
  const roles = ['QA Engineer', 'Test Automation Engineer', 'SDET in the making', 'Full Stack Developer', 'AI-powered tool builder'];
  const typedEl = $('#typed');
  if (!reduceMotion) {
    let ri = 0, ci = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[ri];
      typedEl.textContent = word.slice(0, ci);
      if (deleting) {
        ci--;
        if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; return setTimeout(tick, 300); }
        return setTimeout(tick, 35);
      }
      ci++;
      if (ci > roles[ri].length) { deleting = true; ci = roles[ri].length; return setTimeout(tick, 2000); }
      setTimeout(tick, 70);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Terminal: an automated test run ---------- */
  const termBody = $('#term-body');
  const script = [
    { t: 'cmd', text: 'npx playwright test --project=regression' },
    { t: 'dim', text: '\nRunning 261 tests using 6 workers\n\n' },
    { t: 'ok', text: '  ✓ ', rest: [['tag', '[auth]  '], ['', 'register → lands on dashboard '], ['dim', '(1.1s)\n']] },
    { t: 'ok', text: '  ✓ ', rest: [['tag', '[security]  '], ['', "user B can't read user A's project "], ['dim', '(0.3s)\n']] },
    { t: 'ok', text: '  ✓ ', rest: [['tag', '[security]  '], ['', 'tampered JWT → 401 '], ['dim', '(0.2s)\n']] },
    { t: 'ok', text: '  ✓ ', rest: [['ai', '[ai]  '], ['', 'generate test cases from a user story '], ['dim', '(2.4s)\n']] },
    { t: 'ok', text: '  ✓ ', rest: [['tag', '[api]  '], ['', 'export returns a valid .xlsx '], ['dim', '(0.6s)\n']] },
    { t: 'ok', text: '  ✓ ', rest: [['tag', '[a11y]  '], ['', 'dashboard: 0 serious violations '], ['dim', '(1.8s)\n']] },
    { t: 'ok', text: '  ✓ ', rest: [['tag', '[visual]  '], ['', 'landing matches snapshot '], ['dim', '(1.2s)\n']] },
    { t: 'dim', text: '  … 254 more\n\n' },
    { t: 'sum', text: '  261 passed ', rest: [['dim', '(1.9m)\n\n']] },
    { t: 'cmd', text: 'echo "ship it 🚀"' },
  ];

  const span = (cls, text) => {
    const s = document.createElement('span');
    if (cls) s.className = `c-${cls}`;
    s.textContent = text;
    return s;
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeInto(el, text, speed) {
    for (const ch of text) { el.textContent += ch; await sleep(speed); }
  }

  async function runTerminal() {
    termBody.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    for (const line of script) {
      if (line.t === 'cmd') {
        termBody.append(span('prompt', '❯ '));
        const cmd = span('cmd', '');
        termBody.append(cmd, cursor);
        if (reduceMotion) cmd.textContent = line.text; else await typeInto(cmd, line.text, 32);
        await sleep(reduceMotion ? 0 : 450);
        cursor.remove();
        termBody.append('\n');
        continue;
      }
      const head = span(line.t, line.text);
      termBody.append(head);
      (line.rest || []).forEach(([cls, txt]) => termBody.append(span(cls, txt)));
      await sleep(reduceMotion ? 0 : (line.t === 'ok' ? 230 : 380));
    }
    termBody.append(cursor);
    if (!reduceMotion) { await sleep(5000); runTerminal(); }
  }

  const termObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { runTerminal(); termObserver.disconnect(); }
  });
  termObserver.observe(termBody);

  /* ---------- EvalPilot screenshot tabs ---------- */
  const epView = $('#ep-view');
  const epTabs = $$('[data-gallery="ep"] [role="tab"]');
  const epAlt = { demo: 'EvalPilot demo: a live test run and red-team report', landing: 'EvalPilot landing page', dashboard: 'EvalPilot dashboard', run: 'Live test run with the flight strip', redteam: 'Red-team risk report with threat radar', traces: 'Live traces feed and usage' };
  let epShot = 'demo';
  function syncEp() {
    if (!epView) return;
    const theme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const img = new Image();
    img.src = epShot === 'demo' ? 'assets/img/evalpilot/demo.gif' : `assets/img/evalpilot/${epShot}-${theme}.jpg`;
    img.alt = epAlt[epShot];
    epView.replaceChildren(img);
  }
  epTabs.forEach((tab) => tab.addEventListener('click', () => {
    epTabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    epShot = tab.dataset.shot;
    syncEp();
  }));
  new MutationObserver(syncEp).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  syncEp();

  /* ---------- Featured project media tabs ---------- */
  const shotView = $('#shot-view');
  const video = $('#tp-video');
  const tabs = $$('.media-tabs:not([data-gallery]) [role="tab"]');
  let currentShot = 'video';
  const shots = {
    landing: { light: 'landing-light.png', dark: 'landing-dark.png', alt: 'TestPilot AI landing page' },
    dashboard: { light: 'dashboard-light.png', dark: 'dashboard-dark.png', alt: 'Dashboard with charts of test cases by type and priority' },
    story: { light: 'story-light.png', dark: 'story-dark.png', alt: 'Story page with AI-generated test cases' },
    playwright: { light: 'playwright-dark.png', dark: 'playwright-dark.png', alt: 'Generated Playwright script with syntax highlighting' },
  };

  function syncShot() {
    if (!shotView || currentShot === 'video') return;
    const s = shots[currentShot];
    const theme = root.getAttribute('data-theme');
    shotView.innerHTML = '';
    const img = new Image();
    img.src = `assets/img/${s[theme] || s.dark}`;
    img.alt = s.alt;
    img.loading = 'lazy';
    shotView.append(img);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      currentShot = tab.dataset.shot;
      if (currentShot === 'video') {
        shotView.innerHTML = '';
        shotView.append(video);
        video.play().catch(() => {});
      } else {
        video.pause();
        syncShot();
      }
    });
  });

  // Autoplay the demo (muted) when it scrolls into view.
  if (!reduceMotion) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (currentShot !== 'video') return;
        if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
      });
    }, { threshold: 0.5 }).observe(video);
  }

  /* ---------- Command palette (⌘K / Ctrl K) ---------- */
  const palette = $('#palette');
  const pInput = $('#palette-input');
  const pList = $('#palette-list');
  const go = (id) => () => document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  const commands = [
    { label: 'Go to About', icon: '👋', hint: 'section', run: go('about') },
    { label: 'Go to Experience', icon: '💼', hint: 'section', run: go('experience') },
    { label: 'Go to Projects', icon: '🚀', hint: 'section', run: go('projects') },
    { label: 'Go to Skills', icon: '🧰', hint: 'section', run: go('skills') },
    { label: 'Go to Education', icon: '🎓', hint: 'section', run: go('education') },
    { label: 'Go to Contact', icon: '✉️', hint: 'section', run: go('contact') },
    { label: 'Download resume (PDF)', icon: '📄', hint: 'file', run: () => { const a = document.createElement('a'); a.href = 'assets/Sheetal_Khadanga_Resume.pdf'; a.download = ''; a.click(); } },
    { label: 'Copy email address', icon: '📋', hint: 'action', run: copyEmail },
    { label: 'Toggle light / dark mode', icon: '🌓', hint: 'action', run: toggleTheme },
    { label: 'Open GitHub profile', icon: '🐙', hint: 'link', run: () => window.open('https://github.com/SheetalK01', '_blank', 'noopener') },
    { label: 'Open LinkedIn', icon: '💼', hint: 'link', run: () => window.open('https://www.linkedin.com/in/sheetal-khadanga', '_blank', 'noopener') },
  ];
  let filtered = commands;
  let active = 0;
  let lastFocus = null;

  function renderPalette() {
    pList.innerHTML = '';
    if (!filtered.length) {
      const li = document.createElement('li');
      li.className = 'palette-empty';
      li.textContent = 'No results';
      pList.append(li);
      return;
    }
    filtered.forEach((c, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      li.innerHTML = `<span class="pl-left"><span class="pl-ico">${c.icon}</span><span></span></span><span class="pl-hint">${c.hint}</span>`;
      li.querySelector('.pl-left span:last-child').textContent = c.label;
      li.addEventListener('mouseenter', () => { active = i; renderPalette(); });
      li.addEventListener('click', () => runCommand(c));
      pList.append(li);
    });
    const sel = pList.children[active];
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function openPalette() {
    lastFocus = document.activeElement;
    palette.hidden = false;
    pInput.value = '';
    filtered = commands;
    active = 0;
    renderPalette();
    pInput.focus();
  }
  function closePalette() {
    palette.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  function runCommand(c) { closePalette(); c.run(); }

  $('#open-palette').addEventListener('click', openPalette);
  palette.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) closePalette(); });
  pInput.addEventListener('input', () => {
    const q = pInput.value.trim().toLowerCase();
    filtered = commands.filter((c) => c.label.toLowerCase().includes(q));
    active = 0;
    renderPalette();
  });
  pInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(filtered.length, 1); renderPalette(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + filtered.length) % Math.max(filtered.length, 1); renderPalette(); }
    else if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); runCommand(filtered[active]); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
    else if (e.key === 'Escape' && !palette.hidden) closePalette();
  });
})();
