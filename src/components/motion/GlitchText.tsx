import type { CSSProperties } from 'react';
import { place, type PlaceProps } from '../../lib/artboard';
import './GlitchText.css';

/**
 * H-1 Wordmark reveal (SOURCE NOTE: "왼쪽에서 오른쪽 방향으로 치지직 거리는 효과와 함께 나타남").
 * Text is revealed left → right with horizontal noise slices; plays once on load
 * (duration --motion-glitch-duration, approved value). Glyphs and positions are unchanged.
 */
type Props = PlaceProps & { text: string; fs: readonly [number, number?]; cls?: string; delay?: number };

export function GlitchText({ text, fs, cls = '', delay = 0, ...pos }: Props) {
  const p = place(pos, `t glitch ${cls}`, {
    '--fs': fs[0],
    '--mfs': fs[1] ?? fs[0],
    '--glitch-delay': `${delay}ms`,
  } as CSSProperties);
  return (
    <p className={p.className} style={p.style} data-text={text}>
      {text}
    </p>
  );
}
