import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

export default function Receipts() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Receipts</h2>
      <Card>
        <CardHeader>
          <CardTitle>Generated Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">REC-MKD-101</p>
                <p className="text-sm text-muted-foreground">Rahul Sharma • B.Ed • Cash • ₹25,000</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Print</Button>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
