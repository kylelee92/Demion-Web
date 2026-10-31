/* 스크롤 무대: 퀄리티 → 하루 → 결제 → 신청 순서의 대화를 스크롤로 조종한다.
   GSAP을 불러오지 못하거나 움직임 줄이기 설정이면 html.motion을 붙이지 않아 세로 흐름 그대로 읽힌다. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* 가로로 눕힌 휴대폰처럼 낮은 화면은 무대를 담을 수 없어 세로 흐름으로 읽게 한다 */
  const tall = matchMedia('(min-height: 520px)');
  tall.addEventListener('change', () => location.reload());
  if (!tall.matches) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.classList.add('motion');
  gsap.registerPlugin(ScrollTrigger);
  /* 모바일 주소창이 접힐 때 장면을 다시 계산하지 않는다 */
  ScrollTrigger.config({ ignoreMobileResize: true });
  /* 대화는 처음부터 읽어야 이어지므로 새로고침하면 맨 위에서 시작한다 */
  ScrollTrigger.clearScrollMemory('manual');

  /* ---------- 부드러운 스크롤 ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    /* 대화상자가 열려 있는 동안 뒤 페이지를 멈춘다 */
    const sync = () => (document.querySelector('dialog[open]') ? lenis.stop() : lenis.start());
    $$('dialog').forEach(d => new MutationObserver(sync).observe(d, { attributes: true, attributeFilter: ['open'] }));
    document.addEventListener('site-menu', e => (e.detail ? lenis.stop() : sync()));
    /* 고정 장면이 페이지 길이를 늘린 뒤에도 Lenis가 예전 길이를 기억하지 않게 한다 */
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  }

  /* 글자 단위 등장을 위해 한 줄을 어절·글자로 나눈다 (읽는 내용은 그대로 둔다) */
  function chars(el) {
    const src = (el.dataset.raw || el.textContent).trim();
    el.setAttribute('aria-label', src.replace(/\|/g, ''));
    el.textContent = '';
    /* 공백은 띄어 쓰고, | 는 일본어처럼 띄어쓰기 없이 줄만 바꿀 수 있는 자리다 */
    src.split(/(\s+|\|)/).forEach(part => {
      if (part === '|') return;
      if (!part.trim()) { el.append(' '); return; }
      const word = document.createElement('span');
      word.className = 'chars';
      word.setAttribute('aria-hidden', 'true');
      [...part].forEach(c => { const i = document.createElement('i'); i.textContent = c; word.append(i); });
      el.append(word);
    });
    return $$('i', el);
  }
  const lineChars = q => $$(':scope > span', q).flatMap(chars);

  /* ---------- 장면 1: 첫 화면 → 선택작 3점 ---------- */
  const stage = $('[data-stage]');
  const intro = $('[data-intro]');
  const slides = $$('[data-slide]');
  const pageDist = slide => {
    const page = $('.page', slide);
    const frame = $('.frame', slide);
    /* 맛보기라 화면 한 번 분량만 내려 보여준다 */
    return Math.min(frame.offsetHeight * .9, Math.max(0, page.offsetHeight - frame.offsetHeight));
  };

  const stageTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stage, start: 'top top', end: () => `+=${innerHeight * 3}`, pin: true, scrub: .6, invalidateOnRefresh: true },
  });

  const more = $('[data-more]', stage);
  gsap.set(more, { autoAlpha: 0 });
  const lines = $$('h1 .ln', intro);
  const first = slides[0];
  /* 첫 작품은 화면 아래에 머리만 내밀고 있다 */
  gsap.set($('.frame', first), { y: () => innerHeight / 2 + $('.frame', first).offsetHeight * .31 - 56, scale: .62 });
  gsap.set($('.slide-cap', first), { autoAlpha: 0 });
  gsap.set($('.slide-num', first), { autoAlpha: 0 });
  gsap.set($('.slide-name', first), { autoAlpha: 0 });
  gsap.set(slides.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
  slides.slice(1).forEach(s => gsap.set($('.frame', s), { y: () => innerHeight * .34, rotateX: 16, transformPerspective: 1600 }));

  stageTl
    .to(window.HeroField ? window.HeroField.state : {}, { scatter: 1, duration: .85, ease: 'power2.in', onUpdate: () => window.HeroField && window.HeroField.wake() }, 0)
    .to(lines[0], { xPercent: -14, autoAlpha: 0, duration: .8 }, 0)
    .to(lines[1], { xPercent: 10, autoAlpha: 0, duration: .8 }, 0)
    .to($('.intro-side', intro), { y: -60, autoAlpha: 0, duration: .5 }, 0)
    .to($('.frame', first), { y: 0, scale: 1, duration: 1, ease: 'power2.out' }, 0)
    .to(first, { backgroundColor: 'rgb(212 208 198 / 1)', duration: .7 }, .3)
    .to([$('.slide-cap', first), $('.slide-num', first)], { autoAlpha: 1, duration: .3 }, .75)
    .to($('.slide-name', first), { autoAlpha: .16, duration: .4 }, .7)
    .set($('.reel', stage), { pointerEvents: 'auto' }, .5)
    .set(intro, { pointerEvents: 'none' }, .5)
    .to(more, { autoAlpha: 1, duration: .3 }, .8)
    .addLabel('work', 1);

  slides.forEach((slide, n) => {
    const at = n === 0 ? 1 : 1 + n * 1.1;
    if (n > 0) {
      const prev = slides[n - 1];
      stageTl
        .to(slide, { clipPath: 'inset(0% 0% 0% 0%)', duration: .5, ease: 'power2.inOut' }, at - .5)
        .to($('.frame', slide), { y: 0, rotateX: 0, duration: .6, ease: 'power2.out' }, at - .5)
        .to($('.frame', prev), { scale: .9, duration: .5, ease: 'power2.in' }, at - .5);
    }
    stageTl
      .to($('.page', slide), { y: () => -pageDist(slide), duration: n === 2 ? .9 : .6 }, at)
      .fromTo($('.slide-name', slide), { xPercent: 6 }, { xPercent: -30, duration: 1.4 }, at - (n ? .5 : 0));
  });

  /* ---------- 장면 2: 하루 만에 본다고요? ---------- */
  const day = $('[data-day]');
  const dayQ = $('.q', day);
  const dayChars = lineChars(dayQ);
  const arc = $('[data-arc]', day);
  const arcLen = arc.getTotalLength();
  const wires = $$('[data-wire] i', day);
  const shot = $('[data-shot]', day);
  gsap.set(arc, { strokeDasharray: arcLen, strokeDashoffset: arcLen });
  gsap.set(wires, { scaleX: 0 });
  gsap.set(shot, { clipPath: 'inset(0% 100% 0% 0%)' });
  gsap.set($('[data-day-a]', day), { autoAlpha: 0, y: 60 });
  gsap.set(dayChars, { yPercent: 110, autoAlpha: 0 });

  const dayTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: day, start: 'top top', end: () => `+=${innerHeight * 3}`, pin: true, scrub: .6, invalidateOnRefresh: true },
  })
    .to(dayChars, { yPercent: 0, autoAlpha: 1, stagger: .03, duration: .3, ease: 'power3.out' }, 0)
    .to(dayQ, { scale: .8, autoAlpha: 0, duration: .5, ease: 'power2.in' }, 1.05)
    .to($('[data-day-a]', day), { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, 1.3)
    .fromTo($('[data-big]', day), { scale: 1.5, transformOrigin: '0 100%' }, { scale: 1, duration: .6, ease: 'power3.out' }, 1.3)
    .to(arc, { strokeDashoffset: 0, duration: 1.1 }, 1.5)
    .to(wires, { scaleX: 1, stagger: .1, duration: .3, ease: 'power2.out' }, 1.5)
    .to(shot, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'power2.inOut' }, 2.15)
    .addLabel('answer', 2.8)
    .to({}, { duration: .35 });

  /* ---------- 장면 3: 결제는 언제 하나요? 두 단어가 자리를 바꾼다 ---------- */
  const pay = $('[data-pay]');
  const payQ = $('.q', pay);
  const payChars = lineChars(payQ);
  const swap = $('[data-swap]', pay);
  const a = $('[data-tok-a]', pay);
  const b = $('[data-tok-b]', pay);
  const narrow = () => matchMedia('(max-width: 640px)').matches;
  const arrow = $('.arrow', pay);
  const dist = { ax: 0, ay: 0, bx: 0, by: 0, arrow: 0 };
  const measure = () => {
    gsap.set([a, b, arrow], { x: 0, y: 0 });
    const sw = swap.getBoundingClientRect();
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    if (narrow()) { dist.ay = sw.bottom - ra.bottom; dist.by = sw.top - rb.top; dist.ax = sw.right - ra.right; dist.bx = sw.left - rb.left; }
    else { dist.ax = sw.right - ra.right; dist.bx = sw.left - rb.left; dist.ay = 0; dist.by = 0; }
    /* 자리를 바꾼 뒤 두 단어 사이 빈 공간의 가운데로 화살표를 옮긴다 */
    const ar = arrow.getBoundingClientRect();
    dist.arrow = narrow() ? 0 : (sw.left + rb.width + sw.right - ra.width) / 2 - (ar.left + ar.width / 2);
  };
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);
  gsap.set(payChars, { yPercent: 110, autoAlpha: 0 });
  gsap.set([swap, $('[data-pay-text]', pay)], { autoAlpha: 0 });

  const payTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: pay, start: 'top top', end: () => `+=${innerHeight * 3}`, pin: true, scrub: .6, invalidateOnRefresh: true },
  })
    .to(payChars, { yPercent: 0, autoAlpha: 1, stagger: .025, duration: .25, ease: 'power3.out' }, 0)
    .to(swap, { autoAlpha: 1, duration: .25 }, .45)
    .addLabel('swap', .85)
    .to(a, { x: () => dist.ax, y: () => dist.ay, duration: .7, ease: 'power2.inOut' }, 'swap')
    .to(b, { x: () => dist.bx, y: () => dist.by, duration: .7, ease: 'power2.inOut' }, 'swap')
    .to(arrow, { x: () => dist.arrow, duration: .7, ease: 'power2.inOut' }, 'swap')
    .to(a, { keyframes: { scale: [1, .8, 1], rotate: [0, -5, 0] }, duration: .7 }, 'swap')
    .to(b, { keyframes: { scale: [1, 1.1, 1], rotate: [0, 3, 0] }, duration: .7 }, 'swap')
    .to($('[data-pay-text]', pay), { autoAlpha: 1, y: 0, startAt: { y: 30 }, duration: .35, ease: 'power2.out' }, 1.5)
    .addLabel('answer', 2)
    /* 짙은 원이 벌어지며 마지막 장면으로 이어진다 */
    .to($('[data-iris]', pay), { scale: () => Math.hypot(innerWidth, innerHeight) / 5 + 2, duration: .7, ease: 'power2.in' }, 2.35);

  /* ---------- 장면 4: 한번 맡겨볼까요? ---------- */
  const finale = $('[data-finale]');
  const finaleChars = lineChars($('[data-finale-title]', finale));
  gsap.from(finaleChars, {
    yPercent: 120, autoAlpha: 0, stagger: .025, ease: 'power3.out', duration: 1,
    scrollTrigger: { trigger: finale, start: 'top 75%', end: 'top 20%', scrub: .6 },
  });
  gsap.from($('.cta', finale), {
    scaleX: .35, autoAlpha: 0, transformOrigin: '0 50%', ease: 'power3.out',
    scrollTrigger: { trigger: $('.cta', finale), start: 'top 96%', end: 'top 62%', scrub: .6 },
  });
  gsap.from($$('.services li', finale), {
    y: 30, autoAlpha: 0, stagger: .1, ease: 'power2.out',
    scrollTrigger: { trigger: $('.services', finale), start: 'top 95%', end: 'top 70%', scrub: .6 },
  });

  /* ---------- 진행 표시와 헤더 글자색 ---------- */
  const site = $('[data-site]');
  const progress = $('[data-progress]');
  const tone = () => {
    const under = document.elementsFromPoint(innerWidth / 2, 28).find(el => !el.closest('[data-site]') && el.closest('[data-head]'));
    const next = under ? under.closest('[data-head]').dataset.head : 'light';
    /* 첫 슬라이드는 처음에 어둡고 틀이 커지며 밝아진다 */
    const first = under && under.closest('.slide-jhw') && stageTl.time() < .7;
    site.dataset.tone = first ? 'light' : next;
    /* 마지막 장면은 일반 스크롤이라 글자가 헤더 아래로 지나간다 */
    site.classList.toggle('is-solid', !!(under && under.closest('[data-finale], .foot')));
  };
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => { progress.style.transform = `scaleX(${self.progress})`; },
  });
  /* 스크럽은 스크롤이 멈춘 뒤에도 이어지므로 일정 간격으로 다시 읽는다 */
  let toneTick = 0;
  gsap.ticker.add(() => { if (++toneTick % 8 === 0) tone(); });

  /* ---------- 메뉴 이동: 고정된 장면 안의 위치로 스크롤한다 ---------- */
  const go = y => {
    if (!lenis) { scrollTo({ top: y, behavior: 'smooth' }); return; }
    lenis.resize();
    lenis.scrollTo(y, { duration: 1.4, force: true });
  };
  const targetY = id => {
    if (id === 'top') return 0;
    if (id === 'work') return stageTl.scrollTrigger.labelToScroll('work');
    /* 장면 시작점은 글자가 나오기 전이라 비어 있다. 답이 다 보이는 위치로 간다 */
    if (id === 'day') return dayTl.scrollTrigger.labelToScroll('answer');
    if (id === 'pay') return payTl.scrollTrigger.labelToScroll('answer');
    const el = document.getElementById(id);
    if (!el) return null;
    const st = ScrollTrigger.getAll().find(t => t.pin === el);
    return st ? st.start : el.getBoundingClientRect().top + scrollY;
  };
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
    const y = targetY(link.getAttribute('href').slice(1));
    if (y !== null) { e.preventDefault(); go(y); }
  }));
  /* 개발 사례 페이지의 소개·의뢰 방식 링크로 들어온 경우 해당 장면으로 간다 */
  const entry = location.hash.slice(1);
  if (['day', 'pay', 'contact'].includes(entry)) {
    addEventListener('load', () => setTimeout(() => {
      ScrollTrigger.refresh();
      const y = targetY(entry);
      if (y === null) return;
      if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); } else scrollTo(0, y);
    }, 350));
  }

  /* ---------- 작품 위 커서 라벨 ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = window.I18N ? I18N.t('크게 보기') : '크게 보기';
    document.body.append(cursor);
    const x = gsap.quickTo(cursor, 'x', { duration: .35, ease: 'power3' });
    const y = gsap.quickTo(cursor, 'y', { duration: .35, ease: 'power3' });
    addEventListener('pointermove', e => { x(e.clientX - 46); y(e.clientY - 46); });
    $$('.open-work').forEach(b => {
      b.style.cursor = 'none';
      b.addEventListener('pointerenter', () => cursor.classList.add('on'));
      b.addEventListener('pointerleave', () => cursor.classList.remove('on'));
    });
    $$('dialog').forEach(d => new MutationObserver(() => cursor.classList.remove('on')).observe(d, { attributes: true, attributeFilter: ['open'] }));
  }

  /* 긴 이미지가 다 들어오면 스크롤 거리를 다시 잰다 */
  $$('.page, .mock img').forEach(img => { if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }); });
  addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
