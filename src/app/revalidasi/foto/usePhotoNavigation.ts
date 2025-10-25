import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRevalidation } from '@/contexts/RevalidationContext';

export function usePhotoNavigation() {
  const router = useRouter();
  const { addPhoto } = useRevalidation();
  const [loading, setLoading] = useState(false);

  const handleAddPhoto = async () => {
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
            addPhoto(base64);
            router.push('/revalidasi/konfirmasi-foto');
          };
          reader.readAsDataURL(file);
        }
        setLoading(false);
      };
      
      input.click();
    } catch (error) {
      console.error('Error taking photo:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    loading,
    handleAddPhoto,
    handleBack,
  };
}
