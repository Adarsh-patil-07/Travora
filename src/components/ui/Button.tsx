import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'aria-label'?: string;
}

const variantStyles = {
  primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent',
  secondary: 'bg-white text-text border border-border hover:bg-primary focus:ring-border',
  ghost: 'bg-transparent text-text hover:bg-primary focus:ring-border',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-full font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={props['aria-label']}
    >
      {children}
    </motion.button>
  );
}
