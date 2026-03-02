'use client';

import { PRIORITY_CONFIG } from '@/utils/constants';

export default function CalendarEvent({ task, onClick, variant = 'chip', className = '' }) {
  if (!task) return null;

  const config = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isDone = task.status === 'done';

  if (variant === 'chip') {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(task);
        }}
        className={`
          flex items-center gap-1.5 px-1.5 py-0.5 rounded
          text-[10px] font-medium truncate cursor-pointer transition-colors
          ${isDone ? 'opacity-50 line-through' : 'hover:opacity-80'}
          ${className}
        `}
        style={{
          backgroundColor: isDone ? 'transparent' : config.bgColor,
          color: isDone ? 'var(--text-muted)' : config.color,
          border: isDone ? '1px solid var(--border)' : '1px solid transparent',
        }}
        title={task.title}
      >
        {!isDone && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.color }}
          />
        )}
        <span className="truncate">{task.title}</span>
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(task);
        }}
        className={`
          p-2 rounded-lg cursor-pointer transition-all hover:shadow-md
          border-l-4 h-full flex flex-col justify-between
          ${isDone ? 'opacity-50 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700' : ''}
          ${className}
        `}
        style={{
          backgroundColor: isDone ? undefined : config.bgColor,
          borderLeftColor: isDone ? undefined : config.color,
        }}
      >
        <div>
          <h4 className={`text-xs font-semibold truncate ${isDone ? 'line-through text-[var(--text-muted)]' : ''}`} style={{ color: isDone ? undefined : config.color }}>
            {task.title}
          </h4>
          {task.estimatedMinutes && (
            <p className="text-[10px] opacity-80 mt-0.5" style={{ color: isDone ? undefined : config.color }}>
              {task.estimatedMinutes}m
            </p>
          )}
        </div>
        {task.projectId && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.projectId.color }} />
            <span className="text-[9px] truncate opacity-80" style={{ color: isDone ? undefined : config.color }}>{task.projectId.name}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}
