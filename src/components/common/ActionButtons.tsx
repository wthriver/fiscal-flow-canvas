
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Pencil, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Download,
  Filter,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleViewItem, handleEditItem, handleDeleteItem, handleExport, handleFilter, handleDateRange } from "@/utils/navigationUtils";

interface ActionButtonProps {
  id: string;
  type: string;
}

export const ViewButton: React.FC<ActionButtonProps> = ({ id, type }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    onClick={() => handleViewItem(id, type)}
    className="h-8 w-8 p-0"
  >
    <Eye size={16} />
    <span className="sr-only">View</span>
  </Button>
);

export const EditButton: React.FC<ActionButtonProps> = ({ id, type }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    onClick={() => handleEditItem(id, type)}
    className="h-8 w-8 p-0"
  >
    <Pencil size={16} />
    <span className="sr-only">Edit</span>
  </Button>
);

export const DeleteButton: React.FC<ActionButtonProps> = ({ id, type }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    onClick={() => handleDeleteItem(id, type)}
    className="h-8 w-8 p-0"
  >
    <Trash2 size={16} />
    <span className="sr-only">Delete</span>
  </Button>
);

export const ActionDropdown: React.FC<ActionButtonProps> = ({ id, type }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal size={16} />
        <span className="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => handleViewItem(id, type)}>
        <Eye className="mr-2 h-4 w-4" />
        <span>View</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleEditItem(id, type)}>
        <Pencil className="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleDeleteItem(id, type)}>
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Filter, export, and date range buttons used across several pages
export const FilterButton: React.FC<{type: string}> = ({ type }) => (
  <Button 
    variant="outline" 
    size="sm" 
    className="flex items-center gap-1"
    onClick={() => handleFilter(type)}
  >
    <Filter size={16} />
    <span>Filter</span>
  </Button>
);

export const ExportButton: React.FC<{type: string}> = ({ type }) => (
  <Button 
    variant="outline" 
    size="sm" 
    className="flex items-center gap-1"
    onClick={() => handleExport(type)}
  >
    <Download size={16} />
    <span>Export</span>
  </Button>
);

export const DateRangeButton: React.FC<{type: string}> = ({ type }) => (
  <Button 
    variant="outline" 
    size="sm" 
    className="flex items-center gap-1"
    onClick={() => handleDateRange(type)}
  >
    <Calendar size={16} />
    <span>Date Range</span>
  </Button>
);
