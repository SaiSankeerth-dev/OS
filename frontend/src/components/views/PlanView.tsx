import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { DailyPlan, PlanItem } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const PlanView: React.FC = () => {
  const { addNotification } = useApp();
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const fetchPlan = async (dateStr?: string) => {
    setIsLoading(true);
    try {
      const res = await api.getPlan(dateStr || selectedDate);
      setPlan(res.plan);
      setItems(res.items || []);
    } catch (err) {
      console.error('Failed to load plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan(selectedDate);
  }, [selectedDate]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generatePlan(selectedDate);
      setPlan(res.plan);
      setItems(res.items || []);
      addNotification({
        type: 'success',
        title: 'Plan Generated',
        message: 'Topological dependencies & calendar busy slots reconciled.',
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Deterministic Planner
            </span>
            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-os-secondary">{selectedDate}</span>
          </div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight mt-1">
            Day Schedule & Conflict Carving
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Strict deadline separation · Busy slot allocation · Dependency preservation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            onClick={() => fetchPlan()}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGeneratePlan}
            isLoading={isGenerating}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Generate / Replan
          </Button>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-os-primary">
              No scheduled plan for {selectedDate}
            </h3>
            <p className="text-xs text-os-secondary max-w-sm mx-auto">
              OS can analyze your open tasks, calendar busy slots, and deadlines to compute an
              optimal execution order.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleGeneratePlan}
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Daily Plan
            </Button>
          </GlassCard>
        ) : (
          <div className="relative pl-6 md:pl-8 border-l border-os-border/60 space-y-4">
            {items.map((item, idx) => {
              const itemType = (item.item_type || (item as any).type || item.status || 'TASK').toLowerCase();
              const isMeeting = itemType === 'meeting' || itemType === 'event';
              const isBuffer = itemType === 'buffer';
              const startTime = item.start_time || (item.scheduled_start ? new Date(item.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00');
              const endTime = item.end_time || (item.scheduled_end ? new Date(item.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00');
              const duration = item.duration_minutes || (item as any).why_now?.duration_minutes || 60;
              const whyNowText = typeof item.why_now === 'string'
                ? item.why_now
                : (item.why_now as any)?.rationale || '';

              return (
                <div key={item.id || idx} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-os-bg transition-transform group-hover:scale-110 ${
                      isMeeting
                        ? 'bg-cyan-400'
                        : isBuffer
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />

                  {/* Schedule Card */}
                  <GlassCard
                    className={`p-4 transition-all ${
                      isMeeting ? 'border-cyan-500/20' : 'hover:border-os-border-glass'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-os-border/40">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {startTime} - {endTime}
                        </span>
                        <Badge
                          variant={isMeeting ? 'cyan' : isBuffer ? 'amber' : 'emerald'}
                          size="sm"
                        >
                          {itemType.toUpperCase()}
                        </Badge>
                      </div>

                      <span className="text-[11px] font-mono text-os-muted">
                        {duration} min slot
                      </span>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-os-primary">{item.title || (item as any).summary || 'Scheduled Item'}</h4>
                        {whyNowText && (
                          <p className="text-xs text-os-secondary mt-1 flex items-center gap-1.5">
                            <span className="font-mono text-[10px] uppercase text-os-muted">
                              Rationale:
                            </span>
                            <span>{whyNowText}</span>
                          </p>
                        )}
                      </div>

                      {item.task_id && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="glass"
                            size="sm"
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            onClick={async () => {
                              try {
                                await api.completeTask(item.task_id!);
                                addNotification({
                                  type: 'success',
                                  title: 'Task Completed',
                                  message: 'Task marked complete and evidence registered.',
                                });
                                fetchPlan();
                              } catch (err: any) {
                                addNotification({
                                  type: 'error',
                                  title: 'Update Failed',
                                  message: err.message,
                                });
                              }
                            }}
                          >
                            Mark Done
                          </Button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
