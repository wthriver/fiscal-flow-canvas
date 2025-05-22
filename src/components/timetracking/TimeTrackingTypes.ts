
import { Project, TimeEntry } from '@/types/company';

export type { TimeEntry, Project };

export interface TimeEntryFormData {
  projectId: string;
  employeeId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  trackedHours: number;
  billableHours: number;
}

// Add these interfaces to better support the toast functionality
export interface ToastOptions {
  description?: string;
  duration?: number;
}

// Enhance our TimeEntry to ensure it works with the calculations
export interface EnhancedTimeEntry extends TimeEntry {
  billable: boolean;
}
