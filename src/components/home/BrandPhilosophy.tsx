import { Frame, Glyph, Section, T } from '../../lib/artboard';
import './BrandPhilosophy.css';

/**
 * 03 / Brand Philosophy — Desktop 1113:10513 · Mobile 1213:3358.
 * Desktop statement lines keep their individual Figma positions; mobile is one right-aligned block.
 * Copy is kept exactly as designed (including "REVEEALS").
 */
const LINES: [string, number, number][] = [
  ['THOUGH  IT  MAY  APPEAR  UNFINISHED  AT', 1172, 2463],
  ['FIRST  GLANCE,', 1703, 2463],
  ['THE  CLOSER  YOU  LOOK,', 1230, 2485],
  ['THE  MORE  ITS  REFINEMENT REVEEALS', 1514, 2485],
  ['ITSELF.', 1243, 2507],
  ['THIS SUBTLE TENSION AND BALANCE LIE AT THE', 1452, 2507],
  ['CORE OF THE DESIGN.', 1172, 2529],
];

const STATEMENT_M =
  'THOUGH  IT  MAY  APPEAR  UNFINISHED  AT FIRST  GLANCE,THE  CLOSER  YOU  LOOK,THE  MORE  ITS  REFINEMENT REVEEALS ITSELF. THIS SUBTLE TENSION AND BALANCE LIE AT THE CORE OF THE DESIGN.';

export function BrandPhilosophy() {
  return (
    <Section d={[2372, 493]} m={[931, 230]} label="Brand Philosophy">
      <T fs={[22, 10]} cls="f-mono w500 pre bp__keyword" d={[60, 2413]} m={[16, 948]}>{'METICULOUS\nDESIGN'}</T>
      <T fs={[22, 10]} cls="f-mono w500 pre bp__keyword" d={[60, 2721]} m={[16, 1035]}>{'ROUGHNESS\nAND DELICACY'}</T>
      <T fs={[22, 10]} cls="f-mono w500 pre bp__keyword" d={[307, 2721]} m={[108, 1035]}>{'REFINED\nSTRUCTURES'}</T>

      <Glyph src="/images/home/symbol-01.svg" d={[60.1, 2463, 18.8, 16.7]} m={[16, 976, 10, 8]} />
      <Glyph src="/images/home/symbol-02.svg" d={[68.9, 2462.6, 22.1, 17.9]} m={[21, 975, 11, 9]} />
      <Glyph src="/images/home/symbol-03.svg" d={[104.4, 2463.8, 17.3, 15.9]} m={[39, 976, 8, 8]} />

      <Frame className="bp__fill" d={[60, 2372, 16, 16]} m={[16, 931, 8, 8]} />
      <Frame className="bp__line" d={[299, 2372, 8, 16]} m={[134, 931, 3, 8]} />
      <Frame className="bp__fill" d={[314, 2372, 8, 16]} m={[141, 931, 4, 8]} />
      <Frame className="bp__line" d={[1844, 2372, 16, 16]} m={[369, 931, 8, 8]} />
      <Frame className="bp__fill" d={[1844, 2749, 16, 16]} m={[369, 1050, 8, 8]} />

      {LINES.map(([text, x, y]) => (
        <T key={text} fs={[16]} cls="f-mono w400 tr-4 pre" d={[x, y]}>{text}</T>
      ))}
      <T fs={[10, 10]} cls="f-mono w400 tr-4 pre-wrap ta-r bp__statement-m" m={[377, 948, 198, 111]} ax="r">{STATEMENT_M}</T>
    </Section>
  );
}
