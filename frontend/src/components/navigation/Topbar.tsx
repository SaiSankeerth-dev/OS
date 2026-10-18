import React from 'react';
import {
  Search,
  Mic,
  MicOff,
  Sun,
  Moon,
  ShieldAlert,
  Cpu,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../context/VoiceContext';
import { AmbientOrb } from '../orb/AmbientOrb';
import { api, getModelType } from '../../services/api';

export const Topbar: React.FC = () => {
  const {
    currentView,
    me,
    theme,
    toggleTheme,
    orbState,
    pendingApprovalsCount,
    activeAgentsCount,
    setCurrentView,
    setIsCommandPaletteOpen,
    refreshData,
  } = useApp();

  const { isVoiceActive, toggleVoice } = useVoice();

  // Dynamic Ollama Model State
  const [models, setModels] = React.useState<Array<{ name: string; size_gb?: any; model_type?: string; type?: string }>>([]);
  const [selectedModel, setSelectedModel] = React.useState<string>(me?.model || '');
  const [isRefreshingModels, setIsRefreshingModels] = React.useState(false);
  const [isDaemonOnline, setIsDaemonOnline] = React.useState(false);

  const loadModels = React.useCallback(async (refresh = false) => {
    try {
      if (refresh) setIsRefreshingModels(true);
      const data = await api.getOllamaModels(refresh);
      if (data?.installed_models?.length) {
        setModels(data.installed_models);
      }
      if (data?.active_model) {
        setSelectedModel(data.active_model);
      }
      setIsDaemonOnline(Boolean(data?.daemon_online));
    } catch {
      // Fallback silently
    } finally {
      setIsRefreshingModels(false);
    }
  }, []);

  React.useEffect(() => {
    loadModels();
  }, [loadModels]);

  React.useEffect(() => {
    if (me?.model && !selectedModel) {
      setSelectedModel(me.model);
    }
  }, [me?.model, selectedModel]);

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    try {
      await api.selectOllamaModel(newModel);
      await refreshData();
    } catch (err) {
      console.error('Failed to select model', err);
    }
  };

  const handleRefreshClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await loadModels(true);
    await refreshData();
  };

  const getViewBreadcrumb = () => {
    switch (currentView) {
      case 'home':
      case 'overview':
        return 'Overview';
      case 'chat':
        return 'Ask OS';
      case 'discovery':
        return 'Discovery / Skills & Templates';
      case 'tasks':
      case 'plan':
        return 'Tasks';
      case 'computer':
        return 'Computer';
      case 'connections':
      case 'connectors':
        return 'Connections';
      case 'activity':
      case 'approvals':
        return 'Activity';
      case 'settings':
      case 'memory':
      case 'agents':
        return 'Settings';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-os-border bg-os-bg/85 backdrop-blur-xl px-4 md:px-5 flex items-center justify-between">
      {/* Left: Window Dots + Branding & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Apple macOS Window Control Dots */}
        <div className="flex items-center gap-1.5 mr-1" aria-hidden="true">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/15 shadow-sm transition-transform hover:scale-110" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/15 shadow-sm transition-transform hover:scale-110" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/15 shadow-sm transition-transform hover:scale-110" />
        </div>

        <div
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          onClick={() => setCurrentView('home')}
        >
          <img
            src="/static/logo.png"
            alt="OS Logo"
            className="w-7 h-7 rounded-full object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.35)] transition-transform duration-200 group-hover:scale-105"
          />
          <AmbientOrb state={orbState} size={24} />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-os-primary group-hover:text-indigo-400 transition-colors">
              OS
            </span>
            <span className="text-os-muted text-xs">/</span>
            <span className="text-xs font-semibold text-os-secondary">
              {getViewBreadcrumb()}
            </span>
          </div>
        </div>

        {/* Dynamic Interactive Ollama Model Selector */}
        <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-os-border/60 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isDaemonOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : me?.model_ok ? 'bg-emerald-500' : 'bg-cyan-500'
            }`}
            title={isDaemonOnline ? 'Ollama daemon online (live local inference)' : 'Local model active (deterministic fallback)'}
            aria-hidden="true"
          />
          <Sparkles className="w-3 h-3 text-indigo-500 dark:text-cyan-400 shrink-0" aria-hidden="true" />
          <div className="relative flex items-center">
            <select
              value={selectedModel}
              onChange={handleModelChange}
              title="Switch Ollama model dynamically"
              className="bg-transparent hover:bg-white/5 dark:hover:bg-white/5 border border-os-border/50 hover:border-os-border rounded px-2 py-0.5 text-[11px] font-semibold text-os-primary cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 max-w-[220px] truncate"
            >
              {models.length > 0 ? (
                models.map((m) => {
                  const mType = getModelType(m.name, m.model_type || m.type);
                  return (
                    <option key={m.name} value={m.name} className="bg-slate-900 text-white font-mono">
                      {m.name} ({mType}) {m.size_gb ? `• ${m.size_gb} GB` : ''}
                    </option>
                  );
                })
              ) : (
                <option value={selectedModel || 'deepseek-r1:32b'} className="bg-slate-900 text-white font-mono">
                  {selectedModel || 'deepseek-r1:32b'} ({getModelType(selectedModel || 'deepseek-r1:32b')})
                </option>
              )}
            </select>
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshingModels}
              title="Rescan Ollama models"
              className="ml-1 p-1 rounded hover:bg-white/10 text-os-muted hover:text-os-primary transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3 h-3 ${isRefreshingModels ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>


      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-os-secondary text-xs transition-all duration-150 group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-os-muted group-hover:text-os-primary transition-colors" />
            <span>Search or ask OS...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-[10px] font-mono text-os-muted">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Indicators & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Approvals Quick Pill */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setCurrentView('approvals')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono transition-colors"
            title={`${pendingApprovalsCount} action approvals waiting`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="font-semibold">{pendingApprovalsCount}</span>
            <span className="hidden md:inline text-[11px]">waiting</span>
          </button>
        )}

        {/* Active Background Agents */}
        {activeAgentsCount > 0 && (
          <button
            onClick={() => setCurrentView('agents')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-colors"
            title={`${activeAgentsCount} background agents running`}
          >
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{activeAgentsCount} running</span>
          </button>
        )}

        {/* Voice Talk Toggle */}
        <button
          onClick={toggleVoice}
          className={`btn-press p-2 rounded-glass-md border transition-all ${
            isVoiceActive
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glass-glow'
              : 'bg-white/5 hover:bg-white/10 text-os-secondary hover:text-os-primary border-os-border'
          }`}
          title={isVoiceActive ? 'Voice active (click to stop)' : 'Activate Voice Talk'}
        >
          {isVoiceActive ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-press p-2 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border text-os-secondary hover:text-os-primary transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-os-border">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black select-none shadow-sm">
            {me?.name ? me.name.charAt(0).toUpperCase() : 'S'}
          </div>
        </div>
      </div>
    </header>
  );
};
