import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Stats, Claim } from '../types';

export default function Dashboard() {
  const { practice } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/claims/stats'),
      api.get('/claims'),
    ]).then(([statsRes, claimsRes]) => {
      setStats(statsRes.data);
      setRecentClaims((claimsRes.data as Claim[]).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <Link to="/claims/new" className="btn btn-primary">+ New Claim</Link>
      </div>

      {practice?.subscriptionStatus !== 'active' && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          No active subscription.{' '}
          <Link to="/billing" style={{ color: 'inherit', fontWeight: 600 }}>Subscribe to generate appeals →</Link>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Claims</div>
          <div className="stat-value">{stats?.totalClaims ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Appeals</div>
          <div className="stat-value">{stats?.totalAppeals ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Appeals This Month</div>
          <div className="stat-value">{stats?.appealsThisMonth ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Claims</h3>
          <Link to="/claims" className="btn btn-secondary">View all</Link>
        </div>
        {recentClaims.length === 0 ? (
          <div className="empty-state">
            <p>No claims yet.</p>
            <Link to="/claims/new" className="btn btn-primary">Add your first claim</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Insurance</th>
                  <th>Procedures</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id} onClick={() => window.location.href = `/claims/${claim.id}`}>
                    <td>{claim.patient_name}</td>
                    <td>{claim.insurance_company}</td>
                    <td>{claim.procedure_codes.join(', ')}</td>
                    <td><span className={`badge badge-${claim.status}`}>{claim.status}</span></td>
                    <td>{new Date(claim.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
