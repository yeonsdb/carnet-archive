import { useEffect, useRef, useState } from 'react';
import { Frame, Pic, Section, T, place, type Box } from '../../lib/artboard';
import { Arrow } from '../ui/Arrow';
import { RotatedBox, RotatedText } from '../ui/Rotated';
import './Collections.css';

type Season = 'SS26' | 'AW26';
const img = (name: string) => `/images/home/${name}.webp`;

/** Transparent hit area for a season switch (the visual is drawn by the text / arrow / background layers). */
function SeasonSwitch({ d, m, label, onClick }: { d?: Box; m?: Box; label: string; onClick: () => void }) {
  const p = place({ d, m }, 'col__switch hover-target');
  return <button type="button" className={p.className} style={p.style} aria-label={label} onClick={onClick} />;
}

/**
 * Background / Archive Navigation + VIEW ALL cell (VIEW ALL has no target — visual only).
 * Desktop VIEW ALL background has a Figma noise effect → 2x render; mobile is plain black.
 */
function NavFrame({ d, viewAll, viewAllText }: { d: Box; viewAll: Box; viewAllText: Box }) {
  return (
    <>
      <Frame className="col__nav" d={d} m={[16, 3016, 269, 48]} />
      {/* hovering the VIEW ALL cell turns its text #831A1F (no target design — colour only) */}
      <div className="hover-group">
        <Pic src={img('r-viewall-bg')} fit="fill" d={viewAll} className="hover-target" />
        <Frame className="col__nav-viewall hover-target" m={[285, 3016, 92, 48]} />
        <T fs={[24, 16]} cls="f-sans w300 tr-4 c-inverse hover-accent hover-target col__viewall-text" d={viewAllText} m={[363, 3031]} ax="r">VIEW ALL</T>
      </div>
    </>
  );
}

/**
 * Season navigation item (collection name + arrow): hovering it turns both #831A1F.
 * With `onClick` a transparent button covers the item; without it (SS27 / AW25, no design) it is colour-only.
 */
function SeasonItem({ text, textBox, align, arrow, arrowM, arrowDir, hit, hitM, label, onClick }: {
  text: string; textBox: Box; align?: 'r'; arrow: Box; arrowM: Box; arrowDir: 'left' | 'right';
  hit?: Box; hitM?: Box; label?: string; onClick?: () => void;
}) {
  return (
    <div className="hover-group">
      <T fs={[24]} cls="f-sans w300 tr-4 hover-accent hover-target" d={textBox} ax={align}>{text}</T>
      <Arrow variant="nav" dir={arrowDir} className="hover-accent hover-target" d={arrow} />
      <Arrow variant="navM" dir={arrowDir} m={arrowM} />
      {onClick && hit && <SeasonSwitch d={hit} m={hitM} label={label ?? text} onClick={onClick} />}
    </div>
  );
}

/**
 * 06 / Collections — SS26 (default) Desktop 1195:1178 · Mobile 1228:763
 *                  — AW26 (alternate) Desktop 1124:12375 · Mobile 1213:3340 (frame y 0 = page y 6034 / 2577).
 * H-6: the next/previous season control swaps the content in place. SS27 / AW25 have no design → not interactive.
 * H-5: collection images enlarge slightly on hover (fine pointers).
 */
/**
 * Brush reveal for the Archive Sweep strokes (feedback 2026-10-10): when the section scrolls into view, the strokes are
 * painted in from the upper right towards the lower left at a steady pace (large stroke 1.6 s, small stroke 0.35 s later,
 * ease-in-out), so the movement is visible however fast the page is scrolled. Plays once.
 * Sets --brush (large) and --brush-2 (small) from 0 to 1 on the section. Reduced motion: shown fully.
 */
const BRUSH_MS = 1600; // 2.4 s was too slow, scroll-linked too fast (feedback)
const BRUSH_2_DELAY_MS = 350;

function useBrushReveal() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>('.section');
    if (!section) return;
    const set = (a: number, b: number) => {
      section.style.setProperty('--brush', a.toFixed(4));
      section.style.setProperty('--brush-2', b.toFixed(4));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { set(1, 1); return; }
    set(0, 0);
    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    let raf = 0;
    const play = () => {
      const t0 = performance.now();
      const frame = (now: number) => {
        const t = now - t0;
        set(ease(clamp(t / BRUSH_MS)), ease(clamp((t - BRUSH_2_DELAY_MS) / BRUSH_MS)));
        if (t < BRUSH_MS + BRUSH_2_DELAY_MS) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    // start once the top of the section (where the strokes are) is a quarter of the way up the screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { io.disconnect(); play(); }
    }, { rootMargin: '0px 0px -25% 0px' });
    io.observe(section);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return ref;
}
export function Collections() {
  const [season, setSeason] = useState<Season>('SS26');
  const brushRef = useBrushReveal();

  return (
    <Section d={[5834, 1481]} m={[2477, 687]} label="Collections" id="collections">
      <span ref={brushRef} hidden />
      <T as="h2" fs={[80, 20]} cls="f-display w600" d={[60, 6034]} m={[16, 2577]}>COLLECTIONS</T>

      {season === 'SS26' ? (
        <>
          <Pic src={img('r-ss26-detail')} fit="fill" className="col__img" d={[60, 6517, 344, 460]} m={[293, 2751, 84, 111]} alt="SS26 SAMPLING" />

          <NavFrame d={[60, 7036.99, 1799, 77.852]} viewAll={[1496, 7037, 364, 77.838]} viewAllText={[1825.91, 7061.32]} />
          <SeasonItem text="AW26: [UNEARTH: FILE-2711]" textBox={[1386, 7060.64]} align="r" arrow={[1409, 7060.64, 43, 27.12]} arrowM={[248, 3033.92, 19, 12.16]} arrowDir="right"
            hit={[1096, 7060.64, 356, 28.6]} hitM={[16, 3016, 269, 48]} label="AW26 컬렉션 보기" onClick={() => setSeason('AW26')} />
          <SeasonItem text="AW25: AW25 LAMB'S HEAD AND THE SHELL" textBox={[160, 7062.61]} arrow={[94, 7062.61, 43, 27.12]} arrowM={[33, 3033.92, 19, 12.16]} arrowDir="left" />

          {/* Decoration / Archive Sweep (noise effect) — 2x renders placed at their render bounds, trimmed at the frame's right
              edge (the export's grey off-frame area showed as a line; scripts/trim-frame-edge.mjs) */}
          <Pic src={img('r-sweep-large')} fit="fill" className="col__sweep col__sweep--large" d={[525, 5928.84, 1395, 655]} />
          <Pic src={img('r-sweep-large-m')} fit="fill" className="col__sweep col__sweep--large" m={[36.15, 2519.13, 356.67, 220.48]} />
          <Pic src={img('r-sweep-small')} fit="fill" className="col__sweep col__sweep--small" d={[1351.85, 5854.5, 567.7, 467.15]} />
          <Pic src={img('r-sweep-small-m')} fit="fill" className="col__sweep col__sweep--small" m={[220.32, 2496, 172.4, 200.24]} />

          <Pic src={img('r-ss26-main')} fit="fill" className="col__img" d={[909, 6191, 587, 786]} m={[16, 2623, 269, 361]} alt="SS26 SAMPLING" />
          <Pic src={img('ss26-secondary')} fit="cover" className="col__img" d={[1516, 6191.16, 344, 461]} m={[293, 2623, 84, 113]} alt="SS26 SAMPLING" />

          <RotatedText fs={[50, 16]} deg={[90, 90]} cls="f-sans w600 tr-4" d={[842, 6848, 60, 129]} m={[290, 2942, 19, 42]}>‘SS26</RotatedText>
          <RotatedText fs={[14, 10]} deg={[90, 90]} cls="f-mono w400 tr-4 ta-r" d={[875, 6781, 18, 64]} m={[291, 2893, 13, 46]}>SAMPLING</RotatedText>
        </>
      ) : (
        <>
          <RotatedBox d={[418, 5972, 1202.056, 1203.543]} inner={[783.379, 917.689, -44.55]} extra="scaleY(-1)" className="col__texture">
            <img src={img('aw26-texture')} alt="" />
          </RotatedBox>

          <NavFrame d={[60, 7036, 1800, 78]} viewAll={[1496.8, 7036.16, 363.2, 77.84]} viewAllText={[1826, 7060.48]} />
          <SeasonItem text="SS27: BRUTALIST" textBox={[1386.74, 7059.7]} align="r" arrow={[1409.75, 7059.7, 43.02, 27.17]} arrowM={[248, 3033.92, 19, 12.16]} arrowDir="right" />
          <SeasonItem text="SS26: SAMPLING" textBox={[160.06, 7061.67]} arrow={[94.02, 7061.67, 43.02, 27.17]} arrowM={[33, 3033.92, 19, 12.16]} arrowDir="left"
            hit={[94, 7061.67, 239, 28.6]} hitM={[16, 3016, 269, 48]} label="SS26 컬렉션으로 돌아가기" onClick={() => setSeason('SS26')} />

          <RotatedText fs={[50, 16]} deg={[-90, 90]} cls="f-sans w600 tr-4" d={[1813, 6200, 60, 142]} m={[303, 2939, 19, 46]}>‘AW26</RotatedText>
          <RotatedText fs={[14, 10]} deg={[-90, 90]} cls="f-mono w400 tr-4 ta-r" d={[1844, 6345, 18, 158]} m={[292, 2872, 13, 113]}>[UNEARTH: FILE-2711]</RotatedText>

          <Pic src={img('r-aw26-detail-1')} fit="fill" className="col__img" d={[1516, 6516, 344, 460]} m={[293, 2750, 84, 112]} alt="AW26 UNEARTH" />
          <Pic src={img('aw26-detail-2')} fit="cover" className="col__img" d={[60, 6189.84, 587, 786]} m={[16, 2623, 269, 360]} alt="AW26 UNEARTH" />
          <Pic src={img('aw26-detail-3')} fit={[-8.54, 0, 117.52, 100]} className="col__img" d={[667, 6190, 465, 625]} m={[293, 2623, 84, 113]} alt="AW26 UNEARTH" />
        </>
      )}
    </Section>
  );
}
