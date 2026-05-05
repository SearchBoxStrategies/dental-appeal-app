import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Download,
  Eye,
  Mail,
  MoreVertical
} from 'lucide-react';
import api from '../lib/api';

interface Subscription {
  id: number;
  practice_name: string;
  email: string;
  name: string;
  subscription_status: string;
  plan: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id: string;
  total_paid: number;
  last_payment_date: string;
  last_payment_amount: number;
}

interface SubscriptionStats {
  total_active: number;
  total_inactive: number;
  total_trialing: number;
  monthly_recurring_revenue: number;
  annual_recurring_revenue: number;
  average_revenue_per_user: number;
  churn_rate: number;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    total_active: 0,
    total_inactive: 0,
    total_trialing: 0,
    monthly_recurring_revenue: 0,
    annual_recurring_revenue: 0,
    average_revenue_per_user: 0,
    churn_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/admin/subscriptions');
      setSubscriptions(response.data.subscriptions);
      setStats(response.data.stats);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      trialing: 'bg-blue-100 text-blue-700',
      past_due: 'bg-red-100 text-red-700',
      cancelled: 'bg-orange-100 text-orange-700'
    };
    return colors[status] || colors.inactive;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'past_due': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'trialing': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-orange-600" />;
      default: return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Expires today';
    return `${diff} days remaining`;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.practice_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Practice', 'Contact', 'Email', 'Status', 'Plan', 'Amount', 'Renewal Date', 'Total Paid', 'Last Payment'];
    const rows = filteredSubscriptions.map(sub => [
      sub.practice_name,
      sub.name,
      sub.email,
      sub.subscription_status,
      sub.plan || 'Professional',
      sub.amount,
      formatDate(sub.current_period_end),
      sub.total_paid || 0,
      sub.last_payment_amount ? `${formatCurrency(sub.last_payment_amount)} on ${formatDate(sub.last_payment_date)}` : 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions_export_${new Date().toISOString().split('T')[0]}.csv`;
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600 mt-1">Manage client subscriptions and billing</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthly_recurring_revenue)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Annual Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.annual_recurring_revenue)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Revenue Per User</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.average_revenue_per_user)}</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Trialing</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_trialing}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Inactive/Cancelled</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_inactive}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Churn Rate</p>
              <p className="text-xl font-bold text-gray-900">{stats.churn_rate}%</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by practice, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
            <option value="cancelled">Cancelled</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={fetchSubscriptions}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Practice</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Plan</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Renewal</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total Paid</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{sub.practice_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{sub.name}</p>
                      <p className="text-xs text-gray-500">{sub.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(sub.subscription_status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(sub.subscription_status)}`}>
                        {sub.subscription_status}
                      </span>
                    </div>
                    {sub.subscription_status === 'active' && (
                      <p className="text-xs text-gray-500 mt-1">{getDaysRemaining(sub.current_period_end)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{sub.plan || 'Professional'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{formatCurrency(sub.amount)}</span>
                    <p className="text-xs text-gray-500">/month</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(sub.current_period_end)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(sub.total_paid || 0)}</p>
                      {sub.last_payment_amount && (
                        <p className="text-xs text-gray-500">
                          Last: {formatCurrency(sub.last_payment_amount)} on {formatDate(sub.last_payment_date)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No subscriptions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
