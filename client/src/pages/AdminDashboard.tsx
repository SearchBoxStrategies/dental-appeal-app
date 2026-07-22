import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileText, TrendingUp, CheckCircle,
  Eye, Search, Download, DollarSign,
  Mail, Edit, RefreshCw, Activity,
  UserCheck, UserX, Gift, Trash2, RotateCcw
} from 'lucide-react';
import api from '../lib/api';
import ClientNotes from '../components/ClientNotes';
import SubscriptionOverride from '../components/SubscriptionOverride';
import ConfirmDialog from '../components/ConfirmDialog';

interface Client {
  id: number;
  email: string;
  name: string;
  practice_name: string;
  subscription_status: string;
  created_at: string;
  deleted_at?: string | null;
  is_admin: boolean;
  total_claims?: number;
  total_appeals?: number;
  won_appeals?: number;
  last_active?: string;
  stripe_customer_id?: string;
  is_active?: boolean;
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
  const [deletedClients, setDeletedClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToRestore, setClientToRestore] = useState<Client | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeSubscriptions: 0,
    totalClaims: 0,
    totalAppeals: 0,
    successRate: 0,
    totalAffiliates: 0,
    pendingPayouts: 0
  });

  const fetchClients = async () => {
    try {
      const response = await api.get('/admin/clients');
      setClients(response.data);
      
      const active = response.data.filter((c: Client) => c.subscription_status === 'active').length;
      setStats(prev => ({
        ...prev,
        totalClients: response.data.length,
        activeSubscriptions: active
      }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedClients = async () => {
    try {
      const response = await api.get('/admin/clients/deleted');
      setDeletedClients(response.data);
    } catch (error) {
      console.error('Failed to fetch deleted clients:', error);
    }
  };

  const fetchAffiliateStats = async () => {
    try {
      const response = await api.get('/affiliate/admin/list');
      const affiliates = response.data;
      const activeAffiliates = affiliates.filter((a: any) => a.is_active).length;
      const pendingPayouts = affiliates.reduce((sum: number, a: any) => sum + (a.pending_earnings || 0), 0);
      setStats(prev => ({
        ...prev,
        totalAffiliates: affiliates.length,
        activeAffiliates: activeAffiliates,
        pendingPayouts: pendingPayouts
      }));
    } catch (error) {
      console.error('Failed to fetch affiliate stats:', error);
    }
  };

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

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await api.delete(`/admin/clients/${clientToDelete.id}`);
      setShowDeleteConfirm(false);
      setClientToDelete(null);
      await fetchClients();
      await fetchDeletedClients();
      setSuccess('Client deactivated and marked as deleted');
      setTimeout(() => setSuccess(''), 3000);
      if (view === 'detail') {
        setView('list');
        setSelectedClient(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete client');
    }
  };

  const handleRestoreClient = async () => {
    if (!clientToRestore) return;
    
    try {
      await api.post(`/admin/clients/${clientToRestore.id}/restore`);
      setShowRestoreConfirm(false);
      setClientToRestore(null);
      await fetchClients();
      await fetchDeletedClients();
      setSuccess('Client restored successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to restore client');
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDeletedClients();
    fetchAffiliateStats();
  }, []);

  const filteredClients = (showDeleted ? deletedClients : clients).filter(client => {
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
      cancelled: 'bg-orange-100 text-orange-700',
      deleted: 'bg-red-100 text-red-700'
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
      client.subscription_status || 'inactive',
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

  if (view === 'detail' && selectedClient) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setView('list');
            setSelectedClient(null);
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Clients
        </button>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedClient.practice_name || selectedClient.name}</h1>
              <p className="text-gray-500">{selectedClient.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedClient.subscription_status)}`}>
                  {selectedClient.subscription_status}
                </span>
                {!selectedClient.deleted_at && (
                  <SubscriptionOverride
                    practiceId={selectedClient.id}
                    currentStatus={selectedClient.subscription_status}
                    practiceName={selectedClient.practice_name || selectedClient.name}
                    onStatusChanged={() => fetchClientDetails(selectedClient.id)}
                  />
                )}
                <span className="text-xs text-gray-400">Joined {new Date(selectedClient.created_at).toLocaleDateString()}</span>
                {selectedClient.deleted_at && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Deleted {new Date(selectedClient.deleted_at).toLocaleDateString()}
                  </span>
                )}
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
              {!selectedClient.deleted_at && (
                <button
                  onClick={() => {
                    setClientToDelete(selectedClient);
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                  title="Delete Client"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

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

        <ClientNotes clientId={selectedClient.id} />
        
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Deactivate Client"
          message={`Are you sure you want to deactivate "${selectedClient.practice_name || selectedClient.name}"? This will mark the client as deleted. Their data will be preserved and can be restored later.`}
          confirmLabel="Deactivate"
          cancelLabel="Cancel"
          confirmVariant="danger"
          onConfirm={handleDeleteClient}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setClientToDelete(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage all clients, subscriptions, and affiliates</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold">{stats.totalClients}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Active Clients</p>
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
        <Link to="/admin/affiliates" className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <Gift className="w-6 h-6 text-pink-500" />
            <span className="text-2xl font-bold">{stats.totalAffiliates || 0}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Affiliates</p>
          <p className="text-xs text-blue-600 mt-2">Manage →</p>
        </Link>
      </div>

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
            <option value="deleted">Deleted</option>
          </select>
          <button
            onClick={() => {
              setShowDeleted(!showDeleted);
              if (!showDeleted) {
                fetchDeletedClients();
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
              showDeleted 
                ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {showDeleted ? 'Showing Deleted' : 'View Deleted'}
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

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
                    {client.deleted_at && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Deleted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchClientDetails(client.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {!client.deleted_at && (
                        <button
                          onClick={() => {
                            setClientToDelete(client);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                          title="Delete Client"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                      {client.deleted_at && (
                        <button
                          onClick={() => {
                            setClientToRestore(client);
                            setShowRestoreConfirm(true);
                          }}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                          title="Restore Client"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {showDeleted ? 'No deleted clients found' : 'No clients found'}
            </h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Deactivate Client"
        message={`Are you sure you want to deactivate "${clientToDelete?.practice_name || clientToDelete?.name || 'this client'}"? Their data will be preserved and can be restored later.`}
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteClient}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setClientToDelete(null);
        }}
      />

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        title="Restore Client"
        message={`Are you sure you want to restore "${clientToRestore?.practice_name || clientToRestore?.name || 'this client'}"? This will reactivate their account.`}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        confirmVariant="primary"
        onConfirm={handleRestoreClient}
        onCancel={() => {
          setShowRestoreConfirm(false);
          setClientToRestore(null);
        }}
      />
    </div>
  );
}
