import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseConfirmationProps {
  onSetStatus: (status: 'clean' | 'still_dirty') => void;
  onSetNotes: (notes: string) => void;
  onResetRevalidation: () => void;
  onSetToast: (toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' }) => void;
}

export function useConfirmation({
  onSetStatus,
  onSetNotes,
  onResetRevalidation,
  onSetToast,
}: UseConfirmationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'clean' | 'still_dirty'>('clean');
  const [notes, setNotesValue] = useState('');

  const handleStatusChange = (status: 'clean' | 'still_dirty') => {
    setSelectedStatus(status);
    onSetStatus(status);
  };

  const handleNotesChange = (value: string) => {
    setNotesValue(value);
    onSetNotes(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Submit to Supabase
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSetToast({
        message: 'Revalidasi berhasil dikirim!',
        type: 'success'
      });

      setTimeout(() => {
        onResetRevalidation();
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      onSetToast({
        message: 'Gagal mengirim revalidasi',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    loading,
    selectedStatus,
    notes,
    handleStatusChange,
    handleNotesChange,
    handleSubmit,
    handleBack,
  };
}
