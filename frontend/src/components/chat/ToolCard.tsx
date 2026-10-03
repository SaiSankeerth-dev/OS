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
  Terminal,
  ExternalLink,
  Pause,
  Play,
  Square,
  Shield,
  FileText,
} from 'lucide-react';
import { ToolExecutionStep } from '../../types/ui';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ToolCardProps {
  step: ToolExecutionStep;
}

export const ToolCard: React.FC<ToolCardProps> = ({ step }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [hasTakenControl, setHasTakenControl] = useState(false);

  const toolLower = (step.tool || '').toLowerCase();
  const isBrowser = toolLower.includes('browser') || toolLower.includes('web');
  const isResearch = toolLower.includes('research') || toolLower.includes('search');
  const isComputer = toolLower.includes('computer') || toolLower.includes('terminal') || toolLower.includes('bash');
  const isCode = toolLower.includes('code') || toolLower.includes('python');

  const getToolIcon = () => {
    if (isBrowser) return Globe;
    if (isResearch) return Search;
    if (isComputer) return Terminal;
    if (isCode) return Code;
    if (toolLower.includes('calendar')) return Calendar;
    if (toolLower.includes('email') || toolLower.includes('gmail')) return Mail;
    return Layers;
  };

  const Icon = getToolIcon();

  const getStatusBadge = () => {
    if (isStopped) {
      return (
        <Badge variant="danger" size="sm">
          Stopped
        </Badge>
      );
    }
    if (isPaused) {
      return (
        <Badge variant="amber" size="sm">
          Paused
        </Badge>
      );
    }

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
            Executing
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

  // Extract URL or target if browser
  const targetUrl =
    (step.input && (step.input.url || step.input.target_url)) ||
    (typeof step.input === 'string' && step.input.includes('http') ? step.input : 'https://github.com');

  return (
    <div className="rounded-glass-md border border-os-border bg-os-surface/60 backdrop-blur-md overflow-hidden my-2.5 transition-all">
      {/* Top Header */}
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
            {isBrowser && (
              <span className="hidden sm:inline text-[11px] text-os-muted ml-2 font-mono truncate max-w-xs">
                {targetUrl}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button className="text-os-muted hover:text-os-primary p-0.5">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Inline Interactive Viewport for Browser */}
      {isBrowser && (
        <div className="p-3 border-t border-os-border/50 bg-black/30 space-y-2.5">
          {/* Browser Address Bar */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-glass-sm bg-black/40 border border-white/5 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="text-os-secondary truncate">{targetUrl}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Step 3 / 5
              </span>
            </div>
          </div>

          {/* Browser Live View / Canvas Mockup */}
          <div className="relative rounded-glass-sm border border-white/10 bg-os-bg/80 p-4 min-h-[90px] flex flex-col justify-center items-center text-center">
            {hasTakenControl ? (
              <div className="space-y-1.5 animate-in fade-in">
                <Badge variant="amber" size="sm">
                  Manual Takeover Active
                </Badge>
                <p className="text-xs text-os-secondary">
                  You are directly controlling the Chromium session. OS will resume when returned.
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-xs text-os-secondary">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Navigating DOM · Extracting content</span>
                </div>
                <p className="text-os-muted text-[11px]">
                  Agent-Browser is executing in isolated Playwright context.
                </p>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={() => setHasTakenControl(!hasTakenControl)}
                leftIcon={<ExternalLink className="w-3 h-3 text-cyan-400" />}
              >
                {hasTakenControl ? 'Return to OS' : 'Take Control'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                leftIcon={
                  isPaused ? (
                    <Play className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Pause className="w-3 h-3 text-amber-400" />
                  )
                }
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsStopped(true)}
              leftIcon={<Square className="w-3 h-3" />}
            >
              Stop
            </Button>
          </div>
        </div>
      )}

      {/* Inline Interactive Sandbox for Computer */}
      {isComputer && (
        <div className="p-3 border-t border-os-border/50 bg-black/40 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] text-os-muted pb-1 border-b border-white/5">
            <span>Isolated Sandbox: /workspace</span>
            <span className="text-emerald-400">● Docker Container</span>
          </div>
          <div className="p-2.5 rounded bg-black/60 border border-white/5 text-[11px] text-emerald-300">
            <code>$ {step.input ? JSON.stringify(step.input) : 'python -m pytest'}</code>
          </div>
        </div>
      )}

      {/* Expandable Details Drawer */}
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
                Execution Result
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
