import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

import bgImage from '@/assets/bg-img-col.jpeg';

import logo from '@/assets/bg-logo.jpg';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));

        toast({
          title: 'Success',
          description: 'Logged in successfully!',
        });

        navigate('/dashboard');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}
      <Card className="relative z-10 w-[460px] bg-black/30 backdrop-blur-2xl border border-white/20 shadow-2xl text-white rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-2">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={logo}
              alt="MKD Logo"
              className="w-24 h-24 rounded-full bg-white p-2 shadow-xl object-contain"
            />
          </div>

          <CardTitle className="text-3xl font-bold tracking-wide leading-tight">
            MKD GROUP OF
            <br />
            INSTITUTIONS
          </CardTitle>

          <CardDescription className="text-slate-200 text-base">
            Admission & Fee Management Portal
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-white font-medium"
              >
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-white font-medium"
              >
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>
          </CardContent>

          <CardFooter className="pb-6 pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-lg"
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}