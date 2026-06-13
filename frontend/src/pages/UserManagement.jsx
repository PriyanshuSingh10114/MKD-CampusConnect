import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Trash2, Key, Shield, UserCheck, UserX } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resettingPasswordUser, setResettingPasswordUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Admission Staff', status: 'Active' });
  const [newPassword, setNewPassword] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data.data;
    }
  });

  const createUserMutation = useMutation({
    mutationFn: (data) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({ title: 'User created successfully' });
      setIsAdding(false);
      setFormData({ name: '', email: '', password: '', role: 'Admission Staff', status: 'Active' });
    },
    onError: (err) => toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create user', variant: 'destructive' })
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({ title: 'User updated successfully' });
      setEditingUser(null);
    },
    onError: (err) => toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update user', variant: 'destructive' })
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({ title: 'User deleted successfully' });
    },
    onError: (err) => toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete user', variant: 'destructive' })
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/users/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({ title: 'Status updated successfully' });
    },
    onError: (err) => toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' })
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, newPassword }) => api.patch(`/users/${id}/reset-password`, { newPassword }),
    onSuccess: () => {
      toast({ title: 'Password reset successfully' });
      setResettingPasswordUser(null);
      setNewPassword('');
    },
    onError: (err) => toast({ title: 'Error', description: err.response?.data?.message || 'Failed to reset password', variant: 'destructive' })
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUserMutation.mutate({ id: editingUser._id, data: { name: editingUser.name, role: editingUser.role } });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    resetPasswordMutation.mutate({ id: resettingPasswordUser._id, newPassword });
  };

  if (isLoading) return <div className="p-8 text-center">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        {!isAdding && !editingUser && !resettingPasswordUser && (
          <Button onClick={() => setIsAdding(true)}><UserPlus className="w-4 h-4 mr-2" /> Add User</Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader><CardTitle>Add New User</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4 max-w-md">
              <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <Input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              <Input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.role} 
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Principal">Principal</option>
                <option value="Admission Staff">Admission Staff</option>
                <option value="Accounts Staff">Accounts Staff</option>
              </select>
              <div className="flex space-x-2">
                <Button type="submit" disabled={createUserMutation.isPending}>Save User</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {editingUser && (
        <Card>
          <CardHeader><CardTitle>Edit User: {editingUser.email}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
              <Input placeholder="Full Name" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} required />
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={editingUser.role} 
                onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Principal">Principal</option>
                <option value="Admission Staff">Admission Staff</option>
                <option value="Accounts Staff">Accounts Staff</option>
              </select>
              <div className="flex space-x-2">
                <Button type="submit" disabled={updateUserMutation.isPending}>Update</Button>
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {resettingPasswordUser && (
        <Card>
          <CardHeader><CardTitle>Reset Password for {resettingPasswordUser.email}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4 max-w-md">
              <Input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
              <div className="flex space-x-2">
                <Button type="submit" disabled={resetPasswordMutation.isPending}>Reset</Button>
                <Button type="button" variant="outline" onClick={() => setResettingPasswordUser(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!isAdding && !editingUser && !resettingPasswordUser && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Name & Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 flex items-center gap-2">
                        {user.name} 
                        {user.role === 'Super Admin' && <Shield className="w-3 h-3 text-indigo-600" />}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Edit" onClick={() => setEditingUser(user)}>
                          <Edit className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="icon" title="Reset Password" onClick={() => setResettingPasswordUser(user)}>
                          <Key className="w-4 h-4 text-amber-600" />
                        </Button>
                        {user.status === 'Active' ? (
                          <Button variant="outline" size="icon" title="Deactivate" onClick={() => toggleStatusMutation.mutate({ id: user._id, status: 'Inactive' })}>
                            <UserX className="w-4 h-4 text-orange-600" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" title="Activate" onClick={() => toggleStatusMutation.mutate({ id: user._id, status: 'Active' })}>
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                          </Button>
                        )}
                        <Button variant="outline" size="icon" title="Delete" onClick={() => { if(window.confirm('Are you sure you want to delete this user?')) deleteUserMutation.mutate(user._id); }}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!users || users.length === 0) && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
