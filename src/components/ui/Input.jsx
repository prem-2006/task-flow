'use client';

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon: Icon,
    iconRight: IconRight,
    className = '',
    containerClassName = '',
    type = 'text',
    ...props
  },
  ref
) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 text-sm rounded-xl
            bg-[var(--surface)] dark:bg-[var(--surface)]
            border border-[var(--border)]
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus-ring
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${IconRight ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {IconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <IconRight className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
