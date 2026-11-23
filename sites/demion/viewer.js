/* 작업 상세 보기. 메인과 개발 사례 페이지가 함께 쓴다.
   새 작업을 추가할 때: WORKS와 SHOTS에 한 항목씩 넣고, works.html에 카드를 하나 복사한다. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = window.I18N ? I18N.t : text => text;

  /* MUSUBI는 4개 언어 사이트다. demion을 보고 있는 언어와 같은 언어 페이지·캡처를 보여 준다
     (demion ko → musubi /ko/, en → /en/, ja → / , zh → /zh/) */
  const LANG = (window.I18N && I18N.lang) || 'ko';
  const MUSUBI_PATH = { ko: '/ko/', en: '/en/', ja: '/', zh: '/zh/' };
  const ML = MUSUBI_PATH[LANG] ? LANG : 'ko';
  const MUSUBI_URL = 'https://musubi.demion.co' + MUSUBI_PATH[ML];
  /* 전체 화면 캡처 높이 (데스크톱 1280 폭, 모바일 390@2x) */
  const MUSUBI_H = { ko: [7175, 17470], en: [7057, 17900], ja: [7052, 17654], zh: [7022, 17100] }[ML];

  /* 사례 순서: 0 조희욱(실제 작업), 1 GW컨설팅(자체 콘셉트, 배포됨), 2 Precision Works(자체 콘셉트, 미배포), 3 MUSUBI(자체 콘셉트, 배포됨) */
  const WORKS = [
    { id: 'jhw', name: '조희욱', type: '조각가 작가 사이트', url: 'https://jhw.demion.co' },
    { id: 'gw', name: 'GW컨설팅', type: '창업 컨설팅 홈페이지', url: 'https://gw.demion.co', concept: true },
    { id: 'precision', name: 'Precision Works', type: '정밀 가공 기업 홈페이지' },
    { id: 'musubi', name: 'MUSUBI', type: 'IT 마케팅 회사 홈페이지 · 4개 언어', url: MUSUBI_URL, concept: true },
  ];

  /* 개발 사례 카드의 MUSUBI 캡처·링크를 지금 언어로 바꾼다 (HTML에는 한국어판이 적혀 있다) */
  $$('[data-musubi]').forEach(el => {
    if (el.dataset.full) el.dataset.full = `/img/work-musubi-${ML}-d.jpg`;
    if (el.matches('source[srcset*="-d."], img[src*="-d."]')) el[el.tagName === 'IMG' ? 'src' : 'srcset'] = `/img/poster-musubi-${ML}-d.webp`;
    if (el.tagName === 'A') el.href = MUSUBI_URL;
  });

  /* ---------- 작업 상세의 전체 화면 ---------- */
  const SHOTS = {};

  /* 실제 작업은 배포된 사이트의 전체 화면 캡처를 쓴다 (데스크톱 1280, 모바일 390@2x) */
  SHOTS.jhw = `<div class="scr shot">
    <img class="shot-d" src="/img/work-jhw-d.jpg" width="1280" height="6185" alt="" loading="lazy">
    <img class="shot-m" src="/img/work-jhw-m.jpg" width="390" height="5846" alt="" loading="lazy">
  </div>`;
  SHOTS.gw = `<div class="scr shot">
    <img class="shot-d" src="/img/work-gw-d.jpg" width="1280" height="7161" alt="" loading="lazy">
    <img class="shot-m" src="/img/work-gw-m.jpg" width="390" height="8234" alt="" loading="lazy">
  </div>`;

  SHOTS.precision = `<div class="scr shot">
    <img class="shot-d" src="/img/work-precision-d.jpg" width="1280" height="12800" alt="" loading="lazy">
    <img class="shot-m" src="/img/work-precision-m.jpg" width="390" height="11070" alt="" loading="lazy">
  </div>`;

  SHOTS.musubi = `<div class="scr shot">
    <img class="shot-d" src="/img/work-musubi-${ML}-d.jpg" width="1280" height="${MUSUBI_H[0]}" alt="" loading="lazy">
    <img class="shot-m" src="/img/work-musubi-${ML}-m.jpg" width="390" height="${MUSUBI_H[1] / 2}" alt="" loading="lazy">
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
    if (w.url) own.innerHTML = `${T(w.concept ? '자체 콘셉트 ·' : '실제 작업')} <a href="${w.url}" target="_blank" rel="noopener">${new URL(w.url).host} ↗</a>`;
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
