// .js 클래스는 index.html <head>에서 먼저 붙인다(첫 화면 깜빡임 방지).
// 스크립트가 꺼져 있어도 모든 내용은 그대로 보인다.
//
// 검토용 시각 흉내: ?t=15:00&d=2 처럼 붙이면 그 요일·시각의 매대를 보여준다.
// (d: 0=일 … 6=토) 고객에게 "오후엔 이렇게 보입니다"를 보여줄 때 쓴다.
(function () {
  var HOURS = {
    0: [9, 18],   // 일
    1: null,      // 월 휴무
    2: [8, 19],
    3: [8, 19],
    4: [8, 19],
    5: [8, 19],
    6: [9, 18]    // 토
  };
  var DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  var DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  // 가게 기준 시각은 서울이다. 방문자 기기 시간대와 무관하게 계산한다.
  function seoulNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return '';
    };
    return {
      day: DAY_INDEX[get('weekday')],
      minutes: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10)
    };
  }

  function toMinutes(hhmm) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');
    return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null;
  }

  function resolveNow() {
    var now = seoulNow();
    var q = new URLSearchParams(location.search);
    var t = toMinutes(q.get('t'));
    var d = q.get('d');
    if (t !== null) now.minutes = t;
    if (d !== null && /^[0-6]$/.test(d)) now.day = parseInt(d, 10);
    return now;
  }

  function hourLabel(h) { return (h < 10 ? '0' : '') + h + '시'; }

  function nextOpening(day, minutes) {
    for (var offset = 0; offset < 8; offset++) {
      var d = (day + offset) % 7;
      var h = HOURS[d];
      if (!h) continue;
      if (offset === 0 && minutes >= h[0] * 60) continue;
      var when = offset === 0 ? '오늘' : offset === 1 ? '내일' : DAY_NAMES[d] + '요일';
      return when + ' ' + hourLabel(h[0]) + '에 문 엽니다';
    }
    return '';
  }

  function stamp(tag, reason) {
    tag.classList.add('is-off');
    var name = tag.querySelector('.tag__name');
    tag.setAttribute('aria-label', (name ? name.textContent : '') + ', ' + reason);
  }

  var now = resolveNow();
  if (now.day === undefined || isNaN(now.minutes)) return;

  var today = HOURS[now.day];
  var open = !!today && now.minutes >= today[0] * 60 && now.minutes < today[1] * 60;

  // 상단 띠: 지금 영업 중인지 ('월 휴무'는 옆 칸에 항상 남는다)
  var status = document.querySelector('[data-status]');
  var statusWrap = document.querySelector('[data-status-wrap]');
  if (status) {
    if (statusWrap) statusWrap.setAttribute('data-open', open ? 'true' : 'false');
    status.textContent = open
      ? '지금 영업 중 · ' + hourLabel(today[1]) + '까지'
      : '지금은 닫혀 있어요 · ' + nextOpening(now.day, now.minutes);
  }

  // 요일 한정 품목: 해당 요일이 아니면 '오늘 없음'
  var limited = document.querySelectorAll('[data-days]');
  for (var i = 0; i < limited.length; i++) {
    var days = limited[i].getAttribute('data-days').split(',').map(Number);
    if (days.indexOf(now.day) === -1) stamp(limited[i], '오늘은 나오지 않습니다');
  }

  // 시각 기준 품절: 영업일에 지정 시각이 지나면 '품절'
  var timed = document.querySelectorAll('[data-soldout-after]');
  for (var j = 0; j < timed.length; j++) {
    var after = toMinutes(timed[j].getAttribute('data-soldout-after'));
    if (today && after !== null && now.minutes >= after) stamp(timed[j], '오늘 분은 품절되었습니다');
  }
})();
