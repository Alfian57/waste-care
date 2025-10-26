'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HeroSection, FeaturesSection, TeamSection, ClosingSection } from './components/index';
import Link from 'next/link';

export default function TentangPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Image 
                src={isScrolled ? "/logos/wastecare-with-text.png" : "/logos/wastecare-with-text2.png"}
                alt="WasteCare Logo" 
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </div>

            <Link
              href="/"
              className="px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <HeroSection />
      <FeaturesSection />
      <TeamSection />
      <ClosingSection />
    </div>
  );
}
