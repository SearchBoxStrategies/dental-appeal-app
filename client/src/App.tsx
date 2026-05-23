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
// Affiliate imports
import AffiliateSignup from './pages/AffiliateSignup';
import AffiliateDashboard from './components/AffiliateDashboard';
import AdminAffiliates from './components/AdminAffiliates';
import AffiliatePublicStats from './pages/AffiliatePublicStats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Legal routes - public access */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Calculator routes - public access */}
        <Route path="/calculator" element={<Calculator />} />
        
        {/* Affiliate public routes */}
        <Route path="/affiliate/signup" element={<AffiliateSignup />} />
        <Route path="/affiliate/stats/:code" element={<AffiliatePublicStats />} />
        
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
        <Route path="/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/practice/profile" element={
          <ProtectedRoute>
            <PracticeProfile />
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
        <Route path="/bulk-upload" element={
          <ProtectedRoute>
            <BulkUpload />
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } />
        
        {/* Affiliate protected route - requires login */}
        <Route path="/affiliate/dashboard" element={
          <ProtectedRoute>
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
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
