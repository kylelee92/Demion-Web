// Orbit 휠: 카드 화면 채우기 + 한 칸씩 전진 모드
(() => {
  const FACES = [
    { key: 'day', html: '<div class="face f-green"><b>하루</b><span>첫 디자인을<br>먼저 확인합니다</span></div>' },
    { key: 'maru', html: '<div class="face f-maru"><div class="nav"><span>마루</span><i><s></s></i></div><h4>매출 정산을<br>한 화면에서</h4><div class="panel"><b></b><b></b><b></b><b></b><b></b></div><span class="tag">자체 콘셉트</span></div>' },
    { key: 'mark', html: '<div class="face f-mark"><b>d</b></div>' },
    { key: 'type', html: '<div class="face f-type"><div class="roll">먼저<br>보고<br>결정<br>하는<br>먼저<br>보고<br>결정<br>하는<br></div></div>' },
    { key: 'jhw', href: 'https://jhw.demion.co', html: '<div class="face f-shot"><img src="img/face-jhw.jpg" alt="" decoding="async"><span class="tag">조각가 조희욱 · 실제 작업</span></div>' },
    { key: 'gw', href: 'https://gw.demion.co', html: '<div class="face f-shot"><img src="img/face-gw.jpg" alt="" decoding="async"><span class="tag">GW컨설팅 · 자체 콘셉트</span></div>' },
    { key: 'mobile', href: 'https://jhw.demion.co', html: '<div class="face f-phone"><div class="ph"><div><div class="face f-shot f-shot-full"><img src="img/face-jhw.jpg" alt="" decoding="async"></div></div></div><span class="tag">모바일 · 조희욱</span></div>' },
    { key: 'spec', html: '<div class="face f-spec"><b>웹과<br>모바일</b><ul><li><span>신규 제작</span><span>01</span></li><li><span>기존 개선</span><span>02</span></li><li><span>디자인·개발</span><span>03</span></li></ul></div>' },
  ];

  // 작업 타일: <div data-face="jhw"> 안에 같은 화면을 채운다
  document.querySelectorAll('[data-face]').forEach((el) => {
    el.innerHTML = FACES.find((f) => f.key === el.dataset.face).html;
  });

  document.querySelectorAll('.orbit-wheel').forEach((wheel) => {
    // 실제 작업 카드는 누르면 그 사이트를 새 창으로 연다 (휠은 장식이라 키보드 탭 순서에서는 뺀다)
    wheel.innerHTML = FACES.map((f) => f.href
      ? `<a class="orbit-card is-link" data-key="${f.key}" href="${f.href}" target="_blank" rel="noopener" tabindex="-1">${f.html}</a>`
      : `<div class="orbit-card" data-key="${f.key}">${f.html}</div>`).join('');
    const scene = wheel.closest('.orbit-scene');
    if (scene.classList.contains('is-step')) stepper(scene, [...wheel.children]);
  });

  // 카드가 15°씩 왼쪽으로 한 칸 전진, 3200ms 주기 (회전 2100 + 정지 1100)
  function stepper(scene, cards) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let angles = cards.map((_, i) => 45 - i * 15);
    const apply = () => {
      const order = angles.map((a, i) => [a, i]).sort((x, y) => x[0] - y[0]);
      order.forEach(([, idx], rank) => cards[idx].style.setProperty('--i', rank));
      cards.forEach((c, i) => c.style.setProperty('--a', angles[i] + 'deg'));
      const center = cards[angles.indexOf(0)];
      scene.dispatchEvent(new CustomEvent('orbit:center', { detail: center.dataset.key }));
    };
    const step = () => {
      if (document.hidden) return;
      angles = angles.map((a) => a - 15);
      cards.forEach((c, i) => {
        if (angles[i] < -60) {
          c.classList.add('is-wrap');
          c.style.setProperty('--a', '60deg');
          c.getBoundingClientRect();
          c.classList.remove('is-wrap');
          angles[i] = 45;
        }
      });
      apply();
    };
    apply();
    if (!reduce) setInterval(step, 3200);
  }
})();
