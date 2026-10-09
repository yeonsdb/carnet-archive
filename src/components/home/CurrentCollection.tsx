import { Link } from 'react-router-dom';
import { Frame, Pic, Section, T, place } from '../../lib/artboard';
import { Arrow } from '../ui/Arrow';
import { HorizontalGallery, type GalleryItem } from './HorizontalGallery';
import './CurrentCollection.css';

/**
 * Image / Look 00–08 — positions from Desktop 1124:12550 and Mobile 1195:1092 (page coordinates).
 * Crops come from each fill's Figma imageTransform [a, tx, d, ty]: width 100/a %, left −tx/a %, height 100/d %, top −ty/d %.
 * Looks 04 / 07 carry Figma image adjustments (exposure etc.). Figma exports flatten transparency, so the adjustment
 * was measured against the Figma render and baked into the transparent original (scripts/bake-adjust.mjs → *-adj).
 */
const LOOKS: GalleryItem[] = [
  { id: '00', d: [-365.8, 1408, 188.3, 719.6], m: [-343, 516, 83, 294], fit: [-494.67, 0, 675.58, 100], mfit: [-451.68, 0, 626.75, 100] },
  { id: '01', d: [-86.1, 1470, 257.0, 725.8], m: [-223, 534, 105, 297], fit: [-363.8, 0, 500.06, 100] },
  { id: '02', d: [215.3, 1401, 237.2, 726.3], m: [-99, 508, 97, 298], fit: [-398.21, 0, 540.86, 100] },
  { id: '03', d: [504.0, 1470, 246.3, 726.2], m: [19, 534, 101, 297], fit: [-218.62, -2.12, 543.52, 104.24], flipX: true },
  { id: '04', d: [793.7, 1401, 260.7, 726.0], m: [137, 508, 107, 298], fit: [-192.59, -1.12, 498.16, 101.12], src: 'look-04-adj' },
  { id: '05', d: [1082.4, 1470, 281.6, 725.5], m: [256, 534, 115, 297], fit: [-186.61, 0, 455.59, 100], flipX: true },
  { id: '06', d: [1453.6, 1401, 222.8, 726.4], m: [407, 508, 92, 298], fit: [-408.73, 0, 577.43, 100] },
  { id: '07', d: [1693.5, 1470, 267.0, 725.9], m: [506, 534, 109, 297], fit: [-33.56, 0, 481.12, 100], src: 'look-07-adj' },
  { id: '08', d: [2009.5, 1386, 305.8, 752.8], m: [635, 493, 125, 308], fit: [-175.03, 0, 435.71, 100] },
];

/** Gallery window (page coordinates); items span x -365.8 → 2315.3 (desktop) and -343 → 760 (mobile). */
const GALLERY_D = { box: [0, 1313, 1920, 948], offset: 365.8, width: 2681.1 } as const;
const GALLERY_M = { box: [0, 493, 393, 338], offset: 343, width: 1103 } as const;

/** 02 / Current Collection — Desktop 1228:759 · Mobile 1228:760 */
export function CurrentCollection() {
  return (
    <Section d={[1080, 1292]} m={[399, 532]} label="AW26 컬렉션">
      {/* Decoration / Current Collection / Texture — 2x Figma render (rotation, flip, 40% opacity and colour adjustment baked in) */}
      <Pic src="/images/home/r-collection-texture.webp" fit="fill" d={[577, 850, 1661.73, 1445.3]} m={[40, 386, 437.02, 380.1]} className="cc__texture" />

      <T as="h2" fs={[80, 20]} cls="f-display w600" d={[60, 1180]} m={[16, 431]}>AW26:</T>
      <T fs={[40, 14]} cls="f-display w500 tr-3" d={[60, 1276]} m={[16, 455]}>[UNEARTH: FILE-2711]</T>

      {/* Button / Shop New In → SHOP */}
      <Frame className="cc__new-in-border" d={[1601, 1238, 259, 44]} m={[235, 859, 142, 34]} />
      <T fs={[20, 12]} cls="f-sans w500 tr-3 c-accent" d={[1629, 1248]} m={[248, 869]}>1ST DROP NEW IN</T>
      <Arrow variant="newIn" dir="right" strokeWidth={2} color="var(--color-accent-brand)" d={[1804, 1251, 27, 17.28]} />
      <Arrow variant="newInM" dir="right" color="var(--color-accent-brand)" m={[349, 871, 15, 9.6]} />
      <Link to="/shop" aria-label="1ST DROP NEW IN — SHOP" {...place({ d: [1601, 1238, 259, 44], m: [235, 859, 142, 34] }, 'cc__new-in-link')} />

      <HorizontalGallery
        label="AW26 착장"
        items={LOOKS}
        src={(it) => `/images/home/${it.src ?? `look-${it.id}`}.webp`}
        d={GALLERY_D}
        m={GALLERY_M}
      />
    </Section>
  );
}
