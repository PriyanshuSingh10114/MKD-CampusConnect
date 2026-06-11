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
        <h2 className="text-3xl font-bold tracking-tight text-brand-secondary dark:text-white">Defaulter Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
          <Button onClick={handleSendReminder} className="bg-primary hover:bg-primary/90 text-white shadow-sm border-0"><Bell className="w-4 h-4 mr-2" /> Send Reminders</Button>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-status-danger">
        <CardHeader>
          <CardTitle>Outstanding Fees List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border dark:border-slate-800 rounded-lg bg-status-danger/10">
              <div>
                <p className="font-semibold text-brand-secondary dark:text-white">Amit Kumar</p>
                <p className="text-sm text-muted-foreground">ADM-1042 • B.Tech ECE • Year 3</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-status-danger">Due: ₹45,000</p>
                <Badge className="bg-status-danger text-white hover:bg-status-danger/80 mt-1">Unpaid</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border dark:border-slate-800 rounded-lg bg-status-warning/10">
              <div>
                <p className="font-semibold text-brand-secondary dark:text-white">Sneha Roy</p>
                <p className="text-sm text-muted-foreground">ADM-1088 • MBA • Year 1</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-status-warning">Due: ₹15,000</p>
                <Badge className="bg-status-warning/20 text-status-warning hover:bg-status-warning/30 mt-1">Partial</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
