(() => {
  const root = document.documentElement;
  root.classList.add('js');

  // 내비: 히어로를 벗어나면 배경을 깔고, 눈금이 스크롤 위치를 읽는다
  const head = document.querySelector('[data-head]');
  const hero = document.querySelector('.hero');
  const progress = document.querySelector('[data-progress]');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    head.classList.toggle('is-solid', hero.getBoundingClientRect().bottom <= head.offsetHeight);
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // 모바일 메뉴: 열려 있는 동안 뒤쪽 콘텐츠는 초점을 받지 않는다
  const menuBtn = document.querySelector('[data-menu]');
  const behind = [document.getElementById('main'), document.querySelector('.site-foot')];
  const setMenu = (open) => {
    head.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = open ? 'hidden' : '';
    behind.forEach((el) => { el.inert = open; });
  };
  menuBtn.addEventListener('click', () => setMenu(!head.classList.contains('is-open')));
  document.querySelectorAll('#site-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  head.querySelector('.wordmark').addEventListener('click', () => setMenu(false));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && head.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // 스크롤 진입 + 현재 섹션 표시
  const targets = document.querySelectorAll('[data-reveal], [data-wipe]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => io.observe(el));

    const navLinks = [...document.querySelectorAll('#site-nav a:not(.nav-cta)')];
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === `#${en.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'philosophy', 'capabilities', 'materials', 'equipment', 'works', 'company', 'contact']
      .forEach((id) => spy.observe(document.getElementById(id)));
  } else {
    targets.forEach((el) => el.classList.add('in'));
  }

  // 소재 인덱스: 데스크톱은 가리키면 사진이 바뀌고, 모바일은 아코디언
  const mats = [...document.querySelectorAll('[data-mats] .mat')];
  const compact = matchMedia('(max-width: 860px)');
  const setMat = (mat) => {
    mats.forEach((m) => {
      const on = m === mat;
      m.classList.toggle('is-active', on);
      m.querySelector('.mat-btn').setAttribute('aria-expanded', on);
    });
  };
  mats.forEach((mat) => {
    const btn = mat.querySelector('.mat-btn');
    btn.addEventListener('click', () => {
      setMat(compact.matches && mat.classList.contains('is-active') ? null : mat);
    });
    btn.addEventListener('focus', () => { if (!compact.matches) setMat(mat); });
    mat.addEventListener('mouseenter', () => { if (!compact.matches) setMat(mat); });
  });
  compact.addEventListener('change', () => {
    if (!mats.some((m) => m.classList.contains('is-active'))) setMat(mats[0]);
  });

  // 제품 갤러리 라이트박스
  const box = document.getElementById('lightbox');
  const items = [...document.querySelectorAll('[data-gallery] .w')];
  const lbImg = new Image();
  box.querySelector('.lb-fig').prepend(lbImg);
  const lbCap = box.querySelector('[data-lb-cap]');
  const lbCount = box.querySelector('[data-lb-count]');
  let current = 0;
  const show = (i) => {
    current = (i + items.length) % items.length;
    const img = items[current].querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.alt;
    lbCap.innerHTML = items[current].querySelector('figcaption').innerHTML;
    lbCount.textContent = `${current + 1} / ${items.length}`;
  };
  items.forEach((item, i) => {
    item.querySelector('.w-open').addEventListener('click', () => {
      show(i);
      box.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  box.addEventListener('close', () => { document.body.style.overflow = ''; });
  box.addEventListener('click', (e) => {
    const action = e.target.closest('[data-lb]')?.dataset.lb;
    if (action === 'close') box.close();
    else if (action === 'prev') show(current - 1);
    else if (action === 'next') show(current + 1);
    else if (e.target === box || e.target.classList.contains('lb-fig')) box.close();
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  let touchX = null;
  box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 48) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // 견적 상담 폼: 프런트엔드 동작 예시이며 네트워크로 아무것도 보내지 않는다
  const form = document.getElementById('inquiry');
  const done = document.getElementById('done');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.querySelector('[data-label]');
  const idleLabel = submitLabel.textContent;
  const fields = [...form.querySelectorAll('[required]')];

  const check = (input) => {
    const err = document.getElementById(`e-${input.id.slice(2)}`);
    let msg = '';
    if (!input.value.trim()) msg = err.dataset.msg;
    else if (input.type === 'email' && !input.validity.valid) msg = err.dataset.msgFormat;
    err.textContent = msg;
    input.closest('.field').classList.toggle('has-err', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };

  fields.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('has-err')) check(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = fields.filter((input) => !check(input));
    if (bad.length) { bad[0].focus(); return; }
    submit.setAttribute('aria-busy', 'true');
    submit.disabled = true;
    submitLabel.textContent = '確認しています…';
    setTimeout(() => {
      form.hidden = true;
      done.hidden = false;
      done.focus();
      submit.removeAttribute('aria-busy');
      submit.disabled = false;
      submitLabel.textContent = idleLabel;
    }, 700);
  });

  document.getElementById('reset').addEventListener('click', () => {
    form.reset();
    done.hidden = true;
    form.hidden = false;
    fields[0].focus();
  });
})();
