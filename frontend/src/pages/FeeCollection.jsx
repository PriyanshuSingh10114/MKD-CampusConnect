import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function FeeCollection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: students = [] } = useQuery({
    queryKey: ['studentsSearch', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await api.get(`/students?search=${debouncedSearch}`);
      return res.data.data;
    },
    enabled: debouncedSearch.length > 2 && !selectedStudentId
  });

  const { data: feeDetails, isLoading: isLoadingFeeDetails } = useQuery({
    queryKey: ['studentFeeDetails', selectedStudentId],
    queryFn: async () => {
      const res = await api.get(`/fees/student/${selectedStudentId}`);
      return res.data.data;
    },
    enabled: !!selectedStudentId
  });

  const { data: recentReceipts } = useQuery({
    queryKey: ['recentReceipts'],
    queryFn: async () => {
      const res = await api.get('/fees/receipts');
      return res.data.data.slice(0, 10); // Show only top 10
    }
  });

  const collectMutation = useMutation({
    mutationFn: (paymentData) => api.post('/fees/collect', paymentData),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['studentFeeDetails', selectedStudentId]);
      queryClient.invalidateQueries(['recentReceipts']);
      queryClient.invalidateQueries(['dashboardStats']); // If dashboard relies on it
      toast({ title: 'Payment Recorded', description: `Receipt Generated: ${res.data.data.receiptNumber}` });
      setAmount('');
      setTransactionId('');
      setRemarks('');
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to record payment.', variant: 'destructive' });
    }
  });

  const handleCollect = (e) => {
    e.preventDefault();
    if (!feeDetails) return;
    
    collectMutation.mutate({
      studentId: feeDetails.student._id,
      amountPaid: Number(amount),
      paymentMode: mode,
      transactionId,
      remarks,
      totalFee: feeDetails.feeSummary.totalFee
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-indigo-900">Fee Collection</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-t-4 border-indigo-500">
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            
            {/* Step 1: Search Student */}
            {!selectedStudentId && (
              <div className="space-y-2 mb-6 relative">
                <Label htmlFor="search">Search Student (Admission No, Name, Mobile)</Label>
                <Input 
                  id="search" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="e.g. MKD-2026-0001" 
                />
                {students.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                    {students.map(s => (
                      <div 
                        key={s._id} 
                        className="p-3 hover:bg-slate-100 cursor-pointer border-b last:border-0"
                        onClick={() => {
                          setSelectedStudentId(s._id);
                          setSearchTerm('');
                        }}
                      >
                        <div className="font-semibold">{s.personalDetails?.studentName} <span className="text-sm font-normal text-slate-500">({s.admissionNumber})</span></div>
                        <div className="text-xs text-muted-foreground">{s.personalDetails?.mobile}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2 & 3: Student Details & Payment Form */}
            {selectedStudentId && isLoadingFeeDetails && <div>Loading fee details...</div>}
            
            {selectedStudentId && feeDetails && (
              <div className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-start border border-indigo-100">
                  <div>
                    <h3 className="font-bold text-indigo-900">{feeDetails.student.studentName}</h3>
                    <p className="text-sm text-indigo-700">{feeDetails.student.admissionNumber} • {feeDetails.student.course}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedStudentId(null)}>Change Student</Button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-slate-50 p-2 rounded-md border"><span className="block text-xs text-muted-foreground">Total Fee</span><span className="font-bold">₹{feeDetails.feeSummary.totalFee?.toLocaleString()}</span></div>
                  <div className="bg-emerald-50 p-2 rounded-md border border-emerald-100"><span className="block text-xs text-emerald-600">Paid Fee</span><span className="font-bold text-emerald-700">₹{feeDetails.feeSummary.paidFee?.toLocaleString()}</span></div>
                  <div className="bg-rose-50 p-2 rounded-md border border-rose-100"><span className="block text-xs text-rose-600">Pending Fee</span><span className="font-bold text-rose-700">₹{feeDetails.feeSummary.pendingFee?.toLocaleString()}</span></div>
                </div>

                <form onSubmit={handleCollect} className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Pay (₹)</Label>
                    <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} max={feeDetails.feeSummary.pendingFee} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="transactionId">Transaction ID</Label>
                      <Input id="transactionId" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="If applicable" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Input id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="e.g. Second Installment" />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={collectMutation.isPending || feeDetails.feeSummary.pendingFee === 0}>
                    {collectMutation.isPending ? 'Processing...' : 'Record Payment & Generate Receipt'}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 4: Recent Collections */}
        <Card className="shadow-lg border-t-4 border-emerald-500 h-fit">
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReceipts && recentReceipts.length > 0 ? (
              <div className="space-y-4">
                {recentReceipts.map(receipt => (
                  <div key={receipt._id} className="flex justify-between items-center border-b pb-3 last:border-0">
                    <div>
                      <p className="font-semibold text-indigo-700">{receipt.receiptNumber}</p>
                      <p className="text-sm text-slate-800">{receipt.student?.personalDetails?.studentName || 'Unknown'} <span className="text-muted-foreground">({receipt.student?.admissionNumber})</span></p>
                      <p className="text-xs text-muted-foreground">{new Date(receipt.paymentDate).toLocaleString()} • {receipt.paymentMode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-lg">₹{receipt.amountPaid?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No recent collections found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
