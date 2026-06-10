import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Defaulters() {
  const { toast } = useToast();

  const handleSendReminder = () => {
    toast({ title: 'Reminder Sent', description: 'SMS and Email sent to defaulters.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Defaulter Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
          <Button onClick={handleSendReminder}><Bell className="w-4 h-4 mr-2" /> Send Reminders</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Fees List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/10">
              <div>
                <p className="font-semibold">Amit Kumar</p>
                <p className="text-sm text-muted-foreground">ADM-1042 • B.Tech ECE • Year 3</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">Due: ₹45,000</p>
                <Badge variant="destructive" className="mt-1">Unpaid</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
              <div>
                <p className="font-semibold">Sneha Roy</p>
                <p className="text-sm text-muted-foreground">ADM-1088 • MBA • Year 1</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-yellow-600">Due: ₹15,000</p>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-1">Partial</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
