/* 언어 전환과 공통 헤더 메뉴.
   번역은 한국어 원문 → en / ja 표 하나로 관리한다. HTML의 한국어를 그대로 찾아 바꾸므로 페이지마다 따로 적지 않는다.
   문구를 고치면 이 표의 왼쪽(원문)도 함께 고친다. | 는 일본어 줄바꿈 허용 위치다. */
(() => {
  const LANGS = ['ko', 'en', 'ja'];
  const S = [
    /* 문서 정보 */
    ['demion · 먼저 보고, 결정하는 홈페이지 디자인', 'demion · See it first, then decide. Website design', 'demion｜見てから決める、ホームページデザイン'],
    ['개발 사례 · demion', 'Work · demion', '制作事例｜demion'],
    ['하루 만에 첫 디자인을 확인하세요. 웹과 모바일, 디자인부터 개발까지 맡는 홈페이지 디자인 스튜디오 demion.', 'See your first design in one day. demion is a website studio handling web and mobile, from design through development.', '1日で最初のデザインをご確認いただけます。Webとモバイル、デザインから開発まで手がけるホームページデザインスタジオ、demion。'],
    ['demion이 디자인하고 개발한 홈페이지 사례입니다.', 'Websites designed and built by demion.', 'demionがデザイン・開発したホームページの事例です。'],
    ['본문 바로가기', 'Skip to content', '本文へ移動'],
    ['demion 처음으로', 'demion home', 'demion トップへ'],
    ['주요 메뉴', 'Main menu', 'メインメニュー'],
    ['언어 선택', 'Language', '言語の選択'],
    ['메뉴 열기', 'Open menu', 'メニューを開く'],
    ['메뉴 닫기', 'Close menu', 'メニューを閉じる'],
    ['페이지 이동', 'Site links', 'サイト内リンク'],

    /* 헤더 */
    ['개발 사례', 'Work', '制作事例'],
    ['소개', 'About', '特長'],
    ['의뢰 방식', 'How it works', 'ご依頼の流れ'],
    ['프로젝트 문의', 'Start a project', 'お問い合わせ'],

    /* 첫 화면 */
    ['demion 소개와 선택작', 'About demion and selected work', 'demionの紹介と主な事例'],
    ['먼저 보고,', 'See it first,', 'まず見て、'],
    ['결정하는 홈페이지 디자인.', 'then decide.', '決める|ホームページ|デザイン。'],
    ['하루 만에 첫 디자인을 확인하세요.', 'See your first website design in one day.', '1日で最初のデザインをご確認いただけます。'],
    ['웹과 모바일, 디자인부터 개발까지.', 'Web and mobile, from design through development.', 'Webとモバイル、デザインから開発まで。'],
    ['선택작', 'Selected work', '主な事例'],
    ['개발 사례 전체 보기', 'View all work', '制作事例をすべて見る'],

    /* 작품 */
    ['조희욱', 'Cho Hee-uk', 'チョ・ヒウク'],
    ['GW컨설팅', 'GW Consulting', 'GWコンサルティング'],
    ['Precision Works', 'Precision Works', 'Precision Works'],
    ['조각가 작가 사이트', 'Sculptor portfolio site', '彫刻家の作品サイト'],
    ['창업 컨설팅 홈페이지', 'Startup consulting website', '起業コンサルティングのホームページ'],
    ['정밀 가공 기업 홈페이지', 'Precision machining company website', '精密加工企業のホームページ'],
    ['실제 작업 ·', 'Client work ·', '実際の制作 ·'],
    ['실제 작업', 'Client work', '実際の制作'],
    ['자체 콘셉트 ·', 'Self-initiated concept ·', '自主制作コンセプト ·'],
    ['자체 콘셉트이며 실제 고객 작업이 아닙니다', 'A self-initiated concept, not client work', '自主制作コンセプトであり、実際のお客様の案件ではありません'],
    ['자체 콘셉트', 'Self-initiated concept', '自主制作コンセプト'],
    ['조희욱 작가 사이트 크게 보기', 'View the Cho Hee-uk portfolio site', 'チョ・ヒウクの作品サイトを拡大表示'],
    ['GW컨설팅 홈페이지 크게 보기', 'View the GW Consulting website', 'GWコンサルティングのホームページを拡大表示'],
    ['Precision Works 콘셉트 크게 보기', 'View the Precision Works concept', 'Precision Worksのコンセプトを拡大表示'],
    ['조희욱 작가 사이트 화면', 'Cho Hee-uk portfolio site screen', 'チョ・ヒウクの作品サイトの画面'],
    ['GW컨설팅 홈페이지 화면', 'GW Consulting website screen', 'GWコンサルティングのホームページの画面'],
    ['Precision Works 콘셉트 화면', 'Precision Works concept screen', 'Precision Worksのコンセプト画面'],
    ['조희욱 작가 사이트 첫 화면', 'Cho Hee-uk portfolio site, first screen', 'チョ・ヒウクの作品サイトのトップ画面'],
    ['GW컨설팅 홈페이지 첫 화면', 'GW Consulting website, first screen', 'GWコンサルティングのホームページのトップ画面'],
    ['Precision Works 콘셉트 첫 화면', 'Precision Works concept, first screen', 'Precision Worksのコンセプトのトップ画面'],

    /* 장면: 하루 */
    ['이 정도 디자인을,', 'A design like this,', 'このデザインを、'],
    ['하루 만에 본다고요?', 'in just one day?', '1日で|見られるんですか？'],
    ['네, 하루.', 'Yes,<br>one day.', 'はい、<br>1日です。'],
    ['AI로 제작 과정을 줄이고, 디자인의 완성도에 집중합니다. 빠르게 만들 수 있는 부분은 AI에 맡기고, 구성과 문장, 화면의 비례처럼 사람이 판단해야 하는 일에 시간을 씁니다.', 'AI shortens production so we can focus on the quality of the design. What can be done quickly goes to AI, and our time goes to what needs human judgment: structure, copy, and proportion.', 'AIで制作工程を短縮し、デザインの完成度に集中します。速く作れる部分はAIに任せ、構成や文章、画面の比率など、人が判断すべきことに時間を使います。'],
    ['하루는 첫 디자인을 보여드리는 기간입니다. 첫 디자인의 범위와 조건은 문의하실 때 안내드립니다.', 'One day is the time until we show your first design. We explain its scope and terms when you inquire.', '1日とは、最初のデザインをお見せするまでの期間です。範囲と条件はお問い合わせの際にご案内します。'],
    ['문의', 'Inquiry', 'お問い合わせ'],
    ['첫 디자인', 'First design', '最初のデザイン'],

    /* 장면: 결제 */
    ['그럼 결제는', 'So when', 'では、お支払いは'],
    ['언제 하나요?', 'do I pay?', 'いつですか？'],
    ['디자인을 먼저 확인한 다음 결제합니다', 'You see the design first, then pay', 'デザインをご確認いただいた後にお支払いいただきます'],
    ['결제', 'Pay', 'お支払い'],
    ['디자인', 'Design', 'デザイン'],
    ['디자인을 먼저 보고, 마음에 들면 그때 결제하세요. 제작 범위와 진행 조건은 디자인을 확인한 뒤 협의합니다.', 'See the design first, and pay when you like it. Scope and terms are agreed after you have seen it.', 'まずデザインをご覧いただき、ご納得いただけましたらお支払いください。制作範囲と進行条件は、デザインをご確認の後にご相談します。'],

    /* 장면: 신청 */
    ['그럼,', 'Well then,', 'それでは、'],
    ['한번 맡겨볼까요?', 'shall we start?', '一度|お任せ|いただけますか？'],
    ['신규 제작', 'New websites', '新規制作'],
    ['목적에 맞는 홈페이지 디자인과 개발', 'Design and development built around your goals', '目的に合わせたホームページのデザインと開発'],
    ['기존 홈페이지 개선', 'Website improvement', '既存サイトの改善'],
    ['현재 화면의 디자인과 정보 구성 정돈', 'Refining the design and structure of your current site', '現在の画面のデザインと情報構成を整理'],
    ['웹·모바일 디자인과 개발', 'Web and mobile design and development', 'Web・モバイルのデザインと開発'],
    ['화면 크기가 달라도 일관된 경험', 'A consistent experience on any screen size', '画面サイズが違っても一貫した体験'],
    ['AI를 활용해 합리적인 비용으로 웹·모바일 홈페이지를 디자인하고 개발하는 스튜디오.', 'A studio that uses AI to design and build web and mobile websites at a reasonable cost.', 'AIを活用し、適正な費用でWeb・モバイル向けホームページをデザイン・開発するスタジオです。'],

    /* 개발 사례 페이지 */
    ['디자인하고 개발한 홈페이지입니다.', 'Websites we have designed and built.', 'デザイン・開発したホームページです。'],
    ['실제 작업과 자체 콘셉트를 구분해 표기했습니다.', 'Client work and self-initiated concepts are labeled separately.', '実際の制作と自主制作コンセプトを区別して表記しています。'],
    ['다음 사례는', 'The next case', '次の事例は、'],
    ['귀사의 홈페이지일 수 있습니다.', 'could be your website.', '貴社のホームページかもしれません。'],
    ['사례를 크게 보려면 JavaScript가 필요합니다.', 'JavaScript is required to view the work in detail.', '事例を拡大表示するにはJavaScriptが必要です。'],
    ['작업을 크게 보거나 문의를 보내려면 JavaScript가 필요합니다.', 'JavaScript is required to view work in detail or send an inquiry.', '事例の拡大表示やお問い合わせにはJavaScriptが必要です。'],

    /* 작업 상세 */
    ['화면 보기 방식', 'View mode', '表示方法'],
    ['데스크톱', 'Desktop', 'デスクトップ'],
    ['모바일', 'Mobile', 'モバイル'],
    ['닫기', 'Close', '閉じる'],
    ['크게 보기', 'View', '拡大'],
    ['회사 홈페이지 (비워두세요)', 'Company website (leave blank)', '会社のホームページ（空欄のまま）'],
    ['이전 작업', 'Previous work', '前の事例'],
    ['다음 작업', 'Next work', '次の事例'],
    ['디자인 전체 화면', 'Full-page design', 'デザイン全体'],
    ['전체 화면', 'full page', '全画面'],

    /* 문의 패널 */
    ['새 홈페이지도, 지금 홈페이지의 개선도 가능합니다. 간단히 적어주세요.', 'New websites and improvements to your current one are both welcome. Just a few lines is fine.', '新規制作も、現在のサイトの改善も承ります。簡単にご記入ください。'],
    ['상태 미리보기 화면입니다. 실제로 전송된 내용이 아닙니다.', 'This is a state preview. Nothing was actually sent.', '状態のプレビュー画面です。実際には送信されていません。'],
    ['이름 또는 회사명', 'Name or company', 'お名前または会社名'],
    ['이메일', 'Email', 'メールアドレス'],
    ['현재 홈페이지', 'Current website', '現在のホームページ'],
    ['레퍼런스 홈페이지', 'Reference websites', '参考にしたいホームページ'],
    ['선택', 'Optional', '任意'],
    ['의뢰 내용', 'Project details', 'ご依頼内容'],
    ['참고하고 싶은 사이트, 여러 개는 쉼표로', 'Sites you like, separated by commas', '参考サイト（複数の場合はカンマで区切る）'],
    ['회사 소개, 만들거나 고치고 싶은 부분, 원하는 분위기를 적어주세요.', 'Tell us about your company, what you want to build or change, and the feel you want.', '会社のご紹介、制作・改善したい部分、ご希望の雰囲気をご記入ください。'],
    ['개인정보 수집·이용 안내', 'Personal data notice', '個人情報の収集・利用について'],
    ['수집 항목', 'Data collected', '収集項目'],
    ['이름 또는 회사명, 이메일, 의뢰 내용, 현재·레퍼런스 홈페이지(입력한 경우)', 'Name or company, email, project details, current and reference websites (if entered)', 'お名前または会社名、メールアドレス、ご依頼内容、現在および参考のホームページ（ご入力の場合）'],
    ['이용 목적', 'Purpose', '利用目的'],
    ['프로젝트 문의 확인과 답변', 'Reviewing and answering your inquiry', 'お問い合わせの確認と回答'],
    ['보유 기간', 'Retention', '保有期間'],
    ['문의 처리 완료 후 1년, 이후 지체 없이 파기', 'One year after your inquiry is resolved, then promptly deleted', 'お問い合わせの対応完了から1年間。その後は速やかに破棄します'],
    ['동의를 거부할 수 있으며, 거부하면 문의를 접수할 수 없습니다.', 'You may decline, but we cannot accept your inquiry without consent.', '同意を拒否できますが、その場合はお問い合わせをお受けできません。'],
    ['개인정보 수집·이용에 동의합니다', 'I agree to the collection and use of my personal data', '個人情報の収集・利用に同意します'],
    ['필수', 'Required', '必須'],
    ['전송하지 못했습니다.', 'Your inquiry could not be sent.', '送信できませんでした。'],
    ['잠시 후 다시 시도해주세요. 입력하신 내용은 그대로 남아 있습니다.', 'Please try again shortly. What you entered has been kept.', 'しばらくしてからもう一度お試しください。入力内容はそのまま残っています。'],
    ['문의 보내기', 'Send inquiry', '送信する'],
    ['보내는 중', 'Sending', '送信中'],
    ['다시 보내기', 'Send again', 'もう一度送信'],
    ['문의가 접수되었습니다.', 'We received your inquiry.', 'お問い合わせを受け付けました。'],
    ['보내주신 내용을 확인한 뒤 입력하신 이메일로 연락드립니다.', 'We will review it and reply to the email you entered.', '内容を確認のうえ、ご入力のメールアドレスへご連絡します。'],
    ['새 문의 작성하기', 'Write a new inquiry', '新しいお問い合わせを作成'],
    ['이름 또는 회사명을 입력해주세요.', 'Please enter your name or company.', 'お名前または会社名をご入力ください。'],
    ['이메일을 입력해주세요.', 'Please enter your email.', 'メールアドレスをご入力ください。'],
    ['이메일 형식을 확인해주세요. 예: name@example.com', 'Please check the email format. Example: name@example.com', 'メールアドレスの形式をご確認ください。例：name@example.com'],
    ['주소 형식을 확인해주세요. 예: example.com', 'Please check the address format. Example: example.com', 'アドレスの形式をご確認ください。例：example.com'],
    ['주소 형식을 확인해주세요. 여러 개는 쉼표로 나눠주세요. 예: example.com, sample.co.kr', 'Please check the address format and separate several with commas. Example: example.com, sample.co.kr', 'アドレスの形式をご確認ください。複数の場合はカンマで区切ってください。例：example.com, sample.co.jp'],
    ['의뢰 내용을 간단히 적어주세요.', 'Please briefly describe your project.', 'ご依頼内容を簡単にご記入ください。'],
    ['개인정보 수집·이용에 동의해주셔야 문의를 보낼 수 있습니다.', 'Please agree to the personal data notice to send your inquiry.', 'お問い合わせの送信には、個人情報の収集・利用への同意が必要です。'],
    ['아직 문의 접수 경로가 연결되지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.', 'The inquiry service is not connected yet, so nothing was sent. What you entered has been kept.', 'お問い合わせの受付先が未接続のため、送信されませんでした。入力内容はそのまま残っています。'],
    ['문의 접수 설정이 아직 끝나지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.', 'Inquiry setup is not finished yet, so nothing was sent. What you entered has been kept.', 'お問い合わせの受付設定が完了していないため、送信されませんでした。入力内容はそのまま残っています。'],
  ];

  const col = { en: 1, ja: 2 };
  const pick = () => {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) { try { localStorage.setItem('demion-lang', q); } catch {} return q; }
    try { const saved = localStorage.getItem('demion-lang'); if (LANGS.includes(saved)) return saved; } catch {}
    const nav = (navigator.language || '').slice(0, 2);
    return LANGS.includes(nav) ? nav : 'en';
  };
  const lang = pick();
  document.documentElement.lang = lang;
  if (lang === 'ja') {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&display=swap';
    document.head.append(font);
  }

  const map = new Map(lang === 'ko' ? [] : S.map(row => [row[0], row[col[lang]]]));
  const t = text => map.get(text) ?? text;
  const clean = v => v.replace(/\|/g, '').replace(/<br>/g, ' ');

  function apply() {
    if (lang !== 'ko') {
      document.title = clean(t(document.title));
      document.querySelectorAll('meta[name="description"], meta[property^="og:"]').forEach(m => m.setAttribute('content', clean(t(m.getAttribute('content')))));
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walk.nextNode()) if (walk.currentNode.nodeValue.trim() && !/^(SCRIPT|STYLE)$/.test(walk.currentNode.parentNode.nodeName)) nodes.push(walk.currentNode);
      nodes.forEach(node => {
        const raw = node.nodeValue;
        const key = raw.trim();
        if (!map.has(key)) return;
        const val = map.get(key);
        const lead = raw.slice(0, raw.indexOf(key));
        const tail = raw.slice(raw.indexOf(key) + key.length);
        if (/[|<]/.test(val)) {
          /* 줄바꿈이 필요한 문구: 글자 나누기 효과(motion.js)가 원문을 쓸 수 있게 남겨 둔다 */
          if (val.includes('|')) node.parentNode.dataset.raw = val;
          const tpl = document.createElement('template');
          /* | 로 나눈 덩어리는 중간에서 끊기지 않게 묶는다 */
          tpl.innerHTML = lead + (val.includes('|') ? val.split('|').map(p => `<span class="nb">${p}</span>`).join('') : val) + tail;
          node.replaceWith(tpl.content);
        } else node.nodeValue = lead + val + tail;
      });
      document.querySelectorAll('[aria-label], [alt], [placeholder]').forEach(el => {
        ['aria-label', 'alt', 'placeholder'].forEach(a => { if (el.hasAttribute(a)) el.setAttribute(a, clean(t(el.getAttribute(a)))); });
      });
    }

    /* 언어 전환 링크: 같은 페이지를 해당 언어로 다시 연다 */
    document.querySelectorAll('[data-lang]').forEach(a => {
      const u = new URL(location.href);
      u.searchParams.set('lang', a.dataset.lang);
      u.hash = '';
      a.href = u.pathname + u.search;
      if (a.dataset.lang === lang) a.setAttribute('aria-current', 'true');
    });

    /* 좁은 화면의 메뉴 */
    const site = document.querySelector('.site');
    const btn = site && site.querySelector('.menu-btn');
    if (btn) {
      const main = document.getElementById('main');
      const foot = document.querySelector('.foot');
      const setOpen = open => {
        site.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', open);
        btn.setAttribute('aria-label', t(open ? '메뉴 닫기' : '메뉴 열기'));
        [main, foot].forEach(el => { if (el) el.inert = open; });
        document.documentElement.classList.toggle('no-scroll', open);
        document.dispatchEvent(new CustomEvent('site-menu', { detail: open }));
      };
      btn.addEventListener('click', () => setOpen(!site.classList.contains('menu-open')));
      site.querySelectorAll('.menu a, .menu button').forEach(a => a.addEventListener('click', () => setOpen(false)));
      addEventListener('keydown', e => { if (e.key === 'Escape' && site.classList.contains('menu-open')) { setOpen(false); btn.focus(); } });
      matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
    }
  }

  window.I18N = { lang, t, apply };
})();
