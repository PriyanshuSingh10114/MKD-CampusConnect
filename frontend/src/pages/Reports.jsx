import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, IndianRupee, Users, GraduationCap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';

export default function Reports() {
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['reportsDashboard'],
    queryFn: async () => {
      const res = await api.get('/reports/dashboard');
      return res.data.data;
    }
  });

  const handleDownload = (reportName) => {
    toast({ title: 'Downloading...', description: `${reportName} is being generated.` });
  };

  const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6'];

  if (isLoading) return <div className="p-8 text-center">Loading Report Dashboard...</div>;

  const {
    totalRevenue = 0,
    todayCollection = 0,
    monthlyCollection = 0,
    totalStudents = 0,
    defaultersCount = 0,
    revenueTrend = [],
    admissionsTrend = [],
    courseRevenue = []
  } = dashboardData || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-brand-secondary dark:text-white">Reports Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleDownload('Master Report (PDF)')}><Download className="w-4 h-4 mr-2" /> Export Master PDF</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full"><IndianRupee className="h-4 w-4 text-blue-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div></CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Today's Collection</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-full"><TrendingUp className="h-4 w-4 text-emerald-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">₹{todayCollection.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Monthly Collection</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-full"><IndianRupee className="h-4 w-4 text-indigo-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{monthlyCollection.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
            <div className="p-2 bg-purple-50 rounded-full"><Users className="h-4 w-4 text-purple-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent>
        </Card>

        <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Defaulters</CardTitle>
            <div className="p-2 bg-red-50 rounded-full"><AlertTriangle className="h-4 w-4 text-red-600" /></div>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{defaultersCount}</div></CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
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

        <Card className="col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Admissions by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionsTrend}>
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

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Course Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseRevenue}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="total"
                  >
                    {courseRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {courseRevenue.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Daily Collection', desc: 'Detailed transactions for today' },
                { name: 'Monthly Collection', desc: 'Aggregated revenue by month' },
                { name: 'Course Wise Revenue', desc: 'Financial breakdown by course' },
                { name: 'Admission Report', desc: 'Session and course admission data' }
              ].map((report, idx) => (
                <div key={idx} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-xs text-muted-foreground">{report.desc}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(report.name)}>Export</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
