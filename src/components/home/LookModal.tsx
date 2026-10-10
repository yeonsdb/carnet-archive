import { Modal, mbox, mfs } from '../ui/Modal';
import './LookModal.css';

type Img = { box: [number, number, number, number]; crop: [number, number, number, number] };

/** Figma CROP imageTransform [[a, 0, tx], [0, d, ty]] → [left, top, width, height] in % of the box */
const crop = (a: number, tx: number, d = 1, ty = 0): Img['crop'] => [(-tx / a) * 100, (-ty / d) * 100, 100 / a, 100 / d];

/**
 * AW26:[UNEARTH: FILE-2711] LOOK 00–08 — Figma frames 1289:1010 … (714 × 964). Each look is one photo (front + back)
 * shown twice with different crops: front on the left, back on the right.
 */
const LOOK_IMAGES: Record<string, [Img, Img]> = {
  '00': [{ box: [50, 107, 290, 795], crop: crop(0.20685, 0.16704, 1.00379) }, { box: [375, 110, 290, 792], crop: crop(0.20685, 0.641) }],
  '01': [{ box: [71, 107, 248, 792], crop: crop(0.17671, 0.17411) }, { box: [388, 107, 264, 792], crop: crop(0.18824, 0.64918) }],
  '02': [{ box: [45, 110, 300, 792], crop: crop(0.21429, 0.01972) }, { box: [370, 110, 300, 792], crop: crop(0.21429, 0.7567) }],
  '03': [{ box: [52, 110, 282, 792], crop: crop(0.20164, 0.17299) }, { box: [384, 107, 283, 792], crop: crop(0.20164, 0.63542) }],
  '04': [{ box: [46, 110, 286, 792], crop: crop(0.20387, 0.15476) }, { box: [388, 110, 263, 792], crop: crop(0.18787, 0.64807) }],
  '05': [{ box: [51, 107, 293, 792], crop: crop(0.20945, 0.17001) }, { box: [376, 107, 293, 792], crop: crop(0.20945, 0.62946) }],
  '06': [{ box: [38, 110, 318, 792], crop: crop(0.22677, 0.16481) }, { box: [384, 109, 286, 792], crop: crop(0.20413, 0.63799) }],
  '07': [{ box: [51, 110, 289, 792], crop: crop(0.2063, 0.01999) }, { box: [376, 107, 289, 792], crop: crop(0.2063, 0.77371) }],
  '08': [{ box: [55, 107, 281, 792], crop: crop(0.20089, 0.16629) }, { box: [377, 107, 287, 792], crop: crop(0.20461, 0.63281) }],
};

export function LookModal({ id, onClose }: { id: string; onClose: () => void }) {
  const title = `AW26:[UNEARTH: FILE-2711] LOOK ${id}`;
  const imgs = LOOK_IMAGES[id];
  return (
    <Modal label={title} w={714} h={964} onClose={onClose} className="look">
      {imgs.map((im, i) => (
        <div key={i} className="modal__img" style={mbox(...im.box)}>
          <img src={`/images/home/look-modal-${id}.webp`} alt={i === 0 ? `LOOK ${id} 앞` : `LOOK ${id} 뒤`}
            style={{ left: `${im.crop[0]}%`, top: `${im.crop[1]}%`, width: `${im.crop[2]}%`, height: `${im.crop[3]}%` }} />
        </div>
      ))}
      <div className="look__bar" style={mbox(0, 0, 714, 50)} />
      <span className="look__sq look__sq--fill" style={mbox(28, 21, 10, 10)} />
      <span className="look__sq look__sq--line" style={mbox(41, 21, 10, 10)} />
      <p className="look__title" style={{ ...mbox(61, 15), ...mfs(16) }}>{title}</p>
      <button type="button" className="look__close" style={mbox(670, 12, 28, 28)} aria-label="닫기" onClick={onClose}>
        <img src="/images/ui/close-look.svg" alt="" style={{ left: 'calc(7.44 * var(--ms))', top: 'calc(7.51 * var(--ms))', width: 'calc(12.899 * var(--ms))', height: 'calc(11.985 * var(--ms))' }} />
      </button>
    </Modal>
  );
}
