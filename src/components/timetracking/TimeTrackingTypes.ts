
import { TimeEntry, Project } from '@/types/company';

export type { TimeEntry, Project };

export interface TimeEntryFormData {
  projectId: string;
  employeeId: string;
  date: string;
  hours: number;
  description: string;
  billable?: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  trackedHours: number;
  billableHours: number;
}
