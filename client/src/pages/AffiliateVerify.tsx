import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AffiliateVerify() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('🔍 TOKEN:', token);
    console.log('🔍 PAGE LOADED - AffiliateVerify component mounted');
    
    if (token) {
      console.log('🔍 Redirecting to backend...');
      window.location.replace(`https://api.dentalappeal.claims/api/affiliate/verify?token=${token}`);
    }
  }, [searchParams]);

  // Simple HTML that should always render
  return (
    <html>
      <head><title>Verifying...</title></head>
      <body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial' }}>
        <div>
          <h1>Verifying your email...</h1>
          <p>Please wait while we verify your account.</p>
          <p style={{ fontSize: '12px', color: '#666' }}>If you're not redirected, <a href="#" onClick={() => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) window.location.href = `https://api.dentalappeal.claims/api/affiliate/verify?token=${token}`;
          }}>click here</a></p>
        </div>
      </body>
    </html>
  );
}
