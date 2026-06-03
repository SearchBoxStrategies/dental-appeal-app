import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Gift, Star, TrendingUp
} from 'lucide-react';

export default function AffiliateSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    payoutEmail: '',
    payoutMethod: 'paypal'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [customersPerMonth, setCustomersPerMonth] = useState(5);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'pro' | 'partner'>('standard');

  // Tier rates based on your actual code
  const tierRates = {
    standard: { rate: 15, monthlyPerCustomer: 29.85, name: 'Standard', conversions: '0-9' },
    pro: { rate: 20, monthlyPerCustomer: 39.80, name: 'Pro', conversions: '10-49' },
    partner: { rate: 25, monthlyPerCustomer: 49.75, name: 'Partner', conversions: '50+' }
  };

  const currentRate = tierRates[selectedTier].rate;
  const monthlyEarnings = customersPerMonth * tierRates[selectedTier].monthlyPerCustomer;
  const yearlyEarnings = monthlyEarnings * 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.dentalappeal.claims/api/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Launch Partner Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Earn 15-25% Recurring<br />
              <span className="text-blue-200">Commission</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Help dental practices recover denied claims with AI. 
              The more you refer, the higher your commission rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                Start Earning Now <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works" className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">40+</span>
              <span className="text-gray-600">Active Affiliates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">$12,450+</span>
              <span className="text-gray-600">Paid This Month</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">4.9★</span>
              <span className="text-gray-600">Affiliate Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits */}
          <div>
            {/* Tier Commission Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-4">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Performance-Based Tiers</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Commission Tiers</h3>
                <p className="text-gray-600 text-sm mt-1">Higher referrals = Higher commission</p>
              </div>
              
              <div className="space-y-3">
                <div className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTier === 'standard' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}
                     onClick={() => setSelectedTier('standard')}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Standard Tier</h4>
                      <p className="text-sm text-gray-600">0-9 conversions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">15%</p>
                      <p className="text-sm text-gray-500">$29.85/mo per customer</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTier === 'pro' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}
                     onClick={() => setSelectedTier('pro')}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Pro Tier</h4>
                      <p className="text-sm text-gray-600">10-49 conversions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">20%</p>
                      <p className="text-sm text-gray-500">$39.80/mo per customer</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTier === 'partner' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}
                     onClick={() => setSelectedTier('partner')}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Partner Tier</h4>
                      <p className="text-sm text-gray-600">50+ conversions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">25%</p>
                      <p className="text-sm text-gray-500">$49.75/mo per customer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  <strong>Example:</strong> Refer 10 practices at {currentRate}% = <strong>${(customersPerMonth * tierRates[selectedTier].monthlyPerCustomer).toFixed(2)}/month</strong> passive income
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Join DentalAppeal Affiliates?</h3>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Recurring Revenue</strong>
                  <p className="text-gray-600 text-sm">Earn 15-25% every month your referral stays a customer</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">90-Day Cookie</strong>
                  <p className="text-gray-600 text-sm">You get credit for anyone who signs up within 90 days of clicking your link</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">No Work Required</strong>
                  <p className="text-gray-600 text-sm">We handle all onboarding, support, and billing. Just share your link.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Monthly Payouts</strong>
                  <p className="text-gray-600 text-sm">Get paid via PayPal or Stripe on the 15th of every month</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Real-time Dashboard</strong>
                  <p className="text-gray-600 text-sm">Track clicks, signups, and earnings anytime</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Tier Upgrades</strong>
                  <p className="text-gray-600 text-sm">Automatically upgrade to higher commission rates as you refer more</p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">What Affiliates Are Saying</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-700 italic">"I shared my link with 5 dental practices I consult for. 3 converted to paid. I made $119.40 in my first month without doing anything else."</p>
                  <p className="text-sm text-gray-500 mt-2">— Dental Practice Consultant</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-700 italic">"The 14-day free trial makes it easy. I just tell dentists to try it. The product sells itself."</p>
                  <p className="text-sm text-gray-500 mt-2">— Dental Billing Specialist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div id="signup">
            {!success ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Become an Affiliate</h2>
                  <p className="text-gray-600 mt-2">Join for free. Applications reviewed within 24-48 hours.</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your consulting or practice name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payout Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.payoutEmail}
                      onChange={(e) => setFormData({ ...formData, payoutEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="payouts@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Where you'll receive commission payments</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payout Method *
                    </label>
                    <select
                      value={formData.payoutMethod}
                      onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>

                  {/* Earnings Calculator Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">📊 Your Potential Earnings at {currentRate}%</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Customers referred per month:</span>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={customersPerMonth}
                        onChange={(e) => setCustomersPerMonth(parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="font-medium text-gray-900">{customersPerMonth}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly earnings:</span>
                        <span className="font-bold text-green-600">${monthlyEarnings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Yearly earnings:</span>
                        <span className="font-bold text-green-600">${yearlyEarnings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Creating account...' : 'Apply to Become an Affiliate →'}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                  By signing up, you agree to our Affiliate Terms & Conditions.
                  Applications are reviewed within 24-48 hours.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received! 🎉</h2>
                <p className="text-gray-600 mb-4">
                  Your affiliate application has been submitted. Our team will review and activate your account within 24-48 hours.
                </p>
                <p className="text-gray-600 mb-6">
                  You'll receive an email when your account is approved.
                </p>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Return Home <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start earning passive income
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply for Free</h3>
              <p className="text-gray-600 text-sm">Submit your application. Our team reviews within 24-48 hours.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-gray-600 text-sm">Once approved, get your unique referral link. Share via email, social, or website.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Monthly</h3>
              <p className="text-gray-600 text-sm">When they become a paying customer, you earn 15-25% every month they stay.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How does the tier system work?</h3>
              <p className="text-gray-600">You start at 15% commission (Standard tier). When you reach 10 total conversions, you automatically upgrade to 20% (Pro tier). At 50+ conversions, you reach 25% (Partner tier). All your customers, past and future, earn at your current tier rate.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">When do I get paid?</h3>
              <p className="text-gray-600">When a user completes their 14-day free trial AND upgrades to the $199/month plan. You earn 15-25% of their monthly subscription for as long as they remain a paying customer.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do I get commission on free trial signups?</h3>
              <p className="text-gray-600">No. Commission is only paid on paying customers. This ensures we both win: you only get paid for real results.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How long does the cookie last?</h3>
              <p className="text-gray-600">90 days. If someone clicks your link and signs up within 90 days, you get credit.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do I have to do customer support?</h3>
              <p className="text-gray-600">No. We handle all onboarding, support, and billing. You just share your link.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How do I get paid?</h3>
              <p className="text-gray-600">Monthly payouts via PayPal or Stripe on the 15th of each month. Payouts are processed for approved commissions.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What if the customer cancels?</h3>
              <p className="text-gray-600">Commissions stop when they cancel. You are only paid for active, paying customers.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How long does approval take?</h3>
              <p className="text-gray-600">Applications are typically reviewed within 24-48 hours. You'll receive an email notification once approved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-blue-100 mb-8">Join hundreds of affiliates earning passive income</p>
          <a href="#signup" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Apply Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© 2026 DentalAppeal. All rights reserved. | <a href="/terms" className="hover:text-white">Terms</a> | <a href="/privacy" className="hover:text-white">Privacy</a></p>
      </div>
    </div>
  );
}
