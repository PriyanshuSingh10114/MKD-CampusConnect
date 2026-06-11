import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admissions from './pages/Admissions';
import FeeCollection from './pages/FeeCollection';
import StudentProfile from './pages/StudentProfile';
import Defaulters from './pages/Defaulters';
import Reports from './pages/Reports';
import AddAdmission from './pages/AddAdmission';
import FeeStructure from './pages/FeeStructure';
import Receipts from './pages/Receipts';
import ReceiptPrint from './pages/ReceiptPrint';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/receipt-print/:id" element={<ProtectedRoute><ReceiptPrint /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Admissions />} />
            <Route path="students/add" element={<AddAdmission />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="fees" element={<FeeCollection />} />
            <Route path="fees/structure" element={<FeeStructure />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="defaulters" element={<Defaulters />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
