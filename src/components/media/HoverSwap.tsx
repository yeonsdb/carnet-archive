import { useState, type ReactNode } from 'react';
import { Pic, place, type Box, type Crop } from '../../lib/artboard';
import './HoverSwap.css';

export type SwapImage = { src: string; fit: 'fill' | 'cover' | Crop; d?: Box; m?: Box; alt?: string };

type Props = {
  base: SwapImage;
  hover: SwapImage;
  /** layers drawn under the state images, in Figma order (e.g. Tops underlay, captions) */
  under?: ReactNode;
};

/**
 * H-4 / S-3 Image swap: pointer enters the image area → State=Hover image, leaves → State=Default.
 * Mouse only (`pointerType === 'mouse'`); touch keeps the default image (hover is not forced, DEV SPEC).
 * Both state images are separate assets, never a merged render.
 */
export function HoverSwap({ base, hover, under }: Props) {
  const [active, setActive] = useState(false);
  const hit = place({ d: base.d, m: base.m }, 'swap__hit hover-target');
  // .hover-group: parts marked .hover-accent (e.g. the card label) turn #831A1F while the image is hovered
  return (
    <div className="hover-group">
      {under}
      <Pic {...base} className="swap__base" />
      <Pic {...hover} className={`swap__hover${active ? ' is-active' : ''}`} />
      <div
        className={hit.className}
        style={hit.style}
        aria-hidden="true"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(true)}
        onPointerLeave={() => setActive(false)}
      />
    </div>
  );
}
