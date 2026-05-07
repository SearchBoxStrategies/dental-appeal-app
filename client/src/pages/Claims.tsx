import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Building2,
  User
} from 'lucide-react';
import api from '../lib/api';

interface Claim {
  id: number;
  patient_name: string;
  insurance_company: string;
  procedure_codes: string[];
  denial_reason: string;
  status: string;
  created_at: string;
  amount_claimed?: number;
  amount_denied?: number;
}

interface DashboardStats {
  totalClaims: number;
  activeAppeals: number;
  wonRate: number;
  estimatedRecovery: number;
}

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    activeAppeals: 0,
    wonRate: 0,
    estimatedRecovery: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchClaims();
    fetchStats();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/claims');
      setClaims(response.data);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/claims/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      draft: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-600', 
        label: 'Draft',
        icon: <FileText className="w-3 h-3" />
      },
      appealed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        label: 'Appeal Sent',
        icon: <AlertCircle className="w-3 h-3" />
      },
      under_review: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        label: 'Under Review',
        icon: <Clock className="w-3 h-3" />
      },
      won: { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        label: 'Won',
        icon: <CheckCircle className="w-3 h-3" />
      },
      lost: { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        label: 'Lost',
        icon: <XCircle className="w-3 h-3" />
      },
      paid: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-700', 
        label: 'Paid',
        icon: <CheckCircle className="w-3 h-3" />
      }
    };
    return config[status] || config.draft;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insurance_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.denial_reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-600 mt-1">Manage your insurance claims and appeals</p>
        </div>
        <Link
          to="/claims/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          New Claim
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClaims}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Appeals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAppeals}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wonRate}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Est. Recovery</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.estimatedRecovery)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
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
            placeholder="Search by patient, insurance, or denial reason..."
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
            <option value="draft">Draft</option>
            <option value="appealed">Appeal Sent</option>
            <option value="under_review">Under Review</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Patient</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Insurance</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Procedure</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Denial Reason</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredClaims.map((claim) => {
                const statusConfig = getStatusBadge(claim.status);
                return (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{claim.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{claim.insurance_company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">
                        {claim.procedure_codes?.join(', ') || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {claim.denial_reason?.substring(0, 80)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 text-sm">
                          {new Date(claim.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          Claimed: {formatCurrency(claim.amount_claimed)}
                        </p>
                        {claim.amount_denied && (
                          <p className="text-xs text-red-600">
                            Denied: {formatCurrency(claim.amount_denied)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/claims/${claim.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No claims found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
            <Link
              to="/claims/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5" />
              Create your first claim
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
