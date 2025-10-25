'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'Bagaimana cara melaporkan sampah?',
    answer: 'Untuk melaporkan sampah, klik menu "Lapor" di halaman utama, ambil foto sampah, isi detail lokasi dan jenis sampah, kemudian kirim laporan. Tim kami akan memproses laporan Anda.'
  },
  {
    id: 2,
    question: 'Apa itu kampanye pembersihan?',
    answer: 'Kampanye pembersihan adalah kegiatan gotong royong yang diorganisir untuk membersihkan area tertentu. Anda bisa melihat kampanye yang tersedia di menu "Campaign" dan mendaftar untuk berpartisipasi.'
  },
  {
    id: 3,
    question: 'Bagaimana cara bergabung dengan kampanye?',
    answer: 'Buka halaman Campaign, pilih kampanye yang ingin Anda ikuti, baca detail kampanye, lalu klik tombol "Daftar Sekarang". Pastikan Anda membaca persyaratan dan jadwal kampanye.'
  },
  {
    id: 4,
    question: 'Berapa lama laporan saya diproses?',
    answer: 'Laporan Anda akan diverifikasi oleh sistem AI dan tim kami dalam waktu 1-3 hari kerja. Anda akan mendapat notifikasi jika ada update status laporan.'
  },
  {
    id: 5,
    question: 'Apa yang dimaksud dengan revalidasi?',
    answer: 'Revalidasi adalah proses memverifikasi bahwa lokasi yang dilaporkan sudah dibersihkan. Anda bisa melakukan revalidasi dengan mengambil foto terbaru lokasi tersebut.'
  },
  {
    id: 6,
    question: 'Bagaimana cara mengubah profile saya?',
    answer: 'Buka halaman Akun, pilih "Edit Profile", lalu Anda bisa mengubah nama dan password. Perubahan akan tersimpan setelah Anda klik tombol "Simpan Perubahan".'
  },
  {
    id: 7,
    question: 'Apakah laporan saya bisa dilihat orang lain?',
    answer: 'Ya, laporan yang sudah diverifikasi akan ditampilkan di peta dashboard sehingga pengguna lain bisa melihat lokasi-lokasi yang dilaporkan memiliki masalah sampah.'
  },
  {
    id: 8,
    question: 'Bagaimana jika foto tidak bisa diupload?',
    answer: 'Pastikan koneksi internet Anda stabil dan ukuran foto tidak terlalu besar. Jika masalah berlanjut, coba restart aplikasi atau hubungi tim support kami.'
  },
  {
    id: 9,
    question: 'Apa saja jenis sampah yang bisa dilaporkan?',
    answer: 'Anda bisa melaporkan sampah organik (sisa makanan), anorganik (plastik, kaleng), berbahaya (baterai, obat), dan campuran. Pilih jenis yang paling sesuai saat melaporkan.'
  },
  {
    id: 10,
    question: 'Bagaimana cara menghubungi support?',
    answer: 'Anda bisa menghubungi kami melalui email di support@wastecare.com atau melalui media sosial kami. Tim kami siap membantu Anda.'
  }
];

export default function BantuanPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="mr-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Bantuan</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Info Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-emerald-900 mb-1">
                Frequently Asked Questions (FAQ)
              </h3>
              <p className="text-sm text-emerald-700">
                Temukan jawaban untuk pertanyaan yang sering diajukan tentang WasteCare
              </p>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-4 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    expandedId === faq.id ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <span className={`text-sm font-semibold ${
                      expandedId === faq.id ? 'text-emerald-600' : 'text-gray-600'
                    }`}>
                      {faq.id}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 flex-1">
                    {faq.question}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
                    expandedId === faq.id ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedId === faq.id && (
                <div className="px-4 pb-4">
                  <div className="pl-9 pr-7">
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">
            Masih butuh bantuan?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Hubungi tim support kami jika pertanyaan Anda belum terjawab
          </p>
          <a
            href="mailto:support@wastecare.com"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@wastecare.com
          </a>
        </div>
      </div>
    </div>
  );
}
