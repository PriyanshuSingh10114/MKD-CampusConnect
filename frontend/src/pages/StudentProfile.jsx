import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';

export default function StudentProfile() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { data: student, isLoading } = useQuery({
    queryKey: ['studentProfile', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/students/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });

  if (!id) return <div className="p-8 text-center text-muted-foreground">Select a student from the Admissions List first.</div>;
  if (isLoading) return <div className="p-8 text-center">Loading Profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const initials = student.personalDetails?.studentName?.slice(0, 2).toUpperCase() || 'ST';

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-indigo-900">Student Profile</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-md border-t-4 border-indigo-500">
          <CardHeader>
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {initials}
            </div>
            <CardTitle className="text-center mt-4 text-indigo-900">{student.personalDetails?.studentName || 'Unknown Student'}</CardTitle>
            <div className="text-center">
              <Badge className={student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                {student.status || 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm bg-indigo-50/50 rounded-b-xl pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">ID:</span> <span className="font-semibold">{student.admissionNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Course:</span> <span className="font-semibold">{student.admissions?.[0]?.course || 'Not Assigned'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Session:</span> <span className="font-semibold">{student.admissions?.[0]?.session || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-semibold">{student.personalDetails?.mobile || 'N/A'}</span></div>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-md border-t-4 border-emerald-500">
          <CardHeader>
            <CardTitle>Fee Timeline (4 Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 border-l-2 border-slate-200 ml-4 pl-4">
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                <h4 className="font-semibold">Year 1 Fees</h4>
                <p className="text-sm text-muted-foreground">Total: ₹77,000 | Paid: ₹77,000 | Due: ₹0</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 mt-1">Paid</Badge>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-yellow-500 rounded-full mt-1.5"></div>
                <h4 className="font-semibold">Year 2 Fees</h4>
                <p className="text-sm text-muted-foreground">Total: ₹80,000 | Paid: ₹40,000 | Due: ₹40,000</p>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 mt-1">Partial</Badge>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-slate-300 rounded-full mt-1.5"></div>
                <h4 className="font-semibold text-slate-500">Year 3 Fees</h4>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
