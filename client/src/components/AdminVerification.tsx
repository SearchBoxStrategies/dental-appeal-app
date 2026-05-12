import { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface AdminVerificationProps {
  userId: number;
  email: string;
  onVerified: (token: string, userData: any) => void;
  onBackToLogin: () => void;
}

export default function AdminVerification({ userId, email, onVerified, onBackToLogin }: AdminVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.dentalappeal.claims/api/auth/verify-admin-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: verificationCode })
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onVerified(data.token, data.user);
        }, 1000);
      } else {
        setError(data.error || 'Invalid verification code');
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    setError('');
    
    try {
      const response = await fetch('https://api.dentalappeal.claims/api/auth/resend-admin-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setCountdown(60);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to resend code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="DentalAppeal" className="w-12 h-12 object-contain" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DentalAppeal</h1>
          </div>
          <p className="text-gray-600">Admin Portal Verification</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit verification code to<br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700">Verification successful! Redirecting...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter verification code
            </label>
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || code.join('').length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify and Continue
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {resending ? 'Sending...' : countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onBackToLogin}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
