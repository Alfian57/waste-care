interface PhotoStepHeaderProps {
  onBack: () => void;
}

export default function PhotoStepHeader({ onBack }: PhotoStepHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center px-4 py-4">
        <button onClick={onBack} className="mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Foto Kondisi Lokasi</h1>
          <p className="text-sm text-gray-500">Langkah 2 dari 3</p>
        </div>
      </div>
    </div>
  );
}
