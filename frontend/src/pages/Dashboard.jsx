import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Users, GraduationCap, IndianRupee, Activity } from 'lucide-react';
import api from '@/lib/api';

const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const { data: revenueData } = useQuery({
    queryKey: ['revenueReport'],
    queryFn: async () => {
      const res = await api.get('/reports/revenue');
      return res.data.data;
    }
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await api.get('/students');
      return res.data.data;
    }
  });

  const { data: admissionsData } = useQuery({
    queryKey: ['admissions'],
    queryFn: async () => {
      const res = await api.get('/admissions');
      return res.data.data;
    }
  });

  const totalStudents = studentsData?.length || 0;
  const newAdmissions = admissionsData?.length || 0;
  const totalRevenue = revenueData?.totalRevenue || 0;
  
  // Aggregate real admission by course for the colorful chart
  const courseCounts = {};
  if (admissionsData) {
    admissionsData.forEach(adm => {
      courseCounts[adm.course] = (courseCounts[adm.course] || 0) + 1;
    });
  }
  const chartAdmissionsData = Object.keys(courseCounts).map(course => ({
    name: course,
    students: courseCounts[course]
  }));

  // Mock revenue chart data for months since we don't have historical data generated yet
  const chartRevenueData = [
    { name: 'Jan', total: 150000 },
    { name: 'Feb', total: 230000 },
    { name: 'Mar', total: 320000 },
    { name: 'Apr', total: 280000 },
    { name: 'May', total: 420000 },
    { name: 'Jun', total: Math.max(850000, totalRevenue) },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      
      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-pink-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Admissions</CardTitle>
            <GraduationCap className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{newAdmissions}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Real-time collections</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Activity className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across 5 departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-lg border-t-4 border-indigo-500 rounded-t-xl">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6, fill: '#ec4899' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-lg border-t-4 border-pink-500 rounded-t-xl">
          <CardHeader>
            <CardTitle>Admissions by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartAdmissionsData.length ? chartAdmissionsData : [{ name: 'No Data', students: 0 }]} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="students" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
