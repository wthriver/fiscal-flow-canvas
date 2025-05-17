
import React from "react";

interface FilterDisplayProps {
  statusFilter: string | null;
  dateRange: {from: Date | undefined, to: Date | undefined};
  clearFilter: (type: "status" | "date" | "all") => void;
}

const FilterDisplay: React.FC<FilterDisplayProps> = ({ statusFilter, dateRange, clearFilter }) => {
  if (!statusFilter && !dateRange.from && !dateRange.to) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <span className="font-medium">Active filters:</span>
      {statusFilter && (
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
          Status: {statusFilter}
          <button 
            className="ml-1 hover:text-primary/70"
            onClick={() => clearFilter("status")}
          >
            ×
          </button>
        </span>
      )}
      {(dateRange.from || dateRange.to) && (
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
          Date: {dateRange.from?.toLocaleDateString() || 'Any'} - {dateRange.to?.toLocaleDateString() || 'Any'}
          <button 
            className="ml-1 hover:text-primary/70"
            onClick={() => clearFilter("date")}
          >
            ×
          </button>
        </span>
      )}
      <button 
        className="text-primary hover:text-primary/70 underline"
        onClick={() => clearFilter("all")}
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterDisplay;
