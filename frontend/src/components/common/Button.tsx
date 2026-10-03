import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'danger' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-emerald-500 text-white font-medium hover:bg-emerald-400 border border-emerald-400/40 shadow-glass-glow',
    glass:
      'bg-white/5 hover:bg-white/10 text-os-primary border border-os-border hover:border-os-border-glass backdrop-blur-md',
    secondary:
      'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30',
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 shadow-glass-glow-danger',
    ghost:
      'hover:bg-white/5 text-os-secondary hover:text-os-primary border border-transparent',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-glass-sm gap-1.5',
    md: 'text-sm px-4 py-2 rounded-glass-md gap-2',
    lg: 'text-base px-5 py-2.5 rounded-glass-lg gap-2.5',
    icon: 'p-2 rounded-glass-md justify-center items-center',
  }[size];

  return (
    <button
      className={`btn-press inline-flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
