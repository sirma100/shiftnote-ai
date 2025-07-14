'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Logged in successfully!');
        router.push('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Login to Your Account
        </h1>
        <form className="bg-white p-8 shadow-lg rounded-lg" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <Mail className="w-5 h-5 text-gray-600 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <Lock className="w-5 h-5 text-gray-600 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={
              `w-full py-3 rounded-lg font-semibold text-white ${
                loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
              } transition-colors`
            }
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
