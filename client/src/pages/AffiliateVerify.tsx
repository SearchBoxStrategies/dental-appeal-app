import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AffiliateVerify() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');
    
    if (errorParam === 'invalid') {
      setError('Invalid or expired verification link. Please request a new one.');
      setLoading(false);
      return;
    }
    
    if (errorParam === 'expired') {
      setError('Verification link has expired. Please request a new one.');
      setLoading(false);
      return;
    }
    
    if (!token) {
      setError('No verification token provided.');
      setLoading(false);
      return;
    }
    
    // Redirect to backend verification endpoint directly
    // The backend will handle verification and redirect to set-password page
    console.log('🔍 Redirecting to verification endpoint...');
    window.location.href = `https://api.dentalappeal.claims/api/affiliate/verify?token=${token}`;
    
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Verifying Your Email</h1>
          <p className="text-gray-600 mt-2">Please wait while we verify your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/affiliate/signup')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Email Verified! ✅</h1>
        <p className="text-gray-600 mt-2">
          Your email has been successfully verified.
        </p>
        <p className="text-gray-600 mt-4">
          Redirecting you to set your password...
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}
