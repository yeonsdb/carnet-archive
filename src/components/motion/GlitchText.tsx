import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { place, type Box } from '../../lib/artboard';
import './GlitchText.css';

/**
 * H-1 Wordmark reveal — block-dither decode (motion reference: Jitter template "Dithering Effect").
 * The whole wordmark group (CARNET, separator line, ARCHIVE — Figma "Wordmark / Reveal=Left To Right Glitch")
 * appears as small blocks laid over the letter shapes only; each block flickers (solid / half-tone) and then resolves
 * into the real glyph pixels. Blocks start left → right with random scatter. Plays once on load
 * (total time --motion-glitch-duration). During the reveal a canvas draws the group; afterwards the real DOM text is
 * shown, so the final state is exactly the Figma layout.
 *
 * `d` / `m` = the group's box (page coordinates). Children keep their own page coordinates:
 * the inner layer re-bases them on the box (--st/--ox), so they render exactly where they were.
 */
type Props = { d: Box; m: Box; children: ReactNode };

type Cell = { x: number; y: number; w: number; h: number; start: number; settle: number; seed: number };

const rand = (i: number) => {
  // deterministic per-cell pseudo random (stable between frames)
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export function GlitchGroup({ d, m, children }: Props) {
  const box = place({ d, m }, 'glitch-group');
  const rebase = { '--st': d[1], '--ox': d[0], '--mst': m[1], '--mox': m[0] } as CSSProperties;
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current, layer = layerRef.current, canvas = canvasRef.current;
    if (!root || !layer || !canvas) return;
    let raf = 0;
    let cancelled = false;
    const finish = () => { root.classList.add('is-done'); };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const rect = root.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      if (!W || !H) { finish(); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // 1. render the group (as laid out in the DOM) into an offscreen canvas
      const art = document.createElement('canvas');
      art.width = Math.round(W * dpr); art.height = Math.round(H * dpr);
      const actx = art.getContext('2d')!;
      actx.scale(dpr, dpr);
      let fontPx = 0, color = '#fff';
      for (const el of Array.from(layer.children) as HTMLElement[]) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const x = r.left - rect.left, y = r.top - rect.top;
        if (el.textContent) {
          actx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          actx.fillStyle = color = cs.color;
          actx.textBaseline = 'alphabetic';
          const mt = actx.measureText(el.textContent);
          actx.fillText(el.textContent, x, y + mt.fontBoundingBoxAscent);
          fontPx = Math.max(fontPx, parseFloat(cs.fontSize));
        } else {
          // separator: a box with a top border
          actx.fillStyle = cs.borderTopColor;
          actx.fillRect(x, y, r.width, parseFloat(cs.borderTopWidth) || 1);
        }
      }

      // 2. split into square cells and keep only cells that contain ink (block = ink bounds inside the cell)
      const size = Math.max(3, Math.round(fontPx * 0.09)); // block ≈ 9% of the letter size (feedback: smaller than 16%)
      const px = actx.getImageData(0, 0, art.width, art.height).data;
      const D = parseFloat(getComputedStyle(root).getPropertyValue('--motion-glitch-duration')) || 1400;
      const cells: Cell[] = [];
      let i = 0;
      for (let cy = 0; cy < H; cy += size) {
        for (let cx = 0; cx < W; cx += size) {
          let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
          const sx = Math.floor(cx * dpr), sy = Math.floor(cy * dpr);
          const ex = Math.min(art.width, Math.floor((cx + size) * dpr)), ey = Math.min(art.height, Math.floor((cy + size) * dpr));
          for (let yy = sy; yy < ey; yy += 2) for (let xx = sx; xx < ex; xx += 2) {
            if (px[(yy * art.width + xx) * 4 + 3] > 40) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
          }
          if (x1 < 0) continue;
          i++;
          const t = cx / W; // left → right
          const start = (t * 0.55 + rand(i) * 0.2) * D;
          cells.push({
            x: x0 / dpr, y: y0 / dpr, w: Math.max(2, (x1 - x0 + 2) / dpr), h: Math.max(2, (y1 - y0 + 2) / dpr),
            start, settle: start + (0.12 + rand(i + 999) * 0.18) * D, seed: i,
          });
        }
      }

      // 3. animate: hidden → flickering block (solid / half-tone, sometimes nudged one cell) → real glyph pixels
      canvas.width = art.width; canvas.height = art.height;
      const ctx = canvas.getContext('2d')!;
      root.classList.add('is-playing');
      const t0 = performance.now();
      const frame = (now: number) => {
        const t = now - t0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = color;
        let pending = 0;
        for (const c of cells) {
          if (t < c.start) { pending++; continue; }
          if (t >= c.settle) {
            ctx.drawImage(art, c.x * dpr, c.y * dpr, c.w * dpr, c.h * dpr, c.x, c.y, c.w, c.h);
            continue;
          }
          pending++;
          const step = Math.floor(t / 70); // flicker rate
          const r = rand(c.seed * 7 + step);
          if (r < 0.15) continue; // blink off
          ctx.globalAlpha = r < 0.45 ? 0.5 : 1;
          const nudge = r > 0.9 ? size * (rand(c.seed + step) > 0.5 ? 1 : -1) : 0;
          ctx.fillRect(c.x + nudge, c.y, c.w, c.h);
          ctx.globalAlpha = 1;
        }
        if (pending > 0 && !cancelled) raf = requestAnimationFrame(frame);
        else { root.classList.remove('is-playing'); finish(); }
      };
      raf = requestAnimationFrame(frame);
    });

    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={rootRef} className={`${box.className} glitch-group--dither`} style={box.style}>
      <div ref={layerRef} className="glitch-group__layer glitch-group__main" style={rebase}>
        {children}
      </div>
      <canvas ref={canvasRef} className="glitch-group__canvas" aria-hidden="true" />
    </div>
  );
}
