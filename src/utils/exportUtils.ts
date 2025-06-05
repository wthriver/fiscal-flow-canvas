
import { toast } from "sonner";

export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  try {
    if (!data.length) {
      toast.error("No data to export");
      return;
    }

    const csvHeaders = headers || Object.keys(data[0]);
    const csvContent = [
      csvHeaders.join(','),
      ...data.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filename} exported successfully`);
  } catch (error) {
    toast.error("Failed to export data");
    console.error('Export error:', error);
  }
};

export const exportToPDF = (data: any[], filename: string) => {
  // For now, we'll export as text format
  // In a real app, you'd use a library like jsPDF
  try {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filename} exported successfully`);
  } catch (error) {
    toast.error("Failed to export data");
    console.error('Export error:', error);
  }
};

export const exportToExcel = (data: any[], filename: string) => {
  // For Excel export, we'll use CSV format which Excel can open
  exportToCSV(data, filename);
};
