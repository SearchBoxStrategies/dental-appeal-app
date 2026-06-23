import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AffiliateVerify() {
  const [searchParams] = useSearchParams();
  
  // Log everything to see what's happening
  console.log('🔴 AFFILIATE VERIFY COMPONENT IS RENDERING');
  console.log('🔴 Full URL:', window.location.href);
  console.log('🔴 Search params:', searchParams.toString());
  
  const token = searchParams.get('token');
  console.log('🔴 Token from URL:', token);

  useEffect(() => {
    console.log('🔴 useEffect running');
    console.log('🔴 Token in useEffect:', token);
    
    if (token) {
      console.log('🔴 Redirecting to backend...');
      window.location.href = `https://api.dentalappeal.claims/api/affiliate/verify?token=${token}`;
    } else {
      console.log('🔴 No token found, showing error');
    }
  }, [token]);

  // This will ALWAYS render
  return (
    <div style={{ padding: '40px', background: '#f0f4ff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>Affiliate Verification Page</h1>
      <p style={{ fontSize: '18px' }}>Token: <code style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px' }}>{token || 'NO TOKEN FOUND'}</code></p>
      <p>If you see this, the component is rendering correctly.</p>
      {token && <p>Redirecting to backend...</p>}
      {!token && <p style={{ color: 'red' }}>⚠️ No verification token found in URL.</p>}
    </div>
  );
}
