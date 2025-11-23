import { supabase } from './supabase';

export interface ReportDistribution {
  city: string;
  province: string;
  report_count: number;
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
}

/**
 * Fetch report distribution by city for debugging
 */
export async function fetchReportsDistribution(): Promise<ReportDistribution[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_reports_distribution') as any;

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => ({
      city: item.city,
      province: item.province,
      report_count: Number(item.report_count),
      min_lat: Number(item.min_lat),
      max_lat: Number(item.max_lat),
      min_lng: Number(item.min_lng),
      max_lng: Number(item.max_lng),
    }));
  } catch (error) {
    return [];
  }
}
