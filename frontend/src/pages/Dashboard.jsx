import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  GraduationCap,
  IndianRupee,
  Activity,
  AlertTriangle,
  FileText,
  UserPlus,
  CreditCard,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="text-lg font-medium text-slate-500">Loading Enterprise Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 p-8 border rounded-lg bg-red-50">
        <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
        <p className="font-semibold">Failed to load dashboard data.</p>
      </div>
    );
  }

  const {
    totalStudents = 0,
    newAdmissions = 0,
    totalRevenue = 0,
    pendingFees = 0,
    defaultersCount = 0,
    monthlyRevenue = [],
    admissionsByCourse = [],
    feeCollectionMode = [],
    recentAdmissions = [],
    recentPayments = []
  } = data || {};

  // Construct Activity Timeline
  const timelineEvents = [
    ...recentAdmissions.map(a => ({
      id: `adm_${a._id}`,
      type: 'Admission',
      title: `New Admission: ${a.student?.personalDetails?.studentName || 'Unknown'}`,
      description: `Course: ${a.course} | Session: ${a.session}`,
      date: new Date(a.admissionDate || a.createdAt),
      icon: <UserPlus className="h-4 w-4 text-indigo-600" />
    })),
    ...recentPayments.map(p => ({
      id: `pay_${p._id}`,
      type: 'Payment',
      title: `Payment Received: ₹${p.amountPaid?.toLocaleString()}`,
      description: `From: ${p.student?.personalDetails?.studentName || 'Unknown'} via ${p.paymentMode}`,
      date: new Date(p.paymentDate || p.createdAt),
      icon: <CreditCard className="h-4 w-4 text-emerald-600" />
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Overview
        </h2>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-white dark:bg-layout-card-dark border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full"><Users className="h-4 w-4 text-blue-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">This Month's Admissions</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-full"><GraduationCap className="h-4 w-4 text-indigo-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{newAdmissions}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-full"><IndianRupee className="h-4 w-4 text-emerald-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">₹{totalRevenue.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Fees</CardTitle>
            <div className="p-2 bg-amber-50 rounded-full"><Activity className="h-4 w-4 text-amber-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-600">₹{pendingFees.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-500 cursor-pointer transition-colors" onClick={() => navigate('/defaulters')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Defaulters</CardTitle>
            <div className="p-2 bg-red-50 rounded-full"><AlertTriangle className="h-4 w-4 text-red-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{defaultersCount}</div></CardContent>
        </Card>
      </div>

      {/* Row 2: Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Admissions Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionsByCourse}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#1E293B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Secondary Analytics & Timeline */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Fee Collection Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeCollectionMode}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {feeCollectionMode.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {feeCollectionMode.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm font-medium">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents.map((event, i) => (
                <div key={event.id} className="flex gap-4">
                  <div className="mt-1 flex flex-col items-center">
                    <div className={`p-1.5 rounded-full ${event.type === 'Admission' ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
                      {event.icon}
                    </div>
                    {i !== timelineEvents.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {timelineEvents.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button onClick={() => navigate('/students/add')} variant="outline" className="w-full justify-start text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200">
                <UserPlus className="w-4 h-4 mr-3 text-blue-600" /> New Admission
              </Button>
              <Button onClick={() => navigate('/fees')} variant="outline" className="w-full justify-start text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200">
                <IndianRupee className="w-4 h-4 mr-3 text-emerald-600" /> Collect Fee
              </Button>
              <Button onClick={() => navigate('/reports')} variant="outline" className="w-full justify-start text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200">
                <FileText className="w-4 h-4 mr-3 text-indigo-600" /> Generate Reports
              </Button>
              <Button onClick={() => navigate('/defaulters')} variant="outline" className="w-full justify-start text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200">
                <AlertTriangle className="w-4 h-4 mr-3 text-red-600" /> View Defaulters
              </Button>
              <Button onClick={() => navigate('/receipts')} variant="outline" className="w-full justify-start text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200">
                <CreditCard className="w-4 h-4 mr-3 text-purple-600" /> Print Receipts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Data Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
            <CardTitle className="text-sm font-semibold">Recent Admissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-white border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Course</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAdmissions.map((adm, i) => (
                    <tr key={adm._id} className={i !== recentAdmissions.length - 1 ? "border-b border-slate-100" : ""}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{adm.student?.personalDetails?.studentName}</p>
                        <p className="text-xs text-slate-500">{adm.student?.admissionNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">{adm.course}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(adm.admissionDate || adm.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentAdmissions.length === 0 && (
                    <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">No recent admissions.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
            <CardTitle className="text-sm font-semibold">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-white border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Receipt No</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((pay, i) => (
                    <tr key={pay._id} className={i !== recentPayments.length - 1 ? "border-b border-slate-100" : ""}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{pay.receiptNumber}</p>
                        <p className="text-xs text-slate-500">{pay.student?.personalDetails?.studentName}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600">₹{pay.amountPaid?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-slate-600">{pay.paymentMode}</Badge>
                      </td>
                    </tr>
                  ))}
                  {recentPayments.length === 0 && (
                    <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">No recent payments.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}