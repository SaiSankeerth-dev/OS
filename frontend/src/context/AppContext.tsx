import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NavView, OrbState } from '../types/ui';
import { MeData, Approval, PendingConnectorAction } from '../types/api';
import { api } from '../services/api';

interface NotificationToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
}

interface AppContextType {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  me: MeData | null;
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
  pendingApprovalsCount: number;
  activeAgentsCount: number;
  refreshData: () => Promise<void>;
  notifications: NotificationToast[];
  addNotification: (toast: Omit<NotificationToast, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [me, setMe] = useState<MeData | null>(null);
  const [orbState, setOrbState] = useState<OrbState>('IDLE');
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);
  const [activeAgentsCount, setActiveAgentsCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('os-theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('os-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const addNotification = useCallback((toast: Omit<NotificationToast, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: NotificationToast = { ...toast, id, timestamp: Date.now() };
    setNotifications((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Refresh counts and user profile
  const refreshData = useCallback(async () => {
    try {
      const [meRes, v1Approvals, connectorApprovals, agentsRes] = await Promise.allSettled([
        api.getMe(),
        api.getV1Approvals(),
        api.getPendingActions(),
        api.getAgents(),
      ]);

      if (meRes.status === 'fulfilled') setMe(meRes.value);

      let appCount = 0;
      if (v1Approvals.status === 'fulfilled') {
        appCount += v1Approvals.value.pending_approvals?.length || 0;
      }
      if (connectorApprovals.status === 'fulfilled') {
        appCount += connectorApprovals.value.pending?.length || 0;
      }
      setPendingApprovalsCount(appCount);

      if (agentsRes.status === 'fulfilled') {
        const running = agentsRes.value.agent_runs?.filter((r) => r.status === 'running')?.length || 0;
        setActiveAgentsCount(running);
        if (running > 0 && orbState === 'IDLE') {
          setOrbState('WORKING');
        }
      }
    } catch (err) {
      console.error('Failed to refresh app status:', err);
    }
  }, [orbState]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        setTheme,
        toggleTheme,
        me,
        orbState,
        setOrbState,
        pendingApprovalsCount,
        activeAgentsCount,
        refreshData,
        notifications,
        addNotification,
        removeNotification,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
