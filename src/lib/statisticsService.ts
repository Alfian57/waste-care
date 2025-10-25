import { supabase } from './supabase';

export interface CityStatistic {
  rank: number;
  city: string;
  province: string;
  score: number;
  completedCampaigns: number;
  activeReports: number;
  cleanedAreas: number;
}

export interface OverallStatistics {
  totalCampaignsCompleted: number;
  totalParticipants: number;
  totalCleanedAreas: number;
}

/**
 * Fetch overall statistics from the database
 */
export async function fetchOverallStatistics(): Promise<OverallStatistics> {
  try {
    // Get total completed campaigns
    const { count: completedCampaigns } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'finished');

    // Get total unique participants
    const { data: participants } = await supabase
      .from('campaign_participants')
      .select('profile_id');

    const uniqueParticipants = participants
      ? new Set(participants.map((p: { profile_id: string }) => p.profile_id)).size
      : 0;

    // Get total cleaned areas (finished campaigns)
    const { count: cleanedAreas } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'finished');

    return {
      totalCampaignsCompleted: completedCampaigns || 0,
      totalParticipants: uniqueParticipants,
      totalCleanedAreas: cleanedAreas || 0,
    };
  } catch (error) {
    console.error('Error fetching overall statistics:', error);
    return {
      totalCampaignsCompleted: 0,
      totalParticipants: 0,
      totalCleanedAreas: 0,
    };
  }
}

/**
 * Note: Since the database doesn't have city/province information,
 * this function returns mock data for now.
 * To make this fully dynamic, you would need to:
 * 1. Add city/province fields to the reports or campaigns table
 * 2. Extract location data from coordinates using reverse geocoding
 * 3. Aggregate statistics by city
 */
export async function fetchTopCities(): Promise<CityStatistic[]> {
  try {
    // For now, we'll return mock data since we don't have city information in the schema
    // In a real implementation, you would:
    // 1. Add location (city/province) fields to your tables
    // 2. Query and aggregate data by city
    // 3. Calculate scores based on campaigns and reports

    // Get some real data to at least show real numbers
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*');

    const { data: reports } = await supabase
      .from('reports')
      .select('*');

    const totalCampaigns = campaigns?.length || 0;
    const totalReports = reports?.length || 0;

    // Mock cities with proportional distribution of real data
    const mockCities: CityStatistic[] = [
      {
        rank: 1,
        city: 'Jakarta',
        province: 'DKI Jakarta',
        score: 95,
        completedCampaigns: Math.round(totalCampaigns * 0.3),
        activeReports: Math.round(totalReports * 0.25),
        cleanedAreas: Math.round(totalCampaigns * 0.35),
      },
      {
        rank: 2,
        city: 'Surabaya',
        province: 'Jawa Timur',
        score: 92,
        completedCampaigns: Math.round(totalCampaigns * 0.25),
        activeReports: Math.round(totalReports * 0.22),
        cleanedAreas: Math.round(totalCampaigns * 0.28),
      },
      {
        rank: 3,
        city: 'Bandung',
        province: 'Jawa Barat',
        score: 89,
        completedCampaigns: Math.round(totalCampaigns * 0.2),
        activeReports: Math.round(totalReports * 0.18),
        cleanedAreas: Math.round(totalCampaigns * 0.22),
      },
      {
        rank: 4,
        city: 'Semarang',
        province: 'Jawa Tengah',
        score: 86,
        completedCampaigns: Math.round(totalCampaigns * 0.15),
        activeReports: Math.round(totalReports * 0.15),
        cleanedAreas: Math.round(totalCampaigns * 0.1),
      },
      {
        rank: 5,
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        score: 84,
        completedCampaigns: Math.round(totalCampaigns * 0.1),
        activeReports: Math.round(totalReports * 0.12),
        cleanedAreas: Math.round(totalCampaigns * 0.05),
      },
    ];

    return mockCities;
  } catch (error) {
    console.error('Error fetching top cities:', error);
    // Return empty mock data on error
    return [
      {
        rank: 1,
        city: 'Jakarta',
        province: 'DKI Jakarta',
        score: 95,
        completedCampaigns: 0,
        activeReports: 0,
        cleanedAreas: 0,
      },
      {
        rank: 2,
        city: 'Surabaya',
        province: 'Jawa Timur',
        score: 92,
        completedCampaigns: 0,
        activeReports: 0,
        cleanedAreas: 0,
      },
      {
        rank: 3,
        city: 'Bandung',
        province: 'Jawa Barat',
        score: 89,
        completedCampaigns: 0,
        activeReports: 0,
        cleanedAreas: 0,
      },
      {
        rank: 4,
        city: 'Semarang',
        province: 'Jawa Tengah',
        score: 86,
        completedCampaigns: 0,
        activeReports: 0,
        cleanedAreas: 0,
      },
      {
        rank: 5,
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        score: 84,
        completedCampaigns: 0,
        activeReports: 0,
        cleanedAreas: 0,
      },
    ];
  }
}
