// 작업 사진 목록: [파일 번호는 순서대로, 제목, 설명, 분류]
var WORKS = [
  ['레이어드 C컬펌', 'C컬펌 · 레이어드컷 · 롱', 'c'],
  ['히피펌', '히피펌 · 레이어드컷 · 롱', 'hippie'],
  ['애즈펌', '가르마펌 · 다운펌 · 댄디컷', 'men'],
  ['레이어드펌', '매트브라운 · 레이어드컷 · 롱', 'layered'],
  ['C컬펌 레이어드컷', 'C컬펌 · 레이어드펌 · 롱', 'c'],
  ['젤리펌 레이어드컷', '히피펌(젤리펌) · 롱', 'hippie'],
  ['레이어드펌 레이어드컷', '레이어드펌 · 롱', 'layered'],
  ['히피펌 레이어드컷', '히피펌(젤리펌) · 롱', 'hippie'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['빌드펌', '빌드펌(CS컬펌) · 매트브라운 · 롱', 'c'],
  ['글램펌', '미디움', 'glam'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['레이어드펌', '레이어드컷 · 롱', 'layered'],
  ['가르마펌', '가르마펌 · 댄디컷', 'men'],
  ['레이어드펌', '레이어드컷 · 롱', 'layered'],
  ['빌드펌 레이어드컷', '빌드펌(CS컬펌) · 롱', 'c'],
  ['젤리펌 레이어드컷', '히피펌(젤리펌) · 롱', 'hippie'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['레이어드펌', '레이어드컷 · 롱', 'layered'],
  ['가일펌 댄디컷', '가일펌 · 댄디컷', 'men'],
  ['C컬펌 레이어드컷', 'C컬펌 · 레이어드펌 · 롱', 'c'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['C컬펌 레이어드컷', 'C컬펌 · 미디움', 'c'],
  ['히피펌 레이어드컷', '히피펌(젤리펌) · 미디움', 'hippie'],
  ['C컬펌 레이어드컷', 'C컬펌 · 레이어드펌 · 미디움', 'c'],
  ['글램펌 레이어드컷', '레이어드펌 · 미디움', 'glam'],
  ['레이어드펌', 'S컬펌 · 레이어드컷 · 미디움', 'layered'],
  ['레이어드펌', '레이어드컷 · 롱', 'layered'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['히피펌 레이어드컷', '히피펌(젤리펌) · 미디움', 'hippie'],
  ['히피펌 레이어드컷', '히피펌(젤리펌) · 롱', 'hippie'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['레이어드컷 C컬펌', 'C컬펌 · 레이어드펌 · 미디움', 'c'],
  ['레이어드펌', '레이어드컷 · 미디움', 'layered'],
  ['레이어드펌', '레이어드컷 · 롱', 'layered'],
  ['레이어드펌', '레이어드컷 · 롱', 'layered']
].map(function (w, i) {
  var no = String(i + 1).padStart(2, '0');
  return { no: no, src: 'img/work/' + no + '.jpg', title: w[0], tags: w[1], cat: w[2] };
});

(function () {
  var PAGE = 12;
  var grid = document.getElementById('grid');
  var more = document.getElementById('more');
  var filterBtns = document.querySelectorAll('.filters button');
  var cat = 'all';
  var shown = PAGE;
  var list = WORKS;

  // 분류마다 사진 수 표시
  filterBtns.forEach(function (b) {
    var c = b.dataset.cat;
    b.querySelector('sup').textContent = c === 'all' ? WORKS.length : WORKS.filter(function (w) { return w.cat === c; }).length;
    b.addEventListener('click', function () {
      cat = c;
      shown = PAGE;
      filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });
  });

  function render() {
    list = cat === 'all' ? WORKS : WORKS.filter(function (w) { return w.cat === cat; });
    grid.innerHTML = list.slice(0, shown).map(function (w, i) {
      return '<li class="tile' + (i % 7 === 0 ? ' big' : '') + '">' +
        '<button type="button" data-i="' + i + '" aria-label="' + w.title + ' 크게 보기">' +
        '<img src="' + w.src + '" alt="' + w.title + ' — ' + w.tags + '" loading="lazy" decoding="async" width="884" height="1203">' +
        '</button>' +
        '<p class="cap"><span>' + w.no + '</span><b>' + w.title + '</b><i>' + w.tags + '</i></p></li>';
    }).join('');
    more.hidden = shown >= list.length;
    more.textContent = '더 보기 (' + (list.length - shown) + ')';
  }

  more.addEventListener('click', function () {
    shown += PAGE;
    render();
  });

  // 크게 보기
  var viewer = document.getElementById('viewer');
  var vImg = document.getElementById('viewerImg');
  var cur = 0;
  function show(i) {
    cur = (i + list.length) % list.length;
    var w = list[cur];
    vImg.src = w.src;
    vImg.alt = w.title + ' — ' + w.tags;
    document.getElementById('viewerNo').textContent = w.no;
    document.getElementById('viewerTitle').textContent = w.title;
    document.getElementById('viewerTags').textContent = w.tags;
  }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    show(+b.dataset.i);
    viewer.showModal();
  });
  viewer.querySelector('.v-prev').addEventListener('click', function () { show(cur - 1); });
  viewer.querySelector('.v-next').addEventListener('click', function () { show(cur + 1); });
  viewer.querySelector('.v-close').addEventListener('click', function () { viewer.close(); });
  viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  render();

  // 화면에 들어오면 살짝 떠오르며 나타난다
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.sec-head, .about-photo, .about-body, .sig-list li, .contact .display').forEach(function (el) {
      el.classList.add('rv');
      io.observe(el);
    });
  }
})();
