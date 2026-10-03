import React, { useState, useEffect } from 'react';
import {
  Link2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';
import { Connector } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const ConnectorsView: React.FC = () => {
  const { addNotification } = useApp();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  const fetchConnectors = async () => {
    setIsLoading(true);
    try {
      const res = await api.getConnectors();
      setConnectors(res.connectors || []);
    } catch (err) {
      console.error('Failed to load connectors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectors();
  }, []);

  const handleTest = async (cid: string) => {
    setTestingId(cid);
    try {
      const res = await api.testConnector(cid);
      if (res.ok) {
        addNotification({
          type: 'success',
          title: 'Connector Healthy',
          message: `${cid} passed live API verification.`,
        });
      } else {
        addNotification({
          type: 'warning',
          title: 'Connection Notice',
          message: res.status?.health_msg || 'Requires credential or permission review.',
        });
      }
      fetchConnectors();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Health Check Failed',
        message: err.message,
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            Connectors & Integrations
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Permission-gated live external adapters for email, calendar, and workplace services
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={fetchConnectors}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh All
        </Button>
      </div>

      {/* Connector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((c) => {
          const isConnected = c.state === 'connected';
          const isTesting = testingId === c.id;

          return (
            <GlassCard
              key={c.id}
              className={`p-4 space-y-3 transition-all ${
                isConnected ? 'border-emerald-500/25' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl select-none">{c.icon || '🔌'}</span>
                  <div>
                    <h3 className="text-sm font-bold text-os-primary">{c.name}</h3>
                    <span className="text-[10px] font-mono uppercase text-os-muted">
                      {c.category || 'Connector'}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    isConnected
                      ? 'emerald'
                      : c.state === 'setup_error'
                      ? 'danger'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {c.state.toUpperCase()}
                </Badge>
              </div>

              {c.health_msg && (
                <p className="text-[11px] text-os-secondary leading-snug line-clamp-2">
                  {c.health_msg}
                </p>
              )}

              <div className="pt-2 border-t border-os-border/40 flex items-center justify-between">
                <span className="text-[10px] font-mono text-os-muted">
                  {c.scopes_granted?.length || 0} permissions
                </span>

                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => handleTest(c.id)}
                  isLoading={isTesting}
                  leftIcon={<Zap className="w-3 h-3 text-emerald-400" />}
                >
                  Test Connection
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
