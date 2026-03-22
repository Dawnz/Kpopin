'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, Compass, Bell, MessageCircle, User, LogOut, Music2, Hash, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/feed',        label: 'Home',      icon: Home        },
  { href: '/explore',     label: 'Explore',   icon: Compass     },
  { href: '/trending',    label: 'Trending',  icon: TrendingUp  },
  { href: '/groups',      label: 'Groups',    icon: Hash        },
  { href: '/chat',        label: 'Messages',  icon: MessageCircle },
  { href: '/notifications', label: 'Alerts',  icon: Bell        },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col border-r border-kpop-border bg-kpop-dark z-40 px-4 py-6">
      {/* Logo */}
      <Link href="/feed" className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center">
          <Music2 size={16} className="text-white" />
        </div>
        <span className="font-display text-xl font-800 text-gradient-pink">KPOPIN</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              pathname === href
                ? 'bg-kpop-pink/10 text-kpop-pink border border-kpop-pink/20'
                : 'text-kpop-muted hover:text-white hover:bg-white/5'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      {session?.user && (
        <div className="border-t border-kpop-border pt-4 space-y-2">
          <Link
            href={`/profile/${(session.user as any).username || session.user.email}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-xs font-bold">
              {session.user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-kpop-muted truncate">{session.user.email}</p>
            </div>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-kpop-muted hover:text-red-400 hover:bg-red-400/5 transition-all text-sm"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
