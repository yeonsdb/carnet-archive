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

/** desktop scrollbar under the gallery: track box (page coordinates) and thumb width (design px) */
type Bar = { d: Box; thumb: number };

type Props = { label: string; items: GalleryItem[]; src: (item: GalleryItem) => string; d: Track; m: Track; bar?: Bar; onItemClick?: (id: string) => void };

const NARROW = '(max-width: 1279.98px)';

/**
 * H-2 / H-3 Horizontal gallery.
 * - Opens at the exact Figma composition (scrolled by `offset`), items outside the frame are reachable by scrolling.
 * - Mouse: drag with the cursor to scroll (feedback 2026-10-10 — replaces the wheel → horizontal mapping of Q8; the wheel
 *   now scrolls the page as usual). Touch: native horizontal swipe. Hover enlarges the hovered look (fine pointers only).
 * - Looks beyond the layout edge are cut off at the layout edge (as in the PRODUCT gallery; feedback 2026-10-10).
 * - Desktop scrollbar (Figma 1923, 2265:5939): the thumb follows the scroll position; dragging the thumb or pressing the
 *   track scrolls the gallery.
 */
export function HorizontalGallery({ label, items, src, d, m, bar, onItemClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  // scrollbar: thumb position = scroll progress; pointer on the track scrolls (thumb centred under the pointer)
  useEffect(() => {
    const el = ref.current, track = barRef.current, thumb = thumbRef.current;
    if (!el || !track || !thumb || !bar) return;
    const free = 1 - bar.thumb / (bar.d[2] ?? 1); // share of the track the thumb can travel
    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      thumb.style.left = `${p * free * 100}%`;
      track.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    };
    let id = -1;
    const seek = (clientX: number) => {
      const r = track.getBoundingClientRect();
      const t = r.width * (1 - free);
      const p = Math.min(1, Math.max(0, (clientX - r.left - t / 2) / (r.width - t)));
      el.scrollLeft = p * (el.scrollWidth - el.clientWidth);
    };
    const onDown = (e: PointerEvent) => { if (e.button !== 0) return; id = e.pointerId; track.setPointerCapture(id); el.dispatchEvent(new Event('pointerdown')); seek(e.clientX); };
    const onMove = (e: PointerEvent) => { if (e.pointerId === id) seek(e.clientX); };
    const onUp = (e: PointerEvent) => { if (e.pointerId === id) id = -1; };
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    sync();
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
    };
  }, [bar]);

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

  const barBox = bar ? place({ d: bar.d }, 'hgallery-bar') : null;

  return (
    <>
    <div ref={ref} className={scroller.className} style={scroller.style} tabIndex={0} role="region" aria-label={label}>
      <div className="hgallery__track" style={trackStyle}>
        {items.map((it) => (
          <Pic
            key={it.id}
            src={src(it)}
            alt={`Look ${it.id}`}
            onClick={onItemClick ? () => onItemClick(it.id) : undefined}
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
    {bar && barBox && (
      <div ref={barRef} className={barBox.className} style={barBox.style} role="scrollbar" aria-orientation="horizontal"
        aria-label={`${label} 스크롤`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50}>
        <span ref={thumbRef} className="hgallery-bar__thumb" style={{ width: `${(bar.thumb / (bar.d[2] ?? 1)) * 100}%` }} />
      </div>
    )}
    </>
  );
}
