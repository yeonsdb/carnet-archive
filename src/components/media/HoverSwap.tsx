import { useState, type MouseEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pic, place, type Box, type Crop } from '../../lib/artboard';
import './HoverSwap.css';

export type SwapImage = { src: string; fit: 'fill' | 'cover' | Crop; d?: Box; m?: Box; alt?: string };

type Props = {
  base: SwapImage;
  hover: SwapImage;
  /** layers drawn under the state images, in Figma order (e.g. Tops underlay, captions) */
  under?: ReactNode;
  /** link target: the image area becomes a link and clicking the card's label (.hover-accent) follows it too */
  to?: string;
  /** accessible name of the link */
  label?: string;
};

/**
 * H-4 / S-3 Image swap: pointer enters the image area → State=Hover image, leaves → State=Default.
 * Mouse only (`pointerType === 'mouse'`); touch keeps the default image (hover is not forced, DEV SPEC).
 * Both state images are separate assets, never a merged render.
 * .hover-group: parts marked .hover-accent (e.g. the card label) turn #831A1F while the image is hovered.
 */
export function HoverSwap({ base, hover, under, to, label }: Props) {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const hit = place({ d: base.d, m: base.m }, `swap__hit hover-target${to ? ' swap__hit--link' : ''}`);
  const hitProps = {
    className: hit.className,
    style: hit.style,
    onPointerEnter: (e: { pointerType: string }) => e.pointerType === 'mouse' && setActive(true),
    onPointerLeave: () => setActive(false),
  };
  // label click → same target (the image area itself is a real <Link>, focusable for keyboards)
  const onGroupClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!to || (e.target as Element).closest('a')) return;
    if ((e.target as Element).closest('.hover-accent')) navigate(to);
  };
  return (
    <div className={`hover-group${to ? ' hover-group--link' : ''}`} onClick={onGroupClick}>
      {under}
      <Pic {...base} className="swap__base" />
      <Pic {...hover} className={`swap__hover${active ? ' is-active' : ''}`} />
      {to ? <Link to={to} aria-label={label ?? base.alt} {...hitProps} /> : <div aria-hidden="true" {...hitProps} />}
    </div>
  );
}
