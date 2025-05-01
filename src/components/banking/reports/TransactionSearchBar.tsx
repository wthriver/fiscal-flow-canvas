
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search } from "lucide-react";

interface TransactionSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export const TransactionSearchBar: React.FC<TransactionSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onExportPDF,
  onExportCSV
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center mb-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs" 
          onClick={onExportPDF}
        >
          <FileText className="h-4 w-4 mr-1" /> Export PDF
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs" 
          onClick={onExportCSV}
        >
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>
    </div>
  );
};
