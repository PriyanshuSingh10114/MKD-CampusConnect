import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        toast({ title: 'Success', description: 'Logged in successfully!' });
        navigate('/dashboard');
      }
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Invalid credentials', variant: 'destructive' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-indigo-950">
      <Card className="w-[400px] shadow-2xl border-0">
        <CardHeader className="text-center bg-indigo-600 text-white rounded-t-xl">
          <CardTitle className="text-3xl font-black tracking-wider">CampusConnect</CardTitle>
          <CardDescription className="text-indigo-100">Enter your credentials to login</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin} className="pt-6">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@college.edu" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="pb-6">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg">Sign In</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
