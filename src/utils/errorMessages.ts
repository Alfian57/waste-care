/**
 * Utility untuk mengkonversi error message dari Supabase ke bahasa Indonesia
 */

export const getErrorMessage = (error: unknown): string => {
  const message = (error as { message?: string })?.message || '';

  // Login errors
  if (message.includes('Invalid login credentials')) {
    return 'Email atau password salah';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Email belum diverifikasi. Silakan cek email Anda.';
  }

  // Registration errors
  if (message.includes('User already registered')) {
    return 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
  }

  if (message.includes('Password should be at least')) {
    return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
  }

  if (message.includes('Invalid email')) {
    return 'Format email tidak valid.';
  }

  // OAuth errors
  if (message.includes('OAuth')) {
    return 'Gagal login dengan Google. Silakan coba lagi.';
  }

  // Password update errors
  if (message.includes('New password should be different')) {
    return 'Password baru harus berbeda dengan password lama';
  }

  if (message.includes('password')) {
    return 'Gagal mengubah password. Silakan coba lagi.';
  }

  // Generic error
  return 'Terjadi kesalahan. Silakan coba lagi.';
};

export const isEmailAlreadyRegistered = (data: { user?: { identities?: unknown[] } }): boolean => {
  return !!(data?.user && data.user.identities && data.user.identities.length === 0);
};
