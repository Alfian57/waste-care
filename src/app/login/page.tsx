'use client';

import React from 'react';
import { PWAInstallPrompt } from '@/components';
import { useLogin } from './useLogin';
import LoginFormContainer from './LoginFormContainer';

export default function LoginPage() {
  const {
    formData,
    errors,
    loading,
    rememberMe,
    setRememberMe,
    handleInputChange,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-28">
          <LoginFormContainer
            formData={formData}
            errors={errors}
            loading={loading}
            rememberMe={rememberMe}
            onInputChange={handleInputChange}
            onRememberMeChange={setRememberMe}
            onSubmit={handleSubmit}
            onGoogleLogin={handleGoogleLogin}
          />
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
        <LoginFormContainer
          formData={formData}
          errors={errors}
          loading={loading}
          rememberMe={rememberMe}
          onInputChange={handleInputChange}
          onRememberMeChange={setRememberMe}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
      
      <PWAInstallPrompt />
    </div>
  );
}