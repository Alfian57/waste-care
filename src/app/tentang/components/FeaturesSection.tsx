'use client';

import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Lapor Sampah Mudah',
      description: 'Laporkan masalah sampah di sekitar Anda hanya dengan beberapa tap. Lengkap dengan foto, lokasi GPS, dan estimasi volume sampah.',
      color: 'emerald'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Campaign Gotong Royong',
      description: 'Buat atau gabung kampanye pembersihan bersama warga sekitar. Koordinasi jadwal, lokasi, dan jumlah peserta dengan mudah.',
      color: 'blue'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      title: 'Peta Interaktif',
      description: 'Lihat lokasi sampah yang dilaporkan di peta real-time. Filter berdasarkan jenis sampah, volume, dan status penanganan.',
      color: 'orange'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Notifikasi Real-time',
      description: 'Dapatkan update langsung tentang status laporan Anda, campaign terdekat, dan aktivitas komunitas di area Anda.',
      color: 'purple'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Statistik & Progress',
      description: 'Pantau dampak kontribusi Anda dengan dashboard statistik yang menampilkan laporan selesai, campaign tergabung, dan pencapaian.',
      color: 'teal'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Keamanan Data',
      description: 'Data pribadi dan lokasi Anda dilindungi dengan enkripsi standar industri. Privasi adalah prioritas kami.',
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
    };
    return colors[color] || colors.emerald;
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full mb-4">
            <span className="text-sm font-semibold">✨ Fitur Unggulan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kenapa Pilih WasteCare?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai fitur canggih yang dirancang untuk membuat pengelolaan sampah
            menjadi lebih mudah, cepat, dan efektif.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl"
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Siap Membuat Perbedaan?
            </h3>
            <p className="text-gray-600 mb-6">
              Bergabunglah dengan ribuan pengguna yang telah berkontribusi untuk lingkungan lebih bersih.
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Mulai Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
