import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  CreditCard,
  LogOut,
  Menu,
  X,
  Settings,
  HelpCircle,
  Bell,
  TrendingUp,
  Upload,
  Building2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/claims', icon: FileText, label: 'All Claims' },
    { path: '/claims/new', icon: PlusCircle, label: 'New Claim' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/bulk-upload', icon: Upload, label: 'Bulk Upload' },
    { path: '/practice/profile', icon: Building2, label: 'Practice Profile' },
    { path: '/settings/notifications', icon: Bell, label: 'Notifications' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
    { path: '/help', icon: HelpCircle, label: 'Help & Tutorials' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleHelp = () => {
    navigate('/help');
  };

  const handleSettings = () => {
    navigate('/settings/notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
        <img src="/logo.png" alt="DentalAppeal" className="w-6 h-6" />
    </div>
    <div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DentalAppeal</h1>
        <p className="text-xs text-slate-500">Professional Edition</p>
    </div>
</div>
          
                   <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User profile */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">{userInitial}</span>
            </div>
            <div>
              <p className="font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{user.email || 'user@practice.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section - Sign Out */}
        <div className="mt-auto p-4 border-t border-slate-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content - flex column to push footer down */}
      <main className="lg:ml-72 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleHelp}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Help & Support"
              >
                <HelpCircle className="w-5 h-5 text-slate-500" />
              </button>
              <button
                onClick={handleSettings}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-slate-500" />
              </button>
              <button
                onClick={handleLogout}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <LogOut className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content - grows to fill space */}
        <div className="flex-1 p-6">
          {children}
        </div>

        {/* Footer - at the bottom of the page, NOT in sidebar */}
        <footer className="border-t border-slate-200 py-4 px-6 bg-white/50">
  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
    <div className="flex gap-4">
      <Link to="/terms" className="hover:text-gray-700">Terms of Service</Link>
      <span>|</span>
      <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
      <span>|</span>
      <a href="mailto:support@dentalappeal.claims" className="hover:text-gray-700">Support</a>
    </div>
    <div className="text-center">
      <p>
        © {new Date().getFullYear()}{' '}
        <a 
          href="https://searchboxstrategies.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gray-700 hover:underline transition-all"
        >
          Search Box Strategies
        </a>
        . All rights reserved.
      </p>
      <p className="text-xs text-gray-400">DentalAppeal is a product of Search Box Strategies.</p>
    </div>
  </div>
</footer>
      </main>
    </div>
  );
}
