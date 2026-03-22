'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      toast.error('Invalid email or password');
    } else {
      router.push('/feed');
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center">
            <Music2 size={20} className="text-white" />
          </div>
          <span className="font-display text-3xl font-800 text-gradient-pink">KPOPIN</span>
        </div>
        <p className="text-kpop-muted text-sm">Your K-Pop universe awaits</p>
      </div>

      <div className="bg-card rounded-2xl p-8">
        <h1 className="font-display text-xl font-700 mb-6">Sign in</h1>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-kpop-muted mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="you@example.com"
              className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted"
            />
          </div>

          <div>
            <label className="text-xs text-kpop-muted mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted pr-10"
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-kpop-muted hover:text-white transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-kpop-pink to-kpop-purple text-white hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="text-center text-sm text-kpop-muted mt-6">
          No account?{' '}
          <Link href="/auth/register" className="text-kpop-pink hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
