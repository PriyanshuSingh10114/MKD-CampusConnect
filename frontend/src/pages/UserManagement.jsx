import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Button>Add User</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Staff & Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">Dr. Suresh Kumar</p>
                <p className="text-sm text-muted-foreground">suresh@college.edu</p>
              </div>
              <Badge>Principal</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">Amit Accounts</p>
                <p className="text-sm text-muted-foreground">accounts@college.edu</p>
              </div>
              <Badge variant="outline">Accounts Staff</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
