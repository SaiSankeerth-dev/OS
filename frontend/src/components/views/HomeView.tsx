import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  RefreshCw,
  ChevronRight,
  Monitor,
  Link2,
  CheckSquare,
  Search,
  Terminal,
  Code2,
  Compass,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HomeViewData, PlanItem, Connector, Task } from '../../types/api';

export const HomeView: React.FC = () => {
  const { me, setCurrentView, pendingApprovalsCount, activeAgentsCount } = useApp();
  const [homeData, setHomeData] = useState<HomeViewData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickQuery, setQuickQuery] = useState('');
  const [desktopRuntime, setDesktopRuntime] = useState<{ status?: string; message?: string } | null>(null);

  const fetchHome = async () => {
    setIsLoading(true);
    try {
      const [hRes, tRes, pRes, cRes, desktopRes] = await Promise.allSettled([
        api.getHomeView(),
        api.getTasks(),
        api.getPlan(),
        api.getConnectors(),
        fetch('/api/computer/desktop/status').then(async (response) => {
          if (!response.ok) throw new Error(`Desktop status returned HTTP ${response.status}`);
          return response.json();
        }),
      ]);

      if (hRes.status === 'fulfilled') {
        setHomeData(hRes.value);
      }
      if (tRes.status === 'fulfilled') {
        setTasks(tRes.value.tasks || []);
      }
      if (pRes.status === 'fulfilled') {
        setPlanItems(pRes.value.items || []);
      }
      if (cRes.status === 'fulfilled') {
        setConnectors(cRes.value.connectors || []);
      }
      if (desktopRes.status === 'fulfilled') {
        setDesktopRuntime(desktopRes.value.health || null);
      } else {
        setDesktopRuntime(null);
      }
    } catch (err) {
      console.error('Failed to load home view data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  const handleAskOS = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickQuery.trim()) {
      setCurrentView('chat');
      return;
    }
    // Store quick query in session so ChatCanvas can pick it up if needed
    try {
      sessionStorage.setItem('os-pending-query', quickQuery.trim());
    } catch (_) {}
    setCurrentView('chat');
  };

  const handleActionPill = (action: string) => {
    switch (action) {
      case 'Deep Research':
        sessionStorage.setItem('os-pending-query', 'Conduct a deep web research on ');
        setCurrentView('chat');
        break;
      case 'Use Computer':
        setCurrentView('computer');
        break;
      case 'Build':
        sessionStorage.setItem('os-pending-query', 'Help me build and test ');
        setCurrentView('chat');
        break;
      case 'Automate':
        setCurrentView('tasks');
        break;
      case 'Analyze':
        sessionStorage.setItem('os-pending-query', 'Analyze this dataset and generate key insights: ');
        setCurrentView('chat');
        break;
      default:
        setCurrentView('chat');
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  const connectedCount = connectors.filter((c) => c.state === 'connected').length;
  const desktopStatus = desktopRuntime?.status?.toUpperCase() || 'UNKNOWN';
  const desktopStatusClass =
    desktopStatus === 'READY'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-300'
      : desktopStatus === 'DEGRADED' || desktopStatus === 'STARTING'
      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300'
      : 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-300';

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Master Reference Hero Section: Warm Centered Greeting + Interactive Search Bar */}
      <div className="flex flex-col items-center text-center space-y-4 pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OS Personal AI Operating System</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-os-primary tracking-tight">
          {getTimeGreeting()} What would you like to do today?
        </h1>
        <p className="text-sm text-os-secondary max-w-lg">
          Ask questions, execute automated desktop actions, conduct deep research, or orchestrate autonomous workflows.
        </p>

        {/* Big Rounded Glass Input Bar */}
        <form
          onSubmit={handleAskOS}
          className="w-full max-w-2xl relative flex items-center group mt-2"
        >
          <div className="absolute left-4 text-os-muted group-focus-within:text-blue-500 transition-colors pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ask OS to do anything, or run a quick command..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-os-surface/80 hover:bg-os-surface border border-os-border focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 text-sm text-os-primary placeholder:text-os-muted shadow-lg shadow-black/5 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            title="Ask OS"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 5 Quick Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {[
            { label: 'Deep Research', icon: Sparkles },
            { label: 'Use Computer', icon: Monitor },
            { label: 'Build', icon: Code2 },
            { label: 'Automate', icon: CheckSquare },
            { label: 'Analyze', icon: Activity },
          ].map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.label}
                onClick={() => handleActionPill(pill.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-os-surface hover:bg-os-surface-active border border-os-border hover:border-blue-500/30 text-xs font-medium text-os-secondary hover:text-os-primary transition-all shadow-sm group"
              >
                <Icon className="w-3.5 h-3.5 text-os-muted group-hover:text-blue-500 transition-colors" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Gate Alert if Approvals Pending */}
      {pendingApprovalsCount > 0 && (
        <GlassCard
          glow="amber"
          className="p-4 border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Safety Approval Required
              </div>
              <div className="text-xs text-os-primary mt-0.5">
                {pendingApprovalsCount} external action{pendingApprovalsCount > 1 ? 's' : ''} awaiting your cryptographic sign-off.
              </div>
            </div>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={() => setCurrentView('activity')}
            className="border-amber-500/40 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300"
          >
            Review & Authorize
          </Button>
        </GlassCard>
      )}

      {/* 2. Master Reference 3-Column Grid: Quick Actions | Recent Tasks | System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-os-muted">
              Quick Actions
            </h2>
          </div>

          <div className="space-y-2.5">
            {/* Quick Action 1: Browse & Research */}
            <div
              onClick={() => {
                sessionStorage.setItem('os-pending-query', 'Conduct a deep web research on ');
                setCurrentView('chat');
              }}
              className="p-4 rounded-xl bg-os-surface/80 hover:bg-os-surface border border-os-border hover:border-blue-500/30 cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-os-primary group-hover:text-blue-500 transition-colors">
                      Browse & Research
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-os-muted group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-os-secondary mt-1 leading-relaxed">
                    Research a topic across multiple web sources, extract tables, and summarize findings.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action 2: Code & Build */}
            <div
              onClick={() => {
                sessionStorage.setItem('os-pending-query', 'Help me build and test a service in this workspace.');
                setCurrentView('chat');
              }}
              className="p-4 rounded-xl bg-os-surface/80 hover:bg-os-surface border border-os-border hover:border-emerald-500/30 cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-os-primary group-hover:text-emerald-500 transition-colors">
                      Code & Build
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-os-muted group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-os-secondary mt-1 leading-relaxed">
                    Run OpenCode in isolated sandbox, inspect repositories, test endpoints, and commit changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action 3: Desktop Task */}
            <div
              onClick={() => setCurrentView('computer')}
              className="p-4 rounded-xl bg-os-surface/80 hover:bg-os-surface border border-os-border hover:border-cyan-500/30 cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:scale-105 transition-transform">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-os-primary group-hover:text-cyan-500 transition-colors">
                      Desktop Task
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-os-muted group-hover:text-cyan-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-os-secondary mt-1 leading-relaxed">
                    Launch Linux desktop, stream Chromium via CDP, and observe or take over AI control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Recent Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-os-muted">
              Recent Tasks
            </h2>
            <button
              onClick={() => setCurrentView('tasks')}
              className="text-[11px] text-blue-500 hover:text-blue-400 font-medium flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-xl bg-os-surface/80 border border-os-border p-3 space-y-2 shadow-sm">
            {tasks.length > 0 ? (
              tasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  onClick={() => setCurrentView('tasks')}
                  className="p-2.5 rounded-lg hover:bg-os-surface-active/60 border border-transparent hover:border-os-border/50 cursor-pointer transition-all flex items-start gap-2.5 text-xs"
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      t.status === 'DONE'
                        ? 'bg-emerald-400'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-400 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-os-primary truncate">{t.title}</div>
                    <div className="text-[10px] text-os-muted flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{t.status.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Active'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-os-muted space-y-2">
                <CheckSquare className="w-6 h-6 mx-auto text-os-muted/60" />
                <p>No active tasks in execution pool.</p>
                <button
                  onClick={() => setCurrentView('tasks')}
                  className="text-blue-500 hover:underline text-[11px]"
                >
                  Create a task in Tasks View
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: System Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-os-muted">
              System Status
            </h2>
            <button
              onClick={fetchHome}
              className="text-[11px] text-os-muted hover:text-os-primary"
              title="Refresh status"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="rounded-xl bg-os-surface/80 border border-os-border p-4 space-y-3 shadow-sm text-xs">
            {/* Status Item 1: Docker Desktop */}
            <div className="flex items-center justify-between pb-2.5 border-b border-os-border/40">
              <div className="flex items-center gap-2.5">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-os-primary">Virtual Desktop</div>
                  <div className="text-[10px] text-os-muted font-mono" title={desktopRuntime?.message}>
                    {desktopRuntime?.message || 'Runtime status unavailable'}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${desktopStatusClass}`}>
                {desktopStatus}
              </span>
            </div>

            {/* Status Item 2: AI Model */}
            <div className="flex items-center justify-between pb-2.5 border-b border-os-border/40">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="font-semibold text-os-primary">AI Model</div>
                  <div className="text-[10px] text-os-muted font-mono">{me?.model || 'No model configured'}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                me?.model_ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300'
              }`}>
                {me?.model_ok ? 'ACTIVE' : 'UNAVAILABLE'}
              </span>
            </div>

            {/* Status Item 3: Approvals Policy */}
            <div className="flex items-center justify-between pb-2.5 border-b border-os-border/40">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold text-os-primary">Approvals Policy</div>
                  <div className="text-[10px] text-os-muted font-mono">SafeExecutor SHA-256</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-400">
                STRICT
              </span>
            </div>

            {/* Status Item 4: Connectors */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Link2 className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold text-os-primary">Connectors</div>
                  <div className="text-[10px] text-os-muted font-mono">{connectors.length} integrations</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                connectedCount > 0
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-300'
                  : 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-300'
              }`}>
                {connectedCount > 0 ? `${connectedCount} CONNECTED` : 'NONE CONNECTED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
