import type { CSSProperties, ReactNode } from 'react';
import { place, type Box } from '../../lib/artboard';
import './GlitchText.css';

/**
 * H-1 Wordmark reveal (SOURCE NOTE: "왼쪽에서 오른쪽 방향으로 치지직 거리는 효과와 함께 나타남").
 * The whole wordmark group (CARNET, separator line, ARCHIVE — Figma "Wordmark / Reveal=Left To Right Glitch")
 * is revealed as ONE unit from left to right with horizontal noise slices; plays once on load
 * (duration --motion-glitch-duration, approved value). Glyphs and positions are unchanged.
 *
 * `d` / `m` = the group's box (page coordinates). Children keep their own page coordinates:
 * the inner layer re-bases them on the box (--st/--ox), so they render exactly where they were.
 */
type Props = { d: Box; m: Box; children: ReactNode };

export function GlitchGroup({ d, m, children }: Props) {
  const box = place({ d, m }, 'glitch-group');
  const rebase = { '--st': d[1], '--ox': d[0], '--mst': m[1], '--mox': m[0] } as CSSProperties;
  return (
    <div className={box.className} style={box.style}>
      <div className="glitch-group__layer glitch-group__main" style={rebase}>
        {children}
        {/* noise slices: copies of the same group inside the revealed area, visible only during the reveal */}
        <div className="glitch-group__layer glitch-group__slice-a" aria-hidden="true">{children}</div>
        <div className="glitch-group__layer glitch-group__slice-b" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
