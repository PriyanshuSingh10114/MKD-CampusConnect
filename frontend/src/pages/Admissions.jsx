import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mocked local state to fulfill the UI requirement without complex React Query
export default function Admissions() {
  const { toast } = useToast();
  const [admissions] = useState([
    { id: 1, studentId: 'ADM-1001', name: 'Rahul Sharma', course: 'B.Tech CSE', status: 'Pending' },
    { id: 2, studentId: 'ADM-1002', name: 'Priya Verma', course: 'MBA', status: 'Approved' },
  ]);

  const verifyAdmission = (id) => {
    toast({ title: 'Success', description: `Admission ${id} Verified` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Admissions</h2>
        <Button>New Admission</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admissions.map(adm => (
              <div key={adm.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{adm.name}</p>
                  <p className="text-sm text-muted-foreground">{adm.studentId} • {adm.course}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={adm.status === 'Approved' ? 'default' : 'secondary'}>{adm.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => verifyAdmission(adm.id)}>Verify</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
