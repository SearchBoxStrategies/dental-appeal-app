import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ('clinic' | 'affiliate' | 'admin')[];
}

export default function ProtectedRoute({ 
  children, 
  allowedTypes = ['clinic', 'affiliate', 'admin'] 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(user.user_type as 'clinic' | 'affiliate' | 'admin')) {
    if (user.is_admin) return <Navigate to="/admin" replace />;
    if (user.user_type === 'affiliate') return <Navigate to="/affiliate/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
}
