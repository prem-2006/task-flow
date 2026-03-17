'use client';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--surface)] dark:bg-[var(--surface)]
        border border-[var(--border)]
        rounded-2xl
        ${padding ? 'p-5' : ''}
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-[var(--text-primary)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
