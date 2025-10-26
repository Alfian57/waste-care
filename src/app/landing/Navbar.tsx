'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavbarProps {
  isScrolled?: boolean;
}

export default function Navbar({ isScrolled = false }: NavbarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center`}>
              <Image src="/icons/logo.png" alt="WasteCare Logo" width={24} height={24} />
            </div>
            <span className={`text-xl font-bold ${isScrolled || isMobileMenuOpen ? 'text-gray-900' : 'text-white'}`}>
              WasteCare
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className={`font-medium transition-colors ${
                isScrolled || isMobileMenuOpen ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-200'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('maps')}
              className={`font-medium transition-colors ${
                isScrolled || isMobileMenuOpen ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-200'
              }`}
            >
              Peta Sampah
            </button>
            <button
              onClick={() => scrollToSection('statistics')}
              className={`font-medium transition-colors ${
                isScrolled || isMobileMenuOpen ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-200'
              }`}
            >
              Statistik
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
                onClick={() => scrollToSection('hero')}
                className="text-left font-medium transition-colors text-gray-700 hover:text-emerald-600"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('maps')}
                className="text-left font-medium transition-colors text-gray-700 hover:text-emerald-600"
              >
                Peta Sampah
              </button>
              <button
                onClick={() => scrollToSection('statistics')}
                className="text-left font-medium transition-colors text-gray-700 hover:text-emerald-600"
              >
                Statistik
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
  );
}
