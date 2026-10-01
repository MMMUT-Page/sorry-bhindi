/* main.js — navigation, progress bar, page transitions, cursor glow, music */
(() => {
  // ---- EDIT chapter names / order here ----
  const PAGES = [['story.html','Our Story'],['her.html','Her'],['that-night.html','That Night'],['memories.html','Memories'],['letter.html','Letter']];
  // ---- EDIT audio path here (put your mp3 at this location) ----
  const SONG = 'assets/audio/our-song.mp3';

  const body = document.body, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cur = location.pathname.split('/').pop() || 'index.html';
  const el = h => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };

  body.append(el('<div class="grain" aria-hidden="true"></div>'));

  if (body.hasAttribute('data-nav')) {
    const links = PAGES.map(([h,n]) => `<a href="${h}"${h===cur?' aria-current="page"':''}>${n}</a>`).join('');
    const nav = el(`<header class="nav"><a class="brand" href="index.html" aria-label="Back to the beginning">S</a>
      <button class="menu-btn" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span><span></span></button>
      <nav id="menu" aria-label="Chapters">${links}</nav></header>`);
    body.prepend(nav);
    const btn = nav.querySelector('.menu-btn');
    const toggle = open => { body.classList.toggle('menu-open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => toggle(!body.classList.contains('menu-open')));
    addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
    let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      nav.classList.toggle('hide', y > last && y > 120 && !body.classList.contains('menu-open'));
      last = y;
    }, { passive: true });
  }

  const bar = el('<div class="progress" aria-hidden="true"></div>'); body.append(bar);
  const prog = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const h = a.getAttribute('href');
    if (a.target || e.metaKey || e.ctrlKey || h.startsWith('#') || /^https?:/.test(h)) return;
    e.preventDefault(); body.classList.add('leaving');
    setTimeout(() => location.href = a.href, reduce ? 0 : 600);
  });
  addEventListener('pageshow', () => body.classList.remove('leaving'));

  if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const g = el('<div class="glow" aria-hidden="true"></div>'); body.append(g);
    let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop(){ x += (tx-x)*.06; y += (ty-y)*.06; g.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
  }

  // music — button stays hidden unless the mp3 actually loads
  const audio = new Audio(); audio.preload = 'metadata'; audio.loop = true; audio.src = SONG;
  const mb = el('<button class="music" hidden aria-pressed="false">♪ Play our song</button>'); body.append(mb);
  audio.addEventListener('loadedmetadata', () => mb.hidden = false);
  mb.addEventListener('click', () => {
    if (audio.paused) audio.play().then(() => { mb.textContent = '♪ Pause'; mb.setAttribute('aria-pressed', true); }).catch(() => {});
    else { audio.pause(); mb.textContent = '♪ Play our song'; mb.setAttribute('aria-pressed', false); }
  });
})();
