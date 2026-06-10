import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function FeeStructure() {
  const { toast } = useToast();
  
  const handleSave = (e) => {
    e.preventDefault();
    toast({ title: 'Success', description: 'Fee Structure saved successfully.' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Fee Structure Setup</h2>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create/Edit Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <select className="w-full p-2 border rounded-md">
                <option>B.Ed</option>
                <option>BTC / D.El.Ed</option>
                <option>ITI</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Admission Fee (₹)</Label><Input type="number" defaultValue="5000" /></div>
              <div className="space-y-2"><Label>Tuition Fee (₹)</Label><Input type="number" defaultValue="50000" /></div>
              <div className="space-y-2"><Label>Exam Fee (₹)</Label><Input type="number" defaultValue="2000" /></div>
              <div className="space-y-2"><Label>Library Fee (₹)</Label><Input type="number" defaultValue="1000" /></div>
              <div className="space-y-2"><Label>Development Fee (₹)</Label><Input type="number" defaultValue="2000" /></div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-center">
              <div className="text-lg font-bold">Total: <span className="text-primary">₹60,000</span></div>
              <Button type="submit">Save Structure</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
