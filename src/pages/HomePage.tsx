import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { CurrentCollection } from '../components/home/CurrentCollection';
import { BrandPhilosophy } from '../components/home/BrandPhilosophy';
import { ShopCategories } from '../components/home/ShopCategories';
import { BrandCampaign } from '../components/home/BrandCampaign';
import { Collections } from '../components/home/Collections';
import { Stockists } from '../components/home/Stockists';

/** HOME — Desktop 1113:10490 (1920 × 8812) · Mobile 1184:617 (393 × 4028) */
export function HomePage() {
  // menu links: /#brand-info · /#aw26 · /#collections · /#stockists scroll to that section
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
  }, [hash, key]);

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
