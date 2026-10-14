// 첫 화면 갤러리 — 카드가 옆으로 흐르고, 가운데 작품이 크게 펼쳐졌다 접힌다.
// 자동 재생: 이동 → 펼침 → 머묾 → 접힘 → 다음. 사용자가 조작하면 잠시 멈췄다 다시 시작한다.
(() => {
  const WORKS = [
    { img: "yeojeong",  title: "여정(旅程)",        size: "65×40×48(h)cm", mat: "레진(FRP)" },
    { img: "saedeul",   title: "새들의 노래",       size: "30×28×53(h)cm", mat: "레진(FRP)" },
    { img: "bohemian",  title: "Bohemian",          size: "20×18×45(h)cm", mat: "테라코타" },
    { img: "parangsae", title: "파랑새의 꿈",       size: "37×24×72(h)cm", mat: "레진(FRP)" },
    { img: "ajirang",   title: "아지랑이 피는 봄날", size: "36×35×53(h)cm", mat: "레진(FRP)" },
    { img: "guiro",     title: "귀로(歸路)",        size: "37×24×72(h)cm", mat: "레진(FRP)" },
  ];

  const GAP_RATIO = 0.22;  // 카드 사이 간격 (카드 폭 대비)
  const T_MOVE = 950, T_HOLD = 1900, T_REST = 600, IDLE_RESUME = 6000;

  const stage = document.querySelector(".stage");
  const track = document.getElementById("track");
  const caption = document.querySelector(".caption");
  const capTitle = document.getElementById("capTitle");
  const capSize = document.getElementById("capSize");
  const capMat = document.getElementById("capMat");
  const capIdx = document.getElementById("capIdx");
  document.getElementById("capTotal").textContent = String(WORKS.length).padStart(2, "0");

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = WORKS.length;
  let active = 0, open = false;
  const prevOff = new Array(n).fill(null);

  const cards = WORKS.map((w, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card";
    b.setAttribute("aria-label", `${w.title}, ${w.size}, ${w.mat}`);
    // 카카오톡 등 앱 안 브라우저에서 첫 요청이 깨지는 경우가 있어, 실패하면 두 번까지 다시 받는다
    const img = document.createElement("img");
    img.alt = "";
    let tries = 0;
    img.addEventListener("error", () => {
      if (tries >= 2) { img.style.visibility = "hidden"; return; }
      tries += 1;
      setTimeout(() => { img.src = `img/${w.img}.jpg?r=${tries}`; }, 400 * tries);
    });
    img.src = `img/${w.img}.jpg`;
    b.appendChild(img);
    b.addEventListener("click", () => {
      if (dragged) return;
      userAct();
      if (i === active) setOpen(!open);
      else go(i);
    });
    track.appendChild(b);
    return b;
  });

  const wrap = (d) => {
    const half = Math.floor(n / 2);
    d = ((d % n) + n) % n;
    return d > half - (n % 2 === 0 ? 1 : 0) ? d - n : d;
  };

  function openScale(card) {
    const w = card.offsetWidth, h = card.offsetHeight;
    return Math.min((innerWidth * 0.9) / w, (stage.clientHeight * 0.78) / h);
  }

  function layout() {
    const w = cards[0].offsetWidth;
    const gap = w * GAP_RATIO;
    const s = open ? openScale(cards[0]) : 1;
    const half = (w * s) / 2;
    // 펼칠 때는 카드를 화면 세로 가운데로 올린다
    const lift = open ? stage.clientHeight * 0.49 - cards[0].offsetTop : 0;

    cards.forEach((c, i) => {
      const off = wrap(i - active);
      // 한 번에 두 칸 이상 건너뛰는 카드(반대편으로 넘어가는 카드)는 순간이동시킨다
      const jump = prevOff[i] === null || Math.abs(off - prevOff[i]) > 1;
      if (jump) c.classList.add("no-anim");
      const x = off === 0 ? 0 : Math.sign(off) * (half + gap + w / 2 + (Math.abs(off) - 1) * (w + gap));
      c.style.transform = `translate(-50%, -50%) translate(${x}px, ${off === 0 ? lift : 0}px) scale(${off === 0 ? s : 1})`;
      c.style.opacity = Math.abs(off) > 2 ? 0 : 1;
      c.style.zIndex = off === 0 ? 3 : 1;
      c.classList.toggle("is-active", off === 0);
      c.classList.toggle("is-open", off === 0 && open);
      c.tabIndex = off === 0 ? 0 : -1;
      if (jump) { c.offsetWidth; c.classList.remove("no-anim"); }
      prevOff[i] = off;
    });
  }

  function setCaption() {
    const w = WORKS[active];
    caption.classList.add("swap");
    setTimeout(() => {
      capTitle.textContent = w.title;
      capSize.textContent = w.size;
      capMat.textContent = w.mat;
      capIdx.textContent = String(active + 1).padStart(2, "0");
      caption.classList.remove("swap");
    }, reduced ? 0 : 250);
  }

  function go(i) {
    open = false;
    active = ((i % n) + n) % n;
    layout();
    setCaption();
  }
  function setOpen(v) { open = v; layout(); }

  // ── 자동 재생 ──
  let timer = null, phase = 0, paused = false, idleTimer = null;
  const steps = [
    [() => setOpen(true), T_MOVE + T_HOLD],
    [() => setOpen(false), T_MOVE + T_REST],
    [() => go(active + 1), T_MOVE + 250],
  ];
  function tick() {
    const [fn, wait] = steps[phase];
    fn();
    phase = (phase + 1) % steps.length;
    timer = setTimeout(tick, wait);
  }
  function startAuto() {
    if (reduced || paused) return;
    clearTimeout(timer);
    phase = open ? 1 : 0;
    timer = setTimeout(tick, 900);
  }
  function stopAuto() { clearTimeout(timer); }
  function userAct() {
    stopAuto();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAuto, IDLE_RESUME);
  }

  stage.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { paused = true; stopAuto(); } });
  stage.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { paused = false; userAct(); } });
  document.addEventListener("visibilitychange", () => (document.hidden ? stopAuto() : startAuto()));

  document.querySelector(".prev").addEventListener("click", () => { userAct(); go(active - 1); });
  document.querySelector(".next").addEventListener("click", () => { userAct(); go(active + 1); });

  addEventListener("keydown", (e) => {
    if (stage.getBoundingClientRect().bottom < innerHeight * 0.5) return;
    if (e.key === "ArrowRight") { userAct(); go(active + 1); }
    else if (e.key === "ArrowLeft") { userAct(); go(active - 1); }
    else if (e.key === "Escape" && open) { userAct(); setOpen(false); }
  });

  // 스와이프
  let sx = null, dragged = false;
  stage.addEventListener("pointerdown", (e) => { sx = e.clientX; dragged = false; });
  stage.addEventListener("pointermove", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 8) dragged = true; });
  stage.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 50) { userAct(); go(active + (dx < 0 ? 1 : -1)); }
    setTimeout(() => (dragged = false), 0);
  });

  let rz;
  addEventListener("resize", () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(layout); });

  layout();
  setCaption();
  startAuto();

  // ── 작품 목록: 큰 제목에 마우스를 올리면 작품이 따라다니고, 누르면 첫 화면에서 크게 본다 ──
  const index = document.getElementById("workIndex");
  const peek = document.getElementById("peek");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  WORKS.forEach((w, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.innerHTML = `<sup>${String(i + 1).padStart(2, "0")}</sup>${w.title}<small>${w.size} · ${w.mat}</small>`;
    b.addEventListener("click", () => {
      peek.classList.remove("on");
      stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      userAct();
      go(i);
      setTimeout(() => setOpen(true), reduced ? 0 : 900);
    });
    if (finePointer) {
      b.addEventListener("pointerenter", () => { peek.style.backgroundImage = `url(img/${w.img}.jpg)`; peek.classList.add("on"); });
      b.addEventListener("pointerleave", () => peek.classList.remove("on"));
    }
    li.appendChild(b);
    index.appendChild(li);
  });
  if (finePointer) {
    addEventListener("pointermove", (e) => {
      if (!peek.classList.contains("on")) return;
      peek.style.left = `${e.clientX + 150}px`;
      peek.style.top = `${e.clientY}px`;
    });
  }

  // ── 왼쪽 세로 글씨: 지금 보고 있는 구역 이름 ──
  const side = document.querySelector(".side-label");
  const sideName = document.getElementById("sideName");
  const sections = [...document.querySelectorAll("[data-label]")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      sideName.textContent = en.target.dataset.label;
      side.classList.toggle("show", en.target !== stage);
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach((s) => io.observe(s));

  // ── 스크롤하면 천천히 떠오르기 ──
  if (!reduced) {
    const items = document.querySelectorAll(".dropcap-text, .collage, .two-col, .work-index li, .steps li, .ex-body, .press-list li, .contact-line");
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach((el, k) => {
      el.classList.add("reveal");
      el.style.transitionDelay = el.matches(".work-index li, .steps li") ? `${(k % 6) * 70}ms` : "";
      ro.observe(el);
    });
  }
})();
