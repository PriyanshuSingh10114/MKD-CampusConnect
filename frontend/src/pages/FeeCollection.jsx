import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function FeeCollection() {
  const { toast } = useToast();
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');

  const handleCollect = (e) => {
    e.preventDefault();
    toast({ title: 'Payment Recorded', description: `₹${amount} recorded for student ${studentId}.` });
    setStudentId('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Offline Fee Collection</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCollect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} required placeholder="e.g. ADM-1001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Payment Mode</Label>
                <select id="mode" className="w-full p-2 border rounded-md">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Demand Draft</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Record Payment & Generate Receipt</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">REC-109283</p>
                  <p className="text-sm text-muted-foreground">ADM-1001 • Cash</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹25,000</p>
                  <Badge variant="outline">Partial</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
