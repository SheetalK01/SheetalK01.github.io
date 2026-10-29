// mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// custom cursor + floating project preview (only with a mouse)
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const cursor = document.getElementById('cursor');
const preview = document.getElementById('preview');
const previewImg = preview.querySelector('img');

if (fine) {
  let x = 0, y = 0, px = 0, py = 0;
  window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
  const loop = () => {
    px += (x - px) * 0.15;
    py += (y - py) * 0.15;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    preview.style.left = px + 'px';
    preview.style.top = py + 'px';
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });

  document.querySelectorAll('.work').forEach((work) => {
    const src = work.dataset.img;
    if (!src) return;
    work.addEventListener('mouseenter', () => {
      previewImg.src = src;
      preview.classList.add('show');
    });
    work.addEventListener('mouseleave', () => preview.classList.remove('show'));
  });
}

// footer
document.getElementById('year').textContent = new Date().getFullYear();
const clock = document.getElementById('clock');
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
};
tick();
setInterval(tick, 30000);
