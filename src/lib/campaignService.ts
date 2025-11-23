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
    latitude: number;
    longitude: number;
  };
};

/**
 * Fetch all campaigns dari Supabase
 */
export async function fetchCampaigns(userId?: string): Promise<Campaign[]> {
  try {
    // Query campaigns dengan participant count
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_participants(profile_id)
      `)
      .order('start_time', { ascending: false }) as { data: any[] | null; error: any };

    if (error) throw error;

    if (!campaigns) return [];

    // Get all unique report IDs
    const reportIds = [...new Set(campaigns.map((c: any) => c.report_id))];
    
    // Fetch report coordinates for all reports
    const { data: reports, error: reportsError }: { data: any[] | null; error: any } = await supabase
      .rpc('get_reports_with_coordinates') as any;
    
    if (reportsError) {
    }

    // Create a map of report_id to report data
    const reportsMap = new Map();
    if (reports) {
      reports.forEach((report: any) => {
        reportsMap.set(report.id, report);
      });
    }

    // Transform data dari database ke Campaign interface
    const transformedCampaigns: Campaign[] = campaigns.map((campaign: any) => {
      const participantCount = campaign.campaign_participants?.length || 0;
      const isJoined = userId 
        ? campaign.campaign_participants?.some((p: { profile_id: string }) => p.profile_id === userId)
        : false;

      // Attach report data
      const report = reportsMap.get(campaign.report_id);
      const campaignWithReport = {
        ...campaign,
        reports: report || null
      };

      return transformCampaignRow(campaignWithReport, participantCount, isJoined);
    });

    return transformedCampaigns;
  } catch (error) {
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
      const expResult = await addExpForJoinCampaign(userId);
      if (expResult.success) {
      } else {
        // do something
      }
    } catch (expError) {
      // Log error tapi tidak gagalkan proses join campaign
    }

    return true;
  } catch (error) {
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
    return new Map();
  }
}

/**
 * Get campaign details (ID and status) by report IDs
 */
export async function getCampaignDetailsByReportIds(reportIds: number[]): Promise<Map<number, { id: number; status: string }>> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, report_id, status')
      .in('report_id', reportIds);

    if (error) throw error;

    const campaignDetailsMap = new Map<number, { id: number; status: string }>();
    
    if (data) {
      data.forEach((campaign: { id: number; report_id: number; status: string }) => {
        campaignDetailsMap.set(campaign.report_id, { id: campaign.id, status: campaign.status });
      });
    }

    return campaignDetailsMap;
  } catch (error) {
    return new Map();
  }
}

/**
 * Get campaign data by report IDs (combined hasCampaign + details)
 * Returns hasCampaign boolean and campaign details (id, status) in single query
 */
export async function getCampaignDataByReportIds(reportIds: number[]): Promise<{
  campaignMap: Map<number, boolean>;
  campaignDetailsMap: Map<number, { id: number; status: string }>;
}> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, report_id, status, start_time, end_time')
      .in('report_id', reportIds);

    if (error) throw error;

    // Initialize both maps
    const campaignMap = new Map<number, boolean>();
    const campaignDetailsMap = new Map<number, { id: number; status: string }>();
    
    // Set all report IDs to false initially
    reportIds.forEach(id => campaignMap.set(id, false));
    
    if (data) {
      data.forEach((campaign: { id: number; report_id: number; status: string; start_time: string; end_time: string }) => {
        // Set hasCampaign to true
        campaignMap.set(campaign.report_id, true);
        
        // Calculate actual status based on time
        const actualStatus = determineCampaignStatus(campaign.start_time, campaign.end_time, campaign.status);
        
        // Set campaign details with calculated status
        campaignDetailsMap.set(campaign.report_id, { id: campaign.id, status: actualStatus });
      });
    }

    return { campaignMap, campaignDetailsMap };
  } catch (error) {
    return { 
      campaignMap: new Map(), 
      campaignDetailsMap: new Map() 
    };
  }
}

/**
 * Determine campaign status based on current time
 */
function determineCampaignStatus(startTime: string, endTime: string, dbStatus: string): 'upcoming' | 'ongoing' | 'finished' {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // If manually marked as finished, keep it finished
  if (dbStatus === 'finished') {
    return 'finished';
  }

  // Determine status based on time
  if (now < start) {
    return 'upcoming';
  } else if (now >= start && now <= end) {
    return 'ongoing';
  } else {
    return 'finished';
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
    ? [row.reports.longitude, row.reports.latitude]
    : undefined;

  // Get image from report
  const imageUrl = row.reports?.image_urls?.[0] || '/images/campaign-placeholder.png';

  // Get waste types from report
  const wasteTypes = row.reports ? [row.reports.waste_type] : [];

  // Get estimated volume from report
  const estimatedVolume = row.reports ? formatWasteVolume(row.reports.waste_volume) : undefined;

  // Determine actual status based on time
  const actualStatus = determineCampaignStatus(row.start_time, row.end_time, row.status);

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
    status: actualStatus,
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
  return null;
  
  // try {
  //   const { latitude, longitude, radiusKm } = params;
  //   // Implementation needs to be updated for new schema
  // } catch (error) {
  //   return null;
  // }
}

/**
 * Get sample campaigns (mock data untuk development)
 * NOTE: Sample data ini tidak sesuai dengan schema baru.
 * Gunakan data dari database.
 */
export function getSampleCampaigns(): Campaign[] {
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
