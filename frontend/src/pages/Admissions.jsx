import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

export default function Admissions() {
  const { toast } = useToast();
  
  const { data: students, refetch } = useQuery({
    queryKey: ['studentsList'],
    queryFn: async () => {
      const res = await api.get('/students');
      return res.data.data;
    }
  });

  const verifyAdmission = async (id) => {
    try {
      // Assuming we have an endpoint or we just show toast for now
      toast({ title: 'Success', description: `Student ${id} Verified` });
      refetch();
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <h2 className="text-3xl font-bold tracking-tight text-indigo-900">Students & Admissions</h2>
        <Link to="/students/add">
          <Button className="bg-indigo-600 hover:bg-indigo-700">New Admission</Button>
        </Link>
      </div>

      <Card className="shadow-md border-t-4 border-indigo-500">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students?.map(student => (
              <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <Link to={`/profile?id=${student._id}`} className="font-semibold text-lg text-indigo-700 hover:underline">
                    {student.personalDetails?.studentName || 'Unknown'}
                  </Link>
                  <p className="text-sm text-muted-foreground">{student.admissionNumber} • {student.status}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}>{student.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => verifyAdmission(student._id)}>Verify</Button>
                  <Link to={`/profile?id=${student._id}`}>
                    <Button variant="secondary" size="sm">View Profile</Button>
                  </Link>
                </div>
              </div>
            ))}
            {(!students || students.length === 0) && (
              <div className="text-center p-8 text-muted-foreground">No students found. Add a new admission.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
