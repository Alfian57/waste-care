import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Report = Database['public']['Tables']['reports']['Row'];

export interface WasteMarker {
  id: string;
  coordinates: [number, number];
  type: 'waste';
  title: string;
  location: string;
  wasteType: string;
  amount: string;
  category: string;
  images: string[];
  notes: string | null;
  created_at: string;
}

export function useReports() {
  const [reports, setReports] = useState<WasteMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform Supabase data to WasteMarker format
      const markers: WasteMarker[] = (data || []).map((report: Report) => ({
        id: report.id.toString(),
        coordinates: [parseFloat(report.longitude), parseFloat(report.lattitude)] as [number, number],
        type: 'waste' as const,
        title: getWasteTypeLabel(report.waste_type),
        location: getCategoryLabel(report.location_category),
        wasteType: getWasteTypeLabel(report.waste_type),
        amount: getVolumeLabel(report.waste_volume),
        category: getCategoryLabel(report.location_category),
        images: report.image_urls,
        notes: report.notes,
        created_at: report.created_at
      }));

      setReports(markers);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  return { reports, loading, error, refetch: fetchReports };
}

// Helper functions to convert enum values to readable labels
function getWasteTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'organik': 'Organik',
    'anorganik': 'Anorganik',
    'berbahaya': 'Berbahaya',
    'campuran': 'Campuran'
  };
  return labels[type] || type;
}

function getVolumeLabel(volume: string): string {
  const labels: Record<string, string> = {
    'kurang_dari_1kg': 'Kurang dari 1kg',
    '1_5kg': '1-5kg',
    '6_10kg': '6-10kg',
    'lebih_dari_10kg': 'Lebih dari 10kg'
  };
  return labels[volume] || volume;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'sungai': 'Di tengah sungai',
    'pinggir_jalan': 'Pinggir jalan',
    'area_public': 'Area publik',
    'tanah_kosong': 'Tanah kosong',
    'lainnya': 'Lainnya'
  };
  return labels[category] || category;
}
