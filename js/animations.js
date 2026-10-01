/* animations.js — scroll reveals + gentle image parallax */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .25 });
  items.forEach(i => io.observe(i));

  // parallax: <div class="frame" data-parallax>
  const frames = [...document.querySelectorAll('[data-parallax]')];
  if (!frames.length) return;
  let ticking = false;
  const run = () => {
    frames.forEach(f => {
      const r = f.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height/2 - innerHeight/2) / innerHeight;
      const img = f.querySelector('img'); if (img) img.style.transform = `translateY(${p * -8}%)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  run();
})();
