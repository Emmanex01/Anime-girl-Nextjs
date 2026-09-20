import Image from "next/image";
import { Hero } from "./_components/Hero";
import { TrustBadges } from "./_components/TrustBadges";
import { TrendingProducts } from "./_components/TrendingProducts";
import { PromoBanners } from "./_components/PromoBanners";
import { CommunitySection } from "./_components/CommunitySection";
import { WhyShopWithUs } from "./_components/WhyShopWithUs";
import { Newsletter } from "./_components/Newsletter";

export default function Home() {
  return (
    <div className="relative w-full min-w-0 overflow-x-hidden">
      <Hero/>
      <TrustBadges/>
      <TrendingProducts/>
      <PromoBanners/>
      <CommunitySection/>
      <WhyShopWithUs/>
      <Newsletter/>
    </div>
  );
}
