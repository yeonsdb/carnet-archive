import { Navigate, useParams } from 'react-router-dom';
import { Section } from '../lib/artboard';
import { productBySlug } from '../data/products';
import { ProductGallery } from '../components/product/ProductGallery';
import { PurchasePanel } from '../components/product/PurchasePanel';
import { SectionTabs } from '../components/product/SectionTabs';
import { ProductStory } from '../components/product/ProductStory';
import { SizeGuide } from '../components/product/SizeGuide';
import { ProductInquiry } from '../components/product/ProductInquiry';
import { PurchaseGuide } from '../components/product/PurchaseGuide';
import './ProductPage.css';

/**
 * PRODUCT — Desktop 1124:11643 (1920 × 11639) · Mobile 1213:2342 (393 × 4704).
 * Every product slug shows the PAPER CRUSTACEAN detail content (decision Q5-b: all identical).
 * Sections are slices of the frames between header (60) and footer (D 11039 · M 4428).
 */
export function ProductPage() {
  const { slug = '' } = useParams();
  if (!productBySlug(slug)) return <Navigate to="/shop" replace />;

  return (
    <main className="pdp">
      <Section d={[60, 1066]} m={[60, 429]} label="상품 이미지">
        <ProductGallery />
      </Section>
      <Section d={[1126, 537]} m={[489, 383]} label="구매 정보">
        <PurchasePanel />
      </Section>
      <Section d={[1663, 4773]} m={[872, 1339]} label="상품 상세정보">
        <SectionTabs active="product-info" />
        <ProductStory />
      </Section>
      <Section d={[6436, 1741]} m={[2211, 666]} label="SIZE GUIDE">
        <SectionTabs active="size-guide" />
        <SizeGuide />
      </Section>
      <Section d={[8177, 1427]} m={[2877, 1016]} label="상품 문의">
        <SectionTabs active="product-inquiry" />
        <ProductInquiry />
      </Section>
      <Section d={[9604, 1435]} m={[3893, 535]} label="구매안내">
        <SectionTabs active="purchase-guide" />
        <PurchaseGuide />
      </Section>
    </main>
  );
}
