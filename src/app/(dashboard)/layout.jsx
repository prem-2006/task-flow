'use client';

import { useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import MobileNav from '@/components/layout/MobileNav';
import AiChatPanel from '@/components/ai/AiChatPanel';

export default function DashboardLayout({ children }) {
  const { isCollapsed } = useSidebar();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}
        `}
      >
        {/* Top navigation */}
        <TopNav onOpenAiChat={() => setIsAiChatOpen(true)} />

        {/* Page content */}
        <main className="p-4 lg:p-6 pb-24 lg:pb-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />

      {/* AI Chat Panel */}
      <AiChatPanel isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
    </div>
  );
}
