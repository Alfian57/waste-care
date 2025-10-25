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
      reportId={selectedMarker ? parseInt(selectedMarker.id) : undefined}
      reportLocation={selectedMarker ? {
        latitude: selectedMarker.coordinates[1],
        longitude: selectedMarker.coordinates[0]
      } : undefined}
      hasCampaign={selectedMarker?.hasCampaign || false}
      onRevalidateClick={handleRevalidateClick}
      onCreateCampaignClick={handleCreateCampaignClick}
    />
  );
}
