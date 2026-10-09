import { Frame, T } from '../../lib/artboard';
import { RETURN_CONDITIONS, STYLIST_POLICY } from '../../data/productDetail';

const POLICY_D: [number, number][] = [[667, 10119], [723, 10148], [738, 10177]];
const POLICY_M: [number, number][] = [[51, 4086], [86, 4101], [95, 4116]];
const COND_Y_D = [10370, 10401, 10432, 10463];
const COND_Y_M = [4179, 4194, 4209, 4224];

/** Square bullet (Decoration / 05–08): text top + 6 (desktop, 10 × 10) · + 2 (mobile, 6 × 6) */
function Bullet({ d, m }: { d: number; m: number }) {
  return <Frame className="stroke" d={[692, d + 6, 10, 10]} m={[123, m + 2, 6, 6]} />;
}

/** Section / Purchase Guide / Anchor=purchase-guide — D 1124:11954 · M 1228:775 */
export function PurchaseGuide() {
  return (
    <>
      {/* Notice */}
      <Frame className="fill-inverse" d={[212, 9965, 1496, 308]} m={[16, 4025, 362, 122]} />
      <T fs={[24, 12]} cls="f-sans w700 tr-4 lh-13 c-inverse" d={[960.5, 10025]} m={[197.5, 4042]} ax="c">*</T>
      <T as="h2" fs={[24, 12]} cls="f-sans w700 tr-4 lh-13 c-inverse" d={[960.5, 10050]} m={[197, 4058]} ax="c">NOTICE</T>
      {STYLIST_POLICY.map((line, i) => (
        <T key={line} fs={[16, 8]} cls="f-sans w400 tr-4 lh-13 c-inverse" d={POLICY_D[i]} m={POLICY_M[i]}>{line}</T>
      ))}

      {/* Returns */}
      <Frame className="stroke" d={[212, 10322, 1496, 209]} m={[16, 4165, 362, 83]} />
      <Frame className="stroke" d={[212, 10530, 1496, 209]} m={[16, 4247, 362, 81]} />
      <Frame className="vrule" d={[646.5, 10322, 0, 209]} m={[107.75, 4165, 0, 163]} />
      <Frame className="vrule" d={[646.5, 10530, 0, 209]} />
      <T as="h3" fs={[16, 10]} cls="f-sans tr-4 pg-label" d={[428.5, 10418]} m={[62, 4201]} ax="c">교환 &amp; 반품 조건</T>
      <T as="h3" fs={[16, 10]} cls="f-sans tr-4 pg-label" d={[429, 10626]} m={[62.5, 4282]} ax="c">반품 입고처 주소</T>

      {RETURN_CONDITIONS.map((line, i) => (
        <div key={line}>
          <Bullet d={COND_Y_D[i]} m={COND_Y_M[i]} />
          <T fs={[16, 8]} cls="f-sans w400 tr-4 lh-13 pre" d={[716, COND_Y_D[i]]} m={[137, COND_Y_M[i]]}>{line}</T>
        </div>
      ))}

      <Bullet d={10609} m={4275} />
      <T fs={[16]} cls="f-sans w400 tr-4 lh-13 pre" d={[716, 10609]}>서울시 중랑구 동일로 815, 3F (02017)      카르넷아카이브</T>
      <Frame className="vrule" d={[956.5, 10612, 0, 13]} />
      <T fs={[8, 8]} cls="f-sans w400 tr-4 lh-13" m={[137, 4275]}>서울시 중랑구 동일로 815, 3F (02017) ㅣ 카르넷아카이브</T>
      <Bullet d={10640} m={4290} />
      <T fs={[16, 8]} cls="f-sans w400 tr-4 lh-13 pre" d={[716, 10640]} m={[137, 4290]}>Tel. 050 6963 5129 </T>
    </>
  );
}
