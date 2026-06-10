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
    <div className="flex h-screen bg-blue-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 dark:bg-slate-800 border-r border-indigo-800 flex flex-col shadow-xl z-20">
        <div className="p-6 bg-indigo-950 border-b border-indigo-800">
          <h1 className="text-2xl font-black text-white tracking-wider">Campus<span className="text-blue-400">Connect</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/students" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Admissions List
          </Link>
          <Link to="/students/add" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <FilePlus className="w-5 h-5 mr-3" />
            Add Admission
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Student Profile
          </Link>
          <Link to="/fees" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Receipt className="w-5 h-5 mr-3" />
            Fee Collection
          </Link>
          <Link to="/fees/structure" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Fee Structure
          </Link>
          <Link to="/defaulters" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mr-3" />
            Defaulters
          </Link>
          <Link to="/reports" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <FileText className="w-5 h-5 mr-3" />
            Reports
          </Link>
          <Link to="/receipts" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <FileText className="w-5 h-5 mr-3" />
            Receipts
          </Link>
          <Link to="/users" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-3" />
            User Management
          </Link>
          <Link to="/settings" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        <div className="p-4 bg-indigo-950">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 shadow-sm flex items-center px-8 justify-between z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Admin Portal</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-slate-600">Super Admin</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
