import React, { useState, useEffect } from 'react';
import {
  Bot,
  Globe,
  Code,
  Search,
  Calendar,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Send,
} from 'lucide-react';
import { api } from '../../services/api';
import { AgentRun } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const AgentsView: React.FC = () => {
  const { addNotification, refreshData } = useApp();
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dispatch modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentType, setAgentType] = useState<'coding' | 'browser' | 'research'>('research');
  const [instruction, setInstruction] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAgents();
      setRuns(res.agent_runs || []);
    } catch (err) {
      console.error('Failed to load agent runs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDispatch = async () => {
    if (!instruction.trim()) return;
    setIsDispatching(true);
    try {
      await api.dispatchAgent(agentType, instruction.trim());
      addNotification({
        type: 'success',
        title: 'Worker Dispatched',
        message: `${agentType.toUpperCase()} worker launched in background.`,
      });
      setIsModalOpen(false);
      setInstruction('');
      fetchAgents();
      refreshData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Dispatch Failed',
        message: err.message,
      });
    } finally {
      setIsDispatching(false);
    }
  };

  const coreWorkers = [
    {
      name: 'OpenCode Assistant',
      type: 'coding',
      icon: Code,
      desc: 'Local AST code editing, test running, and repository refactoring.',
      status: 'Ready',
      color: 'emerald',
    },
    {
      name: 'Agent-Browser',
      type: 'browser',
      icon: Globe,
      desc: 'Playwright headless/headful web navigation, form fill, and screenshot extraction.',
      status: 'Ready',
      color: 'cyan',
    },
    {
      name: 'GPT-Researcher',
      type: 'research',
      icon: Search,
      desc: 'Multi-source web evidence gathering, citation cross-checking, and synthesis.',
      status: 'Ready',
      color: 'purple',
    },
    {
      name: 'Continuous Planner',
      type: 'planner',
      icon: Calendar,
      desc: 'Topological dependency sorting, conflict carving, and deadline monitoring.',
      status: 'Monitoring',
      color: 'amber',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            Specialized OS Workers
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Dedicated execution units for coding, browser automation, and deep research
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            onClick={fetchAgents}
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
            Dispatch Task
          </Button>
        </div>
      </div>

      {/* Core Worker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreWorkers.map((w) => {
          const Icon = w.icon;
          return (
            <GlassCard key={w.name} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-os-secondary">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <Badge variant={w.status === 'Monitoring' ? 'cyan' : 'emerald'} size="sm">
                  {w.status}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-os-primary">{w.name}</h3>
                <p className="text-[11px] text-os-secondary mt-1 leading-snug">{w.desc}</p>
              </div>

              <div className="pt-2 border-t border-os-border/40">
                <button
                  onClick={() => {
                    setAgentType(w.type as any);
                    setIsModalOpen(true);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                >
                  <span>Dispatch worker</span>
                  <span>→</span>
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Execution Run History */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Recent Worker Runs</span>
        </div>

        <GlassCard className="p-4 space-y-2">
          {runs.length === 0 ? (
            <div className="py-8 text-center text-xs text-os-muted">
              No recent worker tasks recorded. Use "Dispatch Task" or direct OS in chat.
            </div>
          ) : (
            runs.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-glass-sm bg-white/5 hover:bg-white/10 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="cyan" size="sm">
                    {r.agent_type.toUpperCase()}
                  </Badge>
                  <span className="font-medium text-os-primary">{r.instruction}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <Badge
                    variant={
                      r.status === 'completed'
                        ? 'emerald'
                        : r.status === 'running'
                        ? 'amber'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {r.status}
                  </Badge>
                  {r.created_at && (
                    <span className="text-os-muted">
                      {new Date(r.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </GlassCard>
      </section>

      {/* Dispatch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dispatch Autonomous Worker"
        subtitle="Worker will execute in the background with policy bounds."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-os-secondary mb-1 uppercase font-mono text-[10px]">
              Worker Type
            </label>
            <select
              value={agentType}
              onChange={(e) => setAgentType(e.target.value as any)}
              className="w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"
            >
              <option value="research">GPT-Researcher (Web & Evidence)</option>
              <option value="browser">Agent-Browser (Playwright Web Automation)</option>
              <option value="coding">OpenCode (Code Writer / Editor)</option>
            </select>
          </div>

          <div>
            <label className="block text-os-secondary mb-1 uppercase font-mono text-[10px]">
              Instruction / Objective
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Research the latest benchmarks for reasoning models..."
              rows={4}
              className="w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-os-border">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDispatch}
              isLoading={isDispatching}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Dispatch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
