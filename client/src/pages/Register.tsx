import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building2, UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCodeFromUrl = searchParams.get('ref');
  
  const [formData, setFormData] = useState({
    practiceName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: referralCodeFromUrl || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [affiliateInfo, setAffiliateInfo] = useState<{ code: string; clicks?: number } | null>(null);

  // Track affiliate click when page loads with referral code
  useEffect(() => {
    if (referralCodeFromUrl) {
      fetch(`https://api.dentalappeal.claims/api/affiliate/track/${referralCodeFromUrl}`, {
        method: 'GET',
      }).catch(err => console.log('Tracking error:', err));
    }
  }, [referralCodeFromUrl]);

  // Fetch affiliate stats if referral code is present
  useEffect(() => {
    if (referralCodeFromUrl) {
      fetchAffiliateStats(referralCodeFromUrl);
    }
  }, [referralCodeFromUrl]);

  const fetchAffiliateStats = async (code: string) => {
    try {
      const response = await fetch(`https://api.dentalappeal.claims/api/affiliate/stats/${code}`);
      if (response.ok) {
        const data = await response.json();
        setAffiliateInfo({
          code: data.affiliate_code,
          clicks: data.total_clicks
        });
      }
    } catch (error) {
      console.log('Affiliate stats not available');
    }
  };

  // Password validation criteria
  const passwordCriteria = [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'At least 1 uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'At least 1 lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'At least 1 number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'At least 1 special character (!@#$%^&*)', test: (pwd: string) => /[!@#$%^&*]/.test(pwd) }
  ];

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const isPasswordValid = passwordStrength === 5;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.practiceName && formData.name && formData.email && isPasswordValid && doPasswordsMatch;

  const getPasswordStrengthInfo = (): { text: string; color: string } => {
    if (passwordStrength === 0) return { text: '', color: '' };
    if (passwordStrength <= 2) return { text: 'Weak', color: 'text-red-600' };
    if (passwordStrength <= 3) return { text: 'Medium', color: 'text-yellow-600' };
    if (passwordStrength <= 4) return { text: 'Strong', color: 'text-blue-600' };
    return { text: 'Very Strong', color: 'text-green-600' };
  };

  const strengthInfo = getPasswordStrengthInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://api.dentalappeal.claims/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceName: formData.practiceName,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode
        })
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(`Verification email sent to ${formData.email}. Please check your inbox to complete registration.`);
        setFormData({
          practiceName: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          referralCode: ''
        });
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="DentalAppeal" className="w-12 h-12 object-contain" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DentalAppeal</h1>
          </div>
          <p className="text-gray-600">Start your free trial</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Join thousands of dental practices</p>
            </div>

            {/* Affiliate Referral Badge */}
            {affiliateInfo && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-sm text-green-700">
                    You were referred by an affiliate! Complete your registration to get started.
                  </span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Registration successful!</p>
                    <p className="text-green-700 text-sm mt-1">{success}</p>
                    <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-yellow-700 text-xs flex items-center gap-1">
                        <span>📧</span>
                        <span><strong>Didn't see the email?</strong> Check your <strong>spam or junk folder</strong>.</span>
                      </p>
                    </div>
                    <p className="text-green-600 text-xs mt-2">Redirecting to login...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Registration failed</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.practiceName}
                      onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Family Dental Care"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Dr. Sarah Johnson"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="sarah@familydental.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Create a secure password"
                    />
                  </div>
                  
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Password strength:</span>
                        <span className={`text-xs font-medium ${strengthInfo.color}`}>
                          {strengthInfo.text}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              level <= passwordStrength
                                ? passwordStrength === 5
                                  ? 'bg-green-500'
                                  : passwordStrength >= 3
                                  ? 'bg-blue-500'
                                  : 'bg-red-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {formData.confirmPassword && !doPasswordsMatch && (
                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                  )}
                  {formData.confirmPassword && doPasswordsMatch && formData.password && (
                    <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                  )}
                </div>
              </div>

              {passwordFocused && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {passwordCriteria.map((criteria, idx) => {
                      const isValid = criteria.test(formData.password);
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          {isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${isValid ? 'text-green-700' : 'text-gray-500'}`}>
                            {criteria.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
