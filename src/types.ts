export type Grade = 'all' | 'g9' | 'g10' | 'g11' | 'g12';

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  grade: Grade;
  content: string;
  color?: string; // background color class e.g., 'bg-white'
}

export type ViewMode = '1week' | 'scroll';
export type UserRole = 'adv' | 'pdl';
