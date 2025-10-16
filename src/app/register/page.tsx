'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Checkbox, GoogleButton } from '../components';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Register attempt:', formData);
      // TODO: Implement actual registration logic
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    console.log('Google signup clicked');
    // TODO: Implement Google OAuth
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
                Buat akun baru
              </h1>
              <p className="text-gray-600 font-['CircularStd']">
                Lapor keadaan terkini dengan akun anda
              </p>
            </div>

            {/* Google Sign Up */}
            <GoogleButton 
              type="signup"
              onClick={handleGoogleSignup}
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                placeholder="Masukkan nama lengkap"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

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

              {/* Terms Agreement */}
              <div className="space-y-2">
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  label="Dengan mendaftar, Anda setuju dengan syarat & ketentuan kami"
                  error={errors.terms}
                />
              </div>

              <Button 
                type="submit" 
                loading={loading}
                fullWidth
                className="mt-8"
              >
                Daftar
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-600 font-['CircularStd']">Sudah memiliki akun? </span>
              <Link 
                href="/login" 
                className="text-[#16a34a] hover:text-[#15803d] font-medium font-['CircularStd'] underline"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
          <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-['CircularStd']">Image placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 font-['CircularStd']">
              Buat akun baru
            </h1>
            <p className="text-gray-600 font-['CircularStd']">
              Lapor keadaan terkini dengan akun anda
            </p>
          </div>

          {/* Google Sign Up */}
          <GoogleButton 
            type="signup"
            onClick={handleGoogleSignup}
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              placeholder="Masukkan nama lengkap"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

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

            {/* Terms Agreement */}
            <div className="space-y-2">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                label="Dengan mendaftar, Anda setuju dengan syarat & ketentuan kami"
                error={errors.terms}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading}
              fullWidth
              className="mt-8"
            >
              Daftar
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-gray-600 font-['CircularStd']">Sudah memiliki akun? </span>
            <Link 
              href="/login" 
              className="text-[#16a34a] hover:text-[#15803d] font-medium font-['CircularStd'] underline"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}