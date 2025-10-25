import { supabase } from './supabase';
import { getNearbyReports, type ReportLocation } from './nearbyReportsService';
import type { Campaign, CampaignRow, CampaignWithParticipants } from '@/types/campaign.types';
import { addExpForJoinCampaign } from './expService';

interface CreateCampaignParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

// Helper type untuk query result
type CampaignQueryResult = CampaignRow & {
  campaign_participants?: { profile_id: string }[];
  reports?: {
    id: number;
    image_urls: string[];
    waste_type: string;
    waste_volume: string;
    location_category: string;
    lattitude: string;
    longitude: string;
  };
};

/**
 * Fetch all campaigns dari Supabase
 */
export async function fetchCampaigns(userId?: string): Promise<Campaign[]> {
  try {
    // Query campaigns dengan participant count dan report data
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_participants(profile_id),
        reports(
          id,
          image_urls,
          waste_type,
          waste_volume,
          location_category,
          lattitude,
          longitude
        )
      `)
      .order('start_time', { ascending: true });

    if (error) throw error;

    if (!campaigns) return [];

    // Transform data dari database ke Campaign interface
    const transformedCampaigns: Campaign[] = campaigns.map((campaign: CampaignQueryResult) => {
      const participantCount = campaign.campaign_participants?.length || 0;
      const isJoined = userId 
        ? campaign.campaign_participants?.some((p: { profile_id: string }) => p.profile_id === userId)
        : false;

      return transformCampaignRow(campaign, participantCount, isJoined);
    });

    return transformedCampaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw new Error('Gagal memuat data campaign');
  }
}

/**
 * Join campaign
 */
export async function joinCampaign(campaignId: number, userId: string): Promise<boolean> {
  try {
    // Check apakah sudah join
    const { data: existing } = await supabase
      .from('campaign_participants')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('profile_id', userId)
      .single();

    if (existing) {
      throw new Error('Anda sudah bergabung dengan campaign ini');
    }

    // Check apakah campaign sudah penuh
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('max_participants, campaign_participants(profile_id)')
      .eq('id', campaignId)
      .single();

    if (campaign) {
      const campaignData = campaign as unknown as CampaignQueryResult;
      const participantCount = campaignData.campaign_participants?.length || 0;
      if (participantCount >= campaignData.max_participants) {
        throw new Error('Campaign sudah penuh');
      }
    }

    // Insert participant
    const insertData = {
      campaign_id: campaignId,
      profile_id: userId,
    };
    
    const { error } = await supabase
      .from('campaign_participants')
      .insert(insertData as never);

    if (error) throw error;

    // Jika berhasil join campaign, tambahkan EXP ke user
    try {
      await addExpForJoinCampaign(userId);
    } catch (expError) {
      // Log error tapi tidak gagalkan proses join campaign
      console.error('Failed to add EXP for joining campaign:', expError);
    }

    return true;
  } catch (error) {
    console.error('Error joining campaign:', error);
    throw error;
  }
}

/**
 * Leave campaign
 */
export async function leaveCampaign(campaignId: number, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaign_participants')
      .delete()
      .eq('campaign_id', campaignId)
      .eq('profile_id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error leaving campaign:', error);
    throw error;
  }
}

/**
 * Check if a report has an associated campaign
 */
export async function checkReportHasCampaign(reportId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .eq('report_id', reportId)
      .limit(1);

    if (error) throw error;

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking report campaign:', error);
    return false;
  }
}

/**
 * Get campaigns by report IDs
 */
export async function getCampaignsByReportIds(reportIds: number[]): Promise<Map<number, boolean>> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('report_id')
      .in('report_id', reportIds);

    if (error) throw error;

    const campaignMap = new Map<number, boolean>();
    reportIds.forEach(id => campaignMap.set(id, false));
    
    if (data) {
      data.forEach((campaign: { report_id: number }) => {
        campaignMap.set(campaign.report_id, true);
      });
    }

    return campaignMap;
  } catch (error) {
    console.error('Error fetching campaigns by report IDs:', error);
    return new Map();
  }
}

/**
 * Transform campaign row dari database ke Campaign interface
 */
function transformCampaignRow(
  row: CampaignQueryResult,
  participantCount: number = 0,
  isJoined: boolean = false
): Campaign {
  const startTime = new Date(row.start_time);
  const endTime = new Date(row.end_time);

  // Format date dan time
  const date = startTime.toISOString().split('T')[0];
  const timeStart = startTime.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const timeEnd = endTime.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const time = `${timeStart} - ${timeEnd}`;

  // Get location from report
  const locationName = row.reports 
    ? getLocationName(row.reports.location_category)
    : 'Lokasi tidak tersedia';

  // Get coordinates from report
  const coordinates: [number, number] | undefined = row.reports 
    ? [parseFloat(row.reports.longitude), parseFloat(row.reports.lattitude)]
    : undefined;

  // Get image from report
  const imageUrl = row.reports?.image_urls?.[0] || '/images/campaign-placeholder.png';

  // Get waste types from report
  const wasteTypes = row.reports ? [row.reports.waste_type] : [];

  // Get estimated volume from report
  const estimatedVolume = row.reports ? formatWasteVolume(row.reports.waste_volume) : undefined;

  return {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    location: {
      name: locationName,
      coordinates,
    },
    date,
    time,
    participants: participantCount,
    maxParticipants: row.max_participants,
    status: row.status,
    imageUrl,
    organizer: row.organizer_name,
    wasteTypes,
    estimatedVolume,
    reportIds: row.reports ? [row.reports.id] : undefined,
    isJoined,
  };
}

// Helper function untuk format location name
function getLocationName(locationCategory: string): string {
  const locationNames: Record<string, string> = {
    'sungai': 'Sungai',
    'pinggir_jalan': 'Pinggir Jalan',
    'area_publik': 'Area Publik',
    'tanah_kosong': 'Tanah Kosong',
    'lainnya': 'Lainnya',
  };
  return locationNames[locationCategory] || locationCategory;
}

// Helper function untuk format waste volume
function formatWasteVolume(volume: string): string {
  const volumeLabels: Record<string, string> = {
    'kurang_dari_1kg': 'Kurang dari 1kg',
    '1_5kg': '1-5kg',
    '6_10kg': '6-10kg',
    'lebih_dari_10kg': 'Lebih dari 10kg',
  };
  return volumeLabels[volume] || volume;
}

/**
 * Generate campaign dari nearby reports
 * NOTE: Function ini di-comment karena schema baru mengharuskan campaign
 * terkait dengan satu report_id, bukan multiple reports.
 * Perlu disesuaikan dengan flow baru untuk create campaign.
 */
export async function generateCampaignFromNearbyReports(
  params: CreateCampaignParams
): Promise<Campaign | null> {
  console.warn('generateCampaignFromNearbyReports is deprecated with new schema');
  return null;
  
  // try {
  //   const { latitude, longitude, radiusKm } = params;
  //   // Implementation needs to be updated for new schema
  // } catch (error) {
  //   console.error('Error generating campaign:', error);
  //   return null;
  // }
}

/**
 * Get sample campaigns (mock data untuk development)
 * NOTE: Sample data ini tidak sesuai dengan schema baru.
 * Gunakan data dari database.
 */
export function getSampleCampaigns(): Campaign[] {
  console.warn('getSampleCampaigns is deprecated, use fetchCampaigns instead');
  return [];
}

// Deprecated helper functions - kept for backward compatibility
// These will be removed in future versions

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
