/* むすび — hero reveal, scroll reveals, inquiry form */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  const hero = $('.hero');
  const word = $('.word');
  const pill = $('.pill');
  const hair = $('.hair');
  const paper = $('.paper');
  const nav = $('.nav');
  const foot = $('.foot');
  const rule = $('.rule');
  const icons = $$('.ico');
  const video = $('.scene');

  const DUR = 2100;
  const phoneMQ = matchMedia('(max-width: 720px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REC = new URLSearchParams(location.search).get('rec') === '1';

  /* ── background: ~15 white S-curves sweeping up and to the right ── */
  (function drawFlow() {
    const svg = $('.flow');
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 15; i++) {
      const y0 = 380 + i * 52 + rnd() * 60;
      const rise = 520 + rnd() * 380;
      const y1 = y0 - rise;
      const sway = 140 + rnd() * 160;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d',
        `M-120 ${y0.toFixed(1)} C ${(420 + rnd() * 180).toFixed(1)} ${(y0 + sway).toFixed(1)}, ` +
        `${(1080 + rnd() * 180).toFixed(1)} ${(y1 - sway).toFixed(1)}, 1720 ${y1.toFixed(1)}`);
      p.style.strokeWidth = (1.2 + rnd() * 2.7).toFixed(2) + 'px';
      p.style.opacity = (0.55 + rnd() * 0.3).toFixed(2);
      svg.appendChild(p);
    }
  })();

  /* ── the reveal: one 2.1 s timeline made of synchronised animations ── */
  const E1 = 'cubic-bezier(.5,0,.3,1)';
  const E2 = 'cubic-bezier(.45,0,.3,1)';
  const E3 = 'cubic-bezier(.4,0,.2,1)';
  const EO = 'cubic-bezier(.2,.8,.2,1)';
  const opts = { duration: DUR, fill: 'both', easing: 'linear' };

  function build() {
    const fs = parseFloat(getComputedStyle(hero).fontSize);
    const phone = phoneMQ.matches;
    const a = [];

    if (phone) {
      const H = pill.getBoundingClientRect().width / 1.85 || (innerWidth - 40) / 1.85;
      a.push(pill.animate([
        { height: '1.5px', offset: 0 },
        { height: '1.5px', offset: .14, easing: E1 },
        { height: H * .10 + 'px', offset: .30, easing: E2 },
        { height: H * .55 + 'px', offset: .58, easing: E3 },
        { height: H + 'px', offset: 1 },
      ], opts));
      a.push(pill.animate([
        { clipPath: 'inset(0 50%)', offset: 0, easing: E3 },
        { clipPath: 'inset(0 0%)', offset: .14 },
        { clipPath: 'inset(0 0%)', offset: 1 },
      ], opts));
      a.push(word.animate([
        { gap: fs * .03 + 'px', offset: 0 },
        { gap: fs * .03 + 'px', offset: .14, easing: E2 },
        { gap: fs * .06 + 'px', offset: .58, easing: E3 },
        { gap: fs * .10 + 'px', offset: 1 },
      ], opts));
    } else {
      a.push(pill.animate([
        { width: fs * .012 + 'px', offset: 0 },
        { width: fs * .012 + 'px', offset: .14, easing: E1 },
        { width: fs * .16 + 'px', offset: .30, easing: E2 },
        { width: fs * 1.81 + 'px', offset: .58, easing: E3 },
        { width: fs * 3.62 + 'px', offset: 1 },
      ], opts));
      a.push(pill.animate([
        { clipPath: 'inset(50% 0)', offset: 0, easing: E3 },
        { clipPath: 'inset(0% 0)', offset: .14 },
        { clipPath: 'inset(0% 0)', offset: 1 },
      ], opts));
      a.push(word.animate([
        { gap: fs * .026 + 'px', offset: 0 },
        { gap: fs * .026 + 'px', offset: .14, easing: E2 },
        { gap: fs * .05 + 'px', offset: .58, easing: E3 },
        { gap: fs * .085 + 'px', offset: 1 },
      ], opts));
    }

    // the grey hairline is an overlay: it fades, the video never does
    a.push(hair.animate([
      { opacity: 1, offset: 0 }, { opacity: 1, offset: .14, easing: E2 },
      { opacity: 0, offset: .30 }, { opacity: 0, offset: 1 },
    ], opts));
    a.push(paper.animate([
      { opacity: 0, offset: 0 }, { opacity: 0, offset: .45, easing: E3 },
      { opacity: 1, offset: .78 }, { opacity: 1, offset: 1 },
    ], opts));
    a.push(nav.animate([
      { transform: 'translateY(-140%)', offset: 0 },
      { transform: 'translateY(-140%)', offset: .50, easing: EO },
      { transform: 'translateY(0)', offset: .86 }, { transform: 'translateY(0)', offset: 1 },
    ], opts));
    a.push(foot.animate([
      { transform: 'translateY(160%)', offset: 0 },
      { transform: 'translateY(160%)', offset: .52, easing: EO },
      { transform: 'translateY(0)', offset: .90 }, { transform: 'translateY(0)', offset: 1 },
    ], opts));
    a.push(rule.animate([
      { transform: 'scaleX(0)', offset: 0 },
      { transform: 'scaleX(0)', offset: .40, easing: E3 },
      { transform: 'scaleX(1)', offset: .95 }, { transform: 'scaleX(1)', offset: 1 },
    ], opts));
    icons.forEach(el => a.push(el.animate([
      { opacity: 0, offset: 0 }, { opacity: 0, offset: .80, easing: E3 }, { opacity: .85, offset: 1 },
    ], opts)));
    return a;
  }

  let anims = null;
  let busy = false;
  const done = list => Promise.all(list.map(x => x.finished)).catch(() => {});
  // when a run ends, drop the animations so the CSS (in em) holds the final state at any size
  const clear = () => { if (anims) anims.forEach(x => x.cancel()); anims = null; };

  async function intro() {
    busy = true;
    anims = build();
    root.classList.add('ready');
    const run = anims;
    await done(run);
    if (anims === run) clear();
    busy = false;
  }

  // "replay": the same timeline in reverse back to the hairline, then open again
  async function replay() {
    if (busy || reduce) return;
    busy = true;
    anims = build();
    const run = anims;
    run.forEach(x => { x.currentTime = DUR; x.reverse(); });
    await done(run);
    if (anims !== run) { busy = false; return; }
    run.forEach(x => { x.playbackRate = 1; x.currentTime = 0; x.play(); });
    await done(run);
    if (anims === run) clear();
    busy = false;
  }

  // resize: finish whatever is running; CSS resets the pill to its final size
  let rT;
  addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => { if (anims) { clear(); busy = false; } }, 60);
  });

  function startVideo() {
    if (reduce) return;
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }

  const fontReady = Promise.race([
    document.fonts ? document.fonts.load('800 100px Inter') : Promise.resolve(),
    new Promise(r => setTimeout(r, 1500)),
  ]);

  fontReady.then(() => {
    if (reduce) { root.classList.add('ready'); return; }
    startVideo();
    intro();
    if (REC) setTimeout(replay, 4900);
  });

  // frame-by-frame recorder hook
  window.__recVideo = t => {
    const d = video.duration || 6;
    return (t % d) + 1 / 120;
  };

  // replay triggers: the word itself, and "Home" in the nav
  word.addEventListener('click', e => { if (!e.target.closest('.ico-r')) replay(); });
  $('[data-replay]').addEventListener('click', e => {
    e.preventDefault();
    if (scrollY > 10) { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); setTimeout(replay, 500); }
    else replay();
  });

  // speaker icon: only toggles its waves — the clip is silent
  const spk = $('.ico-r');
  spk.addEventListener('click', () => spk.setAttribute('aria-pressed', spk.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'));

  // pause the clip while the hero is off-screen
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) startVideo(); else video.pause();
  }).observe(hero);

  /* ── scroll reveals ── */
  const io = new IntersectionObserver(ents => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach(el => {
    const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sib.indexOf(el), 5) * 0.08 + 's');
    io.observe(el);
  });

  /* ── floating CTA: shown after the hero, hidden over the contact section ── */
  const cta = $('.float-cta');
  const seen = { hero: true, contact: false };
  const sync = () => cta.classList.toggle('on', !seen.hero && !seen.contact);
  new IntersectionObserver(([en]) => { seen.hero = en.isIntersecting; sync(); }, { threshold: .15 }).observe(hero);
  new IntersectionObserver(([en]) => { seen.contact = en.isIntersecting; sync(); }).observe($('#contact'));

  /* ── inquiry form → /api/inquiry (Worker sends the mail) ── */
  const form = $('#inquiry');
  const note = $('.f-note', form);
  const btn = $('button[type=submit]', form);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const T = {
    ja: {
      name: 'お名前をご入力ください。',
      email: 'メールアドレスを正しくご入力ください。',
      invalid: 'お名前とメールアドレスをご確認ください。',
      no_consent: '個人情報保護方針への同意が必要です。',
      sending: '送信しています…',
      ok: 'お問い合わせありがとうございます。2営業日以内に、ご入力のメールアドレスへご連絡いたします。',
      fail: '送信できませんでした。お手数ですが、しばらくしてから再度お試しください。',
    },
    ko: {
      name: '이름을 입력해 주세요.',
      email: '이메일 주소를 정확히 입력해 주세요.',
      invalid: '이름과 이메일 주소를 확인해 주세요.',
      no_consent: '개인정보 처리방침에 동의해 주세요.',
      sending: '보내는 중입니다…',
      ok: '문의해 주셔서 감사합니다. 영업일 기준 2일 이내에 입력하신 이메일로 연락드리겠습니다.',
      fail: '전송하지 못했습니다. 잠시 후 다시 시도해 주세요.',
    },
    en: {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      invalid: 'Please check your name and email address.',
      no_consent: 'Please agree to the privacy policy.',
      sending: 'Sending…',
      ok: 'Thank you for getting in touch. We’ll reply to your email within two business days.',
      fail: 'We couldn’t send your message. Please try again in a moment.',
    },
    zh: {
      name: '请填写姓名。',
      email: '请填写正确的邮箱地址。',
      invalid: '请确认姓名和邮箱地址。',
      no_consent: '请同意隐私政策。',
      sending: '正在提交…',
      ok: '感谢您的咨询。我们将在2个工作日内通过邮件与您联系。',
      fail: '提交失败，请稍后再试。',
    },
  }[['ko', 'en', 'zh'].includes((root.lang || '').slice(0, 2)) ? root.lang.slice(0, 2) : 'ja'];

  form.addEventListener('submit', async e => {
    e.preventDefault();
    note.classList.remove('ok');
    const d = Object.fromEntries(new FormData(form));
    let miss = '';
    if (!d.name.trim()) miss = 'name';
    else if (!EMAIL.test(d.email.trim())) miss = 'email';
    else if (!d.agree) miss = 'agree';
    if (miss) {
      note.textContent = miss === 'agree' ? T.no_consent : T[miss];
      $(`[name=${miss}]`, form).focus();
      return;
    }

    btn.disabled = true;
    note.textContent = T.sending;
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      const res = await r.json().catch(() => ({}));
      if (!r.ok || !res.ok) throw new Error(res.error || r.status);
      form.reset();
      note.classList.add('ok');
      note.textContent = T.ok;
    } catch (err) {
      note.textContent = (err.message === 'invalid' || err.message === 'no_consent') ? T[err.message] : T.fail;
    } finally {
      btn.disabled = false;
    }
  });
})();
