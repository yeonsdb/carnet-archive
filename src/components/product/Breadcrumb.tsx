import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { T, place } from '../../lib/artboard';
import { DETAIL } from '../../data/productDetail';
import './Breadcrumb.css';

const fs = { '--fs': 14, '--mfs': 14 } as CSSProperties;

/**
 * Breadcrumb_Navigation — Figma 1273:7132 (desktop PRODUCT, y 101). IBM Plex Mono 14 (−4%):
 * HOME / SHOP / OUTER in #8B8B8B (links; OUTER = the SHOP outerwear list), current product in black.
 * No mobile design → desktop only.
 */
export function Breadcrumb() {
  const crumb = (label: string, to: string, x: number) => {
    const p = place({ d: [x, 101], ax: 'c' }, 't f-mono w400 tr-4 c-muted hover-accent pcrumb', fs);
    return <Link key={label} to={to} className={p.className} style={p.style}>{label}</Link>;
  };
  return (
    <nav aria-label="Breadcrumb" className="pcrumb-nav">
      {crumb('HOME', '/', 76)}
      {crumb('SHOP', '/shop', 133)}
      {crumb('OUTER', '/shop', 193)}
      {[100, 156, 221].map((x) => <T key={x} as="span" fs={[14]} cls="f-mono w400 tr-4 c-muted pcrumb" d={[x, 101]}>/</T>)}
      <T as="span" fs={[14]} cls="f-mono w400 tr-4 pcrumb" d={[238, 101]}>
        <span aria-current="page">{DETAIL.name}</span>
      </T>
    </nav>
  );
}
