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
  Sun,
  Moon,
  Laptop,
  Palette,
  Image as ImageIcon,
  Activity,
  Database,
  Server,
} from 'lucide-react';
import { api, getModelType, getModelTypeBadgeClass } from '../../services/api';
import { MemoryItem, AgentRun, DiagnosticsResponse } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { WallpaperGallery } from '../common/WallpaperGallery';
import { useApp } from '../../context/AppContext';

interface SettingsViewProps {
  initialTab?: 'appearance' | 'memory' | 'workers' | 'policy' | 'diagnostics';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab = 'appearance' }) => {
  const { me, addNotification, refreshData, theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState<'appearance' | 'memory' | 'workers' | 'policy' | 'diagnostics'>(initialTab);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [diagData, setDiagData] = useState<DiagnosticsResponse | null>(null);
  const [isProbingDiag, setIsProbingDiag] = useState(false);

  // Dispatch worker modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentType, setAgentType] = useState<'coding' | 'browser' | 'research'>('research');
  const [instruction, setInstruction] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Ollama Model Registry State
  const [ollamaModels, setOllamaModels] = useState<Array<{
    name: string;
    size_gb?: any;
    parameter_size?: string;
    quantization?: string;
    family?: string;
    model_type?: string;
    type?: string;
    display_name?: string;
    capabilities?: string[];
    source?: string;
  }>>([]);
  const [selectedModel, setSelectedModel] = useState<string>(me?.model || '');
  const [isRefreshingModels, setIsRefreshingModels] = useState(false);
  const [isSwitchingModel, setIsSwitchingModel] = useState(false);
  const [daemonOnline, setDaemonOnline] = useState(false);

  const fetchModels = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshingModels(true);
      const res = await api.getOllamaModels(refresh);
      if (res?.installed_models) {
        setOllamaModels(res.installed_models);
      }
      if (res?.active_model) {
        setSelectedModel(res.active_model);
      }
      setDaemonOnline(Boolean(res?.daemon_online));
    } catch (err) {
      console.error('Failed to load Ollama models:', err);
    } finally {
      setIsRefreshingModels(false);
    }
  };

  const probeDiagnostics = async () => {
    setIsProbingDiag(true);
    try {
      const data = await api.getDiagnostics();
      setDiagData(data);
    } catch (err) {
      console.error('Failed to probe diagnostics:', err);
    } finally {
      setIsProbingDiag(false);
    }
  };

  useEffect(() => {
    fetchModels();
    probeDiagnostics();
  }, [activeTab]);

  useEffect(() => {
    if (me?.model) {
      setSelectedModel(me.model);
    }
  }, [me?.model]);

  const handleSelectModel = async (modelName: string) => {
    if (!modelName) return;
    setIsSwitchingModel(true);
    try {
      await api.selectOllamaModel(modelName);
      setSelectedModel(modelName);
      await refreshData();
      addNotification({
        type: 'success',
        title: 'Model Selected',
        message: `Inference model set to ${modelName}. Active across chat and workflows.`,
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Model Switch Failed',
        message: err.message || 'Could not select model',
      });
    } finally {
      setIsSwitchingModel(false);
    }
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      probeDiagnostics();
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
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'appearance'
              ? 'border-blue-500 text-blue-500 dark:text-blue-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Appearance & Desktop
        </button>
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
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'diagnostics'
              ? 'border-indigo-400 text-indigo-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          Operational Diagnostics
        </button>
      </div>

      {/* Tab: Appearance & Desktop */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          {/* Theme Selector */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-os-primary">Interface Theme Mode</h3>
                <p className="text-xs text-os-secondary mt-0.5">
                  Select between Catppuccin Mocha Dark, Latte Light, or follow system appearance
                </p>
              </div>
              <Badge variant={theme === 'dark' ? 'cyan' : 'neutral'} size="sm">
                Active: {theme.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left ${
                  theme === 'dark'
                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-md'
                    : 'bg-os-surface/60 border-os-border/70 hover:border-os-border text-os-secondary'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-os-primary">Catppuccin Mocha (Dark)</div>
                  <div className="text-[11px] text-os-secondary mt-0.5">Deep midnight obsidian surfaces with restrained cyan/sapphire glow</div>
                </div>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left ${
                  theme === 'light'
                    ? 'bg-blue-500/10 border-blue-500 text-blue-700 shadow-md'
                    : 'bg-os-surface/60 border-os-border/70 hover:border-os-border text-os-secondary'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-os-primary">Catppuccin Latte (Light)</div>
                  <div className="text-[11px] text-os-secondary mt-0.5">Clean high-contrast Apple desktop aesthetic with crisp typography</div>
                </div>
              </button>
            </div>
          </GlassCard>

          {/* Wallpaper Gallery */}
          <GlassCard className="p-5">
            <WallpaperGallery />
          </GlassCard>

          {/* Linux Desktop & Display Specifications */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-os-primary">Virtual Linux Desktop Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-os-surface/50 border border-os-border/60">
                <div className="text-os-secondary text-[11px]">DISPLAY SERVER</div>
                <div className="font-bold text-os-primary mt-1">Xvfb :1 (X11)</div>
                <div className="text-[10px] text-os-muted mt-0.5">1280x800x24 TrueColor</div>
              </div>
              <div className="p-3 rounded-lg bg-os-surface/50 border border-os-border/60">
                <div className="text-os-secondary text-[11px]">DESKTOP ENVIRONMENT</div>
                <div className="font-bold text-os-primary mt-1">Openbox + tint2</div>
                <div className="text-[10px] text-os-muted mt-0.5">feh wallpaper backend</div>
              </div>
              <div className="p-3 rounded-lg bg-os-surface/50 border border-os-border/60">
                <div className="text-os-secondary text-[11px]">STREAMING PROTOCOL</div>
                <div className="font-bold text-os-primary mt-1">HTML5 noVNC (:6080)</div>
                <div className="text-[10px] text-os-muted mt-0.5">x11vnc RFB + Chromium CDP</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

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
            <div className="flex items-center justify-between">
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

              <button
                onClick={() => fetchModels(true)}
                disabled={isRefreshingModels}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-glass-sm bg-white/5 hover:bg-white/10 border border-os-border text-xs font-semibold text-os-primary transition-all disabled:opacity-50"
                title="Rescan Ollama daemon and local disk for models"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingModels ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isRefreshingModels ? 'Scanning...' : 'Rescan Models'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-os-border/50 text-xs">
              <div className="p-3 rounded-glass-sm bg-os-surface/80 border border-os-border space-y-1">
                <span className="text-os-muted block text-[10px] font-mono uppercase">Engine Status</span>
                <span className="font-semibold text-os-primary flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${daemonOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : me?.model_ok ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  {daemonOnline ? 'Ollama Online (Live Inference)' : me?.model_ok ? 'Active & Responding' : 'Standby / Local Fallback'}
                </span>
                <span className="text-[10px] text-os-muted block">
                  {daemonOnline ? 'Connected to http://127.0.0.1:11434' : 'Operating with local deterministic execution'}
                </span>
              </div>

              <div className="p-3 rounded-glass-sm bg-os-surface/80 border border-os-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-os-muted block text-[10px] font-mono uppercase">Configured Model</span>
                  {isSwitchingModel && <span className="text-[10px] text-emerald-400 font-mono animate-pulse">Switching...</span>}
                </div>
                <div className="relative">
                  <select
                    value={selectedModel || me?.model || ''}
                    onChange={(e) => handleSelectModel(e.target.value)}
                    disabled={isSwitchingModel}
                    title="Select model from available models"
                    className="w-full bg-os-bg/90 hover:bg-os-bg border border-os-border/70 hover:border-os-border rounded-md px-3 py-1.5 text-xs font-mono font-semibold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {ollamaModels.length > 0 ? (
                      ollamaModels.map((m) => {
                        const mType = getModelType(m.name, m.model_type || m.type);
                        return (
                          <option key={m.name} value={m.name} className="bg-slate-900 text-white font-mono">
                            {m.name} ({mType}) {m.size_gb ? `• ${m.size_gb} GB` : ''} {m.parameter_size ? `• ${m.parameter_size}` : ''}
                          </option>
                        );
                      })
                    ) : (
                      <option value={selectedModel || me?.model || 'deepseek-r1:32b'} className="bg-slate-900 text-white font-mono">
                        {selectedModel || me?.model || 'deepseek-r1:32b'} ({getModelType(selectedModel || me?.model || 'deepseek-r1:32b')})
                      </option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Available Models Grid Selection */}
            {ollamaModels.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-os-muted block text-[10px] font-mono uppercase">
                    Available Downloaded Models ({ollamaModels.length})
                  </span>
                  <span className="text-[10px] text-os-secondary">
                    Click any model below to select it
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ollamaModels.map((m) => {
                    const isActive = (selectedModel || me?.model) === m.name;
                    const mType = getModelType(m.name, m.model_type || m.type);
                    const badgeClass = getModelTypeBadgeClass(mType);
                    return (
                      <div
                        key={m.name}
                        onClick={() => handleSelectModel(m.name)}
                        className={`p-3 rounded-glass-sm border transition-all cursor-pointer flex flex-col justify-between gap-2.5 select-none ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                            : 'bg-os-surface/60 hover:bg-os-surface/90 border-os-border hover:border-os-border-glass'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-xs font-bold text-os-primary flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{m.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border shrink-0 ${badgeClass}`}>
                                ({mType})
                              </span>
                              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            </div>
                            <div className="text-[11px] text-os-secondary pt-1 font-mono flex items-center gap-1.5 flex-wrap">
                              <span>Type: <strong className="text-os-primary font-semibold">{mType}</strong></span>
                              <span>•</span>
                              <span>Size: <span className="font-semibold text-os-primary">{m.size_gb ? `${m.size_gb} GB` : 'local'}</span></span>
                              {m.parameter_size ? (
                                <>
                                  <span>•</span>
                                  <span>Params: {m.parameter_size}</span>
                                </>
                              ) : null}
                            </div>
                          </div>
                          <Badge variant={isActive ? 'emerald' : 'neutral'} className="text-[9px] shrink-0">
                            {isActive ? 'Active' : 'Select'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border ${badgeClass}`}
                          >
                            {mType}
                          </span>
                          {m.capabilities && m.capabilities.length > 0 && (
                            m.capabilities.filter(c => c.toLowerCase() !== mType.toLowerCase()).map((cap) => (
                              <span
                                key={cap}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-os-muted"
                              >
                                {cap}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

      {/* Tab: Operational Diagnostics (5-State) */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <GlassCard className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-os-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-os-primary">5-State Operational Diagnostics</h3>
                  <p className="text-xs text-os-secondary">
                    Real runtime health probes with strict non-deceptive verification badges
                  </p>
                </div>
              </div>

              <Button
                variant="glass"
                size="sm"
                onClick={probeDiagnostics}
                isLoading={isProbingDiag}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isProbingDiag ? 'animate-spin' : ''}`} />}
              >
                Re-probe Diagnostics
              </Button>
            </div>

            {/* Invariant Explanation Banner */}
            <div className="p-3 rounded-lg bg-os-surface/60 border border-os-border/50 text-xs text-os-secondary space-y-1">
              <div className="font-semibold text-os-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Gravitas Non-Deceptive Invariant</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                A green status badge is rendered <strong>strictly and exclusively</strong> when a subsystem is <span className="font-mono text-emerald-400">INDEPENDENTLY_VERIFIED</span> by an active read-back probe. Configured or reachable subsystems display neutral amber/gray badges until empirically verified.
              </p>
            </div>

            {/* Subsystems Diagnostics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {diagData?.subsystems ? (
                Object.entries(diagData.subsystems).map(([key, sub]) => {
                  const isVerifiedGreen = sub.badge_color === 'green' && sub.verified;
                  const badgeClass = isVerifiedGreen
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : sub.badge_color === 'amber' || sub.badge_color === 'yellow'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : sub.badge_color === 'red'
                    ? 'bg-red-500/15 border-red-500/30 text-red-400'
                    : 'bg-slate-500/15 border-slate-500/30 text-slate-400';

                  return (
                    <div
                      key={key}
                      className="p-4 rounded-xl bg-os-surface/80 border border-os-border space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-xs text-os-primary capitalize flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-os-border" />
                          <span>{key.replace('_', ' ')}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${badgeClass}`}>
                          {sub.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-os-muted">Operational State:</span>
                        <span className="font-semibold text-os-secondary">{sub.state}</span>
                      </div>

                      <p className="text-[11px] text-os-muted leading-relaxed font-mono bg-black/10 dark:bg-black/20 p-2 rounded border border-os-border/30">
                        {sub.evidence}
                      </p>

                      {sub.metrics && (
                        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-os-border/40 text-[10px] font-mono">
                          <div>
                            <span className="text-os-muted block">CPU</span>
                            <span className="font-bold text-os-primary">{sub.metrics.cpu_percent}% ({sub.metrics.cpu_count}c)</span>
                          </div>
                          <div>
                            <span className="text-os-muted block">RAM</span>
                            <span className="font-bold text-os-primary">{sub.metrics.memory_used_gb}/{sub.metrics.memory_total_gb} GB</span>
                          </div>
                          <div>
                            <span className="text-os-muted block">Disk</span>
                            <span className="font-bold text-os-primary">{sub.metrics.disk_percent}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center text-xs text-os-muted">
                  Loading diagnostics telemetry...
                </div>
              )}
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
