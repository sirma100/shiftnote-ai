'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!');
        router.push('/');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Create Your Account
        </h1>
        <form className="bg-white p-8 shadow-lg rounded-lg" onSubmit={handleRegister}>
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
                placeholder="Create a password (min 6 characters)"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <Lock className="w-5 h-5 text-gray-600 mr-2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 outline-none"
                placeholder="Confirm your password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:underline">
            Login here
          </Link>
        </p>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Free Account Includes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 2 formatted notes per day</li>
            <li>• All templates included</li>
            <li>• Copy to clipboard</li>
            <li>• Basic support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
