import { useEffect, useRef, useState } from 'react';
import { Frame, Glyph, Section, T } from '../../lib/artboard';
import './BrandPhilosophy.css';

/**
 * 03 / Brand Philosophy — Desktop 1113:10513 · Mobile 1213:3358.
 * Desktop statement lines keep their individual Figma positions; mobile is one right-aligned block.
 * Copy is kept exactly as designed (including "REVEEALS").
 */
const LINES: [string, number, number][] = [
  ['THOUGH  IT  MAY  APPEAR  UNFINISHED  AT', 1172, 2463],
  ['FIRST  GLANCE,', 1703, 2463],
  ['THE  CLOSER  YOU  LOOK,', 1230, 2485],
  ['THE  MORE  ITS  REFINEMENT REVEEALS', 1514, 2485],
  ['ITSELF.', 1243, 2507],
  ['THIS SUBTLE TENSION AND BALANCE LIE AT THE', 1452, 2507],
  ['CORE OF THE DESIGN.', 1172, 2529],
];

const STATEMENT_M =
  'THOUGH  IT  MAY  APPEAR  UNFINISHED  AT FIRST  GLANCE,THE  CLOSER  YOU  LOOK,THE  MORE  ITS  REFINEMENT REVEEALS ITSELF. THIS SUBTLE TENSION AND BALANCE LIE AT THE CORE OF THE DESIGN.';

const TYPE_MS = 20; // typed line by line, left → right; 35 → 20 ms per character (feedback 2026-10-10: faster)

/** desktop segments in reading order (row by row, left to right) */
const ORDER = [...LINES].sort((a, b) => a[2] - b[2] || a[1] - b[1]);
const STARTS = ORDER.reduce<number[]>((acc, _seg, i) => [...acc, i ? acc[i - 1] + ORDER[i - 1][0].length : 0], []);
const TOTAL = Math.max(STARTS[STARTS.length - 1] + ORDER[ORDER.length - 1][0].length, STATEMENT_M.length);

/** characters shown so far: starts when the statement scrolls into view, plays once (reduced motion: all at once) */
function useTyping() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(reduce ? TOTAL : 0);
  const [started, setStarted] = useState(reduce);
  useEffect(() => {
    if (started) return;
    const section = ref.current?.closest('.section');
    if (!section) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(section);
    return () => io.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started || count >= TOTAL) return;
    const id = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
    return () => clearTimeout(id);
  }, [started, count]);
  return { ref, count };
}

export function BrandPhilosophy() {
  const { ref, count } = useTyping();
  return (
    <Section d={[2372, 493]} m={[931, 230]} label="Brand Philosophy" id="brand-info">
      <T fs={[22, 10]} cls="f-mono w500 pre bp__keyword" d={[60, 2413]} m={[16, 948]}>{'METICULOUS\nDESIGN'}</T>
      <T fs={[22, 10]} cls="f-mono w500 pre bp__keyword" d={[60, 2721]} m={[16, 1035]}>{'ROUGHNESS\nAND DELICACY'}</T>
      <T fs={[22, 10]} cls="f-mono w500 pre bp__keyword" d={[307, 2721]} m={[108, 1035]}>{'REFINED\nSTRUCTURES'}</T>

      <Glyph src="/images/home/symbol-01.svg" d={[60.1, 2463, 18.8, 16.7]} m={[16, 976, 10, 8]} />
      <Glyph src="/images/home/symbol-02.svg" d={[68.9, 2462.6, 22.1, 17.9]} m={[21, 975, 11, 9]} />
      <Glyph src="/images/home/symbol-03.svg" d={[104.4, 2463.8, 17.3, 15.9]} m={[39, 976, 8, 8]} />

      <Frame className="bp__fill" d={[60, 2372, 16, 16]} m={[16, 931, 8, 8]} />
      <Frame className="bp__line" d={[299, 2372, 8, 16]} m={[134, 931, 3, 8]} />
      <Frame className="bp__fill" d={[314, 2372, 8, 16]} m={[141, 931, 4, 8]} />
      <Frame className="bp__line" d={[1844, 2372, 16, 16]} m={[369, 931, 8, 8]} />
      <Frame className="bp__fill" d={[1844, 2749, 16, 16]} m={[369, 1050, 8, 8]} />

      <span ref={ref} hidden />
      {ORDER.map(([text, x, y], i) => (
        <T key={text} fs={[16]} cls="f-mono w400 tr-4 pre bp__typed" d={[x, y]}>{text.slice(0, Math.max(0, count - STARTS[i]))}</T>
      ))}
      {/* mobile: one right-aligned block; the hidden full text keeps the block's line breaks while it types */}
      <T fs={[10, 10]} cls="f-mono w400 tr-4 pre-wrap ta-r bp__statement-m bp__typed" m={[377, 948, 198, 111]} ax="r">
        <span>{STATEMENT_M.slice(0, count)}</span><span className="bp__rest">{STATEMENT_M.slice(count)}</span>
      </T>
    </Section>
  );
}
