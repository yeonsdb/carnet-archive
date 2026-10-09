import { place } from '../../lib/artboard';
import './CategoryNav.css';

export type CategoryKey = 'all' | 'outerwear' | 'bottoms' | 'tops' | 'acc';

/** Navigation / Shop Categories — Desktop 1228:764 · Mobile 1228:765 (component set 1124:12447). */
const ITEMS: { key: CategoryKey; label: string; dy: number; my: number; mh: number }[] = [
  { key: 'all', label: 'ALL', dy: 273, my: 117, mh: 27 },
  { key: 'outerwear', label: 'OUTERWEAR', dy: 326, my: 145.15, mh: 27.516 },
  { key: 'bottoms', label: 'BOTTOMS', dy: 379, my: 174, mh: 27 },
  { key: 'tops', label: 'TOPS', dy: 432, my: 202, mh: 28 },
  { key: 'acc', label: 'ACC', dy: 485, my: 231, mh: 27 },
];

/**
 * S-1 Category Link: hover → State=Hover (Pretendard 800), leave → Default (Pretendard 700).
 * State=Selected (red, two square markers) is the current category and is distinct from hover.
 * Helvetica Neue Heavy in the Selected design is mapped to Pretendard 800 (font policy).
 */
export function CategoryNav({ value, onChange }: { value: CategoryKey; onChange: (k: CategoryKey) => void }) {
  return (
    <nav aria-label="Shop categories">
      <ul>
        {ITEMS.map((it) => {
          const p = place({ d: [60, it.dy, 215, 51], m: [16, it.my, 116, it.mh] }, `catlink${value === it.key ? ' is-selected' : ''}`);
          return (
            <li key={it.key} className={p.className} style={p.style}>
              <button type="button" className="catlink__btn" aria-pressed={value === it.key} onClick={() => onChange(it.key)}>
                <span className="catlink__marker" aria-hidden="true" />
                <span className="catlink__label">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
