
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

interface ActionButtonProps {
  id: string;
  type: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const ViewButton: React.FC<ActionButtonProps> = ({ id, onView }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    className="h-8 w-8 p-0"
    onClick={() => onView?.(id)}
  >
    <Eye className="h-4 w-4" />
  </Button>
);

export const ActionDropdown: React.FC<ActionButtonProps> = ({ 
  id, 
  type, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-popover border shadow-md">
      <DropdownMenuItem onClick={() => onEdit?.(id)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit {type}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onDuplicate?.(id)}>
        <Copy className="mr-2 h-4 w-4" />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="text-destructive focus:text-destructive"
        onClick={() => onDelete?.(id)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
