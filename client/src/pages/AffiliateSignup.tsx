import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, Users, TrendingUp, Clock, Shield, Zap, 
  CheckCircle, ArrowRight, Copy, Twitter, Linkedin, Mail,
  Star, Gift, Award, BarChart3, Calculator
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
  const [affiliateCode, setAffiliateCode] = useState('');
  const [customersPerMonth, setCustomersPerMonth] = useState(5);

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
        setAffiliateCode(data.affiliateCode);
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

  const monthlyEarnings = customersPerMonth * 39.80;
  const yearlyEarnings = monthlyEarnings * 12;

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
              Earn 20% Recurring<br />
              <span className="text-blue-200">Commission</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Help dental practices recover denied claims with AI. 
              You get paid monthly for every customer you refer.
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
            {/* Commission Highlight */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-4">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Best in class commission</span>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">20%</div>
                <div className="text-gray-600 mb-4">Recurring Monthly Commission</div>
                <div className="text-2xl font-semibold text-gray-900 mb-2">$39.80</div>
                <div className="text-gray-500">per customer / per month</div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💰 <strong>Example:</strong> Refer 10 practices = <strong>$398/month</strong> passive income
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Join DentalAppeal Affiliates?</h3>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Recurring Revenue</strong>
                  <p className="text-gray-600 text-sm">Earn 20% every month your referral stays a customer</p>
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
                  <p className="text-gray-600 mt-2">Join for free. Start earning today.</p>
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
                    <p className="text-sm font-medium text-gray-700 mb-2">📊 Your Potential Earnings</p>
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
                    {loading ? 'Creating account...' : 'Become an Affiliate →'}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                  By signing up, you agree to our Affiliate Terms & Conditions.
                  No upfront fees. Cancel anytime.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Team! 🎉</h2>
                <p className="text-gray-600 mb-6">
                  Your affiliate account has been created. Here's your unique referral link:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <code className="text-sm text-blue-600 break-all">
                    {`${window.location.origin}/register?ref=${affiliateCode}`}
                  </code>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  We've also sent this to your email. Start sharing your link to earn commissions!
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
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
              <h3 className="font-semibold text-gray-900 mb-2">Join for Free</h3>
              <p className="text-gray-600 text-sm">Sign up with your email. Instant approval. No fees.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-gray-600 text-sm">Get a unique referral link. Share via email, social, or website.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Monthly</h3>
              <p className="text-gray-600 text-sm">When they become a paying customer, you earn 20% every month they stay.</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">When do I get paid?</h3>
              <p className="text-gray-600">When a user completes their 14-day free trial AND upgrades to the $199/month plan. You earn 20% of their monthly subscription for as long as they remain a paying customer.</p>
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
              <p className="text-gray-600">Monthly payouts via PayPal or Stripe on the 15th of each month. Minimum payout $50.</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What if the customer cancels?</h3>
              <p className="text-gray-600">Commissions stop when they cancel. You are only paid for active, paying customers.</p>
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
            Join Now <ArrowRight className="w-4 h-4" />
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
