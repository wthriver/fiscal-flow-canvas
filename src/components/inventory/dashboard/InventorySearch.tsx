
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const InventorySearch: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search inventory..." className="pl-8" />
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Select defaultValue="all-status">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all-categories">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            <SelectItem value="widgets">Widgets</SelectItem>
            <SelectItem value="gadgets">Gadgets</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="gizmos">Gizmos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
