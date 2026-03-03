'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

export default function CalendarGrid({ tasks, onTaskClick, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'

  function handlePrevious() {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  }

  function handleNext() {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] w-48">
            {view === 'month' && format(currentDate, 'MMMM yyyy')}
            {view === 'week' && `Week of ${format(currentDate, 'MMM d')}`}
            {view === 'day' && format(currentDate, 'MMMM d, yyyy')}
          </h2>
          
          <div className="flex items-center gap-1 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg p-1">
            <button
              onClick={handlePrevious}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Button variant="ghost" size="sm" onClick={handleToday} className="px-3">
              Today
            </Button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg p-1 w-full sm:w-auto">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`
                flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors
                ${view === v 
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}
              `}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 min-h-0 animate-fade-in">
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={onTaskClick}
            onDateClick={(date) => {
              setCurrentDate(date);
              setView('day'); // Click day cell in month to go to day view
              onDateClick?.(date);
            }}
          />
        )}
        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={onTaskClick}
            onDateClick={(date) => {
              setCurrentDate(date);
              setView('day');
              onDateClick?.(date);
            }}
          />
        )}
        {view === 'day' && (
          <DayView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={onTaskClick}
          />
        )}
      </div>
    </div>
  );
}
