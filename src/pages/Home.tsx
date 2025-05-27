
import React from 'react';
import NewHomeHeader from '@/components/home/NewHomeHeader';
import NewHeroSection from '@/components/home/NewHeroSection';
import NewPromotionsSection from '@/components/home/NewPromotionsSection';
import NewPopularSection from '@/components/home/NewPopularSection';
import NewCTASection from '@/components/home/NewCTASection';
import NewHomeFooter from '@/components/home/NewHomeFooter';

const Home = () => {
  return (
    <div className="page-container">
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

export default Home;
