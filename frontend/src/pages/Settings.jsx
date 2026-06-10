import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Institute Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Institute Name</Label><Input defaultValue="Maharaja Krishna Dev College" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="info@mkdcollege.edu" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 8000000000" /></div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
