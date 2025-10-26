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

export interface WasteTypeStatistics {
  total: number;
  organic: number;
  inorganic: number;
  hazardous: number;
  mixed: number;
}

/**
 * Fetch waste type statistics from the database
 */
export async function fetchWasteTypeStatistics(): Promise<WasteTypeStatistics> {
  try {
    const { data, error } = await supabase
      .rpc('get_waste_type_statistics')
      .single() as any;

    if (error) {
      console.error('Error fetching waste type statistics:', error);
      throw error;
    }

    return {
      total: Number(data?.total || 0),
      organic: Number(data?.organic || 0),
      inorganic: Number(data?.inorganic || 0),
      hazardous: Number(data?.hazardous || 0),
      mixed: Number(data?.mixed || 0),
    };
  } catch (error) {
    console.error('Error fetching waste type statistics:', error);
    return {
      total: 0,
      organic: 0,
      inorganic: 0,
      hazardous: 0,
      mixed: 0,
    };
  }
}

/**
 * Fetch overall statistics from the database
 */
export async function fetchOverallStatistics(): Promise<OverallStatistics> {
  try {
    const { data, error } = await supabase
      .rpc('get_overall_statistics')
      .single() as any;

    if (error) {
      console.error('Error fetching overall statistics:', error);
      throw error;
    }

    return {
      totalCampaignsCompleted: data?.total_campaigns_completed || 0,
      totalParticipants: data?.total_participants || 0,
      totalCleanedAreas: data?.total_cleaned_areas || 0,
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
 * Fetch top cities by campaign completion and waste management performance
 */
export async function fetchTopCities(): Promise<CityStatistic[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_city_statistics', { limit_count: 5 } as any) as any;

    if (error) {
      console.error('Error fetching city statistics:', error);
      throw error;
    }

    // If no data or empty, return empty array
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn('No city statistics available yet');
      return [];
    }

    // Map the database response to our interface
    return data.map((city: any) => ({
      rank: Number(city.rank),
      city: city.city,
      province: city.province,
      score: Number(city.score),
      completedCampaigns: Number(city.completed_campaigns),
      activeReports: Number(city.active_reports),
      cleanedAreas: Number(city.cleaned_areas),
    }));
  } catch (error) {
    console.error('Error fetching top cities:', error);
    return [];
  }
}
