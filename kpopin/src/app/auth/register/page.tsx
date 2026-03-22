'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music2, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface KpopGroup {
  id: string;
  name: string;
  agency: string | null;
  members: string[];
}

export default function RegisterPage() {
  const [step, setStep]             = useState(1);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [groups, setGroups]         = useState<KpopGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading]       = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/groups').then((r) => r.json()).then((data) => setGroups(data.groups ?? []));
  }, []);

  function toggleGroup(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function handleRegister() {
    if (!name || !email || !password || !username) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, groupIds: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Registration failed'); return; }
      toast.success('Account created! Please sign in.');
      router.push('/auth/login');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
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
        <p className="text-kpop-muted text-sm">Join the fandom</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className={cn('flex items-center gap-1.5')}>
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step >= s ? 'bg-gradient-to-br from-kpop-pink to-kpop-purple text-white' : 'bg-kpop-border text-kpop-muted'
            )}>
              {step > s ? <Check size={12} /> : s}
            </div>
            <span className={cn('text-xs', step >= s ? 'text-white' : 'text-kpop-muted')}>
              {s === 1 ? 'Account' : 'Your groups'}
            </span>
            {s < 2 && <div className="w-8 h-px bg-kpop-border mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-8">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="font-display text-xl font-700 mb-2">Create your account</h1>

            <div>
              <label className="text-xs text-kpop-muted mb-1.5 block">Display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted"
              />
            </div>

            <div>
              <label className="text-xs text-kpop-muted mb-1.5 block">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                placeholder="@username"
                className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted"
              />
            </div>

            <div>
              <label className="text-xs text-kpop-muted mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted pr-10"
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-kpop-muted hover:text-white transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (!name || !email || !password || !username) { toast.error('Fill in all fields'); return; }
                setStep(2);
              }}
              className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-kpop-pink to-kpop-purple text-white hover:opacity-90 transition-opacity mt-2"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-display text-xl font-700 mb-1">Pick your groups</h1>
            <p className="text-kpop-muted text-sm mb-5">Select the groups you love — your feed will be personalised around them.</p>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 mb-5">
              {groups.map((g) => {
                const selected = selectedIds.includes(g.id);
                const gradients = ['from-kpop-pink to-kpop-purple', 'from-kpop-purple to-kpop-cyan', 'from-kpop-cyan to-kpop-pink', 'from-kpop-yellow to-kpop-pink'];
                const gradient  = gradients[g.name.charCodeAt(0) % gradients.length];
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGroup(g.id)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl border text-left transition-all',
                      selected ? 'border-kpop-pink/50 bg-kpop-pink/5' : 'border-kpop-border hover:border-kpop-border/80'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center text-white font-bold text-sm', gradient)}>
                      {g.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{g.name}</p>
                      <p className="text-xs text-kpop-muted truncate">{g.agency}</p>
                    </div>
                    {selected && <Check size={14} className="text-kpop-pink ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-kpop-muted mb-4">
              {selectedIds.length === 0 ? 'You can always follow groups later' : `${selectedIds.length} group${selectedIds.length > 1 ? 's' : ''} selected`}
            </p>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-3 rounded-lg text-sm text-kpop-muted hover:text-white border border-kpop-border transition-colors">
                Back
              </button>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-medium bg-gradient-to-r from-kpop-pink to-kpop-purple text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-kpop-muted mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-kpop-pink hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
