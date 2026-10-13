# Motion Style Guide: Orbit Cards

> 출처: Jitter 템플릿 **"Orbit: Cards"** (artboard `ORBIT 5-01 LITE`, RICO.SUPPLY)
> https://jitter.video/file/?id=vwnGG7_Iy8W1GpNMCxr8t&bucket=snackthis-userdata
> 수치는 Jitter 프로젝트 원본 JSON(v20)에서 직접 추출. 등록일 2026-10-13.

세로형 카드 8장이 화면 아래에 숨은 거대한 원판(휠) 둘레에 꽂혀 있고, 휠이 한 칸씩 **돌았다가 → 멈췄다가 → 되돌아오는** 5.3초 루프. 조용한 회색 무대 위에서 카드 속 미디어만 색을 갖고, UI 텍스트는 작은 모노스페이스 캡션으로 물러나 있다.

---

## 1. Text (Typography)

캔버스 위의 실제 텍스트 레이어는 **하단 메타 캡션 한 줄**뿐이다. 큰 헤드라인은 카드 안 이미지/영상에 구워져 있다.

### 1-1. 메타 캡션 (라이브 텍스트)

| 속성 | 값 |
|---|---|
| Font | **Space Mono** Regular 400 (Google Fonts) |
| Size | 16px (1600×1200 기준 = 캔버스 폭의 1%) |
| Line height | 120% |
| Letter spacing | 0 |
| Case | 원문 그대로 (`Orbit`, `5-01 (LITE)`, `RICO.SUPPLY`) |
| Color | `#FFFFFF` @ **opacity 75%** |
| 위치 | 하단에서 ~32px, 좌우 여백 40px, 한 줄 baseline 정렬 |

배치 (1600px 기준 x 좌표):

```
[logo 40px]        [Type · center ≈790px]   [Number · center ≈1134px]   [RICO.SUPPLY · right edge 1560px]
```

- 로고(SVG 워드마크, 92×22)와 텍스트 모두 **동일하게 75% 불투명**. 강조 위계 없이 한 톤.
- 캡션은 항상 아래 '어둠 그라디언트'(→ 2-3) 위에 올라가므로 흰색이 읽힌다.

### 1-2. 카드 속 디스플레이 타입 (미디어에 구워진 스타일)

카드 콘텐츠를 새로 만들 때 따를 톤:

- **헤비 그로테스크 대문자**, 카드 폭을 꽉 채우는 크기, 줄간격 거의 0 (`BODY / WORK / 197 / NOW` 반복).
- 위아래로 카드 밖까지 잘려 나가게 배치 → 카드가 '창문'처럼 보이게.
- 색은 **검정 on 연회색 그라디언트** 또는 **흰색 on 검정** 단색 대비만 사용.

---

## 2. Color

### 2-1. 팔레트

| Token | Hex | 역할 |
|---|---|---|
| `--orbit-stage` | `#E0E1E4` | 아트보드 배경 (차가운 연회색) |
| `--orbit-wheel` | `#B3B3B3` | 카드 뒤 휠(원판) — 하단에 반원 '돔'으로 보임 |
| `--orbit-card-light` | `#F8F8F8` | 카드 바탕 (밝은 미디어용) |
| `--orbit-card-mid` | `#CECED0` | 카드 바탕 (중간 회색) |
| `--orbit-card-accent` | `#009942` | 카드 바탕 (유일한 유채색 바탕, 1장만) |
| `--orbit-ink` | `#000000` | 그림자, 하단 오버레이, 다크 카드 |
| `--orbit-caption` | `#FFFFFF` @75% | 메타 캡션 텍스트·로고 |

> Jitter 안의 `#633FF4`(보라)는 마스크 셰이프 색으로, 화면에 렌더링되지 않는다. 팔레트에 포함하지 말 것.

### 2-2. 색 운용 규칙

- **무대는 무채색, 색은 카드 안에서만.** 배경·휠·UI에는 채도를 쓰지 않는다.
- 유채색 카드(그린, 옐로 미디어)는 8장 중 1~2장으로 제한 → 회전할 때 '색의 박자'가 생긴다.
- 흑백 사진/영상 비중을 높게 유지 (썸네일 기준 6/8장이 모노톤).

### 2-3. 하단 오버레이

- 아트보드 하단 50% (1200 중 599px) 영역
- `linear-gradient(to top, #000 0%, transparent 100%)` @ **opacity 50%**
- 휠 돔을 어둡게 눌러 깊이를 주고, 캡션 가독성을 확보.

### 2-4. 카드 그림자

- 카드(휠 레이어)마다: color `#000` 100%, **blur 100px, offset X −20px, Y 0**
- 왼쪽으로만 떨어지는 그림자 → 회전 방향(시계방향)과 반대쪽에 무게가 실려 겹친 카드가 분리돼 보인다.

---

## 3. Motion

### 3-1. 구조 (Geometry)

| 항목 | 값 |
|---|---|
| 아트보드 | 1600×1200, 5300ms, 루프 |
| 휠 지름 | 4600px (원본) → 그룹 scale 0.9 × 0.8 ≈ **0.72** 적용 |
| 휠 기울기 | 전체 15° 회전된 상태로 배치 |
| 카드 수 | 7장 + 루프용 복제 1장 = **8슬롯** |
| 카드 간격 | **15°** (각 30, 15, 0, −15, −30, −45, −60, −75°) |
| 카드 크기 | 440×710 (비율 ≈ 0.62, 세로형), **radius 20px**, 개별 scale 1.2 |
| 회전축 | 휠 중심 = 카드 아래쪽 화면 밖 먼 지점 |

### 3-2. 타임라인

```
0ms ─────────── 1750~2098 ────────────── 3200 ─────────── 4950~5300
 │  ▶ +15° 회전 (stagger) │  ■ 정지 ~1.1s     │  ◀ −15° 복귀 (stagger) │ → loop
```

| 구간 | 시간 | 동작 |
|---|---|---|
| Forward | 0 → 2098ms | 각 카드 **+15°** (한 슬롯 시계방향) |
| Hold | 2098 → 3200ms | 정지 (~1.1s) — 중앙 카드 감상 시간 |
| Return | 3200 → 5300ms | 각 카드 **−15°** (원위치) |

- **Duration**: 카드당 **1750ms**
- **Stagger**: 카드당 **~50ms** (원본 0/54/98/152/196/250/304/348ms → 평균 49.7ms)
  - 총 stagger 폭 350ms → 휠이 강체처럼 돌지 않고 **채찍처럼 살짝 늘어지며** 따라온다. 이 스타일의 핵심.
- **Easing**: Jitter `natural:standard` intensity 50
  - CSS 근사치: `cubic-bezier(0.65, 0, 0.35, 1)` (부드러운 ease-in-out, 근사값)
- 정적 scale(휠 0.8, 카드 1.2 등)은 0ms 즉시 적용 — 애니메이션 아님.

### 3-3. 미디어 재생 리듬

- 카드 속 영상은 **1150ms 창(window)** 단위로 순차 재생: 0–1150, 1150–2300, 2300–3450, 3450–4600, 4600–5300.
- 일부 영상은 루프 전체(0–5300) 재생 → 회전이 멈춘 Hold 구간에도 화면이 살아 있다.

### 3-4. 원칙

1. **한 칸만 움직인다.** 15° = 1슬롯. 크게 돌리지 않는다.
2. **왕복으로 루프를 닫는다.** +15° → −15°로 시작 프레임과 끝 프레임이 일치 → 이음매 없는 루프.
3. **stagger는 짧게(≈50ms), duration은 길게(1750ms).** 비율 약 1:35.
4. **멈춤이 1/5.** 5.3초 중 ~1.1초 정지.
5. Reduced motion: 회전 끄고 정지 프레임 + 영상만 유지.

---

## 4. CSS 구현 레퍼런스

```css
:root {
  --orbit-stage: #e0e1e4;
  --orbit-wheel: #b3b3b3;
  --orbit-card-light: #f8f8f8;
  --orbit-card-mid: #ceced0;
  --orbit-card-accent: #009942;
  --orbit-ink: #000;
  --orbit-caption: rgb(255 255 255 / 0.75);

  --orbit-loop: 5300ms;
  --orbit-step: 15deg;
  --orbit-stagger: 50ms;
  --orbit-ease: cubic-bezier(0.65, 0, 0.35, 1); /* Jitter natural ≈ */
  --orbit-radius: 20px;
}

.orbit-caption {
  font: 400 16px/1.2 "Space Mono", monospace;
  letter-spacing: 0;
  color: var(--orbit-caption);
}

.orbit-overlay {
  background: linear-gradient(to top, #000, transparent);
  opacity: 0.5;
}

.orbit-card {
  --i: 0;                    /* 카드 인덱스 0..7 */
  --base: 0deg;              /* 30, 15, 0, -15 ... -75deg */
  border-radius: var(--orbit-radius);
  box-shadow: -20px 0 100px #000;
  transform-origin: 50% 280%; /* 휠 중심: 카드 중심에서 아래로 카드 높이의 ~2.3배 */
  transform: rotate(var(--base));
  animation: orbit-swing var(--orbit-loop) infinite;
  animation-delay: calc(var(--i) * var(--orbit-stagger));
}

/* 1750/5300 = 33%, 3200/5300 = 60.4%, 4950/5300 = 93.4% */
@keyframes orbit-swing {
  0%     { transform: rotate(var(--base));                              animation-timing-function: var(--orbit-ease); }
  33%    { transform: rotate(calc(var(--base) + var(--orbit-step))); }
  60.4%  { transform: rotate(calc(var(--base) + var(--orbit-step)));    animation-timing-function: var(--orbit-ease); }
  93.4%, 100% { transform: rotate(var(--base)); }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-card { animation: none; }
}
```

> `transform-origin` 280% 산출: 카드 중심↔휠 중심 거리 1945px × 0.72 ≈ 1400px, 카드 높이 710 × 1.2 × 0.72 ≈ 613px → 50% + 1400/613 ≈ 278%. 레이아웃 비율이 바뀌면 같은 식으로 다시 계산할 것.
