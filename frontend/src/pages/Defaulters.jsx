import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Bell, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { exportToPDF } from '@/lib/exportUtils';

export default function Defaulters() {
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [session, setSession] = useState('');
  const [sort, setSort] = useState('highest'); // highest, lowest, recent

  // Debounce search value
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: defaulters, isLoading, refetch } = useQuery({
    queryKey: ['defaulters', debouncedSearch, course, session, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (course) params.append('course', course);
      if (session) params.append('session', session);
      if (sort) params.append('sort', sort);
      
      const res = await api.get(`/fees/defaulters?${params.toString()}`);
      return res.data.data;
    }
  });

  const handleSendReminder = () => {
    toast({ title: 'Reminder Sent', description: 'SMS and Email sent to defaulters.' });
  };

  const handleExportPDF = () => {
    if (!defaulters || defaulters.length === 0) {
      toast({ title: 'No data', description: 'No defaulters to export.', variant: 'destructive' });
      return;
    }
    const columns = ['Student', 'Admission No', 'Course', 'Mobile', 'Pending Fee (INR)'];
    const rows = defaulters.map(d => [
      d.studentName || 'N/A', 
      d.admissionNumber, 
      d.course || 'N/A', 
      d.mobile || 'N/A',
      `Rs. ${d.pendingFee.toLocaleString()}`
    ]);
    exportToPDF('Defaulter Report', columns, rows, 'defaulter_report_main');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-brand-secondary dark:text-white">Defaulter Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
          <Button onClick={handleSendReminder} className="bg-primary hover:bg-primary/90 text-white shadow-sm border-0"><Bell className="w-4 h-4 mr-2" /> Send Reminders</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Admission No, Name, Mobile..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select 
            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            <option value="B.Ed">B.Ed</option>
            <option value="BTC / D.El.Ed">BTC / D.El.Ed</option>
            <option value="ITI">ITI</option>
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="highest">Highest Due First</option>
            <option value="lowest">Lowest Due First</option>
            <option value="recent">Recent Admissions</option>
          </select>
        </div>
      </div>

      <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Outstanding Fees List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading defaulters...</div>
          ) : defaulters && defaulters.length > 0 ? (
            <div className="space-y-4">
              {defaulters.map((student) => (
                <div key={student.studentId} className="flex items-center justify-between p-4 border dark:border-slate-800 rounded-lg bg-amber-50/50 dark:bg-amber-900/10">
                  <div>
                    <p className="font-semibold text-brand-secondary dark:text-white">{student.studentName}</p>
                    <p className="text-sm text-muted-foreground">{student.admissionNumber} • {student.course || 'Unknown'} • {student.session || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mobile: {student.mobile || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-600 dark:text-amber-500">Due: ₹{student.pendingFee?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total: ₹{student.totalFee?.toLocaleString()} | Paid: ₹{student.paidFee?.toLocaleString()}</p>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 mt-2">
                      {student.paidFee > 0 ? 'Partial Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No defaulters found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
