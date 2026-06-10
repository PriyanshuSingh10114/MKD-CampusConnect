import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, Settings, LogOut, FileText, AlertTriangle, FilePlus, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Admissions List', path: '/students', icon: Users },
    { name: 'Add Admission', path: '/students/add', icon: FilePlus },
    { name: 'Student Profile', path: '/profile', icon: Users },
    { name: 'Fee Collection', path: '/fees', icon: Receipt },
    { name: 'Fee Structure', path: '/fees/structure', icon: Settings },
    { name: 'Defaulters', path: '/defaulters', icon: AlertTriangle },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Receipts', path: '/receipts', icon: FileText },
    { name: 'User Management', path: '/users', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-layout-bg dark:bg-layout-bg-dark font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar - Fixed width, brand-secondary background */}
      <aside className="w-64 bg-brand-secondary dark:bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold shadow-sm">
              M
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">Campus<span className="text-brand-accent">Connect</span></h1>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard' && item.path !== '/');
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-primary/15 text-brand-primary border-l-4 border-brand-primary shadow-sm' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800 border-l-4 border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-primary' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 h-10 px-3" 
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Navbar - Glassmorphism */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            {/* Breadcrumb pseudo-implementation */}
            <span>MKD Institutions</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-slate-100 capitalize">
              {location.pathname.split('/')[1] || 'Dashboard'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students, receipts..." 
                className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-primary transition-all w-64 text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
              />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-status-danger rounded-full border border-white dark:border-slate-900"></span>
            </button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-hover text-white flex items-center justify-center font-bold shadow-sm border border-brand-primary/20 cursor-pointer">
              A
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-layout-bg dark:bg-layout-bg-dark">
          <div className="p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
