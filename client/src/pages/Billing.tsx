import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Billing() {
  const { practice, refreshPractice } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    if (success) {
      // Refresh practice so subscription status reflects the webhook update
      const poll = setInterval(async () => {
        await refreshPractice();
        if (practice?.subscriptionStatus === 'active') clearInterval(poll);
      }, 2000);
      setTimeout(() => clearInterval(poll), 30000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  async function handleSubscribe() {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/billing/checkout');
      window.location.href = data.url;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  }

  async function handleManage() {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/billing/portal');
      window.location.href = data.url;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  }

  const isActive = practice?.subscriptionStatus === 'active';

  return (
    <div>
      <div className="page-header">
        <h2>Billing</h2>
      </div>

      {success && (
        <div className="alert alert-success">
          Subscription activated! You can now generate appeal letters.
        </div>
      )}
      {canceled && (
        <div className="alert alert-error">
          Checkout was canceled. Your subscription was not changed.
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card billing-card">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Subscription</h3>

        <div className="billing-status">
          <span
            className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}
            style={{ fontSize: 13, padding: '4px 12px' }}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <span style={{ color: 'var(--gray-600)', fontSize: 13 }}>
            {isActive
              ? 'Your practice has full access to appeal generation.'
              : 'Subscribe to start generating AI-powered appeal letters.'}
          </span>
        </div>

        {!isActive && (
          <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-600)', borderRadius: 6, padding: 16, marginBottom: 20 }}>
            <strong style={{ fontSize: 15 }}>DentalAppeal Pro</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20, color: 'var(--gray-700)', fontSize: 13, lineHeight: 2 }}>
              <li>Unlimited AI-generated appeal letters</li>
              <li>Claude-powered clinical justification</li>
              <li>Full claim history and letter archive</li>
              <li>Print and copy-ready formatted letters</li>
            </ul>
          </div>
        )}

        <div className="billing-actions">
          {isActive ? (
            <button className="btn btn-secondary btn-lg" onClick={handleManage} disabled={loading}>
              {loading ? 'Loading…' : 'Manage Subscription'}
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleSubscribe} disabled={loading}>
              {loading ? 'Loading…' : 'Subscribe Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
