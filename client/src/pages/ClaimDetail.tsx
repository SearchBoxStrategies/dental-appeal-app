import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  Calendar,
  Building2,
  User,
  DollarSign,
  Activity,
  Download,
  Copy,
  Printer,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../lib/api';
import DocumentUpload from '../components/DocumentUpload';

interface Claim {
  id: number;
  patient_name: string;
  patient_dob: string;
  insurance_company: string;
  policy_number?: string;
  claim_number?: string;
  procedure_codes: string[];
  denial_reason: string;
  service_date: string;
  amount_claimed?: number;
  amount_denied?: number;
  status: string;
  created_at: string;
  appeals?: Appeal[];
}

interface Appeal {
  id: number;
  generated_letter: string;
  status: string;
  created_at: string;
  model_used?: string;
}

interface Stats {
  total_claims: number;
  total_appeals: number;
  won_appeals: number;
  lost_appeals: number;
  pending_appeals: number;
  success_rate: number;
}

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  useEffect(() => {
    fetchClaimDetails();
  }, [id]);

  const fetchClaimDetails = async () => {
    try {
      const response = await api.get(`/claims/${id}`);
      setClaim(response.data);
      if (response.data.appeals && response.data.appeals.length > 0) {
        setSelectedAppeal(response.data.appeals[0]);
      }
      
      // Calculate stats if we have appeals
      if (response.data.appeals) {
        const appeals = response.data.appeals;
        const won = appeals.filter((a: Appeal) => a.status === 'won').length;
        const lost = appeals.filter((a: Appeal) => a.status === 'lost').length;
        const pending = appeals.filter((a: Appeal) => a.status === 'pending' || a.status === 'appealed').length;
        const successRate = won + lost > 0 ? (won / (won + lost)) * 100 : 0;
        
        setStats({
          total_claims: 1,
          total_appeals: appeals.length,
          won_appeals: won,
          lost_appeals: lost,
          pending_appeals: pending,
          success_rate: successRate
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load claim details');
    } finally {
      setLoading(false);
    }
  };

  const generateAppeal = async () => {
    setGenerating(true);
    setError('');
    try {
      const response = await api.post(`/appeals/generate/${id}`);
      await fetchClaimDetails();
      if (response.data) {
        setSelectedAppeal(response.data);
        setShowLetter(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate appeal letter');
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await api.patch(`/claims/${id}/status`, { status: newStatus });
      setClaim(prev => prev ? { ...prev, status: newStatus } : null);
      // Show success message
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadLetter = () => {
    if (!selectedAppeal?.generated_letter) return;
    const blob = new Blob([selectedAppeal.generated_letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appeal_letter_${claim?.id}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printLetter = () => {
    if (!selectedAppeal?.generated_letter) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Appeal Letter - ${claim?.patient_name}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
            <pre style="white-space: pre-wrap; font-family: inherit;">${selectedAppeal.generated_letter}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error || 'Claim not found'}
      </div>
    );
  }

  const statusConfig = getStatusBadge(claim.status);
  const hasAppeal = selectedAppeal !== null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/claims')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Claims
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{claim.patient_name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
            <p className="text-gray-500 mt-1">Claim #{claim.id} • {claim.insurance_company}</p>
          </div>
          <div className="flex gap-3">
            {!hasAppeal && (
              <button
                onClick={generateAppeal}
                disabled={generating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {generating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Appeal Letter
                  </>
                )}
              </button>
            )}
            {hasAppeal && (
              <div className="flex gap-2">
                <button
                  onClick={downloadLetter}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={printLetter}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && stats.total_appeals > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs text-gray-500">Total Appeals</p>
            <p className="text-xl font-bold">{stats.total_appeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs text-gray-500">Won</p>
            <p className="text-xl font-bold text-green-600">{stats.won_appeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs text-gray-500">Lost</p>
            <p className="text-xl font-bold text-red-600">{stats.lost_appeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-bold text-yellow-600">{stats.pending_appeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs text-gray-500">Success Rate</p>
            <p className="text-xl font-bold text-blue-600">{stats.success_rate.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Claim Details Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Claim Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium text-gray-900">{claim.patient_name}</p>
                  <p className="text-sm text-gray-600">DOB: {formatDate(claim.patient_dob)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="font-medium text-gray-900">{claim.insurance_company}</p>
                  {claim.policy_number && <p className="text-sm text-gray-600">Policy: {claim.policy_number}</p>}
                  {claim.claim_number && <p className="text-sm text-gray-600">Claim #: {claim.claim_number}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Service Date</p>
                  <p className="font-medium text-gray-900">{formatDate(claim.service_date)}</p>
                  <p className="text-sm text-gray-600">Filed: {formatDate(claim.created_at)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Procedure Codes</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {claim.procedure_codes?.map((code, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-mono">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Amounts</p>
                  <p className="font-medium text-gray-900">Claimed: {formatCurrency(claim.amount_claimed)}</p>
                  {claim.amount_denied && <p className="text-red-600">Denied: {formatCurrency(claim.amount_denied)}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Denial Reason</p>
                  <p className="text-gray-900">{claim.denial_reason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Status</label>
                <select
                  value={claim.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="appealed">Appeal Sent</option>
                  <option value="under_review">Under Review</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {claim.amount_denied && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Potential Recovery</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(claim.amount_denied)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
      <DocumentUpload claimId={claim.id} onUploadComplete={fetchClaimDetails} />

      {/* Appeal Letter Section */}
      {hasAppeal && selectedAppeal && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">Generated Appeal Letter</h2>
              <p className="text-sm text-gray-500">
                Generated using {selectedAppeal.model_used || 'AI'} on {formatDate(selectedAppeal.created_at)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(selectedAppeal.generated_letter)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => setShowLetter(!showLetter)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
              >
                {showLetter ? 'Hide' : 'Show'} Letter
              </button>
            </div>
          </div>
          {showLetter && (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {selectedAppeal.generated_letter}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
