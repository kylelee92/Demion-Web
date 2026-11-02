// demion.co — 프로젝트 문의 접수
// 정적 파일은 Cloudflare가 sites/demion에서 먼저 내보내고, 파일이 없는 경로만 여기로 온다.
// POST /api/inquiry → Email Routing(send_email)으로 운영자 메일함에 보낸다.
// 받는 주소는 저장소에 남기지 않고 대시보드 Secret `INQUIRY_TO`로 둔다.
// GET /en/·/ja/(+works) → 한국어 원본 페이지를 그대로 쓰되 <head>만 해당 언어로 바꿔 보낸다.
//   검색엔진이 언어별 주소를 따로 수집하게 하려는 것. 본문 번역은 i18n.js가 맡는다.
import { EmailMessage } from 'cloudflare:email';

const MAX = { name: 100, email: 200, url: 300, refs: 1000, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, host } = url;
    const lang = pathname.match(/^\/(en|ja)(\/.*)?$/);
    if (lang && (request.method === 'GET' || request.method === 'HEAD')) return localized(request, env, url, lang[1], lang[2] || '');
    if (pathname !== '/api/inquiry') return new Response('Not found', { status: 404 });
    if (request.method !== 'POST') return json({ error: 'method' }, 405);

    // 다른 사이트에서 이 주소로 폼을 쏘지 못하게
    const origin = request.headers.get('Origin');
    if (origin && new URL(origin).host !== host) return json({ error: 'origin' }, 403);

    let d;
    try { d = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

    // 사람에게는 보이지 않는 칸. 채워져 있으면 봇으로 보고 조용히 버린다
    if (d.company) return json({ ok: true });

    const f = {};
    for (const k of Object.keys(MAX)) f[k] = String(d[k] ?? '').trim().slice(0, MAX[k]);
    if (!f.name || !f.message || !EMAIL.test(f.email)) return json({ error: 'invalid' }, 400);
    // 개인정보 수집·이용 동의(필수) 없이 온 요청은 받지 않는다
    if (d.agree !== 'yes') return json({ error: 'no_consent' }, 400);

    if (!env.INQUIRY_MAIL || !env.INQUIRY_TO) return json({ error: 'not_configured' }, 503);

    const from = env.INQUIRY_FROM || 'inquiry@demion.co';
    const line = (s) => s.replace(/[\r\n]+/g, ' ');
    const body = [
      `이름 또는 회사명: ${line(f.name)}`,
      `이메일: ${f.email}`,
      `현재 홈페이지: ${f.url || '-'}`,
      `레퍼런스 홈페이지: ${f.refs || '-'}`,
      '',
      '의뢰 내용',
      '--------',
      f.message,
      '',
      `개인정보 수집·이용 동의: 동의함 (보유 기간: 처리 완료 후 1년)`,
      `— demion.co 문의 폼, ${new Date().toISOString()}`,
    ].join('\n');

    const raw = [
      `From: ${word('demion 문의')} <${from}>`,
      `To: <${env.INQUIRY_TO}>`,
      `Reply-To: ${word(line(f.name))} <${f.email}>`,
      `Subject: ${word(`[demion 문의] ${line(f.name)}`)}`,
      `Message-ID: <${crypto.randomUUID()}@demion.co>`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      b64(body).replace(/.{76}/g, '$&\r\n'),
    ].join('\r\n');

    try {
      await env.INQUIRY_MAIL.send(new EmailMessage(from, env.INQUIRY_TO, raw));
    } catch (e) {
      console.error('send_email failed', e);
      return json({ error: 'send_failed' }, 502);
    }
    return json({ ok: true });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

// UTF-8 → base64 (한글 헤더·본문용)
function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function word(s) {
  return `=?UTF-8?B?${b64(s)}?=`;
}

// ---------- 언어별 주소 (/en/, /ja/) ----------

const ORIGIN = 'https://demion.co';
const PAGES = {
  '/': {
    en: {
      title: 'demion · See it first, then decide. Website design & development',
      desc: 'See your first website design in one day. demion designs and builds responsive websites for web and mobile. See the design first, pay only if you like it.',
      ogTitle: 'demion · See it first, then decide. Website design',
      ogDesc: 'See your first design in one day. Web and mobile, from design through development.',
    },
    ja: {
      title: 'demion｜見てから決める、ホームページ制作・デザイン',
      desc: '1日で最初のホームページデザインをご確認いただけます。ウェブ・モバイル対応のデザインから開発まで手がけるスタジオ demion。デザインを見てから、気に入ればお支払いください。',
      ogTitle: 'demion｜見てから決める、ホームページデザイン',
      ogDesc: '1日で最初のデザインをご確認いただけます。ウェブとモバイル、デザインから開発まで。',
    },
  },
  '/works': {
    en: {
      title: 'Work · demion',
      desc: 'Websites designed and built by demion: an artist site, a consulting firm and a manufacturer, shown on web and mobile.',
      ogTitle: 'Work · demion',
      ogDesc: 'Websites designed and built by demion.',
    },
    ja: {
      title: '制作事例｜demion',
      desc: 'demionがデザイン・開発したホームページの事例です。作家サイト、コンサルティング会社、製造企業のサイトをウェブとモバイルでご覧ください。',
      ogTitle: '制作事例｜demion',
      ogDesc: 'demionがデザイン・開発したホームページの事例です。',
    },
  },
};
const LOCALE = { en: 'en_US', ja: 'ja_JP' };

async function localized(request, env, url, lang, rest) {
  // /en → /en/ , /en/index.html → /en/ , /en/works.html → /en/works (원본 사이트의 주소 규칙과 같게)
  let page = rest.replace(/\.html$/, '').replace(/\/index$/, '/');
  if (page === '') return Response.redirect(`${url.origin}/${lang}/${url.search}`, 301);
  if (page !== rest) return Response.redirect(`${url.origin}/${lang}${page}${url.search}`, 301);
  const text = PAGES[page]?.[lang];
  if (!text || !env.ASSETS) return new Response('Not found', { status: 404 });

  const src = await env.ASSETS.fetch(new Request(new URL(page, url.origin), { method: 'GET' }));
  if (!src.ok) return src;
  const here = `${ORIGIN}/${lang}${page}`;
  const set = (v) => ({ element(el) { el.setAttribute('content', v); } });

  const out = new HTMLRewriter()
    .on('html', { element(el) { el.setAttribute('lang', lang); el.setAttribute('data-lang-force', lang); } })
    .on('title', { element(el) { el.setInnerContent(text.title); } })
    .on('meta[name="description"]', set(text.desc))
    .on('meta[property="og:title"]', set(text.ogTitle))
    .on('meta[name="twitter:title"]', set(text.ogTitle))
    .on('meta[property="og:description"]', set(text.ogDesc))
    .on('meta[name="twitter:description"]', set(text.ogDesc))
    .on('meta[property="og:url"]', set(here))
    .on('meta[property="og:locale"]', set(LOCALE[lang]))
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', here); } })
    .transform(src);

  const headers = new Headers(out.headers);
  headers.set('Content-Language', lang);
  return new Response(request.method === 'HEAD' ? null : out.body, { status: 200, headers });
}
