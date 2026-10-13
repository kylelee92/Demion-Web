// demion.co — 프로젝트 문의 접수
// 정적 파일은 Cloudflare가 sites/demion에서 먼저 내보내고, 파일이 없는 경로만 여기로 온다.
// POST /api/inquiry → Email Routing(send_email)으로 운영자 메일함에 보낸다.
// 받는 주소는 저장소에 남기지 않고 대시보드 Secret `INQUIRY_TO`로 둔다.
import { EmailMessage } from 'cloudflare:email';

const MAX = { name: 100, email: 200, url: 300, refs: 1000, message: 5000 };
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
    if (d.company) return json({ ok: true });

    const f = {};
    for (const k of Object.keys(MAX)) f[k] = String(d[k] ?? '').trim().slice(0, MAX[k]);
    if (!f.name || !f.message || !EMAIL.test(f.email)) return json({ error: 'invalid' }, 400);

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
