import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import ClaimDetail from './pages/ClaimDetail';
import NewClaim from './pages/NewClaim';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Billing from './pages/Billing';
import AdminDashboard from './pages/AdminDashboard';
import AdminSubscriptions from './pages/AdminSubscriptions';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import EmailPreferences from './components/EmailPreferences';
import AnalyticsReport from './components/AnalyticsReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* User protected routes - with Layout (sidebar + header) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/claims" element={
          <ProtectedRoute>
            <Claims />
          </ProtectedRoute>
        } />
        <Route path="/claims/new" element={
          <ProtectedRoute>
            <NewClaim />
          </ProtectedRoute>
        } />
        <Route path="/claims/:id" element={
          <ProtectedRoute>
            <ClaimDetail />
          </ProtectedRoute>
        } />
        <Route path="/settings/notifications" element={
          <ProtectedRoute>
            <EmailPreferences />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsReport />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        
        {/* Admin protected routes - with AdminLayout (dark sidebar) */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/clients/:id" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/subscriptions" element={
          <AdminRoute>
            <AdminSubscriptions />
          </AdminRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
