import type { CSSProperties, ElementType, KeyboardEvent, ReactNode } from 'react';

/**
 * Artboard primitives.
 * Coordinates are Figma page coordinates in design px: [x, y, width?, height?].
 * `d` = Desktop frame (1920), `m` = Mobile frame (393). Omitting one hides the element there.
 * Scaling is done in CSS with --u (see styles/tokens.css, styles/base.css).
 */
export type Box = readonly [x: number, y: number, w?: number, h?: number];
export type Anchor = 'l' | 'c' | 'r';

const anchorValue = (a?: Anchor) => (a === 'r' ? '-100%' : a === 'c' ? '-50%' : undefined);

export interface PlaceProps {
  d?: Box;
  m?: Box;
  /** horizontal anchor on desktop (Figma -translate-x) */
  ax?: Anchor;
  /** horizontal anchor on mobile; defaults to `ax` */
  max?: Anchor;
}

export function place({ d, m, ax, max }: PlaceProps, className = '', style: CSSProperties = {}) {
  const vars: Record<string, string | number | undefined> = {
    '--x': d?.[0], '--y': d?.[1], '--w': d?.[2], '--h': d?.[3],
    '--mx': m?.[0], '--my': m?.[1], '--mw': m?.[2], '--mh': m?.[3],
    '--ax': anchorValue(ax), '--max': anchorValue(max ?? ax),
  };
  for (const k of Object.keys(vars)) if (vars[k] === undefined) delete vars[k];
  const cls = ['abs', !d && 'hide-d', !m && 'hide-m', className].filter(Boolean).join(' ');
  return { className: cls, style: { ...vars, ...style } as CSSProperties };
}

type SectionProps = {
  /** [top, height] of the slice in the Desktop frame */
  d: readonly [number, number];
  /** [top, height] of the slice in the Mobile frame */
  m: readonly [number, number];
  as?: ElementType;
  bandClassName?: string;
  className?: string;
  label?: string;
  /** anchor id (menu / hash navigation) */
  id?: string;
  /** desktop: the slice spans the whole browser width instead of the centred 1920 frame (Header, Hero) */
  full?: boolean;
  children: ReactNode;
};

export function Section({ d, m, as: Tag = 'section', bandClassName = '', className = '', label, id, full, children }: SectionProps) {
  const style = { '--st': d[0], '--sh': d[1], '--mst': m[0], '--msh': m[1] } as CSSProperties;
  return (
    <Tag id={id} className={`band ${bandClassName}`.trim()} aria-label={label}>
      <div className={`section${full ? ' section--full' : ''} ${className}`.trim()} style={style}>
        {children}
      </div>
    </Tag>
  );
}

type TextProps = PlaceProps & {
  /** font size in design px: [desktop, mobile] */
  fs: readonly [number, number?];
  cls?: string;
  as?: ElementType;
  style?: CSSProperties;
  children: ReactNode;
};

export function T({ fs, cls = '', as: Tag = 'p', style, children, ...pos }: TextProps) {
  const p = place(pos, `t ${cls}`, { '--fs': fs[0], '--mfs': fs[1] ?? fs[0], ...style } as CSSProperties);
  return <Tag className={p.className} style={p.style}>{children}</Tag>;
}

/** Figma image crop: img left/top/width/height as % of the frame */
export type Crop = readonly [left: number, top: number, width: number, height: number];

type PicProps = PlaceProps & {
  src: string;
  alt?: string;
  /** 'fill' = Figma CROP without transform (stretched), 'cover' = Figma FILL, or explicit crop */
  fit: 'fill' | 'cover' | Crop;
  /** mobile crop when it differs from desktop */
  mfit?: Crop;
  flipX?: boolean;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  /** makes the image a button (Enter / Space too); `alt` is then its accessible name */
  onClick?: () => void;
};

export function Pic({ src, alt = '', fit, mfit, flipX, className = '', imgClassName, loading = 'lazy', onClick, ...pos }: PicProps) {
  const crop = typeof fit === 'string' ? undefined : fit;
  const fitCls = typeof fit === 'string' ? `fit-${fit}` : 'crop';
  const style: Record<string, string> = {};
  if (crop) Object.assign(style, cropVars('', crop));
  if (mfit) Object.assign(style, cropVars('m', mfit));
  const p = place(pos, `media ${fitCls} ${flipX ? 'flip-x' : ''} ${className}`, style as CSSProperties);
  return (
    <div className={p.className} style={p.style}
      {...(onClick ? {
        role: 'button', tabIndex: 0, 'aria-label': alt || undefined, onClick,
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } },
      } : {})}>
      <img src={src} alt={onClick ? '' : alt} loading={loading} decoding="async" className={imgClassName} draggable={false} />
    </div>
  );
}

function cropVars(prefix: string, [l, t, w, h]: Crop) {
  return { [`--${prefix}cl`]: `${l}%`, [`--${prefix}ct`]: `${t}%`, [`--${prefix}cw`]: `${w}%`, [`--${prefix}ch`]: `${h}%` };
}

/** Static SVG asset placed in a Figma box; `overflow` = [y%, x%] the export extends past the box (stroke). */
export function Glyph({ src, overflow = [0, 0], className = '', ...pos }: PlaceProps & { src: string; overflow?: readonly [number, number]; className?: string }) {
  const p = place(pos, `glyph ${className}`);
  const [oy, ox] = overflow;
  return (
    <span className={p.className} style={p.style} aria-hidden="true">
      <img src={src} alt="" draggable={false} style={{ top: `-${oy}%`, left: `-${ox}%`, width: `${100 + 2 * ox}%`, height: `${100 + 2 * oy}%` }} />
    </span>
  );
}

/** Empty positioned box (lines, frames, hit areas) */
export function Frame({ className = '', style, children, as: Tag = 'div', ...pos }: PlaceProps & { className?: string; style?: CSSProperties; children?: ReactNode; as?: ElementType }) {
  const p = place(pos, className, style);
  return <Tag className={p.className} style={p.style}>{children}</Tag>;
}
