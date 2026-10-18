import React, { useState, useEffect } from 'react';
import {
  Brain,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  Calendar,
  Lock,
  Bot,
  Globe,
  Code,
  Layers,
  ShieldCheck,
  Cpu,
  Plus,
  Send,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { MemoryItem, AgentRun } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

interface SettingsViewProps {
  initialTab?: 'memory' | 'workers' | 'policy';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab = 'memory' }) => {
  const { me, addNotification, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<'memory' | 'workers' | 'policy'>(initialTab);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dispatch worker modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentType, setAgentType] = useState<'coding' | 'browser' | 'research'>('research');
  const [instruction, setInstruction] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [mRes, aRes] = await Promise.allSettled([
        api.getMemory(),
        api.getAgents(),
      ]);

      if (mRes.status === 'fulfilled') {
        setMemories(mRes.value.memories || []);
      }
      if (aRes.status === 'fulfilled') {
        setRuns(aRes.value.agent_runs || []);
      }
    } catch (err) {
      console.error('Failed to load settings data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForget = async (key: string) => {
    try {
      await api.forgetMemory(key);
      addNotification({
        type: 'info',
        title: 'Memory Cleared',
        message: `OS has forgotten: "${key}"`,
      });
      fetchData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  const handleDispatch = async () => {
    if (!instruction.trim()) return;
    setIsDispatching(true);
    try {
      await api.dispatchAgent(agentType, instruction.trim());
      addNotification({
        type: 'success',
        title: 'Worker Dispatched',
        message: `${agentType.toUpperCase()} specialist launched in background.`,
      });
      setIsModalOpen(false);
      setInstruction('');
      fetchData();
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

  const filteredMemories = memories.filter((m) => {
    const k = (m.key || '').toLowerCase();
    const v = (typeof m.value === 'string' ? m.value : JSON.stringify(m.value || '')).toLowerCase();
    const t = (m.type || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return k.includes(q) || v.includes(q) || t.includes(q);
  });

  const coreWorkers = [
    {
      name: 'OpenCode Specialist',
      type: 'coding',
      icon: Code,
      desc: 'AST code editing, test running, refactoring, and deterministic diagnostics.',
      color: 'emerald',
    },
    {
      name: 'Agent-Browser Viewport',
      type: 'browser',
      icon: Globe,
      desc: 'Playwright headless/headful navigation, DOM inspection, and screencast frames.',
      color: 'cyan',
    },
    {
      name: 'GPT-Researcher Synthesis',
      type: 'research',
      icon: Search,
      desc: 'Deep multi-source web evidence gathering, citation cross-checking, and markdown report.',
      color: 'purple',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-5 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            Settings, Memory & Workers
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Manage long-term memory, specialist worker dispatch, local model routing, and safety policies
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

          {activeTab === 'workers' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Dispatch Worker
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-os-border select-none">
        <button
          onClick={() => setActiveTab('memory')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'memory'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Memory & World Knowledge ({memories.length})
        </button>
        <button
          onClick={() => setActiveTab('workers')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'workers'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Workers & Specialists ({runs.length})
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'policy'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Model Routing & Security
        </button>
      </div>

      {/* Tab 1: Memory */}
      {activeTab === 'memory' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-glass-md bg-os-surface/80 border border-os-border text-xs max-w-md">
            <Search className="w-4 h-4 text-os-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search what OS remembers..."
              className="w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"
            />
          </div>

          <div className="space-y-3">
            {filteredMemories.length === 0 ? (
              <GlassCard className="p-12 text-center text-xs text-os-muted">
                No memories currently stored. As you interact with OS, relevant facts and preferences are safely remembered here.
              </GlassCard>
            ) : (
              filteredMemories.map((m) => (
                <GlassCard key={m.key} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-os-primary">{m.key}</span>
                      <Badge variant="neutral" size="sm">
                        {m.type || 'PREFERENCE'}
                      </Badge>
                    </div>
                    <p className="text-xs text-os-secondary leading-relaxed">
                      {typeof m.value === 'string' ? m.value : JSON.stringify(m.value)}
                    </p>
                    {m.updated_at && (
                      <span className="text-[10px] font-mono text-os-muted block mt-1">
                        Updated {new Date(typeof m.updated_at === 'number' ? m.updated_at * 1000 : String(m.updated_at)).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleForget(m.key)}
                    className="p-1.5 rounded-lg text-os-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                    title="Forget this memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Workers & Specialists */}
      {activeTab === 'workers' && (
        <div className="space-y-6">
          {/* Registered Specialist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreWorkers.map((w) => {
              const Icon = w.icon;
              return (
                <GlassCard key={w.type} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="emerald" size="sm">
                      READY
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-os-primary">{w.name}</h3>
                    <p className="text-xs text-os-secondary mt-1 leading-relaxed">{w.desc}</p>
                  </div>
                  <Button
                    variant="glass"
                    size="sm"
                    className="w-full text-xs justify-center"
                    onClick={() => {
                      setAgentType(w.type as any);
                      setIsModalOpen(true);
                    }}
                  >
                    Dispatch Task →
                  </Button>
                </GlassCard>
              );
            })}
          </div>

          {/* Active / Recent Runs */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-os-muted">
              Execution History & Runs
            </h3>
            {runs.length === 0 ? (
              <GlassCard className="p-8 text-center text-xs text-os-muted">
                No background specialist runs recorded yet. Click "Dispatch Worker" to launch one.
              </GlassCard>
            ) : (
              runs.map((r) => (
                <GlassCard key={r.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-os-primary">
                        {r.agent_type.toUpperCase()}
                      </span>
                      <Badge
                        variant={
                          r.status === 'completed'
                            ? 'emerald'
                            : r.status === 'running'
                            ? 'cyan'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {r.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-os-muted">
                      {r.created_at ? new Date(r.created_at).toLocaleTimeString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-os-secondary">{r.instruction}</p>
                  {r.result && (
                    <div className="p-2.5 rounded-glass-sm bg-black/40 border border-white/5 font-mono text-[11px] text-os-muted overflow-x-auto">
                      <pre>{typeof r.result === 'string' ? r.result : JSON.stringify(r.result, null, 2)}</pre>
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Security Policy & Model Routing */}
      {activeTab === 'policy' && (
        <div className="space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-os-primary">Inference Engine</h3>
                <p className="text-xs text-os-secondary">
                  Local-first model execution powered by Ollama and lightweight tool call routing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-os-border/50 text-xs">
              <div className="p-3 rounded-glass-sm bg-os-surface/80 border border-os-border space-y-1">
                <span className="text-os-muted block text-[10px] font-mono uppercase">Engine Status</span>
                <span className="font-semibold text-os-primary flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${me?.model_ok ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  {me?.model_ok ? 'Active & Responding' : 'Standby / Local Fallback'}
                </span>
              </div>

              <div className="p-3 rounded-glass-sm bg-os-surface/80 border border-os-border space-y-1">
                <span className="text-os-muted block text-[10px] font-mono uppercase">Configured Model</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {me?.model || 'Ollama (qwen2.5:3b / llama3.2)'}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-os-primary">Security & Safety Invariants</h3>
                <p className="text-xs text-os-secondary">
                  Rigid guarantees enforced on every turn
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-os-secondary pt-2 leading-relaxed">
              <div className="p-2.5 rounded-glass-sm bg-os-surface/60 border border-os-border/50">
                <span className="font-semibold text-os-primary">1. SafeExecutor Interception: </span>
                All external side effects (email sends, calendar modifications, external tool writes) are halted for explicit human approval.
              </div>
              <div className="p-2.5 rounded-glass-sm bg-os-surface/60 border border-os-border/50">
                <span className="font-semibold text-os-primary">2. SHA-256 Parameter Locking: </span>
                Tool call arguments are bound cryptographically. Any mutation between proposal and execution terminates immediately.
              </div>
              <div className="p-2.5 rounded-glass-sm bg-os-surface/60 border border-os-border/50">
                <span className="font-semibold text-os-primary">3. Encrypted Vault Persistence: </span>
                API keys, tokens, and OAuth credentials are AES-encrypted in machine-local SQLite storage with zero cloud leaks.
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Dispatch Worker Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dispatch Autonomous Specialist"
        subtitle="Executes in an isolated worker container with bounded permissions."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-os-secondary mb-1 font-mono uppercase text-[10px]">
              Specialist Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['research', 'coding', 'browser'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAgentType(type)}
                  className={`p-2.5 rounded-glass-sm border text-center transition-all ${
                    agentType === type
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'border-os-border bg-os-surface/80 text-os-secondary hover:text-os-primary'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-os-secondary mb-1 font-mono uppercase text-[10px]">
              Instruction / Objective
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Detailed instructions for the specialist..."
              rows={4}
              className="w-full rounded-glass-sm bg-os-surface/80 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-os-border">
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
              Launch Specialist
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
