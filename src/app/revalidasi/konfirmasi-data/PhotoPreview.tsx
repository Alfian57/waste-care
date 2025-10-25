interface PhotoPreviewProps {
  photos: string[];
}

export default function PhotoPreview({ photos }: PhotoPreviewProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-black">Foto Bukti ({photos.length})</h2>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Foto ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
