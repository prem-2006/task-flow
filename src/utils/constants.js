export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: '#10B981',
    bgColor: '#10B98120',
    icon: 'ArrowDown',
  },
  medium: {
    label: 'Medium',
    color: '#F59E0B',
    bgColor: '#F59E0B20',
    icon: 'Minus',
  },
  high: {
    label: 'High',
    color: '#EF4444',
    bgColor: '#EF444420',
    icon: 'ArrowUp',
  },
  urgent: {
    label: 'Urgent',
    color: '#DC2626',
    bgColor: '#DC262620',
    icon: 'AlertTriangle',
  },
};

export const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: '#94A3B8',
    bgColor: '#94A3B820',
    icon: 'Circle',
  },
  'in-progress': {
    label: 'In Progress',
    color: '#818CF8',
    bgColor: '#818CF820',
    icon: 'Clock',
  },
  done: {
    label: 'Done',
    color: '#10B981',
    bgColor: '#10B98120',
    icon: 'CheckCircle2',
  },
};

export const PROJECT_COLORS = [
  '#4F46E5', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#6366F1', // Indigo-light
];

export const PROJECT_ICONS = [
  'folder',
  'book-open',
  'code',
  'briefcase',
  'rocket',
  'star',
  'heart',
  'zap',
  'globe',
  'music',
  'camera',
  'cpu',
];
