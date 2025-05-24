
import React from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import HeroSection from '@/components/home/HeroSection';
import PromotionsSection from '@/components/home/PromotionsSection';
import PopularSection from '@/components/home/PopularSection';
import CTASection from '@/components/home/CTASection';
import HomeFooter from '@/components/home/HomeFooter';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HomeHeader />
      <HeroSection />
      <PromotionsSection />
      <PopularSection />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
