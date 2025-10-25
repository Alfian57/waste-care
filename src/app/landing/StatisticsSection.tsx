'use client';

import React from 'react';

interface CityStatistic {
  rank: number;
  city: string;
  province: string;
  score: number;
  completedCampaigns: number;
  activeReports: number;
  cleanedAreas: number;
}

export default function StatisticsSection() {
  // TODO: Fetch from database based on campaign completion scores
  // For now, using dummy data
  const topCities: CityStatistic[] = [
    {
      rank: 1,
      city: 'Jakarta',
      province: 'DKI Jakarta',
      score: 95,
      completedCampaigns: 142,
      activeReports: 234,
      cleanedAreas: 567
    },
    {
      rank: 2,
      city: 'Surabaya',
      province: 'Jawa Timur',
      score: 92,
      completedCampaigns: 128,
      activeReports: 198,
      cleanedAreas: 512
    },
    {
      rank: 3,
      city: 'Bandung',
      province: 'Jawa Barat',
      score: 89,
      completedCampaigns: 115,
      activeReports: 176,
      cleanedAreas: 489
    },
    {
      rank: 4,
      city: 'Semarang',
      province: 'Jawa Tengah',
      score: 86,
      completedCampaigns: 98,
      activeReports: 145,
      cleanedAreas: 423
    },
    {
      rank: 5,
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      score: 84,
      completedCampaigns: 87,
      activeReports: 132,
      cleanedAreas: 398
    }
  ];

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-br from-emerald-400 to-emerald-600';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <section id="statistics" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Statistik & Pencapaian
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kota dengan pengelolaan sampah terbaik berdasarkan skor penyelesaian campaign dan kontribusi masyarakat
          </p>
        </div>

        {/* Top Cities Leaderboard */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 border border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Top 5 Kota Terbaik</h3>
                <p className="text-gray-600">Berdasarkan penyelesaian campaign dan pengelolaan sampah</p>
              </div>
            </div>

            <div className="space-y-4">
              {topCities.map((city) => (
                <div
                  key={city.rank}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-14 h-14 ${getRankBadgeColor(city.rank)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      {getRankIcon(city.rank)}
                      <span className="text-2xl font-bold text-white">{city.rank}</span>
                    </div>

                    {/* City Info */}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h4 className="text-xl font-bold text-gray-900">{city.city}</h4>
                        <span className="text-sm text-gray-500">{city.province}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Skor Kebersihan</span>
                          <span className="text-sm font-semibold text-emerald-600">{city.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${city.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-600">{city.completedCampaigns}</div>
                          <div className="text-xs text-gray-600">Campaign Selesai</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{city.activeReports}</div>
                          <div className="text-xs text-gray-600">Laporan Aktif</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{city.cleanedAreas}</div>
                          <div className="text-xs text-gray-600">Area Dibersihkan</div>
                        </div>
                      </div>
                    </div>

                    {/* Trophy for top 3 */}
                    {city.rank <= 3 && (
                      <div className="hidden md:block">
                        <div className="text-6xl opacity-20">
                          {city.rank === 1 && '🏆'}
                          {city.rank === 2 && '🥈'}
                          {city.rank === 3 && '🥉'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">1,234</h4>
                <p className="text-gray-600">Total Campaign Selesai</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">12,456</h4>
                <p className="text-gray-600">Partisipan Aktif</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">2,345</h4>
                <p className="text-gray-600">Area Dibersihkan</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Cara Perhitungan Skor</h4>
                <p className="text-sm text-yellow-800">
                  Skor dihitung berdasarkan jumlah campaign yang diselesaikan, tingkat partisipasi masyarakat, 
                  kecepatan penanganan laporan, dan area yang berhasil dibersihkan. Data diperbarui setiap hari 
                  untuk memberikan informasi terkini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
