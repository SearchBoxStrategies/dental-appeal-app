import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleBasedRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (user.is_admin) {
        navigate('/admin', { replace: true });
      } else if (user.user_type === 'affiliate') {
        navigate('/affiliate/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500">Redirecting to your dashboard...</p>
    </div>
  );
}
