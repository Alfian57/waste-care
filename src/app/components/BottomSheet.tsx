/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { DetailItem } from './DetailItem';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  images?: string[];
  wasteType?: string;
  amount?: string;
  category?: string;
  showWelcome?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchClick?: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  images = [],
  wasteType,
  amount,
  category,
  showWelcome = false,
  searchQuery = '',
  onSearchChange,
  onSearchClick
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce effect - update parent only after 500ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearchQuery !== searchQuery) {
        onSearchChange(localSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange, searchQuery]);

  // Sync with parent if searchQuery changes externally
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Bottom Sheet */}
      <div 
        className={`fixed inset-x-0 bg-white shadow-2xl transition-all duration-500 ease-in-out ${
          showWelcome ? 'z-30' : 'z-50'
        }`}
        style={{
          top: showWelcome ? 'calc(100vh - 280px)' : '20vh',
          bottom: 0,
          border: '2px solid #cbd5e1',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          overflow: 'hidden'
        }}
      >
        {showWelcome ? (
          // Welcome Section Content
          <div className="px-4 pt-6 pb-12">
            {/* Handle bar */}
            <div className="flex justify-center pb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h1 className="text-xl font-semibold text-orange-600 font-['CircularStd'] mb-1">
                  Halo, Alie Pratama
                </h1>
                <p className="text-sm text-gray-600 font-['CircularStd']">
                  Berkontribusi untuk jelajah sampah sekitar
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Cari sampah di ..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-400 text-gray-600 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-['CircularStd'] text-sm"
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={onSearchClick}
                fullWidth
                size='sm'
                variant='primary'
              >
                Cari
              </Button>
            </div>
          </div>
        ) : (
          // Waste Details Content
          <>
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-orange-500 font-['CircularStd']">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm text-gray-600 font-['CircularStd'] mt-1">
                      {description}
                    </p>
                  )}
                </div>
                <button 
                  onClick={onClose} 
                  className="p-1.5 ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto pb-20" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              {/* Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 px-4 ">
                  {images.map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-xl overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Waste image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="p-4 space-y-3">
                {/* Waste Type */}
                <DetailItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                  title="Jenis sampah"
                  description="Campuran"
                />

                {/* Amount */}
                {amount && (
                  <DetailItem
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    }
                    title="Muatan sampah"
                    description={amount}
                  />
                )}

                {/* Location Category */}
                {category && (
                  <DetailItem
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                    title="Kategori lokasi"
                    description={category}
                  />
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    fullWidth
                    className="bg-[#16a34a] hover:bg-[#15803d]"
                  >
                    Laporkan sudah bersih
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BottomSheet;
