import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AffiliateVerify() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      window.location.replace(`https://api.dentalappeal.claims/api/affiliate/verify?token=${token}`);
    }
  }, [searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px', 
          height: '40px', 
          border: '4px solid #2563eb', 
          borderTop: '4px solid transparent', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ marginTop: '16px', color: '#475569' }}>Verifying your email...</p>
      </div>
    </div>
  );
}
