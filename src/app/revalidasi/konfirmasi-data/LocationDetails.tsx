interface LocationDetailsProps {
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function LocationDetails({ location }: LocationDetailsProps) {
  if (!location) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-black">Lokasi</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-700">
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
