import { useEffect, useRef, useState } from 'react';
import { place } from '../../lib/artboard';
import './SortDropdown.css';

export type SortKey = 'newest' | 'price-asc' | 'price-desc';

const OPTIONS: { key: SortKey | 'reviews' | 'sales'; label: string; enabled: boolean }[] = [
  { key: 'newest', label: '신상품순', enabled: true },
  { key: 'price-asc', label: '낮은 가격순', enabled: true },
  { key: 'price-desc', label: '높은 가격순', enabled: true },
  // review / sales data is not supplied (component description) → shown but disabled
  { key: 'reviews', label: '후기순', enabled: false },
  { key: 'sales', label: '판매량순', enabled: false },
];

/**
 * Sort Dropdown / States (1124:11575): Closed 106 × 30 → Open 106 × 225. Mobile closed 84 × 30 (1213:2326);
 * the mobile open state is not designed and uses the desktop composition scaled to 84 wide.
 * "FILTER" (Helvetica Neue in Figma) is set in Pretendard.
 */
export function SortDropdown({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const p = place({ d: [1754, 584, 106, open ? 225 : 30], m: [293, 288, 84, open ? 178.3 : 30] }, `sort${open ? ' is-open' : ''}`);
  return (
    <div ref={root} className={p.className} style={p.style}>
      <button type="button" className="sort__trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="sort__label">FILTER</span>
        <span className="sort__chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul className="sort__list" role="listbox" aria-label="정렬">
          {OPTIONS.map((o) => (
            <li key={o.key} role="option" aria-selected={o.key === value} aria-disabled={!o.enabled}
              className={`sort__option${o.key === value ? ' is-selected' : ''}${o.enabled ? '' : ' is-disabled'}`}
              onClick={() => { if (!o.enabled) return; onChange(o.key as SortKey); setOpen(false); }}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
