import { useState, useEffect } from 'react';
import { Bell, Mail, TrendingUp, AlertCircle, Save } from 'lucide-react';
import api from '../lib/api';

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState({
    appeal_updates: true,
    payment_receipts: true,
    marketing_emails: false,
    weekly_digest: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await api.get('/user/preferences/email');
      setPreferences(response.data);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await api.put('/user/preferences/email', preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const preferencesList = [
    { key: 'appeal_updates', label: 'Appeal Status Updates', icon: Bell, description: 'Get notified when your appeal status changes' },
    { key: 'payment_receipts', label: 'Payment Receipts', icon: Mail, description: 'Receive email receipts for successful payments' },
    { key: 'weekly_digest', label: 'Weekly Digest', icon: TrendingUp, description: 'Weekly summary of your claims and appeals' },
    { key: 'marketing_emails', label: 'Product Updates', icon: AlertCircle, description: 'New features and tips for better appeals' },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">Choose which emails you'd like to receive</p>
        </div>
        <button
          onClick={savePreferences}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✓ Preferences saved successfully!
        </div>
      )}

      <div className="space-y-4">
        {preferencesList.map(({ key, label, icon: Icon, description }) => (
          <div key={key} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences[key as keyof typeof preferences]}
                onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
