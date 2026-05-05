import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileText, TrendingUp, CheckCircle,
  Eye, Search, Download, DollarSign,
  Mail, Edit, RefreshCw, Activity,
  UserCheck, UserX
} from 'lucide-react';
import api from '../lib/api';

interface Client {
  id: number;
  email: string;
  name: string;
  practice_name: string;
  subscription_status: string;
  created_at: string;
  is_admin: boolean;
  total_claims?: number;
  total_appeals?: number;
  won_appeals?: number;
  last_active?: string;
  stripe_customer_id?: string;
}

interface ClientDetail extends Client {
  stats: {
    total_claims: number;
    total_appeals: number;
    won_appeals: number;
    lost_appeals: number;
    pending_appeals: number;
    success_rate: number;
  };
  recentClaims: Array<{
    id: number;
    patient_name: string;
    insurance_company: string;
    status: string;
    created_at: string;
    appeal_status?: string;
  }>;
  paymentStats?: {
    total_paid: number;
    total_transactions: number;
    last_payment_date: string;
  };
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [stats, setStats] = useState({
    totalClients: 0,
    activeSubscriptions: 0,
    totalClaims: 0,
    totalAppeals: 0,
    successRate: 0
  });

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const response = await api.get('/admin/clients');
      setClients(response.data);
      
      // Calculate stats
      const active = response.data.filter((c: Client) => c.subscription_status === 'active').length;
      setStats({
        totalClients: response.data.length,
        activeSubscriptions: active,
        totalClaims: 0,
        totalAppeals: 0,
        successRate: 0
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single client details
  const fetchClientDetails = async (clientId: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/clients/${clientId}`);
      setSelectedClient(response.data);
      setView('detail');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.practice_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getClaimStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600',
      appealed: 'bg-blue-100 text-blue-700',
      won: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.draft;
  };

  const exportToCSV = () => {
    const headers = ['Practice', 'Contact Name', 'Email', 'Status', 'Joined Date', 'Total Claims', 'Total Appeals'];
    const rows = filteredClients.map(client => [
      client.practice_name || 'N/A',
      client.name || 'N/A',
      client.email,
      client.subscription_status,
      new Date(client.created_at).toLocaleDateString(),
      client.total_claims?.toString() || '0',
      client.total_appeals?.toString() || '0'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && view === 'list') {
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

  // Detail View
  if (view === 'detail' && selectedClient) {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => {
            setView('list');
            setSelectedClient(null);
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Clients
        </button>

        {/* Client Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedClient.practice_name || selectedClient.name}</h1>
              <p className="text-gray-500">{selectedClient.email}</p>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedClient.subscription_status)}`}>
                  {selectedClient.subscription_status}
                </span>
                <span className="text-xs text-gray-400">Joined {new Date(selectedClient.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Mail className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Edit className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <FileText className="w-6 h-6 text-blue-500" />
              <span className="text-2xl font-bold">{selectedClient.stats?.total_claims || 0}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Total Claims</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <Activity className="w-6 h-6 text-purple-500" />
              <span className="text-2xl font-bold">{selectedClient.stats?.total_appeals || 0}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Total Appeals</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-2xl font-bold">{selectedClient.stats?.won_appeals || 0}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Won Appeals</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-6 h-6 text-teal-500" />
              <span className="text-2xl font-bold">{selectedClient.stats?.success_rate || 0}%</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Success Rate</p>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Claims</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Patient</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Insurance</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Appeal</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedClient.recentClaims?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{claim.patient_name}</td>
                    <td className="px-6 py-4 text-gray-600">{claim.insurance_company}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClaimStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(claim.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {claim.appeal_status ? (
                        <span className="text-xs text-green-600">Generated</span>
                      ) : (
                        <span className="text-xs text-gray-400">Not generated</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage all clients and subscriptions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold">{stats.totalClients}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Clients</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <UserCheck className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold">{stats.activeSubscriptions}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <UserX className="w-6 h-6 text-red-500" />
            <span className="text-2xl font-bold">{stats.totalClients - stats.activeSubscriptions}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Inactive</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <FileText className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold">-</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <DollarSign className="w-6 h-6 text-teal-500" />
            <span className="text-2xl font-bold">-</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">MRR</p>
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
            <option value="inactive">Inactive</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Practice</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {client.practice_name || client.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{client.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(client.subscription_status)}`}>
                      {client.subscription_status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => fetchClientDetails(client.id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
