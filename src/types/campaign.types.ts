export interface Campaign {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  imageUrl: string;
  organizer: string;
  wasteTypes: string[];
  estimatedVolume: string;
  reportIds: number[]; // IDs dari reports yang akan dibersihkan
}

export interface CampaignFilters {
  status?: 'upcoming' | 'ongoing' | 'completed';
  radius?: number;
  wasteType?: string;
}
