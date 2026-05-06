import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../lib/api';

export default function Billing() {
  const [subscription, setSubscription] = useState({
    status: 'inactive',
    stripeCustomerId: null,
    totalPaid: 0,
    lastPaymentDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      alert('Payment successful! Your subscription is now active.');
      fetchSubscriptionStatus();
    } else if (urlParams.get('canceled') === 'true') {
      alert('Payment cancelled. You can try again anytime.');
    }
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get('/billing/subscription');
      setSubscription(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setActionLoading(true);
    try {
      const response = await api.post('/billing/checkout');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      const response = await api.post('/billing/portal');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isActive = subscription.status === 'active';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
              <p className="text-sm text-gray-500">Professional Plan</p>
            </div>
            <div className="flex items-center gap-2">
              {isActive ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">Inactive</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-bold text-gray-900">$199</span>
            <span className="text-gray-600">/month</span>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">✓ Unlimited claim submissions</li>
            <li className="flex items-center gap-2">✓ AI-powered appeal generation</li>
            <li className="flex items-center gap-2">✓ CDT code selector</li>
            <li className="flex items-center gap-2">✓ Priority support</li>
          </ul>
          
          {isActive ? (
            <button
              onClick={handleManageSubscription}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {actionLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Manage Subscription
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {actionLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Subscribe Now
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-800">Can I cancel anytime?</p>
            <p>Yes, you can cancel your subscription at any time through the Manage Subscription portal.</p>
          </div>
          <div>
            <p className="font-medium text-gray-800">What payment methods are accepted?</p>
            <p>We accept all major credit cards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
