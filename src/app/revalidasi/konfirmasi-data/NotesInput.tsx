interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NotesInput({ value, onChange }: NotesInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold mb-3 text-black">
        Catatan Tambahan (Opsional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tambahkan catatan atau keterangan..."
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-gray-500"
        rows={4}
      />
    </div>
  );
}
