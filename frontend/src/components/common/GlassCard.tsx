import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  glow?: 'emerald' | 'cyan' | 'amber' | 'danger' | 'none';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  glow = 'none',
  className = '',
  ...props
}) => {
  const glowStyles = {
    none: '',
    emerald: 'shadow-glass-glow border-emerald-500/30',
    cyan: 'shadow-glass-glow-cyan border-cyan-500/30',
    amber: 'shadow-glass-glow-amber border-amber-500/30',
    danger: 'shadow-glass-glow-danger border-rose-500/30',
  }[glow];

  return (
    <div
      className={`glass-panel rounded-glass-lg p-5 transition-all duration-200 ${
        interactive ? 'glass-card-interactive cursor-pointer hover:border-os-border-glass' : ''
      } ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
