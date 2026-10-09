import type { Box, Crop } from '../lib/artboard';

/**
 * Product detail content — Figma Desktop 1124:11643 (1920 × 11639) · Mobile 1213:2342 (393 × 4704).
 * Only PAPER CRUSTACEAN PADDED SHORT BOMBER JACKET has detail content; every /product/:slug shows it (decision Q5).
 */
export const DETAIL = {
  name: 'PAPER CRUSTACEAN PADDED SHORT BOMBER JACKET',
  color: 'CHARCOAL',
  price: 870000,
  sizes: ['M', 'L'] as const,
  swatches: ['#000000', '#4e4952'],
};

export type GalleryImage = {
  id: string;
  label: string;
  src: string;
  /** inactive box (page coordinates): desktop / mobile */
  d: Box;
  m: Box;
  /** Figma CROP transform, or 'cover' for FILL */
  fit: Crop | 'cover';
};

/**
 * Gallery / Product / Initial=05 / Active=Enlarged — D 1124:12074 · M 1213:2572.
 * Boxes are the Figma positions in the initial state. 05 is only drawn enlarged in Figma; its inactive box is the
 * enlarged box divided by the enlargement ratio (889 / 597 — same ratio on mobile) around the same centre line.
 */
export const GALLERY_SCALE = 889 / 597;
/** the enlarged item also moves down: Figma 05 centre y (581.5) − inactive model centre y (501.5); mobile 268.21 − 233.97 */
export const GALLERY_DROP = { d: 80, m: 34.24 } as const;
/** horizontal centre of the active slot (05 in Figma) */
export const GALLERY_CENTER = { d: 946, m: 189.395 } as const;
export const GALLERY_INITIAL = 4; // index of 05

const g = (n: string) => `/images/product/gallery-${n}.webp`;
export const GALLERY: GalleryImage[] = [
  { id: '01', label: 'Product Front', src: g('01'), d: [-1014, 326, 270, 297], m: [-649.31, 158.88, 115.536, 127.091], fit: 'cover' },
  { id: '02', label: 'Product Back', src: g('02'), d: [-533, 326, 270, 298], m: [-443.49, 158.88, 115.536, 127.519], fit: 'cover' },
  { id: '03', label: 'Model Side Left', src: g('03-07'), d: [-116, 203, 272, 597], m: [-265.05, 106.24, 116.392, 255.465], fit: [-143.66, 0, 387.32, 100] },
  { id: '04', label: 'Model Three-Quarter Left', src: g('04-06'), d: [295, 208, 226, 589], m: [-89.18, 108.38, 96.708, 252.042], fit: [-26.22, -0.68, 463.02, 100.68] },
  {
    id: '05', label: 'Model Front', src: g('05'),
    d: [946 - 436 / GALLERY_SCALE / 2, 203, 436 / GALLERY_SCALE, 597],
    m: [189.395 - 186.57 / GALLERY_SCALE / 2, 106.24, 186.57 / GALLERY_SCALE, 255.465],
    fit: [-40.44, 0, 365.31, 101.26],
  },
  { id: '06', label: 'Model Three-Quarter Right', src: g('04-06'), d: [1350, 207, 283, 586], m: [362.27, 107.95, 121.099, 250.758], fit: [-257.11, -0.51, 367.71, 100.51] },
  { id: '07', label: 'Model Side Right', src: g('03-07'), d: [1759, 203, 265, 597], m: [537.29, 106.24, 113.397, 255.465], fit: [-267.31, 0, 399.41, 100] },
  { id: '08', label: 'Model Back', src: g('08'), d: [2146, 203, 265, 597], m: [702.89, 106.24, 113.397, 255.465], fit: [-279.5, 0, 398.4, 100] },
];

export type TabKey = 'product-info' | 'size-guide' | 'product-inquiry' | 'purchase-guide';
export const TABS: { key: TabKey; label: string }[] = [
  { key: 'product-info', label: '상품 상세정보' },
  { key: 'size-guide', label: 'SIZE GUIDE' },
  { key: 'product-inquiry', label: '상품 문의' },
  { key: 'purchase-guide', label: '구매안내' },
];

/**
 * Tab Bar / Active=… / Click=Scroll To Anchor — repeated at the top of each section.
 * d: bar top, label x per tab (absolute, Figma). m: bar top, tab widths, label offsets inside each tab.
 */
export const TAB_BARS: { active: TabKey; d: { y: number; labelX: number[] }; m: { y: number; widths: number[]; labelX: number[] } }[] = [
  { active: 'product-info', d: { y: 1663, labelX: [183, 636, 1096, 1548] }, m: { y: 872, widths: [90, 91, 90, 90], labelX: [19, 22, 27, 28] } },
  { active: 'size-guide', d: { y: 6436, labelX: [183, 635, 1096, 1548] }, m: { y: 2211, widths: [91, 90, 90, 90], labelX: [20, 21, 27, 28] } },
  { active: 'product-inquiry', d: { y: 8177, labelX: [183, 635, 1096, 1548] }, m: { y: 2877, widths: [91, 90, 90, 90], labelX: [20, 21, 27, 28] } },
  { active: 'purchase-guide', d: { y: 9604, labelX: [183, 635, 1096, 1548] }, m: { y: 3893, widths: [91, 90, 90, 90], labelX: [20, 21, 27, 28] } },
];

export type Inquiry = {
  author: string;
  category: '사이즈 문의' | '배송 문의';
  date: string;
  /** null = private (비밀글) */
  body: string | null;
  /** body with the mobile frame's hard line breaks */
  bodyM?: string;
  d: number;
  m: number;
};

/** Inquiry Row 01–05 (all answered) — tops in page coordinates */
export const INQUIRIES: Inquiry[] = [
  {
    author: 'kjh******', category: '사이즈 문의', date: '2026.10.4', d: 8556, m: 3048,
    body: '키 168cm, 몸무게 51kg 정도인데 사이즈  문의드립니다.\n평소 슬림하게 입는 편인데 해당 제품은 어떤 사이즈를 선택하는 게 좋을까요? 너무 타이트하지 않으면서 자연스럽게 맞는 사이즈로 추천 부탁드립니다.',
    bodyM: '키 168cm, 몸무게 51kg 정도인데 사이즈  문의드립니다.\n평소 슬림하게 입는 편인데 해당 제품은 어떤 사이즈를 선택하는 게 좋을까요? \n너무 타이트하지 않으면서 자연스럽게 맞는 사이즈로  추천 부탁드립니다.',
  },
  { author: 'kol******', category: '사이즈 문의', date: '2026.9.27', body: null, d: 8733, m: 3224 },
  {
    author: 'oll******', category: '배송 문의', date: '2026.9.16', d: 8896, m: 3368,
    body: '안녕하세요.  현재 주문하면 출고까지 어느 정도 소요되는지 예상 수령일은 언제쯤인지 확인 부탁드립니다. 감사합니다!',
    bodyM: '안녕하세요.  현재 주문하면 출고까지 어느 정도 소요되는지 예상 수령일은 \n언제쯤인지 확인 부탁드립니다. 감사합니다!',
  },
  { author: 'zzi******', category: '사이즈 문의', date: '2026.9.4', body: null, d: 9057, m: 3528 },
  { author: 'xlx******', category: '사이즈 문의', date: '2026.9.2', body: null, d: 9220, m: 3672 },
];

export const INQUIRY_FILTERS = ['ALL', '상품 문의', '재입고 문의', '사이즈 문의', '배송 문의', '기타'];

/** Table / Size Measurements (cm) */
export const SIZE_COLUMNS = ['SHOULDER', 'CHEST', 'WAIST', 'SLEEVE LENGTH', 'LENGTH'];
export const SIZE_ROWS: { size: 'M' | 'L'; values: string[] }[] = [
  { size: 'M', values: ['53', '55.5', '41.5', '67', '54'] },
  { size: 'L', values: ['55.5', '58', '43.5', '68', '55.5'] },
];

export const RETURN_CONDITIONS = [
  '우체국택배 사이트에서 직접 반품 접수 및 발송을 해야합니다.',
  '상품은 구성품 모두에 사용감, 오염, 등이 없이 새상품 그대로여야 합니다. ',
  '제품에 이상이 있을 경우, 반송 비용은 고객 부담으로 상품이 다시 반송됩니다.',
  '반품상품 입고확인 후 문제가 없다면 배송비를 제외한 금액이 환불됩니다.',
];
export const STYLIST_POLICY = [
  '스타일리스트 팀의 경우, 상품 수령일로부터 3일 이내에 해당 상품이 반품 입고처에 도착해야 합니다.',
  '발송 전, 교환 또는 반품 예정 상품명 및 수량을 아래 연락처로 사전 전달해 주세요.',
  '사전 접수 없이 발송된 상품의 경우, 교환 및 반품 처리가 지연될 수 있습니다.',
];
