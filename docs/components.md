# CARNET-ARCHIVE Components

> 모든 수치는 Figma 실측값(px)이다. 토큰 이름은 [design-tokens.json](design-tokens.json) 기준. `미확인` = 디자인에서 확인할 수 없는 값, `추정` = 실측값에서 계산한 값.
> 표기: **PC** = 1920 프레임, **M** = 393 프레임.

## 목차
1. [Header / Navigation](#1-header--navigation)
2. [Footer](#2-footer)
3. [Product Card](#3-product-card)
4. [Product Grid](#4-product-grid)
5. [Filter](#5-filter)
6. [Button](#6-button)
7. [Icon](#7-icon)
8. [Collection Navigation](#8-collection-navigation)
9. [Product Detail Information](#9-product-detail-information)
10. [보조 컴포넌트 (Category Card, Category Link, Stockist Row, Pagination, Section Heading)](#10-보조-컴포넌트)

---

## 1. Header / Navigation

**구조**
```
Header (fixed-height bar, bg.inverse)
├── MenuButton      (햄버거, 3선)          ← 좌측
├── BrandLogo       "CARNET-ARCHIVE"        ← 중앙
└── Actions
    ├── AccountButton
    └── CartButton                          ← 우측
```

| 속성 | PC | M | 토큰 |
|---|---|---|---|
| 높이 | 60 | 60 | `component.header.height` |
| 배경 | #000000 | #000000 | `color.bg.inverse` |
| 좌우 padding | 60 | 16 | `component.header.padding-x` |
| 로고 | Pretendard Bold 16, 흰색, 가운데 정렬 (x 888–1031) | Pretendard Bold 16, 가운데 (x 126–267) | `typography.header.logo` |
| 메뉴 아이콘 | 20×12, 선 3개 간격 6, 흰색 1px | 18×11, 간격 5 | `size.icon.header` |
| 계정/장바구니 아이콘 | 20×19 | 18×17 | |
| 아이콘 사이 간격 | 21 | 18 | `component.header.icon-gap` |

**상태:** hover/active 미확인. 메뉴를 연 화면 디자인 없음.
**불일치:** PC Shop/Detail 프레임의 로고만 Helvetica Neue Bold 16. → Pretendard로 통일할지 확인 필요.
**PC/M 차이:** 높이와 배치는 같고 여백(60→16)과 아이콘 크기(20→18)만 다르다.

---

## 2. Footer

**구조 (PC)**
```
Footer (bg.inverse, h 600)
├── LegalNav        TERMS OF USE · PRIVACY POLICY · CONFIRM ENTREPRENEUR INFORMATION   (y +126)
├── Divider         1px white, 1800 wide                                               (y +165)
├── CompanyInfo     (좌, x 60)    Label : Value 행 × 7
│     COMPANY NAME / OWNER / PERSONAL INFO MANAGER / (간격) / EMAIL / ADDRESS / BUSINESS REGISTRATION NUMBER / BUSINESS LICENSE
└── ContactDirectory (우, x 1152, w 708)
      CONTACT (heading) + divider
      Row × 5: GENERAL REQUESTS / SALES / PRESS / E-SHOP / IG   — Label 왼쪽, Link 오른쪽 정렬, 하단 1px divider
```

**구조 (M)**
```
Footer (bg.inverse, h 276)
├── CompanyInfo   Label : Value 행 × 7 (x 16)
└── ContactButton  361×48, 1px white 테두리, "CONTACT" + 오른쪽 화살표
```

| 속성 | PC | M | 토큰 |
|---|---|---|---|
| 높이 | 600 | 276 | `component.footer.height` |
| 좌우 padding | 60 | 16 | `component.footer.padding-x` |
| Label | IBM Plex Mono SemiBold 16 | 10 | `typography.footer.label` |
| Value | IBM Plex Mono Regular 16 | 10 | `typography.footer.value` |
| Label–Value 간격 | 10 | 5 | |
| 행 피치 | 34 (텍스트 21 + 13) | 18 (13 + 5) | `component.footer.field-row-pitch` |
| 그룹 간 추가 간격 (PRIVACY → EMAIL) | 95 피치 | 45 피치 | |
| CONTACT 헤딩 | IBM Plex Mono Bold 24 | Bold 16 | `typography.footer.heading` |
| Contact 행 | 높이 35, 피치 50, divider 1px white | 버튼 하나로 대체 | `component.footer.contact-row-*` |
| Legal 링크 | IBM Plex Mono Medium 16, 링크 간격 77 | **없음** | `typography.footer.legal-link` |

**PC/M 차이:** 모바일에서는 Legal 링크와 Contact 목록이 빠지고, CONTACT 버튼 하나(361×48)만 남는다. 모바일 CONTACT 버튼을 눌렀을 때 동작은 미확인.
**불일치:** PC Shop/Detail Footer의 사업자번호 줄은 Helvetica Neue. Home은 IBM Plex Mono.

---

## 3. Product Card

**구조 (PC, `Product Card / NN / {NAME} / Hover=Swap`)**
```
ProductCard (587 × 841)
├── Media (587 × 783, 3:4)
│   ├── Background / Product Image   (이미지 채움, 카드 전체)
│   ├── Image / State=Default / Model   (모델 컷아웃, 이미지마다 크기 다름, 하단 정렬)
│   └── Image / State=Hover / Cutout    (hidden, hover 시 노출되는 상품 컷아웃)
└── Meta (587 × 43, row, gap 20)  ← Media 하단에서 15
    ├── Info (547, row, gap 105)
    │   ├── NameAndPrice (384, column, gap 5)
    │   │   ├── Name    Pretendard SemiBold 16 -4%
    │   │   └── Price   Pretendard Regular 16 -4%
    │   └── Swatches (row, gap 5)  16×16, 2px white border
    └── CartIcon  20×19, accent
```

**구조 (M, 컴포넌트 `Frame 5` 1213:2051)**
```
ProductCard (361 × 482 media + meta)
├── Media 361 × 482 (3:4)
└── Meta (360 × 29, row, gap 77)  ← Media 하단에서 6
    ├── NameAndPrice (275, column, gap 0)
    │   ├── Name   Pretendard SemiBold 14
    │   └── Price  Pretendard Regular 10
    └── Right (row, gap 14)
        ├── Swatches (gap 5) 16×16, 2px white border
        └── CartIcon 17×16
```

| 속성 | PC | M | 토큰 |
|---|---|---|---|
| Media 비율 | 3:4 | 3:4 | `aspectRatio.product` |
| Media → Meta | 15 | 6 | `component.product-card.meta-gap` |
| 이름 → 가격 | 5 | 0 | `component.product-card.name-price-gap` |
| 이름 | SemiBold 16 | SemiBold 14 | `typography.product.name` |
| 가격 | Regular 16 | Regular 10 | `typography.product.price` |
| 스와치 | 16, gap 5, 2px #FFF 테두리 | 같음 | `component.product-card.swatch-*` |
| 장바구니 아이콘 | 20×19 | 17×16 | `component.product-card.cart-icon` |
| 긴 상품명 | — | 2줄일 때 메타 높이 46 (`Frame 8/9`) | |

**상태**
- `Default`: 모델 이미지
- `Hover` (PC): 모델 이미지 → 상품 컷아웃 이미지로 교체, 마우스가 벗어나면 복귀 (DEV NOTE). 전환 시간 미확인.
- 터치 기기에서 hover를 어떻게 대체할지는 미확인.

**구현 메모:** Media는 `aspect-ratio: 3/4`로 고정하고, 모델 컷아웃은 `object-fit: contain; object-position: bottom center`로 배경 위에 올린다. 디자인에서 컷아웃이 하단 기준으로 놓여 있기 때문이다.

---

## 4. Product Grid

| 속성 | PC | M | 토큰 |
|---|---|---|---|
| 열 수 | 3 | **2** (요구사항) | `layout.product-grid.columns` |
| 카드 폭 | 587 | (361 − 8) / 2 = 176.5 (추정) | `layout.product-grid.card-width` |
| 열 간격 | 20 | 8 | `layout.product-grid.column-gap` |
| 행 간격 | 135 | 미확인 (1열 디자인은 29) | `layout.product-grid.row-gap` |
| 행 피치 | 976 (841 + 135) | — | |
| 시작 y (헤더 기준) | 628 | 329 | |

**PC 배치 패턴 (Shop 실측):** 3열 격자 안에서 칸을 비워 두는 비대칭 배치다.
```
row1:  [01] [  ] [02]
row2:  [  ] [03] [04]
row3:  [05] [TW] [06]     TW = 타이프라이터 문구 (가운데 칸)
row4:  [07] [08] [  ]
row5:  [09] [  ] [10]
```
이 배치가 의도된 고정 패턴인지, 상품 수에 따라 바뀌는지는 미확인이다. 일반 3열 그리드로 할지, 패턴을 반복할지는 [responsive-rules.md](responsive-rules.md) §3 참조.

**M:** 디자인은 1열(361px) 카드 목록이다. 상단 툴바에 1열 아이콘과 2열 아이콘이 있어 보기 전환을 의도한 것으로 보인다. 2열 상태 화면은 없다.

---

## 5. Filter

### 5.1 Category Filter (Shop 좌측 카테고리 목록)
→ [10.2 Category Link](#102-category-link) 참조. ALL / OUTERWEAR / BOTTOMS / TOPS / ACCESSORIES 세로 목록.

### 5.2 Sort Dropdown (`Sort Dropdown / States`, 1124:11575)
```
SortDropdown
├── Trigger  "FILTER" + chevron(14×7, 1px)
└── Menu (open)  신상품순 / 낮은 가격순 / 높은 가격순 / 후기순 / 판매량순
```
| 속성 | PC | M |
|---|---|---|
| Closed 크기 | 106 × 30 | 84 × 30 |
| Open 크기 | 106 × 225 | 미확인 |
| 테두리 | 1px #000, 배경 #FFF | 같음 |
| Trigger 텍스트 | Helvetica Neue Regular 16, 130%, -4% | Regular 14 |
| 옵션 텍스트 | Pretendard Regular 16, #8B8B8B | 미확인 |
| 옵션 행 | 높이 29, 피치 36, 좌측 padding 13 | 미확인 |
| Trigger/옵션 사이 | 1px #000 divider | — |
| 위치 | 우측 정렬 (x 1754–1860), y 584 | 우측 (x 293–377), y 288 |

선택된 옵션 표시 방식, hover 상태는 미확인.

### 5.3 View Toggle (보기 전환)
| | PC | M |
|---|---|---|
| 형태 | 16×16 사각형 2개 (채움 #000 / 외곽선 1px), 간격 12 | 1열 아이콘 15×14 (가로 막대 2개), 2열 아이콘 14×14 (2×2 사각형) |
| 위치 | x 60, y 144 | x 16 / 40, y 304 |

PC 토글의 의미(몇 열 보기인지)는 미확인.

### 5.4 Range Indicator (PC `Decoration / 19–21`, M 동일)
`8×13 외곽선` + `22×13 외곽선` + `146×13 채움` 막대 묶음. 슬라이더/진행 표시로 보이지만 **기능이 확인되지 않았다.** 그래픽으로만 구현하고 동작은 정하지 않는다.

### 5.5 Inquiry Filter Chip (상세 Q&A)
| 속성 | PC | M | 토큰 |
|---|---|---|---|
| 항목 | ALL · 상품 문의 · 재입고 문의 · 사이즈 문의 · 배송 문의 · 기타 | 같음 | |
| 높이 | 37 | 23 | `component.filter.inquiry-chip` |
| padding | 9 / 23 | (9 / 23로 설정돼 있으나 실제 크기와 안 맞음) | |
| 칩 간격 | 12 | 5 | |
| Active | 배경 #000, 텍스트 #FFF | 같음 | |
| Inactive | 배경 #FFF, 1px #8B8B8B, 텍스트 #8B8B8B | 같음 | |
| 텍스트 | Pretendard Regular 16 -4% | Regular 10 | |

---

## 6. Button

모든 버튼은 radius 0, 그림자 없음.

| 변형 | 용도 | 스타일 | PC 크기 | M 크기 | 텍스트 |
|---|---|---|---|---|---|
| `primary` | BUY IT NOW | 배경 #000 / 텍스트 #FFF | 378 × 78 | 180 × 44 | Pretendard SemiBold 20 / 14 |
| `secondary` | CART | 배경 #FFF / 1px #000 / 텍스트 #000 | 379 × 78 | 181 × 44 | SemiBold 20 / 14 |
| `outline-accent` | 1ST DROP NEW IN → | 투명 / 1px #831A1F / 텍스트 #831A1F | 259 × 44 | 142 × 34 | Pretendard Medium 20 / 12, -3% |
| `outline` | 상품 설명 더보기 ∨ | 배경 #FFF / 1px #000 | 334 × 81 | 176 × 48 | 미확인 / Pretendard Regular 12 |
| `view-all` | VIEW ALL | 배경 #000 / 텍스트 #FFF | 364 × 78 | 92 × 48 | Pretendard Light 24 / 16 |
| `text-link` | Q&A 작성하기 | 밑줄 | — | — | Pretendard Medium 16 #000 / 10 #8B8B8B |
| `gallery-nav` | 이전/다음 이미지 | 54 × 105, chevron 29×15 | 54 × 105 | 없음 | — |
| `icon` | 메뉴/계정/장바구니 | → [7. Icon](#7-icon) | | | |
| `quantity-stepper` | − [n] + | 셀 3개, 1px #CFCFCF, 배경 #FFF | 34 × 34 ×3 (총 100) | 19 × 19 ×3 (총 56) | Pretendard Medium 10 (M) |

**레이아웃 규칙:** primary + secondary는 한 줄에 반씩 나란히 붙여 놓는다 (PC 378+379 = 757, M 180+181 = 361). 버튼 사이 간격은 0이다.

**상태:** hover/pressed/disabled/focus 모두 **미확인**.

---

## 7. Icon

모든 아이콘은 벡터 레이어(Boolean/Vector)로 그려져 있고, 구현 시 SVG로 내보내야 한다. 아이콘 라이브러리 컴포넌트는 없다.

| 아이콘 | PC | M | 색 / 선 |
|---|---|---|---|
| Menu (3선) | 20 × 12 | 18 × 11 | #FFF 1px |
| Account | 20 × 19 | 18 × 17 | 흰 채움 + #831A1F 1px 선 (Header) |
| Cart (쇼핑백) | 20 × 19 (Header), 20 × 19 (카드) | 18 × 17 (Header), 17 × 16 (카드) | Header: 흰 채움 + accent 선 / 카드: accent |
| Arrow Right (긴 화살표) | 27 × 17 (NEW IN), 43 × 27 (시즌 내비) | 15 × 10, 19 × 12 | accent 2px (NEW IN) / #000 1px |
| Arrow Left | 43 × 27 | 19 × 12 | #000 1px |
| Chevron Down | 14 × 7 (FILTER), 18 × 9 (더보기) | 12 × 6 | #000 1px |
| Chevron Prev/Next (갤러리) | 29 × 15 | — | 미확인 |
| Close (선택 상품 삭제) | 10 × 9 | 8 × 7 | 미확인 |
| Plus / Minus (수량) | 12 | 6.7 | #CFCFCF 1px (M) |
| Pagination Next | 9 × 9 | 9 × 9 | 미확인 |
| View 1열 / 2열 | 16 × 16 | 15 × 14 / 14 × 14 | #000 |
| 장식 마커 (사각형/바) | 16 × 16, 8 × 16 | 8 × 8, 3–4 × 8 | #000 채움 / 1px 외곽선 |

> `#D9D9D9` 도형은 아이콘 Boolean 연산용 컷아웃이라 내보낸 SVG에는 나타나지 않는다.

---

## 8. Collection Navigation

Home의 Collections 섹션. AW26 ↔ SS26 두 상태(PC: 메인 프레임 + 프레임 밖 대체 화면 `1124:12375`, M: 메인 + `06 / Collections / State=AW26 / Alternate`).

**구조**
```
CollectionsSection
├── SectionHeading "COLLECTIONS"
├── ArchiveSweep (장식 곡선 SVG 2개: #000 120px / #15464A 45px)
├── EditorialGallery
│   ├── Main      3:4  (PC 587×786 / M 269×361)
│   ├── Secondary 3:4  (PC 344×461 / M 84×113)
│   ├── Detail    3:4  (PC 344×460 / M 84×111)
│   └── RotatedSeasonLabel  ('SS26 + SAMPLING / 'AW26 + [UNEARTH: FILE-2711], 90° 회전)
└── SeasonNav (bar)
    ├── PrevSeason  ← "AW25: AW25 LAMB'…"
    ├── NextSeason  "AW26: [UNEARTH: FILE-2711]" →
    └── ViewAll     검정 칸 "VIEW ALL"
```

| 속성 | PC | M |
|---|---|---|
| SeasonNav 크기 | 1799 × 78 | 361 × 48 |
| SeasonNav 스타일 | 배경 #FFF, 1px #000 | 같음 (269 + 92 분할) |
| 시즌 링크 텍스트 | Pretendard Light 24 -4% | **없음** (화살표만 있음) |
| 화살표 | 43 × 27 | 19 × 12 |
| VIEW ALL 칸 | 364 × 78, #000, Light 24 #FFF | 92 × 48, Light 16 #FFF |
| 회전 라벨 | 시즌 SemiBold 50 + 코드 Mono 14 | 시즌 SemiBold 16 + 코드 Mono 10 |
| 이미지 간격 | Main→Secondary 20 | 8 |

**동작 (DEV NOTE):** 이미지 hover 시 살짝 확대. 시즌 텍스트를 클릭하면 해당 컬렉션 화면으로 전환. 전환 애니메이션은 미확인.
**PC/M 차이:** 모바일은 시즌 이름 텍스트 없이 화살표만 있다. 회전 라벨 위치도 다르다.

### 8.1 Season Gallery (Home 상단 `Gallery / Current Collection`)
- PC: 1921 × 948 컴포넌트, 모델 컷아웃 9장(높이 720–753, 폭 188–306)을 가로로 나열. 가로 스크롤, hover 시 확대.
- M: 393 × 338 `Component 1`, 컷아웃 높이 294–308.
- 컷아웃마다 비율이 달라 높이 기준으로 맞춘다 (폭은 이미지 원본 비율을 따름).

---

## 9. Product Detail Information

**구조 (PC)**
```
ProductDetail
├── Gallery (y 137–1026)            활성 436×889, 나머지 ~265×597, Prev/Next 54×105
├── PurchasePanel (y 1126)
│   ├── SummaryBox (1042×287, 1px border)
│   │   Name (SemiBold 24) / Price (SemiBold 24)
│   │   InfoRows: 적립금 3% · 배송비 · COLOR(스와치 17) · SIZE(M, L)   — label x 102, value x 192
│   ├── SelectedItemBox (758×210, 1px border)
│   │   상품명+옵션 / 가격 / QuantityStepper / 삭제(X) / TOTAL + 합계 (Bold 20)
│   └── Buttons  BUY IT NOW (primary) | CART (secondary)   각 378×78
├── DetailTabs (sticky anchor nav, 4개 섹션 상단에 반복)
│   상품 상세정보 | SIZE GUIDE | 상품 문의 | 구매안내       1799×61, 탭당 450
├── #product-info   Story 이미지 1345 폭 (3:4, 텍스처 1345×641), 설명 오버레이(#000 50%), 페이드, "상품 설명 더보기"
├── #size-guide     측정 일러스트 620×592 + 사이즈 표 1194×373 (CM/INCH 토글)
├── #product-inquiry 상품 Q&A (5) · Q&A 작성하기 · InquiryFilter · InquiryRow × 5
└── #purchase-guide  NOTICE 블록(#000 배경, 1496×308) + 교환/반품 조건 + 반품 주소 표
```

| 속성 | PC | M | 토큰 |
|---|---|---|---|
| 콘텐츠 폭 (Story) | 1345 | 361 | `layout.detail.content-width` |
| Q&A / 구매안내 폭 | 1496 | 361 | `layout.detail.inquiry-width` |
| SummaryBox 내부 padding | 42 (x 60→102) / 상단 31 | 11 / 12 | |
| Info label → value | 90 (x 102→192) | 41 | |
| Info 행 피치 | 32 | 18 | |
| 상품명 | SemiBold 24 | SemiBold 14, 130% | `typography.detail.product-name` |
| 가격 | SemiBold 24 | Medium 14 | `typography.detail.product-price` |
| Info label / value | SemiBold 16 / Regular 16 | Medium 10 / Regular 10 | `typography.detail.info-*` |
| 구매 버튼 높이 | 78 | 44 | `layout.detail.purchase-button-height` |
| 탭 높이 | 61 | 32 | `layout.detail.tab-height` |
| 활성 탭 | 상·좌·우 1px #000, 하단 없음, SemiBold 16 | 같음, Medium 10 | `component.navigation.detail-tab` |
| 비활성 탭 | 하단 1px #8B8B8B, Regular 16 #8B8B8B | 하단 1px #8B8B8B, Regular 10 | `color.border.tab-inactive` |
| Q&A 행 | 이름+유형 / 본문 (gap 28), 오른쪽 날짜+답변완료 배지 (gap 5) | 세로 쌓기 (gap 20) | |
| 답변완료 배지 | 87×28, #000, Medium 14 #FFF | Medium 10 | `typography.detail.badge` |
| NOTICE 블록 | 배경 #000, Bold 24 #FFF | Bold 12 | `typography.detail.notice-title` |
| 구매안내 본문 | Regular 16, 130% | Regular 8, 130% | `typography.detail.guide-body` |

**PC/M 차이**
- PC는 SummaryBox(좌)와 SelectedItemBox(우)가 나란히 놓이고, M은 위아래로 쌓인다 (361×176 → 361×110).
- PC 갤러리는 Prev/Next 버튼이 있고, M은 버튼 없이 이미지 트랙만 있다 (활성 187×380). 모바일 스와이프 여부는 미확인.
- 탭 바는 PC에서 4개 섹션 상단에 각각 반복 배치되어 있다 (각 섹션에서 해당 탭이 active). M도 같다 (Frame 11/12/13/23).

---

## 10. 보조 컴포넌트

### 10.1 Category Card (Home `04 / Shop Categories`)
```
CategoryCard  (Hover=Swap Image)
├── Image / State=Default
├── Image / State=Hover        (hover 시 교체)
└── Label   Pretendard Medium 24 / 14, -4%   ← 이미지 하단에서 15(PC) / 6(M)
```
| 카드 | PC | M | 비율 |
|---|---|---|---|
| ALL | 587 × 783 | 361 × 482 | 3:4 |
| ACC | 587 × 451 | 177 × 136 | 465:357 |
| OUTERWEAR / BOTTOMS | 465 × 357 | 177 / 176 × 136 | 465:357 |
| TOPS | 708 × 944 | 176 × 235 | 3:4 |

PC 배치: 1행 ALL(좌) + ACC(우), 2행 OUTERWEAR·BOTTOMS(좌, gap 20) + TOPS(우). M 배치: ALL 전체 폭 → OUTERWEAR | BOTTOMS → ACC | TOPS (2열, gap 8).

### 10.2 Category Link (`Category Link / Hover States`, 1124:12447)
| 상태 | 텍스트 | 기타 |
|---|---|---|
| Default | Pretendard Bold 30, #000 | 215 × 51, 배경 #FFF |
| Hover | Pretendard ExtraBold 30 | cursor: pointer |
| Selected | Helvetica Neue Heavy 30, #831A1F | 왼쪽에 6×6 사각형 2개 (세로 간격 11), 텍스트 x +16 |

M: 116 × 27–28, Selected 텍스트 Helvetica Neue Heavy 16, 마커 3×3, 텍스트 x +9. 행 피치 PC 53 / M 28–29.

### 10.3 Stockist Row (`Stockist Row / Hover States` 1113:10965, 앱용 1195:1266)
```
StockistRow (row, space-between)
├── Content (row, gap 4 → hover 2)
│   ├── StoreName  Pretendard Medium 28 / 14   → hover SemiBold, #831A1F
│   └── City       Pretendard Regular 10, #767676 (위쪽 정렬)
└── Index  "01"    Pretendard Light 24 / 14
```
| 속성 | PC | M |
|---|---|---|
| 행 크기 | 812 × 33 | 361 × 17 |
| 행 피치 | ~102 (divider 사이) | 50 |
| Divider | 1px #000, 900 폭 | 1px #000, 361 폭 |
| 레이아웃 | 좌측 에디토리얼 이미지 900×511 + 우측 목록 900 | 이미지 361×205 위, 목록 아래 |

### 10.4 Pagination
`1 2 3 4 5 >` — 현재 페이지 Pretendard Medium #000, 나머지 Regular #8F8F8F, 130%. PC 16px 피치 30 / M 14px 피치 24. Next 화살표 9×9. 페이지 그룹 이동 방식은 미확인.

### 10.5 Section Heading
S-Core Dream 6 Bold 80 / 20 (`typography.heading.section`). 정렬은 섹션마다 다르다: COLLECTIONS·STOCKISTS·AW26 = 왼쪽, Home SHOP = 오른쪽. Shop 페이지 타이틀 SHOP은 S-Core Dream 7 ExtraBold 160 / 40, 오른쪽 정렬.

### 10.6 Brand Statement Block (Home `03 / Brand Philosophy`)
코너 장식 사각형(16×16 채움/외곽선, 8×16 바) + Mono 키워드(METICULOUS DESIGN 등, Medium 22 / 10) + 오른쪽 Mono 스테이트먼트(Regular 16 / 10, 단어 사이 넓은 띄어쓰기). 1800 × 393 (M 361 × 130).

### 10.7 Campaign Banner (Home `05 / Brand Campaign`)
전체 폭 이미지 1920×770 + 상단 헤딩(S-Core Dream ExtraBold 54 / 10, 흰색) + 가운데 타이프라이터 문구(Mono Medium 22 / 10, 흰색) + 상하좌우 인덱스 숫자(SemiBold 14 / 8, accent).
