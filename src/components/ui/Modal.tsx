import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Centred overlay window for Figma frames (LOOK, 장바구니). The frame keeps its design size (w × h design px) and is
 * scaled down to fit the viewport (--ms = px per design px, at most 1). Children are placed with mbox() / mfs().
 * Closes on Escape and on a click outside the frame (no backdrop is designed — the page stays visible, not dimmed).
 * Page scroll is locked while open; focus moves into the frame and returns to the opener on close.
 */
export function Modal({ label, w, h, onClose, className = '', children }: {
  label: string; w: number; h: number; onClose: () => void; className?: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={`modal__frame ${className}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
        style={{ '--mw': w, '--mh': h } as CSSProperties}>
        {children}
      </div>
    </div>,
    // mounted on <html>: <body> is a size container, which would make it the containing block of position: fixed
    document.documentElement,
  );
}

/** absolute box inside a modal frame, in design px */
export const mbox = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  position: 'absolute',
  left: `calc(${x} * var(--ms))`,
  top: `calc(${y} * var(--ms))`,
  ...(w !== undefined ? { width: `calc(${w} * var(--ms))` } : {}),
  ...(h !== undefined ? { height: `calc(${h} * var(--ms))` } : {}),
});

/** font size in design px, never below 9px */
export const mfs = (px: number): CSSProperties => ({ fontSize: `max(9px, calc(${px} * var(--ms)))` });
