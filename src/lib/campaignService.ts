import { getNearbyReports, type ReportLocation } from './nearbyReportsService';
import type { Campaign } from '@/types/campaign.types';

interface CreateCampaignParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

/**
 * Generate campaign dari nearby reports
 * Menggunakan edge function untuk mendapatkan laporan dalam radius tertentu
 */
export async function generateCampaignFromNearbyReports(
  params: CreateCampaignParams
): Promise<Campaign | null> {
  try {
    const { latitude, longitude, radiusKm } = params;

    // Fetch nearby reports using edge function
    const result = await getNearbyReports({
      latitude,
      longitude,
      radiusKm,
      limit: 100,
    });

    if (!result.success || !result.data || result.data.reports.length === 0) {
      return null;
    }

    const reports = result.data.reports;
    
    // Group reports untuk membuat campaign
    const wasteTypes = Array.from(new Set(reports.map(r => r.waste_type)));
    const totalReports = reports.length;
    
    // Hitung estimasi volume total
    const estimatedVolume = calculateTotalVolume(reports);
    
    // Generate campaign location (center point atau lokasi dengan sampah terbanyak)
    const centerLocation = calculateCenterLocation(reports);
    
    // Create campaign object
    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      title: `Gotong Royong Bersih-Bersih ${centerLocation.name}`,
      description: `Mari bergabung dalam aksi bersih-bersih bersama! Terdapat ${totalReports} titik sampah dalam radius ${radiusKm} km yang perlu dibersihkan.`,
      location: {
        name: centerLocation.name,
        coordinates: [longitude, latitude],
      },
      date: getNextWeekendDate(),
      time: '08:00 - 12:00',
      participants: 0,
      maxParticipants: Math.max(10, totalReports * 2),
      status: 'upcoming',
      imageUrl: reports[0]?.image_urls[0] || '/images/campaign-placeholder.png',
      organizer: 'WasteCare Community',
      wasteTypes: wasteTypes,
      estimatedVolume: estimatedVolume,
      reportIds: reports.map(r => r.id),
    };

    return campaign;
  } catch (error) {
    console.error('Error generating campaign:', error);
    return null;
  }
}

/**
 * Get sample campaigns (mock data untuk development)
 */
export function getSampleCampaigns(): Campaign[] {
  return [
    {
      id: '1',
      title: 'Bersih-Bersih Kali Code',
      description: 'Mari bersama-sama membersihkan Kali Code dari sampah plastik dan organik. Aksi nyata untuk lingkungan yang lebih bersih!',
      location: {
        name: 'Kali Code, Sleman',
        coordinates: [110.3695, -7.7756],
      },
      date: '2025-10-26',
      time: '08:00 - 12:00',
      participants: 23,
      maxParticipants: 50,
      status: 'upcoming',
      imageUrl: '/images/campaign-placeholder.png',
      organizer: 'WasteCare Yogyakarta',
      wasteTypes: ['plastik', 'organik'],
      estimatedVolume: '50-100kg',
      reportIds: [1, 2, 3],
    },
    {
      id: '2',
      title: 'Gotong Royong Malioboro',
      description: 'Aksi bersih-bersih di kawasan Malioboro untuk menjaga kebersihan destinasi wisata kita.',
      location: {
        name: 'Jalan Malioboro',
        coordinates: [110.3656, -7.7928],
      },
      date: '2025-10-27',
      time: '06:00 - 10:00',
      participants: 45,
      maxParticipants: 60,
      status: 'upcoming',
      imageUrl: '/images/campaign-placeholder.png',
      organizer: 'Pemuda Peduli Jogja',
      wasteTypes: ['campuran'],
      estimatedVolume: '30-50kg',
      reportIds: [4, 5],
    },
    {
      id: '3',
      title: 'Bersih Pantai Parangtritis',
      description: 'Selamatkan pantai dari sampah plastik! Mari berkontribusi untuk kelestarian pesisir.',
      location: {
        name: 'Pantai Parangtritis',
        coordinates: [110.3275, -8.0250],
      },
      date: '2025-11-02',
      time: '07:00 - 11:00',
      participants: 12,
      maxParticipants: 40,
      status: 'upcoming',
      imageUrl: '/images/campaign-placeholder.png',
      organizer: 'Save Our Beach',
      wasteTypes: ['plastik', 'anorganik'],
      estimatedVolume: 'Lebih dari 100kg',
      reportIds: [6, 7, 8, 9],
    },
  ];
}

// Helper functions

function calculateTotalVolume(reports: ReportLocation[]): string {
  const volumeMap: Record<string, number> = {
    'kurang_dari_1kg': 0.5,
    '1_5kg': 3,
    '6_10kg': 8,
    'lebih_dari_10kg': 15,
  };

  const totalKg = reports.reduce((sum, report) => {
    return sum + (volumeMap[report.waste_volume] || 0);
  }, 0);

  if (totalKg < 10) return 'Kurang dari 10kg';
  if (totalKg < 50) return '10-50kg';
  if (totalKg < 100) return '50-100kg';
  return 'Lebih dari 100kg';
}

function calculateCenterLocation(reports: ReportLocation[]): { name: string } {
  // Simplified: use first report location name
  // Could be enhanced with actual geocoding
  const categories = reports.map(r => r.location_category);
  const mostCommon = categories.sort((a, b) =>
    categories.filter(c => c === a).length - categories.filter(c => c === b).length
  ).pop();

  const locationNames: Record<string, string> = {
    'sungai': 'Sungai',
    'pinggir_jalan': 'Jalan Raya',
    'area_publik': 'Area Publik',
    'tanah_kosong': 'Lahan Kosong',
    'lainnya': 'Area Umum',
  };

  return { name: locationNames[mostCommon || 'lainnya'] || 'Area Umum' };
}

function getNextWeekendDate(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  
  return nextSaturday.toISOString().split('T')[0];
}
