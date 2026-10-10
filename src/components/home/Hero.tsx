import { Frame, Pic, Section, T } from '../../lib/artboard';
import { GlitchGroup } from '../motion/GlitchText';
import './Hero.css';

/**
 * Hero image + Wordmark — Desktop 1113:10499 / 1213:4240 · Mobile 1195:966–969.
 * Desktop: the image spans the full browser width (height as designed, object-fit cover crops); the wordmark keeps its
 * design size — CARNET 60 from the left edge, separator at the centre, ARCHIVE ending 60 from the right edge
 * (identical to the Figma frame at 1920 and below). Mobile keeps the 393 frame.
 * The hero image starts under the header (y 0); the slice begins at y 60 so the covered strip stays hidden.
 */
export function Hero() {
  return (
    <Section d={[60, 1020]} m={[60, 339]} label="CARNET-ARCHIVE" full>
      {/* desktop and mobile use different photos (feedback 2026-10-10); each is preloaded only for its own width (index.html) and
          the hidden one is never fetched (lazy + display: none) */}
      {/* desktop photo starts right under the header (y 60, not under it) so the raised hand is not cut (feedback 2026-10-11) */}
      <Pic src="/images/home/hero.webp" fit="cover" className="hero__img" d={[0, 60, 1920, 1020]} />
      <Pic src="/images/home/hero-m.webp" fit="cover" m={[-133, 60, 602, 339]} />
      <h1 className="sr-only">CARNET-ARCHIVE</h1>
      {/* Wordmark / Reveal=Left To Right Glitch (D 1213:4240 · M 1195:967–969 bounds): one reveal for the whole group */}
      <GlitchGroup className="hero__wordmark" d={[60, 877, 1800, 203]} m={[16, 60, 361, 339]}>
        <T as="span" fs={[170, 48]} cls="f-sans w800 c-inverse hero__carnet" d={[60, 877]} m={[16, 60]}>CARNET</T>
        <Frame className="hero__separator hero__sep" d={[909, 978, 102]} m={[60, 366.5, 48]} />
        <T as="span" fs={[170, 48]} cls="f-sans w800 c-inverse hero__archive" d={[1103, 877]} m={[163, 342]}>ARCHIVE</T>
      </GlitchGroup>
    </Section>
  );
}
