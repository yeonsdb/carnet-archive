import { place } from '../../lib/artboard';
import './CategoryNav.css';

export type CategoryKey = 'all' | 'outerwear';

/** Navigation / Shop Categories — Desktop 1228:764 · Mobile 1228:765 (component set 1124:12447). */
const ITEMS: { key: CategoryKey | 'bottoms' | 'tops' | 'acc'; label: string; dy: number; my: number; mh: number; active: boolean }[] = [
  { key: 'all', label: 'ALL', dy: 273, my: 117, mh: 27, active: true },
  { key: 'outerwear', label: 'OUTERWEAR', dy: 326, my: 145.15, mh: 27.516, active: true },
  // no products in these categories (empty state not designed) → not clickable, colour change on hover only
  { key: 'bottoms', label: 'BOTTOMS', dy: 379, my: 174, mh: 27, active: false },
  { key: 'tops', label: 'TOPS', dy: 432, my: 202, mh: 28, active: false },
  { key: 'acc', label: 'ACC', dy: 485, my: 231, mh: 27, active: false },
];

/**
 * S-1 Category Link: ALL / OUTERWEAR — hover → State=Hover (Pretendard 800), click selects.
 * State=Selected (red, two square markers) is the current category and is distinct from hover.
 * BOTTOMS / TOPS / ACC — not interactive; hover changes the colour only (accent).
 * Helvetica Neue Heavy in the Selected design is mapped to Pretendard 800 (font policy).
 */
export function CategoryNav({ value, onChange }: { value: CategoryKey; onChange: (k: CategoryKey) => void }) {
  return (
    <nav aria-label="Shop categories">
      <ul>
        {ITEMS.map((it) => {
          const selected = value === it.key;
          const p = place({ d: [60, it.dy, 215, 51], m: [16, it.my, 116, it.mh] }, `catlink${selected ? ' is-selected' : ''}${it.active ? '' : ' is-inert'}`);
          const content = (
            <>
              <span className="catlink__marker" aria-hidden="true" />
              <span className="catlink__label">{it.label}</span>
            </>
          );
          return (
            <li key={it.key} className={p.className} style={p.style}>
              {it.active ? (
                <button type="button" className="catlink__btn" aria-pressed={selected} onClick={() => onChange(it.key as CategoryKey)}>{content}</button>
              ) : (
                <span className="catlink__btn" aria-disabled="true">{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
