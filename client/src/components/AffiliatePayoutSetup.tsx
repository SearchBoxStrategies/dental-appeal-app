import { useState, useEffect } from 'react';
import { Banknote, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import api from '../lib/api';

interface ConnectStatus {
  hasAccount: boolean;
  status: string | null;
  details_submitted?: boolean;
  payouts_enabled?: boolean;
  auto_payout_enabled?: boolean;
}

export default function AffiliatePayoutSetup() {
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [country, setCountry] = useState<'US' | 'CA'>('US');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/affiliate/connect/status')
      .then(res => setStatus(res.data))
      .catch(() => setError('Could not load payout status.'));
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/affiliate/connect/setup', { country });
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not start payout setup. Please try again.');
      setBusy(false);
    }
  };

  const openStripe = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/affiliate/connect/login');
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not open your payout account.');
      setBusy(false);
    }
  };

  const toggleAutoPayout = async (enabled: boolean) => {
    try {
      await api.post('/affiliate/connect/auto-payout', { enabled });
      setStatus(s => (s ? { ...s, auto_payout_enabled: enabled } : s));
    } catch {
      setError('Could not update payout setting.');
    }
  };

  if (!status) return null;

  const verified = status.status === 'verified';

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-2">
        <Banknote className="w-5 h-5 text-green-600" />
        <h3 className="text-md font-semibold text-gray-900">Get Paid</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Commissions are paid monthly on the 15th through Stripe, once they've cleared a 30-day hold.
        Balances under $50 roll over to the next month.
      </p>

      {!status.hasAccount && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-700" htmlFor="payout-country">Country</label>
          <select
            id="payout-country"
            value={country}
            onChange={(e) => setCountry(e.target.value as 'US' | 'CA')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
          <button
            onClick={startSetup}
            disabled={busy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? 'Opening Stripe…' : 'Set up payouts'}
          </button>
        </div>
      )}

      {status.hasAccount && !verified && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-yellow-700">
            <Clock className="w-4 h-4" /> Payout setup isn't finished yet
          </span>
          <button
            onClick={startSetup}
            disabled={busy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? 'Opening Stripe…' : 'Finish setup'}
          </button>
        </div>
      )}

      {status.hasAccount && verified && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" /> Payouts are set up
          </span>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!status.auto_payout_enabled}
              onChange={(e) => toggleAutoPayout(e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            Pay me automatically each month
          </label>
          <button
            onClick={openStripe}
            disabled={busy}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Manage payout account <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
