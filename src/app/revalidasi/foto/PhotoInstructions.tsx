export default function PhotoInstructions() {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Foto Bukti Kondisi Bersih
      </h2>
      <p className="text-gray-600 mb-8">
        Ambil foto lokasi untuk membuktikan bahwa lokasi ini sudah bersih
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start text-left">
          <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Tips Mengambil Foto:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Foto area yang sebelumnya terdapat sampah</li>
              <li>• Pastikan foto jelas dan terang</li>
              <li>• Tampilkan kondisi yang sudah bersih</li>
              <li>• Ambil dari beberapa sudut pandang</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
