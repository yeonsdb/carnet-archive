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
 * - Mouse: drag with the cursor to scroll (feedback 2026-10-10 — replaces the wheel → horizontal mapping of Q8; the wheel
 *   now scrolls the page as usual). Touch: native horizontal swipe. Hover enlarges the hovered look (fine pointers only).
 * - Wider than the 1920 layout: the scroller extends to the viewport edges (--bleed), so the looks continue past the
 *   layout edge instead of being cut off.
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
    const bleed = () => parseFloat(getComputedStyle(el).getPropertyValue('padding-left')) || 0;
    const unit = () => (el.clientWidth - 2 * bleed()) / (track().box[2] ?? 1);
    let pos = track().offset;
    let userActive = false;
    const apply = () => { el.scrollLeft = pos * unit(); };
    const onIntent = () => { userActive = true; };
    const onScroll = () => { if (userActive) pos = el.scrollLeft / unit(); };
    const onBreakpoint = () => { pos = track().offset; userActive = false; apply(); };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    const intents = ['pointerdown', 'touchstart', 'keydown'] as const;
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

  // Mouse drag → horizontal scroll (touch keeps native swipe). A drag suppresses the click that follows it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0, startLeft = 0, id = -1, moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      id = e.pointerId; startX = e.clientX; startLeft = el.scrollLeft; moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 3) { moved = true; el.setPointerCapture(id); el.classList.add('is-dragging'); }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      el.classList.remove('is-dragging');
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
    };
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
