import type { CSSProperties } from 'react';
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
function RowD({ q }: { q: Inquiry }) {
  const p = place({ d: [212, q.d, 1496] }, `pq-row${q.body ? '' : ' is-private'}`);
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
function RowM({ q }: { q: Inquiry }) {
  const p = place({ m: [16, q.m, 361] }, 'pq-mrow');
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
 * Section / Product Inquiry / Anchor=product-inquiry — D 1124:11835 · M 1228:774.
 * Filter chips and "Q&A 작성하기" have no designed result (filtered list / write form) → visual only.
 */
export function ProductInquiry() {
  return (
    <>
      <T as="h2" fs={[25, 14]} cls="f-sans w500 tr-4" d={[212, 8383]} m={[16, 2944]}>상품 Q&amp;A</T>
      <T fs={[25, 14]} cls="f-sans w400 tr-4" d={[319, 8383]} m={[74, 2944]}>(5)</T>
      <T fs={[16, 10]} cls="f-sans w500 tr-4 pq-write" d={[1621, 8392]} m={[322, 2947]}>Q&amp;A 작성하기</T>

      <div role="group" aria-label="문의 유형">
        {INQUIRY_FILTERS.map((f, i) => {
          const p = place({ d: [CHIP_D[i], 8448], m: [CHIP_M[i], 2977, CHIP_MW[i], 23] }, `pq-chip${i === 0 ? ' is-selected' : ''}`);
          return (
            <span key={f} className={p.className} style={p.style}>
              <span className="t f-sans w400 tr-4" style={fs(16, 10)}>{f}</span>
            </span>
          );
        })}
      </div>

      {INQUIRIES.map((q) => <RowD key={q.author} q={q} />)}
      {INQUIRIES.map((q) => <RowM key={q.author} q={q} />)}

      {[8696, 8854, 9015, 9178].map((y) => <Frame key={y} className="rule c-muted" d={[212, y - 0.5, 1496]} />)}
      {[3201, 3345, 3505, 3649, 3793].map((y) => <Frame key={y} className="rule pq-mdivider" m={[16, y - 0.5, 361]} />)}
    </>
  );
}
