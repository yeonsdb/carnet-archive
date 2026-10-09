import type { Crop } from '../lib/artboard';

/**
 * Products — SHOP Desktop 1124:11259 (cards 01–10) · Mobile 1195:1732 (cards 01–06).
 * Image layers are expressed relative to the card image area (Desktop card = 587 × 783):
 *   box = [x, y, w, h] in design px inside the card; crop = Figma CROP imageTransform in %.
 * Mobile cards are the same composition scaled (361 / 587), so one geometry serves both layouts.
 */

export type CardLayer = { box: readonly [number, number, number, number]; crop?: Crop };

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** mobile name with the forced line break used in the mobile frame */
  nameMobile?: string;
  price: number;
  category: 'outerwear';
  colors: string[];
  /** Image / State=Default / Model */
  model: CardLayer;
  /** Image / State=Hover / Cutout (FILL → cover) */
  cutout: CardLayer;
  /** shown in the narrow (mobile) layout — the mobile frame lists cards 01–06 only */
  inMobile: boolean;
};

export const CARD_W = 587;
export const CARD_H = 783;
/** Background / Product Image — same image and crop on every card */
export const CARD_BG_CROP: Crop = [-56.58, 0, 432.13, 183.18];

export const PRODUCTS: Product[] = [
  { id: '01', slug: 'rider-denim-jacket', name: 'RIDER DENIM JACKET', price: 560000, category: 'outerwear', colors: ['#000000'],
    model: { box: [33, 6, 543, 777], crop: [-158.75, 0, 277.17, 109.52] }, cutout: { box: [60, 111, 455, 562] }, inMobile: true },
  { id: '02', slug: 'trace-prism-denim-jacket', name: 'TRACE PRISM DENIM JACKET', price: 1280000, category: 'outerwear', colors: ['#f4f4f4'],
    model: { box: [33, 0, 522, 783], crop: [-21.26, -2.55, 301.46, 113.67] },
    // Hover 1124:11517 carries a Figma image adjustment (contrast +1) that cannot be exported while the layer is hidden;
    // the layer's original image is used as-is until the adjusted asset is supplied (no CSS approximation).
    cutout: { box: [68, 141, 451, 501] }, inMobile: true },
  { id: '03', slug: 'ro-binary-star-mass-cropped-jacket', name: 'R/O BINARY STAR MASS CROPPED JACKET', price: 1280000, category: 'outerwear', colors: ['#000000'],
    model: { box: [48, 6, 495, 777], crop: [-194.08, -13.31, 324.64, 116.91] }, cutout: { box: [84, 142, 420, 557] }, inMobile: true },
  { id: '04', slug: 'paper-crustacean-padded-short-bomber-jacket', name: 'PAPER CRUSTACEAN PADDED SHORT BOMBER JACKET', price: 870000, category: 'outerwear', colors: ['#000000', '#4e4952'],
    model: { box: [66, 0, 470, 783], crop: [-88.94, -11.88, 562.44, 190.8] }, cutout: { box: [69, 158, 449, 517] }, inMobile: true },
  { id: '05', slug: 'hand-coated-mass-vest', name: 'HAND COATED MASS VEST (*PATINA SERIES)', nameMobile: 'HAND COATED MASS VEST\n(*PATINA SERIES)', price: 930000, category: 'outerwear', colors: ['#f4f4f4'],
    model: { box: [41, 0, 465, 783], crop: [-176.86, -1.28, 301.81, 101.28] },
    // Hover 1124:11526 carries Figma image adjustments (exposure +0.15, saturation −0.77, temperature −0.38, tint +0.37)
    // that cannot be exported while hidden; original image used as-is until the adjusted asset is supplied.
    cutout: { box: [110, 155, 362, 441] }, inMobile: true },
  { id: '06', slug: 'excavated-rider-denim-jacket', name: 'EXCAVATED RIDER DENIM JACKET', price: 970000, category: 'outerwear', colors: ['#000000'],
    model: { box: [8, 0, 547, 783], crop: [-20.11, -2.04, 283.82, 112.13] }, cutout: { box: [80, 155, 427, 515] }, inMobile: true },
  { id: '07', slug: 'tar-submerged-nylon-trucker-jacket', name: 'TAR SUBMERGED NYLON TRUCKER JACKET', price: 1280000, category: 'outerwear', colors: ['#000000'],
    model: { box: [3, 0, 514, 783], crop: [-163.66, -5.36, 283.89, 105.36] }, cutout: { box: [72, 124, 438, 535] }, inMobile: false },
  { id: '08', slug: 'ro-crustacean-croped-zip-up-hoodie', name: 'R/O CRUSTACEAN CROPED ZIP-UP HOODIE', price: 580000, category: 'outerwear', colors: ['#4e4952'],
    model: { box: [31, 12, 522, 771], crop: [-143.33, 0, 260.89, 100] }, cutout: { box: [88, 113, 411, 589] }, inMobile: false },
  { id: '09', slug: 'coated-slim-mass-rider-jacket', name: 'COATED SLIM MASS RIDER JACKET', price: 980000, category: 'outerwear', colors: ['#000000'],
    model: { box: [32, 12, 485, 771], crop: [-25.83, -8.81, 305.59, 108.81] }, cutout: { box: [72, 130, 443, 524] }, inMobile: false },
  { id: '10', slug: 'nail-faux-leather-jacket', name: 'NAIL FAUX LEATHER JACKET', price: 1270000, category: 'outerwear', colors: ['#000000', '#4a6058'],
    model: { box: [81, 0, 506, 783], crop: [-193.88, -9.45, 324.26, 118.57] }, cutout: { box: [83, 106, 421, 571] }, inMobile: false },
];

export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`;

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
