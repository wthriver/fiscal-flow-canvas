
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filter: string) => void;
  currentFilter: string;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  onApplyFilter,
  currentFilter
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(currentFilter || "all");

  // Reset the selected filter when the dialog opens to match the current filter
  React.useEffect(() => {
    if (open) {
      setSelectedFilter(currentFilter || "all");
    }
  }, [open, currentFilter]);

  const handleApply = () => {
    onApplyFilter(selectedFilter);
    onOpenChange(false);
  };

  const handleReset = () => {
    setSelectedFilter("all");
    onApplyFilter("all");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Expenses</DialogTitle>
          <DialogDescription>
            Select a filter to apply to your expenses list.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col space-y-4">
            <Label className="text-base">Status</Label>
            <RadioGroup value={selectedFilter} onValueChange={setSelectedFilter}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="cursor-pointer">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected" className="cursor-pointer">Rejected</Label>
              </div>
            </RadioGroup>
            
            <Label className="text-base mt-4">Category</Label>
            <RadioGroup value={selectedFilter} onValueChange={setSelectedFilter}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-cat" />
                <Label htmlFor="all-cat" className="cursor-pointer">All Categories</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="office-supplies" id="office-supplies" />
                <Label htmlFor="office-supplies" className="cursor-pointer">Office Supplies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="utilities" id="utilities" />
                <Label htmlFor="utilities" className="cursor-pointer">Utilities</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rent" id="rent" />
                <Label htmlFor="rent" className="cursor-pointer">Rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="travel" id="travel" />
                <Label htmlFor="travel" className="cursor-pointer">Travel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="software" id="software" />
                <Label htmlFor="software" className="cursor-pointer">Software</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
