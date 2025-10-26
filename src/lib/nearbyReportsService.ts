import { supabase } from './supabase';

interface NearbyReportsParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  limit?: number;
}

export interface ReportLocation {
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
  distance_km: number;
}

interface NearbyReportsResponse {
  success: boolean;
  data?: {
    reports: ReportLocation[];
    query: {
      latitude: string;
      longitude: string;
      radius_km: number;
    };
    total_count: number;
  };
  error?: string;
}

export async function getNearbyReports(
  params: NearbyReportsParams
): Promise<NearbyReportsResponse> {
  try {
    const { latitude, longitude, radiusKm = 5, limit = 50 } = params;

    // Get the session token
    const { data: { session } } = await supabase.auth.getSession();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Missing Supabase URL configuration');
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius_km: radiusKm.toString(),
      limit: limit.toString(),
    });

    // Call the edge function
    const url = `${supabaseUrl}/functions/v1/get-nearby-reports?${queryParams}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if session exists (optional for this endpoint)
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nearby reports request failed:', response.status, errorText);
      throw new Error(`Failed to fetch nearby reports: ${response.statusText}`);
    }

    const responseText = await response.text();

    let data: NearbyReportsResponse;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      console.error('Response text:', responseText.substring(0, 200));
      throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching nearby reports:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Format waste type label in Indonesian
 */
export function formatWasteType(type: string): string {
  const labels: Record<string, string> = {
    organik: 'Organik',
    anorganik: 'Anorganik',
    berbahaya: 'Berbahaya',
    campuran: 'Campuran',
  };
  return labels[type] || type;
}

/**
 * Format waste volume label in Indonesian
 */
export function formatWasteVolume(volume: string): string {
  const labels: Record<string, string> = {
    kurang_dari_1kg: 'Kurang dari 1kg',
    '1_5kg': '1-5kg',
    '6_10kg': '6-10kg',
    lebih_dari_10kg: 'Lebih dari 10kg',
  };
  return labels[volume] || volume;
}

/**
 * Format location category label in Indonesian
 */
export function formatLocationCategory(category: string): string {
  const labels: Record<string, string> = {
    sungai: 'Di sungai',
    pinggir_jalan: 'Pinggir jalan',
    area_publik: 'Area publik',
    tanah_kosong: 'Tanah kosong',
    lainnya: 'Lainnya',
  };
  return labels[category] || category;
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
