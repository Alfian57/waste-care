'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Toast } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getErrorMessage } from '@/utils/errorMessages';

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata.full_name
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks before setting loading
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setToast({
          message: 'Password baru tidak cocok',
          type: 'error'
        });
        return;
      }

      if (formData.newPassword.length < 6) {
        setToast({
          message: 'Password minimal 6 karakter',
          type: 'error'
        });
        return;
      }
    }

    setLoading(true);

    try {
      let hasChanges = false;

      // Update name if changed
      if (formData.fullName !== user?.user_metadata?.full_name) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: formData.fullName }
        });

        if (updateError) {
          console.error('Name update error:', updateError);
          throw updateError;
        }
        hasChanges = true;
      }

      // Update password if provided
      if (formData.newPassword) {
        // Get session token for direct API call
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error('No active session');
        }

        // Direct API call to Supabase Auth with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              },
              body: JSON.stringify({
                password: formData.newPassword
              }),
              signal: controller.signal
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Password update error:', errorData);
            
            if (response.status === 422) {
              setToast({
                message: 'Password baru harus berbeda dengan password lama',
                type: 'error'
              });
              setLoading(false);
              return;
            }
            
            throw new Error(errorData.message || 'Failed to update password');
          }

          const data = await response.json();
          hasChanges = true;
        } catch (err: any) {
          clearTimeout(timeoutId);
          if (err.name === 'AbortError') {
            console.error('Password update timed out');
            throw new Error('Request timeout. Silakan coba lagi.');
          }
          throw err;
        }
      }

      // Check if any changes were made
      if (!hasChanges) {
        setToast({
          message: 'Tidak ada perubahan yang dilakukan',
          type: 'warning'
        });
        setLoading(false);
        return;
      }

      setLoading(false);
      
      setToast({
        message: 'Profile berhasil diperbarui',
        type: 'success'
      });

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Redirect after showing success message
      setTimeout(() => {
        router.push('/akun');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      const errorMessage = getErrorMessage(error);
      setToast({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="mr-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Profile Info Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubah Password</h2>
          <p className="text-sm text-gray-500 mb-4">Kosongkan jika tidak ingin mengubah password</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                placeholder="Masukkan password baru"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                placeholder="Konfirmasi password baru"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
}
