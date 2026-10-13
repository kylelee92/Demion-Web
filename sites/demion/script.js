(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- 문의 접수 경로 ----------
     worker/index.js가 받아 운영자 메일로 보낸다 (Cloudflare Email Routing).
     비우면 실제로 전송하지 않고 "전송하지 못했습니다" 상태를 보여준다. 성공한 것처럼 표시하지 않는다. */
  const ENDPOINT = '/api/inquiry';

  /* 사례 순서: 0 소담 도예, 1 해무 스테이, 2 마루 */
  const WORKS = [
    { id: 'a', name: '소담 도예', type: '도자기 공방 브랜드 사이트' },
    { id: 'b', name: '해무 스테이', type: '바닷가 숙소 홈페이지' },
    { id: 'c', name: '마루', type: '매출 정산 서비스 소개 페이지' },
  ];

  /* ---------- 축소 프레임 ---------- */
  document.body.insertAdjacentHTML('afterbegin', window.DEMION.defs);

  const ro = new ResizeObserver(entries => entries.forEach(e => fit(e.target)));

  function fit(frame) {
    const s = frame.clientWidth / +frame.dataset.w;
    frame.style.setProperty('--s', s);
    const page = $('.scr', frame);
    if (page) frame.style.setProperty('--ph', page.offsetHeight * s);
  }

  function mount(frame, id, kind) {
    const wrap = document.createElement('div');
    wrap.innerHTML = window.DEMION.html[id];
    const node = wrap.firstElementChild;
    if (kind === 'm') node.classList.add('m');
    node.inert = true;
    node.setAttribute('aria-hidden', 'true');
    frame.dataset.w = kind === 'm' ? 390 : 1280;
    $('.sizer', frame).replaceChildren(node);
    fit(frame);
    setTimeout(() => frame.classList.add('ready'), 40);
  }

  /* 좁은 화면에서는 데스크톱 시안 대신 같은 작업의 모바일 화면을 보여준다 */
  const narrow = matchMedia('(max-width: 640px)');
  const place = () => $$('.fit[data-case]').forEach(f => {
    const kind = narrow.matches && f.dataset.narrow ? f.dataset.narrow : f.dataset.kind;
    if (f.dataset.shown !== kind) { f.dataset.shown = kind; mount(f, f.dataset.case, kind); }
  });
  place();
  narrow.addEventListener('change', place);
  $$('.fit[data-case]').forEach(f => ro.observe(f));
  document.fonts && document.fonts.ready.then(() => $$('.fit').forEach(fit));

  /* ---------- 첫 화면 휠 ----------
     첫 화면이 보이지 않으면 휠을 멈추고, 지나가면 헤더에 바탕을 깐다 */
  const hero = $('.hero');
  const site = $('.site');
  new IntersectionObserver(([e]) => hero.classList.toggle('is-off', !e.isIntersecting)).observe(hero);
  new IntersectionObserver(([e]) => site.classList.toggle('is-solid', !e.isIntersecting),
    { rootMargin: '-56px 0px 0px 0px', threshold: 0.08 }).observe(hero);

  /* ---------- 작업 상세 ---------- */
  const viewer = $('#viewer');
  const frame = $('#v-frame');
  const segs = $$('.seg button');
  let vi = 0, vk = 'd';
  ro.observe(frame);

  function renderViewer() {
    const w = WORKS[vi];
    $('#v-title').textContent = w.name;
    $('#v-type').textContent = w.type;
    segs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === vk)));
    frame.classList.toggle('is-m', vk === 'm');
    frame.setAttribute('aria-label', w.name + (vk === 'm' ? ' 모바일' : ' 데스크톱') + ' 전체 화면');
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

  /* ---------- 문의 패널 ---------- */
  const panel = $('#contact-panel');
  const form = $('#inquiry');
  const done = $('#done');
  const submit = $('#submit');
  const label = $('.btn-label', submit);
  const failBox = $('#banner-fail');
  const failText = $('#fail-text');
  const flag = $('#preview-flag');

  $$('[data-open-contact]').forEach(b => b.addEventListener('click', () => {
    if (viewer.open) viewer.close();
    if (!panel.open) panel.showModal();
    if (!form.hidden) $('#f-name').focus();
  }));
  $('#panel-close').addEventListener('click', () => panel.close());
  panel.addEventListener('click', e => { if (e.target === panel) panel.close(); });

  const MSG = {
    name: '이름 또는 회사명을 입력해주세요.',
    email: '이메일을 입력해주세요.',
    emailBad: '이메일 형식을 확인해주세요. 예: name@example.com',
    url: '주소 형식을 확인해주세요. 예: example.com',
    refs: '주소 형식을 확인해주세요. 여러 개는 쉼표로 나눠주세요. 예: example.com, sample.co.kr',
    message: '의뢰 내용을 간단히 적어주세요.',
    agree: '개인정보 수집·이용에 동의해주셔야 문의를 보낼 수 있습니다.',
  };

  function setErr(field, msg) {
    const wrap = $(`[data-field="${field}"]`);
    $('.err', wrap).textContent = msg || '';
    wrap.classList.toggle('invalid', !!msg);
    $('input, textarea', wrap).setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function isSite(v) {
    try { return new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v).hostname.includes('.'); }
    catch { return false; }
  }

  function validate() {
    const d = new FormData(form);
    const errs = {};
    if (!String(d.get('name')).trim()) errs.name = MSG.name;
    const email = String(d.get('email')).trim();
    if (!email) errs.email = MSG.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = MSG.emailBad;
    const url = String(d.get('url')).trim();
    if (url && !isSite(url)) errs.url = MSG.url;
    const refs = String(d.get('refs')).split(/[,\s]+/).filter(Boolean);
    if (refs.some(r => !isSite(r))) errs.refs = MSG.refs;
    if (!String(d.get('message')).trim()) errs.message = MSG.message;
    if (!d.get('agree')) errs.agree = MSG.agree;
    ['name', 'email', 'url', 'refs', 'message', 'agree'].forEach(f => setErr(f, errs[f]));
    return errs;
  }

  function setState(state, detail) {
    form.classList.toggle('sending', state === 'sending');
    $$('input, textarea', form).forEach(el => { el.readOnly = state === 'sending'; });
    submit.disabled = state === 'sending';
    submit.setAttribute('aria-busy', String(state === 'sending'));
    label.textContent = state === 'sending' ? '보내는 중' : state === 'fail' ? '다시 보내기' : '문의 보내기';
    failBox.hidden = state !== 'fail';
    if (state === 'fail') failText.textContent = detail || '잠시 후 다시 시도해주세요. 입력하신 내용은 그대로 남아 있습니다.';
    const isDone = state === 'done';
    form.hidden = isDone;
    done.hidden = !isDone;
    if (isDone) done.focus();
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    setState('idle');
    const errs = validate();
    const first = Object.keys(errs)[0];
    if (first) { $('input, textarea', $(`[data-field="${first}"]`)).focus(); return; }
    if (!ENDPOINT) {
      setState('fail', '아직 문의 접수 경로가 연결되지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (res.status === 503) {
        setState('fail', '문의 접수 설정이 아직 끝나지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.');
        return;
      }
      if (!res.ok) throw new Error(res.status);
      form.reset();
      setState('done');
    } catch {
      setState('fail');
    }
  });

  $$('input, textarea', form).forEach(el => el.addEventListener('input', () => {
    const f = el.closest('[data-field]');
    if (f && f.classList.contains('invalid')) setErr(f.dataset.field, '');
  }));
  $('#again').addEventListener('click', () => { flag.hidden = true; setState('idle'); $('#f-name').focus(); });

  /* 디자인 확인용: ?state=error | sending | fail | done  (패널이 자동으로 열린다) */
  const preview = new URLSearchParams(location.search).get('state');
  if (preview) {
    const fill = () => { $('#f-name').value = '하루치 베이커리'; $('#f-email').value = 'hello@example.com'; $('#f-message').value = '동네 빵집 홈페이지를 새로 만들고 싶습니다.'; };
    flag.hidden = false;
    panel.showModal();
    if (preview === 'error') { $('#f-email').value = 'name@'; validate(); }
    else if (preview === 'sending') { fill(); setState('sending'); }
    else if (preview === 'fail') { fill(); setState('fail'); }
    else if (preview === 'done') setState('done');
  }
})();
