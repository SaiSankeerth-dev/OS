import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Play,
  Cpu,
  RefreshCw,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HomeViewData, DailyPlan, PlanItem, Task } from '../../types/api';

export const HomeView: React.FC = () => {
  const { me, setCurrentView, pendingApprovalsCount, activeAgentsCount } = useApp();
  const [homeData, setHomeData] = useState<HomeViewData | null>(null);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHome = async () => {
    setIsLoading(true);
    try {
      const [hRes, pRes] = await Promise.allSettled([
        api.getHomeView(),
        api.getPlan(),
      ]);

      if (hRes.status === 'fulfilled') {
        setHomeData(hRes.value);
      }
      if (pRes.status === 'fulfilled') {
        setPlanItems(pRes.value.items || []);
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

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Greeting & Ambient Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-os-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Operational Command
            </span>
            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-os-secondary">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-os-primary tracking-tight mt-1">
            {me?.greeting || 'Good afternoon'}, {me?.name || 'Sai'}
          </h1>
          <p className="text-xs md:text-sm text-os-secondary mt-0.5">
            {pendingApprovalsCount > 0
              ? `You have ${pendingApprovalsCount} action approval waiting and tasks scheduled for today.`
              : 'All systems nominal. OS is actively observing background feeds and commitments.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            onClick={fetchHome}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentView('chat')}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Ask OS
          </Button>
        </div>
      </div>

      {/* 1. HERO BEAT: "WHAT MATTERS RIGHT NOW" */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>What Matters Right Now</span>
        </div>

        {/* If pending approvals exist, elevate to hero priority! */}
        {pendingApprovalsCount > 0 ? (
          <GlassCard
            glow="amber"
            className="p-6 border-amber-500/30 relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="amber" size="sm">
                    Action Requires Approval
                  </Badge>
                  <span className="text-xs font-mono text-amber-400/90">
                    High Priority Safety Gate
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-os-primary">
                  OS prepared external actions awaiting your confirmation
                </h3>
                <p className="text-xs text-os-secondary max-w-2xl leading-relaxed">
                  Connector requests (such as email dispatch or calendar changes) are held behind
                  tamper-evident SHA-256 integrity checks until you give explicit approval.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentView('approvals')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Review Approvals ({pendingApprovalsCount})
                </Button>
              </div>
            </div>
          </GlassCard>
        ) : homeData?.now?.task ? (
          <GlassCard glow="emerald" className="p-6 border-emerald-500/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" size="sm">
                    Immediate Focus
                  </Badge>
                  {homeData.now.task.deadline && (
                    <span className="text-xs font-mono text-os-muted">
                      Deadline: {homeData.now.task.deadline}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-os-primary">
                  {homeData.now.task.title}
                </h3>
                <p className="text-xs text-os-secondary">
                  Estimated duration: {homeData.now.task.estimated_duration_minutes || 60} mins ·
                  Highest priority in today's active plan.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentView('tasks')}
                leftIcon={<Play className="w-4 h-4" />}
              >
                Start Execution
              </Button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-os-primary">
                  Clear Deck — No critical blockers
                </h3>
                <p className="text-xs text-os-secondary mt-1">
                  You are up to date on pending decisions. Would you like OS to organize your
                  schedule or inspect open commitments?
                </p>
              </div>
              <Button
                variant="glass"
                size="sm"
                onClick={() => setCurrentView('plan')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Inspect Schedule
              </Button>
            </div>
          </GlassCard>
        )}
      </section>

      {/* 2. THREE-COLUMN OPERATIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Plan Timeline */}
        <section className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-os-secondary" />
              <span>Today's Time-Carved Schedule</span>
            </div>
            <button
              onClick={() => setCurrentView('plan')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
            >
              <span>View Full Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <GlassCard className="p-4 space-y-2.5">
            {planItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-os-muted">
                No active plan for today yet.
                <div className="mt-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setCurrentView('plan')}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    Generate Daily Plan
                  </Button>
                </div>
              </div>
            ) : (
              planItems.slice(0, 5).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-2.5 rounded-glass-sm bg-white/5 hover:bg-white/10 border border-transparent hover:border-os-border transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-os-secondary w-16">
                      {item.start_time || '09:00'}
                    </span>
                    <div className="h-2 w-2 rounded-full bg-emerald-400/80"></div>
                    <div>
                      <div className="text-xs font-semibold text-os-primary">{item.title}</div>
                      {item.why_now && (
                        <div className="text-[10px] text-os-muted">{item.why_now}</div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-os-muted">
                    {item.duration_minutes || 60}m
                  </span>
                </div>
              ))
            )}
          </GlassCard>
        </section>

        {/* Right Column: Background Workers & Active Watchers */}
        <section className="space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Background Work</span>
          </div>

          <GlassCard className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-os-border/50 text-xs">
              <span className="text-os-secondary">Watcher Engine</span>
              <span className="text-emerald-400 font-mono text-[11px]">● ACTIVE</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-glass-sm bg-black/20 border border-white/5">
                <div className="font-semibold text-os-primary text-xs">Deadline Watcher</div>
                <div className="text-[11px] text-os-muted mt-0.5">
                  Continually evaluating task progress and recalculating critical path.
                </div>
              </div>

              <div className="p-2.5 rounded-glass-sm bg-black/20 border border-white/5">
                <div className="font-semibold text-os-primary text-xs">Calendar Conflict Guard</div>
                <div className="text-[11px] text-os-muted mt-0.5">
                  Synchronizing busy slots with live Google Calendar adapter.
                </div>
              </div>

              <div className="p-2.5 rounded-glass-sm bg-black/20 border border-white/5">
                <div className="font-semibold text-os-primary text-xs">Email Ingestion Pipe</div>
                <div className="text-[11px] text-os-muted mt-0.5">
                  Extracting commitments and tasks from incoming communications.
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-os-secondary justify-center"
              onClick={() => setCurrentView('agents')}
            >
              Inspect Specialized Workers →
            </Button>
          </GlassCard>
        </section>
      </div>

      {/* 3. RECENT OS ACTIVITY & VERIFICATION PROOFS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-os-secondary" />
            <span>Recent Operational Activity & Proofs</span>
          </div>
          <button
            onClick={() => setCurrentView('activity')}
            className="text-xs text-os-secondary hover:text-os-primary font-mono flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <GlassCard className="p-4 space-y-2">
          {homeData?.recent_activity && homeData.recent_activity.length > 0 ? (
            homeData.recent_activity.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2 rounded-glass-sm hover:bg-white/5 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-os-primary">{act.description}</span>
                </div>
                <span className="font-mono text-[10px] text-os-muted">
                  {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-xs text-os-muted">
              OS initialized. Activity events and proof receipts will be logged here.
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
};
