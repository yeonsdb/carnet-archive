# 보정본 에셋 요청 목록

Figma 레이어에 이미지 보정(노출·대비·채도·색온도·틴트)이 걸려 있지만, 아래 이유로 보정 결과를 그대로 내보낼 수 없는 이미지입니다.

- 숨김 레이어(Hover 이미지)는 Figma 내보내기가 빈 이미지를 반환합니다.
- 보이는 레이어도 Figma 내보내기가 투명 영역을 흰색으로 채웁니다. 누끼 이미지라 그대로 쓸 수 없습니다.

원칙: CSS 필터나 측정값으로 근사하지 않습니다. 보정본이 오기 전까지는 **해당 레이어의 원본 이미지를 보정 없이** 사용합니다.

## 요청 이미지

| # | 페이지 | 노드 ID (Desktop / Mobile) | 레이어 | Figma 보정 | 현재 사용 파일 |
|---|---|---|---|---|---|
| 1 | SHOP | `1124:11517` / `1213:2079`, `1213:2096` | Product Card / 02 / TRACE PRISM DENIM JACKET › Image / State=Hover / Cutout (숨김) | 대비 +1 | `public/images/shop/cutout-02.webp` |
| 2 | SHOP | `1124:11526` / `1213:2273` | Product Card / 05 / HAND COATED MASS VEST › Image / State=Hover / Cutout (숨김) | 노출 +0.15, 채도 −0.77, 색온도 −0.38, 틴트 +0.37 | `public/images/shop/cutout-05.webp` |
| 3 | SHOP | `1124:11338` | Product Card / 07 / TAR SUBMERGED NYLON TRUCKER JACKET › Image / State=Default / Model | 노출 +0.06 | `public/images/shop/model-07.webp` |
| 4 | SHOP | `1124:11333` | Product Card / 08 / R/O CRUSTACEAN CROPED ZIP-UP HOODIE › Image / State=Default / Model | 노출 +0.06 | `public/images/shop/model-08.webp` |
| 5 | SHOP | `1124:11332` | Product Card / 09 / COATED SLIM MASS RIDER JACKET › Image / State=Default / Model | 노출 +0.12 | `public/images/shop/model-09.webp` |
| 6 | SHOP | `1124:11340` | Product Card / 10 / NAIL FAUX LEATHER JACKET › Image / State=Default / Model | 노출 +0.08 | `public/images/shop/model-10.webp` |
| 7 | HOME | `1117:11165` / `1195:1082` | Gallery / Current Collection › Image / Look 04 / Model | 노출 +0.19 | `public/images/home/look-04.webp` |
| 8 | HOME | `1117:11162` / `1195:1079` | Gallery / Current Collection › Image / Look 07 / Model | 노출 +0.27, 채도 −0.19, 색온도 +0.1 | `public/images/home/look-07.webp` |

## 반영 현황 (2026-10-10)

8개 모두 보정본을 받아 반영했습니다. 받은 파일은 **슬롯 크기로 이미 잘린 1배 내보내기**(SHOP 카드 587 × 783, HOME 룩 박스 크기)라서 잘림 비율(크롭) 대신 슬롯 전체를 채우도록 배치했습니다. 원본 파일은 그대로 보관합니다.

| # | 반영 파일 (assets-src/images) | Figma 1920 렌더와 평균 차이 (0–255) |
|---|---|---|
| 1 | `shop/cutout-02-adjusted.png` | (숨김 레이어 — 비교 불가, hover 확인) |
| 2 | `shop/cutout-05-adjusted.png` | (숨김 레이어 — 비교 불가, hover 확인) |
| 3 | `shop/model-07-adjusted.png` | 2.5 |
| 4 | `shop/model-08-adjusted.png` | 3.1 |
| 5 | `shop/model-09-adjusted.png` | 1.9 |
| 6 | `shop/model-10-adjusted.png` | 2.0 |
| 7 | `home/look-04-adjusted.png` | 3.1 |
| 8 | `home/look-07-adjusted.png` | 4.2 |

- 해상도: 1배 크기라 고해상도(레티나) 화면에서는 기존 원본(2688 × 1520)보다 약간 덜 선명할 수 있습니다. 2배로 내보낸 파일을 받으면 같은 이름으로 교체만 하면 됩니다.
- 함께 받은 04 PAPER CRUSTACEAN 모델 이미지는 Figma 보정이 없는 레이어이고 현재 원본과 사실상 같아(평균 밝기 차 1.7) 해상도가 높은 기존 원본을 유지했습니다.

## 전달 방법 (둘 중 하나)

1. **Figma에서 보정을 이미지에 적용**: 보정이 적용된 원본 이미지를 투명 배경 PNG로 다시 넣어 주세요. 레이어의 이미지 해시가 바뀌므로 그 원본을 받아 교체합니다. 잘림 위치는 유지됩니다.
2. **파일로 전달**: 보정이 적용된 **원본 크기 전체 이미지**(잘리기 전)를 투명 배경 PNG로 주시면 같은 위치에 교체합니다.

## 교체 후 작업

보정본을 받으면 `assets-src/images/<page>/` 원본을 교체하고 `npm run images`로 WebP를 다시 만듭니다. 코드는 바꾸지 않습니다.
