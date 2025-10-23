import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerWithEmail, loginWithGoogle } from '@/lib/auth';
import { getErrorMessage, isEmailAlreadyRegistered } from '@/utils/errorMessages';

export function useRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Nama lengkap minimal 2 karakter';
    }

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Anda harus menyetujui syarat & ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const { data, error } = await registerWithEmail({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (error) {
        setErrors({ email: getErrorMessage(error) });
        return;
      }

      if (data.user) {
        if (isEmailAlreadyRegistered({ user: data.user as unknown as { identities?: unknown[] } })) {
          setErrors({ email: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' });
          return;
        }

        // Show success message
        setSuccessMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi akun.');
        
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          password: ''
        });
        setAgreeTerms(false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setErrors({});
      const { error } = await loginWithGoogle();

      if (error) {
        console.error('Google signup error:', error);
        setErrors({ email: getErrorMessage(error) });
      }
      // If successful, user will be redirected by Supabase to the callback URL
    } catch (error) {
      console.error('Google signup error:', error);
      setErrors({ email: 'Terjadi kesalahan. Silakan coba lagi.' });
    }
  };

  return {
    formData,
    errors,
    loading,
    agreeTerms,
    successMessage,
    setAgreeTerms,
    handleInputChange,
    handleSubmit,
    handleGoogleSignup,
  };
}
