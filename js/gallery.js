/* gallery.js — placeholder handling + lightbox.
   Any <figure data-lb> containing an <img> opens in the lightbox; its figcaption becomes the caption. */
(() => {
  document.querySelectorAll('.frame img').forEach(img => {
    const miss = () => { const f = img.closest('.frame'); f.classList.add('ph'); f.dataset.file = img.getAttribute('src'); };
    if (img.complete && img.naturalWidth === 0) miss(); else img.addEventListener('error', miss);
  });

  const figs = [...document.querySelectorAll('[data-lb]')];
  if (!figs.length) return;
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="n" aria-label="Next">›</button>';
  document.body.append(lb);
  const im = lb.querySelector('img'), cap = lb.querySelector('figcaption');
  let i = 0, opener = null;
  const show = n => { i = (n + figs.length) % figs.length; const s = figs[i].querySelector('img'); im.src = s.src; im.alt = s.alt; cap.textContent = figs[i].querySelector('figcaption')?.textContent || ''; };
  const open = n => { if (figs[n].querySelector('.ph')) return; opener = document.activeElement; show(n); lb.classList.add('open'); lb.querySelector('.x').focus(); };
  const close = () => { lb.classList.remove('open'); opener && opener.focus(); };
  figs.forEach((f, n) => { f.tabIndex = 0; f.setAttribute('role', 'button'); f.addEventListener('click', () => open(n)); f.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(n))); });
  lb.querySelector('.x').onclick = close; lb.querySelector('.p').onclick = () => show(i - 1); lb.querySelector('.n').onclick = () => show(i + 1);
  lb.addEventListener('click', e => e.target === lb && close());
  addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  let sx = 0; lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(i + (d < 0 ? 1 : -1)); });
})();
