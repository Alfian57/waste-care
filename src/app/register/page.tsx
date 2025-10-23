'use client';

import React from 'react';
import { useRegister } from './useRegister';
import RegisterFormContainer from './RegisterFormContainer';

export default function RegisterPage() {
  const {
    formData,
    errors,
    loading,
    agreeTerms,
    successMessage,
    setAgreeTerms,
    handleInputChange,
    handleSubmit,
    handleGoogleSignup,
  } = useRegister();

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-28">
          <RegisterFormContainer
            formData={formData}
            errors={errors}
            loading={loading}
            agreeTerms={agreeTerms}
            successMessage={successMessage}
            onInputChange={handleInputChange}
            onAgreeTermsChange={setAgreeTerms}
            onSubmit={handleSubmit}
            onGoogleSignup={handleGoogleSignup}
          />
        </div>

        {/* Right Section - Image */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img 
              src="/images/logreg.png" 
              alt="Register illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white flex items-center justify-center px-6 py-8">
        <RegisterFormContainer
          formData={formData}
          errors={errors}
          loading={loading}
          agreeTerms={agreeTerms}
          successMessage={successMessage}
          onInputChange={handleInputChange}
          onAgreeTermsChange={setAgreeTerms}
          onSubmit={handleSubmit}
          onGoogleSignup={handleGoogleSignup}
        />
      </div>
    </div>
  );
}