// GW컨설팅 — 스크롤 릴, 가로 트랙, 등장 효과, 상담 폼
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const span = (p, a, b) => clamp((p - a) / (b - a));

  // 스크롤 위치 → 0..1 진행도 (sticky 구간 기준)
  const progressOf = el => {
    const r = el.getBoundingClientRect();
    const run = r.height - innerHeight;
    return run > 0 ? clamp(-r.top / run) : 0;
  };

  /* ── 첫 화면 릴 ── */
  const reel = document.querySelector('.reel');
  const stage = reel.querySelector('.stage');
  const dist = stage.querySelector('[data-dist]');
  const track = stage.querySelector('.s-track');
  const words = [...stage.querySelectorAll('.words span')];
  const stairs = [...stage.querySelectorAll('.stair-grid p')].map(p => [...p.children]);
  const final = stage.querySelector('.s-final');
  const bar = stage.querySelector('.reel-progress');

  // 장면 경계: 1 포스터 · 2 반전 · 3 트랙 · 4 주황 · 5 계단 · 6 노을
  const cuts = [0, .12, .24, .42, .60, .80];
  const wordAt = [.44, .47, .51, .54, .57];
  let last = {};

  const set = (key, val, fn) => { if (last[key] !== val) { last[key] = val; fn(val); } };

  function drawReel() {
    const p = progressOf(reel);
    let scene = 1;
    for (let i = cuts.length - 1; i >= 0; i--) if (p >= cuts[i]) { scene = i + 1; break; }
    set('scene', scene, v => stage.dataset.scene = v);
    set('bar', p.toFixed(3), v => bar.style.setProperty('--p', v));

    if (scene === 2) set('dist', Math.round(ease(span(p, .12, .23)) * 100), v => dist.textContent = v);
    if (scene === 3) set('r', ease(span(p, .25, .39)).toFixed(3), v => track.style.setProperty('--r', v));
    if (scene === 4) words.forEach((w, i) => w.classList.toggle('on', p >= wordAt[i]));
    if (scene === 5) {
      const t = span(p, .61, .77);
      stairs.forEach((lines, g) => {
        const n = Math.floor(clamp(t * 1.15 - g * .05) * (lines.length + 1));
        lines.forEach((l, i) => l.classList.toggle('on', i < n));
      });
    }
    if (scene === 6) set('f', ease(span(p, .80, .94)).toFixed(3), v => final.style.setProperty('--f', v));
  }

  /* ── 진행 과정: 세로 스크롤을 가로 이동으로 ── */
  const run = document.querySelector('.run');
  const runTrack = run.querySelector('.run-track');
  const splits = run.querySelector('.splits');

  function measureRun() {
    const shift = Math.max(0, splits.scrollWidth - innerWidth + parseFloat(getComputedStyle(splits).paddingLeft));
    runTrack.style.setProperty('--shift', shift + 'px');
  }
  function drawRun() {
    set('x', ease(span(progressOf(run), .08, .92)).toFixed(4), v => runTrack.style.setProperty('--x', v));
  }

  /* ── 헤더 톤: 헤더 아래에 있는 구간의 배경색을 따른다 ── */
  const head = document.querySelector('.site-head');
  const sceneTone = { 1: 'dark', 2: 'light', 3: 'light', 4: 'signal', 5: 'signal', 6: 'signal' };
  const zones = [
    [reel, () => sceneTone[stage.dataset.scene]],
    [document.querySelector('.about'), () => 'dark'],
    [document.querySelector('.lanes-sec'), () => 'light'],
    [run, () => 'light'],
    [document.querySelector('.record'), () => 'dark'],
    [document.querySelector('.contact'), () => 'contact'],
    [document.querySelector('.site-foot'), () => 'light'],
  ];
  function drawHead() {
    const y = head.offsetHeight / 2;
    const hit = zones.find(([el]) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    set('tone', hit ? hit[1]() : 'dark', v => head.dataset.tone = v);
    // 릴을 지나면 헤더 뒤에 그 구간 배경을 깔아 본문과 겹치지 않게
    const bg = hit && hit[0] !== reel ? getComputedStyle(hit[0]).backgroundColor : 'transparent';
    set('bg', bg, v => head.style.setProperty('--head-bg', v));
  }

  /* ── rAF 한 번에 묶어서 그리기 ── */
  let ticking = false;
  const frame = () => { ticking = false; drawReel(); drawRun(); drawHead(); };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

  if (reduce) {
    stage.dataset.scene = 1;
  } else {
    measureRun();
    frame();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', () => { measureRun(); request(); });
  }

  /* ── 등장 효과 + 숫자 카운트 ── */
  const countUp = el => {
    const to = +el.dataset.count;
    const from = to > 1000 ? to - 24 : 0;
    const t0 = performance.now();
    const step = now => {
      const t = clamp((now - t0) / 1400);
      el.textContent = Math.round(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const n = e.target.querySelector('[data-count]');
      if (n && !reduce) countUp(n);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sib.indexOf(el), 6) * 0.07 + 's');
    io.observe(el);
  });

  /* ── 상담 폼: /api/inquiry(Worker)로 보내면 운영자 메일함으로 간다 ── */
  const form = document.getElementById('apply');
  const note = form.querySelector('.form-note');
  const btn = form.querySelector('button[type=submit]');
  const FAIL = {
    no_consent: '개인정보 수집·이용에 동의해 주세요.',
    invalid: '이름과 연락처를 확인해 주세요.',
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const miss = !d.name.trim() ? 'name' : !d.reach.trim() ? 'reach' : !d.agree ? 'agree' : '';
    if (miss) {
      note.textContent = miss === 'agree' ? FAIL.no_consent : '이름과 연락처를 적어 주세요.';
      form.querySelector(`[name=${miss}]`).focus();
      return;
    }
    btn.disabled = true;
    note.textContent = '보내는 중입니다…';
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      const res = await r.json().catch(() => ({}));
      if (!r.ok || !res.ok) throw new Error(res.error || r.status);
      form.reset();
      note.textContent = '신청이 접수됐습니다. 남겨 주신 연락처로 곧 연락드릴게요.';
    } catch (err) {
      note.textContent = FAIL[err.message] || '지금은 접수가 되지 않습니다. 잠시 뒤 다시 시도해 주세요.';
    } finally {
      btn.disabled = false;
    }
  });
})();
