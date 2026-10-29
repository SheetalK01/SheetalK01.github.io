// mobile menu
const menuBtn = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  });
});

// footer year
document.getElementById('year').textContent = new Date().getFullYear();
