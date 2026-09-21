// .js 클래스는 index.html <head>에서 먼저 붙인다(첫 화면 깜빡임 방지).
// JS가 꺼져 있으면 .reveal 이 숨겨지지 않아 모든 내용이 그대로 보인다.
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();
