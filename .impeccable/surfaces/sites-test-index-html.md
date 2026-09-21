---
version: 1
slug: "sites-test-index-html"
primary_target: "sites/test/index.html"
related_targets: []
---

## Scope

- Surface: 하루치 베이커리 검토용 랜딩 (sites/test/index.html → test.demion.co)
- Visitor mode: Persuade — 동네 주민과 방문객이 "오늘 가볼까"를 정하고 영업시간·위치를 확인한다.
- Audience scene: 아침에 휴대폰으로 확인하거나, 연희동 골목 게시판·전봇대에 붙은 전단지를 지나가며 본다. 밝은 낮의 종이 위.
- Proof/content: 실제 매대 품목·가격·굽는 시각(8시·14시), 휴무·주소·전화. 모두 가짜 고객용 예시 데이터이며 실제 가게 아님.
- Constraints: 정적 HTML/CSS/JS, 빌드 도구 없음. 검토용이므로 noindex. 이미지 생성은 유료라 보류 — 사진 대신 잉크로 찍은 도형·스탬프로 구성하고, 실제 사진은 고객에게 받아 교체.

## Direction contract

THESIS: 하루치를 연희동 골목에 붙는 두 도짜리 리소 전단지로 만든다. 따뜻한 크림 바탕 위 사진과 세리프라는 베이커리 기본값을 거부하고, 한정 판매를 "매대 가격표 위에 찍힌 품절 도장"으로 보여준다.

OWN-WORLD: 회색 신문 용지(#e6e6df) 위 형광 핑크(#ff3ea5)·페더럴 블루(#1e4fff) 두 스팟 잉크, 해바라기(#ffd22a)는 한 섹션을 통째로 칠하는 데만 쓴다. 두 잉크가 겹치면 multiply로 보라가 생긴다. 모든 잉크 면에 리소 입자 결, 잉크판은 2–4px 어긋난다. 초대형 압축 한글 고딕(Black Han Sans), 라벨은 Do Hyeon, 본문은 Pretendard. 모서리는 각지고, 칸은 잉크색 1px 헤어라인으로 나눈다. 버튼·가격표는 두 번째 잉크판이 비껴 찍힌 테두리.

STORY: 방문자는 이곳이 "그날 구운 만큼만 파는 연희동 빵집"이고, 빵마다 나오는 시각이 있으며 늦으면 품절이라는 것을 이해한다. 그래서 몇 시에 갈지 정하고 오시는 길·영업시간을 확인한다.

FIRST VIEWPORT: 화면 왼쪽 2/3를 세 줄 초대형 헤드라인 "오늘 구운 / 만큼만 / 팝니다"가 채운다(블루 판 위에 핑크 판이 어긋남). 오른쪽 1/3에 오려 붙인 빵 도형(해바라기 원 + 핑크 반죽 형태 + 블루 칼집)과 "오늘 나오는 시각" 가격표 스티커(8:00 캄파뉴 / 14:00 캄파뉴 2차). 헤드라인 아래 한 줄 설명과 주 행동 "오늘 매대 보기", 보조 "오시는 길". 상단 띠에 가게 이름·영업 중 여부·휴무.

FORM: 카탈로그 도전자 risograph-web-system(competitive 판정 후 사용자 선택). 내 후보 목록 3위(동네 리소 전단지)·2위(가격표와 품절 도장)와 결합. seed key 88abfdc2. 서명 상호작용: 잉크판 어긋남 — 로드 시 두 판이 밀려와 거의 맞춰지고, 가격표에 마우스를 올리면 판이 한 번 떨린다. 품절 품목엔 핑크 "품절" 도장이 비스듬히 찍힌다. 동작 감소 설정에선 판이 정확히 맞춰진 채 고정.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- 실제 매장 사진: 고객에게 받을 때까지 사진 없이 잉크 도형으로 대체.
- 실시간 품절 상태: 이번엔 정적 예시. 사장님이 갱신하는 방법은 미정.

## Build path and recorded adaptations

- Build path this round: code-led. The project default (.impeccable/config.json) is comp-led, but comps need Higgsfield image generation. When asked to log in to Higgsfield, the user said, verbatim: "유료여서 일단 보류했어" (held off because it is paid). The decision page then offered the comp/code toggle, and the user left it on code (buildPathFlipped: false). The standing default in config.json is unchanged until the user says otherwise.
- Paper #e4e6e3 instead of the contract's #e6e6df: deliberate. #e6e6df still reads as a warm off-white, the default this direction set out to refuse. The cooler stock keeps blue text at 4.6:1.
- Pink: the plates use fluoro #ff3ea5 as contracted. Fluoro pink reaches only about 2.6:1 on this paper, so it never carries readable text. The stamp text uses a double-hit pink (#ff0f6b, the same ink printed twice) for 3.4:1 at 34px.
- Sunflower appears only on the story flood and the hero sun. It is not used on the blue visit section.
