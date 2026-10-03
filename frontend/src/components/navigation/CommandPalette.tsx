import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Calendar,
  CheckSquare,
  ShieldAlert,
  Bot,
  Clock,
  Link2,
  Brain,
  PlusCircle,
  RefreshCw,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavView } from '../../types/ui';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Ask OS';
  icon: React.ComponentType<{ className?: string }>;
  view?: NavView;
  action?: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    refreshData,
    addNotification,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const commands: CommandItem[] = [
    // Ask OS quick prompts
    {
      id: 'ask-plan',
      title: 'Ask OS: "Plan my day and resolve conflicts"',
      category: 'Ask OS',
      icon: Sparkles,
      view: 'chat',
    },
    {
      id: 'ask-matters',
      title: 'Ask OS: "What matters right now and what is blocked?"',
      category: 'Ask OS',
      icon: Sparkles,
      view: 'chat',
    },
    {
      id: 'ask-research',
      title: 'Ask OS: "Research recent AI agent breakthroughs"',
      category: 'Ask OS',
      icon: Sparkles,
      view: 'chat',
    },
    // Navigation
    { id: 'nav-home', title: 'Go to Overview ("What matters now")', category: 'Navigation', icon: ArrowRight, view: 'home' },
    { id: 'nav-chat', title: 'Open Ask OS Canvas', category: 'Navigation', icon: Sparkles, view: 'chat' },
    { id: 'nav-plan', title: 'Open Day Plan & Schedule', category: 'Navigation', icon: Calendar, view: 'plan' },
    { id: 'nav-tasks', title: 'View Commitments & Tasks', category: 'Navigation', icon: CheckSquare, view: 'tasks' },
    { id: 'nav-approvals', title: 'Review Safety Approvals', category: 'Navigation', icon: ShieldAlert, view: 'approvals' },
    { id: 'nav-agents', title: 'Inspect Specialized Workers', category: 'Navigation', icon: Bot, view: 'agents' },
    { id: 'nav-activity', title: 'Audit Evidence & Activity', category: 'Navigation', icon: Clock, view: 'activity' },
    { id: 'nav-connectors', title: 'Manage Connectors & Integrations', category: 'Navigation', icon: Link2, view: 'connectors' },
    { id: 'nav-memory', title: 'Explore OS Memory & Knowledge', category: 'Navigation', icon: Brain, view: 'memory' },
    // Actions
    {
      id: 'act-refresh',
      title: 'Refresh All Data & Statuses',
      category: 'Actions',
      icon: RefreshCw,
      action: async () => {
        await refreshData();
        addNotification({ type: 'success', title: 'System Synced', message: 'All operational data refreshed.' });
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: CommandItem) => {
    setIsCommandPaletteOpen(false);
    if (cmd.action) {
      cmd.action();
    } else if (cmd.view) {
      setCurrentView(cmd.view);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl z-10 glass-panel rounded-glass-xl border border-os-border-glass shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-os-border bg-white/5">
          <Search className="w-5 h-5 text-os-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search tasks, or ask OS..."
            className="w-full bg-transparent text-sm text-os-primary placeholder:text-os-muted focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-os-muted hover:text-os-primary rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-os-muted">
              No matching commands or actions found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-glass-md text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? 'text-emerald-400' : 'text-os-muted'
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-os-muted px-2 py-0.5 rounded bg-white/5">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-t border-os-border text-[11px] text-os-muted font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>OS Command Center</span>
        </div>
      </div>
    </div>
  );
};
