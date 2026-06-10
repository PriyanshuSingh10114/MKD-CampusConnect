import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function StudentProfile() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto flex items-center justify-center text-slate-500 font-bold text-3xl">
              RS
            </div>
            <CardTitle className="text-center mt-4">Rahul Sharma</CardTitle>
            <div className="text-center">
              <Badge>Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">ID:</span> <span>ADM-1001</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Course:</span> <span>B.Tech CSE</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Year:</span> <span>Year 2</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span>+91 9876543210</span></div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Fee Timeline (4 Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 border-l-2 border-slate-200 ml-4 pl-4">
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                <h4 className="font-semibold">Year 1 Fees</h4>
                <p className="text-sm text-muted-foreground">Total: ₹77,000 | Paid: ₹77,000 | Due: ₹0</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 mt-1">Paid</Badge>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-yellow-500 rounded-full mt-1.5"></div>
                <h4 className="font-semibold">Year 2 Fees</h4>
                <p className="text-sm text-muted-foreground">Total: ₹80,000 | Paid: ₹40,000 | Due: ₹40,000</p>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 mt-1">Partial</Badge>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-slate-300 rounded-full mt-1.5"></div>
                <h4 className="font-semibold text-slate-500">Year 3 Fees</h4>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
