import { Link } from 'react-router-dom';
import { Glyph, Section, T } from '../../lib/artboard';
import './Header.css';

/**
 * 00 / Header — Desktop 1115:624 · Mobile 1228:756.
 * Menu / Account / Cart have no target design yet (menu is scheduled last), so they are not interactive.
 */
export function Header() {
  return (
    <Section as="header" d={[0, 60]} m={[0, 60]} bandClassName="site-header">
      <Glyph src="/images/icons/menu.svg" d={[60, 24, 20, 12]} overflow={[4.17, 0]} />
      <Glyph src="/images/icons/menu-m.svg" m={[16, 24.89, 17.556, 10.533]} overflow={[4.75, 0]} />

      <Link to="/" className="site-header__logo" aria-label="CARNET-ARCHIVE 홈">
        <T as="span" fs={[16, 16]} cls="f-sans w700 c-inverse" d={[959.5, 21]} m={[196.5, 21]} ax="c">
          CARNET-ARCHIVE
        </T>
      </Link>

      <Glyph src="/images/icons/account.svg" d={[1799, 21, 20, 19]} />
      <Glyph src="/images/icons/account-m.svg" m={[322, 23.13, 17.556, 16.739]} />
      <Glyph src="/images/icons/cart.svg" d={[1840, 21, 20, 19]} />
      <Glyph src="/images/icons/cart-m.svg" m={[358, 23.13, 17.556, 16.678]} />
    </Section>
  );
}
