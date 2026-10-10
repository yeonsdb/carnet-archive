import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import './SiteMenu.css';

type Key = 'brand-info' | 'aw26' | 'shop' | 'collections' | 'stockists';
const MAIN: { key: Key; label: string }[] = [
  { key: 'brand-info', label: 'BRAND INFO' },
  { key: 'aw26', label: 'AW26' },
  { key: 'shop', label: 'SHOP' },
  { key: 'collections', label: 'COLLECTIONS' },
  { key: 'stockists', label: 'STOCKISTS' },
];
const SHOP_SUB = ['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'ACC'];

/** row tops in design px (Figma 메뉴1 / 메뉴2): 60-high main rows (SHOP sits 1px higher), 51-high SHOP rows */
function layout(shopOpen: boolean) {
  const rows: { kind: 'main' | 'sub'; key: string; label: string; y: number; h: number }[] = [];
  let y = 60;
  for (const m of MAIN) {
    if (m.key === 'shop') y -= 1;
    rows.push({ kind: 'main', key: m.key, label: m.label, y, h: 60 });
    y += 60;
    if (m.key === 'shop' && shopOpen) for (const s of SHOP_SUB) { rows.push({ kind: 'sub', key: s, label: s, y, h: 51 }); y += 51; }
  }
  return { rows, height: y + 7 }; // 메뉴1 366 / 메뉴2 621
}

const px = (v: number) => `calc(${v} * var(--u))`;

/**
 * Menu panel — Figma 메뉴1 (1287:919, closed SHOP) / 메뉴2 (1287:832, SHOP open), 338 wide, top-left over the header.
 * - SHOP opens / closes its sub-menu (ALL · OUTERWEAR · TOPS · BOTTOMS · ACC); the active main item's box is #831A1F.
 * - BRAND INFO · AW26 · COLLECTIONS · STOCKISTS: box turns #831A1F and the page scrolls to that HOME section.
 * - Sub-menu items open SHOP (one product list) and close the menu. ALL is shown in #831A1F as designed.
 * - Every text turns #831A1F on hover (except on the #831A1F box itself), white again when the cursor leaves.
 * - CLOSE, Escape or a click outside the panel closes it.
 */
export function SiteMenu({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<Key | null>(null);
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { rows, height } = layout(active === 'shop');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node) && !(e.target as Element).closest?.('.site-header__menu')) onClose(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.querySelector<HTMLElement>('button')?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [onClose]);

  const pick = (key: Key) => {
    if (key === 'shop') { setActive((a) => (a === 'shop' ? null : 'shop')); return; }
    setActive(key);
    navigate(`/#${key}`);
  };

  return (
    <nav ref={ref} className="site-menu" aria-label="메뉴" style={{ height: px(height) } as CSSProperties}>
      <button type="button" className="site-menu__close" onClick={onClose}>
        <img src="/images/ui/close-menu.svg" alt="" style={{ left: px(60.75), top: px(26.63), width: px(8.28), height: px(7.74) }} />
        <span className="site-menu__text site-menu__text--close" style={{ left: px(79), top: px(22) }}>CLOSE</span>
      </button>
      {rows.map((r) => {
        const isActive = r.kind === 'main' && r.key === active;
        return (
          <button
            key={`${r.kind}-${r.key}`}
            type="button"
            className={`site-menu__row site-menu__row--${r.kind}${isActive ? ' is-active' : ''}${r.kind === 'sub' && r.key === 'ALL' ? ' is-current' : ''}`}
            style={{ top: px(r.y), height: px(r.h) }}
            aria-expanded={r.key === 'shop' ? active === 'shop' : undefined}
            onClick={() => (r.kind === 'main' ? pick(r.key as Key) : (navigate('/shop'), onClose()))}
          >
            <span className="site-menu__text" style={{ left: px(60), top: px(16) }}>{r.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
