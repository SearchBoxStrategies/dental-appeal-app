import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AffiliateVerify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Redirect to backend verification endpoint
      window.location.href = `https://api.dentalappeal.claims/api/affiliate/verify?token=${token}`;
    }
  }, [token]);

  // Show loading state
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#475569', margin: 0 }}>Verifying your email...</p>
        {token && <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>Redirecting...</p>}
        {!token && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>No verification token found.</p>}
      </div>
    </div>
  );
}
