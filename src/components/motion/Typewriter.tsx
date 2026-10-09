import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { place, type PlaceProps } from '../../lib/artboard';
import './Typewriter.css';

const TYPE_MS = 40; // approved proposal (typing speed not specified)
const CURSOR_DELAY_MS = 1000; // Figma: Cursor / After Typing Delay=1000ms
const CURSOR_BLINK_MS = 2000; // Figma: Blink Interval=2000ms

type Props = PlaceProps & {
  text: string;
  fs: readonly [number, number?];
  cls?: string;
  /** cursor box in page coordinates [x, y, w, h] (desktop) */
  cursor: readonly [number, number, number, number];
};

/**
 * S-4 Brand Statement / Scroll=Typewriter (1124:11488).
 * Starts when scrolled into view, types the exact string (line breaks kept) one character at a time,
 * then shows the black cursor after 1000 ms and toggles it every 2000 ms. Plays once.
 */
export function Typewriter({ text, fs, cls = '', cursor, ...pos }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(reduce ? text.length : 0);
  const [started, setStarted] = useState(reduce);
  const [cursorOn, setCursorOn] = useState(false);

  useEffect(() => {
    if (started || !ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
    return () => clearTimeout(t);
  }, [started, count, text.length]);

  const done = count >= text.length;
  useEffect(() => {
    if (!done) return;
    let interval: number | undefined;
    const delay = window.setTimeout(() => {
      setCursorOn(true);
      interval = window.setInterval(() => setCursorOn((v) => !v), CURSOR_BLINK_MS);
    }, CURSOR_DELAY_MS);
    return () => { clearTimeout(delay); if (interval) clearInterval(interval); };
  }, [done]);

  const p = place(pos, `t typewriter ${cls}`, { '--fs': fs[0], '--mfs': fs[1] ?? fs[0] } as CSSProperties);
  const c = place({ d: cursor }, 'typewriter__cursor', { visibility: cursorOn ? 'visible' : 'hidden' });
  return (
    <>
      <p ref={ref} className={p.className} style={p.style} aria-label={text.replace(/\s+/g, ' ')}>
        <span aria-hidden="true">{text.slice(0, count)}</span>
      </p>
      <span className={c.className} style={c.style} aria-hidden="true" />
    </>
  );
}
