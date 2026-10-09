import { Fragment } from 'react';
import { Frame, Section, T } from '../../lib/artboard';
import { Arrow } from '../ui/Arrow';
import './Footer.css';

/**
 * 08 / Footer — Desktop 1113:10599 (600 high) · Mobile 1213:3405 (276 high).
 * Coordinates are relative to the footer top. Font: IBM Plex Mono everywhere (Home footer is the reference;
 * the Helvetica Neue licence line in Shop / Product frames is unified to Plex Mono, see docs/IMPLEMENTATION_PLAN.md §8).
 * Legal links, e-mail addresses and the mobile CONTACT button have no target defined — not interactive.
 */

type Field = { label: string; d: number; m: number; vd: number; vm: number; value: string; valueM?: string };

const FIELDS: Field[] = [
  { label: 'COMPANY NAME:', d: 225, m: 32, vd: 195, vm: 99, value: 'CARNET ' },
  { label: 'OWNER:', d: 259, m: 50, vd: 128, vm: 57, value: 'HALYN KIM' },
  { label: 'PERSONAL INFO MANAGER:', d: 293, m: 68, vd: 282, vm: 153, value: 'HALYN KIM' },
  { label: 'EMAIL:', d: 388, m: 113, vd: 128, vm: 57, value: 'CARNET@CARNET-ARCHIVE.COM' },
  { label: 'ADDRESS:', d: 422, m: 131, vd: 147, vm: 69, value: '1102 516, BONGEUNSA-RO, GANGNAM-GU, SEOUL, REPUBLIC OF KOREA', valueM: '1102 516, BONGEUNSA-RO, GANGNAM-GU, SEOUL' },
  { label: 'BUSINESS REGISTRATION NUMBER:', d: 456, m: 149, vd: 349, vm: 195, value: '847-07-00714' },
];

const CONTACTS = [
  { label: 'GENERAL REQUESTS', value: 'CARNET@CARNETARCHIVE.COM', y: 289, x: 1630, anchor: 'l' as const },
  { label: 'SALES', value: 'SALES@CARNETARCHIVE.COM', y: 339, x: 1860, anchor: 'r' as const },
  { label: 'PRESS@CARNETARCHIVE.COM', value: 'PRESS@CARNETARCHIVE.COM', y: 389, x: 1860, anchor: 'r' as const },
  { label: 'E-SHOP', value: 'SHOP@CARNETARCHIVE.COM', y: 439, x: 1861, anchor: 'r' as const },
  { label: 'IG', value: '@CARNETARCHIVE', y: 489, x: 1861, anchor: 'r' as const },
];

export function Footer() {
  return (
    <Section as="footer" d={[0, 600]} m={[0, 276]} bandClassName="site-footer">
      {/* Navigation / Legal (desktop only) */}
      <T fs={[16]} cls="f-mono w500 c-inverse" d={[60, 126]}>TERMS OF USE</T>
      <T fs={[16]} cls="f-mono w500 c-inverse" d={[253, 126]}>PRIVACY POLICY</T>
      <T fs={[16]} cls="f-mono w500 c-inverse" d={[465, 126]}>CONFIRM ENTREPRENEUR INFORMATION</T>
      <Frame className="rule c-inverse" d={[60, 165, 1800]} />

      {/* Company information */}
      {FIELDS.map((f) => (
        <Fragment key={f.label}>
          <T fs={[16, 10]} cls="f-mono w600 c-inverse" d={[60, f.d]} m={[16, f.m]}>{f.label}</T>
          {f.valueM ? (
            <>
              <T fs={[16]} cls="f-mono w400 c-inverse" d={[f.vd, f.d]}>{f.value}</T>
              <T fs={[10, 10]} cls="f-mono w400 c-inverse" m={[f.vm, f.m]}>{f.valueM}</T>
            </>
          ) : (
            <T fs={[16, 10]} cls="f-mono w400 c-inverse pre" d={[f.vd, f.d]} m={[f.vm, f.m]}>{f.value}</T>
          )}
        </Fragment>
      ))}
      <T fs={[16, 10]} cls="f-mono w600 c-inverse" d={[60, 490]} m={[16, 167]}>BUSINESS LICENSE:</T>
      <T fs={[16, 10]} cls="f-mono w400 c-inverse tr-4" d={[234, 490]} m={[123, 167]}>제 2020 - 서울강남 - 03483호</T>
      <T fs={[16]} cls="f-mono w400 c-inverse" d={[476, 490]}>HOSTING BY SIXSHOP</T>

      {/* Content / Contact Directory — desktop list */}
      <T fs={[24]} cls="f-mono w700 c-inverse" d={[1152, 230]}>CONTACT</T>
      <Frame className="rule c-inverse" d={[1152, 274, 708]} />
      {CONTACTS.map((c) => (
        <Fragment key={c.label + c.y}>
          <T fs={[16]} cls="f-mono w600 c-inverse" d={[1152, c.y]}>{c.label}</T>
          <T fs={[16]} cls="f-mono w400 c-inverse" d={[c.x, c.y]} ax={c.anchor}>{c.value}</T>
          <Frame className="rule c-inverse" d={[1152, c.y + 35, 708]} />
        </Fragment>
      ))}

      {/* Content / Contact Directory — mobile button (visual only) */}
      <Frame className="site-footer__contact" m={[16, 205, 361, 48]} />
      <T fs={[16, 16]} cls="f-mono w700 c-inverse" m={[32, 219]}>CONTACT</T>
      <Arrow variant="navM" dir="right" m={[341, 224, 19, 12.16]} color="var(--color-text-inverse)" />
    </Section>
  );
}
