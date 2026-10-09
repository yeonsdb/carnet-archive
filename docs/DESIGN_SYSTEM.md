# CARNET-ARCHIVE Design System

> 원본: Figma `웹디자인` (fileKey `NlZVjrzU6j4MDxumEG3bq7`), 페이지 `카르넷_구현` (`1113:10489`)
> 추출일: 2026-10-09 · 방식: Figma MCP 읽기 전용 조회 (원본 프레임/레이어는 수정하지 않음)
>
> 이 문서는 **새 디자인이 아니라 현재 Figma에 실제로 쓰인 값의 정리**다. 확인할 수 없는 값은 `미확인`으로, 실측값에서 계산한 값은 `추정`으로 표시했다.

관련 파일

| 파일 | 내용 |
|---|---|
| [design-tokens.json](design-tokens.json) | 토큰 데이터 (DTCG 형식, 값마다 출처/상태 표시) |
| [components.md](components.md) | 컴포넌트 구조, 속성, 상태, PC/모바일 차이 |
| [responsive-rules.md](responsive-rules.md) | 반응형 규칙, 브레이크포인트, 제안 항목 |

Figma 라이브러리: 같은 파일의 `Carnet / Design System` 페이지(`1233:622`). 문서 섹션 00–06(x 0), 메인 컴포넌트(x ≥ 2200). 변수는 `Carnet / Primitives`·`Carnet / Semantic`(확장)·`Carnet / Responsive`(Desktop | Mobile 모드, 신규). Pretendard·S-Core Dream·Helvetica Neue는 Figma MCP 런타임에서 불러올 수 없어서, 이 서체 텍스트는 원본 레이어를 복제한 것이고 텍스트 스타일은 IBM Plex Mono만 있다 (T01–T56).

---

## 1. 분석 범위

| 구분 | 프레임 | Node ID | 크기 |
|---|---|---|---|
| PC | 카르넷_메인 / Home / Desktop | `1113:10490` | 1920 × 8812 |
| PC | 카르넷_카테고리 / Shop / Desktop | `1124:11259` | 1920 × 6376 |
| PC | 카르넷_상세 / Product Detail / Desktop | `1124:11643` | 1920 × 11639 |
| Mobile | 모바일_메인 | `1184:617` | 393 × 4028 |
| Mobile | 모바일_카테고리 | `1195:1732` | 393 × 4097 |
| Mobile | 모바일_상세 | `1213:2342` | 393 × 4704 |

함께 확인한 컴포넌트 세트: `Stockist Row / Hover States` (1113:10965), `Stockist Row / Hover States/앱용` (1195:1266), `Sort Dropdown / States` (1124:11575), `Category Link / Hover States` (1124:12447), `Frame 5` (모바일 상품 메타, 1213:2051), 프레임 밖의 Collections AW26 대체 화면 (1124:12375), DEV NOTE 텍스트 10개.

파일에 있는 로컬 변수 컬렉션 중 이 프레임들에서 실제로 쓰인 값은 `Carnet / Primitives`, `Carnet / Semantic`, `Carnet / Typography` 세 개뿐이다. `Portfolio Colors`, `Alternative Stereo / Guide`, `변수 컬렉션`(#D00411 등)은 **분석한 6개 프레임 어디에서도 쓰이지 않아** 토큰에서 제외했다.

---

## 2. 디자인 원칙 (실측에서 드러난 패턴)

1. **흑·백 + 단일 포인트 컬러.** 표면은 흰색 `#FFFFFF`과 검정 `#000000` 두 가지이고, 강조는 딥 레드 `#831A1F` 하나뿐이다. 회색은 비활성/보조 상태에만 쓴다.
2. **모서리는 모두 직각.** 버튼, 칩, 카드, 입력, 탭 모두 radius 0. (radius 5는 아이콘 내부 도형에만 있다.)
3. **1px 보더로 구조를 나눈다.** 그림자나 배경 톤 대신 1px 선(검정/흰색/회색)으로 영역을 나눈다.
4. **서체 4종의 역할이 나뉜다.** S-Core Dream = 큰 헤딩, Pretendard = 상품·UI 정보, IBM Plex Mono = 아카이브/브랜드 문구와 Footer, Helvetica Neue = 일부 UI(FILTER, 선택된 카테고리).
5. **이미지가 주인공인 에디토리얼 레이아웃.** 상품/에디토리얼 이미지는 거의 모두 3:4이고, PC Shop 그리드는 3열이지만 칸을 일부러 비우는 비대칭 배치를 쓴다.
6. **넓은 여백과 큰 타이포.** PC 섹션 간 간격 200px, 섹션 헤딩 80px, Shop 타이틀 160px.

---

## 3. Color

### 3.1 Semantic 토큰

| 토큰 | 값 | Figma 변수 | 용도 |
|---|---|---|---|
| `color.bg.page` | `#FFFFFF` | color/surface/page | 페이지 배경 |
| `color.bg.inverse` | `#000000` | color/surface/inverse | Header, Footer, Primary 버튼, 활성 칩, 배지, VIEW ALL |
| `color.bg.overlay-dark` | `#000000` @ 50% | — | 상세 상품 설명 오버레이 |
| `color.text.primary` | `#000000` | color/text/primary | 기본 텍스트 |
| `color.text.inverse` | `#FFFFFF` | color/text/inverse | 검정 배경 위 텍스트, 워드마크 |
| `color.text.secondary` | `#767676` | color/text/secondary | Stockist 도시명 |
| `color.text.muted` | `#8B8B8B` | color/text/muted | 비활성 탭, 정렬 옵션, 비활성 칩, 각주 |
| `color.text.pagination-inactive` | `#8F8F8F` | color/text/pagination-inactive | 비활성 페이지 번호 |
| `color.text.accent` | `#831A1F` | color/accent/brand | 선택 카테고리, NEW IN, hover, 인덱스 숫자, 장바구니 아이콘 |
| `color.border.strong` | `#000000` | color/border/strong | 기본 보더, 구분선 |
| `color.border.inverse` | `#FFFFFF` | — | Footer 구분선, 스와치 테두리 |
| `color.border.muted` | `#8B8B8B` | — | PC 비활성 탭 하단선, 비활성 칩 |
| `color.border.tab-inactive` | `#8B8B8B` | color/border/tab-inactive | PC·모바일 비활성 탭 하단선 (2026-10-09 통일 결정) |
| `color.border.subtle` | `#CFCFCF` | color/border/subtle | 수량 스테퍼, 보조 구분선 |
| `color.border.accent` | `#831A1F` | — | NEW IN 버튼 |
| `color.decoration.archive-teal` | `#15464A` | color/decoration/archive-teal | Collections 곡선 장식 stroke |

### 3.2 상품 컬러 스와치

| 토큰 | 값 |
|---|---|
| `color.product-swatch.black` | `#000000` |
| `color.product-swatch.chalk` | `#F4F4F4` |
| `color.product-swatch.charcoal` | `#4E4952` |
| `color.product-swatch.green` | `#4A6058` |

### 3.3 색상 사용 규칙
- 포인트 컬러 `#831A1F`는 **상태(선택/hover)와 강조 CTA 하나(NEW IN)** 에만 쓴다. 넓은 면적 채움으로는 쓰이지 않는다.
- 검정 면 위에서는 텍스트와 보더 모두 흰색이다 (Header/Footer).
- `#D9D9D9`는 변수로 존재하지만 실제로는 아이콘 Boolean 컷아웃 내부에만 있어 화면에 보이지 않는다 → 구현에 필요 없음.

---

## 4. Typography

### 4.1 Font Family

| 토큰 | 서체 | 사용 weight | 역할 |
|---|---|---|---|
| `font.family.display-kr` | S-Core Dream | 5 Medium, 6 Bold, 7 ExtraBold | 섹션 헤딩, Shop 타이틀, 캠페인 문구, 컬렉션 타이틀 |
| `font.family.sans` | Pretendard | Light, Regular, Medium, SemiBold, Bold, ExtraBold | 워드마크, 상품/상세 정보, 카테고리, Stockist |
| `font.family.mono` | IBM Plex Mono | Light, Regular, Medium, SemiBold, Bold | 브랜드 문구, 아카이브 코드, Footer |
| `font.family.grotesk` | Helvetica Neue | Regular, Bold, Heavy | FILTER, 선택된 카테고리, PC Shop/Detail 헤더 로고 |

> 모바일 프레임의 `SF Pro`는 iOS 상태바 목업(9:41)에만 쓰여 토큰에서 제외했다.
> 모든 서체는 **웹폰트 라이선스/파일 확보 여부가 디자인에서 확인되지 않음** (특히 S-Core Dream, Helvetica Neue).

### 4.2 Letter Spacing / Line Height

| 토큰 | 값 | 비고 |
|---|---|---|
| `font.letterSpacing.none` | 0 | |
| `font.letterSpacing.tight-2` | -0.02em (-2%) | Stockist 이름 |
| `font.letterSpacing.tight-3` | -0.03em (-3%) | 컬렉션 타이틀, NEW IN |
| `font.letterSpacing.tight-4` | -0.04em (-4%) | Pretendard 본문 대부분 · 가장 많이 쓰임 |
| `font.letterSpacing.wide-5` | 0.05em (5%) | Collections 대체 화면 코드 |
| `font.lineHeight.auto` | normal | 대부분의 텍스트 |
| `font.lineHeight.body` | 1.3 (130%) | 상세 본문, 페이지네이션, FILTER |
| `font.lineHeight.fixed-15` | 15px | 인덱스 숫자 |
| `font.lineHeight.fixed-20` | 20px | Brand Philosophy 키워드 (PC) |

### 4.3 Type Scale (PC → Mobile)

자간/행간이 따로 적혀 있지 않으면 위 표의 기본값(0 / auto)이다.

| 토큰 | 서체 · weight | PC | Mobile | 자간 · 행간 | 색 |
|---|---|---|---|---|---|
| `typography.display.wordmark` | Pretendard ExtraBold | 170 | 48 | 0 | inverse |
| `typography.display.page-title` | S-Core Dream 7 ExtraBold | 160 | 40 | 0 | primary |
| `typography.heading.section` | S-Core Dream 6 Bold | 80 | 20 | 0 | primary |
| `typography.heading.campaign` | S-Core Dream 7 ExtraBold | 54 | 10 | 0 | inverse |
| `typography.heading.collection-title` | S-Core Dream 5 Medium | 40 | 14 | -3% | primary |
| `typography.heading.season-label` | Pretendard SemiBold | 50 | 16 | -4% | primary |
| `typography.body.mono-keyword` | IBM Plex Mono Medium | 22 | 10 | 0 · PC 20px / M auto | primary |
| `typography.body.mono-statement` | IBM Plex Mono Regular | 16 | 10 | -4% | primary |
| `typography.body.mono-code` | IBM Plex Mono Regular | 14 | 10 | -4% | primary |
| `typography.body.mono-typewriter` | IBM Plex Mono Light | 16 | 모바일에 없음 | 0 | primary |
| `typography.label.category` | Pretendard Medium | 24 | 14 | -4% | primary |
| `typography.label.link-large` | Pretendard Light | 24 | 16 | -4% | primary / inverse |
| `typography.label.cta-accent` | Pretendard Medium | 20 | 12 | -3% | accent |
| `typography.label.index` | Pretendard SemiBold | 14 | 8 | 0 · 15px | accent |
| `typography.label.category-link` | Pretendard Bold (hover: ExtraBold) | 30 | 미확인 | 0 | primary |
| `typography.label.category-link-selected` | Helvetica Neue Heavy | 30 | 16 | 0 | accent |
| `typography.stockist.name` | Pretendard Medium (hover: SemiBold) | 28 | 14 | -2% (M 미확인) | primary (hover accent) |
| `typography.stockist.index` | Pretendard Light | 24 | 14 | — | primary |
| `typography.stockist.city` | Pretendard Regular | 10 | 10 | -4% | secondary |
| `typography.product.name` | Pretendard SemiBold | 16 | 14 | -4% (M 미확인) | primary |
| `typography.product.price` | Pretendard Regular | 16 | 10 | -4% (M 미확인) | primary |
| `typography.control.filter-label` | Helvetica Neue Regular | 16 | 14 | -4% · 130% · Title Case | primary |
| `typography.control.filter-option` | Pretendard Regular | 16 | 미확인 | — | muted |
| `typography.control.pagination` | Pretendard Regular (active: Medium) | 16 | 14 | -4% · 130% | pagination-inactive / primary |
| `typography.header.logo` | Pretendard Bold | 16 | 16 | 0 | inverse |
| `typography.footer.label` | IBM Plex Mono SemiBold | 16 | 10 | 0 | inverse |
| `typography.footer.value` | IBM Plex Mono Regular | 16 | 10 | 0 | inverse |
| `typography.footer.heading` | IBM Plex Mono Bold | 24 | 16 | 0 | inverse |
| `typography.footer.legal-link` | IBM Plex Mono Medium | 16 | 모바일에 없음 | 0 | inverse |
| `typography.detail.product-name` | Pretendard SemiBold | 24 | 14 | -4% · M 130% | primary |
| `typography.detail.product-price` | Pretendard SemiBold → M Medium | 24 | 14 | -4% | primary |
| `typography.detail.info-label` | Pretendard SemiBold → M Medium | 16 | 10 | -4% | primary |
| `typography.detail.info-value` | Pretendard Regular | 16 | 10 | -4% | primary |
| `typography.detail.tab-active` | Pretendard SemiBold → M Medium | 16 | 10 | -4% | primary |
| `typography.detail.tab-inactive` | Pretendard Regular | 16 | 10 | -4% | muted |
| `typography.detail.button` | Pretendard SemiBold | 20 | 14 | -4% | — |
| `typography.detail.order-total` | Pretendard Bold | 20 | 미확인 | -4% · 130% | primary |
| `typography.detail.section-title` | Pretendard Medium | 25 | 14 | -4% | primary |
| `typography.detail.body` | Pretendard Regular | 16 | 12 | -4% · 130% | primary |
| `typography.detail.caption` | Pretendard Regular | 14 | 미확인 | -4% · 130% | primary |
| `typography.detail.badge` | Pretendard Medium | 14 | 10 | -4% | inverse / muted |
| `typography.detail.notice-title` | Pretendard Bold | 24 | 12 | -4% · 130% | inverse |
| `typography.detail.guide-body` | Pretendard Regular | 16 | 8 | -4% · 130% | primary / inverse |
| `typography.detail.size-table` | Pretendard Regular → M Medium | 14 | 8 | -4% | primary |
| `typography.detail.unit-toggle` | Pretendard SemiBold → M Medium | 16 | 12 | 0 | primary / muted |
| `typography.detail.description` | IBM Plex Mono Regular | 16 | 8 | -4% | inverse |
| `typography.detail.write-link` | Pretendard Medium, underline | 16 | 10 | -4% | PC primary / M muted |

> 모바일 크기가 8–10px인 스타일이 많다 (캠페인 문구 10px, 구매 안내 8px 등). 디자인값 그대로 기록했다. 가독성 관련 제안은 [responsive-rules.md](responsive-rules.md) §6에 따로 정리했다.

### 4.4 Figma에 등록된 텍스트 스타일과의 관계
파일에는 `Carnet / T01…T33` 텍스트 스타일 10개와 `Carnet / Typography` 변수(T01–T50)가 있다. 위 타입 스케일은 이 변수 정의와 실제 레이어 값을 대조해 역할 기준으로 묶은 것이다. 예: `typography.heading.section` = T18 (S-Core Dream 6 Bold 80), `typography.stockist.name` = T26, `typography.footer.label` = T01.

---

## 5. Spacing

### 5.1 Spacing scale (`space.*`)

`0, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 19, 20, 23, 24, 28, 29, 30, 40, 45, 60, 100, 135, 200` (px)

이 중 `0, 4, 5, 9, 10, 20, 24, 28, 30, 60`은 Figma `Carnet / Semantic`의 `spacing/*` 변수와 같고, `15, 135`는 `layout/*` 변수와 같다. 나머지는 레이어 좌표에서 실측했다. 용도는 [design-tokens.json](design-tokens.json) `space`의 `carnet.usage`에 적었다.

> 6, 13, 19, 23, 29처럼 정수 스케일에서 벗어난 값이 있다. 디자인을 바꾸지 않는다는 원칙에 따라 그대로 두었다. 4/8 스케일로 정리할지는 디자이너가 결정할 일이다.

### 5.2 주요 간격 (PC)

| 위치 | 값 |
|---|---|
| 페이지 좌우 여백 | 60 |
| 섹션 간 (Shop→Campaign, Campaign→Collections, Collections→Stockists) | 200 |
| 섹션 간 (Brand Philosophy→Shop) | 100 |
| Stockists → Footer | 250 |
| 섹션 헤딩(80px) → 콘텐츠 | 40 (Shop, Stockists), 61 (Collections) |
| 상품 그리드 열 간격 / 행 간격 | 20 / 135 |
| 상품 이미지 → 메타 | 15 |
| 상품명 → 가격 | 5 |
| 홈 카테고리 카드 열 간격 / 행 간격 | 20 / 45 |

### 5.3 주요 간격 (Mobile)

| 위치 | 값 |
|---|---|
| 페이지 좌우 여백 | 16 |
| 그리드 gutter / 카드 열 간격 | 8 |
| 섹션 헤딩(20px) → 콘텐츠 | 19 (Shop), 22 (Collections), 10 (Stockists) |
| 상품 이미지 → 메타 | 6 |
| 상품 카드 간 (1열) | 29 |
| Footer 필드 행 피치 | 18 |

---

## 6. Layout

| 토큰 | PC | Mobile | 출처 |
|---|---|---|---|
| `layout.frame-width` | 1920 | 393 | 프레임 |
| `layout.content-width` | 1800 | 361 | 변수 / 계산 |
| `layout.page-gutter` | 60 | 16 | 변수 / 레이아웃 그리드 |
| `layout.grid.columns` | 12 (+15열 보조) | 4 | 레이아웃 그리드 |
| `layout.grid.gutter` | 20 | 8 | 레이아웃 그리드 |
| `layout.header-height` | 60 | 60 | 실측 |
| `layout.footer-height` | 600 | 276 | 실측 |
| `layout.product-grid.columns` | 3 | 2 (요구사항) | 실측 / 요구 |
| `layout.detail.content-width` | 1345 | 361 | 변수 |

PC 레이아웃 그리드는 **12열(gutter 20, offset 60)** 과 **15열(gutter 20, offset 60)** 두 개가 정의돼 있다. Shop/Detail은 12열을, Home은 15열을 켜 둔 상태다. 실제 요소 배치는 3열(587px) 단위와 맞으므로 구현은 12열 기준으로 하고 3열 = 4칸씩으로 본다.

브레이크포인트는 [responsive-rules.md](responsive-rules.md) 참조.

---

## 7. 이미지 비율

| 토큰 | 비율 | PC 실측 | Mobile 실측 |
|---|---|---|---|
| `aspectRatio.product` | 3:4 | 587×783 | 361×482 |
| `aspectRatio.category-portrait` | 3:4 | 587×783, 708×944 | 361×482, 176×235 |
| `aspectRatio.category-landscape` | 465:357 (≈1.30) | 465×357, 587×451 | 177×136, 176×135 |
| `aspectRatio.editorial` | 3:4 | 587×786, 344×460, 1345×1795 | 269×361, 84×113, 361×482 |
| `aspectRatio.hero` | 16:9 | 1920×1080 | 602×339 이미지를 393 폭으로 크롭 |
| `aspectRatio.campaign` | 1920:770 | 1920×770 | 520×209 이미지를 393 폭으로 크롭 |
| `aspectRatio.stockist-editorial` | 900:511 | 900×511 | 361×205 |
| `aspectRatio.detail-texture` | 1345:641 | 1345×641 | 361×172 |
| `aspectRatio.detail-gallery-active` | 436:889 | 436×889 | 187×380 |

PC와 모바일에서 비율이 같다는 것을 실측으로 확인했다. 예외는 Hero와 Campaign으로, 모바일에서는 이미지가 화면보다 넓게 배치되고 좌우가 잘린다.

---

## 8. Border · Radius · Elevation

- 보더 두께: `1px` 기본, `2px` (스와치 흰 테두리, PC NEW IN 화살표)
- Radius: `0` 고정
- 그림자/블러 효과: **사용 없음**
- 장식용 굵은 stroke: Collections 곡선 `#000000 120px` / `#15464A 45px` (모바일 25 / 15). 이건 그래픽 에셋이라 토큰이 아니라 SVG로 다룬다.

---

## 9. Motion (DEV NOTE 기준)

| 위치 | 동작 | 수치 |
|---|---|---|
| Home 워드마크 | 왼쪽→오른쪽 글리치("치지직") 등장 | 미확인 |
| Home 시즌 갤러리 | 가로 스크롤, hover 시 이미지 확대 | 배율·시간 미확인 |
| Home 카테고리 카드 | hover 시 두 번째 이미지로 전환, 벗어나면 원래 이미지로 | 미확인 |
| Home Collections | hover 확대, 시즌 텍스트 클릭 시 AW26↔SS26 화면 전환 | 미확인 |
| Home Stockist | hover 시 Hover variant (SemiBold, accent) | 즉시 전환으로 추정 |
| Shop 카테고리 링크 | hover 시 ExtraBold, 커서 포인터 | — |
| Shop 상품 카드 | hover 시 모델 이미지 → 상품 컷아웃 이미지 | 미확인 |
| Shop 타이프라이터 | 스크롤 진입 시 타이핑, 끝나고 1000ms 뒤 커서 등장, 2000ms 간격 깜빡임 | `motion.cursor-delay` 1000ms, `motion.cursor-blink-interval` 2000ms (변수) |
| Detail 갤러리 | 5번째 이미지에서 시작, Prev/Next로 이동하며 활성 이미지 확대 | 초기 index 4 (변수) |
| Detail 탭 | 클릭 시 해당 섹션으로 스크롤 | 미확인 |

---

## 10. 분석 불가 · 불일치 보고

### 10.1 확인할 수 없는 값 (임의로 정하지 않음)
1. **모든 hover/transition의 duration, easing, scale 배율** — DEV NOTE에 "약간 커짐" 같은 서술만 있다.
2. **모바일 상품 목록 2열 레이아웃** — 모바일 Shop 프레임은 1열(361px)로 그려져 있다. 2열 보기 토글 아이콘은 있지만 2열 화면은 없다. 2열 카드의 메타 타이포/행 간격은 미확인 ([responsive-rules.md](responsive-rules.md) §3).
3. **모바일 상품 메타(Frame 5) 자간**, **Stockist 앱용 이름 자간** — 인스턴스 내부 값을 확정하지 못했다.
4. **모바일 카테고리 링크 텍스트 크기** — 원본 컴포넌트(215×51, 30px)를 116×27로 축소 배치했다. 실효 크기는 약 16px로 추정되지만 수치로 확인되지 않았다.
5. **Sort Dropdown 모바일 Open 상태, 페이지네이션 hover, 버튼 hover/pressed/disabled 상태** — 디자인에 없다.
6. **햄버거 메뉴를 연 화면, 계정/장바구니 화면** — 디자인에 없다.
7. **상세 갤러리 Prev/Next 버튼(54×105)의 배경색/투명도** — 이번 조회에서 추출하지 못했다. 구현 전에 Figma에서 확인해야 한다.
8. **웹폰트 파일/라이선스** — S-Core Dream, Helvetica Neue.
9. **태블릿/중간 브레이크포인트** — 디자인에 없다 (제안만 했다).
10. **`#E9E9E9`** — 모바일 상세 stroke 5곳에만 있고 변수에 없다. 의도한 값인지 확인이 필요하다.

### 10.2 같은 역할인데 값이 다른 경우 (디자인 원본 확인 필요)
| 항목 | 값 A | 값 B |
|---|---|---|
| 헤더 로고 서체 | Pretendard Bold 16 (PC Home, 모바일 전체) | Helvetica Neue Bold 16 (PC Shop, PC Detail) |
| Footer 사업자 번호 줄 서체 | IBM Plex Mono Regular 16 (PC Home) | Helvetica Neue Regular 16 (PC Shop/Detail) |
| 카테고리 링크 선택 상태 | Helvetica Neue Heavy (선택) | Pretendard Bold/ExtraBold (기본/hover) — 같은 컴포넌트 안에서 서체가 바뀜 |
| ~~모바일 상세 비활성 탭 보더~~ | **해결 (2026-10-09): `#8B8B8B`로 통일** | 기존 `#A4A4A4` 사용처는 갱신 대상 |
| Q&A 작성하기 링크 색 | `#000000` (PC) | `#8B8B8B` (모바일) |
| 자간 | -4% (대부분) | -4.2% (홈 TOPS/ACC 라벨 2곳) → `tight-4`로 통합 권장 |
| 홈 카테고리 카드 폭 (모바일) | 177 (왼쪽 열) | 176 (오른쪽 열) → 반올림 차이로 보고 동일 폭으로 구현 |
| 상품 카드 x 좌표 (PC Shop) | 666 / 667 | 1273 / 1274 → 20px gutter로 통일 |

### 10.3 구현 대상에서 제외
- 모바일 `2. System Bar` (iOS 상태바 목업, SF Pro)
- 컴포넌트 세트 외곽의 `#9747FF` 점선 테두리 (Figma 기본 variant 컨테이너 표시)
- DEV NOTE 텍스트와 연결 화살표 벡터
- 미사용 변수 컬렉션 (`Portfolio Colors`, `Alternative Stereo / Guide`, `변수 컬렉션`)
