
import React from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ContactCTA from '@/components/home/ContactCTA';
import HomeFooter from '@/components/home/HomeFooter';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HomeHeader />
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <ContactCTA />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
