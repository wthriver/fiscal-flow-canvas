
import React from "react";
import { Calendar, Filter, Download } from "lucide-react";

export const DateRangeButton: React.FC<{ type: string }> = ({ type }) => (
  <>
    <Calendar className="mr-2 h-4 w-4" />
    Date Range
  </>
);

export const FilterButton: React.FC<{ type: string }> = ({ type }) => (
  <>
    <Filter className="mr-2 h-4 w-4" />
    Filter
  </>
);

export const ExportButton: React.FC<{ type: string }> = ({ type }) => (
  <>
    <Download className="mr-2 h-4 w-4" />
    Export
  </>
);
