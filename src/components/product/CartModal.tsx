import { Modal, mbox, mfs } from '../ui/Modal';
import { DETAIL } from '../../data/productDetail';
import { CARD_BG_CROP, formatPrice } from '../../data/products';
import './CartModal.css';

const pct = (c: readonly number[]) => ({ left: `${c[0]}%`, top: `${c[1]}%`, width: `${c[2]}%`, height: `${c[3]}%` });
/** Frame 2 (1282:748): model-04 image, Figma CROP [[0.16903, 0, 0.16464], [0, 0.5241, 0.06225]] */
const MODEL_CROP = [(-0.16464 / 0.16903) * 100, (-0.06225 / 0.5241) * 100, 100 / 0.16903, 100 / 0.5241];

/**
 * 장바구니 — Figma 1282:715 (944 × 707, 1px black frame). Opened by CART on the product page.
 * Shows the selected item (colour, size, quantity) and its line total. 쇼핑 계속하기 / ✕ / Escape / outside click close it.
 * 구매하기 · 장바구니 이동 have no destination design and the pager has a single page → visual only.
 */
export function CartModal({ size, qty, onClose }: { size: string; qty: number; onClose: () => void }) {
  return (
    <Modal label="장바구니 담기" w={944} h={707} onClose={onClose} className="cart">
      <div className="cart__bar" style={mbox(-1, -1, 944, 51)} />
      <span className="cart__sq cart__sq--fill" style={mbox(28, 20.24, 11.529, 11.529)} />
      <span className="cart__sq cart__sq--line" style={mbox(44.47, 20.24, 11.529, 11.529)} />
      <p className="cart__head cart__head--title" style={{ ...mbox(71, 15), ...mfs(16) }}>장바구니 담기</p>
      <p className="cart__head" style={{ ...mbox(160, 15), ...mfs(16) }}>/</p>
      <p className="cart__head" style={{ ...mbox(171, 15), ...mfs(16) }}>총 {qty}개</p>
      <button type="button" className="cart__x" style={mbox(895, 11, 28, 28)} aria-label="닫기" onClick={onClose}>
        <img src="/images/ui/close-cart.svg" alt="" style={{ left: 'calc(7.66 * var(--ms))', top: 'calc(7.63 * var(--ms))', width: 'calc(12.897 * var(--ms))', height: 'calc(11.983 * var(--ms))' }} />
      </button>

      {/* item: card background + model (Frame 5 / Frame 2) */}
      <div className="modal__img" style={mbox(49, 96, 268, 358)}>
        <img src="/images/shop/card-bg.webp" alt="" style={pct(CARD_BG_CROP)} />
      </div>
      <div className="modal__img" style={mbox(78, 96, 204, 358)}>
        <img src="/images/shop/model-04.webp" alt={DETAIL.name} style={pct(MODEL_CROP)} />
      </div>
      <div className="cart__meta" style={mbox(49, 459, 268)}>
        <div className="cart__meta-top">
          <p className="cart__name" style={mfs(14)}>{DETAIL.name}</p>
          <p className="cart__option" style={mfs(14)}>[옵션] {DETAIL.color} ({size}) / {qty}개</p>
        </div>
        <p className="cart__price" style={mfs(16)}>{formatPrice(DETAIL.price * qty)}</p>
      </div>

      {/* pager (one page) */}
      <span className="cart__pg cart__pg--prev" style={mbox(411, 585, 34, 34)} aria-hidden="true"><img src="/images/ui/pager-prev.svg" alt="" /></span>
      <span className="cart__pg cart__pg--current" style={{ ...mbox(455, 585, 34, 34), ...mfs(16) }} aria-label="1 페이지">1</span>
      <span className="cart__pg" style={mbox(499, 585, 34, 34)} aria-hidden="true"><img src="/images/ui/pager-next.svg" alt="" /></span>

      <button type="button" className="cart__btn cart__btn--buy" style={{ ...mbox(-1, 649, 315, 57), ...mfs(16) }} aria-disabled="true">구매하기</button>
      <button type="button" className="cart__btn" style={{ ...mbox(314, 650, 314, 55), ...mfs(16) }} aria-disabled="true">장바구니 이동</button>
      <button type="button" className="cart__btn" style={{ ...mbox(629, 650, 313, 55), ...mfs(16) }} onClick={onClose}>쇼핑 계속하기</button>
    </Modal>
  );
}
