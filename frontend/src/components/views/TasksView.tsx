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
} from 'lucide-react';
import { api } from '../../services/api';
import { Commitment, Task } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const TasksView: React.FC = () => {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'commitments' | 'tasks'>('commitments');
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New item modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cRes, tRes] = await Promise.allSettled([
        api.getCommitments(),
        api.getTasks(),
      ]);
      if (cRes.status === 'fulfilled') setCommitments(cRes.value.commitments || []);
      if (tRes.status === 'fulfilled') setTasks(tRes.value.tasks || []);
    } catch (err) {
      console.error('Failed to load tasks/commitments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            Commitments & Work
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Real-world contractual commitments vs tactical execution tasks
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
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {activeTab === 'commitments' ? 'New Commitment' : 'New Task'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-os-border select-none">
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
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'tasks'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Tasks ({tasks.length})
        </button>
      </div>

      {/* Content Feed */}
      {activeTab === 'commitments' ? (
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
      ) : (
        <div className="space-y-2.5">
          {tasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-os-muted">
              No tasks currently tracked.
            </div>
          ) : (
            tasks.map((t) => {
              const isDone = t.status === 'DONE';
              return (
                <GlassCard
                  key={t.id}
                  className={`p-4 flex items-center justify-between transition-all ${
                    isDone ? 'opacity-60 bg-white/2' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        if (!isDone) {
                          try {
                            await api.completeTask(String(t.id));
                            addNotification({
                              type: 'success',
                              title: 'Task Done',
                              message: 'Completion recorded with verification.',
                            });
                            fetchData();
                          } catch (err: any) {
                            addNotification({
                              type: 'error',
                              title: 'Failed',
                              message: err.message,
                            });
                          }
                        }
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-os-border hover:border-emerald-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div
                        className={`text-xs md:text-sm font-medium ${
                          isDone ? 'line-through text-os-muted' : 'text-os-primary'
                        }`}
                      >
                        {t.title}
                      </div>
                      <div className="text-[10px] font-mono text-os-muted mt-0.5">
                        Duration: {t.estimated_duration_minutes || 60}m · Priority: {t.priority || 50}
                      </div>
                    </div>
                  </div>

                  <Badge variant={isDone ? 'neutral' : 'cyan'} size="sm">
                    {t.status}
                  </Badge>
                </GlassCard>
              );
            })
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
              className="w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"
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
                className="w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"
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
                className="w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"
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
                className="w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"
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
