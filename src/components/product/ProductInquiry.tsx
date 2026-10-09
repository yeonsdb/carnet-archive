import { useState, type CSSProperties } from 'react';
import { Frame, T, place } from '../../lib/artboard';
import { INQUIRIES, INQUIRY_FILTERS, type Inquiry } from '../../data/productDetail';
import './ProductInquiry.css';

const fs = (d: number, m = d) => ({ '--fs': d, '--mfs': m }) as CSSProperties;

/** Desktop chip lefts (absolute) · mobile chips: flex row at x 16 with gap 5 and fixed widths */
const CHIP_D = [212, 297, 414, 544, 674, 791];
const CHIP_MW = [46, 55, 63, 62, 56, 48];
const CHIP_M = CHIP_MW.map((_, i) => 16 + CHIP_MW.slice(0, i).reduce((a, w) => a + w + 5, 0));

function Private({ mobile }: { mobile?: boolean }) {
  return (
    <div className="pq-private">
      <img src={`/images/product/lock${mobile ? '-m' : ''}.svg`} alt="" className="pq-private__icon" draggable={false} />
      <span className="t f-sans w400 tr-4 lh-13" style={fs(16, 12)}>비밀글입니다.</span>
    </div>
  );
}

/** Inquiry Row (desktop): author + category, body or 비밀글 | date + 답변완료 */
function RowD({ q, top }: { q: Inquiry; top: number }) {
  const p = place({ d: [212, top, 1496] }, `pq-row${q.body ? '' : ' is-private'}`);
  return (
    <article className={p.className} style={p.style}>
      <div className="pq-main">
        <div className="pq-head">
          <span className="t f-sans w400 tr-4 pq-author" style={fs(16)}>{q.author}</span>
          <span className="pq-badge"><span className="t f-sans w500 tr-4" style={fs(14)}>{q.category}</span></span>
        </div>
        {q.body ? <p className="t f-sans w400 tr-4 lh-13 pre-wrap pq-body" style={fs(16)}>{q.body}</p> : <Private />}
      </div>
      <div className="pq-side">
        <span className="t f-sans w400 tr-4 lh-13" style={fs(14)}>{q.date}</span>
        <span className="pq-answered"><span className="t f-sans w500 tr-4" style={fs(14)}>답변완료</span></span>
      </div>
    </article>
  );
}

/** Inquiry Row (mobile): [author + category … date], body or 비밀글, 답변완료 */
function RowM({ q, top }: { q: Inquiry; top: number }) {
  const p = place({ m: [16, top, 361] }, 'pq-mrow');
  return (
    <article className={p.className} style={p.style}>
      <div className="pq-mhead">
        <span className="pq-mhead__who">
          <span className="t f-sans w400 tr-4 pq-author" style={fs(12, 12)}>{q.author}</span>
          <span className="pq-badge"><span className="t f-sans w500 tr-4" style={fs(10, 10)}>{q.category}</span></span>
        </span>
        <span className="t f-sans w400 tr-4 lh-13 pq-date" style={fs(12, 12)}>{q.date}</span>
      </div>
      {q.body ? <p className="t f-sans w400 tr-4 lh-13 pre-wrap" style={fs(12, 12)}>{q.bodyM ?? q.body}</p> : <Private mobile />}
      <span className="pq-answered"><span className="t f-sans w500 tr-4" style={fs(10, 10)}>답변완료</span></span>
    </article>
  );
}

/**
 * Row heights (design px) measured from the Figma rows and the dividers that follow them, used to re-stack a filtered
 * list with the Figma rhythm: desktop row → 42.2 → divider → 42 → next row (no divider after the last row);
 * mobile row → 24.2 → divider → 23 → next row (a divider after every row).
 */
const ROW_H_D = [97.8, 78.8, 76.8, 78.8, 78.8];
const ROW_H_M = [128.8, 96.8, 112.8, 96.8, 96.8];
const DIVIDERS_D = [8696, 8854, 9015, 9178];
const DIVIDERS_M = [3201, 3345, 3505, 3649, 3793];

function stack(rows: number[], start: number, heights: number[], before: number, after: number, dividerAfterLast: boolean) {
  const tops: number[] = [], dividers: number[] = [];
  let y = start;
  rows.forEach((r, i) => {
    tops.push(y);
    const div = y + heights[r] + before;
    if (i < rows.length - 1 || dividerAfterLast) dividers.push(div);
    y = div + after;
  });
  return { tops, dividers };
}

/**
 * Section / Product Inquiry / Anchor=product-inquiry — D 1124:11835 · M 1228:774.
 * Filter chips filter the list by inquiry type (feedback 2026-10-10); the selected chip uses the Figma ALL style (black).
 * ALL shows the Figma layout exactly; a filtered list is re-stacked from the first row with the same rhythm.
 * Types without inquiries show a one-line empty message (empty state not designed). "Q&A 작성하기" stays visual only.
 */
export function ProductInquiry() {
  const [filter, setFilter] = useState(INQUIRY_FILTERS[0]);
  const all = filter === INQUIRY_FILTERS[0];
  const rows = INQUIRIES.map((q, i) => ({ q, i })).filter(({ q }) => all || q.category === filter);
  const d = all ? { tops: INQUIRIES.map((q) => q.d), dividers: DIVIDERS_D } : stack(rows.map((r) => r.i), INQUIRIES[0].d, ROW_H_D, 42.2, 42, false);
  const m = all ? { tops: INQUIRIES.map((q) => q.m), dividers: DIVIDERS_M } : stack(rows.map((r) => r.i), INQUIRIES[0].m, ROW_H_M, 24.2, 23, true);

  return (
    <>
      <T as="h2" fs={[25, 14]} cls="f-sans w500 tr-4" d={[212, 8383]} m={[16, 2944]}>상품 Q&amp;A</T>
      <T fs={[25, 14]} cls="f-sans w400 tr-4" d={[319, 8383]} m={[74, 2944]}>(5)</T>
      <T fs={[16, 10]} cls="f-sans w500 tr-4 pq-write" d={[1621, 8392]} m={[322, 2947]}>Q&amp;A 작성하기</T>

      <div role="group" aria-label="문의 유형">
        {INQUIRY_FILTERS.map((f, i) => {
          const p = place({ d: [CHIP_D[i], 8448], m: [CHIP_M[i], 2977, CHIP_MW[i], 23] }, `pq-chip${f === filter ? ' is-selected' : ''}`);
          return (
            <button key={f} type="button" className={p.className} style={p.style} aria-pressed={f === filter} onClick={() => setFilter(f)}>
              <span className="t f-sans w400 tr-4" style={fs(16, 10)}>{f}</span>
            </button>
          );
        })}
      </div>

      {rows.map(({ q }, k) => <RowD key={q.author} q={q} top={d.tops[all ? INQUIRIES.indexOf(q) : k]} />)}
      {rows.map(({ q }, k) => <RowM key={q.author} q={q} top={m.tops[all ? INQUIRIES.indexOf(q) : k]} />)}
      {rows.length === 0 && (
        <T fs={[16, 12]} cls="f-sans w400 tr-4 c-muted pq-empty" d={[212, INQUIRIES[0].d]} m={[16, INQUIRIES[0].m]}>등록된 문의가 없습니다.</T>
      )}

      {d.dividers.map((y) => <Frame key={`d${y}`} className="rule c-muted" d={[212, y - 0.5, 1496]} />)}
      {m.dividers.map((y) => <Frame key={`m${y}`} className="rule pq-mdivider" m={[16, y - 0.5, 361]} />)}
    </>
  );
}