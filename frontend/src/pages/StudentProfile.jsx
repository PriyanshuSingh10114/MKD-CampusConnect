import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';

export default function StudentProfile() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['studentProfile', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/students/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });

  if (!id) return <div className="p-8 text-center text-muted-foreground">Select a student from the Admissions List first.</div>;
  if (isLoading) return <div className="p-8 text-center">Loading Profile...</div>;
  if (!profileData || !profileData.student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const { student, feeSummary, recentPayments } = profileData;
  const initials = student.personalDetails?.studentName?.slice(0, 2).toUpperCase() || 'ST';
  const admission = student.admissions?.[0] || {};

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-brand-secondary dark:text-white">Student Profile</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="col-span-1 shadow-lg border-t-4 border-brand-primary h-fit">
          <CardHeader>
            <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-sm">
              {initials}
            </div>
            <CardTitle className="text-center mt-4 text-brand-secondary dark:text-white">{student.personalDetails?.studentName || 'Unknown Student'}</CardTitle>
            <div className="text-center text-sm font-semibold text-slate-500">{student.admissionNumber}</div>
            <div className="text-center mt-2">
              <Badge className={student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                {student.status || 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm bg-brand-primary/5 dark:bg-slate-800/50 rounded-b-xl pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Course:</span> <span className="font-semibold">{admission.course || 'Not Assigned'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Session:</span> <span className="font-semibold">{admission.session || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-semibold">{student.personalDetails?.mobile || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-semibold">{student.personalDetails?.email || 'N/A'}</span></div>
          </CardContent>
        </Card>

        <div className="col-span-2 space-y-6">
          {/* Details Tabs/Sections */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground block">Father's Name</span><span className="font-semibold">{student.personalDetails?.fatherName || '-'}</span></div>
                <div><span className="text-muted-foreground block">Mother's Name</span><span className="font-semibold">{student.personalDetails?.motherName || '-'}</span></div>
                <div><span className="text-muted-foreground block">Gender</span><span className="font-semibold">{student.personalDetails?.gender || '-'}</span></div>
                <div><span className="text-muted-foreground block">Date of Birth</span><span className="font-semibold">{student.personalDetails?.dob ? new Date(student.personalDetails.dob).toLocaleDateString() : '-'}</span></div>
                <div><span className="text-muted-foreground block">Aadhaar Number</span><span className="font-semibold">{student.personalDetails?.aadhaarNumber || '-'}</span></div>
                <div><span className="text-muted-foreground block">Category</span><span className="font-semibold">{student.personalDetails?.category || '-'}</span></div>
                <div><span className="text-muted-foreground block">Alternate Mobile</span><span className="font-semibold">{student.personalDetails?.alternateMobile || '-'}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2"><span className="text-muted-foreground block">Permanent Address</span><span className="font-semibold">{student.addressDetails?.address}, {student.addressDetails?.city}, {student.addressDetails?.district}, {student.addressDetails?.state} - {student.addressDetails?.pincode}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground block">Correspondence Address</span><span className="font-semibold">{student.addressDetails?.correspondenceAddress || 'Same as Permanent'}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Summary */}
          <Card className="shadow-lg border-t-4 border-status-success">
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Fee</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">₹{feeSummary?.totalFee?.toLocaleString() || 0}</div>
                </div>
                <div className="p-4 bg-status-success/10 rounded-lg">
                  <div className="text-sm text-status-success">Paid Fee</div>
                  <div className="text-xl font-bold text-status-success">₹{feeSummary?.paidFee?.toLocaleString() || 0}</div>
                </div>
                <div className="p-4 bg-status-danger/10 rounded-lg">
                  <div className="text-sm text-status-danger">Pending Fee</div>
                  <div className="text-xl font-bold text-status-danger">₹{feeSummary?.pendingFee?.toLocaleString() || 0}</div>
                </div>
                <div className="p-4 bg-brand-primary/10 rounded-lg">
                  <div className="text-sm text-brand-primary">Installments</div>
                  <div className="text-xl font-bold text-brand-primary">{feeSummary?.installmentsPaid || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments Table */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments && recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Receipt No</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Mode</th>
                        <th className="px-4 py-3 rounded-tr-lg text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr key={payment._id} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800">
                          <td className="px-4 py-3 font-medium text-brand-primary">{payment.receiptNumber}</td>
                          <td className="px-4 py-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{payment.paymentMode}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-status-success">₹{payment.amountPaid?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No payments recorded yet.</div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
