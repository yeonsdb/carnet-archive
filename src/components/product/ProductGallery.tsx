import { useState } from 'react';
import { Pic, place, type Box } from '../../lib/artboard';
import { GALLERY, GALLERY_INITIAL, GALLERY_LAYOUT, GALLERY_SCALE, type GalleryLayout } from '../../data/productDetail';
import './ProductGallery.css';

type Layout = { items: Box[]; prev: Box; next: Box };

/**
 * Lay the track out for the active index: the active image is enlarged (×889/597) and centred on the Figma active slot;
 * neighbours keep their own size and sit at the Figma gaps (active ↔ neighbour, neighbour ↔ neighbour); the Previous /
 * Next buttons keep their Figma offset from the active image, so they always fall in the empty gap next to it.
 * With 05 active this reproduces the Figma frame exactly.
 */
function layout(active: number, L: GalleryLayout, boxOf: (i: number) => Box): Layout {
  const items: Box[] = new Array(GALLERY.length);
  const [, ay, aw = 0, ah = 0] = boxOf(active);
  const w = aw * GALLERY_SCALE, h = ah * GALLERY_SCALE;
  const left = L.center - w / 2;
  items[active] = [left, ay + ah / 2 + L.drop - h / 2, w, h];

  let edge = left;
  for (let i = active - 1; i >= 0; i--) {
    const [, y, bw = 0, bh = 0] = boxOf(i);
    edge -= (i === active - 1 ? L.neighbourLeft : L.gaps[i] ?? L.gap) + bw;
    items[i] = [edge, y, bw, bh];
  }
  edge = left + w;
  for (let i = active + 1; i < GALLERY.length; i++) {
    const [, y, bw = 0, bh = 0] = boxOf(i);
    edge += i === active + 1 ? L.neighbourRight : L.gaps[i - 1] ?? L.gap;
    items[i] = [edge, y, bw, bh];
    edge += bw;
  }
  const [bw, bh, by] = L.button;
  return { items, prev: [left - L.prevGap - bw, by, bw, bh], next: [left + w + L.nextGap, by, bw, bh] };
}

/**
 * P-1 / P-2 Gallery — starts on 05 (enlarged). Previous / Next move the active image (400 ms, approved motion value);
 * buttons are disabled at either end. Only the initial state is drawn in Figma; other states follow the rule above.
 */
export function ProductGallery() {
  const [active, setActive] = useState(GALLERY_INITIAL);
  const d = layout(active, GALLERY_LAYOUT.d, (i) => GALLERY[i].d);
  const m = layout(active, GALLERY_LAYOUT.m, (i) => GALLERY[i].m);
  const cur = GALLERY[active];

  const prev = place({ d: d.prev, m: m.prev }, 'pgallery__btn pgallery__btn--prev');
  const next = place({ d: d.next, m: m.next }, 'pgallery__btn');
  const atStart = active === 0;
  const atEnd = active === GALLERY.length - 1;

  return (
    <div className="pgallery" role="group" aria-roledescription="carousel" aria-label="상품 이미지">
      {GALLERY.map((img, i) => (
        <Pic
          key={img.id}
          src={img.src}
          alt={`${img.id} ${img.label}`}
          fit={img.fit}
          d={d.items[i]}
          m={m.items[i]}
          loading="eager"
          className={`pgallery__item${i === active ? ' is-active' : ''}`}
        />
      ))}
      <p className="sr-only" aria-live="polite">{`${active + 1} / ${GALLERY.length}: ${cur.label}`}</p>

      <button type="button" className={prev.className} style={prev.style} aria-label="이전 이미지" disabled={atStart} onClick={() => setActive((a) => Math.max(0, a - 1))}>
        <img src="/images/product/gallery-prev.svg" alt="" className="pgallery__icon hide-m" draggable={false} />
        <img src="/images/product/gallery-prev-m.svg" alt="" className="pgallery__icon hide-d" draggable={false} />
      </button>
      <button type="button" className={next.className} style={next.style} aria-label="다음 이미지" disabled={atEnd} onClick={() => setActive((a) => Math.min(GALLERY.length - 1, a + 1))}>
        <img src="/images/product/gallery-next.svg" alt="" className="pgallery__icon hide-m" draggable={false} />
        <img src="/images/product/gallery-next-m.svg" alt="" className="pgallery__icon hide-d" draggable={false} />
      </button>
    </div>
  );
}
