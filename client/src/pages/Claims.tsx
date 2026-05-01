import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Claim } from '../types';

export default function Claims() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/claims').then((res) => setClaims(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Claims</h2>
        <Link to="/claims/new" className="btn btn-primary">+ New Claim</Link>
      </div>

      {claims.length === 0 ? (
        <div className="card empty-state">
          <p>No claims submitted yet.</p>
          <Link to="/claims/new" className="btn btn-primary">Add your first claim</Link>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Insurance Company</th>
                <th>Procedure Codes</th>
                <th>Denial Reason</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} onClick={() => navigate(`/claims/${claim.id}`)}>
                  <td><strong>{claim.patient_name}</strong></td>
                  <td>{claim.insurance_company}</td>
                  <td>{claim.procedure_codes.join(', ')}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {claim.denial_reason}
                  </td>
                  <td><span className={`badge badge-${claim.status}`}>{claim.status}</span></td>
                  <td>{new Date(claim.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
