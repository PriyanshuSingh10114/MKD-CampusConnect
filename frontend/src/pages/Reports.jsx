import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, FileSpreadsheet, Printer, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { exportToPDF, exportToExcel, printReport } from '@/lib/exportUtils';
import { Badge } from '@/components/ui/badge';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('admissions');

  const tabs = [
    { id: 'admissions', label: 'Admission Reports' },
    { id: 'revenue', label: 'Revenue Reports' },
    { id: 'defaulters', label: 'Defaulter Reports' },
    { id: 'ledger', label: 'Student Ledger' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Detailed Reports</h2>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'admissions' && <AdmissionReport />}
        {activeTab === 'revenue' && <RevenueReport />}
        {activeTab === 'defaulters' && <DefaultersReport />}
        {activeTab === 'ledger' && <StudentLedgerReport />}
      </div>
    </div>
  );
}

// 1. Admission Report
function AdmissionReport() {
  const { data, isLoading } = useQuery({
    queryKey: ['reportsAdmissions'],
    queryFn: async () => {
      const res = await api.get('/reports/admissions');
      return res.data.data;
    }
  });

  const handleExportPDF = () => {
    if (!data) return;
    const columns = ['Course', 'Session', 'Total Admissions'];
    const rows = data.map(d => [d._id.course || 'N/A', d._id.session || 'N/A', d.totalAdmissions]);
    exportToPDF('Admission Report', columns, rows, 'admission_report');
  };

  const handleExportExcel = () => {
    if (!data) return;
    const excelData = data.map(d => ({ Course: d._id.course || 'N/A', Session: d._id.session || 'N/A', 'Total Admissions': d.totalAdmissions }));
    exportToExcel(excelData, 'admission_report');
  };

  const handlePrint = () => {
    if (!data) return;
    const columns = ['Course', 'Session', 'Total Admissions'];
    const rows = data.map(d => [d._id.course || 'N/A', d._id.session || 'N/A', d.totalAdmissions]);
    printReport('Admission Report', columns, rows);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Admission Reports</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm text-left border">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Total Admissions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3 font-medium">{item._id.course || 'N/A'}</td>
                <td className="px-4 py-3">{item._id.session || 'N/A'}</td>
                <td className="px-4 py-3 text-indigo-600 font-medium">{item.totalAdmissions}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan="3" className="p-4 text-center">No data available.</td></tr>}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// 2. Revenue Report (Course Revenue)
function RevenueReport() {
  const { data, isLoading } = useQuery({
    queryKey: ['reportsCourseRevenue'],
    queryFn: async () => {
      const res = await api.get('/reports/course-revenue');
      return res.data.data;
    }
  });

  const handleExportPDF = () => {
    if (!data) return;
    const columns = ['Course', 'Total Revenue (INR)', 'Transactions'];
    const rows = data.map(d => [d._id || 'N/A', `Rs. ${d.totalRevenue.toLocaleString()}`, d.transactionCount]);
    exportToPDF('Course Revenue Report', columns, rows, 'revenue_report');
  };

  const handleExportExcel = () => {
    if (!data) return;
    const excelData = data.map(d => ({ Course: d._id || 'N/A', 'Total Revenue': d.totalRevenue, Transactions: d.transactionCount }));
    exportToExcel(excelData, 'revenue_report');
  };

  const handlePrint = () => {
    if (!data) return;
    const columns = ['Course', 'Total Revenue (INR)', 'Transactions'];
    const rows = data.map(d => [d._id || 'N/A', `Rs. ${d.totalRevenue.toLocaleString()}`, d.transactionCount]);
    printReport('Course Revenue Report', columns, rows);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course-wise Revenue Reports</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm text-left border">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Total Revenue</th>
              <th className="px-4 py-3 font-medium">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3 font-medium">{item._id || 'N/A'}</td>
                <td className="px-4 py-3 text-emerald-600 font-medium">₹{item.totalRevenue?.toLocaleString()}</td>
                <td className="px-4 py-3">{item.transactionCount}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan="3" className="p-4 text-center">No data available.</td></tr>}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// 3. Defaulter Report
function DefaultersReport() {
  const { data, isLoading } = useQuery({
    queryKey: ['reportsDefaulters'],
    queryFn: async () => {
      const res = await api.get('/fees/defaulters');
      return res.data.data;
    }
  });

  const handleExportPDF = () => {
    if (!data) return;
    const columns = ['Student', 'Admission No', 'Course', 'Pending Fee (INR)'];
    const rows = data.map(d => [d.studentName || 'N/A', d.admissionNumber, d.course || 'N/A', `Rs. ${d.pendingFee.toLocaleString()}`]);
    exportToPDF('Defaulter Report', columns, rows, 'defaulter_report');
  };

  const handleExportExcel = () => {
    if (!data) return;
    const excelData = data.map(d => ({ Student: d.studentName || 'N/A', 'Admission No': d.admissionNumber, Course: d.course || 'N/A', 'Pending Fee': d.pendingFee }));
    exportToExcel(excelData, 'defaulter_report');
  };

  const handlePrint = () => {
    if (!data) return;
    const columns = ['Student', 'Admission No', 'Course', 'Pending Fee (INR)'];
    const rows = data.map(d => [d.studentName || 'N/A', d.admissionNumber, d.course || 'N/A', `Rs. ${d.pendingFee.toLocaleString()}`]);
    printReport('Defaulter Report', columns, rows);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Defaulter Reports</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm text-left border">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Student Name</th>
              <th className="px-4 py-3 font-medium">Admission No</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Pending Fee</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3 font-medium">{item.studentName || 'N/A'}</td>
                <td className="px-4 py-3">{item.admissionNumber}</td>
                <td className="px-4 py-3"><Badge variant="outline">{item.course || 'N/A'}</Badge></td>
                <td className="px-4 py-3 text-red-600 font-bold">₹{item.pendingFee?.toLocaleString()}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan="4" className="p-4 text-center">No defaulters found.</td></tr>}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// 4. Student Ledger Report
function StudentLedgerReport() {
  const [studentId, setStudentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reportsLedger', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const res = await api.get(`/reports/student-ledger/${searchTerm}`);
      return res.data.data;
    },
    enabled: !!searchTerm,
    retry: false
  });

  const handleExportPDF = () => {
    if (!data?.payments) return;
    const columns = ['Receipt No', 'Date', 'Mode', 'Amount (INR)', 'Collected By'];
    const rows = data.payments.map(p => [
      p.receiptNumber, 
      new Date(p.paymentDate).toLocaleDateString(), 
      p.paymentMode, 
      `Rs. ${p.amountPaid.toLocaleString()}`,
      p.collectedBy?.name || 'System'
    ]);
    exportToPDF(`Ledger: ${data.student.name} (${data.student.admissionNumber})`, columns, rows, `ledger_${data.student.admissionNumber}`);
  };

  const handleExportExcel = () => {
    if (!data?.payments) return;
    const excelData = data.payments.map(p => ({
      'Receipt No': p.receiptNumber, 
      'Date': new Date(p.paymentDate).toLocaleDateString(), 
      'Mode': p.paymentMode, 
      'Amount': p.amountPaid,
      'Collected By': p.collectedBy?.name || 'System'
    }));
    exportToExcel(excelData, `ledger_${data.student.admissionNumber}`);
  };

  const handlePrint = () => {
    if (!data?.payments) return;
    const columns = ['Receipt No', 'Date', 'Mode', 'Amount (INR)', 'Collected By'];
    const rows = data.payments.map(p => [
      p.receiptNumber, 
      new Date(p.paymentDate).toLocaleDateString(), 
      p.paymentMode, 
      `Rs. ${p.amountPaid.toLocaleString()}`,
      p.collectedBy?.name || 'System'
    ]);
    printReport(`Ledger: ${data.student.name} (${data.student.admissionNumber})`, columns, rows);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Ledger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 max-w-lg">
          <Input 
            placeholder="Enter Admission Number (e.g. MKD-2026-0001)" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(studentId)}
          />
          <Button onClick={() => setSearchTerm(studentId)}><Search className="w-4 h-4 mr-2" /> Search</Button>
        </div>

        {isLoading && <div className="text-slate-500">Searching ledger...</div>}

        {data && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
              <div>
                <p className="text-sm text-slate-500">Student Name</p>
                <p className="font-bold text-lg">{data.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Admission No</p>
                <p className="font-bold">{data.student.admissionNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="font-bold">{data.student.mobile}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" /> PDF</Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
              </div>
            </div>

            <table className="w-full text-sm text-left border">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Receipt No</th>
                  <th className="px-4 py-3 font-medium">Mode</th>
                  <th className="px-4 py-3 font-medium">Amount Paid</th>
                  <th className="px-4 py-3 font-medium">Collected By</th>
                </tr>
              </thead>
              <tbody>
                {data.payments?.map((pay, i) => (
                  <tr key={pay._id || i} className="border-b">
                    <td className="px-4 py-3">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{pay.receiptNumber}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{pay.paymentMode}</Badge></td>
                    <td className="px-4 py-3 text-emerald-600 font-bold">₹{pay.amountPaid?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">{pay.collectedBy?.name || 'System'}</td>
                  </tr>
                ))}
                {(!data.payments || data.payments.length === 0) && (
                  <tr><td colSpan="5" className="p-4 text-center">No payment history found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
