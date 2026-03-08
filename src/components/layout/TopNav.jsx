'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSidebar } from '@/context/SidebarContext';
import { useTheme } from '@/context/ThemeContext';
import Avatar from '@/components/ui/Avatar';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  User,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function TopNav({ onOpenAiChat }) {
  const { data: session } = useSession();
  const { toggleMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme] || Monitor;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="hidden sm:flex items-center gap-2 bg-[var(--surface-elevated)] dark:bg-[var(--surface-elevated)] rounded-xl px-3 py-2 border border-[var(--border)] w-[280px] lg:w-[360px] transition-all focus-within:ring-2 focus-within:ring-brand-500/40 focus-within:border-brand-500">
            <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-full"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] bg-[var(--surface)] dark:bg-[var(--background)] rounded border border-[var(--border)]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* AI button */}
          <button 
            onClick={onOpenAiChat}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-600/10 transition-colors relative group"
          >
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          </button>

          {/* Theme toggle */}
          <Dropdown
            align="right"
            trigger={
              <button className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <ThemeIcon className="w-5 h-5" />
              </button>
            }
          >
            {({ close }) => (
              <>
                <DropdownItem
                  icon={Sun}
                  onClick={() => { setTheme('light'); close(); }}
                >
                  Light
                </DropdownItem>
                <DropdownItem
                  icon={Moon}
                  onClick={() => { setTheme('dark'); close(); }}
                >
                  Dark
                </DropdownItem>
                <DropdownItem
                  icon={Monitor}
                  onClick={() => { setTheme('system'); close(); }}
                >
                  System
                </DropdownItem>
              </>
            )}
          </Dropdown>

          {/* Notifications */}
          <button className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative">
            <Bell className="w-5 h-5" />
          </button>

          {/* User menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <Avatar
                  name={session?.user?.name}
                  image={session?.user?.image}
                  size="sm"
                />
                <span className="hidden md:block text-sm font-medium text-[var(--text-primary)] max-w-[120px] truncate">
                  {session?.user?.name || 'User'}
                </span>
              </button>
            }
          >
            {({ close }) => (
              <>
                <div className="px-3 py-2 border-b border-[var(--border)]">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <DropdownItem icon={User} onClick={close}>
                  Profile
                </DropdownItem>
                <DropdownItem icon={Settings} onClick={close}>
                  Settings
                </DropdownItem>
                <div className="border-t border-[var(--border)] mt-1 pt-1">
                  <DropdownItem
                    icon={LogOut}
                    danger
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign out
                  </DropdownItem>
                </div>
              </>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
