import { GoogleButton } from '@/components';
import RegisterHeader from './RegisterHeader';
import RegisterForm from './RegisterForm';
import FormDivider from './FormDivider';
import LoginLink from './LoginLink';

interface RegisterFormContainerProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
  };
  errors: { [key: string]: string };
  loading: boolean;
  agreeTerms: boolean;
  successMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgreeTermsChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignup: () => void;
}

export default function RegisterFormContainer({
  formData,
  errors,
  loading,
  agreeTerms,
  successMessage,
  onInputChange,
  onAgreeTermsChange,
  onSubmit,
  onGoogleSignup,
}: RegisterFormContainerProps) {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <RegisterHeader />

      {/* Google Sign Up */}
      <GoogleButton 
        type="signup"
        onClick={onGoogleSignup}
        className="mb-6"
      />

      {/* Divider */}
      <FormDivider />

      {/* Registration Form */}
      <RegisterForm
        formData={formData}
        errors={errors}
        loading={loading}
        agreeTerms={agreeTerms}
        successMessage={successMessage}
        onInputChange={onInputChange}
        onAgreeTermsChange={onAgreeTermsChange}
        onSubmit={onSubmit}
      />

      {/* Login Link */}
      <LoginLink />
    </div>
  );
}
