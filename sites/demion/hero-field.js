/* 첫 화면의 입자 세계: 수만 개의 빛 입자가 지구, 별 사면체, 정십이면체 틀, 데이터 지형, 큐브 무리, 팔면체 결정, 와이어 도넛, 워드마크로 모였다 흩어진다.
   라이브러리 없이 WebGL 점 하나로 그린다. WebGL이 없으면 아무것도 그리지 않아 글자와 버튼만 남는다. */
(() => {
  const canvas = document.querySelector('[data-hero-field]');
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

  /* ---------- 기하 모형: 면, 모서리 관, 선 위에 점을 뿌린다 ---------- */
  const rot = (v, ax, ay, az = 0) => {
    let [x, y, z] = v;
    [y, z] = [y * Math.cos(ax) - z * Math.sin(ax), y * Math.sin(ax) + z * Math.cos(ax)];
    [x, z] = [x * Math.cos(ay) + z * Math.sin(ay), -x * Math.sin(ay) + z * Math.cos(ay)];
    [x, y] = [x * Math.cos(az) - y * Math.sin(az), x * Math.sin(az) + y * Math.cos(az)];
    return [x, y, z];
  };
  const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const onTri = (a, b, c) => { let u = Math.random(), v = Math.random(); if (u + v > 1) { u = 1 - u; v = 1 - v; } return [a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v, a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v, a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * v]; };
  /* 모서리를 두께 r의 관으로: 선을 따라 고르게, 단면은 원 둘레 */
  const onTube = (a, b, r) => {
    const t = Math.random(), p = lerp3(a, b, t);
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d);
    const T = d.map(x => x / l);
    const h = Math.abs(T[0]) < .9 ? [1, 0, 0] : [0, 1, 0];
    let N = [T[1] * h[2] - T[2] * h[1], T[2] * h[0] - T[0] * h[2], T[0] * h[1] - T[1] * h[0]];
    const nl = Math.hypot(...N); N = N.map(x => x / nl);
    const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]];
    const ang = rand(Math.PI * 2), c = Math.cos(ang) * r, s = Math.sin(ang) * r;
    return [p[0] + N[0] * c + B[0] * s, p[1] + N[1] * c + B[1] * s, p[2] + N[2] * c + B[2] * s];
  };
  /* 길이에 비례해 모서리를 고른다 */
  const pickerBy = (items, w) => { const cum = []; let t = 0; items.forEach((_, i) => cum.push(t += w(items[i]))); return () => { const r = Math.random() * t; let lo = 0, hi = cum.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; } return items[lo]; }; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const edgesOf = (verts, len) => { const e = []; for (let i = 0; i < verts.length; i++) for (let j = i + 1; j < verts.length; j++) if (Math.abs(dist(verts[i], verts[j]) - len) < 1e-3) e.push([verts[i], verts[j]]); return e; };
  const build = (fn, tilt = [0, 0, 0]) => { const out = new Float32Array(COUNT * 3); for (let i = 0; i < COUNT; i++) out.set(rot(fn(), ...tilt), i * 3); return out; };

  /* 별 사면체: 서로 꿰뚫은 두 정사면체. 면에 70%, 모서리에 30% */
  function starTetra() {
    const A = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => v.map(x => x * .5));
    const Bv = A.map(v => v.map(x => -x));
    const faces = [], edges = [];
    [A, Bv].forEach(T => {
      faces.push([T[0], T[1], T[2]], [T[0], T[1], T[3]], [T[0], T[2], T[3]], [T[1], T[2], T[3]]);
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push([T[i], T[j]]);
    });
    return build(() => Math.random() < .7 ? onTri(...faces[Math.floor(Math.random() * 8)]) : onTube(...edges[Math.floor(Math.random() * 12)], .008), [.35, .3, .1]);
  }

  /* 정십이면체 틀: 오각형 서른 모서리를 굵은 관으로 */
  function dodecaFrame() {
    const g = (1 + Math.sqrt(5)) / 2, k = 1 / g;
    const V = [];
    for (const a of [-1, 1]) for (const b of [-1, 1]) {
      for (const c of [-1, 1]) V.push([a, b, c]);
      V.push([0, a * k, b * g], [a * k, b * g, 0], [a * g, 0, b * k]);
    }
    const s = .82 / Math.sqrt(3);
    const E = edgesOf(V, 2 * k).map(([a, b]) => [a.map(x => x * s), b.map(x => x * s)]);
    return build(() => onTube(...E[Math.floor(Math.random() * E.length)], .06), [.3, .2, 0]);
  }

  /* 3×3×3 큐브: 조금씩 어긋난 떠 있는 큐브들. 바깥을 향한 면만 그려 속이 엉키지 않게 한다 */
  function cubeGrid() {
    const P = .46, H = .16, faces = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      const g = [x, y, z];
      const c = [x * P + rand(.03, -.03), y * P + rand(.05, -.05), z * P + rand(.03, -.03)];
      for (let axis = 0; axis < 3; axis++) if (g[axis] !== 0) faces.push([c, axis, g[axis] * H]);
    }
    return build(() => {
      const [c, axis, side] = faces[Math.floor(Math.random() * faces.length)];
      /* 모서리를 또렷하게 */
      const edge = Math.random() < .55;
      const u = edge ? (Math.random() < .5 ? -H : H) : rand(H, -H), v = rand(H, -H);
      const q = axis === 0 ? [side, u, v] : axis === 1 ? [u, side, v] : [u, v, side];
      return [c[0] + q[0], c[1] + q[1], c[2] + q[2]];
    }, [.5, .62, 0]);
  }

  /* 정팔면체 세 개를 x, y, z축으로 45°씩 돌려 겹친 결정: 모서리 관 75%, 면 25% */
  function octaCompound() {
    const O = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(v => v.map(x => x * .8));
    const F = [];
    for (const sx of [0, 1]) for (const sy of [2, 3]) for (const sz of [4, 5]) F.push([O[sx], O[sy], O[sz]]);
    const E = edgesOf(O, .8 * Math.SQRT2);
    const q = Math.PI / 4, turns = [[q, 0, 0], [0, q, 0], [0, 0, q]];
    return build(() => {
      const t = turns[Math.floor(Math.random() * 3)];
      const p = Math.random() < .75 ? onTube(...E[Math.floor(Math.random() * E.length)], .022) : onTri(...F[Math.floor(Math.random() * 8)]);
      return rot(p, ...t);
    }, [.4, .25, 0]);
  }

  /* 와이어프레임 도넛: 세로 고리 28개, 가로 고리 12개 */
  function torusWire() {
    const R = .6, r = .27;
    return build(() => {
      let u, v;
      if (Math.random() < .62) { u = Math.floor(Math.random() * 28) / 28 * Math.PI * 2; v = rand(Math.PI * 2); }
      else { v = Math.floor(Math.random() * 12) / 12 * Math.PI * 2; u = rand(Math.PI * 2); }
      const w = R + r * Math.cos(v);
      return [w * Math.cos(u) + rand(.004, -.004), r * Math.sin(v) + rand(.004, -.004), w * Math.sin(u)];
    }, [1.05, 0, .25]);
  }

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
      shapes[i] = [sphere, starTetra, dodecaFrame, terrain, cubeGrid, octaCompound, torusWire, () => fromDrawing(wordmark)][i]();
    }
    return shapes[i];
  };
  /* 모형마다 도는 빠르기. 워드마크만 돌지 않는다 */
  const SPINS = [1, .6, .5, .12, .45, .5, .4, 0];
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
