import React, { useState } from 'react';
import {
  Globe,
  Search,
  Code,
  Calendar,
  Mail,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { ToolExecutionStep } from '../../types/ui';
import { Badge } from '../common/Badge';

interface ToolCardProps {
  step: ToolExecutionStep;
}

export const ToolCard: React.FC<ToolCardProps> = ({ step }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Icon mapping for known tools
  const getToolIcon = (toolName: string) => {
    const lower = toolName.toLowerCase();
    if (lower.includes('browser') || lower.includes('web')) return Globe;
    if (lower.includes('research') || lower.includes('search')) return Search;
    if (lower.includes('code') || lower.includes('python')) return Code;
    if (lower.includes('calendar') || lower.includes('event')) return Calendar;
    if (lower.includes('email') || lower.includes('gmail')) return Mail;
    return Layers;
  };

  const Icon = getToolIcon(step.tool);

  const getStatusBadge = () => {
    switch (step.status) {
      case 'completed':
        return (
          <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
            Completed
          </Badge>
        );
      case 'running':
        return (
          <Badge variant="cyan" size="sm" icon={<Clock className="w-3 h-3 animate-spin" />}>
            Working
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="danger" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
            Failed
          </Badge>
        );
      case 'needs_approval':
        return (
          <Badge variant="amber" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
            Approval Needed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-glass-md border border-os-border bg-os-surface/50 backdrop-blur-sm overflow-hidden my-2 transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-os-secondary">
            <Icon className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-os-primary tracking-wide">
              {step.tool}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button className="text-os-muted hover:text-os-primary p-0.5">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Output / Evidence */}
      {isExpanded && (
        <div className="p-3 border-t border-os-border/60 bg-black/20 text-xs font-mono space-y-2">
          {step.input && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans">
                Input Parameters
              </div>
              <pre className="p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary">
                {typeof step.input === 'string' ? step.input : JSON.stringify(step.input, null, 2)}
              </pre>
            </div>
          )}

          {step.output && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans">
                Result & Evidence
              </div>
              <pre className="p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-emerald-300/90 max-h-48">
                {typeof step.output === 'string' ? step.output : JSON.stringify(step.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
