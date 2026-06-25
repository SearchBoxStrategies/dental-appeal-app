import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if 2FA is enabled and not verified for this session
  if (user.two_factor_enabled && !sessionStorage.getItem('2fa_verified')) {
    return <Navigate to="/admin/2fa" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
