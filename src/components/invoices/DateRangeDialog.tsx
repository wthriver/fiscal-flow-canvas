
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  currentDateRange: { from: Date | undefined; to: Date | undefined };
}

export const DateRangeDialog: React.FC<DateRangeDialogProps> = ({
  open,
  onOpenChange,
  onApplyDateRange,
  currentDateRange
}) => {
  const [date, setDate] = useState<DateRange | undefined>(currentDateRange);

  // Reset the date when the dialog opens to match the current range
  React.useEffect(() => {
    if (open) {
      setDate(currentDateRange);
    }
  }, [open, currentDateRange]);

  const handleApply = () => {
    onApplyDateRange(date || { from: undefined, to: undefined });
  };

  const handleClear = () => {
    const clearedRange = { from: undefined, to: undefined };
    setDate(clearedRange);
    onApplyDateRange(clearedRange);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
          <DialogDescription>
            Filter invoices by date range. Select a start and end date.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col space-y-4">
            <div>
              <Label className="block mb-2">Selected Range</Label>
              <div className="text-sm text-gray-500">
                {date?.from ? format(date.from, "PPP") : "Start date"} - {date?.to ? format(date.to, "PPP") : "End date"}
              </div>
            </div>
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className="rounded-md border pointer-events-auto"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear Range
          </Button>
          <Button onClick={handleApply}>Apply Range</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
