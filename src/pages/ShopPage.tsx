import { useMemo, useState, type CSSProperties } from 'react';
import { Frame, Glyph, Section, T, place } from '../lib/artboard';
import { PRODUCTS, type Product } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryNav, type CategoryKey } from '../components/shop/CategoryNav';
import { SortDropdown, type SortKey } from '../components/shop/SortDropdown';
import { Typewriter } from '../components/motion/Typewriter';
import './ShopPage.css';

/** Desktop grid slots (Product Card 01–10 positions, image area top-left; cards are 587 × 841). */
const SLOTS: readonly [number, number, number][] = [
  [60, 628, 587], [1273, 628, 587],
  [667, 1604, 586], [1273, 1604, 587],
  [60, 2580, 587], [1273, 2580, 587],
  [60, 3556, 587], [667, 3556, 586],
  [60, 4531, 587], [1273, 4531, 587],
];

const TYPEWRITER_TEXT = '//: A CONTINUOUS        PROCESS OF \nEXPERIMENTATION AND RECONSTRUCTION...';

function sortProducts(list: Product[], sort: SortKey) {
  if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
  return list; // 신상품순 = Figma order
}

/** Pagination / Products — only one page of products exists, so pages 2–5 and "next" are visual only. */
function Pagination({ d, m }: { d?: number; m?: number }) {
  const pages = [
    { n: 1, dx: 869, mx: 133 }, { n: 2, dx: 897, mx: 155 }, { n: 3, dx: 927, mx: 179 }, { n: 4, dx: 957, mx: 203 }, { n: 5, dx: 987, mx: 227 },
  ];
  return (
    <nav aria-label="Pagination" className="pagination">
      {pages.map((pg) => (
        <T key={pg.n} as="span" fs={[16, 14]} cls={`f-sans tr-4 pagination__page${pg.n === 1 ? ' is-current' : ''}`}
          d={d !== undefined ? [pg.dx, d] : undefined} m={m !== undefined ? [pg.mx, m] : undefined}>
          {pg.n}
        </T>
      ))}
      <Glyph src="/images/icons/page-next.svg" className="pagination__next" d={d !== undefined ? [1017, d + 6, 9, 9] : undefined} m={m !== undefined ? [251, m + 5, 9, 9] : undefined} />
    </nav>
  );
}

/**
 * SHOP — Desktop 1124:11259 (1920 × 6376) · Mobile 1195:1732 (393 × 4097).
 * Desktop keeps the asymmetric 3-column composition (cards fill the Figma slots in order).
 * Narrow screens list cards 01–06 (mobile frame) in 1 column; the Grid button switches to 2 columns.
 */
export function ShopPage() {
  const [category, setCategory] = useState<CategoryKey>('outerwear');
  const [sort, setSort] = useState<SortKey>('newest');
  const [columns, setColumns] = useState<1 | 2>(1);

  const products = useMemo(() => {
    const inCategory = PRODUCTS.filter((p) => category === 'all' || p.category === category);
    // ALL and OUTERWEAR both list every product (all ten products are outerwear)
    return sortProducts(inCategory, sort);
  }, [category, sort]);
  const mobileProducts = products.filter((p) => p.inMobile);

  const listToggle = place({ m: [16, 304, 14.789, 14.046] }, `viewtoggle viewtoggle--list${columns === 1 ? ' is-active' : ''}`);
  const gridToggle = place({ m: [40, 304, 14, 14] }, `viewtoggle viewtoggle--grid${columns === 2 ? ' is-active' : ''}`);

  return (
    <main className="shop">
      {/* Title, categories, view controls and sort (overflow visible so the open sort menu can overlap the grid) */}
      <Section d={[60, 568]} m={[60, 268.53]} className="shop__top" label="SHOP">
        <T as="h1" fs={[160, 40]} cls="f-display w700" d={[1426, 139]} m={[267, 76]}>SHOP</T>
        <CategoryNav value={category} onChange={setCategory} />

        {/* Desktop Decoration / 17–18 (view markers) and 19–21 (range bar): visual only, function not specified */}
        <Frame className="shop__deco-fill" d={[60, 144, 16, 16]} />
        <Frame className="shop__deco-line" d={[88, 144, 16, 16]} />
        <Frame className="shop__deco-line" d={[1672, 519, 8, 13]} m={[251, 243, 7, 7]} />
        <Frame className="shop__deco-line" d={[1686, 519, 22, 13]} m={[264, 243, 21, 7]} />
        <Frame className="shop__deco-fill" d={[1714, 519, 146, 13]} m={[293, 243, 84, 7]} />

        {/* Button / Product Layout / List · Grid (mobile) */}
        <button type="button" className={listToggle.className} style={listToggle.style} aria-label="1열로 보기" aria-pressed={columns === 1} onClick={() => setColumns(1)}>
          <span /><span />
        </button>
        <button type="button" className={gridToggle.className} style={gridToggle.style} aria-label="2열로 보기" aria-pressed={columns === 2} onClick={() => setColumns(2)}>
          <span /><span /><span /><span />
        </button>

        <SortDropdown value={sort} onChange={setSort} />
      </Section>

      {/* Desktop grid */}
      <Section d={[628, 5148]} m={[0, 0]} bandClassName="hide-m" label="Products">
        {products.map((p, i) => {
          const [x, y, w] = SLOTS[i];
          const s = place({ d: [x, y, w, 841] }, '');
          return <ProductCard key={p.id} product={p} className={s.className} style={s.style} />;
        })}
        <Typewriter text={TYPEWRITER_TEXT} fs={[16]} cls="f-mono w300" d={[778, 2951, 364, 42]} cursor={[1135, 2977, 7, 15]} />
        {products.length > 0 && <Pagination d={5521} />}
      </Section>

      {/* Narrow list (mobile frame) */}
      <div className="shop__list hide-d">
        <div className={`shop__grid shop__grid--${columns}`} style={{ '--cols': columns } as CSSProperties}>
          {mobileProducts.map((p) => <ProductCard key={p.id} product={p} className="shop__item" />)}
        </div>
        {mobileProducts.length > 0 && (
          <Section d={[0, 0]} m={[3703, 18]} className="shop__pager" label="Pagination">
            <Pagination m={3703} />
          </Section>
        )}
      </div>
    </main>
  );
}
