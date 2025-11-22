'use client';

import Link from 'next/link';
import React from 'react';

export default function ClosingSection() {
  return (
    <section id="closing" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Closing Card */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Mari Bersama Ciptakan Perubahan
              </h2>

              {/* Description */}
              <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
                Setiap tindakan kecil yang kita lakukan hari ini akan berdampak besar untuk masa depan.
                WasteCare hadir untuk memudahkan Anda berkontribusi dalam menciptakan lingkungan yang
                lebih bersih dan sehat. Bersama-sama, kita bisa membuat perbedaan nyata!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 py-8 border-y border-white border-opacity-20">
                <div>
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-emerald-100 text-sm">Gratis Digunakan</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-emerald-100 text-sm">Layanan Aktif</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">∞</div>
                  <div className="text-emerald-100 text-sm">Dampak Positif</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/register"
                  className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Daftar Sekarang
                </a>

                <Link
                  href="/"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-emerald-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              <span className="font-semibold text-emerald-600">🌱 Ingat:</span> Perubahan besar dimulai
              dari langkah kecil. Dengan bergabung di WasteCare, Anda sudah mengambil langkah pertama
              untuk masa depan yang lebih hijau dan bersih. Terima kasih telah menjadi bagian dari solusi!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
