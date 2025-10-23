'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Checkbox, GoogleButton, PWAInstallPrompt } from '../components';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ email: 'Email atau password salah' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ email: 'Email belum diverifikasi. Silakan cek email Anda.' });
        } else {
          setErrors({ email: error.message });
        }
        return;
      }

      if (data.user) {
        // Successfully logged in
        console.log('Login successful:', data.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        setErrors({ email: 'Gagal login dengan Google. Silakan coba lagi.' });
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ email: 'Terjadi kesalahan. Silakan coba lagi.' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-28">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 font-['CircularStd']">
                Selamat datang 👋
              </h1>
              <p className="text-gray-600 font-['CircularStd']">
                Masuk aplikasi dengan akun anda
              </p>
            </div>

            {/* Google Sign In */}
            <GoogleButton 
              onClick={handleGoogleLogin}
              className="mb-6"
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-['CircularStd']">ATAU</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Masukkan email"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Masukkan password"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  label="Ingat saya"
                />
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium font-['CircularStd']"
                >
                  Lupa password?
                </Link>
              </div>

              <Button 
                type="submit" 
                loading={loading}
                fullWidth
                className="mt-8"
              >
                Masuk
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-600 font-['CircularStd']">Belum memiliki akun? </span>
              <Link 
                href="/register" 
                className="text-[#16a34a] hover:text-[#15803d] font-medium font-['CircularStd'] underline"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img 
              src="/images/logreg.png" 
              alt="Login illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 font-['CircularStd']">
              Selamat datang 👋
            </h1>
            <p className="text-gray-600 font-['CircularStd']">
              Masuk aplikasi dengan akun anda
            </p>
          </div>

          {/* Google Sign In */}
          <GoogleButton 
            onClick={handleGoogleLogin}
            className="mb-6"
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-['CircularStd']">ATAU</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Masukkan email"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Masukkan password"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Ingat saya"
              />
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium font-['CircularStd']"
              >
                Lupa password?
              </Link>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              fullWidth
              className="mt-8"
            >
              Masuk
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-gray-600 font-['CircularStd']">Belum memiliki akun? </span>
            <Link 
              href="/register" 
              className="text-[#16a34a] hover:text-[#15803d] font-medium font-['CircularStd'] underline"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}