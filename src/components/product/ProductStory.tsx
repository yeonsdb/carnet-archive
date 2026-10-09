import { Frame, Glyph, Pic, T } from '../../lib/artboard';
import './ProductStory.css';

const DESC_D = 'A LIGHTLY PADDED QUILTED BOMBER JACKET FEATURING A SLIM CROPPED SILHOUETTE, DISTINCTIVE NECKBAND DETAIL,\nDISTRESSED ELBOW PATCHES,            AND THREE SIGNATURE SCORCHED-BLACK METAL PLATES AT THE CENTER BACK,\nCOMPLETING CARNET-ARCHIVE’S                                                      EXPERIMENTAL AESTHETIC.';
const DESC_M = 'A LIGHTLY PADDED QUILTED BOMBER JACKET FEATURING A SLIM    CROPPED \nSILHOUETTE, DISTINCTIVE NECKBAND DETAIL, DISTRESSED ELBOW  PATCHES,\nAND THREE SIGNATURE SCORCHED-BLACK METAL PLATES AT THE CENTER BACK,\nCOMPLETING CARNET-ARCHIVE’S                 EXPERIMENTAL AESTHETIC.';

/**
 * Section / Product Info / Anchor=product-info — D 1228:772 · M 1228:773.
 * Editorial 01 / 02 carry a Figma NOISE effect → 2x Figma renders (r-story-editorial-*); Texture is the original image.
 * "상품 설명 더보기" has no expanded design → visual only.
 */
export function ProductStory() {
  return (
    <>
      <Pic src="/images/product/r-story-editorial-02.webp" fit="fill" d={[288, 4133, 1345, 1795]} m={[16, 1526, 361, 482]} />
      <Pic src="/images/product/r-story-editorial-01.webp" fit="fill" d={[288, 2024, 1345, 1796]} m={[16, 959, 361, 482]} />
      <Pic src="/images/product/story-texture.webp" fit={[-0.45, -0.01, 100.45, 100.02]} d={[288, 3570, 1345, 641]} m={[16, 1375, 361, 172]} />
      <Frame className="pstory__overlay" d={[288, 3648, 1345, 339]} m={[16, 1409, 361, 103]} />

      {/* Decoration / Description Markers */}
      <Frame className="pstory__mark" d={[1546, 3879, 23, 23]} m={[353.3, 1487, 6.173, 6.173]} />
      <Frame className="pstory__mark pstory__mark--line" d={[1465, 3879, 10, 23]} m={[331.56, 1487, 2.684, 6.173]} />
      <Frame className="pstory__mark" d={[1448, 3879, 11, 23]} m={[327, 1487, 2.952, 6.173]} />

      <T fs={[16]} cls="f-mono w400 tr-4 c-inverse ta-r pre" d={[1577, 3711]} ax="r">{DESC_D}</T>
      <T fs={[8, 8]} cls="f-mono w400 tr-4 c-inverse pre" m={[61, 1423]}>{DESC_M}</T>

      <Frame className="pstory__fade" d={[288, 5537, 1345, 391]} m={[16, 1903, 361, 105]} />

      {/* Button / Expand Product Description */}
      <Frame as="span" className="stroke pstory__more" d={[829, 6055, 334, 81]} m={[109, 2063, 176, 48]} />
      <T fs={[16, 12]} cls="f-sans w400 tr-4" d={[934, 6086]} m={[146, 2080]}>상품 설명 더보기</T>
      <Glyph src="/images/product/chevron-more.svg" d={[1065.65, 6090.65, 18.7071, 10.0607]} />
      <Glyph src="/images/product/chevron-more-m.svg" m={[235.65, 2083.65, 12.7071, 7.0607]} />
    </>
  );
}
