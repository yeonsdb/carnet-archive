import { Hero } from '../components/home/Hero';
import { CurrentCollection } from '../components/home/CurrentCollection';
import { BrandPhilosophy } from '../components/home/BrandPhilosophy';
import { ShopCategories } from '../components/home/ShopCategories';
import { BrandCampaign } from '../components/home/BrandCampaign';
import { Collections } from '../components/home/Collections';
import { Stockists } from '../components/home/Stockists';

/** HOME — Desktop 1113:10490 (1920 × 8812) · Mobile 1184:617 (393 × 4028) */
export function HomePage() {
  return (
    <main>
      <Hero />
      <CurrentCollection />
      <BrandPhilosophy />
      <ShopCategories />
      <BrandCampaign />
      <Collections />
      <Stockists />
    </main>
  );
}
