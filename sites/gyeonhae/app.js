/* 견해 犬解 — 컨셉 데모 스크립트
   AI 분석은 브라우저 안의 규칙으로 흉내 낸 시연입니다. 제품·브랜드는 모두 가상입니다. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ── 헤더 그림자 ── */
  const nav = $(".nav");
  addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

  /* ── 성분 사전 (시연용) ── */
  const ING = {
    chicken: "닭고기", beef: "소고기", wheat: "밀", corn: "옥수수", soy: "대두", dairy: "유제품", egg: "계란",
    salmon: "연어", duck: "오리", lamb: "양고기", sweetpotato: "고구마", pumpkin: "단호박", blueberry: "블루베리",
    rice: "현미", pea: "완두", fishoil: "정제어유", krill: "크릴오일", biotin: "비오틴", zinc: "아연",
    glucosamine: "글루코사민", msm: "MSM", greenlip: "초록입홍합", probiotic: "유산균 5종", inulin: "이눌린",
    milkthistle: "밀크씨슬", same: "SAMe", lutein: "루테인", bilberry: "빌베리", seaweed: "해초분말",
    carnitine: "L-카르니틴", poultry: "가금육분", chicken_fat: "닭지방", chlorophyll: "클로로필",
  };
  const ALLERGEN_OF = { chicken_fat: "chicken" };   // 파생 원료 → 알레르기 성분 ID
  const VAGUE = { poultry: ["chicken", "duck"] };   // 포괄 원료 — 무엇이 들었는지 라벨만으로 알 수 없음

  /* ── 3단계 시그널 체험 ── */
  const sigBag = ["salmon", "sweetpotato", "pea", "rice", "poultry", "fishoil", "blueberry", "pumpkin"];
  const sigIng = $("#sigIng");
  const sigResult = $("#sigResult");
  function judgeSignal() {
    const picked = $$("#sigAllergy .chip[aria-pressed=true]").map((b) => b.dataset.v);
    let level = "safe";
    sigIng.innerHTML = sigBag.map((id) => {
      const hit = picked.includes(ALLERGEN_OF[id] || id);
      const vague = !hit && VAGUE[id] && VAGUE[id].some((a) => picked.includes(a));
      if (hit) level = "avoid";
      else if (vague && level === "safe") level = "warn";
      return `<li class="${hit ? "hit" : vague ? "vague" : ""}">${ING[id]}${vague ? " ⚠" : ""}</li>`;
    }).join("");
    const map = { safe: ["안전", "sig--safe"], warn: ["주의", "sig--warn"], avoid: ["회피", "sig--avoid"] };
    sigResult.className = `sig sig--lg ${map[level][1]}`;
    sigResult.textContent = map[level][0];
  }
  $$("#sigAllergy .chip").forEach((b) => b.addEventListener("click", () => {
    b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
    judgeSignal();
  }));
  judgeSignal();

  /* ── 히어로 릴 (Jitter Color Blocks 구도) ── */
  // 브랜드 4색만 쓴다. 블록 색은 그 장면의 포스터 배경색과 겹치지 않게. a·c = [색, left, top, w, h] / b = [색, right, bottom, w, h] (%)
  const C = { mustard: "#f3b23a", green: "#195b51", salmon: "#f2774f", mint: "#8fd3bd" };
  const SLIDES = [
    { tag: "성분 판정", board: "#e4ebe8", chip: ["safe", "안전", "연어 · 고구마 · 블루베리"],
      a: [C.mustard, 0, 0, 40, 30], b: [C.mint, 0, 4, 42, 38], c: [C.salmon, 74, 8, 9, 22] },
    { tag: "건강검진 해석", board: "#f1eadf", chip: ["warn", "주의", "ALT 168 · 참고 범위 초과"],
      a: [C.salmon, 4, 14, 26, 46], b: [C.green, 6, 0, 30, 30], c: [C.mustard, 72, 4, 12, 22] },
    { tag: "맞춤 추천", board: "#e6eee9", chip: ["avoid", "회피", "닭고기 포함 → 추천에서 제외"],
      a: [C.mustard, 12, 0, 50, 20], b: [C.salmon, 0, 10, 28, 46], c: [C.mint, 8, 34, 14, 20] },
  ];
  const reel = $("#reel");
  const imgs = $$(".reel__img");
  const dots = $$(".reel__dots button");
  const [A, B, Cc] = ["#blkA", "#blkB", "#blkC"].map((s) => $(s));
  const chip = $("#reelChip");
  let cur = 0, timer;
  function show(i) {
    const s = SLIDES[i];
    imgs.forEach((im, k) => { im.classList.toggle("is-out", k === cur && k !== i); im.classList.toggle("is-on", k === i); });
    setTimeout(() => imgs.forEach((im, k) => k !== i && im.classList.remove("is-out")), 950);
    reel.style.setProperty("--board", s.board);
    // 블록은 무대 전체 크기에서 transform으로만 옮기고 줄인다 (레이아웃 재계산 없음)
    const place = (el, [bg, x, y, w, h]) => Object.assign(el.style, {
      backgroundColor: bg, transform: `translate(${x}%, ${y}%) scale(${w / 100}, ${h / 100})`,
    });
    place(A, s.a);
    place(B, [s.b[0], 100 - s.b[1] - s.b[3], 100 - s.b[2] - s.b[4], s.b[3], s.b[4]]);
    place(Cc, s.c);
    chip.classList.add("is-swap");
    setTimeout(() => {
      chip.querySelector(".sig").className = `sig sig--${s.chip[0]}`;
      chip.querySelector(".sig").textContent = s.chip[1];
      $("#reelChipText").textContent = s.chip[2];
      chip.classList.remove("is-swap");
    }, 380);
    $("#reelNo").textContent = `Reading 0${i + 1} / 0${SLIDES.length}`;
    $("#reelTag").textContent = s.tag;
    dots.forEach((d, k) => {
      d.setAttribute("aria-selected", k === i);
      d.style.animation = "none"; void d.offsetWidth; d.style.animation = "";
    });
    cur = i;
  }
  function loop() { clearInterval(timer); if (!reduce) timer = setInterval(() => show((cur + 1) % SLIDES.length), 3200); }
  dots.forEach((d, k) => d.addEventListener("click", () => { show(k); loop(); }));
  show(0); loop();

  /* ── 제품 카탈로그 (시연용 가상 제품) ── */
  const P = [
    { t: "영양제", n: "오메가 스킨 오일", b: "씨앤펫", e: "🐟", c: "#fbd3c3", ing: ["salmon", "fishoil", "biotin", "zinc"], good: ["skin", "coat", "tear"] },
    { t: "영양제", n: "크릴 오메가 츄", b: "그린테이블", e: "🦐", c: "#fbd3c3", ing: ["krill", "duck", "sweetpotato", "biotin"], good: ["skin", "coat"] },
    { t: "영양제", n: "리버 실드 츄어블", b: "모아랩", e: "🌿", c: "#cdeee3", ing: ["milkthistle", "same", "pumpkin"], good: ["liver"] },
    { t: "영양제", n: "조인트 플러스 치킨맛", b: "바른펫", e: "🦴", c: "#e4ebe8", ing: ["glucosamine", "msm", "greenlip", "chicken"], good: ["joint", "senior"] },
    { t: "영양제", n: "조인트 무브 오리맛", b: "모아랩", e: "🦴", c: "#e4ebe8", ing: ["glucosamine", "msm", "greenlip", "duck"], good: ["joint", "senior"] },
    { t: "영양제", n: "장 편한 유산균 밀크", b: "바른펫", e: "🥛", c: "#f9e1ad", ing: ["probiotic", "dairy", "pumpkin"], good: ["gut", "appetite"] },
    { t: "영양제", n: "프로바이오 장건강 파우더", b: "그린테이블", e: "🌱", c: "#f9e1ad", ing: ["probiotic", "inulin", "sweetpotato"], good: ["gut", "appetite"] },
    { t: "영양제", n: "루테인 아이 케어", b: "씨앤펫", e: "👁", c: "#e4ebe8", ing: ["lutein", "bilberry", "blueberry"], good: ["tear", "senior"] },
    { t: "영양제", n: "덴탈 해초 파우더", b: "모아랩", e: "🌊", c: "#cdeee3", ing: ["seaweed", "probiotic"], good: ["dental"] },
    { t: "간식", n: "연어 큐브 트릿", b: "씨앤펫", e: "🍣", c: "#fbd3c3", ing: ["salmon", "sweetpotato"], good: ["skin", "coat", "appetite"] },
    { t: "간식", n: "닭가슴살 져키", b: "바른펫", e: "🍗", c: "#f9e1ad", ing: ["chicken"], good: ["appetite"] },
    { t: "간식", n: "오리 & 고구마 스틱", b: "그린테이블", e: "🍠", c: "#f9e1ad", ing: ["duck", "sweetpotato"], good: ["appetite", "gut", "skin"] },
    { t: "간식", n: "소고기 우족", b: "바른펫", e: "🥩", c: "#fbd3c3", ing: ["beef"], good: ["dental"], watch: ["weight", "lipid", "liver"], wr: "고지방" },
    { t: "간식", n: "그린 덴탈 껌", b: "모아랩", e: "🦷", c: "#cdeee3", ing: ["wheat", "chlorophyll", "pea"], good: ["dental"] },
    { t: "간식", n: "동결건조 블루베리", b: "그린테이블", e: "🍇", c: "#e4ebe8", ing: ["blueberry"], good: ["tear", "weight", "senior"] },
    { t: "간식", n: "라이스 퍼프 저칼로리", b: "씨앤펫", e: "🍘", c: "#f9e1ad", ing: ["rice", "pumpkin"], good: ["weight", "gut", "lipid", "liver"] },
    { t: "사료", n: "어덜트 연어 & 고구마", b: "그린테이블", e: "🥣", c: "#cdeee3", ing: ["salmon", "sweetpotato", "pea", "fishoil"], good: ["skin", "coat"] },
    { t: "사료", n: "가수분해 오리 & 현미", b: "모아랩", e: "🥣", c: "#cdeee3", ing: ["duck", "rice", "fishoil"], good: ["skin", "gut", "tear", "coat"] },
    { t: "사료", n: "웨이트 케어 램", b: "바른펫", e: "🥣", c: "#f9e1ad", ing: ["lamb", "rice", "carnitine", "poultry"], good: ["weight", "lipid", "liver"] },
    { t: "사료", n: "시니어 라이트 치킨", b: "씨앤펫", e: "🥣", c: "#f9e1ad", ing: ["chicken", "corn", "glucosamine"], good: ["senior", "joint", "weight", "lipid"] },
    { t: "사료", n: "하이프로틴 비프", b: "바른펫", e: "🥣", c: "#fbd3c3", ing: ["beef", "pea", "chicken_fat"], good: ["coat"], watch: ["kidney", "liver", "lipid"], wr: "고단백 · 고지방" },
    { t: "사료", n: "라이트 연어 & 현미", b: "씨앤펫", e: "🥣", c: "#cdeee3", ing: ["salmon", "rice", "carnitine", "fishoil"], good: ["weight", "lipid", "liver", "skin"] },
  ];

  /* ── 상태 사전 ── */
  const AREA = {
    skin:     { l: "피부 · 가려움", e: "🐾", c: "#fbd3c3", d: "알레르기 성분 회피와 오메가-3가 도움이 될 수 있어요" },
    coat:     { l: "모질 · 털 빠짐", e: "✨", c: "#f9e1ad", d: "비오틴 · 아연 · 오메가-3 섭취를 살펴보세요" },
    tear:     { l: "눈물 자국", e: "💧", c: "#e4ebe8", d: "식이 알레르기와 연관된 경우가 많아요" },
    gut:      { l: "장 · 변 상태", e: "🌱", c: "#cdeee3", d: "급여 변경은 7일에 걸쳐 천천히 바꿔 주세요" },
    joint:    { l: "관절 · 보행", e: "🦴", c: "#e4ebe8", d: "절뚝임이 계속되면 슬개골 검사를 권해요" },
    weight:   { l: "체중 관리", e: "⚖️", c: "#f9e1ad", d: "간식은 하루 열량의 10% 이내로 맞춰 주세요" },
    appetite: { l: "식욕", e: "🍽", c: "#f9e1ad", d: "기호성 높은 단일 단백질 간식으로 시작해 보세요" },
    dental:   { l: "구강 · 치석", e: "🦷", c: "#cdeee3", d: "양치 습관이 가장 효과적이에요" },
    water:    { l: "음수량 증가", e: "🚰", c: "#fbd3c3", d: "신장 · 내분비 질환의 신호일 수 있어 진료를 권해요", vet: true },
    liver:    { l: "간 수치", e: "🧪", c: "#fbd3c3", d: "고지방 간식을 줄이고 2~4주 뒤 재검을 권해요" },
    kidney:   { l: "신장 수치", e: "🩺", c: "#fbd3c3", d: "식이 조절 전에 수의사 상담을 먼저 권해요", vet: true },
    lipid:    { l: "콜레스테롤", e: "🧈", c: "#f9e1ad", d: "지방 함량이 낮은 사료 · 간식이 좋아요" },
    glucose:  { l: "혈당", e: "🩸", c: "#fbd3c3", d: "추천 대신 수의사 상담을 먼저 권해요", vet: true },
    senior:   { l: "시니어 케어", e: "🌙", c: "#e4ebe8", d: "7살 이후엔 관절 · 눈 · 신장을 함께 살펴요" },
  };
  const KEYWORDS = [
    [/긁|가려|핥|발진|비듬|붉/, "skin"], [/눈물/, "tear"], [/설사|묽|토[해했]|구토/, "gut"],
    [/절뚝|다리|관절|슬개/, "joint"], [/살이|뚱|체중|비만/, "weight"], [/입\s?냄새|치석|구취/, "dental"],
    [/털/, "coat"], [/물을?\s?많이|음수/, "water"], [/안\s?먹|식욕|밥을?/, "appetite"],
  ];

  /* ── 검진 항목 (표준 코드) ── */
  const LAB = [
    { k: "ALT", n: "간 효소", u: "U/L", lo: 10, hi: 125, v: 168, cond: "liver" },
    { k: "ALKP", n: "알칼리성 인산분해효소", u: "U/L", lo: 23, hi: 212, v: 190, cond: "liver" },
    { k: "BUN", n: "혈중 요소질소", u: "mg/dL", lo: 7, hi: 27, v: 22, cond: "kidney" },
    { k: "CREA", n: "크레아티닌", u: "mg/dL", lo: 0.5, hi: 1.8, v: 1.1, cond: "kidney" },
    { k: "GLU", n: "혈당", u: "mg/dL", lo: 70, hi: 143, v: 98, cond: "glucose" },
    { k: "TCHO", n: "총 콜레스테롤", u: "mg/dL", lo: 110, hi: 320, v: 352, cond: "lipid" },
    { k: "TP", n: "총 단백", u: "g/dL", lo: 5.2, hi: 8.2, v: 6.9 },
    { k: "ALB", n: "알부민", u: "g/dL", lo: 2.3, hi: 4.0, v: 3.1 },
  ];
  const labRows = $("#labRows");
  function flagOf(r, v) { return isNaN(v) ? "" : v > r.hi ? "hi" : v < r.lo ? "lo" : "ok"; }
  function renderLab() {
    labRows.innerHTML = LAB.map((r, i) => {
      const f = flagOf(r, r.v);
      return `<tr><td><b>${r.k}</b><small>${r.n}</small></td>
        <td><input type="number" step="any" inputmode="decimal" value="${r.v}" data-i="${i}" aria-label="${r.k} 수치 (${r.u})"></td>
        <td class="rng">${r.lo}–${r.hi} ${r.u}</td>
        <td><span class="flag flag--${f}">${{ hi: "높음", lo: "낮음", ok: "정상" }[f]}</span></td></tr>`;
    }).join("");
  }
  labRows.addEventListener("input", (e) => {
    const i = e.target.dataset.i; if (i == null) return;
    LAB[i].v = parseFloat(e.target.value);
    const f = flagOf(LAB[i], LAB[i].v);
    const tag = e.target.closest("tr").querySelector(".flag");
    tag.className = `flag flag--${f}`; tag.textContent = { hi: "높음", lo: "낮음", ok: "정상", "": "—" }[f];
  });
  let labLoaded = false;
  async function loadLab(fileName) {
    const ocr = $("#ocr");
    $("#ocrFile").textContent = fileName;
    ocr.hidden = false;
    labRows.innerHTML = `<tr><td colspan="4" class="muted" style="padding:18px 6px">검진표를 읽는 중이에요…</td></tr>`;
    await wait(900);
    renderLab();
    labLoaded = true;
  }
  $("#file").addEventListener("change", (e) => { const f = e.target.files[0]; if (f) loadLab(f.name); });
  $("#sample").addEventListener("click", () => loadLab("예시_검진표_2026-09.pdf"));
  const drop = $("#drop");
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, () => drop.classList.add("is-over")));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));

  /* ── 폼: 단계 이동 · 칩 ── */
  const form = $("#labForm");
  const panes = $$(".pane", form);
  const stepLis = $$(".steps li", form);
  let step = 0;
  function go(n) {
    step = Math.max(0, Math.min(panes.length - 1, n));
    panes.forEach((p, i) => p.classList.toggle("is-on", i === step));
    stepLis.forEach((li, i) => { li.classList.toggle("is-on", i === step); li.classList.toggle("is-done", i < step); });
    if (innerWidth < 960) form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  $$("[data-next]", form).forEach((b) => b.addEventListener("click", () => go(step + 1)));
  $$("[data-prev]", form).forEach((b) => b.addEventListener("click", () => go(step - 1)));

  form.addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c || !form.contains(c)) return;
    if (c.classList.contains("chip--custom")) { c.remove(); syncCustomHint(); return; }
    c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true");
  });

  const allergyBox = $("#allergyBox");
  $$("input[name=allergyState]").forEach((r) => r.addEventListener("change", () => {
    allergyBox.hidden = form.allergyState.value !== "yes";
  }));
  function syncCustomHint() { $("#customHint").hidden = !$(".chip--custom", form); }
  function addCustom() {
    const inp = $("#allergyCustom"); const v = inp.value.trim(); if (!v) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip chip--custom"; b.setAttribute("aria-pressed", "true");
    b.dataset.label = v; b.textContent = `${v} · 자동 대조 안 됨`;
    b.setAttribute("aria-label", `${v} 삭제 (자동 대조 안 됨)`);
    $("#allergyChips").append(b); inp.value = ""; syncCustomHint();
  }
  $("#allergyAdd").addEventListener("click", addCustom);
  $("#allergyCustom").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } });

  const act = $("#act"), actOut = $("#actOut");
  act.addEventListener("input", () => { actOut.textContent = ["", "적음", "보통", "많음"][act.value]; });
  form.name.addEventListener("input", () => { $("#idleName").textContent = form.name.value.trim() || "우리 아이"; });

  /* ── 분석 ── */
  function analyze() {
    const name = form.name.value.trim() || "우리 아이";
    const age = parseFloat(form.age.value) || 0;
    const kg = parseFloat(form.weight.value) || 0;
    const state = form.allergyState.value;
    const allergies = state === "yes" ? $$("#allergyChips .chip:not(.chip--custom)[aria-pressed=true]").map((b) => b.dataset.v) : [];
    const custom = state === "yes" ? $$("#allergyChips .chip--custom").map((b) => b.dataset.label) : [];

    const conds = new Set($$("#symChips .chip[aria-pressed=true]").map((b) => b.dataset.v));
    const note = form.note.value;
    KEYWORDS.forEach(([re, c]) => re.test(note) && conds.add(c));
    if (age >= 7) conds.add("senior");

    const labNotes = [];
    if (labLoaded) LAB.forEach((r) => {
      const f = flagOf(r, r.v);
      if (f === "hi" && r.cond) {
        conds.add(r.cond);
        labNotes.push({ ...r, ratio: r.v / r.hi });
      }
    });

    const judge = (p) => {
      const hit = p.ing.find((i) => allergies.includes(ALLERGEN_OF[i] || i));
      if (hit) return { lv: "avoid", why: `${ING[hit]} 포함 — ${name}의 알레르기 성분` };
      const vg = p.ing.find((i) => VAGUE[i] && VAGUE[i].some((a) => allergies.includes(a)));
      if (vg) return { lv: "warn", why: `포괄 원료 ‘${ING[vg]}’ — 어떤 고기인지 라벨로 확인 불가` };
      const w = (p.watch || []).filter((c) => conds.has(c));
      if (w.length) return { lv: "warn", why: `${p.wr} — ${w.map((c) => AREA[c].l).join(" · ")} 주의` };
      return { lv: "safe" };
    };

    const scored = P.map((p) => {
      const j = judge(p);
      const hits = p.good.filter((g) => conds.has(g));
      return { ...p, ...j, hits, score: hits.length * 3 + (hits.includes("skin") ? 1 : 0) };
    }).filter((p) => p.hits.length);

    const safe = scored.filter((p) => p.lv === "safe").sort((a, b) => b.score - a.score);
    const picks = [
      ...safe.filter((p) => p.t === "영양제").slice(0, 2),
      ...safe.filter((p) => p.t === "간식").slice(0, 2),
      ...safe.filter((p) => p.t === "사료").slice(0, 1),
    ];
    const excluded = scored.filter((p) => p.lv !== "safe").slice(0, 5);

    const order = ["kidney", "glucose", "water", "liver", "skin", "lipid", "joint", "gut", "tear", "weight", "coat", "dental", "appetite", "senior"];
    const areas = order.filter((c) => conds.has(c)).map((c) => {
      const a = AREA[c];
      const lab = labNotes.find((r) => r.cond === c);
      let lv = a.vet ? "vet" : ["skin", "liver", "lipid", "joint"].includes(c) ? "care" : "watch";
      if (lab && lab.ratio > 2) lv = "vet";
      return { key: c, ...a, lv, lab };
    });
    return { name, age, kg, allergies, custom, state, areas, picks, excluded, conds };
  }

  function renderReport(r) {
    const lvTxt = { watch: "관찰", care: "관리", vet: "상담 권고" };
    const top = r.areas.filter((a) => a.key !== "senior").slice(0, 2).map((a) => a.l.split(" ")[0]);
    const headline = top.length ? `${esc(r.name)}에게 지금 필요한 건<br>${top.map(esc).join(" · ")} 케어예요` : `${esc(r.name)}는 지금 큰 걱정 없이 건강해 보여요`;
    const hasVet = r.areas.some((a) => a.lv === "vet");
    const allergyLine = r.state === "unknown" ? "알레르기 ‘모름’ — 판정은 알레르기 없이 계산했어요"
      : r.state === "no" ? "알레르기 없음"
      : r.allergies.length ? `알레르기 ${r.allergies.map((a) => ING[a]).join(" · ")}` : "알레르기 미입력";

    const out = $("#rOut");
    out.innerHTML = `
      <div class="rhead">
        <p class="mono">견해 리포트 · ${new Date().toLocaleDateString("ko-KR")}</p>
        <h3>${headline}</h3>
        <p>${esc(form.breed.value || "반려견")} · ${r.age}살 · ${r.kg}kg · ${allergyLine}</p>
      </div>
      <div class="rbody">
        ${r.custom.length ? `<p class="hint"><b>자동 대조 안 됨</b> · ‘${r.custom.map(esc).join("’, ‘")}’은(는) 성분 사전과 연결되지 않아 아래 판정에 반영되지 않았어요.</p>` : ""}
        ${hasVet ? `<p class="hint" style="background:#fbd3c3;color:#8a2a1c"><b>먼저 동물병원에 가 보세요</b> · 일부 항목은 식이보다 진료가 우선이에요. 견해는 질병을 진단하지 않아요.</p>` : ""}
        <div class="rsec">
          <h4>관심 영역</h4>
          <div class="areas">${r.areas.length ? r.areas.map((a) => `
            <div class="area">
              <span class="area__ic" style="--c:${a.c}">${a.l[0]}</span>
              <div><b>${a.l}${a.lab ? ` · ${a.lab.k} ${a.lab.v}` : ""}</b><small>${a.d}</small></div>
              <span class="lvl lvl--${a.lv}">${lvTxt[a.lv]}</span>
            </div>`).join("") : `<p class="muted">입력한 내용에서 특별한 관심 영역을 찾지 못했어요.</p>`}
          </div>
        </div>
        <div class="rsec">
          <h4>${esc(r.name)}에게 맞는 제품 · ${r.picks.length}</h4>
          <div class="picks">${r.picks.length ? r.picks.map((p) => `
            <article class="pick">
              <span class="pick__ph" style="--c:${p.c}">${p.t[0]}</span>
              <div>
                <div class="pick__top"><span class="pick__type">${p.t} · ${p.b}</span><span class="sig sig--safe">안전</span></div>
                <b>${p.n}</b>
                <p><span class="why">${p.hits.map((h) => AREA[h].l.split(" ")[0]).join(" · ")}</span>에 도움 · ${p.ing.map((i) => ING[i]).join(", ")}</p>
              </div>
            </article>`).join("") : `<p class="muted">조건에 맞는 안전한 제품이 아직 없어요. 억지로 보여 드리지 않을게요.</p>`}
          </div>
        </div>
        ${r.excluded.length ? `
        <div class="rsec">
          <h4>추천에서 뺀 제품 · 이유 공개</h4>
          <ul class="excl">${r.excluded.map((p) => `
            <li><span class="sig sig--${p.lv}">${p.lv === "avoid" ? "회피" : "주의"}</span><span><b>${p.n}</b></span><span>${esc(p.why)}</span></li>`).join("")}
          </ul>
        </div>` : ""}
        <p class="rnote"><b>판정 범위</b> · 등록 전성분 · 연결된 알레르기 · 입력한 검진 수치 기준이에요. 함량 · 급여량 · 약물 상호작용은 반영되지 않아요. 순서는 광고로 바뀌지 않아요. <br>※ 컨셉 시연 — 표시된 제품과 브랜드는 모두 가상입니다.</p>
        <div class="ractions">
          <button type="button" class="btn btn--sm" id="again">다시 입력하기</button>
          <button type="button" class="btn btn--sm btn--ghost" disabled title="출시 예정">월간 리포트 받기 · 준비 중</button>
        </div>
      </div>`;
    $("#again").addEventListener("click", () => {
      $("#rOut").hidden = true; $("#rIdle").hidden = false; go(0);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.consent.checked) { form.consent.focus(); form.consent.closest(".consent").style.color = "var(--avoid)"; return; }
    const result = analyze();
    $("#rIdle").hidden = true; $("#rOut").hidden = true; $("#rLoad").hidden = false;
    stepLis.forEach((li) => { li.classList.remove("is-on"); li.classList.add("is-done"); });
    if (innerWidth < 960) $("#report").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const items = $$("#loadList li");
    items.forEach((li) => li.className = "");
    for (const li of items) { li.className = "is-run"; await wait(520); li.className = "is-done"; }
    await wait(200);
    $("#rLoad").hidden = true;
    renderReport(result);
    $("#rOut").hidden = false;
  });

  /* ── 고민별 찾기 ── */
  const CONCERNS = [
    ["🐾", "피부 · 가려움", "오메가-3 · 아연", "닭고기 · 소고기 (알레르기 시)", "#fbd3c3"],
    ["💧", "눈물 자국", "루테인 · 단일 단백질", "인공 색소", "#e4ebe8"],
    ["🌱", "장 · 소화", "유산균 · 이눌린 · 단호박", "고지방 간식", "#cdeee3"],
    ["🦴", "관절 · 슬개골", "글루코사민 · 초록입홍합", "과체중", "#e4ebe8"],
    ["⚖️", "체중 관리", "L-카르니틴 · 식이섬유", "고칼로리 간식", "#f9e1ad"],
    ["🩺", "신장 · 음수", "저인 · 정제어유", "고단백 · 고인", "#fbd3c3"],
    ["🦷", "구강 · 치석", "해초분말 · 덴탈 껌", "당분 간식", "#cdeee3"],
    ["🌙", "시니어", "항산화 · 관절 · 눈", "고나트륨", "#e4ebe8"],
    ["✨", "모질 · 털 빠짐", "비오틴 · 아연", "저품질 지방", "#f9e1ad"],
    ["😌", "스트레스", "L-테아닌 · 트립토판", "카페인 성분", "#cdeee3"],
  ];
  $("#concernGrid").innerHTML = CONCERNS.map(([, t, good, bad, c], i) => `
    <a class="cc" href="#analyze" style="--c:${c}">
      <span class="cc__no" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <b>${t}</b>
      <p>도움 <em>${good}</em><br>주의 <s>${bad}</s></p>
    </a>`).join("");

  /* ── 실시간 판정 피드 (예시) ── */
  const FEED = [
    ["서울 마포구", "보리", "말티푸 · 7살", "어덜트 연어 & 고구마", "safe", "닭고기 알레르기 — 전성분에 닭 관련 원료 없음"],
    ["경기 성남시", "콩이", "포메라니안 · 3살", "조인트 플러스 치킨맛", "avoid", "닭고기 알레르기 — 같은 분류 안전 대안 4개 확인"],
    ["부산 해운대구", "두부", "비숑 · 9살", "하이프로틴 비프", "warn", "신장 수치 주의 — 고단백 · 고인 사료"],
    ["서울 송파구", "모카", "푸들 · 5살", "웨이트 케어 램", "warn", "포괄 원료 ‘가금육분’ — 오리 포함 여부 미확인"],
    ["인천 연수구", "호두", "웰시코기 · 4살", "라이스 퍼프 저칼로리", "safe", "체중 관리 중 — 하루 열량 10% 이내 급여"],
    ["대구 수성구", "라떼", "시츄 · 11살", "루테인 아이 케어", "safe", "눈물 자국 · 시니어 — 알레르기 성분 없음"],
    ["경기 고양시", "밤이", "믹스 · 6살", "그린 덴탈 껌", "avoid", "밀 알레르기 — 덴탈 해초 파우더로 대안 확인"],
    ["서울 강서구", "쿠키", "말티즈 · 8살", "소고기 우족", "warn", "간 수치(ALT) 주의 — 고지방 간식"],
    ["광주 북구", "망고", "골든 리트리버 · 2살", "가수분해 오리 & 현미", "safe", "피부 가려움 — 단일 단백질 사료"],
  ];
  const lvMap = { safe: "안전", warn: "주의", avoid: "회피" };
  const feedEl = $("#feedList");
  const ago = ["방금", "1분 전", "3분 전", "6분 전", "9분 전", "12분 전"];
  const fdHTML = (f, i, isNew) => `
    <article class="fd${isNew ? " is-new" : ""}">
      <div class="fd__top"><span>${i === 0 ? '<span class="new">NEW</span>' : ""}${f[0]} (${f[1]})</span><span>${ago[i] || "15분 전"}</span></div>
      <p class="fd__pet">${f[1]}<span>${f[2]}</span></p>
      <div class="fd__prod"><span class="sig sig--${f[4]}">${lvMap[f[4]]}</span><b>${f[3]}</b></div>
      <p class="fd__why">${f[5]}</p>
    </article>`;
  let fi = 0;
  const shown = FEED.slice(0, 6);
  fi = 6;
  const drawFeed = (fresh) => { feedEl.innerHTML = shown.map((f, i) => fdHTML(f, i, fresh && i === 0)).join(""); };
  drawFeed(false);
  if (!reduce) setInterval(() => {
    shown.unshift(FEED[fi % FEED.length]); shown.pop(); fi++;
    drawFeed(true);
  }, 4200);
})();
