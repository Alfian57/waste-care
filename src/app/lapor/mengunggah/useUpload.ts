import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitReport } from '@/lib/reportService';
import { ReportData, AiValidation } from '@/contexts/ReportContext';

interface UseUploadProps {
  reportData: ReportData;
  setAiValidation: (validation: AiValidation) => void;
}

export function useUpload({ reportData, setAiValidation }: UseUploadProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    try {
      // Validate only required data (location and photos)
      if (!reportData.location || reportData.photos.length === 0) {
        throw new Error('Data tidak lengkap');
      }

      // Simulate progress for first photo (0-30%)
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress <= 30) {
          setProgress(currentProgress);
        }
      }, 100);

      // Upload first photo - let AI generate waste type, volume, and location category
      const result = await submitReport({
        imageBase64: reportData.photos[0],
        latitude: reportData.location.latitude.toString(),
        longitude: reportData.location.longitude.toString(),
        notes: reportData.notes,
      });

      clearInterval(progressInterval);

      // Check if upload was successful
      if (!result.success) {
        // Handle validation failure (not waste)
        if (result.validation && !result.validation.isWaste) {
          const reason = result.validation.reason || 'Gambar tidak terdeteksi sebagai sampah';
          throw new Error(
            `${result.message || 'Validasi gambar gagal'}\n\nAlasan: ${reason}`
          );
        }
        
        // Handle parsing errors with more specific messages
        const errorMsg = result.error || result.message || 'Gagal mengunggah laporan';
        
        if (errorMsg.includes('AI validation failed - empty response')) {
          throw new Error(
            'Validasi AI gagal. Mohon coba lagi dengan foto yang lebih jelas dan terang.'
          );
        }
        
        if (errorMsg.includes('Failed to parse Gemini AI response')) {
          throw new Error(
            'Terjadi kesalahan saat validasi gambar oleh AI. Mohon coba lagi dengan foto yang lebih jelas.'
          );
        }
        
        if (errorMsg.includes('Gemini AI validation failed')) {
          throw new Error(
            'Layanan validasi AI sedang bermasalah. Mohon coba lagi nanti.'
          );
        }
        
        if (errorMsg.includes('Bucket not found')) {
          throw new Error(
            'Kesalahan konfigurasi storage. Mohon hubungi administrator.'
          );
        }
        
        throw new Error(errorMsg);
      }

      // Save AI validation result to context
      if (result.data?.validation) {
        setAiValidation(result.data.validation);
      }

      // Simulate remaining progress (30-100%)
      const completeProgress = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(completeProgress);
            setUploading(false);
            // Navigate to success page using Next.js router
            setTimeout(() => {
              router.push('/lapor/konfirmasi-data');
            }, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah');
      setUploading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setUploading(true);
    handleUpload();
  };

  return {
    progress,
    uploading,
    error,
    handleUpload,
    handleRetry,
  };
}
