import { BottomSheet } from '@/app/components';
import type { WasteMarker } from '.';

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
    />
  );
}
