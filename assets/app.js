const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* reveal on scroll */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });

/* counters */
$$('[data-count]').forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  let n = 0;
  const step = Math.max(1, Math.round(target / 40));
  const t = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(t); }
    el.textContent = n;
  }, 26);
});

/* gallery filter */
const filters = $$('.filters button');
filters.forEach((b) => {
  b.addEventListener('click', () => {
    filters.forEach((x) => x.classList.toggle('on', x === b));
    const k = b.dataset.filter;
    $$('.shot').forEach((s) => s.classList.toggle('hide', k !== 'all' && s.dataset.tag !== k));
  });
});

/* lightbox */
const lb = $('#lb');
if (lb) {
  const img = $('img', lb);
  const cap = $('.cap', lb);
  let list = [];
  let idx = 0;

  const show = (i) => {
    idx = (i + list.length) % list.length;
    const src = list[idx];
    img.src = src.dataset.src;
    cap.textContent = src.dataset.cap || '';
  };

  $$('.shot').forEach((s) => {
    s.addEventListener('click', () => {
      list = $$('.shot:not(.hide)');
      show(list.indexOf(s));
      lb.classList.add('on');
    });
  });

  $('.prev', lb).addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  $('.next', lb).addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  $('.close', lb).addEventListener('click', () => lb.classList.remove('on'));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('on'); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') lb.classList.remove('on');
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}
