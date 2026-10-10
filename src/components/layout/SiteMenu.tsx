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
  // logo 33 below the last row, frame ends 19 below it (메뉴1 446 / 메뉴2 701)
  return { rows, logoY: y + 33, height: y + 87 };
}

const px = (v: number) => `calc(${v} * var(--u))`;
/** x measured from the menu edge line (design x 60 = --edge) */
const ex = (v: number) => `calc(var(--edge) + ${v - 60} * var(--u))`;

/**
 * Menu panel — Figma 메뉴1 (1287:919, closed SHOP) / 메뉴2 (1287:832, SHOP open), 338 wide, top-left over the header.
 * - Every main item turns its box #831A1F and scrolls HOME to its section; SHOP also opens / closes its sub-menu
 *   (ALL · OUTERWEAR · TOPS · BOTTOMS · ACC).
 * - Sub-menu items open SHOP (one product list) and close the menu.
 * - Logo (35 × 35) at the bottom right, 33 below the last row.
 * - Every text turns #831A1F on hover (except on the #831A1F box itself), white again when the cursor leaves.
 * - CLOSE, Escape or a click outside the panel closes it.
 */
export function SiteMenu({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<Key | null>(null);
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { rows, logoY, height } = layout(active === 'shop');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node) && !(e.target as Element).closest?.('.site-header__menu')) onClose(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.querySelector<HTMLElement>('button')?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [onClose]);

  const pick = (key: Key) => {
    setActive((a) => (key === 'shop' && a === 'shop' ? null : key));
    navigate(`/#${key}`);
  };

  return (
    <nav ref={ref} className="site-menu" aria-label="메뉴" style={{ height: px(height) } as CSSProperties}>
      <button type="button" className="site-menu__close" onClick={onClose}>
        <img src="/images/ui/close-menu.svg" alt="" style={{ left: ex(60.75), top: px(26.63), width: px(8.28), height: px(7.74) }} />
        <span className="site-menu__text site-menu__text--close" style={{ left: ex(79), top: px(22) }}>CLOSE</span>
      </button>
      {rows.map((r) => {
        const isActive = r.kind === 'main' && r.key === active;
        return (
          <button
            key={`${r.kind}-${r.key}`}
            type="button"
            className={`site-menu__row site-menu__row--${r.kind}${isActive ? ' is-active' : ''}`}
            style={{ top: px(r.y), height: px(r.h) }}
            aria-expanded={r.key === 'shop' ? active === 'shop' : undefined}
            onClick={() => (r.kind === 'main' ? pick(r.key as Key) : (navigate('/shop'), onClose()))}
          >
            <span className="site-menu__text" style={{ left: ex(60), top: px(16) }}>{r.label}</span>
          </button>
        );
      })}
      {/* logo — Figma image 11 / 12 (CROP: width 158.42 %, left −29.21 %, height 114.19 %, top −11.69 %) */}
      <span className="site-menu__logo" style={{ left: px(281), top: px(logoY), width: px(35), height: px(35) }} aria-hidden="true">
        <img src="/images/ui/menu-logo.webp" alt="" style={{ left: '-29.21%', top: '-11.69%', width: '158.42%', height: '114.19%' }} />
      </span>
    </nav>
  );
}
