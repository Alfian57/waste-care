'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, HeroSection, MapsSection, StatisticsSection, Footer } from './index';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar isScrolled={isScrolled} />
      <HeroSection />
      <MapsSection />
      <StatisticsSection />
      <Footer />
    </div>
  );
}
