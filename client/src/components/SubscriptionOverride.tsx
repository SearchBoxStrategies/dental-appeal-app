import { useState } from 'react';
import { CreditCard, History, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

interface SubscriptionOverrideProps {
  practiceId: number;
  currentStatus: string;
  practiceName: string;
  onStatusChanged: () => void;
}

export default function SubscriptionOverride({ practiceId, currentStatus, practiceName, onStatusChanged }: SubscriptionOverrideProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'trialing', label: 'Trialing', color: 'blue' },
    { value: 'past_due', label: 'Past Due', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'orange' }
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(o => o.value === status);
    return option?.color || 'gray';
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get(`/admin/subscriptions/${practiceId}/history`);
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      alert('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOverride = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for the status change');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post(`/admin/subscriptions/${practiceId}/override`, {
        status: selectedStatus,
        reason: reason
      });
      setShowModal(false);
      setReason('');
      onStatusChanged();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Status Display with Override Button */}
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(currentStatus)}-100 text-${getStatusColor(currentStatus)}-700`}>
          {currentStatus}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <CreditCard className="w-3 h-3" />
          Override
        </button>
        <button
          onClick={fetchHistory}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <History className="w-3 h-3" />
          History
        </button>
      </div>

      {/* Override Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Override Subscription Status</h3>
              <p className="text-sm text-gray-500 mt-1">{practiceName}</p>
            </div>
            
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Why is this status being changed?"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    This change will not affect Stripe billing. Use this only for manual adjustments or customer service exceptions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Subscription History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {loadingHistory ? (
                <div className="text-center py-8">Loading...</div>
              ) : history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No subscription history found.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(item.old_status)}-100 text-${getStatusColor(item.old_status)}-700`}>
                            {item.old_status}
                          </span>
                          <span>→</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(item.new_status)}-100 text-${getStatusColor(item.new_status)}-700`}>
                            {item.new_status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                      <p className="text-xs text-gray-400 mt-2">By: {item.changed_by_name || 'Admin'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
