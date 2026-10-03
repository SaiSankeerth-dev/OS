import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Hash,
  AlertTriangle,
  Send,
  Calendar,
  Lock,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

interface ApprovalCardProps {
  approval: {
    id: string;
    aid?: string;
    connector_id?: string;
    connector_name?: string;
    action?: string;
    title?: string;
    params?: Record<string, any>;
    status?: 'pending' | 'approved' | 'rejected' | 'executing';
    risk_level?: string;
    arguments_hash?: string;
  };
  onDecided?: (status: 'approved' | 'rejected') => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ approval, onDecided }) => {
  const { refreshData, addNotification } = useApp();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'executing'>(
    approval.status || 'pending'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const risk = (approval.risk_level || 'MEDIUM').toUpperCase();
  const riskVariant =
    risk === 'HIGH' ? 'danger' : risk === 'LOW' ? 'emerald' : 'amber';

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      if (approval.aid) {
        // Connector pending action
        await api.approveAction(approval.aid);
      } else if (approval.id) {
        // Domain V1 approval
        await api.approveV1(approval.id, approval.params || {});
      }
      setStatus('approved');
      onDecided?.('approved');
      addNotification({
        type: 'success',
        title: 'Action Approved & Executed',
        message: 'The safety executor has completed and verified this action.',
      });
      refreshData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Approval Failed',
        message: err.message || 'Execution error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      if (approval.aid) {
        await api.rejectAction(approval.aid);
      } else if (approval.id) {
        await api.rejectV1(approval.id, 'User rejected in Ask OS');
      }
      setStatus('rejected');
      onDecided?.('rejected');
      addNotification({
        type: 'info',
        title: 'Action Rejected',
        message: 'The action was discarded safely without execution.',
      });
      refreshData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Rejection Failed',
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-glass-lg border border-amber-500/30 bg-os-surface/80 backdrop-blur-md p-4 my-3 shadow-glass-glow-amber">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-os-border/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-os-primary uppercase tracking-wider font-mono">
              Action Approval Required
            </h4>
            <p className="text-[11px] text-os-secondary">
              OS prepared this action and awaits your confirmation.
            </p>
          </div>
        </div>
        <Badge variant={riskVariant} size="sm">
          {risk} RISK
        </Badge>
      </div>

      {/* Action Description & Parameters */}
      <div className="py-3 space-y-2">
        <div className="text-sm font-medium text-os-primary flex items-center gap-2">
          <span className="font-semibold text-emerald-400">
            {approval.connector_name || approval.action || 'External Action'}
          </span>
          {approval.title && <span className="text-os-secondary">— {approval.title}</span>}
        </div>

        {approval.params && Object.keys(approval.params).length > 0 && (
          <div className="rounded-glass-sm bg-black/30 border border-white/5 p-3 space-y-1.5 text-xs font-mono">
            {Object.entries(approval.params).map(([k, v]) => (
              <div key={k} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <span className="text-os-muted uppercase text-[10px] tracking-wider sm:w-28 flex-shrink-0">
                  {k}:
                </span>
                <span className="text-os-secondary text-right sm:text-left flex-1 break-all">
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SHA-256 Tamper Evident Integrity Badge */}
        {approval.arguments_hash && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-os-muted pt-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="truncate">Hash: {approval.arguments_hash.substring(0, 24)}...</span>
          </div>
        )}
      </div>

      {/* Action Decision Controls */}
      <div className="pt-2 border-t border-os-border/60 flex items-center justify-between">
        {status === 'pending' ? (
          <div className="flex items-center gap-2.5 w-full justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReject}
              isLoading={isSubmitting}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Approve & Execute
            </Button>
          </div>
        ) : status === 'approved' ? (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 py-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Approved & Safely Executed</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-400 py-1">
            <XCircle className="w-4 h-4" />
            <span>Action Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
};
