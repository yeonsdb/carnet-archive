import { Frame, Pic, Section, T } from '../../lib/artboard';
import { GlitchGroup } from '../motion/GlitchText';
import './Hero.css';

/**
 * Hero image + Wordmark — Desktop 1113:10499 / 1213:4240 · Mobile 1195:966–969.
 * The hero image starts under the header (y 0); the slice begins at y 60 so the covered strip stays hidden.
 */
export function Hero() {
  return (
    <Section d={[60, 1020]} m={[60, 339]} label="CARNET-ARCHIVE">
      <Pic src="/images/home/hero.webp" fit="cover" loading="eager" d={[0, 0, 1920, 1080]} m={[-133, 60, 602, 339]} />
      <h1 className="sr-only">CARNET-ARCHIVE</h1>
      {/* Wordmark / Reveal=Left To Right Glitch (D 1213:4240 · M 1195:967–969 bounds): one reveal for the whole group */}
      <GlitchGroup d={[60, 877, 1800, 203]} m={[16, 60, 361, 339]}>
        <T as="span" fs={[170, 48]} cls="f-sans w800 c-inverse" d={[60, 877]} m={[16, 60]}>CARNET</T>
        <Frame className="hero__separator" d={[909, 978, 102]} m={[60, 366.5, 48]} />
        <T as="span" fs={[170, 48]} cls="f-sans w800 c-inverse" d={[1103, 877]} m={[163, 342]}>ARCHIVE</T>
      </GlitchGroup>
    </Section>
  );
}
