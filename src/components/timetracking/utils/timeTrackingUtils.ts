
import { Project, TimeEntry } from "@/types/company";

// Convert a duration string (hh:mm) to hours as a number
export function durationStringToHours(duration: string | number): number {
  if (typeof duration === 'number') {
    return duration;
  }
  
  const [hours, minutes] = duration.split(':').map(Number);
  return hours + (minutes / 60);
}

// Convert hours as a number to a duration string (hh:mm)
export function hoursToDurationString(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m < 10 ? '0' + m : m}`;
}

// Format hours for display (e.g., "5h 30m")
export function formatHoursDisplay(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h}h ${m}m`;
}

// Format currency amount from number or string
export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string') {
    // If it already has a $ sign, return as is
    if (amount.startsWith('$')) {
      return amount;
    }
    // Try to parse the string
    const numericValue = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
    return !isNaN(numericValue) ? `$${numericValue.toFixed(2)}` : '$0.00';
  }
  
  return `$${amount.toFixed(2)}`;
}

// Parse currency string to number
export function parseCurrency(currencyString: string | number): number {
  if (typeof currencyString === 'number') {
    return currencyString;
  }
  
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, '')) || 0;
}

// Ensure project tracked and billed properties are in the expected format
export function normalizeProject(project: Project): Project {
  const trackedValue = typeof project.tracked === 'string' ? 
    project.tracked : (project.tracked?.toString() || '0');
    
  const billedValue = typeof project.billed === 'string' ? 
    project.billed : (typeof project.billed === 'number' ? formatCurrency(project.billed) : '$0.00');
    
  return {
    ...project,
    tracked: trackedValue,
    billed: billedValue
  };
}

// Ensure date string is in ISO format (YYYY-MM-DD)
export function ensureISODateString(dateInput: string | number | Date): string {
  if (typeof dateInput === 'number') {
    return new Date(dateInput).toISOString().split('T')[0];
  }
  if (dateInput instanceof Date) {
    return dateInput.toISOString().split('T')[0];
  }
  return dateInput;
}
