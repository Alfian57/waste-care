'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Beranda',
      icon: (active: boolean) => (
        <img 
          src="/icons/homeicon.svg" 
          alt="Home" 
          className={`w-6 h-6 ${active ? 'brightness-0 saturate-100' : ''}`}
          style={{
            filter: active 
              ? 'brightness(0) saturate(100%) invert(41%) sepia(58%) saturate(3656%) hue-rotate(143deg) brightness(103%) contrast(101%)' // emerald-500
              : 'brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(567%) hue-rotate(169deg) brightness(95%) contrast(92%)' // slate-400
          }}
        />
      )
    },
    {
      href: '/lapor',
      label: 'Lapor',
      icon: (active: boolean) => (
        <img 
          src="/icons/laporicon.svg" 
          alt="Lapor" 
          className={`w-6 h-6 ${active ? 'brightness-0 saturate-100' : ''}`}
          style={{
            filter: active 
              ? 'brightness(0) saturate(100%) invert(41%) sepia(58%) saturate(3656%) hue-rotate(143deg) brightness(103%) contrast(101%)' // emerald-500
              : 'brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(567%) hue-rotate(169deg) brightness(95%) contrast(92%)' // slate-400
          }}
        />
      )
    },
    {
      href: '/akun',
      label: 'Akun',
      icon: (active: boolean) => (
        <img 
          src="/icons/accounticon.svg" 
          alt="Account" 
          className={`w-6 h-6 ${active ? 'brightness-0 saturate-100' : ''}`}
          style={{
            filter: active 
              ? 'brightness(0) saturate(100%) invert(41%) sepia(58%) saturate(3656%) hue-rotate(143deg) brightness(103%) contrast(101%)' // emerald-500
              : 'brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(567%) hue-rotate(169deg) brightness(95%) contrast(92%)' // slate-400
          }}
        />
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-4 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-emerald-50' : 'hover:bg-gray-50'
              }`}
            >
              {item.icon(isActive)}
              <span className={`text-xs mt-1 font-['CircularStd'] ${
                isActive ? 'text-emerald-500 font-medium' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;