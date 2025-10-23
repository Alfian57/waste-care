import { useState, useCallback } from 'react';
import { getNearbyReports, type ReportLocation } from '@/lib/nearbyReportsService';

export function useNearbyReports(radiusKm: number = 5) {
  const [reports, setReports] = useState<ReportLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyReports = useCallback(async (
    latitude: number, 
    longitude: number, 
    radius?: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getNearbyReports({
        latitude,
        longitude,
        radiusKm: radius || radiusKm,
        limit: 50,
      });

      if (result.success && result.data) {
        setReports(result.data.reports);
      } else {
        const errorMsg = result.error || 'Gagal memuat data laporan';
        setError(errorMsg);
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Terjadi kesalahan saat memuat data');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [radiusKm]);

  return {
    reports,
    loading,
    error,
    setError,
    fetchNearbyReports,
  };
}
