/* 첫 화면의 입자 세계: 수만 개의 빛 입자가 지구, 홈페이지, 모바일 화면, 데이터 지형으로 모였다 흩어진다.
   라이브러리 없이 WebGL 점 하나로 그린다. WebGL이 없으면 아무것도 그리지 않아 글자와 버튼만 남는다. */
(() => {
  const canvas = document.querySelector('[data-field]');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return;

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = innerWidth < 760;
  const COUNT = small ? 14000 : 34000;

  /* ---------- 모양 만들기: 각 모양은 COUNT개의 (x, y, z) ---------- */
  const rand = (a = 1, b = 0) => b + Math.random() * (a - b);

  function sphere() {
    const out = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      /* 위도·경도 선 위에 몰아 그려 데이터 지구처럼 보이게 한다 */
      const onGrid = Math.random() < .62;
      let lat = Math.asin(rand(1, -1));
      let lon = rand(Math.PI * 2);
      if (onGrid) {
        if (Math.random() < .5) lat = Math.round(lat / (Math.PI / 12)) * (Math.PI / 12);
        else lon = Math.round(lon / (Math.PI / 12)) * (Math.PI / 12);
      }
      const r = .78 + (onGrid ? 0 : rand(.012, -.012));
      out[i * 3] = r * Math.cos(lat) * Math.cos(lon);
      out[i * 3 + 1] = r * Math.sin(lat);
      out[i * 3 + 2] = r * Math.cos(lat) * Math.sin(lon);
    }
    return out;
  }

  function terrain() {
    const out = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const x = rand(1.9, -1.9);
      const d = rand(1, -1);
      const h = Math.sin(x * 2.6 + d * 2.2) * .13 + Math.sin(x * 6.1 - d * 3.7) * .05 + Math.cos(d * 7.3 + x) * .04;
      out[i * 3] = x;
      out[i * 3 + 1] = h - .2 + d * -.34;
      out[i * 3 + 2] = d * 1.25;
    }
    return out;
  }

  /* 2D 캔버스에 그린 화면의 밝은 부분을 입자 위치로 뽑는다 */
  function fromDrawing(draw, spanX = small ? 1.18 : 1.45, z = 0) {
    const W = 640, H = 400;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    draw(ctx, W, H);
    const px = ctx.getImageData(0, 0, W, H).data;
    const pool = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = px[(y * W + x) * 4];
      if (v > 8) pool.push(x, y, v / 255);
    }
    const out = new Float32Array(COUNT * 3);
    const n = pool.length / 3;
    for (let i = 0; i < COUNT; i++) {
      let k;
      do { k = Math.floor(Math.random() * n); } while (Math.random() > pool[k * 3 + 2]);
      out[i * 3] = ((pool[k * 3] + Math.random()) / W - .5) * spanX * 2;
      out[i * 3 + 1] = -((pool[k * 3 + 1] + Math.random()) / H - .5) * spanX * 2 * (H / W);
      out[i * 3 + 2] = z + rand(.012, -.012);
    }
    return out;
  }

  const box = (ctx, x, y, w, h, level = 1) => { const v = Math.round(level * 255); ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(x, y, w, h); };
  const frame = (ctx, x, y, w, h, t = 2) => { ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, t); ctx.fillRect(x, y + h - t, w, t); ctx.fillRect(x, y, t, h); ctx.fillRect(x + w - t, y, t, h); };

  /* 편집 디자인형 홈페이지 */
  const pageA = (c, W, H) => {
    frame(c, 40, 16, W - 80, H - 32);
    box(c, 40, 34, W - 80, 2, 1);
    [56, 68, 80].forEach(x => box(c, x, 23, 6, 6, 1));
    box(c, 64, 62, 250, 34, 1); box(c, 64, 106, 190, 34, 1);
    box(c, 64, 156, 150, 3, 1); box(c, 64, 168, 120, 3, 1);
    box(c, 64, 190, 76, 22, 1);
    box(c, 356, 58, 220, 168, .1); frame(c, 356, 58, 220, 168);
    [0, 1, 2].forEach(i => { box(c, 64 + i * 174, 250, 164, 100, .07); frame(c, 64 + i * 174, 250, 164, 100, 2); box(c, 64 + i * 174, 358, 110, 3, 1); });
  };
  /* 작품 갤러리형 홈페이지 */
  const pageB = (c, W, H) => {
    frame(c, 40, 16, W - 80, H - 32);
    box(c, 40, 34, W - 80, 2, 1);
    box(c, 64, 54, 512, 44, 1);
    [[64, 112, 250, 118, .12], [326, 112, 120, 118, .06], [458, 112, 118, 118, .09], [64, 242, 120, 118, .07], [196, 242, 180, 118, .12], [388, 242, 188, 118, .05]]
      .forEach(([x, y, w, h, l]) => { box(c, x, y, w, h, l); frame(c, x, y, w, h, 2); });
  };
  /* 모바일 화면 세 장 */
  const phones = (c, W, H) => {
    [[92, 44, 136, 312], [252, 20, 136, 360], [412, 44, 136, 312]].forEach(([x, y, w, h], i) => {
      frame(c, x, y, w, h, 2);
      box(c, x + w / 2 - 18, y + 8, 36, 5, .9);
      box(c, x + 14, y + 26, w - 28, i === 1 ? 110 : 80, .12); frame(c, x + 14, y + 26, w - 28, i === 1 ? 110 : 80, 1);
      box(c, x + 14, y + (i === 1 ? 150 : 120), w - 44, 12, 1);
      box(c, x + 14, y + (i === 1 ? 170 : 140), w - 28, 3, 1);
      box(c, x + 14, y + (i === 1 ? 182 : 152), w - 50, 3, 1);
      box(c, x + 14, y + h - 44, w - 28, 28, .5);
    });
  };
  /* 브랜드 이름 */
  const wordmark = (c, W, H) => {
    c.fillStyle = '#fff';
    c.font = '600 150px Pretendard Variable, Pretendard, Arial, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.letterSpacing = '-6px';
    c.fillText('demion', W / 2, H / 2);
  };

  let shapes = [];
  const shape = i => {
    if (!shapes[i]) {
      shapes[i] = [sphere, () => fromDrawing(pageA), () => fromDrawing(phones), terrain, () => fromDrawing(pageB), () => fromDrawing(wordmark)][i]();
    }
    return shapes[i];
  };
  /* 지구와 지형만 3차원으로 돈다 */
  const SPINS = [1, .0, .0, .12, .0, .0];
  const SHAPES = SPINS.length;

  /* ---------- 셰이더 ---------- */
  const VS = `
    attribute vec3 aA; attribute vec3 aB; attribute vec4 aSeed;
    uniform float uTime, uMix, uSpinA, uSpinB, uScatter, uAspect, uDpr, uScale;
    uniform vec2 uOffset, uMouse, uTilt, uPulsePos;
    uniform float uPulse;
    varying float vAlpha; varying float vTone;

    vec3 spin(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c); }

    void main() {
      /* 입자마다 출발 시각을 달리해 먼지 폭풍처럼 모인다 */
      float d = aSeed.x * .55;
      float t = clamp((uMix - d) / (1. - .55), 0., 1.);
      float e = t * t * t * (t * (t * 6. - 15.) + 10.);

      vec3 a = spin(aA, uTime * .16 * uSpinA);
      vec3 b = spin(aB, uTime * .16 * uSpinB);
      vec3 p = mix(a, b, e);

      /* 이동 중 소용돌이 */
      float storm = sin(3.14159 * e);
      float ph = aSeed.w * 6.283;
      p.x += storm * sin(ph + uTime * .7 + p.y * 3.) * .34;
      p.y += storm * cos(ph * 1.7 + uTime * .6 + p.x * 3.) * .28;
      p.z += storm * sin(ph * 2.3 + uTime * .5) * .34;

      /* 가만히 있어도 살아 있는 미세한 숨 */
      p += vec3(sin(uTime * .9 + ph), cos(uTime * .7 + ph * 1.3), sin(uTime * .8 + ph * 2.)) * .004;

      /* 마우스에 따라 살짝 기울어진다 */
      float cy = cos(uTilt.x), sy = sin(uTilt.x), cx = cos(uTilt.y), sx = sin(uTilt.y);
      p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
      p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);

      /* 스크롤하면 사방으로 흩어진다 */
      p *= 1. + uScatter * (.6 + aSeed.y * 3.2);

      float persp = 1. / (1. + p.z * .42);
      vec2 clip = p.xy * persp * uScale;
      clip.x /= uAspect;
      clip += uOffset;

      /* 마우스가 입자를 밀어낸다 */
      vec2 toM = clip - uMouse; toM.x *= uAspect;
      float dist = length(toM);
      clip += normalize(toM + .0001) * vec2(1. / uAspect, 1.) * exp(-dist * dist * 34.) * .085;

      /* 클릭하면 파동이 퍼진다 */
      vec2 toP = clip - uPulsePos; toP.x *= uAspect;
      float dp = length(toP);
      float wave = exp(-pow(dp - uPulse * 1.5, 2.) * 90.) * (1. - uPulse);
      clip += normalize(toP + .0001) * vec2(1. / uAspect, 1.) * wave * .12;

      gl_Position = vec4(clip, 0., 1.);
      gl_PointSize = (1.0 + aSeed.y * .55 + wave * 2.5) * uDpr * persp;

      /* 제목이 있는 왼쪽 아래는 어둡게 눌러 글자를 살린다 */
      float title = smoothstep(-1.05, -.15, clip.y + (clip.x + 1.) * -.12);
      vAlpha = (.5 + aSeed.y * .12) * persp * mix(.2, 1., title) * smoothstep(1.02, .8, clip.y) * (1. - uScatter) * (1. + wave * 2.);
      vTone = aSeed.z;
    }`;
  const FS = `
    precision mediump float;
    varying float vAlpha; varying float vTone;
    void main() {
      vec2 q = gl_PointCoord - .5;
      float r = dot(q, q);
      if (r > .25) discard;
      /* 대부분 뼈색, 일부만 코발트와 주황 */
      vec3 col = vec3(.93, .91, .87);
      if (vTone > .965) col = vec3(1., .36, .16);
      else if (vTone > .86) col = vec3(.36, .47, 1.);
      gl_FragColor = vec4(col * vAlpha * (1. - r * 2.), 0.);
    }`;

  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);

  const U = name => gl.getUniformLocation(prog, name);
  const u = Object.fromEntries(['uTime', 'uMix', 'uSpinA', 'uSpinB', 'uScatter', 'uAspect', 'uDpr', 'uScale', 'uOffset', 'uMouse', 'uTilt', 'uPulse', 'uPulsePos'].map(n => [n, U(n)]));

  const attr = (name, size, data) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return buf;
  };
  const seeds = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT * 4; i++) seeds[i] = Math.random();
  attr('aSeed', 4, seeds);

  /* 시작: 입자가 넓게 흩어진 먼지 상태에서 지구로 모인다 */
  const dust = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) dust[i] = rand(2.6, -2.6);
  const bufA = attr('aA', 3, dust);
  const bufB = attr('aB', 3, shape(0));

  const setBuf = (buf, data) => { gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, data); };

  /* ---------- 크기와 위치 ---------- */
  let aspect = 1;
  const dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75);
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = r.width / r.height;
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uDpr, dpr);
    /* 가로 화면은 제목 오른쪽 위, 세로 화면은 제목 위 */
    const wide = aspect > 1.15;
    gl.uniform1f(u.uScale, wide ? .74 : Math.min(.62, aspect * .8));
    gl.uniform2f(u.uOffset, wide ? .36 : 0, wide ? .27 : .42);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* ---------- 입력 ---------- */
  const pointer = { x: 9, y: 9, tx: 9, ty: 9, tiltX: 0, tiltY: 0 };
  const toClip = e => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
  };
  addEventListener('pointermove', e => { [pointer.tx, pointer.ty] = toClip(e); }, { passive: true });
  let pulse = 1;
  const pulsePos = [0, 0];
  addEventListener('pointerdown', e => {
    if (state.scatter > .4) return;
    [pulsePos[0], pulsePos[1]] = toClip(e);
    pulse = 0;
  }, { passive: true });

  /* ---------- 장면 순서와 그리기 ---------- */
  const HOLD = 3.1, MORPH = 2.6;
  const state = { scatter: 0 };
  let current = 0, spinA = 0, spinB = SPINS[0], phaseStart = performance.now() / 1000, morphing = true, running = false, last = 0;

  function next() {
    setBuf(bufA, shape(current));
    spinA = SPINS[current];
    current = (current + 1) % SHAPES;
    setBuf(bufB, shape(current));
    spinB = SPINS[current];
  }

  function draw(now) {
    const time = now / 1000;
    const dt = Math.min(.05, time - last || 0);
    last = time;
    const held = time - phaseStart;
    let mix;
    if (morphing) {
      mix = Math.min(1, held / MORPH);
      if (mix >= 1) { morphing = false; phaseStart = time; }
    } else {
      mix = 1;
      if (held > HOLD) {
        /* 지구는 돌던 각도 그대로 넘어가야 튀지 않으므로 시작 형태를 도는 값과 맞춘다 */
        next();
        morphing = true;
        phaseStart = time;
        mix = 0;
      }
    }
    pointer.x += (pointer.tx - pointer.x) * .14;
    pointer.y += (pointer.ty - pointer.y) * .14;
    const inside = Math.abs(pointer.tx) < 2;
    pointer.tiltX += ((inside ? pointer.tx * .22 : 0) - pointer.tiltX) * .05;
    pointer.tiltY += ((inside ? pointer.ty * -.14 : 0) - pointer.tiltY) * .05;
    pulse = Math.min(1, pulse + dt * .9);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uMix, mix);
    gl.uniform1f(u.uSpinA, spinA);
    gl.uniform1f(u.uSpinB, spinB);
    gl.uniform1f(u.uScatter, state.scatter);
    gl.uniform2f(u.uMouse, pointer.x, pointer.y);
    gl.uniform2f(u.uTilt, pointer.tiltX, pointer.tiltY);
    gl.uniform1f(u.uPulse, pulse);
    gl.uniform2f(u.uPulsePos, pulsePos[0], pulsePos[1]);
    gl.drawArrays(gl.POINTS, 0, COUNT);
  }

  function loop(now) {
    if (!running) return;
    draw(now);
    requestAnimationFrame(loop);
  }
  const wake = () => {
    /* 완전히 흩어졌거나 탭이 가려지면 멈춰 배터리를 아낀다 */
    const should = !calm && !document.hidden && state.scatter < 1;
    if (should && !running) { running = true; last = 0; requestAnimationFrame(loop); }
    if (!should) running = false;
  };
  document.addEventListener('visibilitychange', wake);

  if (calm) {
    /* 움직임 줄이기: 완성된 지구 한 장면만 그린다 */
    phaseStart = -100; morphing = false;
    setBuf(bufA, shape(0));
    draw(0);
  } else {
    wake();
  }
  canvas.classList.add('on');

  /* motion.js가 스크롤에 맞춰 흩어지는 정도를 넘겨준다 */
  window.HeroField = { state, wake };
})();
