import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UsePhotoManagementProps {
  photos: string[];
  onAddPhoto: (photo: string) => void;
  onRemovePhoto: (index: number) => void;
  onSetToast: (toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' }) => void;
}

export function usePhotoManagement({ 
  photos,
  onAddPhoto, 
  onRemovePhoto,
  onSetToast
}: UsePhotoManagementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddMorePhotos = async () => {
    if (photos.length >= 5) {
      onSetToast({
        message: 'Maksimal 5 foto',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onAddPhoto(base64);
            onSetToast({
              message: 'Foto berhasil ditambahkan',
              type: 'success'
            });
          };
          reader.readAsDataURL(file);
        }
        setLoading(false);
      };
      
      input.click();
    } catch (error) {
      onSetToast({
        message: 'Gagal menambahkan foto',
        type: 'error'
      });
      setLoading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length === 1) {
      onSetToast({
        message: 'Minimal harus ada 1 foto',
        type: 'warning'
      });
      return;
    }
    onRemovePhoto(index);
    onSetToast({
      message: 'Foto berhasil dihapus',
      type: 'success'
    });
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      onSetToast({
        message: 'Tambahkan minimal 1 foto',
        type: 'warning'
      });
      return;
    }
    router.push('/revalidasi/konfirmasi-data');
  };

  const handleBack = () => {
    router.back();
  };

  return {
    loading,
    handleAddMorePhotos,
    handleRemovePhoto,
    handleContinue,
    handleBack,
  };
}
