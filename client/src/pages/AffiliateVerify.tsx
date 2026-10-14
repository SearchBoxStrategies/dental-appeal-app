import { API_BASE_URL } from '../lib/api';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function AffiliateVerify() {
  const [token, setToken] = useState<string | null>(null);
  const linkError = useSearchParams()[0].get('error');

  useEffect(() => {
    // Try multiple ways to get the token
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    // Also check if it's in the hash
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const tokenFromHash = hashParams.get('token');

    const finalToken = tokenFromUrl || tokenFromHash;
    setToken(finalToken);

    if (finalToken) {
      // Redirect to backend verification endpoint
      window.location.href = `${API_BASE_URL}/affiliate/verify?token=${encodeURIComponent(finalToken)}`;
    }
  }, []);

  // The API sends people back here with ?error= when a link is bad or old.
  if (linkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {linkError === 'expired' ? 'This verification link has expired' : 'This verification link is not valid'}
          </h1>
          <p className="text-gray-600 mb-6">
            Links work once and expire after a while. Sign up again with the same email to get a new link,
            or contact affiliates@dentalappeal.claims.
          </p>
          <Link to="/affiliate/signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
            Get a new link
          </Link>
        </div>
      </div>
    );
  }

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
        {!token && <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>Checking for verification token...</p>}
      </div>
    </div>
  );
}
