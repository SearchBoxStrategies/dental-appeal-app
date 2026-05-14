import { useState, useEffect } from 'react';
import { 
  Search, Download, Eye, DollarSign, CheckCircle, 
  XCircle, AlertCircle, TrendingUp, Users, 
  MousePointer, Award, RefreshCw, Ban, Check,
  Mail, ExternalLink, Copy, Calendar
} from 'lucide-react';
import api from '../lib/api';

interface Affiliate {
  id: number;
  full_name: string;
  email: string;
  company_name: string | null;
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
  payout_method: string;
  is_active: boolean;
  created_at: string;
  approved_at: string | null;
  total_referrals: string;
  total_converted: string;
  total_commissions_paid: string;
}

interface Commission {
  id: number;
  affiliate_id: number;
  affiliate_name: string;
  referral_id: number;
  practice_name: string;
  amount: number;
  period_start: string;
  period_end: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'affiliates' | 'commissions'>('affiliates');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAffiliates();
    fetchCommissions();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const response = await api.get('/affiliate/admin/list');
      setAffiliates(response.data);
    } catch (error) {
      console.error('Failed to fetch affiliates:', error);
      showMessage('error', 'Failed to load affiliates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissions = async () => {
    try {
      const response = await api.get('/affiliate/admin/commissions');
      setCommissions(response.data);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const approveAffiliate = async (id: number, commissionRate?: number, tier?: string) => {
    try {
      await api.put(`/affiliate/admin/${id}/approve`, { commissionRate, tier });
      showMessage('success', 'Affiliate approved successfully');
      fetchAffiliates();
    } catch (error) {
      showMessage('error', 'Failed to approve affiliate');
    }
  };

  const processPayout = async (affiliateId: number) => {
    try {
      await api.post(`/affiliate/admin/${affiliateId}/payout`);
      showMessage('success', 'Payout processed successfully');
      fetchAffiliates();
      fetchCommissions();
      setShowPayoutModal(false);
      setSelectedAffiliate(null);
    } catch (error) {
      showMessage('error', 'Failed to process payout');
    }
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAffiliates = affiliates.filter(a => 
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.affiliate_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter(a => a.is_active).length,
    totalConversions: affiliates.reduce((sum, a) => sum + a.total_conversions, 0),
    totalEarnings: affiliates.reduce((sum, a) => sum + a.total_earnings, 0),
    pendingPayouts: affiliates.reduce((sum, a) => sum + a.pending_earnings, 0),
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Code', 'Tier', 'Clicks', 'Signups', 'Conversions', 'Total Earnings', 'Pending', 'Status', 'Joined'];
    const rows = filteredAffiliates.map(a => [
      a.full_name,
      a.email,
      a.company_name || '',
      a.affiliate_code,
      a.tier,
      a.total_clicks,
      a.total_signups,
      a.total_conversions,
      a.total_earnings,
      a.pending_earnings,
      a.is_active ? 'Active' : 'Pending',
      formatDate(a.created_at)
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliates_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
          <p className="text-gray-600 mt-1">Manage affiliates, view earnings, process payouts</p>
        </div>
        <button
          onClick={() => fetchAffiliates()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Affiliates</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalAffiliates}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Affiliates</p>
              <p className="text-2xl font-bold text-green-600">{totalStats.activeAffiliates}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Conversions</p>
              <p className="text-2xl font-bold text-purple-600">{totalStats.totalConversions}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalStats.totalEarnings)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payouts</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalStats.pendingPayouts)}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'affiliates'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Affiliates ({filteredAffiliates.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'commissions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commissions ({commissions.length})
          </button>
        </nav>
      </div>

      {/* Affiliates Tab */}
      {activeTab === 'affiliates' && (
        <>
          {/* Search and Export */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or affiliate code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Affiliates Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Affiliate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signups</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAffiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{affiliate.full_name}</p>
                          <p className="text-sm text-gray-500">{affiliate.email}</p>
                          {affiliate.company_name && (
                            <p className="text-xs text-gray-400">{affiliate.company_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{affiliate.affiliate_code}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          affiliate.tier === 'partner' ? 'bg-purple-100 text-purple-700' :
                          affiliate.tier === 'pro' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {affiliate.tier} ({affiliate.commission_rate}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{affiliate.total_clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-900">{affiliate.total_signups.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-900">{affiliate.total_conversions.toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{formatCurrency(affiliate.total_earnings)}</td>
                      <td className="px-6 py-4 font-medium text-orange-600">{formatCurrency(affiliate.pending_earnings)}</td>
                      <td className="px-6 py-4">
                        {affiliate.is_active ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedAffiliate(affiliate);
                              setShowAffiliateModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!affiliate.is_active && (
                            <button
                              onClick={() => approveAffiliate(affiliate.id, 20, 'standard')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {affiliate.pending_earnings > 50 && (
                            <button
                              onClick={() => {
                                setSelectedAffiliate(affiliate);
                                setShowPayoutModal(true);
                              }}
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                              title="Process Payout"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                       </td>
                     </tr>
                  ))}
                  {filteredAffiliates.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                        No affiliates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Affiliate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Practice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{commission.affiliate_name}</td>
                    <td className="px-6 py-4 text-gray-600">{commission.practice_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(commission.period_start)} - {formatDate(commission.period_end)}
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600">{formatCurrency(commission.amount)}</td>
                    <td className="px-6 py-4">
                      {commission.status === 'paid' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Paid</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(commission.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {commission.paid_at ? formatDate(commission.paid_at) : '—'}
                    </td>
                  </tr>
                ))}
                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No commissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && selectedAffiliate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Process Payout</h2>
            <p className="text-gray-600 mb-2">Affiliate: <strong>{selectedAffiliate.full_name}</strong></p>
            <p className="text-gray-600 mb-2">Email: {selectedAffiliate.email}</p>
            <p className="text-gray-600 mb-2">Payout Method: <strong className="capitalize">{selectedAffiliate.payout_method}</strong></p>
            <p className="text-gray-600 mb-4">Payout Email: {selectedAffiliate.payout_email}</p>
            <p className="text-gray-600 mb-4">Pending amount: <strong className="text-green-600">{formatCurrency(selectedAffiliate.pending_earnings)}</strong></p>
            <p className="text-sm text-gray-500 mb-6">This will mark all pending commissions as paid.</p>
            <div className="flex gap-3">
              <button
                onClick={() => processPayout(selectedAffiliate.id)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Payout
              </button>
              <button
                onClick={() => {
                  setShowPayoutModal(false);
                  setSelectedAffiliate(null);
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Detail Modal */}
      {showAffiliateModal && selectedAffiliate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Affiliate Details</h2>
              <button
                onClick={() => {
                  setShowAffiliateModal(false);
                  setSelectedAffiliate(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{selectedAffiliate.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedAffiliate.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedAffiliate.company_name || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Affiliate Code</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedAffiliate.affiliate_code}</code>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tier / Commission</p>
                  <p className="font-medium capitalize">{selectedAffiliate.tier} ({selectedAffiliate.commission_rate}%)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payout Method</p>
                  <p className="font-medium capitalize">{selectedAffiliate.payout_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payout Email</p>
                  <p className="font-medium">{selectedAffiliate.payout_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(selectedAffiliate.created_at)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Performance</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedAffiliate.total_clicks}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedAffiliate.total_signups}</p>
                    <p className="text-xs text-gray-500">Signups</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedAffiliate.total_conversions}</p>
                    <p className="text-xs text-gray-500">Conversions</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedAffiliate.total_earnings)}</p>
                    <p className="text-xs text-gray-500">Total Earned</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Affiliate Link</h3>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 p-2 rounded block flex-1 break-all">
                    {`${window.location.origin}/register?ref=${selectedAffiliate.affiliate_code}`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${selectedAffiliate.affiliate_code}`);
                      showMessage('success', 'Link copied!');
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!selectedAffiliate.is_active && (
                  <button
                    onClick={() => {
                      approveAffiliate(selectedAffiliate.id, 20, 'standard');
                      setShowAffiliateModal(false);
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve Affiliate
                  </button>
                )}
                {selectedAffiliate.pending_earnings > 50 && (
                  <button
                    onClick={() => {
                      setShowAffiliateModal(false);
                      setShowPayoutModal(true);
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Process Payout ({formatCurrency(selectedAffiliate.pending_earnings)})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
