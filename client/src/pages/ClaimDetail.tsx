import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Claim } from '../types';

export default function ClaimDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/claims/${id}`).then((res) => setClaim(res.data)).finally(() => setLoading(false));
  }, [id]);

  async function generateAppeal() {
    setError('');
    setGenerating(true);
    try {
      const { data } = await api.post(`/appeals/generate/${id}`);
      navigate(`/appeals/${data.id}`);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      if (status === 402) {
        setError('An active subscription is required to generate appeals. Please subscribe on the Billing page.');
      } else {
        setError(msg ?? 'Failed to generate appeal letter');
      }
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <div className="loading">Loading…</div>;
  if (!claim) return <div className="loading">Claim not found.</div>;

  return (
    <div>
      <Link to="/claims" className="back-link">← Back to Claims</Link>

      <div className="page-header">
        <div>
          <h2>{claim.patient_name}</h2>
          <span className={`badge badge-${claim.status}`} style={{ marginTop: 4, display: 'inline-block' }}>
            {claim.status}
          </span>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={generateAppeal}
          disabled={generating}
        >
          {generating ? 'Generating…' : '✦ Generate Appeal Letter'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--gray-600)' }}>CLAIM DETAILS</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Patient Name</div>
            <div className="detail-value">{claim.patient_name}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Date of Birth</div>
            <div className="detail-value">{new Date(claim.patient_dob).toLocaleDateString()}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Insurance Company</div>
            <div className="detail-value">{claim.insurance_company}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Date of Service</div>
            <div className="detail-value">{new Date(claim.service_date).toLocaleDateString()}</div>
          </div>
          {claim.policy_number && (
            <div className="detail-item">
              <div className="detail-label">Policy Number</div>
              <div className="detail-value">{claim.policy_number}</div>
            </div>
          )}
          {claim.claim_number && (
            <div className="detail-item">
              <div className="detail-label">Claim Number</div>
              <div className="detail-value">{claim.claim_number}</div>
            </div>
          )}
          {claim.amount_claimed && (
            <div className="detail-item">
              <div className="detail-label">Amount Claimed</div>
              <div className="detail-value">${parseFloat(claim.amount_claimed).toFixed(2)}</div>
            </div>
          )}
          {claim.amount_denied && (
            <div className="detail-item">
              <div className="detail-label">Amount Denied</div>
              <div className="detail-value">${parseFloat(claim.amount_denied).toFixed(2)}</div>
            </div>
          )}
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <div className="detail-label">Procedure Codes</div>
            <div className="detail-value">{claim.procedure_codes.join(', ')}</div>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <div className="detail-label">Denial Reason</div>
            <div className="detail-value">{claim.denial_reason}</div>
          </div>
        </div>
      </div>

      {claim.appeals && claim.appeals.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--gray-600)' }}>
            GENERATED APPEALS ({claim.appeals.length})
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Generated</th>
                  <th>Model</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {claim.appeals.map((appeal) => (
                  <tr key={appeal.id} onClick={() => navigate(`/appeals/${appeal.id}`)}>
                    <td>{new Date(appeal.created_at).toLocaleString()}</td>
                    <td>{appeal.model_used}</td>
                    <td><span className="badge badge-active">{appeal.status}</span></td>
                    <td>
                      <Link
                        to={`/appeals/${appeal.id}`}
                        className="btn btn-secondary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Letter
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
