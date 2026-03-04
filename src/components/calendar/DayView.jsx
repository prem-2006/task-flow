'use client';

import { format, isSameDay, isToday } from 'date-fns';
import CalendarEvent from './CalendarEvent';

export default function DayView({ currentDate, tasks, onTaskClick }) {
  const isTodayDate = isToday(currentDate);
  const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), currentDate));

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-center py-6 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
        <div className="text-center">
          <span className={`text-sm font-semibold uppercase tracking-widest mb-2 block ${isTodayDate ? 'text-brand-500' : 'text-[var(--text-secondary)]'}`}>
            {format(currentDate, 'EEEE')}
          </span>
          <span className={`
            inline-flex items-center justify-center px-4 py-2 rounded-xl text-3xl font-bold
            ${isTodayDate ? 'bg-brand-500 text-white shadow-glow' : 'text-[var(--text-primary)]'}
          `}>
            {format(currentDate, 'MMMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {dayTasks.map((task) => (
            <div key={task._id} className="h-24">
              <CalendarEvent
                task={task}
                variant="block"
                onClick={onTaskClick}
                className="text-lg p-4" // Larger text/padding for day view
              />
            </div>
          ))}
          {dayTasks.length === 0 && (
            <div className="py-20 text-center text-[var(--text-muted)]">
              <p className="text-lg mb-2">No tasks due on this day.</p>
              <p className="text-sm">Enjoy your free time or get ahead on upcoming work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
