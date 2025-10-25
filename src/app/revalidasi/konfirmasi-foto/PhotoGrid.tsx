interface PhotoGridProps {
  photos: string[];
  onRemovePhoto: (index: number) => void;
  onAddMorePhotos: () => void;
  loading: boolean;
}

export default function PhotoGrid({ photos, onRemovePhoto, onAddMorePhotos, loading }: PhotoGridProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Foto yang Diambil ({photos.length})
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo}
              alt={`Foto ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => onRemovePhoto(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              Foto {index + 1}
            </div>
          </div>
        ))}

        {photos.length < 5 && (
          <button
            onClick={onAddMorePhotos}
            disabled={loading}
            className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-gray-600">Tambah Foto</span>
          </button>
        )}
      </div>

      {photos.length >= 5 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            Maksimal 5 foto sudah tercapai
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Pastikan foto sudah sesuai</p>
            <p>Foto akan divalidasi oleh AI untuk memastikan lokasi sudah bersih</p>
          </div>
        </div>
      </div>
    </>
  );
}
