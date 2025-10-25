import { BottomSheet } from '@/components';
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
  showRoute?: boolean;
  onToggleRoute?: () => void;
}

export default function DashboardBottomSheet({
  showDetails,
  userName,
  searchQuery,
  selectedMarker,
  onSearchChange,
  onSearchClick,
  onClose,
  showRoute = false,
  onToggleRoute,
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

  const handleCreateCampaignClick = () => {
    if (!selectedMarker) return;
    
    // Navigate to campaign creation page with report data
    const params = new URLSearchParams({
      reportId: selectedMarker.id.toString(),
      lat: selectedMarker.coordinates[1].toString(),
      lng: selectedMarker.coordinates[0].toString(),
    });
    
    router.push(`/buat-campaign?${params.toString()}`);
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
      reportId={selectedMarker?.id}
      reportLocation={selectedMarker ? [
        selectedMarker.coordinates[0],
        selectedMarker.coordinates[1]
      ] : undefined}
      hasCampaign={selectedMarker?.hasCampaign || false}
      onRevalidateClick={handleRevalidateClick}
      onCreateCampaignClick={handleCreateCampaignClick}
      showRouteButton={showDetails && !!selectedMarker}
      showRoute={showRoute}
      onToggleRoute={onToggleRoute}
    />
  );
}
