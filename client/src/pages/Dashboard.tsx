import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  PlusCircle,
  ArrowRight,
  Activity,
  DollarSign
} from 'lucide-react';
import api from '../lib/api';

interface DashboardStats {
  totalClaims: number;
  totalAppeals: number;
  appealsThisMonth: number;
  activeAppeals?: number;
  wonRate?: number;
  estimatedRecovery?: number;
  successRate?: number;
}

interface RecentClaim {
  id: number;
  patient_name: string;
  insurance_company: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    totalAppeals: 0,
    appealsThisMonth: 0,
    activeAppeals: 0,
    wonRate: 0,
    estimatedRecovery: 0,
    successRate: 0
  });
  const [recentClaims, setRecentClaims] = useState<RecentClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, claimsRes] = await Promise.all([
          api.get('/claims/stats'),
          api.get('/claims?limit=5')
        ]);
        
        // Calculate additional stats
        const claims = claimsRes.data;
        const activeAppeals = claims.filter((c: RecentClaim) => c.status === 'appealed' || c.status === 'under_review').length;
        const wonClaims = claims.filter((c: RecentClaim) => c.status === 'won').length;
        const resolvedClaims = claims.filter((c: RecentClaim) => c.status === 'won' || c.status === 'lost').length;
        const wonRate = resolvedClaims > 0 ? (wonClaims / resolvedClaims) * 100 : 0;
        
        setStats({
          ...statsRes.data,
          activeAppeals,
          wonRate: Math.round(wonRate),
          estimatedRecovery: 0, // You can calculate from denied amounts
          successRate: Math.round(wonRate)
        });
        setRecentClaims(claimsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      appealed: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      won: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
      paid: 'bg-purple-100 text-purple-700'
    };
    return badges[status] || badges.draft;
  };

  const statCards = [
    { 
      title: 'Total Claims', 
      value: stats.totalClaims, 
      icon: FileText, 
      color: 'bg-blue-500',
      change: '+0%',
      changeType: 'positive'
    },
    { 
      title: 'Total Appeals', 
      value: stats.totalAppeals, 
      icon: TrendingUp, 
      color: 'bg-green-500',
      change: '+0%',
      changeType: 'positive'
    },
    { 
      title: 'Active Appeals', 
      value: stats.activeAppeals || 0, 
      icon: Clock, 
      color: 'bg-yellow-500',
      change: '+0%',
      changeType: 'positive'
    },
    { 
      title: 'Success Rate', 
      value: stats.successRate || 0, 
      icon: CheckCircle, 
      color: 'bg-teal-500',
      suffix: '%',
      change: '+0%',
      changeType: 'positive'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your appeals.</p>
        </div>
        <Link
          to="/claims/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          New Claim
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.change && (
                  <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {stat.value}{stat.suffix || ''}
              </p>
              <p className="text-sm text-slate-600 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <p className="text-2xl font-bold text-slate-900">{stats.appealsThisMonth}</p>
              <p className="text-xs text-slate-500">appeals filed</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Success Rate</p>
              <p className="text-2xl font-bold text-slate-900">{stats.successRate || 0}%</p>
              <p className="text-xs text-slate-500">of resolved appeals</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Est. Recovery</p>
              <p className="text-2xl font-bold text-slate-900">$0</p>
              <p className="text-xs text-slate-500">from won appeals</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent Claims</h2>
            <p className="text-slate-600 text-sm mt-1">Your most recent insurance claims</p>
          </div>
          <Link
            to="/claims"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentClaims.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No claims yet</h3>
            <p className="text-slate-600 mb-4">Create your first claim to start generating appeals</p>
            <Link
              to="/claims/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5" />
              Create Claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Insurance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-900">{claim.patient_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {claim.insurance_company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/claims/${claim.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Appeal a Denial</h3>
              <p className="text-sm text-slate-600">Start a new insurance appeal</p>
            </div>
          </div>
          <Link
            to="/claims/new"
            className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Track Appeals</h3>
              <p className="text-sm text-slate-600">Monitor your appeal status</p>
            </div>
          </div>
          <Link
            to="/claims"
            className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Need Help?</h3>
              <p className="text-sm text-slate-600">Guide to writing appeals</p>
            </div>
          </div>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Learn more
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
