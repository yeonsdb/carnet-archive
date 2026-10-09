import type { CSSProperties } from 'react';
import { place } from '../../lib/artboard';
import { TABS, TAB_BARS, type TabKey } from '../../data/productDetail';
import './SectionTabs.css';

/** Scroll so the target section's own tab bar (its anchor) reaches the top of the viewport. */
export function scrollToSection(key: TabKey) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(key)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/**
 * Tab Bar / Active=… / Click=Scroll To Anchor — D 1124:12567 (4 bars of 4 × 449.75 × 61) · M 1213:2777 etc. (361 × 32).
 * The bar is repeated at the top of each section and doubles as that section's anchor (id = section key).
 * Active tab: black frame (left / right / top); inactive: #8B8B8B bottom line (DS: mobile inactive unified to #8B8B8B).
 */
export function SectionTabs({ active }: { active: TabKey }) {
  const bar = TAB_BARS.find((b) => b.active === active)!;
  const p = place({ d: [60, bar.d.y, 1799, 61], m: [16, bar.m.y, 361, 32] }, 'ptabs');
  return (
    <nav id={active} className={p.className} style={p.style} aria-label="상품 정보 탭">
      {TABS.map((tab, i) => {
        const vars = {
          '--tw': 449.75,
          '--mtw': bar.m.widths[i],
          '--lx': bar.d.labelX[i] - (60 + 449.75 * i),
          '--mlx': bar.m.labelX[i],
        } as CSSProperties;
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            className={`ptabs__tab${isActive ? ' is-active' : ''}`}
            style={vars}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => scrollToSection(tab.key)}
          >
            <span className="ptabs__label tr-4">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
