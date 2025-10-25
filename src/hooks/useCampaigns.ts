import { useState, useEffect } from 'react';
import { getSampleCampaigns, generateCampaignFromNearbyReports } from '@/lib/campaignService';
import type { Campaign, CampaignFilters } from '@/types/campaign.types';

export function useCampaigns(filters?: CampaignFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use sample data
      // In production, this would call a Supabase function
      const data = getSampleCampaigns();
      
      // Apply filters
      let filtered = data;
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }

      setCampaigns(filtered);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const generateCampaign = async (latitude: number, longitude: number, radiusKm: number) => {
    try {
      setLoading(true);
      setError(null);

      const campaign = await generateCampaignFromNearbyReports({
        latitude,
        longitude,
        radiusKm,
      });

      if (campaign) {
        setCampaigns(prev => [campaign, ...prev]);
        return campaign;
      } else {
        setError('Tidak ada laporan sampah di area ini');
        return null;
      }
    } catch (err) {
      console.error('Error generating campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinCampaign = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? { ...c, participants: Math.min(c.participants + 1, c.maxParticipants) }
          : c
      )
    );
  };

  const leaveCampaign = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? { ...c, participants: Math.max(c.participants - 1, 0) }
          : c
      )
    );
  };

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    generateCampaign,
    joinCampaign,
    leaveCampaign,
  };
}
