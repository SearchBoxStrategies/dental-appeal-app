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
  Printer,
  Pencil,
  RefreshCw,
  CalendarClock
} from 'lucide-react';
import api from '../lib/api';
import DocumentUpload from '../components/DocumentUpload';
import AppealPrep from '../components/AppealPrep';
import { Letterhead, downloadLetterPdf, printLetter, letterWithLetterhead } from '../lib/letterPdf';

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
  denial_date?: string | null;
  appeal_deadline?: string | null;
  appealed_at?: string | null;
  appeals?: Appeal[];
}

interface Appeal {
  id: number;
  generated_letter?: string;
  letter_content?: string;
  content?: string;
  status: string;
  created_at: string;
  edited_at?: string | null;
  model_used?: string;
}

interface PracticeProfile extends Letterhead {
  provider_name?: string | null;
}

const DAY = 24 * 60 * 60 * 1000;

// Whole days from today to a YYYY-MM-DD date (negative when past).
const daysUntil = (isoDate: string) => {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  const today = new Date();
  return Math.round((new Date(y, m - 1, d).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / DAY);
};

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
  const [practice, setPractice] = useState<PracticeProfile>({});
  const [editingLetter, setEditingLetter] = useState(false);
  const [letterDraft, setLetterDraft] = useState('');
  const [savingLetter, setSavingLetter] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [denialDateInput, setDenialDateInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');

  useEffect(() => {
    fetchClaimDetails();
  }, [id]);

  useEffect(() => {
    api.get('/practice/profile').then((r) => setPractice(r.data || {})).catch(() => {});
  }, []);

  const hasAppeal = selectedAppeal !== null && getLetterContent(selectedAppeal) !== '';

  function getLetterContent(appeal: Appeal | null): string {
    if (!appeal) return '';
    return appeal.generated_letter || appeal.letter_content || appeal.content || '';
  }

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
    if (hasAppeal && !confirm('Write a new letter? The current one stays in the history below.')) return;
    setGenerating(true);
    setEditingLetter(false);
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

  const letterFileName = (ext: string) =>
    `appeal_letter_${claim?.id}_${new Date().toISOString().split('T')[0]}.${ext}`;

  const downloadPdf = async () => {
    const letterContent = getLetterContent(selectedAppeal);
    if (!letterContent) return;
    try {
      await downloadLetterPdf({ ...practice, name: practice.name || 'Dental Practice' }, letterContent, letterFileName('pdf'));
    } catch (err) {
      console.error('PDF error:', err);
      alert('Could not create the PDF. Try Print instead.');
    }
  };

  const downloadLetter = () => {
    const letterContent = getLetterContent(selectedAppeal);
    if (!letterContent) return;
    const blob = new Blob([letterWithLetterhead(practice, letterContent)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = letterFileName('txt');
    a.click();
    URL.revokeObjectURL(url);
  };

  const printWithLetterhead = () => {
    const letterContent = getLetterContent(selectedAppeal);
    if (!letterContent) return;
    printLetter(practice, letterContent, `Appeal Letter - ${claim?.patient_name}`);
  };

  const startEditingLetter = () => {
    setLetterDraft(getLetterContent(selectedAppeal));
    setEditingLetter(true);
    setShowLetter(true);
  };

  const saveLetter = async () => {
    if (!selectedAppeal) return;
    setSavingLetter(true);
    try {
      const response = await api.patch(`/appeals/${selectedAppeal.id}`, { letterContent: letterDraft });
      setSelectedAppeal({ ...selectedAppeal, ...response.data });
      setClaim(prev => prev ? {
        ...prev,
        appeals: prev.appeals?.map(a => (a.id === selectedAppeal.id ? { ...a, ...response.data } : a)),
      } : prev);
      setEditingLetter(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Could not save the letter');
    } finally {
      setSavingLetter(false);
    }
  };

  const startEditingDeadline = () => {
    setDenialDateInput(claim?.denial_date?.slice(0, 10) || '');
    setDeadlineInput(claim?.appeal_deadline?.slice(0, 10) || '');
    setEditingDeadline(true);
  };

  const saveDeadline = async () => {
    const body: Record<string, string | null> = {};
    const denialChanged = denialDateInput !== (claim?.denial_date?.slice(0, 10) || '');
    if (denialChanged) body.denialDate = denialDateInput || null;
    // A changed denial date recalculates the deadline unless the deadline was also edited.
    if (deadlineInput && deadlineInput !== (claim?.appeal_deadline?.slice(0, 10) || '')) body.appealDeadline = deadlineInput;
    if (!Object.keys(body).length) {
      setEditingDeadline(false);
      return;
    }
    try {
      const response = await api.patch(`/claims/${id}/deadline`, body);
      setClaim(prev => prev ? { ...prev, ...response.data, appeals: prev.appeals } : prev);
      setEditingDeadline(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Could not save the dates');
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
  const appealSent = claim.status === 'appealed' || claim.status === 'under_review';
  const resolved = ['won', 'lost', 'paid'].includes(claim.status);
  const deadlineDays = claim.appeal_deadline ? daysUntil(claim.appeal_deadline) : null;
  const followUpDate = claim.appealed_at ? new Date(new Date(claim.appealed_at).getTime() + 30 * DAY) : null;
  const followUpDue = followUpDate ? followUpDate.getTime() <= Date.now() : false;

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
          <div className="flex gap-3 flex-wrap">
            {!hasAppeal && (
              <button
                onClick={generateAppeal}
                disabled={generating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Writing letter… (up to a minute)
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Appeal Letter
                  </>
                )}
              </button>
            )}
            {hasAppeal && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={downloadPdf}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={printWithLetterhead}
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
            <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              !resolved && !appealSent && deadlineDays !== null && deadlineDays <= 14
                ? 'bg-red-50 border-red-200'
                : appealSent && followUpDue ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <CalendarClock className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                {editingDeadline ? (
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label htmlFor="denial-date" className="block text-xs text-gray-600 mb-1">Date on the denial</label>
                      <input id="denial-date" type="date" value={denialDateInput} onChange={(e) => setDenialDateInput(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="deadline" className="block text-xs text-gray-600 mb-1">Appeal deadline</label>
                      <input id="deadline" type="date" value={deadlineInput} onChange={(e) => setDeadlineInput(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
                    </div>
                    <button onClick={saveDeadline} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">Save</button>
                    <button onClick={() => setEditingDeadline(false)} className="px-2 py-1.5 text-sm text-gray-600">Cancel</button>
                    <p className="w-full text-xs text-gray-500">Change the denial date and the deadline is recalculated from the insurer's appeal window.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm">
                      {resolved ? (
                        <p className="text-gray-700">Appeal closed.</p>
                      ) : appealSent && followUpDate ? (
                        <p className={followUpDue ? 'text-amber-800 font-medium' : 'text-gray-700'}>
                          Appeal sent {formatDate(claim.appealed_at || undefined)}.{' '}
                          {followUpDue
                            ? 'No answer after 30 days: call the insurer for a status update.'
                            : `Follow up on ${followUpDate.toLocaleDateString()} if there is no answer.`}
                        </p>
                      ) : claim.appeal_deadline && deadlineDays !== null ? (
                        <p className={deadlineDays <= 14 ? 'text-red-700 font-medium' : 'text-gray-700'}>
                          {deadlineDays < 0
                            ? `Appeal deadline passed on ${formatCalendarDate(claim.appeal_deadline)}.`
                            : `Appeal by ${formatCalendarDate(claim.appeal_deadline)} (${deadlineDays === 0 ? 'today' : `${deadlineDays} day${deadlineDays === 1 ? '' : 's'} left`}).`}
                        </p>
                      ) : (
                        <p className="text-gray-700">No appeal deadline set.</p>
                      )}
                      {claim.denial_date && <p className="text-xs text-gray-500 mt-0.5">Denied {formatCalendarDate(claim.denial_date)}</p>}
                      {!appealSent && !resolved && hasAppeal && (
                        <p className="text-xs text-gray-500 mt-0.5">Set the status to Appeal Sent once it is mailed or faxed; we'll remind you to follow up in 30 days.</p>
                      )}
                    </div>
                    <button onClick={startEditingDeadline} className="text-sm text-blue-600 hover:text-blue-800">Edit dates</button>
                  </div>
                )}
              </div>
            </div>
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

      <AppealPrep claimId={claim.id} providerName={practice.provider_name} />

      <DocumentUpload claimId={claim.id} onUploadComplete={fetchClaimDetails} />

      {hasAppeal && selectedAppeal && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">Generated Appeal Letter</h2>
              <p className="text-sm text-gray-500">
                Written {formatDate(selectedAppeal.created_at)}
                {selectedAppeal.edited_at ? ` · edited ${formatDate(selectedAppeal.edited_at)}` : ''}
              </p>
            </div>
            <div className="flex gap-4 flex-wrap">
              {!editingLetter && (
                <button onClick={startEditingLetter} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={() => copyToClipboard(letterWithLetterhead(practice, getLetterContent(selectedAppeal)))}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button onClick={downloadLetter} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
                <Download className="w-4 h-4" />
                .txt
              </button>
              <button
                onClick={generateAppeal}
                disabled={generating || editingLetter}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Writing…' : 'Rewrite'}
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
              {editingLetter ? (
                <div className="space-y-3">
                  <textarea
                    value={letterDraft}
                    onChange={(e) => setLetterDraft(e.target.value)}
                    rows={24}
                    className="w-full border border-gray-300 rounded-lg p-4 font-serif text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveLetter}
                      disabled={savingLetter || letterDraft.trim().length < 20}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                    >
                      {savingLetter ? 'Saving…' : 'Save letter'}
                    </button>
                    <button onClick={() => setEditingLetter(false)} disabled={savingLetter} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border rounded-lg shadow-inner p-8 max-h-[700px] overflow-y-auto">
                  <div className="text-center border-b-2 border-blue-900 pb-3 mb-6">
                    <p className="font-bold text-lg text-blue-900">{practice.name || 'Your Practice'}</p>
                    {[practice.address, [practice.city, [practice.state, practice.zip].filter(Boolean).join(' ')].filter(Boolean).join(', '),
                      [practice.phone && `Tel ${practice.phone}`, practice.fax && `Fax ${practice.fax}`].filter(Boolean).join('   ')]
                      .filter(Boolean).map((line, i) => <p key={i} className="text-xs text-slate-600">{line}</p>)}
                  </div>
                  <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed text-[15px]">
                    {getLetterContent(selectedAppeal)}
                  </pre>
                  {/\[[^\]]+\]/.test(getLetterContent(selectedAppeal)) && (
                    <p className="mt-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      This letter has [bracketed] details to fill in. Click Edit to complete them before sending.
                    </p>
                  )}
                </div>
              )}
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
