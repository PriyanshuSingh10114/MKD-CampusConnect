import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function FeeStructure() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    course: 'B.Ed', admissionFee: 5000, tuitionFee: 50000, examFee: 2000, libraryFee: 1000, developmentFee: 2000
  });
  
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees/structures', formData);
      toast({ title: 'Success', description: 'Fee Structure saved successfully.' });
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive', description: 'Failed to save fee structure.' });
    }
  };

  const total = Number(formData.admissionFee) + Number(formData.tuitionFee) + Number(formData.examFee) + Number(formData.libraryFee) + Number(formData.developmentFee);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-indigo-900">Fee Structure Setup</h2>

      <Card className="max-w-2xl shadow-lg border-t-4 border-indigo-500">
        <CardHeader>
          <CardTitle>Create/Edit Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <select className="w-full p-2 border rounded-md" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}>
                <option>B.Ed</option>
                <option>BTC / D.El.Ed</option>
                <option>ITI</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Admission Fee (₹)</Label><Input type="number" value={formData.admissionFee} onChange={e => setFormData({...formData, admissionFee: Number(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Tuition Fee (₹)</Label><Input type="number" value={formData.tuitionFee} onChange={e => setFormData({...formData, tuitionFee: Number(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Exam Fee (₹)</Label><Input type="number" value={formData.examFee} onChange={e => setFormData({...formData, examFee: Number(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Library Fee (₹)</Label><Input type="number" value={formData.libraryFee} onChange={e => setFormData({...formData, libraryFee: Number(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Development Fee (₹)</Label><Input type="number" value={formData.developmentFee} onChange={e => setFormData({...formData, developmentFee: Number(e.target.value)})} /></div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-indigo-900">Total: <span className="text-indigo-600">₹{total.toLocaleString()}</span></div>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Structure</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
