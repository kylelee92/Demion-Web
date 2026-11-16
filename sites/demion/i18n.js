/* 언어 전환과 공통 헤더 메뉴.
   번역은 한국어 원문 → en / ja / zh(간체 중국어) 표 하나로 관리한다. HTML의 한국어를 그대로 찾아 바꾸므로 페이지마다 따로 적지 않는다.
   문구를 고치면 이 표의 왼쪽(원문)도 함께 고친다. | 는 일본어·중국어 줄바꿈 허용 위치다. */
(() => {
  const LANGS = ['ko', 'en', 'ja', 'zh'];
  const S = [
    /* 문서 정보 */
    ['demion · 먼저 보고, 결정하는 홈페이지 디자인', 'demion · See it first, then decide. Website design', 'demion｜見てから決める、ホームページデザイン', 'demion｜先看后定的网站设计'],
    ['홈페이지 제작 demion · 먼저 보고, 결정하는 홈페이지 디자인', 'demion · See it first, then decide. Website design & development', 'demion｜見てから決める、ホームページ制作・デザイン', 'demion｜先看后定的网站制作与设计'],
    ['홈페이지 제작, 하루 만에 첫 디자인을 확인하세요. 웹·모바일 반응형 디자인부터 개발까지 맡는 홈페이지 디자인 스튜디오 demion. 디자인을 먼저 보고 마음에 들면 결제합니다.', 'See your first website design in one day. demion designs and builds responsive websites for web and mobile. See the design first, pay only if you like it.', '1日で最初のホームページデザインをご確認いただけます。ウェブ・モバイル対応のデザインから開発まで手がけるスタジオ demion。デザインを見てから、気に入ればお支払いください。', '一天内即可看到网站的第一版设计。demion 是一家负责网页与移动端响应式设计及开发的网站设计工作室。先看设计，满意后再付款。'],
    ['개발 사례 · demion', 'Work · demion', '制作事例｜demion', '项目案例｜demion'],
    ['하루 만에 첫 디자인을 확인하세요. 웹과 모바일, 디자인부터 개발까지 맡는 홈페이지 디자인 스튜디오 demion.', 'See your first design in one day. demion is a website studio handling web and mobile, from design through development.', '1日で最初のデザインをご確認いただけます。Webとモバイル、デザインから開発まで手がけるホームページデザインスタジオ、demion。', '一天内即可看到第一版设计。demion 是一家网站设计工作室，承接网页与移动端，从设计到开发。'],
    ['demion이 디자인하고 개발한 홈페이지 사례입니다.', 'Websites designed and built by demion.', 'demionがデザイン・開発したホームページの事例です。', 'demion 设计并开发的网站案例。'],
    ['홈페이지 디자인·개발 사례 · demion', 'Work · demion', '制作事例｜demion', '项目案例｜demion'],
    ['demion이 디자인하고 개발한 홈페이지 사례입니다. 작가 사이트, 컨설팅 회사, 제조 기업 홈페이지를 웹과 모바일 화면으로 확인하세요.', 'Websites designed and built by demion: an artist site, a consulting firm and a manufacturer, shown on web and mobile.', 'demionがデザイン・開発したホームページの事例です。作家サイト、コンサルティング会社、製造企業のサイトをウェブとモバイルでご覧ください。', 'demion 设计并开发的网站案例，包括艺术家网站、咨询公司和制造企业的官网，可在网页和移动端画面中查看。'],
    ['demion — 먼저 보고, 결정하는 홈페이지 디자인', 'demion — See it first, then decide. Website design', 'demion — 見てから決める、ホームページデザイン', 'demion — 先看后定的网站设计'],
    ['본문 바로가기', 'Skip to content', '本文へ移動', '跳到正文'],
    ['demion 처음으로', 'demion home', 'demion トップへ', 'demion 首页'],
    ['주요 메뉴', 'Main menu', 'メインメニュー', '主菜单'],
    ['언어 선택', 'Language', '言語の選択', '选择语言'],
    ['메뉴 열기', 'Open menu', 'メニューを開く', '打开菜单'],
    ['메뉴 닫기', 'Close menu', 'メニューを閉じる', '关闭菜单'],
    ['페이지 이동', 'Site links', 'サイト内リンク', '网站链接'],

    /* 헤더 */
    ['개발 사례', 'Work', '制作事例', '项目案例'],
    ['소개', 'About', '特長', '介绍'],
    ['의뢰 방식', 'How it works', 'ご依頼の流れ', '合作方式'],
    ['프로젝트 문의', 'Start a project', 'お問い合わせ', '项目咨询'],

    /* 첫 화면 */
    ['demion 소개와 선택작', 'About demion and selected work', 'demionの紹介と主な事例', 'demion 介绍与精选作品'],
    ['먼저 보고,', 'See it first,', 'まず見て、', '先看设计，'],
    ['결정하는 홈페이지 디자인.', 'then decide.', '決める|ホームページ|デザイン。', '再做决定的|网站设计。'],
    ['하루 만에 첫 디자인을 확인하세요.', 'See your first website design in one day.', '1日で最初のデザインをご確認いただけます。', '一天内看到第一版设计。'],
    ['웹과 모바일, 디자인부터 개발까지.', 'Web and mobile, from design through development.', 'Webとモバイル、デザインから開発まで。', '网页与移动端，从设计到开发。'],
    ['선택작', 'Selected work', '主な事例', '精选作品'],
    ['개발 사례 전체 보기', 'View all work', '制作事例をすべて見る', '查看全部案例'],

    /* 작품 */
    ['조희욱', 'Cho Hee-uk', 'チョ・ヒウク', 'Cho Hee-uk'],
    ['GW컨설팅', 'GW Consulting', 'GWコンサルティング', 'GW Consulting'],
    ['Precision Works', 'Precision Works', 'Precision Works', 'Precision Works'],
    ['조각가 작가 사이트', 'Sculptor portfolio site', '彫刻家の作品サイト', '雕塑家作品网站'],
    ['창업 컨설팅 홈페이지', 'Startup consulting website', '起業コンサルティングのホームページ', '创业咨询公司官网'],
    ['정밀 가공 기업 홈페이지', 'Precision machining company website', '精密加工企業のホームページ', '精密加工企业官网'],
    ['실제 작업 ·', 'Client work ·', '実際の制作 ·', '客户项目 ·'],
    ['실제 작업', 'Client work', '実際の制作', '客户项目'],
    ['자체 콘셉트 ·', 'Self-initiated concept ·', '自主制作コンセプト ·', '自主概念 ·'],
    ['자체 콘셉트이며 실제 고객 작업이 아닙니다', 'A self-initiated concept, not client work', '自主制作コンセプトであり、実際のお客様の案件ではありません', '自主概念作品，并非实际客户项目'],
    ['자체 콘셉트', 'Self-initiated concept', '自主制作コンセプト', '自主概念'],
    ['조희욱 작가 사이트 크게 보기', 'View the Cho Hee-uk portfolio site', 'チョ・ヒウクの作品サイトを拡大表示', '放大查看 Cho Hee-uk 作品网站'],
    ['GW컨설팅 홈페이지 크게 보기', 'View the GW Consulting website', 'GWコンサルティングのホームページを拡大表示', '放大查看 GW Consulting 官网'],
    ['Precision Works 콘셉트 크게 보기', 'View the Precision Works concept', 'Precision Worksのコンセプトを拡大表示', '放大查看 Precision Works 概念设计'],
    ['조희욱 작가 사이트 화면', 'Cho Hee-uk portfolio site screen', 'チョ・ヒウクの作品サイトの画面', 'Cho Hee-uk 作品网站画面'],
    ['GW컨설팅 홈페이지 화면', 'GW Consulting website screen', 'GWコンサルティングのホームページの画面', 'GW Consulting 官网画面'],
    ['Precision Works 콘셉트 화면', 'Precision Works concept screen', 'Precision Worksのコンセプト画面', 'Precision Works 概念设计画面'],
    ['조희욱 작가 사이트 첫 화면', 'Cho Hee-uk portfolio site, first screen', 'チョ・ヒウクの作品サイトのトップ画面', 'Cho Hee-uk 作品网站首页'],
    ['GW컨설팅 홈페이지 첫 화면', 'GW Consulting website, first screen', 'GWコンサルティングのホームページのトップ画面', 'GW Consulting 官网首页'],
    ['Precision Works 콘셉트 첫 화면', 'Precision Works concept, first screen', 'Precision Worksのコンセプトのトップ画面', 'Precision Works 概念设计首页'],

    /* 장면: 하루 */
    ['이 정도 디자인을,', 'A design like this,', 'このデザインを、', '这样的设计，'],
    ['하루 만에 본다고요?', 'in just one day?', '1日で|見られるんですか？', '一天就能|看到？'],
    ['네, 하루.', 'Yes,<br>one day.', 'はい、<br>1日です。', '是的，<br>一天。'],
    ['AI로 제작 과정을 줄이고, 디자인의 완성도에 집중합니다. 빠르게 만들 수 있는 부분은 AI에 맡기고, 구성과 문장, 화면의 비례처럼 사람이 판단해야 하는 일에 시간을 씁니다.', 'AI shortens production so we can focus on the quality of the design. What can be done quickly goes to AI, and our time goes to what needs human judgment: structure, copy, and proportion.', 'AIで制作工程を短縮し、デザインの完成度に集中します。速く作れる部分はAIに任せ、構成や文章、画面の比率など、人が判断すべきことに時間を使います。', '我们用 AI 缩短制作流程，把精力集中在设计品质上。能快速完成的部分交给 AI，时间则花在结构、文案、画面比例等需要人来判断的地方。'],
    ['하루는 첫 디자인을 보여드리는 기간입니다. 첫 디자인의 범위와 조건은 문의하실 때 안내드립니다.', 'One day is the time until we show your first design. We explain its scope and terms when you inquire.', '1日とは、最初のデザインをお見せするまでの期間です。範囲と条件はお問い合わせの際にご案内します。', '“一天”指的是交付第一版设计的时间。第一版设计的范围与条件，会在您咨询时说明。'],
    ['문의', 'Inquiry', 'お問い合わせ', '咨询'],
    ['첫 디자인', 'First design', '最初のデザイン', '第一版设计'],

    /* 장면: 결제 */
    ['그럼 결제는', 'So when', 'では、お支払いは', '那么，什么时候'],
    ['언제 하나요?', 'do I pay?', 'いつですか？', '付款呢？'],
    ['디자인을 먼저 확인한 다음 결제합니다', 'You see the design first, then pay', 'デザインをご確認いただいた後にお支払いいただきます', '先确认设计，再付款'],
    ['결제', 'Pay', 'お支払い', '付款'],
    ['디자인', 'Design', 'デザイン', '设计'],
    ['디자인을 먼저 보고, 마음에 들면 그때 결제하세요. 제작 범위와 진행 조건은 디자인을 확인한 뒤 협의합니다.', 'See the design first, and pay when you like it. Scope and terms are agreed after you have seen it.', 'まずデザインをご覧いただき、ご納得いただけましたらお支払いください。制作範囲と進行条件は、デザインをご確認の後にご相談します。', '先看设计，满意了再付款。制作范围与合作条件，在您确认设计后再商定。'],

    /* 장면: 신청 */
    ['그럼,', 'Well then,', 'それでは、', '那么，'],
    ['한번 맡겨볼까요?', 'shall we start?', '一度|お任せ|いただけますか？', '要不要|交给我们|试试？'],
    ['신규 제작', 'New websites', '新規制作', '新网站制作'],
    ['목적에 맞는 홈페이지 디자인과 개발', 'Design and development built around your goals', '目的に合わせたホームページのデザインと開発', '围绕目标的网站设计与开发'],
    ['기존 홈페이지 개선', 'Website improvement', '既存サイトの改善', '现有网站改版'],
    ['현재 화면의 디자인과 정보 구성 정돈', 'Refining the design and structure of your current site', '現在の画面のデザインと情報構成を整理', '梳理现有页面的设计与信息结构'],
    ['웹·모바일 디자인과 개발', 'Web and mobile design and development', 'Web・モバイルのデザインと開発', '网页·移动端设计与开发'],
    ['화면 크기가 달라도 일관된 경험', 'A consistent experience on any screen size', '画面サイズが違っても一貫した体験', '不同屏幕尺寸，一致的体验'],
    ['AI를 활용해 합리적인 비용으로 웹·모바일 홈페이지를 디자인하고 개발하는 스튜디오.', 'A studio that uses AI to design and build web and mobile websites at a reasonable cost.', 'AIを活用し、適正な費用でWeb・モバイル向けホームページをデザイン・開発するスタジオです。', '借助 AI，以合理的费用设计并开发网页与移动端网站的工作室。'],

    /* 개발 사례 페이지 */
    ['디자인하고 개발한 홈페이지입니다.', 'Websites we have designed and built.', 'デザイン・開発したホームページです。', '我们设计并开发的网站。'],
    ['실제 작업과 자체 콘셉트를 구분해 표기했습니다.', 'Client work and self-initiated concepts are labeled separately.', '実際の制作と自主制作コンセプトを区別して表記しています。', '客户项目与自主概念作品已分别标注。'],
    ['다음 사례는', 'The next case', '次の事例は、', '下一个案例，'],
    ['귀사의 홈페이지일 수 있습니다.', 'could be your website.', '貴社のホームページかもしれません。', '也许就是贵公司的网站。'],
    ['사례를 크게 보려면 JavaScript가 필요합니다.', 'JavaScript is required to view the work in detail.', '事例を拡大表示するにはJavaScriptが必要です。', '放大查看案例需要启用 JavaScript。'],
    ['작업을 크게 보거나 문의를 보내려면 JavaScript가 필요합니다.', 'JavaScript is required to view work in detail or send an inquiry.', '事例の拡大表示やお問い合わせにはJavaScriptが必要です。', '放大查看作品或发送咨询需要启用 JavaScript。'],

    /* 작업 상세 */
    ['화면 보기 방식', 'View mode', '表示方法', '查看方式'],
    ['데스크톱', 'Desktop', 'デスクトップ', '桌面端'],
    ['모바일', 'Mobile', 'モバイル', '移动端'],
    ['닫기', 'Close', '閉じる', '关闭'],
    ['크게 보기', 'View', '拡大', '放大查看'],
    ['회사 홈페이지 (비워두세요)', 'Company website (leave blank)', '会社のホームページ（空欄のまま）', '公司网站（请留空）'],
    ['이전 작업', 'Previous work', '前の事例', '上一个作品'],
    ['다음 작업', 'Next work', '次の事例', '下一个作品'],
    ['디자인 전체 화면', 'Full-page design', 'デザイン全体', '设计全页'],
    ['전체 화면', 'full page', '全画面', '全页'],

    /* 문의 패널 */
    ['새 홈페이지도, 지금 홈페이지의 개선도 가능합니다. 간단히 적어주세요.', 'New websites and improvements to your current one are both welcome. Just a few lines is fine.', '新規制作も、現在のサイトの改善も承ります。簡単にご記入ください。', '新网站制作、现有网站改版都可以。简单写几句即可。'],
    ['상태 미리보기 화면입니다. 실제로 전송된 내용이 아닙니다.', 'This is a state preview. Nothing was actually sent.', '状態のプレビュー画面です。実際には送信されていません。', '这是状态预览画面，并未实际发送。'],
    ['이름 또는 회사명', 'Name or company', 'お名前または会社名', '姓名或公司名称'],
    ['이메일', 'Email', 'メールアドレス', '电子邮箱'],
    ['현재 홈페이지', 'Current website', '現在のホームページ', '现有网站'],
    ['레퍼런스 홈페이지', 'Reference websites', '参考にしたいホームページ', '参考网站'],
    ['선택', 'Optional', '任意', '选填'],
    ['의뢰 내용', 'Project details', 'ご依頼内容', '需求内容'],
    ['참고하고 싶은 사이트, 여러 개는 쉼표로', 'Sites you like, separated by commas', '参考サイト（複数の場合はカンマで区切る）', '想参考的网站，多个请用逗号分隔'],
    ['회사 소개, 만들거나 고치고 싶은 부분, 원하는 분위기를 적어주세요.', 'Tell us about your company, what you want to build or change, and the feel you want.', '会社のご紹介、制作・改善したい部分、ご希望の雰囲気をご記入ください。', '请写下公司简介、想新建或修改的部分，以及希望的风格。'],
    ['개인정보 수집·이용 안내', 'Personal data notice', '個人情報の収集・利用について', '个人信息收集与使用说明'],
    ['수집 항목', 'Data collected', '収集項目', '收集项目'],
    ['이름 또는 회사명, 이메일, 의뢰 내용, 현재·레퍼런스 홈페이지(입력한 경우)', 'Name or company, email, project details, current and reference websites (if entered)', 'お名前または会社名、メールアドレス、ご依頼内容、現在および参考のホームページ（ご入力の場合）', '姓名或公司名称、电子邮箱、需求内容、现有及参考网站（如有填写）'],
    ['이용 목적', 'Purpose', '利用目的', '使用目的'],
    ['프로젝트 문의 확인과 답변', 'Reviewing and answering your inquiry', 'お問い合わせの確認と回答', '确认并回复项目咨询'],
    ['보유 기간', 'Retention', '保有期間', '保存期限'],
    ['문의 처리 완료 후 1년, 이후 지체 없이 파기', 'One year after your inquiry is resolved, then promptly deleted', 'お問い合わせの対応完了から1年間。その後は速やかに破棄します', '咨询处理完毕后保存 1 年，之后立即销毁'],
    ['동의를 거부할 수 있으며, 거부하면 문의를 접수할 수 없습니다.', 'You may decline, but we cannot accept your inquiry without consent.', '同意を拒否できますが、その場合はお問い合わせをお受けできません。', '您可以拒绝同意，但拒绝后将无法提交咨询。'],
    ['개인정보 수집·이용에 동의합니다', 'I agree to the collection and use of my personal data', '個人情報の収集・利用に同意します', '我同意收集与使用个人信息'],
    ['필수', 'Required', '必須', '必填'],
    ['전송하지 못했습니다.', 'Your inquiry could not be sent.', '送信できませんでした。', '发送失败。'],
    ['잠시 후 다시 시도해주세요. 입력하신 내용은 그대로 남아 있습니다.', 'Please try again shortly. What you entered has been kept.', 'しばらくしてからもう一度お試しください。入力内容はそのまま残っています。', '请稍后再试，您填写的内容已保留。'],
    ['문의 보내기', 'Send inquiry', '送信する', '发送咨询'],
    ['보내는 중', 'Sending', '送信中', '发送中'],
    ['다시 보내기', 'Send again', 'もう一度送信', '重新发送'],
    ['문의가 접수되었습니다.', 'We received your inquiry.', 'お問い合わせを受け付けました。', '已收到您的咨询。'],
    ['보내주신 내용을 확인한 뒤 입력하신 이메일로 연락드립니다.', 'We will review it and reply to the email you entered.', '内容を確認のうえ、ご入力のメールアドレスへご連絡します。', '我们确认内容后，会通过您填写的邮箱与您联系。'],
    ['새 문의 작성하기', 'Write a new inquiry', '新しいお問い合わせを作成', '填写新的咨询'],
    ['이름 또는 회사명을 입력해주세요.', 'Please enter your name or company.', 'お名前または会社名をご入力ください。', '请输入姓名或公司名称。'],
    ['이메일을 입력해주세요.', 'Please enter your email.', 'メールアドレスをご入力ください。', '请输入电子邮箱。'],
    ['이메일 형식을 확인해주세요. 예: name@example.com', 'Please check the email format. Example: name@example.com', 'メールアドレスの形式をご確認ください。例：name@example.com', '请检查邮箱格式。例：name@example.com'],
    ['주소 형식을 확인해주세요. 예: example.com', 'Please check the address format. Example: example.com', 'アドレスの形式をご確認ください。例：example.com', '请检查网址格式。例：example.com'],
    ['주소 형식을 확인해주세요. 여러 개는 쉼표로 나눠주세요. 예: example.com, sample.co.kr', 'Please check the address format and separate several with commas. Example: example.com, sample.co.kr', 'アドレスの形式をご確認ください。複数の場合はカンマで区切ってください。例：example.com, sample.co.jp', '请检查网址格式，多个请用逗号分隔。例：example.com, sample.cn'],
    ['의뢰 내용을 간단히 적어주세요.', 'Please briefly describe your project.', 'ご依頼内容を簡単にご記入ください。', '请简单描述您的需求。'],
    ['개인정보 수집·이용에 동의해주셔야 문의를 보낼 수 있습니다.', 'Please agree to the personal data notice to send your inquiry.', 'お問い合わせの送信には、個人情報の収集・利用への同意が必要です。', '需同意个人信息收集与使用后才能发送咨询。'],
    ['아직 문의 접수 경로가 연결되지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.', 'The inquiry service is not connected yet, so nothing was sent. What you entered has been kept.', 'お問い合わせの受付先が未接続のため、送信されませんでした。入力内容はそのまま残っています。', '咨询接收通道尚未连接，未能发送。您填写的内容已保留。'],
    ['문의 접수 설정이 아직 끝나지 않아 전송되지 않았습니다. 입력하신 내용은 그대로 남아 있습니다.', 'Inquiry setup is not finished yet, so nothing was sent. What you entered has been kept.', 'お問い合わせの受付設定が完了していないため、送信されませんでした。入力内容はそのまま残っています。', '咨询接收设置尚未完成，未能发送。您填写的内容已保留。'],
  ];

  const col = { en: 1, ja: 2, zh: 3 };
  const pick = () => {
    /* /en/·/ja/·/zh/ 주소로 들어오면 그 언어로 고정한다 (서버가 html에 data-lang-force를 붙여 보낸다) */
    const forced = document.documentElement.dataset.langForce;
    if (LANGS.includes(forced)) { try { localStorage.setItem('demion-lang', forced); } catch {} return forced; }
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) { try { localStorage.setItem('demion-lang', q); } catch {} return q; }
    try { const saved = localStorage.getItem('demion-lang'); if (LANGS.includes(saved)) return saved; } catch {}
    /* 검색엔진 수집기는 브라우저 언어가 영어라 영문으로 읽어 간다. 원문(한국어)을 그대로 보여 준다 */
    if (/bot|crawl|spider|slurp|Yeti|Daum|facebookexternalhit|kakaotalk-scrap|Lighthouse/i.test(navigator.userAgent)) return 'ko';
    const nav = (navigator.language || '').slice(0, 2);
    return LANGS.includes(nav) ? nav : 'en';
  };
  const lang = pick();
  document.documentElement.lang = lang;
  const FONTS = { ja: 'Noto+Sans+JP', zh: 'Noto+Sans+SC' };
  if (FONTS[lang]) {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = `https://fonts.googleapis.com/css2?family=${FONTS[lang]}:wght@400;500;600&display=swap`;
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

    /* 언어 전환 링크: 같은 페이지의 언어별 주소로 보낸다 (한국어 / , 영어 /en/ , 일본어 /ja/ , 중국어 /zh/) */
    const base = location.pathname.replace(/^\/(en|ja|zh)(?=\/|$)/, '') || '/';
    document.querySelectorAll('[data-lang]').forEach(a => {
      const l = a.dataset.lang;
      a.href = l === 'ko' ? base + '?lang=ko' : '/' + l + base;
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
