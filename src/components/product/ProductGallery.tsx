import { useState, type CSSProperties } from 'react';
import { Pic, place } from '../../lib/artboard';
import { GALLERY, GALLERY_CENTER, GALLERY_DROP, GALLERY_INITIAL, GALLERY_SCALE } from '../../data/productDetail';
import './ProductGallery.css';

const centre = (b: readonly (number | undefined)[]) => (b[0] ?? 0) + (b[2] ?? 0) / 2;

/**
 * P-1 / P-2 Gallery — starts on 05 (enlarged). Previous / Next move the active image; the active image enlarges
 * (×889/597, as 05 in Figma) and the track slides so it sits on the Figma active slot. 400 ms (approved motion value).
 * Only the initial state is drawn in Figma; other states reuse the same rule. Buttons are disabled at either end.
 */
export function ProductGallery() {
  const [active, setActive] = useState(GALLERY_INITIAL);
  const cur = GALLERY[active];
  const trackStyle = {
    '--gx': GALLERY_CENTER.d - centre(cur.d),
    '--mgx': GALLERY_CENTER.m - centre(cur.m),
    '--gs': GALLERY_SCALE,
    '--gdy': GALLERY_DROP.d,
    '--mgdy': GALLERY_DROP.m,
  } as CSSProperties;

  const prev = place({ d: [636, 466, 54, 105], m: [56.74, 218.78, 23.107, 44.931] }, 'pgallery__btn pgallery__btn--prev');
  const next = place({ d: [1235, 466, 54, 105], m: [313.06, 218.78, 23.107, 44.931] }, 'pgallery__btn');
  const atStart = active === 0;
  const atEnd = active === GALLERY.length - 1;

  return (
    <div className="pgallery" role="group" aria-roledescription="carousel" aria-label="상품 이미지">
      <div className="pgallery__track" style={trackStyle}>
        {GALLERY.map((img, i) => (
          <Pic
            key={img.id}
            src={img.src}
            alt={`${img.id} ${img.label}`}
            fit={img.fit}
            d={img.d}
            m={img.m}
            loading="eager"
            className={`pgallery__item${i === active ? ' is-active' : ''}`}
          />
        ))}
      </div>
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
