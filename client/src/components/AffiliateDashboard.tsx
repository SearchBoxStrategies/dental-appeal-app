import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Copy, Check, TrendingUp, Users, DollarSign, MousePointer, 
  Gift, Award
} from 'lucide-react';
import api from '../lib/api';

interface AffiliateData {
  affiliate: {
    id: number;
    affiliate_code: string;
    tier: string;
    commission_rate: number;
    total_clicks: number;
    total_signups: number;
    total_conversions: number;
    total_earnings: number;
    pending_earnings: number;
    paid_earnings: number;
    payout_email: string;
    created_at: string;
  };
  referrals: Array<{
    id: number;
    referral_code: string;
    status: string;
    clicked_at: string;
    signed_up_at: string | null;
    converted_at: string | null;
    practice_name: string | null;
    subscription_status: string | null;
  }>;
  commissions: Array<{
    id: number;
    amount: number;
    period_start: string;
    period_end: string;
    status: string;
    paid_at: string | null;
    practice_name: string | null;
  }>;
  monthlyEarnings: Array<{
    month: string;
    total: number;
    commission_count: number;
  }>;
}

export default function AffiliateDashboard() {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions'>('overview');

  useEffect(() => {
    fetchDashboard();
    fetchAffiliateLink();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/affiliate/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliateLink = async () => {
    try {
      const response = await api.get('/affiliate/link');
      setAffiliateLink(response.data.affiliateLink);
    } catch (error) {
      console.error('Failed to fetch link:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Converted</span>;
      case 'signed_up':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Signed Up</span>;
      case 'clicked':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Clicked</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Not an affiliate yet?</p>
        <Link to="/affiliate/signup" className="mt-2 inline-block text-blue-600 hover:underline">
          Sign up to become an affiliate →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your referrals and earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{data.affiliate.total_clicks.toLocaleString()}</p>
            </div>
            <MousePointer className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Signups</p>
              <p className="text-2xl font-bold text-gray-900">{data.affiliate.total_signups.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Conversion rate: {data.affiliate.total_clicks > 0 
              ? Math.round((data.affiliate.total_signups / data.affiliate.total_clicks) * 100) 
              : 0}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{data.affiliate.total_conversions.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {data.affiliate.total_signups > 0 
              ? Math.round((data.affiliate.total_conversions / data.affiliate.total_signups) * 100) 
              : 0}% of signups converted
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(data.affiliate.total_earnings)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pending: {formatCurrency(data.affiliate.pending_earnings)} | 
            Paid: {formatCurrency(data.affiliate.paid_earnings)}
          </p>
        </div>
      </div>

      {/* Affiliate Link Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Affiliate Link</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Share this link with dental practices. You earn {data.affiliate.commission_rate}% recurring commission on every paying customer.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'referrals'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Referrals ({data.referrals.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'commissions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commissions ({data.commissions.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Monthly Earnings Chart */}
            {data.monthlyEarnings && data.monthlyEarnings.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
                <div className="space-y-3">
                  {data.monthlyEarnings.slice(0, 6).map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{month.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${Math.min(100, (month.total / (data.monthlyEarnings[0]?.total || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(month.total)}</span>
                      <span className="text-xs text-gray-500 ml-2">({month.commission_count} pays)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Commission Rate</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.affiliate.commission_rate}%</p>
                <p className="text-sm text-gray-500 mt-2">Recurring monthly commission on every paying customer</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900">Affiliate Tier</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 capitalize">{data.affiliate.tier}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {data.affiliate.total_conversions >= 10 ? '🎉 You\'re eligible for Tier 2 upgrade!' : 
                   `${10 - data.affiliate.total_conversions} more conversions to reach Tier 2 (25% rate)`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Practice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(ref.clicked_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {ref.practice_name || '—'}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(ref.status)}</td>
                      <td className="px-6 py-4">
                        {ref.subscription_status === 'active' ? (
                          <span className="text-xs text-green-600">Active</span>
                        ) : ref.subscription_status === 'cancelled' ? (
                          <span className="text-xs text-red-600">Cancelled</span>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {data.referrals.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No referrals yet. Share your affiliate link to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Practice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.commissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(comm.period_start)} - {formatDate(comm.period_end)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{comm.practice_name || '—'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        {formatCurrency(comm.amount)}
                      </td>
                      <td className="px-6 py-4">
                        {comm.status === 'paid' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Paid</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {comm.paid_at ? formatDate(comm.paid_at) : '—'}
                      </td>
                    </tr>
                  ))}
                  {data.commissions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No commissions yet. When your referrals convert to paying customers, you'll see them here!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          Need help? Contact us at <a href="mailto:affiliates@dentalappeal.claims" className="text-blue-600 hover:underline">affiliates@dentalappeal.claims</a>
        </p>
      </div>
    </div>
  );
}
