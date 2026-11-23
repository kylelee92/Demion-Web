// むすび — お問い合わせ受付
// 정적 파일은 Cloudflare가 sites/musubi에서 먼저 내보내고, 파일이 없는 경로만 여기로 온다.
// POST /api/inquiry → Email Routing(send_email)으로 운영자 메일함에 보낸다.
// 받는 주소는 저장소에 남기지 않고 대시보드 Secret `INQUIRY_TO`로 둔다.
import { EmailMessage } from 'cloudflare:email';

const MAX = { org: 120, name: 100, email: 200, tel: 30, topic: 40, msg: 5000 };
const TOPICS = [
  '戦略・全体相談', 'Web・LP制作', '広告運用', 'SEO・コンテンツ', 'データ分析・MA', 'その他',
  '전략·전반 상담', '웹·랜딩페이지 제작', '광고 운영', 'SEO·콘텐츠', '데이터 분석·MA', '기타',
  'Strategy / general', 'Website / landing page', 'Paid ads', 'SEO / content', 'Analytics / MA', 'Other',
  '战略・整体咨询', '网站・落地页制作', '广告投放', 'SEO・内容', '数据分析・MA', '其他',
];
// 문의가 온 페이지 언어별: 메일 제목 앞머리, 이름 뒤 호칭, 상담 분야를 못 알아볼 때의 값
const LANG = {
  ja: { tag: '[むすび]', hon: '様', other: 'その他', label: '日本語' },
  ko: { tag: '[무스비 KO]', hon: '님', other: '기타', label: '한국어 (/ko/)' },
  en: { tag: '[MUSUBI EN]', hon: '', other: 'Other', label: 'English (/en/)' },
  zh: { tag: '[MUSUBI 中文]', hon: '', other: '其他', label: '简体中文 (/zh/)' },
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request, env) {
    const { pathname, host } = new URL(request.url);
    if (pathname !== '/api/inquiry') return new Response('Not found', { status: 404 });
    if (request.method !== 'POST') return json({ error: 'method' }, 405);

    // 다른 사이트에서 이 주소로 폼을 쏘지 못하게
    const origin = request.headers.get('Origin');
    if (origin && new URL(origin).host !== host) return json({ error: 'origin' }, 403);

    let d;
    try { d = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

    // 사람에게는 보이지 않는 칸. 채워져 있으면 봇으로 보고 조용히 버린다
    if (d.website) return json({ ok: true });

    const f = {};
    for (const k of Object.keys(MAX)) f[k] = String(d[k] ?? '').trim().slice(0, MAX[k]);
    if (!f.name || !EMAIL.test(f.email)) return json({ error: 'invalid' }, 400);
    const L = LANG[d.lang] || LANG.ja;
    if (!TOPICS.includes(f.topic)) f.topic = L.other;
    if (d.agree !== 'yes') return json({ error: 'no_consent' }, 400);

    if (!env.INQUIRY_MAIL || !env.INQUIRY_TO) return json({ error: 'not_configured' }, 503);

    const from = env.INQUIRY_FROM || 'inquiry@demion.co';
    const line = (s) => s.replace(/[\r\n]+/g, ' ');
    const body = [
      `ページ言語: ${L.label}`,
      `会社名・屋号: ${line(f.org) || '-'}`,
      `お名前: ${line(f.name)}`,
      `メール: ${line(f.email)}`,
      `電話: ${line(f.tel) || '-'}`,
      `ご相談内容: ${f.topic}`,
      '',
      '詳細・ご質問',
      '--------',
      f.msg || '-',
      '',
      '個人情報保護方針: 同意済み（保有期間: 対応完了後1年）',
      `— むすび お問い合わせフォーム, ${new Date().toISOString()}`,
    ].join('\n');

    const raw = [
      `From: ${word('むすび お問い合わせ')} <${from}>`,
      `To: <${env.INQUIRY_TO}>`,
      `Reply-To: ${word(line(f.name))} <${line(f.email)}>`,
      `Subject: ${word(`${L.tag} ${line(f.name)}${L.hon ? ' ' + L.hon : ''} · ${f.topic}`)}`,
      `Message-ID: <${crypto.randomUUID()}@${from.split('@')[1]}>`,
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

// UTF-8 → base64 (일본어 헤더·본문용)
function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function word(s) {
  return `=?UTF-8?B?${b64(s)}?=`;
}
