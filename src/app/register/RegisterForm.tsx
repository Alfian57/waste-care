import { Input, Button, Checkbox } from '@/app/components';
import SuccessMessage from './SuccessMessage';

interface RegisterFormProps {
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
}

export default function RegisterForm({
  formData,
  errors,
  loading,
  agreeTerms,
  successMessage,
  onInputChange,
  onAgreeTermsChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && <SuccessMessage message={successMessage} />}

      {/* Full Name Input */}
      <Input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={onInputChange}
        error={errors.fullName}
        placeholder="Masukkan nama lengkap"
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        }
      />

      {/* Email Input */}
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        error={errors.email}
        placeholder="Masukkan email"
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
            />
          </svg>
        }
      />

      {/* Password Input */}
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        error={errors.password}
        placeholder="Masukkan password"
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        }
      />

      {/* Terms Agreement */}
      <div className="space-y-2">
        <Checkbox
          checked={agreeTerms}
          onChange={(e) => onAgreeTermsChange(e.target.checked)}
          label="Dengan mendaftar, Anda setuju dengan syarat & ketentuan kami"
          error={errors.terms}
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        loading={loading}
        fullWidth
        className="mt-8"
      >
        Daftar
      </Button>
    </form>
  );
}
