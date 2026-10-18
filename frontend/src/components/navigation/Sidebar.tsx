import React from 'react';
import {
  Home,
  Sparkles,
  Calendar,
  CheckSquare,
  ShieldAlert,
  Bot,
  Clock,
  Link2,
  Brain,
  Cpu,
  Monitor,
  Sliders,
  Compass,
} from 'lucide-react';
import { NavView } from '../../types/ui';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeVariant?: 'amber' | 'cyan' | 'emerald';
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, pendingApprovalsCount, activeAgentsCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'chat', label: 'Ask OS', icon: Sparkles },
    { id: 'discovery', label: 'Discovery', icon: Compass },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'computer', label: 'Computer', icon: Monitor, badgeVariant: 'emerald' },
    { id: 'connections', label: 'Connections', icon: Link2 },
    {
      id: 'activity',
      label: 'Activity',
      icon: ShieldAlert,
      badgeCount: pendingApprovalsCount,
      badgeVariant: 'amber',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Sliders,
      badgeCount: activeAgentsCount,
      badgeVariant: 'cyan',
    },
  ];

  const isItemActive = (id: NavView) => {
    if (id === 'overview' && (currentView === 'home' || currentView === 'overview')) return true;
    if (id === 'chat' && currentView === 'chat') return true;
    if (id === 'discovery' && currentView === 'discovery') return true;
    if (id === 'tasks' && (currentView === 'tasks' || currentView === 'plan')) return true;
    if (id === 'computer' && currentView === 'computer') return true;
    if (id === 'connections' && (currentView === 'connections' || currentView === 'connectors')) return true;
    if (id === 'activity' && (currentView === 'activity' || currentView === 'approvals')) return true;
    if (id === 'settings' && (currentView === 'settings' || currentView === 'memory' || currentView === 'agents')) return true;
    return currentView === id;
  };

  return (
    <aside className="w-16 md:w-52 border-r border-os-border bg-os-bg/55 backdrop-blur-md flex flex-col justify-between p-3 select-none flex-shrink-0">
      {/* Top Section: Brand + Nav */}
      <div className="space-y-3">
        {/* Sidebar Header Brand (as seen in Master Reference) */}
        <div className="px-2 pt-1 pb-3 hidden md:flex items-center gap-2.5 border-b border-os-border/40">
          <img
            src="/static/logo.png"
            alt="OS Logo"
            className="w-6 h-6 rounded-full object-contain filter drop-shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-os-primary leading-none">
              OS
            </span>
            <span className="text-[10px] text-os-secondary leading-tight mt-0.5 font-medium">
              Your AI Computer
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-500/12 text-blue-700 dark:text-blue-300 border border-blue-500/25 shadow-sm shadow-blue-500/10'
                  : 'text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-300' : 'text-os-muted group-hover:text-os-primary'
                }`}
              />
              <span className="hidden md:inline truncate">{item.label}</span>

              {/* Badges */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={`hidden md:inline-flex ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    item.badgeVariant === 'amber'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : item.badgeVariant === 'cyan'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      </div>

      {/* Bottom Footer Details */}
      <div className="pt-4 border-t border-os-border/50 hidden md:block px-3">
        <div className="flex items-center justify-between text-[11px] text-os-muted font-mono">
          <span>OS Core v2.0</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        </div>
        <p className="text-[10px] text-os-muted/80 mt-1 leading-tight">
          Safe execution boundary active.
        </p>
      </div>
    </aside>
  );
};
