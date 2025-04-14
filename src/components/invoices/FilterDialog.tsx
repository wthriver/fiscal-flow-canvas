
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (status: string | null) => void;
  currentFilter: string | null;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  onApplyFilter,
  currentFilter
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(currentFilter);
  
  const handleApply = () => {
    onApplyFilter(selectedStatus);
  };
  
  const handleClear = () => {
    setSelectedStatus(null);
    onApplyFilter(null);
  };
  
  // Reset the selected status when the dialog opens to match the current filter
  React.useEffect(() => {
    if (open) {
      setSelectedStatus(currentFilter);
    }
  }, [open, currentFilter]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Invoices</DialogTitle>
          <DialogDescription>
            Filter invoices by status to narrow down your results.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedStatus || ""} onValueChange={setSelectedStatus}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Paid" id="paid" />
              <Label htmlFor="paid">Paid</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Pending" id="pending" />
              <Label htmlFor="pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Outstanding" id="outstanding" />
              <Label htmlFor="outstanding">Outstanding</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Overdue" id="overdue" />
              <Label htmlFor="overdue">Overdue</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear Filter
          </Button>
          <Button onClick={handleApply}>Apply Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
