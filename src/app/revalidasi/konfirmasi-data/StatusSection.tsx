interface StatusSectionProps {
  selectedStatus: 'clean' | 'still_dirty';
  onStatusChange: (status: 'clean' | 'still_dirty') => void;
}

export default function StatusSection({ selectedStatus, onStatusChange }: StatusSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-black">Status Lokasi</h2>
      <div className="space-y-3">
        <button
          onClick={() => onStatusChange('clean')}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            selectedStatus === 'clean'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
              selectedStatus === 'clean' ? 'border-emerald-500' : 'border-gray-300'
            }`}>
              {selectedStatus === 'clean' && (
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <svg className="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">Sudah Bersih</h3>
              </div>
              <p className="text-sm text-gray-600">
                Lokasi ini sudah dibersihkan dan tidak ada lagi sampah
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onStatusChange('still_dirty')}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            selectedStatus === 'still_dirty'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
              selectedStatus === 'still_dirty' ? 'border-orange-500' : 'border-gray-300'
            }`}>
              {selectedStatus === 'still_dirty' && (
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">Masih Kotor</h3>
              </div>
              <p className="text-sm text-gray-600">
                Masih ada sampah di lokasi ini
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
