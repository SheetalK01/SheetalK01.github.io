// fade the tiles in one after another
const tiles = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    setTimeout(() => { entry.target.style.transitionDelay = ''; entry.target.classList.remove('reveal', 'in'); }, 1200);
    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });
tiles.forEach((tile, i) => {
  tile.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
  io.observe(tile);
});

// Bengaluru time
const clock = document.getElementById('clock');
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
};
tick();
setInterval(tick, 30000);

document.getElementById('year').textContent = new Date().getFullYear();
