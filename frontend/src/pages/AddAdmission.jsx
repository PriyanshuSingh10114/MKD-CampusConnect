import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AddAdmission() {
  const { toast } = useToast();
  
  const handleAddAdmission = (e) => {
    e.preventDefault();
    toast({ title: 'Success', description: 'Admission Form Submitted. Generated ID: MKD-2026-0001' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Admission</h2>

      <form onSubmit={handleAddAdmission}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Student Name</Label>
                <Input required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Father Name</Label><Input required /></div>
                <div className="space-y-2"><Label>Mother Name</Label><Input required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>DOB</Label><Input type="date" required /></div>
                <div className="space-y-2"><Label>Gender</Label>
                  <select className="w-full p-2 border rounded-md"><option>Male</option><option>Female</option><option>Other</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Mobile</Label><Input required /></div>
                <div className="space-y-2"><Label>Aadhaar</Label><Input required /></div>
              </div>
            </CardContent>
          </Card>

          {/* Admission & Academic */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>B.Ed</option>
                      <option>BTC / D.El.Ed</option>
                      <option>ITI</option>
                    </select>
                  </div>
                  <div className="space-y-2"><Label>Session</Label><Input placeholder="2026-2027" required /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Full Address</Label><Input required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>City</Label><Input required /></div>
                  <div className="space-y-2"><Label>Pincode</Label><Input required /></div>
                </div>
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full h-12 text-lg">Submit Admission</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
