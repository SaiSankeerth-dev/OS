import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Bot,
  User,
  Search,
  X,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { Commitment, Task, DailyPlan, PlanItem } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

const getTaskCategory = (task: Task): { label: string; color: string } => {
  const text = `${task.title} ${task.description || ''}`.toLowerCase();
  if (text.includes('research') || text.includes('search') || text.includes('review') || text.includes('analyze')) {
    return { label: 'Research', color: 'bg-blue-500/15 text-blue-500 border-blue-500/30' };
  }
  if (text.includes('code') || text.includes('build') || text.includes('bug') || text.includes('fix') || text.includes('git') || text.includes('api')) {
    return { label: 'Development', color: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30' };
  }
  if (text.includes('email') || text.includes('sync') || text.includes('cron') || text.includes('docker') || text.includes('schedule')) {
    return { label: 'Automation', color: 'bg-amber-500/15 text-amber-500 border-amber-500/30' };
  }
  if (text.includes('write') || text.includes('doc') || text.includes('report') || text.includes('post')) {
    return { label: 'Writing', color: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' };
  }
  return { label: 'General', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };
};

interface TasksViewProps {
  initialTab?: 'tasks' | 'plan' | 'commitments';
}

export const TasksView: React.FC<TasksViewProps> = ({ initialTab = 'tasks' }) => {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'tasks' | 'plan' | 'commitments'>(initialTab);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'scheduled'>('all');
  const [taskSearch, setTaskSearch] = useState('');

  // New item modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cRes, tRes, pRes] = await Promise.allSettled([
        api.getCommitments(),
        api.getTasks(),
        api.getPlan(selectedDate),
      ]);
      if (cRes.status === 'fulfilled') setCommitments(cRes.value.commitments || []);
      if (tRes.status === 'fulfilled') setTasks(tRes.value.tasks || []);
      if (pRes.status === 'fulfilled') {
        setPlan(pRes.value.plan);
        setPlanItems(pRes.value.items || []);
      }
    } catch (err) {
      console.error('Failed to load tasks/plan data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await api.generatePlan(selectedDate);
      setPlan(res.plan);
      setPlanItems(res.items || []);
      addNotification({
        type: 'success',
        title: 'Plan Generated',
        message: 'Topological dependencies & calendar busy slots reconciled.',
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Plan Generation Failed',
        message: err.message,
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      if (activeTab === 'commitments') {
        await api.createCommitment({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          deadline: newDeadline || null,
          priority: newPriority,
        });
        addNotification({
          type: 'success',
          title: 'Commitment Registered',
          message: 'Saved to World Model with immutable deadline tracking.',
        });
      } else {
        await api.createTask(newTitle.trim(), {
          priority: newPriority,
          deadline: newDeadline || null,
        });
        addNotification({
          type: 'success',
          title: 'Task Created',
          message: 'Task added to execution pool.',
        });
      }
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewDeadline('');
      fetchData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const isDone = t.status === 'DONE';
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? !isDone
        : filterStatus === 'completed'
        ? isDone
        : filterStatus === 'scheduled'
        ? !!t.deadline
        : true;
    const matchesSearch =
      !taskSearch ||
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            Unified Tasks & Planning
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Consolidated task execution pool, deterministic calendar schedule, and real-world commitments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            onClick={fetchData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          {activeTab === 'plan' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGeneratePlan}
              isLoading={isGeneratingPlan}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate / Replan
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              {activeTab === 'commitments' ? 'New Commitment' : 'New Task'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-os-border select-none">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'tasks'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'plan'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Schedule & Day Plan ({planItems.length})
        </button>
        <button
          onClick={() => setActiveTab('commitments')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'commitments'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Commitments ({commitments.length})
        </button>
      </div>

      {/* Tab 1: All Tasks (Master Reference Panel 4) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filter Pills & Task Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: `All (${tasks.length})` },
                { id: 'active', label: `Active (${tasks.filter((t) => t.status !== 'DONE').length})` },
                { id: 'completed', label: `Completed (${tasks.filter((t) => t.status === 'DONE').length})` },
                { id: 'scheduled', label: `Scheduled (${tasks.filter((t) => !!t.deadline).length})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterStatus(pill.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterStatus === pill.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-os-surface hover:bg-os-surface-active text-os-secondary hover:text-os-primary border border-os-border'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-os-surface px-3 py-1.5 rounded-xl border border-os-border focus-within:border-blue-500/50 w-full sm:w-64 shadow-sm">
              <Search className="w-3.5 h-3.5 text-os-muted flex-shrink-0" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-transparent text-xs text-os-primary placeholder-os-muted focus:outline-none"
              />
              {taskSearch && (
                <button onClick={() => setTaskSearch('')} className="text-os-muted hover:text-os-primary">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Master Reference Tasks Table */}
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-os-muted rounded-2xl bg-os-surface border border-os-border space-y-2">
              <CheckSquare className="w-8 h-8 mx-auto text-os-muted/50" />
              <p>No tasks match the selected filter.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Create New Task
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-os-border bg-os-surface overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-os-surface-active/60 border-b border-os-border/60 text-[10px] font-mono uppercase tracking-wider text-os-muted">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Task Name</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Assignee</th>
                      <th className="py-3 px-4 font-semibold">Due Date</th>
                      <th className="py-3 px-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-os-border/40">
                    {filteredTasks.map((t) => {
                      const isDone = t.status === 'DONE';
                      const category = getTaskCategory(t);
                      return (
                        <tr key={t.id} className="hover:bg-os-surface-active/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={async () => {
                                  try {
                                    if (!isDone) {
                                      await api.completeTask(String(t.id));
                                      addNotification({
                                        type: 'success',
                                        title: 'Task Done',
                                        message: 'Completion recorded with verification proof.',
                                      });
                                    }
                                    fetchData();
                                  } catch (err: any) {
                                    addNotification({
                                      type: 'error',
                                      title: 'Action Failed',
                                      message: err.message,
                                    });
                                  }
                                }}
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-black'
                                    : 'border-os-border hover:border-emerald-400 text-transparent'
                                }`}
                                title={isDone ? 'Task completed' : 'Mark complete'}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>
                              <div className="min-w-0">
                                <div className={`font-semibold text-xs ${isDone ? 'line-through text-os-muted' : 'text-os-primary'}`}>
                                  {t.title}
                                </div>
                                {t.description && (
                                  <div className="text-[11px] text-os-muted line-clamp-1 mt-0.5">
                                    {t.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isDone
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`} />
                              {isDone ? 'Completed' : 'In Progress'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${category.color}`}>
                              {category.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                                AI
                              </div>
                              <span className="text-[11px] text-os-secondary font-medium">OS Agent</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-os-secondary font-mono text-[11px]">
                            {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'Today'}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={async () => {
                                try {
                                  if (!isDone) {
                                    await api.completeTask(String(t.id));
                                    addNotification({
                                      type: 'success',
                                      title: 'Task Done',
                                      message: 'Completion recorded with verification proof.',
                                    });
                                  }
                                  fetchData();
                                } catch (err: any) {
                                  addNotification({
                                    type: 'error',
                                    title: 'Action Failed',
                                    message: err.message,
                                  });
                                }
                              }}
                              className="text-xs text-blue-500 hover:text-blue-400 font-medium px-2 py-1 rounded hover:bg-white/5 transition-colors"
                            >
                              {isDone ? 'Reopen' : 'Done'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Schedule & Day Plan */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-os-secondary font-medium">Selected Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-os-surface/80 border border-os-border rounded-glass-sm px-2.5 py-1 text-xs text-os-primary focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            {plan && (
              <span className="text-[11px] font-mono text-os-muted">
                Plan ID: {plan.id}
              </span>
            )}
          </div>

          {planItems.length === 0 ? (
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
                isLoading={isGeneratingPlan}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Daily Plan
              </Button>
            </GlassCard>
          ) : (
            <div className="relative pl-6 md:pl-8 border-l border-os-border/60 space-y-4">
              {planItems.map((item, idx) => {
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
                    <div
                      className={`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-os-bg transition-transform group-hover:scale-110 ${
                        isMeeting
                          ? 'bg-cyan-400'
                          : isBuffer
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />

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
                          {duration} min duration
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1">
                        <h4 className="text-sm font-semibold text-os-primary">{item.title}</h4>
                        {whyNowText && (
                          <p className="text-xs text-os-secondary italic">
                            Why now: {whyNowText}
                          </p>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Commitments */}
      {activeTab === 'commitments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commitments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-os-muted">
              No active commitments found. Create one or let OS detect commitments from email.
            </div>
          ) : (
            commitments.map((c) => (
              <GlassCard key={c.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      Commitment
                    </span>
                    <h3 className="text-base font-bold text-os-primary mt-0.5">{c.title}</h3>
                  </div>
                  <Badge variant={c.status === 'active' ? 'emerald' : 'neutral'} size="sm">
                    {c.status.toUpperCase()}
                  </Badge>
                </div>

                {c.description && (
                  <p className="text-xs text-os-secondary leading-relaxed">{c.description}</p>
                )}

                <div className="pt-2 border-t border-os-border/50 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-os-muted block text-[10px]">DEADLINE</span>
                    <span className="text-os-primary font-medium">
                      {c.deadline ? new Date(c.deadline).toLocaleDateString() : 'None set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-os-muted block text-[10px]">PRIORITY</span>
                    <span className="text-emerald-400 font-medium">{c.priority} / 100</span>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'commitments' ? 'Register New Commitment' : 'Create Task'}
        subtitle="Saved to the World Model database."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-os-secondary mb-1 uppercase font-mono text-[10px]">
              Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Send final investment proposal"
              className="w-full rounded-glass-sm bg-os-surface/80 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"
            />
          </div>

          {activeTab === 'commitments' && (
            <div>
              <label className="block text-os-secondary mb-1 uppercase font-mono text-[10px]">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Contractual context, scope, or conditions..."
                rows={3}
                className="w-full rounded-glass-sm bg-os-surface/80 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-os-secondary mb-1 uppercase font-mono text-[10px]">
                Deadline
              </label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full rounded-glass-sm bg-os-surface/80 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-os-secondary mb-1 uppercase font-mono text-[10px]">
                Priority (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newPriority}
                onChange={(e) => setNewPriority(Number(e.target.value))}
                className="w-full rounded-glass-sm bg-os-surface/80 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-os-border">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreate}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
