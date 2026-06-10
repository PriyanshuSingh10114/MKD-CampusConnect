import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function FeeCollection() {
  const { toast } = useToast();
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');

  const handleCollect = async (e) => {
    e.preventDefault();
    try {
      // In a real app we'd fetch the student's total fee structure based on their course, but for now we hardcode totalFee for mock
      const res = await api.post(`/fees/payments/${studentId}`, {
        amountPaid: Number(amount),
        paymentMode: mode,
        totalFee: 60000,
        remarks: 'Manual offline collection'
      });
      toast({ title: 'Payment Recorded', description: `₹${amount} recorded and receipt generated: ${res.data.data.receiptNumber}` });
      setStudentId('');
      setAmount('');
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to record payment.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-indigo-900">Offline Fee Collection</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-t-4 border-indigo-500">
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
                <select id="mode" className="w-full p-2 border rounded-md" value={mode} onChange={e => setMode(e.target.value)}>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Demand Draft</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Record Payment & Generate Receipt</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-emerald-500">
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
