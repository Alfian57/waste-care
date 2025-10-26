/**
 * Helper types for Supabase RPC functions
 * These types help with TypeScript inference for custom database functions
 */

import { supabase } from './supabase';

/**
 * Report with extracted coordinates from PostGIS geography
 */
export interface ReportWithCoordinates {
  id: number;
  user_id: string;
  image_urls: string[];
  created_at: string;
  waste_type: string;
  waste_volume: string;
  location_category: string;
  notes: string | null;
  latitude: number;
  longitude: number;
}

/**
 * Nearby report with distance calculation
 */
export interface NearbyReport extends ReportWithCoordinates {
  distance_km: number;
}

/**
 * Helper function to call get_reports_with_coordinates RPC
 */
export async function getReportsWithCoordinates(): Promise<ReportWithCoordinates[]> {
  const { data, error }: { data: ReportWithCoordinates[] | null; error: any } = 
    await supabase.rpc('get_reports_with_coordinates') as any;
  
  if (error) throw error;
  return data || [];
}

/**
 * Helper function to call get_user_reports_with_coordinates RPC
 */
export async function getUserReportsWithCoordinates(
  userId: string
): Promise<ReportWithCoordinates[]> {
  const { data, error }: { data: ReportWithCoordinates[] | null; error: any } = 
    await supabase.rpc('get_user_reports_with_coordinates', {
      p_user_id: userId
    } as any);
  
  if (error) throw error;
  return data || [];
}

/**
 * Helper function to call get_report_with_coordinates RPC
 */
export async function getReportWithCoordinates(
  reportId: number
): Promise<ReportWithCoordinates | null> {
  const { data, error }: { data: ReportWithCoordinates[] | null; error: any } = 
    await supabase.rpc('get_report_with_coordinates', {
      p_report_id: reportId
    } as any);
  
  if (error) throw error;
  return data?.[0] || null;
}

/**
 * Helper function to call get_nearby_reports RPC
 */
export async function getNearbyReportsRPC(
  latitude: number,
  longitude: number,
  radiusMeters: number,
  limit: number = 50
): Promise<NearbyReport[]> {
  const { data, error }: { data: NearbyReport[] | null; error: any } = 
    await supabase.rpc('get_nearby_reports', {
      p_latitude: latitude,
      p_longitude: longitude,
      p_radius_meters: radiusMeters,
      p_limit: limit
    } as any);
  
  if (error) throw error;
  return data || [];
}
