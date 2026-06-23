import { useEffect, useState } from 'react';

export default function AffiliateVerify() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Try multiple ways to get the token
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    // Also check if it's in the hash
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const tokenFromHash = hashParams.get('token');
    
    const finalToken = tokenFromUrl || tokenFromHash;
    setToken(finalToken);
    
    console.log('🔍 URL:', window.location.href);
    console.log('🔍 Token from URL:', tokenFromUrl);
    console.log('🔍 Token from hash:', tokenFromHash);
    console.log('🔍 Final token:', finalToken);
    
    if (finalToken) {
      // Redirect to backend verification endpoint
      window.location.href = `https://api.dentalappeal.claims/api/affiliate/verify?token=${finalToken}`;
    }
  }, []);

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
