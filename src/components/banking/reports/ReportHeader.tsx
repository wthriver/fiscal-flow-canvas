
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ReportHeaderProps {
  title: string;
  description: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onDateRangeClick: () => void;
  onPrint: () => void;
  onDownloadCSV: () => void;
  onExportPDF: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  title,
  description,
  dateRange,
  onDateRangeClick,
  onPrint,
  onDownloadCSV,
  onExportPDF
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap justify-between items-center gap-2 pb-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={onDateRangeClick}
        >
          <Calendar className="h-4 w-4" />
          <span>
            {dateRange.from || dateRange.to ? (
              <>
                {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Any"} - {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Any"}
              </>
            ) : (
              "Date Range"
            )}
          </span>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onPrint}
          >
            Print
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onDownloadCSV}
          >
            <span>Export CSV</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onExportPDF}
          >
            <span>Export PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
