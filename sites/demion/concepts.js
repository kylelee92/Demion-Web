/* 자체 콘셉트 디자인 3점 (가상 브랜드). 실제 고객 작업물이 아니다.
   모두 편집 가능한 HTML/CSS/SVG이며, 래스터 이미지나 생성 이미지를 쓰지 않는다. */
(() => {
  /* 공용 SVG 정의: 도자기 3종, 그림자 블러, 필름 입자 */
  const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="shade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".26" stop-color="#fff" stop-opacity=".20"/>
      <stop offset=".52" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".36"/>
    </linearGradient>
    <radialGradient id="dk"><stop offset="0" stop-color="#1d2023" stop-opacity=".5"/><stop offset=".6" stop-color="#1d2023" stop-opacity=".18"/><stop offset="1" stop-color="#1d2023" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="lt" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".4" stop-color="#FFFFFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".12"/></linearGradient>
    <filter id="blur8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="blur3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="blur14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    <path id="p-vase" d="M78 8H122C124 40 122 62 130 78C172 112 192 188 182 262C174 322 142 352 100 352C58 352 26 322 18 262C8 188 28 112 70 78C78 62 76 40 78 8Z"/>
    <path id="p-bowl" d="M6 24C6 24 16 104 120 114C224 104 234 24 234 24Z"/>
    <path id="p-cup" d="M12 14L26 132C28 142 44 146 66 146C88 146 104 142 106 132L120 14Z"/>
    <symbol id="v-vase" viewBox="0 0 200 360" overflow="visible">
      <use href="#p-vase" style="fill:var(--g)"/><use href="#p-vase" fill="url(#shade)"/>
      <ellipse cx="100" cy="8" rx="22" ry="5" fill="#000" fill-opacity=".45"/>
      <path d="M50 124C34 164 34 232 48 282" stroke="#fff" stroke-opacity=".30" stroke-width="5" fill="none" stroke-linecap="round"/>
    </symbol>
    <symbol id="v-bowl" viewBox="0 0 240 124" overflow="visible">
      <path d="M84 108H156L152 120H88Z" fill="#000" fill-opacity=".4"/>
      <use href="#p-bowl" style="fill:var(--g)"/><use href="#p-bowl" fill="url(#shade)"/>
      <ellipse cx="120" cy="24" rx="114" ry="15" style="fill:var(--g)"/>
      <ellipse cx="120" cy="26" rx="104" ry="11" fill="#000" fill-opacity=".30"/>
      <ellipse cx="120" cy="23" rx="104" ry="8" fill="#fff" fill-opacity=".10"/>
    </symbol>
    <symbol id="v-cup" viewBox="0 0 132 150" overflow="visible">
      <use href="#p-cup" style="fill:var(--g)"/><use href="#p-cup" fill="url(#shade)"/>
      <ellipse cx="66" cy="14" rx="54" ry="9" style="fill:var(--g)"/>
      <ellipse cx="66" cy="16" rx="47" ry="6" fill="#000" fill-opacity=".38"/>
    </symbol>
  </defs></svg>`;

  const vase = (x, y, w, g) => `<use href="#v-vase" x="${x}" y="${y}" width="${w}" height="${w * 1.8}" style="--g:${g}"/>`;
  const bowl = (x, y, w, g) => `<use href="#v-bowl" x="${x}" y="${y}" width="${w}" height="${w * 124 / 240}" style="--g:${g}"/>`;
  const cup = (x, y, w, g) => `<use href="#v-cup" x="${x}" y="${y}" width="${w}" height="${w * 150 / 132}" style="--g:${g}"/>`;
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.1}" ry="${rx * .16}" fill="url(#dk)"/>`;

  /* ---------- A. 소담 도예 — 도자기 공방 · 브랜드 사이트 ---------- */
  const aScene = `<svg viewBox="0 0 784 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="a-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E5E6E1"/><stop offset="1" stop-color="#C9CBC5"/></linearGradient>
      <linearGradient id="a-table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B3B5AD"/><stop offset="1" stop-color="#999B93"/></linearGradient>
    </defs>
    <rect width="784" height="560" fill="url(#a-wall)"/>
    <polygon points="430,0 784,0 784,430 250,430" fill="url(#lt)"/>
    <path d="M520 0V430M640 0V430" stroke="#4f5552" stroke-opacity=".07" stroke-width="12"/>
    <rect y="390" width="784" height="170" fill="url(#a-table)"/>
    <rect y="388" width="784" height="4" fill="#000" opacity=".10"/>
    ${shadow(142, 396, 126)}${shadow(432, 398, 110)}${shadow(626, 396, 62)}${shadow(732, 394, 46)}
    ${bowl(26, 270, 232, '#E4E1D8')}
    ${vase(332, 40, 200, '#BFC8B5')}
    ${cup(562, 242, 128, '#9C5F44')}
    ${vase(690, 238, 84, '#38342F')}
    
  </svg>`;

  const tile = (kind, g, x, y, w, extra = '') => `<svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <rect width="400" height="480" fill="${extra || '#DADBD6'}"/><rect y="372" width="400" height="108" fill="#B8BAB2"/>
    <rect y="370" width="400" height="3" fill="#000" opacity=".08"/>${shadow(200, 380, w * .55)}
    ${kind === 'vase' ? vase(x, y, w, g) : kind === 'bowl' ? bowl(x, y, w, g) : cup(x, y, w, g)}
    </svg>`;

  const aShelf = `<svg viewBox="0 0 600 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="600" height="560" fill="#D2D4CE"/>
    <path d="M110 560V210C110 120 190 70 300 70C410 70 490 120 490 210V560Z" fill="#ECEDE9"/>
    <path d="M110 560V210C110 120 190 70 300 70" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="10"/>
    <rect x="70" y="330" width="460" height="12" fill="#6E6A63"/><rect x="70" y="342" width="460" height="22" fill="#000" opacity=".12"/>
    <rect x="70" y="486" width="460" height="12" fill="#6E6A63"/><rect x="70" y="498" width="460" height="22" fill="#000" opacity=".12"/>
    ${vase(130, 200, 70, '#BFC8B5')}${vase(212, 238, 52, '#E4E1D8')}${cup(290, 262, 62, '#38342F')}${bowl(370, 284, 110, '#9C5F44')}
    ${bowl(100, 440, 120, '#E4E1D8')}${cup(250, 418, 66, '#BFC8B5')}${vase(340, 372, 48, '#38342F')}${cup(410, 424, 62, '#E4E1D8')}
    
  </svg>`;

  const A = `<div class="scr a">
    <header class="nav"><b class="logo">소담</b><nav><span>작품</span><span>수업</span><span>공방 이야기</span></nav><span class="cart">장바구니 0</span><span class="menu">메뉴</span></header>
    <section class="hero">
      <div class="t">
        <h3>흙의 결을 그대로,<br>매일 쓰는 그릇.</h3>
        <p>서울 서촌의 작은 공방에서 한 점씩 빚고 굽습니다. 유약마다 조금씩 다른 표정을 담았습니다.</p>
        <span class="lnk">작품 둘러보기</span>
      </div>
      <div class="img">${aScene}</div>
    </section>
    <section class="new">
      <div class="hd"><h4>새로 구운 작품</h4><span class="lnk">전체 보기</span></div>
      <div class="grid">
        <figure class="p1"><div class="im">${tile('vase', '#BFC8B5', 100, 70, 200)}</div><figcaption><b>결 화병</b><span>청자빛 유약</span></figcaption></figure>
        <figure class="p2"><div class="im">${tile('bowl', '#E4E1D8', 60, 262, 280, '#D3D5CF')}</div><figcaption><b>너른 대접</b><span>오트밀 유약</span></figcaption></figure>
        <figure class="p3"><div class="im">${tile('cup', '#9C5F44', 120, 190, 160)}</div><figcaption><b>손잡이 없는 잔</b><span>철분 유약</span></figcaption></figure>
        <figure class="p4"><div class="im">${tile('vase', '#38342F', 140, 130, 120, '#D0D2CC')}</div><figcaption><b>작은 먹빛 병</b><span>무광 흑유</span></figcaption></figure>
      </div>
    </section>
    <section class="story">
      <div class="img">${aShelf}</div>
      <div class="t">
        <h4>한 번에 많이 굽지 않습니다.</h4>
        <p>가마 하나에 담을 만큼만 빚습니다. 같은 유약도 불의 방향에 따라 색이 달라져서, 같은 그릇이 두 점 나오는 일은 없습니다.</p>
        <span class="lnk">공방 이야기</span>
      </div>
    </section>
    <section class="lesson">
      <h4>공방 수업</h4>
      <ul>
        <li><b>원데이 클래스</b><span>처음 흙을 만져보는 분께 맞춘 한나절 수업</span><i>토요일 오전</i></li>
        <li><b>정기 수업</b><span>물레와 핸드빌딩을 차근차근 배우는 과정</span><i>평일 저녁</i></li>
        <li><b>대관</b><span>작업 공간과 가마를 함께 쓸 수 있습니다</span><i>예약제</i></li>
      </ul>
    </section>
    <footer><b class="logo">소담</b><span>서울 서촌 · 가상의 브랜드를 위한 콘셉트 디자인</span></footer>
  </div>`;

  /* ---------- B. 해무 스테이 — 바닷가 숙소 ---------- */
  const bHero = `<svg viewBox="0 0 1280 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="b-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1823"/><stop offset=".38" stop-color="#2B3C4B"/><stop offset=".62" stop-color="#65798A"/><stop offset=".74" stop-color="#B9B4A9"/><stop offset="1" stop-color="#C9C0B1"/></linearGradient>
      <linearGradient id="b-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A7C87"/><stop offset=".5" stop-color="#2F3F4A"/><stop offset="1" stop-color="#151F27"/></linearGradient>
    </defs>
    <rect width="1280" height="760" fill="url(#b-sky)"/>
    <ellipse cx="300" cy="340" rx="520" ry="46" fill="url(#glow)" opacity=".10"/>
    <ellipse cx="900" cy="420" rx="560" ry="40" fill="url(#glow)" opacity=".12"/>
    <ellipse cx="520" cy="560" rx="700" ry="70" fill="url(#glow)" opacity=".22"/>
    <rect y="590" width="1280" height="170" fill="url(#b-sea)"/>
    <ellipse cx="765" cy="650" rx="90" ry="90" fill="url(#glow)" opacity=".16"/>
    <g stroke="#fff" fill="none" stroke-width="1.2">
      <path d="M0 606H1280" stroke-opacity=".16"/><path d="M0 622H1280" stroke-opacity=".10" stroke-dasharray="180 60 420 90"/>
      <path d="M0 642H1280" stroke-opacity=".10" stroke-dasharray="90 70 300 130"/><path d="M0 668H1280" stroke-opacity=".08" stroke-dasharray="260 110 140 70"/>
      <path d="M0 700H1280" stroke-opacity=".07" stroke-dasharray="120 150 340 80"/><path d="M0 734H1280" stroke-opacity=".06" stroke-dasharray="320 90 160 140"/>
    </g>
    <path d="M840 592C920 560 990 526 1070 530C1140 534 1200 556 1280 548V592Z" fill="#0A1016"/>
    <path d="M1004 530V506H1086V530Z" fill="#0A1016"/><path d="M996 508L1045 490L1094 508Z" fill="#0A1016"/><rect x="1028" y="514" width="14" height="9" fill="#F0C27E"/>
    <path d="M0 760V696C60 672 140 676 200 704C260 726 300 742 340 760Z" fill="#080D12"/>
    
  </svg>`;

  const bRoom1 = `<svg viewBox="0 0 640 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="b-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#425668"/><stop offset=".55" stop-color="#9AA5A6"/><stop offset=".56" stop-color="#53646E"/><stop offset="1" stop-color="#1E2A33"/></linearGradient></defs>
    <rect width="640" height="440" fill="#161D24"/><rect x="140" y="50" width="360" height="270" fill="url(#b-w)"/>
    <path d="M320 50V320M140 185H500" stroke="#10161C" stroke-width="10"/><rect x="140" y="50" width="360" height="270" fill="none" stroke="#10161C" stroke-width="16"/>
    <rect y="330" width="640" height="110" fill="#222A30"/><polygon points="170,330 470,330 560,440 80,440" fill="#B9C6CC" opacity=".12"/>
    <path d="M0 360H640M0 395H640" stroke="#000" stroke-opacity=".25"/></svg>`;
  const bRoom2 = `<svg viewBox="0 0 440 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="440" height="560" fill="#BDB5A8"/><rect y="0" width="440" height="270" fill="#CFC8BB"/>
    <rect x="40" y="150" width="360" height="26" fill="#6B5A47"/><rect x="40" y="176" width="360" height="40" fill="#000" opacity=".10"/>
    <rect x="40" y="260" width="360" height="190" fill="#EBE6DB"/><rect x="40" y="260" width="360" height="190" fill="url(#shade)" opacity=".5"/>
    <rect x="70" y="214" width="130" height="62" fill="#F5F1E8"/><rect x="240" y="214" width="130" height="62" fill="#F5F1E8"/>
    <rect x="70" y="214" width="130" height="62" fill="url(#shade)" opacity=".5"/><rect x="240" y="214" width="130" height="62" fill="url(#shade)" opacity=".5"/>
    <path d="M40 330H400" stroke="#000" stroke-opacity=".10" stroke-width="2"/><rect x="40" y="450" width="360" height="14" fill="#6B5A47"/>
    </svg>`;
  const bRoom3 = `<svg viewBox="0 0 640 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="b-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3B4B"/><stop offset=".5" stop-color="#8E8C86"/><stop offset=".6" stop-color="#D2B48C"/><stop offset=".61" stop-color="#4C5C66"/><stop offset="1" stop-color="#1B252D"/></linearGradient></defs>
    <rect width="640" height="440" fill="url(#b-t)"/>
    <rect y="300" width="640" height="8" fill="#0D1318"/><rect y="400" width="640" height="40" fill="#0D1318"/>
    <g fill="#0D1318">${Array.from({ length: 22 }, (_, i) => `<rect x="${12 + i * 29}" y="308" width="6" height="92"/>`).join('')}</g>
    </svg>`;

  const B = `<div class="scr b">
    <section class="hero">
      <div class="bg">${bHero}</div>
      <header class="nav"><b class="logo">해무</b><nav><span>객실</span><span>머무는 법</span><span>오시는 길</span></nav><span class="rsv">예약</span><span class="menu">메뉴</span></header>
      <div class="cap"><h3>바다가 먼저 보이는 집</h3><p>고요한 해안 마을에서 객실 세 채를 운영합니다.</p></div>
      <div class="book"><span><i>체크인</i>날짜 선택</span><span><i>체크아웃</i>날짜 선택</span><span><i>인원</i>2명</span><b>객실 보기</b></div>
    </section>
    <section class="intro"><p>아침에는 안개가 걷히는 소리를 듣고, 저녁에는 등대 불빛을 따라 걷습니다. 해무는 많은 것을 하지 않아도 되는 곳입니다.</p></section>
    <section class="rooms">
      <figure class="r1"><div class="im">${bRoom1}</div><figcaption><b>수평선 객실</b><span>통창으로 바다를 마주합니다</span></figcaption></figure>
      <figure class="r2"><div class="im">${bRoom2}</div><figcaption><b>모래 객실</b><span>낮은 침대와 나무 선반</span></figcaption></figure>
      <figure class="r3"><div class="im">${bRoom3}</div><figcaption><b>테라스 객실</b><span>해 질 녘에 가장 좋습니다</span></figcaption></figure>
    </section>
    <section class="info">
      <h4>머무는 법</h4>
      <dl>
        <div><dt>체크인</dt><dd>오후에 입실하고, 오전에 퇴실합니다.</dd></div>
        <div><dt>식사</dt><dd>아침은 마을 빵집의 빵과 직접 내린 커피를 준비합니다.</dd></div>
        <div><dt>오시는 길</dt><dd>주차 공간이 있으며, 버스 정류장에서 걸어서 갈 수 있습니다.</dd></div>
      </dl>
    </section>
    <footer><b class="logo">해무</b><span>가상의 브랜드를 위한 콘셉트 디자인</span></footer>
  </div>`;

  /* ---------- C. 마루 — 매출 정산 서비스 ---------- */
  const heights = [34, 52, 44, 66, 58, 74, 62, 48, 70, 84, 64, 78, 90, 72];
  const bars = heights.map((h, i) => `<rect x="${i * 30 + 4}" y="${100 - h}" width="18" height="${h}" fill="${i === 12 ? '#0C7A5A' : '#D5DAE0'}"/>`).join('');
  const rows = (items) => items.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="n">${r[2]}</td><td class="${r[4]}">${r[3]}</td></tr>`).join('');

  const C = `<div class="scr c">
    <header class="nav"><b class="logo">마루</b><nav><span>기능</span><span>연동</span><span>도입 문의</span></nav><span class="login">로그인</span><span class="menu">메뉴</span></header>
    <section class="hero">
      <div class="t">
        <h3>정산은 마루가,<br>사장님은 가게에.</h3>
        <p>카드, 배달, 현금 매출을 한곳에 모으고 입금 내역과 맞춰봅니다. 틀린 곳만 알려드립니다.</p>
        <div class="row"><span class="btn">도입 문의</span><span class="lnk">화면 보기</span></div>
      </div>
      <div class="ui">
        <div class="top"><b>정산 현황</b><span>이번 달 · 성수점</span></div>
        <div class="sum">
          <div><small>입금 예정</small><strong>4,820,000원</strong></div>
          <div><small>확인 필요</small><strong class="w">3건</strong></div>
          <div><small>정산 완료</small><strong>128건</strong></div>
        </div>
        <svg class="chart" viewBox="0 0 424 104" aria-hidden="true"><path d="M0 100H424" stroke="#E3E6EA"/>${bars}</svg>
        <table><thead><tr><th>날짜</th><th>채널</th><th class="n">금액</th><th>상태</th></tr></thead><tbody>
        ${rows([['10.12', '카드', '1,284,000', '입금 확인', 'ok'], ['10.12', '배달', '612,500', '차액 확인', 'warn'], ['10.11', '카드', '1,190,300', '입금 확인', 'ok'], ['10.11', '현금', '240,000', '입금 확인', 'ok']])}
        </tbody></table>
      </div>
    </section>
    <section class="feat f1">
      <div class="t"><h4>매출은 알아서 모입니다</h4><p>사용 중인 카드 단말기와 배달 앱을 연결해 두면 매일 내역이 한 화면에 쌓입니다.</p></div>
      <ul class="list"><li><b>카드 매출</b><span>연결됨</span></li><li><b>배달 앱</b><span>연결됨</span></li><li><b>현금영수증</b><span>연결됨</span></li><li><b>계좌 입금</b><span>연결 대기</span></li></ul>
    </section>
    <section class="feat f2">
      <div class="diff"><div class="d1"><small>예상</small><b>612,500원</b></div><div class="d2"><small>입금</small><b>598,000원</b></div><div class="d3"><small>차액</small><b>14,500원</b></div></div>
      <div class="t"><h4>맞지 않는 것만 보여줍니다</h4><p>예상 정산액과 실제 입금액을 비교해 차이가 나는 건만 따로 모아드립니다.</p></div>
    </section>
    <section class="cta"><h4>우리 가게에 맞는지 먼저 이야기해보세요.</h4><span class="btn">도입 문의</span></section>
    <footer><b class="logo">마루</b><span>가상의 브랜드를 위한 콘셉트 디자인</span></footer>
  </div>`;

  window.DEMION = { defs, html: { a: A, b: B, c: C } };
})();
