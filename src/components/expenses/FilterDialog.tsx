
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterCriteria = {
  dateRange?: string;
  status?: string[];
  category?: string[];
  vendor?: string[];
  minAmount?: string;
  maxAmount?: string;
};

export interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter?: (filters: FilterCriteria) => void;
  currentFilter?: FilterCriteria;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({ 
  open, 
  onOpenChange,
  onApplyFilter = () => {}, // Default empty function if not provided
  currentFilter = {} // Default empty object if not provided
}) => {
  const [dateRange, setDateRange] = useState<string>(currentFilter.dateRange || "all");
  const [status, setStatus] = useState<string[]>(currentFilter.status || []);
  const [category, setCategory] = useState<string[]>(currentFilter.category || []);
  const [vendor, setVendor] = useState<string[]>(currentFilter.vendor || []);
  const [minAmount, setMinAmount] = useState<string>(currentFilter.minAmount || "");
  const [maxAmount, setMaxAmount] = useState<string>(currentFilter.maxAmount || "");

  const handleApply = () => {
    const filters: FilterCriteria = {
      dateRange,
      status: status.length > 0 ? status : undefined,
      category: category.length > 0 ? category : undefined,
      vendor: vendor.length > 0 ? vendor : undefined,
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined
    };
    
    onApplyFilter(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDateRange("all");
    setStatus([]);
    setCategory([]);
    setVendor([]);
    setMinAmount("");
    setMaxAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Expenses</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Date Range</Label>
            <RadioGroup value={dateRange} onValueChange={setDateRange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="thisMonth" id="thisMonth" />
                <Label htmlFor="thisMonth">This Month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lastMonth" id="lastMonth" />
                <Label htmlFor="lastMonth">Last Month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="thisQuarter" id="thisQuarter" />
                <Label htmlFor="thisQuarter">This Quarter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="thisYear" id="thisYear" />
                <Label htmlFor="thisYear">This Year</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Range</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="statusPaid" 
                  checked={status.includes("Paid")}
                  onCheckedChange={(checked) => {
                    setStatus(checked 
                      ? [...status, "Paid"] 
                      : status.filter(s => s !== "Paid")
                    );
                  }}
                />
                <Label htmlFor="statusPaid">Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="statusPending" 
                  checked={status.includes("Pending")}
                  onCheckedChange={(checked) => {
                    setStatus(checked 
                      ? [...status, "Pending"] 
                      : status.filter(s => s !== "Pending")
                    );
                  }}
                />
                <Label htmlFor="statusPending">Pending</Label>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={category[0] || ""}
              onValueChange={(value) => setCategory([value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Meals">Meals</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Professional Services">Professional Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Vendor</Label>
            <Select
              value={vendor[0] || ""}
              onValueChange={(value) => setVendor([value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Office Supply Co">Office Supply Co</SelectItem>
                <SelectItem value="Rent LLC">Rent LLC</SelectItem>
                <SelectItem value="Internet Provider">Internet Provider</SelectItem>
                <SelectItem value="Travel Agency">Travel Agency</SelectItem>
                <SelectItem value="Software Inc">Software Inc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="minAmount">Min. Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  id="minAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxAmount">Max. Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  id="maxAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
          <Button type="submit" onClick={handleApply}>Apply Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
