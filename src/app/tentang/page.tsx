'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HeroSection, FeaturesSection, TeamSection, ClosingSection } from './components/index';
import { Footer } from '../landing';
import { useRouter } from 'next/navigation';

export default function TentangPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Image
                src={"/logos/wastecare-with-text.png"}
                alt="WasteCare Logo"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => router.push('/')}
                className={`font-medium transition-colors ${isScrolled || isMobileMenuOpen ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-200'
                  }`}
              >
                Kembali ke beranda
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Masuk
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 ${isScrolled || isMobileMenuOpen ? 'text-gray-900' : 'text-white'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="text-left font-medium transition-colors text-gray-700 hover:text-emerald-600"
                >
                  Kembali ke beranda
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-center"
                >
                  Masuk
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <HeroSection />
      <FeaturesSection />
      <TeamSection />
      <ClosingSection />

      <Footer />
    </div>
  );
}
