'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section
      id="hero-tentang"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 relative overflow-hidden pt-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-white bg-opacity-30 rounded-full mb-6 backdrop-blur-md border border-white border-opacity-40">
            <span className="text-sm font-semibold text-black">🌱 Tentang WasteCare</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Solusi Digital untuk
            <span className="block text-emerald-200">Lingkungan Bersih</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
            WasteCare adalah platform digital inovatif yang menghubungkan masyarakat dengan
            pengelolaan sampah yang lebih baik. Kami percaya bahwa setiap individu memiliki peran
            penting dalam menciptakan lingkungan yang bersih dan sehat.
          </p>

          <div className="bg-emerald-800 backdrop-blur-lg rounded-3xl p-8 border border-emerald-600 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Tentang Aplikasi</h2>
            <p className="text-emerald-50 leading-relaxed text-lg">
              WasteCare memudahkan Anda untuk melaporkan masalah sampah di lingkungan sekitar,
              bergabung dalam kampanye pembersihan bersama warga lainnya, dan memantau progress
              penanganan sampah secara real-time. Dengan teknologi pemetaan interaktif dan sistem
              notifikasi cerdas, kami membuat pengelolaan sampah menjadi lebih transparan dan efektif.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-emerald-800 backdrop-blur-md rounded-2xl p-6 border border-emerald-600 shadow-xl">
              <div className="text-4xl font-bold mb-2">2024</div>
              <div className="text-emerald-100 text-sm">Tahun Berdiri</div>
            </div>
            <div className="bg-emerald-800 backdrop-blur-md rounded-2xl p-6 border border-emerald-600 shadow-xl">
              <div className="text-4xl font-bold mb-2">12K+</div>
              <div className="text-emerald-100 text-sm">Pengguna Aktif</div>
            </div>
            <div className="bg-emerald-800 backdrop-blur-md rounded-2xl p-6 border border-emerald-600 shadow-xl">
              <div className="text-4xl font-bold mb-2">567</div>
              <div className="text-emerald-100 text-sm">Campaign Selesai</div>
            </div>
            <div className="bg-emerald-800 backdrop-blur-md rounded-2xl p-6 border border-emerald-600 shadow-xl">
              <div className="text-4xl font-bold mb-2">1,234</div>
              <div className="text-emerald-100 text-sm">Laporan Ditangani</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
