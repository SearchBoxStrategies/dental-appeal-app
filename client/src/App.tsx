import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import BulkUpload from './pages/BulkUpload';
import PracticeProfile from './components/PracticeProfile';
import EmailPreferences from './components/EmailPreferences';
import AnalyticsReport from './components/AnalyticsReport';
import Help from './pages/Help';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminPayments from './components/AdminPayments';
import AdminEmailTemplates from './components/AdminEmailTemplates';
import Calculator from './pages/Calculator';
import RoleBasedRedirect from './components/RoleBasedRedirect';
// Affiliate imports
import AffiliateSignup from './pages/AffiliateSignup';
import AffiliateDashboard from './components/AffiliateDashboard';
import AdminAffiliates from './components/AdminAffiliates';
import AffiliatePublicStats from './pages/AffiliatePublicStats';
import AffiliateVerify from './pages/AffiliateVerify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/calculator" element={<Calculator />} />
        
        {/* Affiliate public routes */}
        <Route path="/affiliate/signup" element={<AffiliateSignup />} />
        <Route path="/affiliate/stats/:code" element={<AffiliatePublicStats />} />
        <Route path="/affiliate/verify" element={<AffiliateVerify />} />
        
        {/* Clinic-only routes (core product) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/claims" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <Claims />
          </ProtectedRoute>
        } />
        <Route path="/claims/new" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <NewClaim />
          </ProtectedRoute>
        } />
        <Route path="/claims/:id" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <ClaimDetail />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/practice/profile" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <PracticeProfile />
          </ProtectedRoute>
        } />
        <Route path="/settings/notifications" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <EmailPreferences />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <AnalyticsReport />
          </ProtectedRoute>
        } />
        <Route path="/bulk-upload" element={
          <ProtectedRoute allowedTypes={['clinic']}>
            <BulkUpload />
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute allowedTypes={['clinic', 'affiliate']}>
            <Help />
          </ProtectedRoute>
        } />
        
        {/* Affiliate-only routes */}
        <Route path="/affiliate/dashboard" element={
          <ProtectedRoute allowedTypes={['affiliate']}>
            <AffiliateDashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/email-templates" element={
          <AdminRoute>
            <AdminEmailTemplates />
          </AdminRoute>
        } />
        <Route path="/admin/affiliates" element={
          <AdminRoute>
            <AdminAffiliates />
          </AdminRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/clients" element={
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
        <Route path="/admin/analytics" element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        } />
        <Route path="/admin/payments" element={
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        } />        
        
        {/* Root redirect - role based */}
        <Route path="/" element={<RoleBasedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
