'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { registerApi, loginApi } from "@/lib/api";


export default function SignUp() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Register the user
      await registerApi(
        formData.username,
        formData.email,
        formData.password,
      );

      // log in
      const loginRes = await loginApi(
        formData.email,
        formData.password,
      );

      await login(loginRes.access_token)
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Registration error:', err);
      try {
        const data = JSON.parse(err.message);
        setErrorMsg(data.message || 'Registration failed');
      } catch {
        setErrorMsg('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Automize Logo" width={48} height={48} />
            </Link>
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors text-2xl">✕</Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Sign up</h2>
          <p className="text-slate-600 text-center mb-6">Wir sind bereit zu Registrieren</p>

          {errorMsg && <p className="text-red-500 text-center mb-3">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Wird registriert...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign In →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
