import { BottomSheet } from '@/app/components';
import type { WasteMarker } from '.';
import { useRouter } from 'next/navigation';

interface DashboardBottomSheetProps {
  showDetails: boolean;
  userName: string;
  searchQuery: string;
  selectedMarker: WasteMarker | null | undefined;
  onSearchChange: (query: string) => void;
  onSearchClick: () => void;
  onClose: () => void;
}

export default function DashboardBottomSheet({
  showDetails,
  userName,
  searchQuery,
  selectedMarker,
  onSearchChange,
  onSearchClick,
  onClose,
}: DashboardBottomSheetProps) {
  const router = useRouter();

  // TODO: Check if campaign exists for this report
  // For now, we'll use a simple check based on report ID
  const hasCampaign = false; // This should be fetched from database
  const campaignId = undefined; // This should be the actual campaign ID if exists

  const handleRevalidateClick = () => {
    if (!selectedMarker) return;
    
    // Navigate to revalidation page with report data
    const params = new URLSearchParams({
      reportId: selectedMarker.id.toString(),
      lat: selectedMarker.coordinates[1].toString(),
      lng: selectedMarker.coordinates[0].toString(),
    });
    
    router.push(`/revalidasi?${params.toString()}`);
  };

  const handleAddCampaignClick = () => {
    if (!selectedMarker) return;
    
    // Navigate to create campaign page with report data
    const params = new URLSearchParams({
      reportId: selectedMarker.id.toString(),
      lat: selectedMarker.coordinates[1].toString(),
      lng: selectedMarker.coordinates[0].toString(),
      location: selectedMarker.location || selectedMarker.title
    });
    
    router.push(`/dashboard/buat-campaign?${params.toString()}`);
  };

  const handleJoinCampaignClick = () => {
    if (!campaignId) return;
    
    // Navigate to campaign detail page
    router.push(`/campaign?campaignId=${campaignId}`);
  };

  return (
    <BottomSheet
      isOpen={true}
      onClose={onClose}
      showWelcome={!showDetails}
      userName={userName}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onSearchClick={onSearchClick}
      title={selectedMarker ? `${selectedMarker.title} - ${selectedMarker.distance}` : ''}
      description={selectedMarker?.notes || 'Detail laporan sampah pada titik ini'}
      images={selectedMarker?.imageUrls || ['/images/template-image.png']}
      wasteType={selectedMarker?.wasteType || ''}
      amount={selectedMarker?.amount || ''}
      category={selectedMarker?.category || ''}
      reportId={selectedMarker ? parseInt(selectedMarker.id) : undefined}
      reportLocation={selectedMarker ? {
        latitude: selectedMarker.coordinates[1],
        longitude: selectedMarker.coordinates[0]
      } : undefined}
      onRevalidateClick={handleRevalidateClick}
      hasCampaign={hasCampaign}
      campaignId={campaignId}
      onAddCampaignClick={handleAddCampaignClick}
      onJoinCampaignClick={handleJoinCampaignClick}
    />
  );
}
