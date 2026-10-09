# CARNET-ARCHIVE 구현 준비 보고서 (분석·계획 단계)

> 작성일 2026-10-09 · Figma `NlZVjrzU6j4MDxumEG3bq7` / 페이지 `카르넷_구현`(1113:10489)
> 이번 단계에서는 **읽기만** 했다. Figma 원본은 수정하지 않았고, 코드도 작성하지 않았다.
> 기준 자료: Page 프레임 6개, `DEV SPEC / Claude Code / Read First`(1230:754), `SOURCE NOTE` 10개, 디자인 시스템(`Carnet / Design System` 페이지 + 변수 컬렉션), 로컬 문서([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [design-tokens.json](design-tokens.json), [components.md](components.md), [responsive-rules.md](responsive-rules.md))

---

## 1. 기존 디자인 시스템 분석 결과

### 1.1 구성 (이미 구축됨 → 새로 만들지 않음)
| 구분 | 위치 | 내용 |
|---|---|---|
| 변수 | `Carnet / Primitives` (15) | 원색 hex 값 |
| 변수 | `Carnet / Semantic` (60) | 색상(surface/text/border/accent/decoration/product), spacing, layout, radius, motion |
| 변수 | `Carnet / Responsive` (68, Desktop·Mobile 모드) | 레이아웃 치수, 컴포넌트 크기, 글자 크기 |
| 변수 | `Carnet / Typography` (250) | T01–T50 family/style/size/tracking/line-height |
| 텍스트 스타일 | T01–T56 (16개) | IBM Plex Mono만 등록됨 |
| 컴포넌트 | `Carnet / Design System` 페이지 | Header, Footer, Product Card, Button, Quantity Stepper, Season Nav, Inquiry Chip, View Toggle, Pagination, Detail Tab Bar, Purchase Panel, Icon 9개 |
| 컴포넌트 | `카르넷_구현` 페이지 | Category Link, Stockist Row(PC/Mobile), Sort Dropdown, Product Metadata / Mobile |
| 문서 | 로컬 md/json 4종 | 토큰 값, 컴포넌트 명세, 반응형 규칙 |

코드에서는 [design-tokens.json](design-tokens.json)을 CSS 변수(`tokens.css`)로 옮겨 쓴다. 이름은 Figma 변수의 code syntax(`var(--color-text-primary)` 등)와 같게 맞춘다.

### 1.2 디자인 시스템과 실제 페이지가 다른 점 (임의로 바꾸지 않고 보고만 함)
| # | 항목 | 내용 | 영향 |
|---|---|---|---|
| D1 | **디자인 시스템이 두 벌 있음** | `Carnet / Design System` 페이지(1233:622, 노드 29개)와 `카르넷_구현` 페이지 x 16844 이후(1222:4831 등, 같은 이름의 문서 프레임과 컴포넌트 세트)에 같은 내용이 따로 있다. | 어느 쪽이 기준인지 정해야 한다 → §7 Q1 |
| D2 | 헤더 로고 서체 | DS 문서에는 "Shop/Detail PC는 Helvetica Neue로 불일치"라고 적혀 있다. 지금 Figma는 모든 프레임이 **Pretendard Bold**로 정리되어 있다. | DS 문서의 불일치 항목을 "해결됨"으로 고쳐야 함 (코드에는 영향 없음) |
| D3 | Helvetica 토큰 | `Carnet / Typography`의 T03·T20·T21·T22·T34·T35·T36이 Helvetica Neue로 지정되어 있다. 지금 페이지에서 실제로 쓰이는 Helvetica는 Regular 16/14와 Heavy 30/16뿐이다. | §3에서 Pretendard로 매핑 |
| D4 | 모바일 상품 목록 열 수 | 1차 요청: "모바일 2열". 모바일 Shop 프레임과 이번 지침("좁은 화면은 모바일 시안 참고")은 **1열**이다. | §7 Q4 |
| D5 | 모바일 Product Card | DS의 `Product Card / Mobile`은 메타데이터를 따로 뒀던 예전 구조다. 지금 원본(`Product Card / 01 / Mobile / Image and Metadata`)은 이미지와 메타가 한 그룹으로 묶여 있다. | 구현은 원본 구조를 따른다 |
| D6 | DS 타이포 표본 | `02 Typography`의 Helvetica 표본은 교체 정책(§3)이 반영되기 전 상태다. | 코드 토큰에서만 바꾸고 Figma는 그대로 둔다 (지시 사항) |

### 1.3 구현에 필요하지만 DS에 없는 항목 (제안만 함)
1. **브레이크포인트 토큰**: §4의 `bp-*`
2. **모션 토큰**: hover 확대 배율, 전환 시간, easing, 타이핑 속도, 글리치 지속 시간. 지금은 `cursor-delay 1000ms`와 `blink 2000ms`만 정해져 있다.
3. **인터랙션 상태**: 버튼·링크·탭의 hover/focus-visible/disabled. focus-visible은 접근성 때문에 꼭 필요하다.
4. **헤더 고정 여부**와 앵커 스크롤 오프셋 (`header-height 60` 재사용)
5. **z-index 단계**: 헤더, 드롭다운, 오버레이
6. **장바구니 피드백 UI**: 토스트·배지·모달. 디자인에 없음 (§5 PDP-5)
7. **Pretendard ExtraBold 800 매핑**: Helvetica Heavy를 대체할 굵기 (§3)

---

## 2. 전체 페이지 구조

### 2.1 프레임 목록
| 페이지 | Desktop (기준) | Mobile (참고) | 비고 |
|---|---|---|---|
| HOME | `Page / Home / Desktop / 1920` 1113:10490 (1920×8812) | `Page / Home / Mobile / 393` 1184:617 | AW26 대체 상태 1124:12375 (프레임 밖, 상태 참고용) |
| SHOP | `Page / Shop / Desktop / 1920` 1124:11259 (1920×6376) | `Page / Shop / Mobile / 393` 1195:1732 | |
| PRODUCT | `Page / Product Detail / Desktop / 1920` 1124:11643 (1920×11639) | `Page / Product Detail / Mobile / 393` 1213:2342 | 상품 1개(PAPER CRUSTACEAN PADDED SHORT BOMBER JACKET)만 디자인됨 |
| 기타 | **없음** | — | 메뉴, 계정, 장바구니, 컬렉션 목록, Stockist 전체 목록, 약관 페이지 모두 디자인 없음 |

`REFERENCE / …` 레이어(기기 상태바, 중복 카드, 미배정 컷아웃, 화면 밖 배경)는 구현하지 않는다 (DEV SPEC 기준).

### 2.2 HOME 섹션 구조 (y 좌표 순서)
| # | 섹션 | Desktop | Mobile 차이 |
|---|---|---|---|
| 00 | Header | 1920×60, 검정 배경 | 393×60, 아이콘 18px |
| — | Hero 이미지 + Wordmark | 1920×1080, CARNET / ARCHIVE 한 줄 (y 877) | 이미지를 크롭해 393×339, CARNET 위 / ARCHIVE 아래 |
| 02 | Current Collection | AW26 헤딩, 컬렉션명, `1ST DROP NEW IN →`, 가로 갤러리(Look 00–08), 텍스처 이미지 | 같은 구성, 축소 |
| 03 | Brand Philosophy | 키워드 3개와 스테이트먼트, 코너 장식 | 361 폭 |
| 04 | Shop Categories | SHOP 헤딩, ALL·ACC / OUTERWEAR·BOTTOMS·TOPS 비대칭 배치 | ALL 전체 폭 + 2열 |
| 05 | Brand Campaign | 1920×770 배경, 캠페인 문구, 타이프라이터 대상 텍스트, 인덱스 숫자 | 크롭 393×209 |
| 06 | Collections (SS26 기본 / AW26 대체) | 에디토리얼 이미지 3장, 회전 라벨, 장식 곡선, Season Nav | 화살표만 있는 Season Nav |
| 07 | Stockists | 이미지 900 + 목록 900 | 세로로 쌓음 |
| 08 | Footer | 600 높이, 2단 | 276 높이, CONTACT 버튼 |

### 2.3 SHOP 구조
Header → SHOP 타이틀(160px, 오른쪽 정렬) → 카테고리 링크(ALL / OUTERWEAR(선택) / BOTTOMS / TOPS / ACCESSORIES) → 보기 전환·범위 표시 장식·FILTER 정렬 → 상품 그리드(Desktop 상품 01–10, 3열 비대칭, 가운데 칸에 타이프라이터 문구) → Pagination → Footer.
Mobile: 상품 01–06, 1열, List/Grid 버튼, 타이프라이터 없음.

### 2.4 PRODUCT 구조
Header → 갤러리(8장, 05에서 시작, 이전/다음 버튼) → 구매 패널(요약 박스 + 선택 상품 박스 + BUY IT NOW / CART) → 반복 탭바와 앵커 섹션 4개(`product-info` / `size-guide` / `product-inquiry` / `purchase-guide`) → Footer.

### 2.5 계층·이름 규칙 (DEV SPEC 기준)
- `Page` = 화면, `00–08` = 섹션, `Image / State=Default|Hover` = 상태별 원본 이미지, `Button|Link` = 조작 대상, `Anchor` = 스크롤 목적지.
- Figma 그룹은 시각적으로 묶은 것일 뿐이다. 웹에서는 absolute 배치로 옮기지 않고 flow/grid 레이아웃으로 다시 짠다.
- 웹의 콘텐츠 순서는 y 좌표와 섹션 번호로 정한다. Figma 레이어 순서(children)는 기준이 아니다.
- 숨김 처리된 이미지라도 상태 전환용이면 에셋으로 추출한다. Shop Desktop 14개, Mobile 12개.

### 2.6 페이지 간 이동 (디자인에서 확인된 것 / 미확정)
| 출발 | 대상 | 상태 |
|---|---|---|
| Header 로고 | HOME | 확정 (Link / Brand Logo / Home) |
| HOME Category Card | SHOP (해당 카테고리) | 추정. 메모에 링크 대상 없음 → Q6 |
| HOME `1ST DROP NEW IN →` | SHOP? | 미확정 → Q6 |
| HOME `VIEW ALL` (Collections) | ? | 대상 화면 없음 → Q6 |
| SHOP Product Card | PRODUCT | 추정. 상세 디자인은 상품 1개뿐 → Q5 |
| Header 메뉴·계정·장바구니 | ? | 대상 화면 없음 → Q6 |
| Footer 약관·이메일·IG | 외부/mailto | 이메일은 mailto 가능. 약관 페이지는 없음 |
| SS27 / AW25 시즌 링크 | — | DEV SPEC: "대응 디자인 없음, 새 화면을 임의로 만들지 않는다" |

### 2.7 에셋
| 종류 | 수량 (프레임별 고유 이미지) | 방식 |
|---|---|---|
| 이미지 | Home D 40 / M 39, Shop D 35 / M 23, PDP D 16 / M 16, AW26 대체 4 | Figma 원본 이미지(원본 해상도)를 내보낸다. 모바일은 대부분 같은 원본을 다르게 크롭한 것이므로 한 번만 받아 CSS로 크롭한다 (`object-fit`/`object-position`). 컷아웃은 투명 PNG를 WebP로 변환할 예정 (사용자 자체 에셋) |
| 아이콘 | 메뉴, 계정, 장바구니(헤더/카드), 화살표 좌우, chevron, 닫기, 페이지 다음, 보기 전환, +/− | Figma 벡터를 SVG로 내보내 인라인 SVG 컴포넌트로 만든다 |
| 장식 | Archive Sweep 곡선 2개, 코너 사각형·바, 범위 표시 막대 | SVG |
| 폰트 | §3 | |

---

## 3. 폰트 적용 계획

### 3.1 Helvetica Neue 사용 위치 (현재 8곳 → 모두 Pretendard로 교체)
| 프레임 | 노드 | 텍스트 | 원본 | 교체 |
|---|---|---|---|---|
| Shop D | 1124:11284 `Text / Business License` (Footer) | 제 2020 - 서울강남 - 03483호 | Regular 16, -4%, lh auto | Pretendard 400 16, -0.04em |
| PDP D | 1124:12002 `Text / Business License` (Footer) | 〃 | Regular 16, -4% | Pretendard 400 16, -0.04em |
| Shop D | I1124:11576;1124:11530 `Text / FILTER` (Sort Dropdown 인스턴스) | FILTER | Regular 16, -4%, lh 130% | Pretendard 400 16, -0.04em, 1.3 |
| 컴포넌트 | 1124:11530 / 1124:11537 `Text / FILTER` (Sort Dropdown Closed/Open) | FILTER | Regular 16 | 〃 |
| Shop M | 1213:2319 `Text / FILTER` | FILTER | Regular 14, -4%, lh 130% | Pretendard 400 14 |
| Shop D | 1124:12431 `Text / OUTERWEAR` (Category Link Selected) | OUTERWEAR | **Heavy** 30, 0% | Pretendard **800** 30 |
| Shop M | 1195:1937 `Text / OUTERWEAR` | OUTERWEAR | **Heavy** 16, 0%, 고정 폭 107 | Pretendard **800** 16 |

- 굵기 매핑: Helvetica Neue Heavy(85)는 일반적으로 800으로 매핑한다 → Pretendard ExtraBold(800). Category Link의 hover 상태도 원래 Pretendard ExtraBold 30이라, 선택 상태와 hover 상태가 같은 굵기가 된다. 차이는 색(#831A1F)과 사각형 마커로만 남는다 → Q3에서 확인.
- Footer 사업자번호 줄: Home Footer는 같은 줄이 **IBM Plex Mono**인데, Shop/PDP Footer는 Helvetica→Pretendard가 되어 페이지마다 Footer가 달라진다. 공통 Footer 컴포넌트를 하나로 쓰려면 한쪽으로 정해야 한다 → Q2.
- 코드 토큰에서 바꿀 범위: `font.family.grotesk`를 없애고, 이를 참조하던 `control.filter-label`, `label.category-link-selected`를 `font.family.sans`로 바꾼다. Figma 변수(T03·T20·T21·T22·T34·T35·T36)는 지시대로 수정하지 않는다.
- 줄바꿈 영향: FILTER와 사업자번호는 한 줄 텍스트라 줄바꿈 위험이 없다. OUTERWEAR(모바일)은 고정 폭 107 박스라, Pretendard 800의 글자 폭이 Helvetica Heavy보다 넓으면 넘칠 수 있다. 구현 시 폭을 auto로 두고 실측해서 맞춘다.

### 3.2 최종 폰트와 사용 굵기
| 폰트 | 사용 굵기 (실측) | 라이선스 | 파일 확보 경로 | 형식 |
|---|---|---|---|---|
| **Pretendard** | 300 Light, 400, 500, 600, 700, 800 (+800은 Heavy 대체) | SIL OFL 1.1 (웹 임베딩·재배포·서브셋 허용, 폰트 단독 판매 금지, 수정본에 "Pretendard" 이름 사용 금지) | 공식 저장소 `orioncactus/pretendard` 릴리스 v1.3.9의 `web/static/woff2` (또는 공식 dynamic-subset) | WOFF2, 프로젝트에 포함 |
| **IBM Plex Mono** | 300, 400, 500, 600, 700 | SIL OFL 1.1 | 공식 `IBM/plex` 릴리스 또는 npm `@ibm/plex-mono` | WOFF2 (KR 글리프 없음 → 한글은 폴백) |
| **S-Core Dream** | 5 Medium(500), 6 Bold(600), 7 ExtraBold(700) | 에스코어 자체 라이선스: 개인·기업 상업 사용 무료, 재배포·번들 허용, **파일 수정·판매 금지, "배포되는 파일 형태 그대로 사용"**. 웹 임베딩·포맷 변환·서브셋은 **명시되어 있지 않음** | 공식 페이지 `s-core.co.kr/company/font` → `S-Core_Dream_OTF.zip` | **OTF 원본 그대로** (WOFF2 변환·서브셋은 하지 않음) |

**S-Core Dream 처리 원칙 (라이선스가 불확실함 → 임의로 쓰지 않음)**
- 권장: 공식 OTF 파일을 고치지 않고 `@font-face { src: url(…otf) format('opentype') }`로 제공한다. 재배포가 허용되고 원본 형태를 유지하므로 가장 안전한 해석이다.
- 비공식 CDN(눈누, jsDelivr 미러 등)의 WOFF/WOFF2는 쓰지 않는다. 에스코어가 배포한 원본 형태가 아니기 때문이다.
- 웹 임베딩 허용 여부를 문서로 받아 두려면 라이선스 문의처(페이지에 적힌 담당자 메일)에 확인해야 한다 → Q2-b.
- 단점: OTF 3개(각 1–2MB 추정)가 서브셋 없이 로드된다. S-Core Dream은 헤딩(라틴 대문자 위주)에만 쓰이므로 `font-display: swap`, 필요한 굵기만 preload해서 체감 지연을 줄인다.

### 3.3 @font-face 설계
```
public/fonts/
  pretendard/   Pretendard-{Light,Regular,Medium,SemiBold,Bold,ExtraBold}.woff2  + LICENSE.txt
  ibm-plex-mono/IBMPlexMono-{Light,Regular,Medium,SemiBold,Bold}.woff2       + LICENSE.txt
  s-core-dream/ SCDream5.otf, SCDream6.otf, SCDream7.otf                    + 라이선스 원문 사본
src/styles/fonts.css   → family별 @font-face (weight 숫자 매핑, font-display: swap)
```
- 경로는 루트 기준 절대 경로(`/fonts/...`)로 써서 배포 후 라우트가 바뀌어도 폰트가 정상 로드되게 한다.
- `<link rel="preload" as="font" crossorigin>`: 첫 화면에 쓰이는 Pretendard 700(로고), S-Core Dream 6(섹션 헤딩)만 preload한다.
- 폴백: Pretendard → `system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` / Plex Mono → `ui-monospace, monospace` / S-Core Dream → Pretendard.
- IBM Plex Mono에는 한글 글리프가 없다. Footer의 "제 2020 - 서울강남…"(Home)처럼 Mono에 들어간 한글은 Figma에서도 폴백으로 렌더된 것이므로, 웹에서는 Pretendard로 폴백되게 스택을 짠다.

---

## 4. 반응형 구현 계획 (데스크톱 기준, 하나의 사이트)

### 4.1 원칙
- 기준은 Desktop 1920 프레임이다. 393 Mobile 프레임은 "좁아졌을 때의 모습" 참고용이다.
- 모바일 페이지나 별도 마크업은 만들지 않는다. 같은 컴포넌트에 미디어 쿼리와 유동 토큰을 적용한다.
- 1920보다 넓은 화면: 콘텐츠 최대 폭 1800 + 좌우 여백을 유지하고 가운데 정렬한다. 헤더·푸터 배경, Hero, Campaign은 화면 전체 폭(full-bleed)으로 깐다.

### 4.2 브레이크포인트 (제안)
| 이름 | 범위 | 레이아웃 | 근거 |
|---|---|---|---|
| `desktop` | ≥ 1280 | Desktop 구조. 치수는 `vw` 기준으로 유동 (1920에서 원본과 일치) | 1920 프레임 |
| `laptop` | 1024 – 1279 | Desktop 구조 유지. 2단 블록(Stockists, 구매 패널)은 비율 유지, 대형 타이포 축소 | 보완 구간 |
| `tablet` | 768 – 1023 | 혼합: Shop 그리드 2열, Stockists·구매 패널·Footer는 세로로 쌓음 | 보완 구간 |
| `mobile` | < 768 | Mobile 프레임 구조 (393 기준 유동) | 393 프레임 |

768/1024/1280은 디자인에서 나온 값이 아니라 보완을 위해 제안하는 값이다. 진행 전에 승인이 필요하다 → Q7.

### 4.3 유동 치수 방식
- 크기 토큰은 `{desktop, mobile}` 두 값을 두 기준 폭(1920·393) 사이에서 선형 보간한다:
  `--fs-section: clamp(20px, calc(20px + (80 - 20) * (100vw - 393px) / (1920 - 393)), 80px);`
  1920에서는 정확히 80, 393에서는 정확히 20이 되어 두 시안과 모두 일치한다.
- 여백도 같다: `--page-gutter` 60 ↔ 16, `--grid-gutter` 20 ↔ 8.
- 레이아웃 구조(열 수, 쌓기 여부)는 보간하지 않고 브레이크포인트에서 바꾼다.
- 본문은 너무 작아지지 않게 하한을 둔다. 모바일 시안의 8–10px 텍스트는 393에서 시안과 같게 맞추되, 이보다 더 작아지지 않게 한다.

### 4.4 이미지
- 모든 이미지 박스는 `aspect-ratio` 토큰(3:4, 465:357, 900:511 등)을 쓰고 `object-fit: cover`로 채운다. 높이를 고정값으로 주지 않는다.
- 상품 컷아웃은 배경 위에 `object-fit: contain; object-position: bottom center`로 올린다.
- Hero/Campaign: 데스크톱은 16:9와 1920:770. 모바일은 393:339와 393:209 박스에 크롭한다. 중간 폭은 두 비율 사이에서 미디어 쿼리로 전환한다.
- `srcset`/`sizes`로 폭에 맞는 해상도를 제공한다 (이미지 원본에서 생성).

### 4.5 섹션별 변화 요약
[responsive-rules.md §4](responsive-rules.md)의 표를 그대로 따른다. 1차 문서 이후 바뀐 점은 D4(모바일 1열/2열)뿐이다.

### 4.6 가로 스크롤·겹침 방지
- `html, body { overflow-x: clip }`은 최후 수단으로만 쓴다. 기본은 컴포넌트 단위 `max-width: 100%`와 `min-width: 0`이다.
- 원래 화면 밖으로 넘치는 요소(가로 갤러리, PDP 갤러리 트랙, Hero/Campaign 크롭, 장식 곡선)는 각자의 컨테이너 안에서만 넘치게 하고 잘라낸다.
- 회전 라벨(시즌명)은 `writing-mode` 또는 `transform: rotate`로 처리하고, 레이아웃 박스를 따로 잡아 겹치지 않게 한다.

---

## 5. 페이지별 인터랙션 목록

표기: **확정** = SOURCE NOTE/DEV SPEC에 명시 · **미지정** = 수치나 동작이 없어 결정 필요 · **제안** = 내가 제안하는 보완

### HOME
| ID | 대상 (노드) | 이벤트 | 동작 | 미지정 항목 | 터치 대체 (제안) |
|---|---|---|---|---|---|
| H-1 | Wordmark 1213:4240 | 로드/진입 | 왼쪽→오른쪽 글리치("치지직") 노이즈와 함께 나타남. 글자와 위치는 그대로 | 지속 시간, 반복 횟수, 강도, 재생 시점(로드 시/스크롤 진입 시) | 동일 (hover 무관). `prefers-reduced-motion`이면 즉시 표시 |
| H-2 | Current Collection 갤러리 D 1124:12550 / M 1195:1092 | 마우스 가로 스크롤 | Look 00–08 가로 탐색 | "마우스 가로 스크롤"의 뜻: ① 트랙패드/Shift+휠 기본 가로 스크롤 ② 세로 휠을 가로로 변환(스크롤 하이재킹) → Q8 | 터치 스와이프 (DEV SPEC 제안) |
| H-3 | 같은 갤러리의 각 이미지 | pointer enter/leave | 그 이미지만 확대 → 복귀 | 배율, 속도 | 터치에서는 확대하지 않음 |
| H-4 | Category Card D 1115:625 / M 1213:3406 | pointer enter/leave | Default 이미지 ↔ Hover 이미지 교체 (개별 에셋) | 전환 방식(즉시/페이드), 시간 | 터치에서는 교체하지 않고 링크로만 동작 (DEV SPEC: hover를 강제하지 않음) |
| H-5 | Collections 이미지 | pointer enter/leave | 약간 확대 → 복귀 | 배율, 시간 | 없음 |
| H-6 | 다음 시즌 링크 1113:10578 / 이전 시즌 1124:12332 | click | SS26 ↔ AW26: 이미지, 시즌명, Season Nav를 같은 영역에서 교체 | 전환 애니메이션(즉시/페이드), URL 반영 여부 | 모바일은 버튼 배경 1213:3394/1213:3348을 탭 |
| H-7 | SS27·AW25 링크 | click | **대상 디자인 없음.** 새 화면을 만들지 않는다 | 비활성 처리 vs 링크 숨김 → Q6 | — |
| H-8 | Stockist Row ×5 (세트 1113:10965 / 1195:1266) | pointer enter/leave | Default ↔ Hover (SemiBold, #831A1F, gap 4→2) | 전환 시간 | 터치: 상태 유지 없음 (미지정) |
| H-9 | `1ST DROP NEW IN →`, `VIEW ALL`, Category Card 클릭, 모바일 CONTACT | click | 이동 대상이 명시되지 않음 | → Q6 | — |

### SHOP
| ID | 대상 | 이벤트 | 동작 | 미지정 |
|---|---|---|---|---|
| S-1 | Category Link D 1228:764 / M 1228:765 (세트 1124:12447) | hover/leave | Default ↔ Hover(ExtraBold). Selected(Outerwear)는 hover와 별개 상태 | — |
| S-2 | Category Link | click | 카테고리 선택(Selected 상태) | **상품 필터링 여부와 카테고리별 상품 데이터 없음** → Q5 |
| S-3 | Product Card 모델 이미지 | pointer enter/leave | 모델 → 옷 컷아웃 이미지. 배경·메타·카드 크기는 유지 | 전환 방식. 모바일 01번 Hover 원본 1213:2021은 좌표가 어긋나 있으므로 같은 이미지 영역 안에 배치 (DEV SPEC) |
| S-4 | Brand Statement 1124:11488 (Text 11489 / Cursor 11490) | 스크롤 진입 | 한 글자씩 타이핑 → 완료 1000ms 후 커서 표시 → 2000ms 간격 깜빡임 | 타이핑 속도, 다시 진입할 때 재생 여부. 모바일에는 없음 → 추가하지 않음 |
| S-5 | Sort Dropdown 인스턴스 1124:11576 / M 1213:2326 | click | Closed ↔ Open (컴포넌트 상태 있음) | **정렬 로직**: 가격순은 데이터로 가능, 신상품·후기·판매량순은 데이터 없음. 선택 표시 방식. 모바일 Open 디자인 없음 → Q5 |
| S-6 | Pagination | click | — | 상품이 한 페이지 분량뿐. 동작 미지정 → Q5 |
| S-7 | Mobile List/Grid 버튼 | click | — | 전환 레이아웃 미지정 (DEV SPEC: 확정된 것으로 보지 않는다) → Q4 |
| S-8 | Product Card | click | PRODUCT로 이동 | 상세 디자인은 1개 상품뿐 → Q5 |

### PRODUCT
| ID | 대상 | 이벤트 | 동작 | 미지정 |
|---|---|---|---|---|
| P-1 | 갤러리 D 1124:12074 / M 1213:2572 | 초기 | 05 Model Front 활성(가운데, 크게), 이웃 이미지는 작게 | — |
| P-2 | Previous 1124:12032 / Next 1124:12031 (M 1213:2576 / 2573) | click | 이전/다음 번호로 이동, 활성 이미지 확대 + 트랙 위치 갱신 | 끝에서 순환할지 버튼을 비활성화할지, 전환 시간. 모바일 스와이프 여부 → Q9 |
| P-3 | 섹션 탭 4개 | click | 해당 Anchor로 스크롤 (페이지 이동 아님) | sticky 여부, 스크롤 애니메이션 시간. 헤더 고정이면 오프셋 반영 |
| P-4 | Size Option(M/L), Color Swatch, Quantity Stepper, Remove Selected Item | click | 선택 상태와 수량 변경, 합계 갱신 | **옵션 선택 규칙**(필수 여부, 선택 표시 스타일), 품절, 최대 수량 → Q10 |
| P-5 | BUY IT NOW / CART | click | **장바구니·결제 디자인 없음, 알림 디자인 없음** | 동작 정의 필요. 작동하는 것처럼 꾸미지 않는다 → Q10 |
| P-6 | 상품 설명 더보기 | click | Story 영역 펼치기로 추정 (Overlay / Story Fade 존재) | 펼친 상태 디자인 없음 → Q10 |
| P-7 | 문의 필터 칩 | click | Active/Inactive 전환. 행 필터링은 데이터(문의 유형)로 가능 | 필터링 여부, Q&A 작성하기 동작 → Q10 |
| P-8 | CM/INCH 토글 | click | — | INCH 데이터 없음 → Q10 |

### 공통
| ID | 대상 | 동작 | 미지정 |
|---|---|---|---|
| C-1 | Header 메뉴/계정/장바구니 | — | 메뉴를 연 화면, 계정·장바구니 화면 없음 → Q6 |
| C-2 | 모든 hover 효과 | `@media (hover: hover) and (pointer: fine)` 안에서만 적용 | — |
| C-3 | 모든 모션 | `prefers-reduced-motion: reduce`면 끄거나 즉시 전환 | — |

---

## 6. 공통 컴포넌트와 프로젝트 구조

### 6.1 기술 스택 (선택 필요 → Q11)
| 옵션 | 구성 | 장점 | 단점 |
|---|---|---|---|
| **A. Vite + React + React Router (권장)** | 의존성 3개 | 상품 데이터 기반 카드·상세 라우트(`/product/:slug`)·상태 교체(SS26↔AW26, 갤러리, 옵션)를 컴포넌트로 깔끔하게 재사용 | SPA라서 배포 시 fallback 설정 필요 |
| B. Vite 멀티페이지 + Vanilla JS (Web Components) | 의존성 0–1개 | 가장 가벼움 | 공통 헤더/푸터/카드를 템플릿·커스텀 엘리먼트로 직접 관리해야 해서 상태 코드가 늘어남 |

### 6.2 디렉터리 (옵션 A 기준)
```
carnet-archive/
├─ public/
│  ├─ fonts/            pretendard/ · ibm-plex-mono/ · s-core-dream/   (+ 라이선스 원문)
│  └─ images/           common/ · home/ · shop/products/{slug}/ · product/{slug}/
├─ src/
│  ├─ styles/           tokens.css (design-tokens.json → CSS 변수) · fonts.css · base.css · media.css
│  ├─ data/             products.ts · categories.ts · collections.ts (SS26/AW26) · stockists.ts · footer.ts
│  ├─ components/
│  │  ├─ layout/        Header · Footer · Container · Section
│  │  ├─ ui/            Button · Icon(SVG) · Link · SectionHeading · RotatedLabel · Pagination
│  │  ├─ media/         ResponsiveImage(aspect-ratio) · HoverSwapImage(H-4, S-3 공용) · HoverScale(H-3, H-5 공용)
│  │  ├─ motion/        GlitchReveal(H-1) · Typewriter(S-4, 캠페인 문구 대상이면 공용) · useInView · usePrefersHover · useReducedMotion
│  │  ├─ product/       ProductCard · ProductGrid · ProductMeta · ColorSwatch · CartIcon
│  │  ├─ shop/          CategoryNav/CategoryLink · SortDropdown · ViewToggle
│  │  ├─ home/          Hero · CurrentCollection(HorizontalGallery) · BrandPhilosophy · ShopCategories · Campaign · Collections(SeasonNav) · Stockists(StockistRow)
│  │  └─ pdp/           ProductGallery · PurchasePanel · QuantityStepper · OptionSelector · DetailTabs · ProductStory · SizeGuide · InquiryList(InquiryChip) · PurchaseGuide
│  ├─ pages/            HomePage · ShopPage · ProductPage · NotFound
│  └─ router.tsx        / · /shop · /shop/:category? · /product/:slug
└─ (git) 단계별 커밋: chore(init) → tokens/fonts → layout → home → shop → product → integration
```

### 6.3 Figma 컴포넌트와 코드 컴포넌트 매핑
| Figma | 코드 |
|---|---|
| Header (D/M) | `Header` 1개 + 미디어 쿼리 |
| Footer (D/M) | `Footer` 1개 (D: 2단 + Legal, M: Contact 목록을 CONTACT 버튼으로 축약) |
| Button (Primary/Secondary/Outline Accent/Outline/View All) | `Button variant=…` |
| Product Card (Default/Hover) | `ProductCard` + `HoverSwapImage` |
| Category Link (Default/Hover/Selected) | `CategoryLink` |
| Stockist Row (Default/Hover) | `StockistRow` |
| Sort Dropdown (Closed/Open) | `SortDropdown` |
| Season Nav | `SeasonNav` |
| Inquiry Chip | `Chip` |
| Detail Tab Bar ×4 위치 | `DetailTabs` 1개를 섹션마다 렌더(active 표시만 다름) 또는 sticky 1개 → Q12 |
| Purchase Panel, Quantity Stepper | `PurchasePanel`, `QuantityStepper` |
| Pagination, View Toggle, Icon 9종 | `Pagination`, `ViewToggle`, `Icon name=…` |

---

## 6.4 구현 순서와 예상 기술 문제
| 단계 | 작업 | 예상 문제와 대응 |
|---|---|---|
| 0 | 프로젝트 초기화, git, 토큰 CSS, 폰트, 에셋 내보내기 | 이미지 100장 이상 내보내기: Figma 원본 해상도 확인. 숨김 상태 이미지 누락 주의. S-Core OTF 용량 |
| 1 | HOME | 글리치 효과 파라미터 미정. 가로 갤러리 휠 해석. 비대칭 배치(Shop Categories)의 유동화. 회전 라벨. Hero/Campaign 크롭 위치 |
| 2 | SHOP | 3열 비대칭 그리드 + 가운데 칸 타이프라이터 (`grid-template-areas`로 재현). 상품 수가 바뀔 때 패턴 규칙. 컷아웃 정렬 |
| 3 | PRODUCT | 크기가 서로 다른 8장 갤러리의 중앙 정렬 이동. 앵커와 고정 헤더 오프셋. 옵션·장바구니 동작 범위 |
| 4 | 연결·점검 | 미정 링크 처리. 1920/1440/1280/1024/768/393/360 폭 비교. hover 복귀, 갤러리 05 초기 상태, SS26↔AW26, 타이핑 후 커서 타이밍, 앵커 도착 위치 (DEV SPEC 검증 기준) |

공통 위험:
- 모바일 시안의 8–10px 텍스트는 가독성과 접근성 문제가 있다 (보고만 함).
- Figma의 auto 행간과 브라우저 `normal` 행간은 폰트마다 다르다. 실측해서 px 단위로 보정한다.
- Pretendard는 Helvetica보다 글자 폭이 넓을 수 있다. FILTER 버튼(106×30)과 Selected 링크 폭을 확인한다.

---

## 7. 구현 전 확인 필요 사항
| # | 질문 | 내 권장 |
|---|---|---|
| Q1 | 디자인 시스템이 두 벌 있다 (`Carnet / Design System` 페이지와 `카르넷_구현` 페이지 x 16844). 어느 쪽이 기준인가? 다른 쪽은 그대로 둘까? | 디자인 시스템 페이지를 기준으로. 정리는 직접 해 주세요 (Figma 수정 금지) |
| Q2 | Footer 사업자번호 줄: Home은 IBM Plex Mono, Shop/PDP는 Helvetica(→Pretendard). 공통 Footer를 무엇으로 통일할까? | Home 기준 IBM Plex Mono (Footer 전체가 Mono) |
| Q2-b | S-Core Dream: 공식 OTF를 고치지 않고 웹에 포함해도 될지. 문서 확인을 원하면 에스코어에 문의가 필요하다. WOFF2 변환·서브셋은 하지 않는다 | OTF 원본을 그대로 쓰고, 상업 공개 전에 에스코어에 서면 확인 |
| Q3 | Helvetica Heavy → Pretendard 800(ExtraBold)으로 확정할지. 900(Black)으로 할지 | 800 |
| Q4 | 좁은 화면 Shop 목록: 1열(모바일 시안) vs 2열(1차 요구사항). List/Grid 토글을 구현할지 | 기본 1열 + 토글로 2열 (토글 버튼이 시안에 있음) |
| Q5 | 상품 데이터: 카테고리별 상품, 상세 페이지 내용(이미지·사이즈·설명)이 상품 1개분뿐이다. 나머지 9개 상품 상세는? 정렬·페이지네이션 동작은? | 상세는 1개 상품만 실제 데이터로 만들고, 나머지는 같은 템플릿에 카드 정보만 넣음 / 정렬은 가격순만, 나머지 옵션은 비활성 |
| Q6 | 이동 대상이 없는 링크(메뉴, 계정, 장바구니, NEW IN, VIEW ALL, SS27·AW25, 약관, CONTACT) 처리 | NEW IN·Category Card → SHOP / 나머지는 비활성 처리(`aria-disabled`) 후 목록으로 보고 |
| Q7 | 브레이크포인트 768 / 1024 / 1280 승인 | 승인 요청 |
| Q8 | H-2 "마우스 가로 스크롤": 기본 가로 스크롤(트랙패드·Shift+휠) vs 세로 휠을 가로로 변환 | 갤러리 위에서만 세로 휠 → 가로 변환, 끝에 닿으면 페이지 스크롤로 넘김 |
| Q9 | 모션 수치: 글리치(시간·반복), hover 확대 배율·시간, 타이핑 속도, 갤러리 전환 시간, 갤러리 끝 동작 | 글리치 0.8s 1회, 확대 1.05 / 300ms ease-out, 타이핑 40ms/자, 갤러리 400ms, 끝에서 버튼 비활성 |
| Q10 | 구매 UI: 옵션 필수 여부, BUY/CART 동작(장바구니·알림 디자인 없음), 더보기 펼친 상태, CM/INCH, 문의 필터·작성 | 옵션 선택과 수량·합계는 화면 내에서만 동작. BUY/CART·Q&A 작성은 디자인이 나올 때까지 보류(작동하는 것처럼 처리하지 않음) |
| Q11 | 기술 스택 A(React) vs B(Vanilla) | A |
| Q12 | 탭바: 섹션마다 반복 표시(시안 그대로) vs 하나만 sticky | 시안 그대로 반복 |
| Q13 | 프로젝트 폴더와 배포 대상(Vercel·Netlify·GitHub Pages 등). 지금 작업 공간은 임시 폴더이고 git 저장소가 아니다 | 원하는 경로에 새 저장소 생성 |

---

## 8. 확정 사항 (2026-10-09 사용자 답변)
| Q | 결정 | 구현 반영 |
|---|---|---|
| Q4 | 좁은 화면 Shop은 **기본 1열**, Grid 버튼을 누르면 **2열**, List 버튼을 누르면 1열로 복귀 | `ViewToggle` 상태를 `ProductGrid`의 `columns`(1/2)에 연결. 2열은 열 간격 8, 카드 폭 `(100% − 8px)/2`, 이미지 3:4. 2열일 때 메타 배치는 디자인이 없으므로 같은 메타를 폭에 맞춰 줄바꿈해서 표시 (구현 후 확인 요청). Desktop 3열에는 영향 없음 |
| Q6 | 메뉴를 연 화면은 **마지막 단계로 보류**. `1ST DROP NEW IN →` 클릭 시 **SHOP으로 이동**. 그 외 링크(계정, 장바구니, VIEW ALL, SS27·AW25, 약관, CONTACT 등)는 **구현하지 않음** | 링크 대상이 없는 요소는 시각적으로만 렌더하고 클릭 동작을 연결하지 않는다 (작동하는 것처럼 꾸미지 않음). 메뉴 버튼도 같음 |
| Q10 (일부) | BUY IT NOW / CART 이후 장바구니·알림은 **마지막 단계로 보류** | 두 버튼은 렌더만 함. 옵션 선택과 수량·합계 갱신(화면 내 UI)은 3단계에서 구현 대상으로 남김 |
| Q5 (일부) | 나머지 상품 9개도 **같은 상세 페이지 템플릿**이 나오게 함 | `/product/:slug` 10개 모두 PAPER CRUSTACEAN 상세 콘텐츠(갤러리·스토리·사이즈·문의·구매안내)를 보여 준다. 상품명·가격·컬러는 각 카드 데이터를 쓸지, 상세 내용 전체를 똑같이 쓸지 → Q5-b |
| Q13 (일부) | 용도: **포트폴리오 웹사이트** | 백엔드 없는 정적 사이트. 프로젝트 폴더와 배포 대상은 미정 |

| Q13 | 프로젝트 폴더 `C:\Users\USER\Documents\carnet-archive`, 배포는 **Vercel** | BrowserRouter + `vercel.json`에 SPA rewrite 추가 |
| Q5-b | 상세 페이지는 **10개 상품 모두 완전히 동일** (PAPER CRUSTACEAN 내용 그대로) | `/product/:slug`는 모든 slug에서 같은 상세 데이터를 렌더. slug는 카드 링크를 구분하는 데만 씀 |
| Q1·Q2·Q2-b·Q3·Q7·Q8·Q9·Q11·Q12·Q5(정렬) | **§7 권장안대로 진행** | 기준 DS = `Carnet / Design System` 페이지 · Footer는 IBM Plex Mono로 통일 · S-Core Dream은 공식 OTF를 수정 없이 사용 · Heavy → Pretendard 800 · 브레이크포인트 768/1024/1280 · 갤러리 위에서 세로 휠을 가로 스크롤로 변환(끝에 닿으면 페이지 스크롤로 넘김) · 모션: 글리치 0.8s 1회, hover 확대 1.05 / 300ms ease-out, 타이핑 40ms/자, 갤러리 400ms, 끝에서 버튼 비활성 · React + Vite + React Router · 탭바는 섹션마다 반복 · 정렬은 가격순만(나머지 옵션은 비활성) |

모든 확인 사항이 결정됨. 1단계(HOME) 지시를 기다리는 중.

#### 구현 중 결정·피드백 (3·4단계)

| 항목 | 결정 | 구현 |
|---|---|---|
| PDP 갤러리 이동 상태 | 버튼이 사진과 겹치지 않게, 버튼 위치는 고정 (피드백 2026-10-10) | 버튼은 Figma 위치 고정, 양옆 사진은 버튼 기준 Figma 간격(04→Prev 115, Next→06 61), 나머지는 사진 간 Figma 간격. 이전 구현: | 활성 사진 기준으로 매번 재배치: Figma 간격(활성↔이웃, 이웃↔이웃)과 버튼 오프셋 유지. 05 초기 상태는 Figma와 동일. Figma에 없는 간격(05가 비활성일 때 05 양옆)은 나머지 간격의 평균(D 149 · M 63.76) |
| PDP 탭 라벨 | 각 탭 정중앙 (피드백) | flex 가운데 정렬. 탭바마다 1px씩 다르던 Figma 라벨 x는 쓰지 않음 |
| 사이즈 선택 | Figma 추가 디자인 D `1254:7038` · M `1257:7039` | 19×19 안쪽 1px 검정 / 모바일 12×12 바깥 1px 검정, 그림자 0 0 4 25%. 스와치 열에 맞춤 |
| 끝 버튼 비활성 모양 | 디자인 없음 | 투명도 30% |
| 모바일 TOTAL | 모바일 시안에 TOTAL 줄 없음 | 모바일은 합계 미표시 (수량 칸만 변경) |
| 정의되지 않은 주소 | 404 디자인 없음 | `/` 로 이동. 없는 상품 slug는 `/shop` 으로 이동 |
| HOME 워드마크 효과 | CARNET-ARCHIVE(라인 포함) 전체를 한 번에 왼→오 노출, 더 천천히 (피드백) | 그룹 하나로 노출, 시간 0.8s → 1.4s. 모션 스타일: Jitter 'Dithering Effect' 템플릿처럼 글자 모양 위에만 작은 블록(글자 크기의 9%)이 깜빡이다(불투명/반투명) 실제 글자로 바뀜, 왼→오 + 무작위 분산. 재생 중 canvas, 끝나면 실제 DOM 텍스트 |
| HOME 가로 갤러리 (H-2) | 마우스 휠 대신 커서(드래그)로 스크롤 (피드백, Q8 대체) | 마우스 드래그 → 가로 스크롤, grab 커서, 휠은 페이지 스크롤. 터치는 기본 스와이프 |
| 레이아웃보다 넓은 화면의 AW26 섹션 오른쪽 경계선 | 제거 (피드백) | 갤러리를 화면 끝까지 확장. 텍스처는 Figma 프레임 밖에 다른 이미지가 있어 레이아웃 경계 안쪽 12%에서 흰색으로 페이드 (1920·393 화면은 변화 없음) |
| HOME hover 색 | SHOP 카테고리 이미지 hover → 해당 라벨, COLLECTIONS 시즌 이동(이름+화살표), VIEW ALL → #831A1F (피드백) | `.hover-group` / `.hover-target` / `.hover-accent` (CSS `:has`). SS27·AW25·VIEW ALL은 대상 없음 → 색만 변경 |
| COLLECTIONS 오른쪽 세로선 | 제거 (피드백) | 곡선(Archive Sweep) 렌더에 Figma 프레임 밖 회색 영역이 포함돼 있었음 → 프레임 경계에서 잘라냄 (`scripts/trim-frame-edge.mjs`, 원본은 `.png.orig`) |
| 푸터 CONTACT 주소 | 클릭 시 해당 주소로 (피드백) | 이메일 4개 → `mailto:`, IG `@CARNETARCHIVE` → `instagram.com/carnetarchive` (새 탭). 회사정보 EMAIL·모바일 CONTACT 버튼은 그대로 |
| HOME 카테고리 카드 링크 | 이미지·텍스트 클릭 → 카테고리(SHOP) 페이지 (피드백, Q6 일부 변경) | 5개 카드 모두 `/shop` (상품이 OUTERWEAR 목록 하나뿐) |
| SHOP 상단 ALL | 클릭 안 되게 (피드백) | BOTTOMS·TOPS·ACC와 같이 hover 색만 변경. OUTERWEAR 선택 상태 유지. 다른 항목 hover 중에는 OUTERWEAR 글자·사각형 검정 |
| 좁은 화면 VIEW ALL | 12px 고정 (피드백) | 셀 세로 가운데 정렬 |
| SHOP 타이핑 | 더 빠르게, 커서 깜빡임 더 빠르게 (피드백) | 40 → 33ms/자, 깜빡임 2000 → 500ms (등장 지연 1000ms 유지) |
| PDP TOTAL | 오른쪽 정렬 (피드백) | Figma 상자 오른쪽 끝(1824) 기준, 금액이 길어지면 왼쪽으로 늘어남 |
| PDP Q&A 필터 | 모든 칩 클릭 가능 (피드백, Q10 일부 변경) | 유형별 필터링, 선택 칩 = Figma ALL 스타일(검정). ALL은 Figma 배치 그대로, 필터 결과는 같은 간격으로 위에서부터 재배치. 문의 없는 유형은 '등록된 문의가 없습니다.' (빈 상태 디자인 없음) |
| 메뉴·장바구니·알림 | Figma(구현 페이지·DS 페이지)와 DEV SPEC 어디에도 디자인 없음. DEV SPEC: "장바구니 알림 디자인…은 지정되지 않았다" | 보류. 헤더 아이콘·BUY/CART는 시각 요소만 |

---

### 출처 (폰트 라이선스)
- Pretendard: [orioncactus/pretendard](https://github.com/orioncactus/pretendard) · [README v1.3.9](https://cdn.jsdelivr.net/npm/pretendard@1.3.9/docs/en/README.md) · [OFL 고지 예시](https://office.dooray.com/cloud-office/help/Hcell/ko_kr/oss/Pretendard-1.3.9_Notice.txt)
- S-Core Dream: [에스코어 공식 폰트 페이지](https://s-core.co.kr/company/font/) · [산돌구름 무료폰트 페이지](https://www.sandollcloud.com/free-font/778/S-CoreDream)
- IBM Plex: [IBM/plex](https://github.com/IBM/plex) (SIL OFL 1.1). 이번 단계에서는 웹으로 다시 확인하지 않았고, 구현 단계에서 릴리스 LICENSE 파일을 확인할 예정
