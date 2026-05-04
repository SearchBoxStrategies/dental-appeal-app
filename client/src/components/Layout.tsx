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
  Stethoscope,
  User,
  Settings,
  HelpCircle
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
    { path: '/billing', icon: CreditCard, label: 'Billing' },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">DentalAppeal</h1>
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

        {/* Navigation */}
        <nav className="p-4 space-y-1">
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

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72">
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
              <button className="p-2 rounded-lg hover:bg-slate-100">
                <HelpCircle className="w-5 h-5 text-slate-500" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100">
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

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
