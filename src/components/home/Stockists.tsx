import { Frame, Pic, Section, T, place } from '../../lib/artboard';
import { Arrow } from '../ui/Arrow';
import { RotatedText } from '../ui/Rotated';
import './Stockists.css';

const STOCKISTS = [
  { name: 'SAMPLAS', city: 'SEOUL' },
  { name: 'GALLERIA DEPT EAST : G.STREET 494', city: 'SEOUL' },
  { name: 'BOON THE SHOP', city: 'SEOUL' },
  { name: '8DIVISION', city: 'SEOUL' },
  { name: 'EMPTY', city: 'SEOUL' },
];

/**
 * Stockist Row — component set Desktop 1113:10965 / Mobile 1195:1266.
 * H-8: hover → store name #831A1F SemiBold and gap 4 → 2 (State=Hover); index and city unchanged.
 */
function StockistRow({ index, name, city, dy, my }: { index: number; name: string; city: string; dy: number; my: number }) {
  const p = place({ d: [1031, dy, 812, 33], m: [16, my, 361, 17] }, 'stockist');
  return (
    <li className={p.className} style={p.style}>
      <span className="stockist__content">
        <span className="stockist__name">{name}</span>
        <span className="stockist__city">{city}</span>
      </span>
      <span className="stockist__index">{String(index).padStart(2, '0')}</span>
    </li>
  );
}

/** 07 / Stockists — Desktop 1228:761 · Mobile 1228:762. "VIEW ALL" has no target — visual only. */
export function Stockists() {
  return (
    <Section d={[7315, 897]} m={[3164, 588]} label="Stockists">
      <Pic src="/images/home/r-stockists.webp" fit="fill" d={[60, 7451, 900, 511]} m={[16, 3198, 361, 205]} />
      <T as="h2" fs={[80, 20]} cls="f-display w600" d={[60, 7315]} m={[16, 3164]}>STOCKISTS</T>

      {[7452, 7553, 7656, 7758, 7860, 7962].map((y) => (
        <Frame key={y} className="rule" d={[960, y, 900]} />
      ))}
      {[3453, 3503, 3553, 3603, 3653].map((y) => (
        <Frame key={y} className="rule" m={[16, y, 361]} />
      ))}

      <ul className="stockists__list">
        {STOCKISTS.map((s, i) => (
          <StockistRow key={s.name} index={i + 1} name={s.name} city={s.city} dy={7486 + i * 101} my={3420 + i * 50} />
        ))}
      </ul>

      <RotatedText fs={[14]} deg={[-90]} cls="f-sans w300 tr-4 c-inverse ta-r stockists__viewall" d={[931, 7497, 15, 56]}>VIEW ALL</RotatedText>
      <Arrow variant="viewAll" rotate={90} color="var(--color-text-inverse)" d={[927.22, 7473.78, 21, 13.44]} />
    </Section>
  );
}
