'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2, Calendar, Brain, ArrowUpRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return null;

  if (status === 'authenticated') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-brand-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-bg shadow-glow flex items-center justify-center text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">TaskFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => router.push('/login')}>
              Log in
            </Button>
            <Button onClick={() => router.push('/login')} className="group">
              Get Started
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium text-sm mb-6 border border-brand-200 dark:border-brand-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Meet your new intelligent workspace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight mb-8 leading-[1.1]">
            Get things done, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">
              without the chaos.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            TaskFlow combines smart task management, calendar integration, and AI assistance into one seamless, beautiful workspace. Focus on what matters, let AI handle the rest.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto group shadow-glow" onClick={() => router.push('/login')}>
              Start for free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View demo
            </Button>
          </div>
          
          <p className="text-sm text-[var(--text-muted)] mt-6">
            No credit card required • 14-day free trial on Pro features
          </p>
        </div>
      </section>

      {/* Product Preview/Mockup */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2 shadow-2xl overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-transparent pointer-events-none" />
            {/* Mockup UI */}
            <div className="w-full h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] flex flex-col overflow-hidden">
              <div className="h-12 border-b border-[var(--border)] bg-[var(--surface)] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 h-6 w-48 bg-[var(--surface-elevated)] rounded-md border border-[var(--border)]" />
              </div>
              <div className="flex-1 flex">
                <div className="w-64 border-r border-[var(--border)] bg-[var(--surface)] p-4 hidden md:block">
                  <div className="h-8 w-3/4 bg-[var(--surface-elevated)] rounded-lg mb-6" />
                  <div className="space-y-3">
                    <div className="h-6 w-full bg-[var(--surface-elevated)] rounded-md opacity-70" />
                    <div className="h-6 w-5/6 bg-[var(--surface-elevated)] rounded-md opacity-70" />
                    <div className="h-6 w-4/6 bg-[var(--surface-elevated)] rounded-md opacity-70" />
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col gap-4">
                  <div className="h-10 w-1/3 bg-[var(--surface-elevated)] rounded-xl mb-4" />
                  <div className="h-24 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm" />
                  <div className="h-24 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm" />
                  <div className="h-24 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[var(--surface-elevated)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything you need to stay on top
            </h2>
            <p className="text-[var(--text-secondary)]">
              We replaced your messy notepad, disjointed calendar, and separate to-do list apps with one cohesive experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Brain}
              title="AI Task Assistant"
              description="Tell the AI what you want to achieve, and it will break it down into actionable subtasks with smart deadlines."
            />
            <FeatureCard 
              icon={Calendar}
              title="Calendar Integration"
              description="Visualize your tasks alongside your meetings. Deep two-way sync with Google Calendar keeps everything aligned."
            />
            <FeatureCard 
              icon={CheckCircle2}
              title="Smart Task Management"
              description="Organize with projects, tags, priorities, and recurring rules. Built for keyboard-heavy users who want speed."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center text-white">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">TaskFlow</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:shadow-card-hover transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
