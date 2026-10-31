(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = window.I18N ? I18N.t : text => text;

  /* ---------- 문의 접수 경로 ----------
     worker/index.js가 받아 운영자 메일로 보낸다 (Cloudflare Email Routing).
     비우면 실제로 전송하지 않고 "전송하지 못했습니다" 상태를 보여준다. 성공한 것처럼 표시하지 않는다. */
  const ENDPOINT = '/api/inquiry';

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
    const viewer = $('#viewer');
    if (viewer && viewer.open) viewer.close();
    if (!panel.open) panel.showModal();
    if (!form.hidden) $('#f-name').focus();
  }));
  $('#panel-close').addEventListener('click', () => panel.close());
  panel.addEventListener('click', e => { if (e.target === panel) panel.close(); });

  const MSG = {
    name: T('이름 또는 회사명을 입력해주세요.'),
    email: T('이메일을 입력해주세요.'),
    emailBad: T('이메일 형식을 확인해주세요. 예: name@example.com'),
    url: T('주소 형식을 확인해주세요. 예: example.com'),
    refs: T('주소 형식을 확인해주세요. 여러 개는 쉼표로 나눠주세요. 예: example.com, sample.co.kr'),
    message: T('의뢰 내용을 간단히 적어주세요.'),
    agree: T('개인정보 수집·이용에 동의해주셔야 문의를 보낼 수 있습니다.'),
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
    label.textContent = T(state === 'sending' ? '보내는 중' : state === 'fail' ? '다시 보내기' : '문의 보내기');
    failBox.hidden = state !== 'fail';
    if (state === 'fail') failText.textContent = detail || T('잠시 후 다시 시도해주세요. 입력하신 내용은 그대로 남아 있습니다.');
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
      setState('fail', T('아직 문의 접수 경로가 연결되지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.'));
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
        setState('fail', T('문의 접수 설정이 아직 끝나지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.'));
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

  /* 다른 페이지의 문의 버튼은 /#inquiry 로 들어와 패널을 바로 연다 */
  if (location.hash === '#inquiry') {
    panel.showModal();
    $('#f-name').focus();
    history.replaceState(null, '', location.pathname + location.search);
  }

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
