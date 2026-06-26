import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle, Send } from 'lucide-react';
import AdminVerification from '../components/AdminVerification';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [successSpamNote, setSuccessSpamNote] = useState(false);
  const [adminVerification, setAdminVerification] = useState<{ userId: number; email: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setSuccess('Email verified successfully! You can now log in.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setRequiresVerification(false);
    setAdminVerification(null);

    try {
      const response = await fetch('https://api.dentalappeal.claims/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      // Successful login with token (regular user)
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to root - RoleBasedRedirect will handle destination
        navigate('/');
      } 
      // Admin 2FA flow - requires verification code (old admin verification)
      else if (data.requiresAdminVerification) {
        setAdminVerification({ userId: data.userId, email: data.email });
      } 
      // NEW: Regular 2FA flow (for admin accounts with two_factor_enabled)
      else if (data.requiresTwoFactor) {
        // Redirect to 2FA page with userId
        navigate(`/admin/2fa?userId=${data.userId}`);
      }
      // Email not verified flow
      else if (response.status === 401 && data.requiresVerification) {
        setRequiresVerification(true);
        setUnverifiedEmail(data.email || email);
        setError(`Please verify your email address before logging in. A verification link was sent to ${data.email || email}.`);
      } 
      // Other errors
      else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    setSuccessSpamNote(false);

    try {
      const response = await fetch('https://api.dentalappeal.claims/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail || email })
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(`Verification email resent to ${unverifiedEmail || email}.`);
        setSuccessSpamNote(true);
        setRequiresVerification(false);
      } else {
        setError(data.error || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Show Admin Verification component for 2FA
  if (adminVerification) {
    return (
      <AdminVerification
        userId={adminVerification.userId}
        email={adminVerification.email}
        onVerified={(token, userData) => {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/admin');
        }}
        onBackToLogin={() => setAdminVerification(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/logo.png" alt="DentalAppeal" className="w-12 h-12 object-contain" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DentalAppeal</h1>
            </div>
            <p className="text-gray-600">Insurance Appeal Management</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            {success && !successSpamNote && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Success!</p>
                    <p className="text-green-700 text-sm mt-1">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {success && successSpamNote && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Success!</p>
                    <p className="text-green-700 text-sm mt-1">{success}</p>
                    <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-yellow-700 text-xs flex items-center gap-1">
                        <span>📧</span>
                        <span><strong>Didn't see the email?</strong> Check your <strong>spam or junk folder</strong>.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {requiresVerification && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-yellow-800 font-medium">Email not verified</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Please check your inbox for the verification link.
                    </p>
                    <button
                      onClick={handleResendVerification}
                      disabled={resending}
                      className="mt-3 flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-800 font-medium disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      {resending ? 'Sending...' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="doctor@dentalpractice.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
