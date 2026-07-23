import { useState } from 'react';
import { AlertTriangle, X, Trash2, Eye, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface ClientHardDeleteProps {
  clientId: number;
  clientName: string;
  clientEmail: string;
  practiceName?: string;
  onClose: () => void;
  onDeleted: () => void;
}

interface DeletionPreview {
  user: {
    id: number;
    name: string;
    email: string;
    practice_name: string;
    subscription_status: string;
    created_at: string;
  };
  deletion_impact: {
    claims: number;
    appeals: number;
    notes: number;
    payments: number;
    sub_history: number;
    documents: number;
    referrals: number;
  };
  samples: {
    claims: Array<{ id: number; patient_name: string; status: string; created_at: string }>;
    payments: Array<{ id: number; amount_paid: number; status: string; created_at: string }>;
  };
  summary: {
    total_records: number;
    has_active_subscription: boolean;
    has_payments: boolean;
    has_claims: boolean;
  };
}

export default function ClientHardDelete({ 
  clientId, 
  clientName, 
  clientEmail,
  practiceName,
  onClose, 
  onDeleted 
}: ClientHardDeleteProps) {
  const [step, setStep] = useState<'preview' | 'confirm' | 'deleting' | 'done'>('preview');
  const [preview, setPreview] = useState<DeletionPreview | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [deletePayments, setDeletePayments] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPreview = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/clients/${clientId}/delete-preview`);
      setPreview(response.data.preview);
      setStep('confirm');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch deletion preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirmation !== 'DELETE_PERMANENTLY') {
      setError('Please type "DELETE_PERMANENTLY" to confirm');
      return;
    }

    setLoading(true);
    setError('');
    setStep('deleting');

    try {
      await api.delete(`/admin/clients/${clientId}/permanent`, {
        data: {
          confirm: confirmation,
          deletePayments,
          reason: reason || `Permanent deletion by admin`
        }
      });
      
      setStep('done');
      setTimeout(() => {
        onDeleted();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete client');
      setStep('confirm');
      setLoading(false);
    }
  };

  if (step === 'preview') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Permanent Deletion
              </h2>
              <p className="text-gray-600 mt-1">
                You are about to permanently delete <strong>{clientName}</strong>
              </p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              This action will permanently delete all data associated with this client.
              Please review the impact before proceeding.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Client:</strong> {clientName} ({clientEmail})
            </p>
            {practiceName && (
              <p className="text-sm text-gray-600">
                <strong>Practice:</strong> {practiceName}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={fetchPreview}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Deletion Impact
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm' && preview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Confirm Permanent Deletion
              </h2>
              <p className="text-gray-600 mt-1">
                This action <strong>cannot be undone</strong>
              </p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Deletion Impact */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">Data to be deleted:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-red-600">
                  {preview.deletion_impact.claims}
                </span>
                <span className="text-xs text-gray-600">Claims</span>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-red-600">
                  {preview.deletion_impact.appeals}
                </span>
                <span className="text-xs text-gray-600">Appeals</span>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-orange-600">
                  {preview.deletion_impact.payments}
                </span>
                <span className="text-xs text-gray-600">Payments</span>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-purple-600">
                  {preview.deletion_impact.notes}
                </span>
                <span className="text-xs text-gray-600">Notes</span>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-gray-600">
                  {preview.deletion_impact.documents || 0}
                </span>
                <span className="text-xs text-gray-600">Documents</span>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-blue-600">
                  {preview.deletion_impact.sub_history}
                </span>
                <span className="text-xs text-gray-600">Subscriptions</span>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="block text-2xl font-bold text-pink-600">
                  {preview.deletion_impact.referrals}
                </span>
                <span className="text-xs text-gray-600">Referrals</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Total records: <strong>{preview.summary.total_records}</strong>
            </div>
          </div>

          {/* Active Subscription Warning */}
          {preview.summary.has_active_subscription && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ This client has an active subscription. It will be cancelled.
              </p>
            </div>
          )}

          {/* Payment Options */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={deletePayments}
                onChange={(e) => setDeletePayments(e.target.checked)}
                className="rounded border-gray-300"
              />
              Also permanently delete payment records (otherwise they will be anonymized)
            </label>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for deletion (optional):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              rows={2}
              placeholder="Why is this client being deleted?"
            />
          </div>

          {/* Confirmation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-mono font-bold text-red-600">DELETE_PERMANENTLY</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 font-mono text-sm"
              placeholder="DELETE_PERMANENTLY"
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmation !== 'DELETE_PERMANENTLY' || loading}
              className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                confirmation === 'DELETE_PERMANENTLY' && !loading
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Permanently Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'deleting') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Deleting Client Data...</h3>
          <p className="text-gray-600 text-sm mt-1">
            Please wait while all associated data is permanently removed.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-green-600 text-3xl">✓</div>
          </div>
          <h3 className="text-lg font-semibold text-green-700">Client Deleted Successfully</h3>
          <p className="text-gray-600 text-sm mt-1">
            All data has been permanently removed.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
