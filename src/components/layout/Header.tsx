import { useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { SiteMenu } from './SiteMenu';
import { Glyph, Section, place } from '../../lib/artboard';
import './Header.css';

/**
 * 00 / Header — Desktop 1115:624 · Mobile 1228:756.
 * Desktop: full browser width — menu icon 60px from the left edge, account + cart group with the cart 60px from the right
 * edge (gap as designed), wordmark at the exact centre of the window (feedback 2026-10-10). Mobile keeps the 393 frame.
 * Menu opens the menu panel (Figma 메뉴1 / 메뉴2). Account / Cart icons have no target design — not interactive.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = place({ d: [52, 16, 36, 28], m: [10, 18, 30, 24] }, 'site-header__menu site-header__l');
  const logo = place({ d: [959.5, 21], m: [196.5, 21], ax: 'c' }, 't f-sans w700 c-inverse site-header__logo', { '--fs': 16, '--mfs': 16 } as CSSProperties);
  return (
    <Section as="header" d={[0, 60]} m={[0, 60]} bandClassName="site-header" full>
      <Glyph src="/images/icons/menu.svg" d={[60, 24, 20, 12]} overflow={[4.17, 0]} className="site-header__l" />
      <Glyph src="/images/icons/menu-m.svg" m={[16, 24.89, 17.556, 10.533]} overflow={[4.75, 0]} />
      {/* hit area around the menu icon */}
      <button type="button" className={menuBtn.className} style={menuBtn.style} aria-label="메뉴 열기" aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)} />
      {menuOpen && createPortal(<SiteMenu onClose={() => setMenuOpen(false)} />, document.documentElement)}

      {/* the link itself is the positioned text box, so its hit area and focus ring match the wordmark */}
      <Link to="/" aria-label="CARNET-ARCHIVE 홈" {...logo}>CARNET-ARCHIVE</Link>

      <Glyph src="/images/icons/account.svg" d={[1799, 21, 20, 19]} className="site-header__r" />
      <Glyph src="/images/icons/account-m.svg" m={[322, 23.13, 17.556, 16.739]} />
      <Glyph src="/images/icons/cart.svg" d={[1840, 21, 20, 19]} className="site-header__r" />
      <Glyph src="/images/icons/cart-m.svg" m={[358, 23.13, 17.556, 16.678]} />
    </Section>
  );
}
