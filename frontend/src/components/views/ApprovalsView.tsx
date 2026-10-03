import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Lock,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { Approval, PendingConnectorAction } from '../../types/api';
import { ApprovalCard } from '../chat/ApprovalCard';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const ApprovalsView: React.FC = () => {
  const { refreshData } = useApp();
  const [v1Approvals, setV1Approvals] = useState<Approval[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingConnectorAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = async () => {
    setIsLoading(true);
    try {
      const [vRes, aRes] = await Promise.allSettled([
        api.getV1Approvals(),
        api.getPendingActions(),
      ]);

      if (vRes.status === 'fulfilled') {
        setV1Approvals(vRes.value.pending_approvals || []);
      }
      if (aRes.status === 'fulfilled') {
        setPendingActions(aRes.value.pending || []);
      }
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const totalCount = v1Approvals.length + pendingActions.length;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Governance & Safety
            </span>
            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
            <span className="text-xs text-os-secondary">{totalCount} pending review</span>
          </div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight mt-1">
            Safety & Action Approval Center
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Cryptographic SHA-256 tamper detection · Double-execution prevention · Expiry guards
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={fetchApprovals}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Queue
        </Button>
      </div>

      {/* Safety Summary Banner */}
      <GlassCard className="p-4 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-os-primary">OS Safe Execution Policy</h4>
            <p className="text-os-secondary leading-relaxed">
              Every external write operation (sending emails, modifying calendar events, writing to
              external APIs) is intercepted by the <code>SafeExecutor</code>. The exact arguments are
              hashed; any parameter tampering between approval and execution results in an immediate abort.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Approval Cards List */}
      <div className="space-y-4">
        {totalCount === 0 ? (
          <GlassCard className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-os-primary">Queue Clear</h3>
            <p className="text-xs text-os-secondary max-w-sm mx-auto">
              There are no pending actions requiring your authorization. OS is running in safe read-only
              mode for all external channels.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {/* Connector Pending Actions */}
            {pendingActions.map((action) => (
              <ApprovalCard
                key={action.id}
                approval={{
                  id: action.id,
                  aid: action.id,
                  connector_id: action.connector_id,
                  connector_name: action.connector_name,
                  action: action.action,
                  params: action.params,
                  status: 'pending',
                }}
                onDecided={() => {
                  fetchApprovals();
                  refreshData();
                }}
              />
            ))}

            {/* V1 Domain Engine Approvals */}
            {v1Approvals.map((app) => (
              <ApprovalCard
                key={app.approval_id}
                approval={{
                  id: app.approval_id,
                  action: app.tool_name,
                  risk_level: app.risk_level,
                  params: app.arguments,
                  arguments_hash: app.arguments_hash,
                  status: 'pending',
                }}
                onDecided={() => {
                  fetchApprovals();
                  refreshData();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
