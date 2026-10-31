/* 작업 상세 보기. 메인과 개발 사례 페이지가 함께 쓴다.
   새 작업을 추가할 때: WORKS와 SHOTS에 한 항목씩 넣고, works.html에 카드를 하나 복사한다. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = window.I18N ? I18N.t : text => text;

  /* 사례 순서: 0 조희욱(실제 작업), 1 GW컨설팅(자체 콘셉트, 배포됨), 2 Precision Works(자체 콘셉트, 미배포) */
  const WORKS = [
    { id: 'jhw', name: '조희욱', type: '조각가 작가 사이트', url: 'https://jhw.demion.co' },
    { id: 'gw', name: 'GW컨설팅', type: '창업 컨설팅 홈페이지', url: 'https://gw.demion.co', concept: true },
    { id: 'precision', name: 'Precision Works', type: '정밀 가공 기업 홈페이지' },
  ];

  /* ---------- 작업 상세의 전체 화면 ---------- */
  const SHOTS = {};

  /* 실제 작업은 배포된 사이트의 전체 화면 캡처를 쓴다 (데스크톱 1280, 모바일 390@2x) */
  SHOTS.jhw = `<div class="scr shot">
    <img class="shot-d" src="img/work-jhw-d.jpg" width="1280" height="6185" alt="" loading="lazy">
    <img class="shot-m" src="img/work-jhw-m.jpg" width="390" height="5846" alt="" loading="lazy">
  </div>`;
  SHOTS.gw = `<div class="scr shot">
    <img class="shot-d" src="img/work-gw-d.jpg" width="1280" height="7161" alt="" loading="lazy">
    <img class="shot-m" src="img/work-gw-m.jpg" width="390" height="8234" alt="" loading="lazy">
  </div>`;

  SHOTS.precision = `<div class="scr shot">
    <img class="shot-d" src="img/work-precision-d.jpg" width="1280" height="12800" alt="" loading="lazy">
    <img class="shot-m" src="img/work-precision-m.jpg" width="390" height="11070" alt="" loading="lazy">
  </div>`;

  const ro = new ResizeObserver(entries => entries.forEach(e => fit(e.target)));

  function fit(frame) {
    const s = frame.clientWidth / +frame.dataset.w;
    frame.style.setProperty('--s', s);
    const page = $('.scr', frame);
    if (page) frame.style.setProperty('--ph', page.offsetHeight * s);
  }

  function mount(frame, id, kind) {
    const wrap = document.createElement('div');
    wrap.innerHTML = SHOTS[id];
    const node = wrap.firstElementChild;
    if (kind === 'm') node.classList.add('m');
    node.inert = true;
    node.setAttribute('aria-hidden', 'true');
    frame.dataset.w = kind === 'm' ? 390 : 1280;
    $('.sizer', frame).replaceChildren(node);
    fit(frame);
    setTimeout(() => frame.classList.add('ready'), 40);
  }

  /* ---------- 작업 상세 ---------- */
  const viewer = $('#viewer');
  const frame = $('#v-frame');
  const segs = $$('.seg button');
  let vi = 0, vk = 'd';
  ro.observe(frame);

  function renderViewer() {
    const w = WORKS[vi];
    $('#v-title').textContent = T(w.name);
    $('#v-type').textContent = T(w.type);
    const own = $('#v-own');
    if (w.url) own.innerHTML = `${T(w.concept ? '자체 콘셉트 ·' : '실제 작업')} <a href="${w.url}" target="_blank" rel="noopener">${w.url.replace('https://', '')} ↗</a>`;
    else own.textContent = T(w.note || '자체 콘셉트이며 실제 고객 작업이 아닙니다');
    segs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === vk)));
    frame.classList.toggle('is-m', vk === 'm');
    frame.setAttribute('aria-label', `${T(w.name)} ${T(vk === 'm' ? '모바일' : '데스크톱')} ${T('전체 화면')}`);
    frame.scrollTop = 0;
    frame.classList.remove('ready');
    mount(frame, w.id, vk);
  }

  function openViewer(i, kind) {
    vi = i; vk = kind;
    viewer.showModal();
    renderViewer();
  }

  $$('.open-work').forEach(b => b.addEventListener('click', () => {
    const kind = b.dataset.kind || (matchMedia('(max-width: 640px)').matches ? 'm' : 'd');
    openViewer(+b.dataset.work, kind);
  }));
  segs.forEach(b => b.addEventListener('click', () => { vk = b.dataset.v; renderViewer(); }));
  $('#v-prev').addEventListener('click', () => { vi = (vi + WORKS.length - 1) % WORKS.length; renderViewer(); });
  $('#v-next').addEventListener('click', () => { vi = (vi + 1) % WORKS.length; renderViewer(); });
  $('#v-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') $('#v-prev').click();
    else if (e.key === 'ArrowRight') $('#v-next').click();
  });

  /* ---------- 개발 사례 목록: 마우스를 올리면 사이트 전체를 천천히 내려 보여준다 ---------- */
  const canHover = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 641px)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  $$('.screen').forEach(screen => {
    let page = null;
    let inside = false;
    const roll = () => {
      if (!inside || !page.naturalWidth) return;
      const dist = page.offsetHeight - screen.clientHeight + page.offsetTop;
      if (dist <= 0) return;
      screen.classList.add('is-rolling');
      page.style.transitionDuration = `${Math.max(8, dist / 260)}s, .3s`;
      page.style.transform = `translateY(${-dist}px)`;
    };
    screen.addEventListener('pointerenter', () => {
      if (!canHover.matches || calm.matches) return;
      inside = true;
      if (!page) {
        page = new Image();
        page.className = 'roll';
        page.alt = '';
        page.addEventListener('load', roll);
        page.src = screen.dataset.full;
        screen.append(page);
      } else roll();
    });
    screen.addEventListener('pointerleave', () => {
      inside = false;
      screen.classList.remove('is-rolling');
      if (page) { page.style.transitionDuration = '.7s, .3s'; page.style.transform = ''; }
    });
  });

  /* 목록 카드 등장 */
  const cards = $$('.case');
  if (cards.length && 'IntersectionObserver' in window && !calm.matches) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    cards.forEach(c => { c.classList.add('will-in'); io.observe(c); });
  }
})();
