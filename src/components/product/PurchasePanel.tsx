import { useState, type CSSProperties } from 'react';
import { Frame, Glyph, T, place, type PlaceProps } from '../../lib/artboard';
import { DETAIL } from '../../data/productDetail';
import { formatPrice } from '../../data/products';
import './PurchasePanel.css';

const MAX_QTY = 99;

type Size = (typeof DETAIL.sizes)[number];

/** Action button whose label sits at a Figma offset inside the box (BUY IT NOW / CART). */
function PanelButton({ label, lx, mlx, className, ...pos }: PlaceProps & { label: string; lx: [number, number]; mlx: [number, number]; className: string }) {
  const p = place(pos, `pp-btn ${className}`, { '--lx': lx[0], '--ly': lx[1], '--mlx': mlx[0], '--mly': mlx[1] } as CSSProperties);
  // purchase / cart flows are out of scope (decision: visual only)
  return (
    <button type="button" className={p.className} style={p.style} aria-disabled="true">
      <span className="pp-btn__label tr-4">{label}</span>
    </button>
  );
}

/**
 * Purchase panel — Product Summary (D 60,1126 1042 × 287 · M 16,489 361 × 176) and Selected Items
 * (D 1101,1126 758 × 210 · M 16,664 361 × 110).
 * Size M / L and the quantity stepper work on screen only; TOTAL follows the quantity (desktop — the mobile frame has no
 * TOTAL row). Colour swatches, remove, BUY IT NOW and CART have no designed behaviour → visual only.
 */
export function PurchasePanel() {
  const [size, setSize] = useState<Size>('M');
  const [qty, setQty] = useState(1);
  const line = `${DETAIL.name} / ${DETAIL.color} (${size})`;

  const minus = place({ d: [1136, 1214, 33.858, 33.858], m: [27, 735, 18.96, 18.96] }, 'pp-step pp-step--minus');
  const plus = place({ d: [1202.14, 1214, 33.858, 33.858], m: [64.04, 735, 18.96, 18.96] }, 'pp-step pp-step--plus');

  return (
    <>
      {/* Product Summary */}
      <T as="h1" fs={[24]} cls="f-sans w600 tr-4" d={[102, 1157]}>{DETAIL.name}</T>
      <T as="h1" fs={[14, 14]} cls="f-sans w600 tr-4 lh-13 wrap" m={[27, 501, 266]}>{DETAIL.name}</T>
      <T fs={[24]} cls="f-sans w600 tr-4" d={[102, 1188]}>{formatPrice(DETAIL.price)}</T>
      <T fs={[14, 14]} cls="f-sans w500 tr-4" m={[27, 546]}>{formatPrice(DETAIL.price)}</T>

      <T fs={[16, 10]} cls="f-sans tr-4 pp-label" d={[102, 1259]} m={[27, 582]}>적립금</T>
      <T fs={[16, 10]} cls="f-sans tr-4 pp-label" d={[102, 1291]} m={[27, 600]}>배송비</T>
      <T fs={[16, 10]} cls="f-sans tr-4 pp-label" d={[102, 1323]} m={[27, 618]}>COLOR</T>
      <T fs={[16, 10]} cls="f-sans tr-4 pp-label" d={[102, 1355]} m={[27, 636]}>SIZE</T>
      <T fs={[16, 10]} cls="f-sans w400 tr-4" d={[192, 1259]} m={[68, 582]}>3%</T>
      <T fs={[16, 10]} cls="f-sans w400 tr-4" d={[192, 1291]} m={[68, 600]}>3,000원 (30,000원 이상 구매 시 무료)</T>

      <Frame className="pp-swatch" d={[190, 1323, 19, 19]} m={[67, 617, 14, 14]} style={{ '--sw': DETAIL.swatches[0] } as CSSProperties} />
      <Frame className="pp-swatch" d={[215, 1323, 19, 19]} m={[83, 617, 14, 14]} style={{ '--sw': DETAIL.swatches[1] } as CSSProperties} />

      <div role="radiogroup" aria-label="SIZE">
        {DETAIL.sizes.map((s, i) => {
          // Size option box (Figma 1254:7038): 19 × 19 on the swatch columns; selected = 1px black inside stroke + shadow.
          // Mobile (Figma 1257:7039): 12 × 12 with a 1px OUTSIDE stroke → 14 × 14 border box at (67 / 83, 635).
          const p = place({ d: [i === 0 ? 190 : 215, 1355, 19, 19], m: [i === 0 ? 67 : 83, 635, 14, 14] }, `t f-sans tr-4 pp-size${size === s ? ' is-selected' : ''}`, { '--fs': 16, '--mfs': 10 } as CSSProperties);
          return (
            <button key={s} type="button" role="radio" aria-checked={size === s} className={p.className} style={p.style} onClick={() => setSize(s)}>
              {s}
            </button>
          );
        })}
      </div>

      <Frame className="stroke" d={[60, 1126, 1042, 287]} m={[16, 489, 361, 176]} />

      {/* Selected Items */}
      <Frame className="stroke" d={[1101, 1126, 758, 210]} m={[16, 664, 361, 110]} />
      <T fs={[16]} cls="f-sans w500 tr-4 lh-13" d={[1136, 1153]}>{line}</T>
      <T fs={[12, 12]} cls="f-sans w400 tr-4 lh-13 wrap" m={[27, 675, 294]}>{line}</T>
      <T fs={[16, 12]} cls="f-sans w400 tr-4 lh-13" d={[1136, 1176]} m={[27, 711]}>{formatPrice(DETAIL.price)}</T>
      <Glyph src="/images/product/remove.svg" className="pp-remove" d={[1813.66, 1156.63, 10.4555, 9.7358]} />
      <Glyph src="/images/product/remove-m.svg" className="pp-remove" m={[355.66, 678.63, 8.2827, 7.7357]} />

      {/* Quantity Stepper */}
      <button type="button" className={minus.className} style={minus.style} aria-label="수량 줄이기" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
        <img src="/images/product/qty-minus.svg" alt="" className="pp-step__img hide-m" draggable={false} />
        <img src="/images/product/qty-minus-m.svg" alt="" className="pp-step__img hide-d" draggable={false} />
      </button>
      <Frame className="stroke pp-qty-box" d={[1169.07, 1214, 33.858, 33.858]} m={[45.52, 735, 18.96, 18.96]} />
      <T as="output" fs={[16, 10]} cls="f-sans tr-4 lh-13 pp-qty" d={[1186, 1221]} m={[55, 737.92]} ax="c">
        <span className="sr-only">수량 </span>{qty}
      </T>
      <button type="button" className={plus.className} style={plus.style} aria-label="수량 늘리기" disabled={qty >= MAX_QTY} onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}>
        <img src="/images/product/qty-plus.svg" alt="" className="pp-step__plus hide-m" draggable={false} />
        <img src="/images/product/qty-plus-m.svg" alt="" className="pp-step__plus hide-d" draggable={false} />
      </button>

      <T fs={[16]} cls="f-sans w600 tr-4 lh-13" d={[1136, 1288]}>TOTAL</T>
      {/* right-aligned on the Figma box's right edge (1730 + 94) so a longer total grows to the left */}
      <T as="output" fs={[20]} cls="f-sans w700 tr-4 lh-13" d={[1824, 1284]} ax="r">{formatPrice(DETAIL.price * qty)}</T>

      <PanelButton label="BUY IT NOW" className="pp-btn--buy" d={[1102, 1335, 378, 78]} m={[16, 766, 180.262, 44.197]} lx={[134, 27]} mlx={[52, 11.88]} />
      <PanelButton label="CART" className="pp-btn--cart" d={[1480, 1335, 379, 78]} m={[196, 766, 180.738, 44.197]} lx={[164, 27]} mlx={[73, 11.88]} />
    </>
  );
}
