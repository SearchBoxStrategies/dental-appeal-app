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
      <div className="flex justify-center
