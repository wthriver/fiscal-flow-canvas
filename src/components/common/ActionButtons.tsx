
import React from "react";
import { Calendar, Filter, Download, Eye, MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export const ViewButton: React.FC<{ id: string; type: string }> = ({ id, type }) => (
  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
    <Eye className="h-4 w-4" />
  </Button>
);

export const ActionDropdown: React.FC<{ id: string; type: string }> = ({ id, type }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Edit className="mr-2 h-4 w-4" />
        Edit {type}
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Copy className="mr-2 h-4 w-4" />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
