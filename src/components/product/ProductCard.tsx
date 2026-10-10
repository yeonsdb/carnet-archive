import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { CARD_BG_CROP, CARD_H, CARD_W, formatPrice, type CardLayer, type Product } from '../../data/products';
import './ProductCard.css';

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Layer({ layer, src, className }: { layer: CardLayer; src: string; className: string }) {
  const [x, y, w, h] = layer.box;
  const style = { left: pct(x, CARD_W), top: pct(y, CARD_H), width: pct(w, CARD_W), height: pct(h, CARD_H) } as CSSProperties;
  const img = layer.crop
    ? { left: `${layer.crop[0]}%`, top: `${layer.crop[1]}%`, width: `${layer.crop[2]}%`, height: `${layer.crop[3]}%` }
    : undefined;
  return (
    <span className={`pcard__layer ${className}${layer.crop ? '' : ' pcard__layer--cover'}`} style={style}>
      <img src={src} alt="" style={img} loading="lazy" decoding="async" draggable={false} />
    </span>
  );
}

/**
 * Product Card — Desktop "Product Card / NN / … / Hover=Swap Image", Mobile "Product Card / NN / Mobile / Image and Metadata".
 * S-3: pointer over the image area → product cut-out replaces the model; background, metadata and card size stay.
 * The whole image area links to the product page. The cart icon has no target yet (visual only).
 */
export function ProductCard({ product, className = '', style }: { product: Product; className?: string; style?: CSSProperties }) {
  const img = (n: string) => `/images/shop/${n}.webp`;
  return (
    <article className={`pcard ${className}`} style={style}>
      <Link to={`/product/${product.slug}`} className="pcard__media" aria-label={product.name}>
        <span className="pcard__layer pcard__bg">
          <img src={img('card-bg')} alt="" loading="lazy" decoding="async" draggable={false}
            style={{ left: `${CARD_BG_CROP[0]}%`, top: `${CARD_BG_CROP[1]}%`, width: `${CARD_BG_CROP[2]}%`, height: `${CARD_BG_CROP[3]}%` }} />
        </span>
        <Layer layer={product.model} src={img(product.model.src ?? `model-${product.id}`)} className="pcard__model" />
        <Layer layer={product.cutout} src={img(product.cutout.src ?? `cutout-${product.id}`)} className="pcard__cutout" />
      </Link>
      <div className="pcard__meta">
        <div className="pcard__info">
          <p className="pcard__name">
            <span className="pcard__name-d">{product.name}</span>
            <span className="pcard__name-m">{product.nameMobile ?? product.name}</span>
          </p>
          <p className="pcard__price">{formatPrice(product.price)}</p>
        </div>
        <div className="pcard__side">
          <ul className="pcard__swatches" aria-label="Colors">
            {product.colors.map((c) => (
              <li key={c} className="pcard__swatch" style={{ background: c }}><span className="sr-only">{c}</span></li>
            ))}
          </ul>
          <span className="pcard__cart" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
