
import React from 'react';
import NewHomeHeader from '@/components/home/NewHomeHeader';
import NewHeroSection from '@/components/home/NewHeroSection';
import NewPromotionsSection from '@/components/home/NewPromotionsSection';
import NewPopularSection from '@/components/home/NewPopularSection';
import NewCTASection from '@/components/home/NewCTASection';
import NewHomeFooter from '@/components/home/NewHomeFooter';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NewHomeHeader />
      <main>
        <NewHeroSection />
        <NewPromotionsSection />
        <NewPopularSection />
        <NewCTASection />
      </main>
      <NewHomeFooter />
    </div>
  );
};

export default HomePage;
