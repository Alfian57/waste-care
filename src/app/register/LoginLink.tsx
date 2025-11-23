import Link from 'next/link';

export default function LoginLink() {
  return (
    <div className="text-center">
      <span className="text-gray-600">Sudah memiliki akun? </span>
      <Link
        href="/login"
        className="text-[#16a34a] hover:text-[#15803d] font-medium underline"
      >
        Masuk
      </Link>
    </div>
  );
}
