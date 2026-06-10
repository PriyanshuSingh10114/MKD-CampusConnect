import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, Settings, LogOut, FileText, AlertTriangle, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">College ERP</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/students" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <Users className="w-5 h-5 mr-3" />
            Admissions List
          </Link>
          <Link to="/students/add" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <FilePlus className="w-5 h-5 mr-3" />
            Add Admission
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <Users className="w-5 h-5 mr-3" />
            Student Profile
          </Link>
          <Link to="/fees" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <Receipt className="w-5 h-5 mr-3" />
            Fee Collection
          </Link>
          <Link to="/fees/structure" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <Settings className="w-5 h-5 mr-3" />
            Fee Structure
          </Link>
          <Link to="/defaulters" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <AlertTriangle className="w-5 h-5 mr-3" />
            Defaulters
          </Link>
          <Link to="/reports" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <FileText className="w-5 h-5 mr-3" />
            Reports
          </Link>
          <Link to="/receipts" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <FileText className="w-5 h-5 mr-3" />
            Receipts
          </Link>
          <Link to="/users" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <Users className="w-5 h-5 mr-3" />
            User Management
          </Link>
          <Link to="/settings" className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-6 justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Admin Portal</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
