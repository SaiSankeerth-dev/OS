import React from 'react';
import {
  Search,
  Mic,
  MicOff,
  Sun,
  Moon,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../context/VoiceContext';
import { AmbientOrb } from '../orb/AmbientOrb';

export const Topbar: React.FC = () => {
  const {
    me,
    theme,
    toggleTheme,
    orbState,
    pendingApprovalsCount,
    activeAgentsCount,
    setCurrentView,
    setIsCommandPaletteOpen,
  } = useApp();

  const { isVoiceActive, toggleVoice } = useVoice();

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-os-border bg-os-bg/75 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between">
      {/* Left: Branding & Ambient Presence */}
      <div className="flex items-center gap-3.5">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setCurrentView('home')}
        >
          <AmbientOrb state={orbState} size={36} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-os-primary group-hover:text-emerald-400 transition-colors">
                OS
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-os-secondary">
                {me?.mode || 'Builder Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Model & Network Status Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-os-border text-xs">
          <div className="flex items-center gap-1.5 text-os-secondary">
            {me?.model_ok ? (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            )}
            <span className="font-mono text-[11px] text-os-muted">
              {me?.model || 'Ollama Connected'}
            </span>
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
            <span>Search tasks, plans, tools, or ask OS...</span>
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
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black select-none">
            {me?.name ? me.name.charAt(0).toUpperCase() : 'S'}
          </div>
        </div>
      </div>
    </header>
  );
};
