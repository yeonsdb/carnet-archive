import { Pic, Section, T } from '../../lib/artboard';
import './BrandCampaign.css';

const FORM_STUDY = [
  'CARNET-ARCHIVE / AW26 ',
  'FORM STUDY / STRUCTURE 01 ',
  'ALTERED VOLUME / LAYERED CONSTRUCTION ',
  'MATERIAL TRACE / RAW SURFACE ',
  'DISTORTION WITHIN REFINED STRUCTURE ',
  'DOCUMENTED / ARCHIVED / 2026',
].join('\n');

/**
 * 05 / Brand Campaign — Desktop 1113:10535 · Mobile 1195:1165.
 * Background: 2x Figma render (crop, colour adjustment and noise baked in); on mobile the 520-wide image is centred and cropped by the section.
 * No Home interaction is specified for this section (the typewriter note belongs to SHOP).
 */
export function BrandCampaign() {
  return (
    <Section d={[5064, 770]} m={[2268, 209]} label="Campaign">
      <Pic src="/images/home/r-campaign.webp" fit="fill" d={[0, 5064, 1920, 770]} m={[-59, 2268, 520, 208.542]} />
      <T as="h2" fs={[54, 10]} cls="f-display w700 c-inverse ta-c pre" d={[950.5, 5112]} m={[198, 2281]} ax="c">
        {'REFINED STRUCTURE MEETS RAW TEXTURES AND UTILITY DETAILS\nA DISTINCTIVE CONTRAST DEFINING CARNET-ARCHIVE'}
      </T>
      <T fs={[22, 10]} cls="f-mono w500 c-inverse ta-c pre" d={[959, 5438]} m={[200, 2357]} ax="c">{FORM_STUDY}</T>
      <T fs={[14, 8]} cls="f-sans w600 c-accent campaign__index" d={[968, 5355]} m={[199, 2335]} ax="r" max="c">22</T>
      <T fs={[14, 8]} cls="f-sans w600 c-accent campaign__index" d={[968, 5680]} m={[199.5, 2441]} ax="r" max="c">19</T>
      <T fs={[14, 8]} cls="f-sans w600 c-accent campaign__index" d={[592, 5518]} m={[53.5, 2389]} ax="r" max="c">17</T>
      <T fs={[14, 8]} cls="f-sans w600 c-accent campaign__index" d={[1342, 5518]} m={[333.5, 2389]} ax="r" max="c">18</T>
    </Section>
  );
}
