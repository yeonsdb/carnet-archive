import type { CSSProperties, ReactNode } from 'react';
import { place, type PlaceProps } from '../../lib/artboard';
import './Rotated.css';

type Inner = readonly [w: number, h: number, deg: number];

type RotatedBoxProps = PlaceProps & {
  /** inner (unrotated) size and rotation on desktop / mobile, as exported by Figma */
  inner?: Inner;
  minner?: Inner;
  /** extra transform after the rotation (e.g. 'scaleY(-1)') */
  extra?: string;
  className?: string;
  children: ReactNode;
};

/** Figma rotated layer: outer bounding box (centred flex) + inner rotated content. */
export function RotatedBox({ inner, minner, extra = '', className = '', children, ...pos }: RotatedBoxProps) {
  const vars: Record<string, string | number> = extra ? { '--rx': extra } : {};
  if (inner) Object.assign(vars, { '--iw': inner[0], '--ih': inner[1], '--deg': `${inner[2]}deg` });
  if (minner) Object.assign(vars, { '--miw': minner[0], '--mih': minner[1], '--mdeg': `${minner[2]}deg` });
  const p = place(pos, `rot ${className}`, vars as CSSProperties);
  return (
    <div className={p.className} style={p.style}>
      <div className="rot__inner">{children}</div>
    </div>
  );
}

type RotatedTextProps = PlaceProps & {
  fs: readonly [number, number?];
  /** rotation in degrees on desktop / mobile */
  deg: readonly [number, number?];
  cls?: string;
  children: ReactNode;
};

/** Vertical text label (Figma text rotated ±90deg inside its bounding box). */
export function RotatedText({ fs, deg, cls = '', children, ...pos }: RotatedTextProps) {
  const p = place(pos, 'rot rot--text', {
    '--deg': `${deg[0]}deg`, '--mdeg': `${deg[1] ?? deg[0]}deg`, '--fs': fs[0], '--mfs': fs[1] ?? fs[0],
  } as CSSProperties);
  return (
    <div className={p.className} style={p.style}>
      <p className={`t rot__text ${cls}`}>{children}</p>
    </div>
  );
}
