// BUDABELS GUILD SITE - SCRIPT
// Counts members marked "member--online" in index.html and shows
// "(online/total Online)" in the roster heading, like the in-game list.

const members = document.querySelectorAll('.member');
const online = document.querySelectorAll('.member--online');
const label = document.getElementById('online-count');

if (label) {
  label.textContent = `Members (${online.length}/${members.length} Online)`;
}

// ---------- FIRE EFFECTS ----------
const FIRE_ON     = true;  // set to false to turn all fire effects off
const FLAME_COUNT = 22;    // flames along the bottom
const SPARK_COUNT = 36;    // rising sparks

const rand = (min, max) => min + Math.random() * (max - min);

if (FIRE_ON) {
  const fire = document.getElementById('fire');
  const sparks = document.getElementById('sparks');

  for (let i = 0; i < FLAME_COUNT; i++) {
    const f = document.createElement('i');
    f.className = 'flame';
    f.style.setProperty('--x', (i / (FLAME_COUNT - 1)) * 100 + rand(-2, 2) + '%');
    f.style.setProperty('--w', rand(90, 190) + 'px');
    f.style.setProperty('--h', rand(160, 300) + 'px');
    f.style.setProperty('--t', rand(0.5, 1.2) + 's');
    f.style.animationDelay = rand(-1, 0) + 's';
    fire.appendChild(f);
  }

  for (let i = 0; i < SPARK_COUNT; i++) {
    const s = document.createElement('i');
    s.className = 'spark';
    s.style.left = rand(0, 100) + '%';
    s.style.setProperty('--drift', rand(-80, 80) + 'px');
    s.style.animationDuration = rand(6, 14) + 's';
    s.style.animationDelay = rand(-14, 0) + 's';
    sparks.appendChild(s);
  }
} else {
  document.getElementById('fire')?.remove();
  document.getElementById('sparks')?.remove();
}

// ---------- CAROUSELS ----------
// Any <div class="carousel"> gets arrows, dots, swipe and auto-play.
// Change speed with data-autoplay="7000" (milliseconds) in index.html; use "0" to turn auto-play off.
document.querySelectorAll('.carousel').forEach(carousel => {
  const track  = carousel.querySelector('.carousel__track');
  const slides = [...track.children];
  const dotBox = carousel.querySelector('.carousel__dots');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay  = reduce ? 0 : Number(carousel.dataset.autoplay || 0);
  let index = 0, timer;

  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'carousel__dot';
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotBox.appendChild(d);
    return d;
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: index * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  }
  function mark() {
    index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, i) => d.setAttribute('aria-current', i === index));
  }
  function start() { stop(); if (delay) timer = setInterval(() => goTo(index + 1), delay); }
  function stop()  { clearInterval(timer); }

  carousel.querySelector('.carousel__btn--prev').addEventListener('click', () => goTo(index - 1));
  carousel.querySelector('.carousel__btn--next').addEventListener('click', () => goTo(index + 1));
  track.addEventListener('scroll', mark, { passive: true });
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });
  ['mouseenter', 'focusin', 'touchstart'].forEach(ev => carousel.addEventListener(ev, stop, { passive: true }));
  ['mouseleave', 'focusout', 'touchend'].forEach(ev => carousel.addEventListener(ev, start, { passive: true }));
  window.addEventListener('resize', () => goTo(index));

  mark();
  start();
});