import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Send, 
  Download, 
  Shield, 
  Clock, 
  CheckCircle
} from 'lucide-react';
import Footer from '../components/Footer';

export default function Calculator() {
  const [searchParams] = useSearchParams();
  const affiliateCode = searchParams.get('ref');
  
  // Calculator state
  const [monthlyClaims, setMonthlyClaims] = useState(100);
  const [denialRate, setDenialRate] = useState(8);
  const [avgClaimValue, setAvgClaimValue] = useState(500);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculations
  const monthlyDenials = (monthlyClaims * denialRate) / 100;
  const monthlyLoss = monthlyDenials * avgClaimValue;
  const annualLoss = monthlyLoss * 12;
  const potentialRecovery = annualLoss * 0.6;
  const recoveryRate = 60;

  // Set affiliate cookie
  useEffect(() => {
    if (affiliateCode) {
      document.cookie = `affiliate_ref=${affiliateCode}; max-age=7776000; path=/; SameSite=Lax`;
    }
    
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [affiliateCode]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const sendReport = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.dentalappeal.claims/api/calculator/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          annualLoss,
          monthlyLoss,
          monthlyClaims,
          denialRate,
          avgClaimValue,
          potentialRecovery,
          affiliateCode: affiliateCode || null
        })
      });

      if (response.ok) {
        setEmailSent(true);
        setShowEmailCapture(false);
      } else {
        alert('Failed to send report. Please try again.');
      }
    } catch (error) {
      console.error('Send report error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Top Brand Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="DentalAppeal" 
                className="h-10 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-xl font-bold text-blue-600">DentalAppeal</span>';
                  }
                }}
              />
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <span className="hidden md:inline text-sm text-gray-500">AI-Powered Insurance Appeals</span>
            </div>
            
            {/* Trust Signals */}
            <div className="flex items-center gap-4 text-sm">
              <div className="hidden md:flex items-center gap-1 text-green-600">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>30-Second Appeals</span>
              </div>
              <a 
                href="/" 
                className="text-blue-600 hover:underline text-sm"
              >
                Back to Site →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section with Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-1 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Free Tool by DentalAppeal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Dental Denial Revenue Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how much revenue your practice is losing to insurance denials — and how DentalAppeal can help you recover it.
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Calculator Sliders */}
            <div className="space-y-8">
              {/* Monthly Claims */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Monthly Claims Submitted</label>
                  <span className="text-2xl font-bold text-blue-600">{monthlyClaims.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={monthlyClaims}
                  onChange={(e) => setMonthlyClaims(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10</span>
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000+</span>
                </div>
              </div>

              {/* Denial Rate */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Estimated Denial Rate</label>
                  <span className="text-2xl font-bold text-red-600">{denialRate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.5}
                  value={denialRate}
                  onChange={(e) => setDenialRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span>
                  <span>5%</span>
                  <span>10% (Avg)</span>
                  <span>15%</span>
                  <span>25%+</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Industry average is 5-10%. Many practices see rates as high as 15-20%.
                </p>
              </div>

              {/* Average Claim Value */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Average Claim Value</label>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(avgClaimValue)}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={25}
                  value={avgClaimValue}
                  onChange={(e) => setAvgClaimValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$100</span>
                  <span>$500</span>
                  <span>$1000</span>
                  <span>$1500</span>
                  <span>$2000+</span>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="mt-10 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Your Estimated Loss
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Monthly Revenue Lost</p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(monthlyLoss)}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Annual Revenue Lost</p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(annualLoss)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">With DentalAppeal, you could recover:</h4>
                </div>
                <p className="text-4xl font-bold text-green-700 text-center">
                  {formatCurrency(potentialRecovery)}<span className="text-lg font-normal text-green-600">/year</span>
                </p>
                <p className="text-sm text-green-600 text-center mt-2">
                  Based on {recoveryRate}% average recovery rate from appealed denials
                </p>
              </div>
            </div>

            {/* Call to Action */}
            {!emailSent ? (
              <div className="mt-8 text-center">
                {!showEmailCapture ? (
                  <button
                    onClick={() => setShowEmailCapture(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-lg shadow-md"
                  >
                    Get Free Report →
                  </button>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Send me the detailed breakdown
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendReport}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Report</>}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      We'll email you a detailed PDF report. No spam, unsubscribe anytime.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 text-center p-6 bg-green-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Report Sent!</h3>
                <p className="text-gray-600">
                  Check your inbox at <strong>{email}</strong> for your detailed revenue loss report.
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Plus, we've included a free appeal letter template to get you started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Brand Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">AI-Powered Appeals</h3>
            <p className="text-sm text-gray-500">Generate appeal letters in 30 seconds</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">60%+ Success Rate</h3>
            <p className="text-sm text-gray-500">Industry average is 40-50%</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">HIPAA Compliant</h3>
            <p className="text-sm text-gray-500">Secure & Private</p>
          </div>
        </div>
      </div>

      {/* Footer - Exact match to main site */}
      <Footer />
    </div>
  );
}
