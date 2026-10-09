import type { CSSProperties } from 'react';
import { place, type PlaceProps } from '../../lib/artboard';

/**
 * Arrow icons exported from Figma. All variants are drawn pointing left; `dir="right"` mirrors them
 * (Figma: rotate 180deg + flip Y). Strokes do not scale so they stay crisp at every width.
 * ix / iy: how far the exported SVG overflows its Figma box (% of box), as in the Figma export.
 */
const VARIANTS = {
  /** Desktop season navigation, 43 x 27.12 */
  nav: { vb: '0 0 43.7123 27.8325', ix: 1.66, iy: 1.31, head: 'M14.4723 0.35613L0.712337 13.9163L14.4723 27.4764', shaft: 'M0.712338 14.1529L43.7123 14.1529' },
  /** Desktop "1ST DROP NEW IN", 27 x 17.28, stroke 2 */
  newIn: { vb: '0 0 28.4142 18.6942', ix: 5.24, iy: 4.09, head: 'M10.0542 0.707106L1.41421 9.34712L10.0542 17.9871', shaft: 'M1.41421 9.49793L28.4142 9.49792' },
  /** Mobile navigation / contact, 19 x 12.16 */
  navM: { vb: '0 0 19.7071 12.8671', ix: 3.72, iy: 2.91, head: 'M6.78711 0.353553L0.707107 6.43356L6.78711 12.5136', shaft: 'M0.707107 6.53969L19.7071 6.53969' },
  /** Mobile "1ST DROP NEW IN", 15 x 9.6 */
  newInM: { vb: '0 0 15.7071 10.3071', ix: 4.71, iy: 3.68, head: 'M5.50711 0.353553L0.707107 5.15356L5.50711 9.95355', shaft: 'M0.707107 5.23736L15.7071 5.23736' },
  /** Stockists "VIEW ALL", 21 x 13.44 */
  viewAll: { vb: '0 0 21.7071 14.1471', ix: 3.37, iy: 2.63, head: 'M7.42711 0.353553L0.707107 7.07356L7.42711 13.7936', shaft: 'M0.707066 7.19159L21.7071 7.19159' },
} as const;

type ArrowProps = PlaceProps & {
  variant: keyof typeof VARIANTS;
  dir?: 'left' | 'right';
  /** rotation applied to the arrow box (deg), e.g. 90 for the vertical Stockists link */
  rotate?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
};

export function Arrow({ variant, dir = 'left', rotate, strokeWidth = 1, color = 'currentColor', className = '', ...pos }: ArrowProps) {
  const v = VARIANTS[variant];
  const transform = [rotate ? `rotate(${rotate}deg)` : '', dir === 'right' ? 'scaleX(-1)' : ''].join(' ').trim() || undefined;
  const p = place(pos, className);
  const svgStyle: CSSProperties = { position: 'absolute', left: `-${v.ix}%`, top: `-${v.iy}%`, width: `${100 + v.ix}%`, height: `${100 + 2 * v.iy}%`, overflow: 'visible' };
  return (
    <span className={p.className} style={{ ...p.style, transform }} aria-hidden="true">
      <svg viewBox={v.vb} preserveAspectRatio="none" fill="none" style={svgStyle}>
        <path d={v.head} stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        <path d={v.shaft} stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}
