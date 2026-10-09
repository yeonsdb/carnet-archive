import { Frame, Glyph, Pic, T } from '../../lib/artboard';
import { RotatedBox, RotatedText } from '../ui/Rotated';
import { SIZE_COLUMNS, SIZE_ROWS } from '../../data/productDetail';
import './SizeGuide.css';

/** Table text centres (Figma) — header / M / L rows */
const COL_D = { head: [662, 860.5, 1058.5, 1259, 1458], M: [662, 860.5, 1059.5, 1259.5, 1457.5], L: [662, 860.5, 1060, 1259, 1457.5] };
const COL_M = { head: [91, 154, 217, 282, 346], M: [91, 154, 217, 282, 345.5], L: [91, 154, 217, 281.5, 346] };
const ROW_Y = { d: { M: 7654, L: 7733 }, m: { M: 2645, L: 2692 } };
/** Mobile table: white cells (x, width) × rows (y, height) */
const CELL_X_M = [[59, 64], [122, 64], [185, 64], [248, 67], [314, 63]] as const;
const CELL_Y_M = [[2599, 28], [2626, 49], [2674, 48]] as const;

/**
 * Section / Size Guide / Anchor=size-guide — D 1124:11758 · M 1213:2943.
 * Desktop: Illustration / Jacket Measurements (image + measurement graphics + labels) and the size table.
 * Mobile: the illustration is one image ("Anchor=size-guide 1") and a compact table.
 * CM / INCH: only CM is designed (INCH is the inactive label) → visual only.
 */
export function SizeGuide() {
  return (
    <>
      {/* Illustration / Jacket Measurements (desktop) */}
      <Pic src="/images/product/size-illustration.webp" alt="재킷 치수 측정 위치" fit={[-4.37, -4.73, 108.77, 104.77]} d={[621, 6805, 620, 592]} />
      <Glyph src="/images/product/dim-shoulder.svg" d={[756.48, 6876.13, 350.154, 12.282]} />
      <RotatedBox d={[1141.93, 6881.12, 171.627, 463.826]} inner={[487.839, 12.284, 70.81]}>
        <img src="/images/product/dim-sleeve.svg" alt="" draggable={false} />
      </RotatedBox>
      <Glyph src="/images/product/dim-chest.svg" d={[789.81, 7065.62, 282.603, 12.282]} />
      <Glyph src="/images/product/dim-waist.svg" d={[825.78, 7164.75, 210.666, 12.282]} />
      <Glyph src="/images/product/dim-length.svg" d={[653.46, 6894.93, 12.282, 323.834]} />
      <Frame className="sg-mask" d={[632.4, 7041.94, 55.268, 30.704]} />
      <T fs={[14]} cls="f-sans w400 tr-4" d={[660, 7049]} ax="c">LENGTH</T>
      <RotatedBox d={[1183.58, 7032.4, 84.378, 147.802]} inner={[143.538, 37.722, 70.08]}>
        <span className="sg-mask sg-mask--fill" />
      </RotatedBox>
      <RotatedText fs={[14]} deg={[70.08]} cls="f-sans w400 tr-4" d={[1225.58, 7050.1, 52.535, 111.339]} ax="c">SLEEVE LENGTH</RotatedText>
      <Frame className="sg-mask" d={[887, 6865, 88, 34]} />
      <T fs={[14]} cls="f-sans w400 tr-4" d={[931, 6874]} ax="c">SHOULDER</T>
      <Frame className="sg-mask" d={[891.2, 7056.85, 79.831, 28.95]} />
      <T fs={[14]} cls="f-sans w400 tr-4" d={[931.12, 7063.87]} ax="c">CHEST</T>
      <Frame className="sg-mask" d={[891.2, 7155.98, 79.831, 28.95]} />
      <T fs={[14]} cls="f-sans w400 tr-4" d={[930.68, 7163]} ax="c">WAIST</T>

      {/* Anchor=size-guide 1 (mobile) */}
      <Pic src="/images/product/size-guide-m.webp" alt="재킷 치수 측정 위치" fit={[-0.05, 0, 100.09, 173.12]} m={[16, 2318, 361, 186]} />

      {/* CM / INCH */}
      <T fs={[16, 12]} cls="f-sans sg-unit" d={[661, 7496]} m={[106.5, 2552]} ax="c">CM</T>
      <T fs={[16, 12]} cls="f-sans w400 c-muted" d={[1258, 7496]} m={[286.5, 2552]} ax="c">INCH</T>
      <Frame className="fill-inverse" d={[363, 7529, 597, 3]} m={[16, 2572, 180, 2]} />
      <Frame className="rule c-muted" d={[960, 7530.5, 597]} m={[196.5, 2572.5, 181]} />

      {/* Table / Size Measurements — desktop */}
      <Frame className="fill-inverse" d={[363, 7580, 199, 47]} />
      <Frame className="fill-inverse" d={[363, 7627, 199, 77]} />
      <Frame className="fill-inverse" d={[363, 7703, 199, 77]} />
      <Frame className="stroke" d={[363, 7580, 1194, 200]} />
      {[562, 762, 960, 1159, 1359].map((x) => <Frame key={x} className="vrule" d={[x - 0.5, 7580, 0, 200]} />)}
      <Frame className="rule c-inverse" d={[363, 7626.5, 199]} />
      <Frame className="rule c-inverse" d={[363, 7702.5, 199]} />
      <Frame className="rule" d={[562, 7626.5, 996]} />
      <Frame className="rule" d={[562, 7702.5, 995]} />
      <T fs={[16]} cls="f-sans w600 tr-4 c-inverse" d={[446, 7595]}>SIZE</T>
      <T fs={[16]} cls="f-sans w600 tr-4 c-inverse" d={[456, 7658]}>M</T>
      <T fs={[16]} cls="f-sans w600 tr-4 c-inverse" d={[458, 7734]}>L</T>
      {SIZE_COLUMNS.map((c, i) => <T key={c} as="span" fs={[16]} cls="f-sans w600 tr-4" d={[COL_D.head[i], 7595]} ax="c">{c}</T>)}
      {SIZE_ROWS.map((r) => r.values.map((v, i) => (
        <T key={`${r.size}${i}`} as="span" fs={[16]} cls="f-sans w600 tr-4" d={[COL_D[r.size][i], ROW_Y.d[r.size]]} ax="c">{v}</T>
      )))}
      <T fs={[14]} cls="f-sans w400 tr-4 c-muted" d={[1241, 7797]}>*사이즈 측정 기준에 따라 2~3cm 오차가 있을 수 있습니다.</T>

      {/* Table / Size Measurements — mobile */}
      <Frame className="fill-inverse" m={[16, 2599, 44, 28]} />
      <Frame className="fill-inverse" m={[16, 2627, 44, 48]} />
      <Frame className="fill-inverse" m={[16, 2675, 44, 47]} />
      {CELL_Y_M.map(([y, h]) => CELL_X_M.map(([x, w]) => <Frame key={`${x}-${y}`} className="stroke sg-cell" m={[x, y, w, h]} />))}
      <Frame className="rule c-inverse" m={[16, 2626, 44]} />
      <Frame className="rule c-inverse" m={[16, 2674, 44]} />
      <T fs={[8, 8]} cls="f-sans w500 tr-4 c-inverse" m={[30, 2607]}>SIZE</T>
      <T fs={[8, 8]} cls="f-sans w500 tr-4 c-inverse" m={[35, 2646]}>M</T>
      <T fs={[8, 8]} cls="f-sans w500 tr-4 c-inverse" m={[36, 2694]}>L</T>
      {SIZE_COLUMNS.map((c, i) => <T key={c} as="span" fs={[8, 8]} cls="f-sans w500 tr-4" m={[COL_M.head[i], 2608]} ax="c">{c}</T>)}
      {SIZE_ROWS.map((r) => r.values.map((v, i) => (
        <T key={`${r.size}${i}`} as="span" fs={[10, 10]} cls="f-sans w500 tr-4" m={[COL_M[r.size][i], ROW_Y.m[r.size]]} ax="c">{v}</T>
      )))}
      <T fs={[8, 8]} cls="f-sans w400 tr-4 c-muted" m={[202, 2726]}>*사이즈 측정 기준에 따라 2~3cm 오차가 있을 수 있습니다.</T>

      {/* Content / Model Measurements */}
      <Frame className="fill-inverse" d={[363, 7828, 17, 37]} m={[16, 2745, 10, 22]} />
      <Frame className="stroke" d={[385, 7828, 2, 37]} m={[29, 2745, 2, 22]} />
      <T fs={[16, 10]} cls="f-sans tr-4 sg-model" d={[401, 7828]} m={[36, 2743]}>MODEL WEARS SIZE M</T>
      <T fs={[16, 10]} cls="f-sans w400 tr-4" d={[401, 7850]} m={[36, 2757]}>HEIGHT 172 cm / BUST 80 cm / WAIST 60 cm / HIPS 88 cm</T>
    </>
  );
}
