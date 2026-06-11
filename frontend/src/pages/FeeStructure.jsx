import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';

export default function FeeStructure() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    course: 'B.Ed', academicYear: '2026-2027', admissionFee: 5000, tuitionFee: 50000, examFee: 2000, libraryFee: 1000, developmentFee: 2000, workshopFee: 0, labFee: 0, otherFee: 0
  });

  const { data: structures, isLoading } = useQuery({
    queryKey: ['feeStructures'],
    queryFn: async () => {
      const res = await api.get('/fees/structures');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newStructure) => api.post('/fees/structures', newStructure),
    onSuccess: () => {
      queryClient.invalidateQueries(['feeStructures']);
      toast({ title: 'Success', description: 'Fee Structure saved successfully.' });
    },
    onError: (err) => {
      toast({ title: 'Error', variant: 'destructive', description: err.response?.data?.message || 'Failed to save fee structure.' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/fees/structures/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['feeStructures']);
      toast({ title: 'Deleted', description: 'Fee structure removed.' });
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const total = Number(formData.admissionFee) + Number(formData.tuitionFee) + Number(formData.examFee) + Number(formData.libraryFee) + Number(formData.developmentFee) + Number(formData.workshopFee) + Number(formData.labFee) + Number(formData.otherFee);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-brand-secondary dark:text-white">Fee Structure Setup</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-t-4 border-brand-primary">
          <CardHeader>
            <CardTitle>Create Fee Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <select className="w-full p-2 border rounded-md" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}>
                    <option>B.Ed</option>
                    <option>BTC / D.El.Ed</option>
                    <option>ITI</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} placeholder="e.g. 2026-2027" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Admission Fee (₹)</Label><Input type="number" value={formData.admissionFee} onChange={e => setFormData({...formData, admissionFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Tuition Fee (₹)</Label><Input type="number" value={formData.tuitionFee} onChange={e => setFormData({...formData, tuitionFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Exam Fee (₹)</Label><Input type="number" value={formData.examFee} onChange={e => setFormData({...formData, examFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Library Fee (₹)</Label><Input type="number" value={formData.libraryFee} onChange={e => setFormData({...formData, libraryFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Development Fee (₹)</Label><Input type="number" value={formData.developmentFee} onChange={e => setFormData({...formData, developmentFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Workshop Fee (₹)</Label><Input type="number" value={formData.workshopFee} onChange={e => setFormData({...formData, workshopFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Lab Fee (₹)</Label><Input type="number" value={formData.labFee} onChange={e => setFormData({...formData, labFee: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Other Fee (₹)</Label><Input type="number" value={formData.otherFee} onChange={e => setFormData({...formData, otherFee: Number(e.target.value)})} /></div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex justify-between items-center bg-brand-primary/5 dark:bg-brand-primary/10 p-4 rounded-lg">
                <div className="text-lg font-bold text-brand-secondary dark:text-white">Total: <span className="text-brand-primary">₹{total.toLocaleString()}</span></div>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white shadow-sm border-0" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Saving...' : 'Save Structure'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-status-success h-fit">
          <CardHeader>
            <CardTitle>Existing Structures</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : structures && structures.length > 0 ? (
              <div className="space-y-4">
                {structures.map(structure => (
                  <div key={structure._id} className="flex justify-between items-center p-4 border dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div>
                      <div className="font-semibold text-lg">{structure.course}</div>
                      <div className="text-sm text-muted-foreground">Year: {structure.academicYear || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-status-success">₹{structure.totalFee?.toLocaleString()}</div>
                      <Button variant="ghost" size="sm" className="text-status-danger hover:text-status-danger hover:bg-status-danger/10 mt-1 h-6 px-2" onClick={() => {
                        if(window.confirm('Delete this structure?')) deleteMutation.mutate(structure._id);
                      }}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No fee structures found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
