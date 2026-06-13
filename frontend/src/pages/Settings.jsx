import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Building2, GraduationCap, IndianRupee, Settings as SettingsIcon, Database, Save, Download } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    institution: { name: '', address: '', phone: '', email: '', logo: '' },
    academic: { currentSession: '', admissionPrefix: '', courses: '' },
    fee: { receiptPrefix: '', paymentModes: '' },
    system: { theme: 'light' }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data.data;
    }
  });

  useEffect(() => {
    if (data) {
      setFormData({
        institution: {
          name: data.institution?.name || '',
          address: data.institution?.address || '',
          phone: data.institution?.phone || '',
          email: data.institution?.email || '',
          logo: data.institution?.logo || ''
        },
        academic: {
          currentSession: data.admission?.currentSession || '',
          admissionPrefix: data.admission?.prefix || '',
          courses: (data.admission?.courses || []).join(', ')
        },
        fee: {
          receiptPrefix: data.receipt?.prefix || '',
          paymentModes: (data.receipt?.paymentModes || []).join(', ')
        },
        system: {
          theme: data.system?.theme || 'light'
        }
      });
    }
  }, [data]);

  const updateSettingsMutation = useMutation({
    mutationFn: (payload) => api.put('/settings', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      toast({ title: 'Settings saved successfully' });
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to save settings', variant: 'destructive' });
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      institution: formData.institution,
      admission: {
        currentSession: formData.academic.currentSession,
        prefix: formData.academic.admissionPrefix,
        courses: formData.academic.courses.split(',').map(c => c.trim()).filter(c => c)
      },
      receipt: {
        prefix: formData.fee.receiptPrefix,
        paymentModes: formData.fee.paymentModes.split(',').map(m => m.trim()).filter(m => m)
      },
      system: formData.system
    };
    updateSettingsMutation.mutate(payload);
  };

  const handleBackup = async () => {
    try {
      toast({ title: 'Generating Backup...', description: 'Please wait.' });
      const res = await api.get('/settings/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `erp_backup_${new Date().getTime()}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast({ title: 'Backup downloaded successfully' });
    } catch (error) {
      toast({ title: 'Backup Failed', description: 'Could not generate backup', variant: 'destructive' });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Settings...</div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">System Settings</h2>
        <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateSettingsMutation.isPending ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Institution Settings */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center text-slate-800">
              <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
              Institution Profile
            </CardTitle>
            <CardDescription>Update your college name, contact info, and branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input value={formData.institution.name} onChange={e => setFormData({ ...formData, institution: { ...formData.institution, name: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={formData.institution.email} onChange={e => setFormData({ ...formData, institution: { ...formData.institution, email: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={formData.institution.phone} onChange={e => setFormData({ ...formData, institution: { ...formData.institution, phone: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.institution.address} onChange={e => setFormData({ ...formData, institution: { ...formData.institution, address: e.target.value } })} />
            </div>
          </CardContent>
        </Card>

        {/* Academic Settings */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center text-slate-800">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Academic Settings
            </CardTitle>
            <CardDescription>Configure admission rules and current active sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Current Session</Label>
              <Input placeholder="e.g. 2026-2027" value={formData.academic.currentSession} onChange={e => setFormData({ ...formData, academic: { ...formData.academic, currentSession: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Admission Number Prefix</Label>
              <Input placeholder="e.g. MKD-" value={formData.academic.admissionPrefix} onChange={e => setFormData({ ...formData, academic: { ...formData.academic, admissionPrefix: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Available Courses (Comma separated)</Label>
              <Input placeholder="B.Ed, BTC, ITI" value={formData.academic.courses} onChange={e => setFormData({ ...formData, academic: { ...formData.academic, courses: e.target.value } })} />
            </div>
          </CardContent>
        </Card>

        {/* Fee Settings */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center text-slate-800">
              <IndianRupee className="w-5 h-5 mr-2 text-emerald-600" />
              Fee Settings
            </CardTitle>
            <CardDescription>Manage receipt generation and payment methods.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Receipt Prefix</Label>
              <Input placeholder="e.g. REC-" value={formData.fee.receiptPrefix} onChange={e => setFormData({ ...formData, fee: { ...formData.fee, receiptPrefix: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Accepted Payment Modes (Comma separated)</Label>
              <Input placeholder="Cash, UPI, Cheque" value={formData.fee.paymentModes} onChange={e => setFormData({ ...formData, fee: { ...formData.fee, paymentModes: e.target.value } })} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* System Settings */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center text-slate-800">
                <SettingsIcon className="w-5 h-5 mr-2 text-purple-600" />
                System Settings
              </CardTitle>
              <CardDescription>Manage UI preferences and themes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.system.theme}
                  onChange={e => setFormData({ ...formData, system: { ...formData.system, theme: e.target.value } })}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card className="shadow-sm border-red-200 border">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="text-lg flex items-center text-red-800">
                <Database className="w-5 h-5 mr-2 text-red-600" />
                Database Backup
              </CardTitle>
              <CardDescription className="text-red-600/80">Download a full JSON snapshot of your data.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button variant="destructive" onClick={handleBackup} className="w-full">
                <Download className="w-4 h-4 mr-2" /> Export Database Backup
              </Button>
              <p className="text-xs text-slate-500 mt-4 text-center">
                This will export all Users, Students, Admissions, and Payments as a single JSON file. Keep this file secure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
