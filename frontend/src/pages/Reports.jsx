import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const { toast } = useToast();

  const handleDownload = (reportName) => {
    toast({ title: 'Downloading...', description: `${reportName} is being generated.` });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Reports Module</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          'Admission Reports',
          'Fee Collection Reports',
          'Course Reports',
          'Department Reports',
          'Revenue Reports',
          'Audit Reports'
        ].map((report, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{report}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Generate comprehensive data in PDF, Excel or CSV.</p>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleDownload(`${report} (PDF)`)}>PDF</Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload(`${report} (Excel)`)}>Excel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
