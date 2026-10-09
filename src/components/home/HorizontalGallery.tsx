import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { Pic, place, type Box, type Crop } from '../../lib/artboard';
import './HorizontalGallery.css';

export type GalleryItem = { id: string; d: Box; m: Box; fit: 'fill' | 'cover' | Crop; mfit?: Crop; flipX?: boolean; src?: string };

type Track = {
  /** visible window in page coordinates */
  box: Box;
  /** distance (design px) from the left-most item to the frame's x = 0 — initial scroll position */
  offset: number;
  /** total scrollable width (design px) */
  width: number;
};

type Props = { label: string; items: GalleryItem[]; src: (item: GalleryItem) => string; d: Track; m: Track };

const NARROW = '(max-width: 1279.98px)';

/**
 * H-2 / H-3 Horizontal gallery.
 * - Opens at the exact Figma composition (scrolled by `offset`), items outside the frame are reachable by scrolling.
 * - Mouse wheel over the gallery scrolls horizontally until an end is reached, then the page scrolls (approved Q8).
 * - Touch: native horizontal swipe. Pointer hover enlarges the hovered look (CSS, fine pointers only).
 */
export function HorizontalGallery({ label, items, src, d, m }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Start at the Figma composition. The position is kept in design px, so it survives viewport resizes
  // (the browser may reset scrollLeft while relaying out); only user-driven scrolling changes it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(NARROW);
    const track = () => (mq.matches ? m : d);
    const unit = () => el.clientWidth / (track().box[2] ?? 1);
    let pos = track().offset;
    let userActive = false;
    const apply = () => { el.scrollLeft = pos * unit(); };
    const onIntent = () => { userActive = true; };
    const onScroll = () => { if (userActive) pos = el.scrollLeft / unit(); };
    const onBreakpoint = () => { pos = track().offset; userActive = false; apply(); };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    const intents = ['wheel', 'pointerdown', 'touchstart', 'keydown'] as const;
    intents.forEach((t) => el.addEventListener(t, onIntent, { passive: true }));
    el.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onBreakpoint);
    return () => {
      ro.disconnect();
      intents.forEach((t) => el.removeEventListener(t, onIntent));
      el.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onBreakpoint);
    };
  }, [d, m]);

  // Vertical wheel → horizontal scroll while the gallery can still move in that direction.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const canMove = e.deltaY > 0 ? el.scrollLeft < max - 1 : el.scrollLeft > 1;
      if (!canMove) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const shift = (b: Box, off: number): Box => [b[0] + off, b[1], b[2], b[3]];
  const scroller = place({ d: d.box, m: m.box }, 'hgallery');
  const trackStyle = {
    '--tw': d.width, '--mtw': m.width,
    '--st': d.box[1], '--mst': m.box[1],
  } as CSSProperties;

  return (
    <div ref={ref} className={scroller.className} style={scroller.style} tabIndex={0} role="region" aria-label={label}>
      <div className="hgallery__track" style={trackStyle}>
        {items.map((it) => (
          <Pic
            key={it.id}
            src={src(it)}
            alt={`Look ${it.id}`}
            fit={it.fit}
            mfit={it.mfit}
            flipX={it.flipX}
            className="hgallery__item"
            d={shift(it.d, d.offset)}
            m={shift(it.m, m.offset)}
          />
        ))}
      </div>
    </div>
  );
}
