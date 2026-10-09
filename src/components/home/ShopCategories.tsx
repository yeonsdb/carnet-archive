import { Pic, Section, T } from '../../lib/artboard';
import { HoverSwap } from '../media/HoverSwap';

const img = (name: string) => `/images/home/${name}.webp`;

/**
 * 04 / Shop Categories — Desktop 1115:625 · Mobile 1213:3406.
 * Cards keep the Figma layer order. Every card (image and label) opens SHOP (feedback 2026-10-10) — SHOP has one list
 * (OUTERWEAR = all products; ALL / BOTTOMS / TOPS / ACC are not selectable there). Hover swaps the image;
 * while a card image is hovered its label turns #831A1F (feedback 2026-10-10).
 * Most state images carry Figma image adjustments, so their 2x node renders (r-*) are used with 'fill'.
 * Arrays = Figma CROP imageTransform converted to % (see CurrentCollection).
 */
export function ShopCategories() {
  return (
    <Section d={[2865, 2199]} m={[1161, 1107]} label="Shop categories">
      {/* Category Card / Bottoms */}
      <HoverSwap to="/shop"
        base={{ src: img('r-cat-bottoms-default'), fit: 'fill', d: [545, 3875, 465, 357], m: [201, 1733.52, 175.878, 135.216], alt: 'BOTTOMS' }}
        hover={{ src: img('r-cat-bottoms-hover'), fit: 'fill', d: [545, 3875, 465, 357], m: [201.12, 1733.52, 175.878, 135.216] }}
        under={<T fs={[24, 14]} cls="f-sans w500 tr-4 hover-accent" d={[545, 4247]} m={[201, 1874.71]}>BOTTOMS</T>}
      />

      {/* Category Card / Outerwear */}
      <HoverSwap to="/shop"
        base={{ src: img('r-cat-outerwear-default'), fit: 'fill', d: [60, 3875, 465, 357], m: [16, 1734, 177, 135.89], alt: 'OUTERWEAR' }}
        hover={{ src: img('r-cat-outerwear-hover'), fit: 'fill', d: [60, 3875, 465, 357], m: [16, 1734, 177, 135.89] }}
        under={<T fs={[24, 14]} cls="f-sans w500 tr-4 hover-accent" d={[60, 4247]} m={[16, 1875.8]}>OUTERWEAR</T>}
      />

      {/* Category Card / Tops: underlay, caption and label sit under the state images */}
      <HoverSwap to="/shop"
        under={
          <>
            <Pic src={img('cat-tops-underlay')} fit={[-10.45, 0, 235.88, 100]} d={[1152, 3875, 708, 944]} m={[201, 1911.71, 176, 234.667]} />
            <T fs={[16]} cls="f-sans w400 tr-42" d={[1829, 4062]}>ACC</T>
            <T fs={[24, 14]} cls="f-sans w500 tr-42 hover-accent" d={[1152, 4835]} m={[201, 2150.71]}>TOPS</T>
          </>
        }
        base={{ src: img('r-cat-tops-default'), fit: 'fill', d: [1152, 3875, 708, 944], m: [201, 1911.71, 176, 234.666], alt: 'TOPS' }}
        hover={{ src: img('r-cat-tops-hover'), fit: 'fill', d: [1152, 3875, 708, 944], m: [201, 1911.71, 176, 234.667] }}
      />

      {/* Category Card / All */}
      <HoverSwap to="/shop"
        base={{ src: img('r-cat-all-default'), fit: 'fill', d: [60, 3001, 587, 783], m: [16, 1204, 361, 481.538], alt: 'ALL' }}
        hover={{ src: img('r-cat-all-hover'), fit: 'fill', d: [60, 3001, 587, 783], m: [16, 1204, 361, 481.538] }}
        under={<T fs={[24, 14]} cls="f-sans w500 tr-4 hover-accent" d={[60, 3801]} m={[16, 1696.52]}>ALL</T>}
      />

      {/* Category Card / Accessories (label is under the images in Figma) */}
      <HoverSwap to="/shop"
        under={<T fs={[24, 14]} cls="f-sans w500 tr-4 hover-accent" d={[1273, 3467]} m={[16, 2053]}>ACC</T>}
        base={{ src: img('cat-acc-default'), fit: [-2.31, -55.08, 104.75, 155], d: [1273, 3001, 587, 451], m: [16, 1912, 176.943, 136.035], alt: 'ACCESSORIES' }}
        hover={{ src: img('r-cat-acc-hover'), fit: 'fill', d: [1273, 3001, 587, 451], m: [16.06, 1912, 176.943, 136.035] }}
      />

      <T as="h2" fs={[80, 20]} cls="f-display w600" d={[1642, 2865]} m={[322, 1161]}>SHOP</T>
    </Section>
  );
}
