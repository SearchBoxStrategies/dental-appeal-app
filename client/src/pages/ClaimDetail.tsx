import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Printer
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
  amount_recovered?: number | null;
  status: string;
  created_at: string;
  appeals?: Appeal[];
}

interface Appeal {
  id: number;
  generated_letter?: string;
  letter_content?: string;
  content?: string;
  status: string;
  created_at: string;
  model_used?: string;
}

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [outcomeStatus, setOutcomeStatus] = useState<'won' | 'paid' | null>(null);
  const [recoveredInput, setRecoveredInput] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  useEffect(() => {
    fetchClaimDetails();
  }, [id]);

  const getLetterContent = (appeal: Appeal | null): string => {
    if (!appeal) return '';
    return appeal.generated_letter || appeal.letter_content || appeal.content || '';
  };

  const fetchClaimDetails = async () => {
    try {
      const response = await api.get(`/claims/${id}`);
      setClaim(response.data);
      if (response.data.appeals && response.data.appeals.length > 0) {
        setSelectedAppeal(response.data.appeals[0]);
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

  const updateStatus = async (newStatus: string, amountRecovered?: number) => {
    setSavingStatus(true);
    try {
      const response = await api.patch(`/claims/${id}/status`, { status: newStatus, amountRecovered });
      setClaim(prev => prev ? { ...prev, ...response.data, appeals: prev.appeals } : null);
      setOutcomeStatus(null);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  // Won/Paid ask what the insurer actually paid, so recovered dollars are real numbers.
  const onStatusSelect = (newStatus: string) => {
    if (newStatus === 'won' || newStatus === 'paid') {
      const current = claim?.amount_recovered ?? claim?.amount_denied;
      setRecoveredInput(current != null ? String(current) : '');
      setOutcomeStatus(newStatus);
    } else {
      setOutcomeStatus(null);
      updateStatus(newStatus);
    }
  };

  const saveOutcome = () => {
    if (!outcomeStatus) return;
    const amount = recoveredInput.trim() === '' ? undefined : Number(recoveredInput);
    if (amount !== undefined && (!Number.isFinite(amount) || amount < 0)) {
      alert('Enter the amount paid as a number, e.g. 450.00');
      return;
    }
    updateStatus(outcomeStatus, amount);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      pending: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        label: 'Pending',
        icon: <Clock className="w-3 h-3" />
      },
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

  // Calendar dates (DOB, service date) have no time zone; build them in local time so they
  // don't display a day early west of UTC.
  const formatCalendarDate = (dateString?: string) => {
    if (!dateString) return '—';
    const [y, m, d] = dateString.slice(0, 10).split('-').map(Number);
    if (!y || !m || !d) return formatDate(dateString);
    return new Date(y, m - 1, d).toLocaleDateString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadLetter = () => {
    const letterContent = getLetterContent(selectedAppeal);
    if (!letterContent) return;
    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appeal_letter_${claim?.id}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printLetter = () => {
    const letterContent = getLetterContent(selectedAppeal);
    if (!letterContent) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Appeal Letter - ${claim?.patient_name}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
            <pre style="white-space: pre-wrap; font-family: inherit;">${letterContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
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
  const hasAppeal = selectedAppeal !== null && getLetterContent(selectedAppeal) !== '';

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/claims')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Claims
      </button>

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
                  <p className="text-sm text-gray-600">DOB: {formatCalendarDate(claim.patient_dob)}</p>
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
                  <p className="font-medium text-gray-900">{formatCalendarDate(claim.service_date)}</p>
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

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Status</label>
                <select
                  value={outcomeStatus ?? claim.status}
                  onChange={(e) => onStatusSelect(e.target.value)}
                  disabled={savingStatus}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="appealed">Appeal Sent</option>
                  <option value="under_review">Under Review</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {(claim.status === 'won' || claim.status === 'paid') && claim.amount_recovered != null ? (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Recovered</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(claim.amount_recovered)}</p>
                </div>
              ) : claim.amount_denied ? (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Potential Recovery</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(claim.amount_denied)}</p>
                </div>
              ) : null}
            </div>
            {outcomeStatus && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <label htmlFor="amount-recovered" className="block text-sm font-medium text-gray-800 mb-2">
                  How much did the insurer pay on this appeal?
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      id="amount-recovered"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={recoveredInput}
                      onChange={(e) => setRecoveredInput(e.target.value)}
                      className="w-40 pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={saveOutcome}
                    disabled={savingStatus}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {savingStatus ? 'Saving…' : `Mark as ${outcomeStatus === 'won' ? 'Won' : 'Paid'}`}
                  </button>
                  <button
                    onClick={() => setOutcomeStatus(null)}
                    disabled={savingStatus}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">This total feeds your recovered-dollars dashboard.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DocumentUpload claimId={claim.id} onUploadComplete={fetchClaimDetails} />

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
                onClick={() => copyToClipboard(getLetterContent(selectedAppeal))}
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
                  {getLetterContent(selectedAppeal)}
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
