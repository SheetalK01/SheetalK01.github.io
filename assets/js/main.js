/* Sheetal Khadanga · Portfolio interactions (no dependencies) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* Theme */
  const themeLabel = $('#theme-toggle .theme-label');
  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    themeLabel.textContent = t === 'dark' ? 'Light' : 'Dark';
    $('meta[name="theme-color"]').setAttribute('content', t === 'dark' ? '#171512' : '#f4efe6');
  };
  applyTheme(root.getAttribute('data-theme') || 'light');
  $('#theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('sk-theme', next);
  });

  /* Mobile menu */
  const menuBtn = $('#menu-toggle');
  const links = $('#nav-links');
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  $$('#nav-links a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
  }));

  /* Project screens */
  const galleries = {
    ep: {
      view: $('#ep-view'),
      src: (shot, theme) => (shot === 'demo' ? 'assets/img/evalpilot/demo.gif' : `assets/img/evalpilot/${shot}-${theme}.jpg`),
      alt: { demo: 'EvalPilot demo: a live test run and a red-team report', dashboard: 'EvalPilot dashboard', run: 'Live test run with results streaming in', redteam: 'Red-team risk report', traces: 'Live traces and usage' },
    },
    tp: {
      view: $('#tp-view'),
      video: $('#tp-video'),
      src: (shot, theme) => ({ dashboard: `dashboard-${theme}.png`, story: `story-${theme}.png`, playwright: 'playwright-dark.png' }[shot]),
      alt: { dashboard: 'TestPilot AI dashboard', story: 'AI-generated test cases for a user story', playwright: 'Generated Playwright script' },
    },
  };
  const current = { ep: 'demo', tp: 'video' };

  function render(key) {
    const g = galleries[key];
    const shot = current[key];
    if (!g.view) return;
    if (shot === 'video') {
      g.view.replaceChildren(g.video);
      return;
    }
    if (g.video) g.video.pause();
    const theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const img = new Image();
    const file = g.src(shot, theme);
    img.src = key === 'tp' ? `assets/img/${file}` : file;
    img.alt = g.alt[shot];
    g.view.replaceChildren(img);
  }

  $$('.shots').forEach((fig) => {
    const key = fig.dataset.gallery;
    const tabs = $$('[role="tab"]', fig);
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      current[key] = tab.dataset.shot;
      render(key);
    }));
  });
  new MutationObserver(() => { if (current.ep !== 'demo') render('ep'); if (current.tp !== 'video') render('tp'); })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  /* Copy email */
  const toast = $('#toast');
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  };
  $('#copy-email').addEventListener('click', async (e) => {
    const email = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(email); showToast('Email copied'); }
    catch (err) { window.location.href = `mailto:${email}`; }
  });

  $('#year').textContent = new Date().getFullYear();
})();
