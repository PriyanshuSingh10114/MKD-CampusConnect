import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Printer, Download } from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function Receipts() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['receipts', debouncedSearch],
    queryFn: async () => {
      const res = await api.get(`/receipts?search=${debouncedSearch}`);
      return res.data;
    }
  });

  const receipts = response?.data || [];

  const handlePrint = (receiptId) => {
    window.open(`/receipt-print/${receiptId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-brand-secondary dark:text-white">Receipts</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Receipt No or Admission No..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-white dark:bg-layout-card-dark shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Generated Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading receipts...</div>
          ) : receipts.length > 0 ? (
            <div className="space-y-4">
              {receipts.map(receipt => (
                <div key={receipt._id} className="flex items-center justify-between p-4 border dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-brand-primary text-lg">{receipt.receiptNumber}</p>
                    <p className="text-sm font-medium text-brand-secondary dark:text-white">
                      {receipt.student?.personalDetails?.studentName || 'Unknown'} 
                      <span className="text-muted-foreground ml-2">({receipt.admissionNumber})</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{receipt.paymentMode}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(receipt.paymentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-status-success text-xl mb-2">₹{receipt.amountPaid?.toLocaleString()}</p>
                    <div className="flex space-x-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handlePrint(receipt._id)}>
                        <Printer className="w-4 h-4 mr-2" /> Print PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No receipts found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
