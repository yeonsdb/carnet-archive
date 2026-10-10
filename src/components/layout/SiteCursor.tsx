import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './SiteCursor.css';

/**
 * Elements that get the #831A1F star ("mouse cursor1", 1289:1216): photos, anything clickable, and anything that changes
 * colour on hover even when it is not clickable (inert categories, stockists, VIEW ALL / arrows …) — feedback 2026-10-10.
 * Controls that are only visual and have no hover colour (aria-disabled / disabled) keep the black star.
 */
const RED = [
  '.media', '.pcard__media', '.swap__hit', '.modal__img', '.hgallery__item',
  'a[href]', '.hover-group--link .hover-accent', '.hover-target', '.stockist', '.catlink__btn',
  '.site-menu__row', '.site-menu__close', '.sort__option:not(.is-disabled)',
  ":is(button, [role='button'], [role='radio'], [role='option'], [role='tab']):not([aria-disabled='true']):not(:disabled)",
].join(', ');

/**
 * Site cursor — Figma "mouse cursor" (1289:1212, black star) / "mouse cursor1" (1289:1216, #831A1F star), 84 × 84,
 * hot spot at the star's centre (39, 41).
 * Drawn as an element that follows the pointer instead of CSS `cursor: url()`: browsers drop cursor images larger than
 * 32px wherever the image would cross the viewport edge (the whole 60px header), and fall back to the system cursor there.
 * Only for fine pointers (mouse); touch devices keep the default behaviour.
 */
export function SiteCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;
    const root = document.documentElement;
    root.classList.add('custom-cursor');
    const el = ref.current!;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      el.style.transform = `translate(${e.clientX - 39}px, ${e.clientY - 41}px)`;
      const t = e.target instanceof Element ? e.target : null;
      el.dataset.variant = t?.closest(RED) ? 'red' : 'black';
      el.dataset.visible = 'true';
    };
    const leave = (e: PointerEvent) => { if (!e.relatedTarget) el.dataset.visible = 'false'; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', move, { passive: true });
    document.addEventListener('pointerout', leave);
    return () => {
      root.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', move);
      document.removeEventListener('pointerout', leave);
    };
  }, []);
  // portaled to <html>: body is a size container, which would make it the containing block of `position: fixed`
  return createPortal(
    <div ref={ref} className="site-cursor" data-variant="black" data-visible="false" aria-hidden="true">
      <img className="site-cursor__img site-cursor__img--black" src="/images/ui/cursor.svg" alt="" width={84} height={84} />
      <img className="site-cursor__img site-cursor__img--red" src="/images/ui/cursor-image.svg" alt="" width={84} height={84} />
    </div>,
    document.documentElement,
  );
}
