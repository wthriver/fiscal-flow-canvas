
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expensesCount: number;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  expensesCount
}) => {
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [includeFields, setIncludeFields] = useState({
    id: true,
    date: true,
    category: true,
    vendor: true,
    amount: true,
    status: true,
    paymentMethod: true
  });

  const toggleField = (field: keyof typeof includeFields) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleExport = () => {
    const selectedFields = Object.entries(includeFields)
      .filter(([_, isSelected]) => isSelected)
      .map(([field]) => field);

    if (selectedFields.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one field to export",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would trigger an actual export
    toast({
      title: "Export Started",
      description: `Exporting ${expensesCount} expenses as ${exportFormat.toUpperCase()} with fields: ${selectedFields.join(", ")}`
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Expenses</DialogTitle>
          <DialogDescription>
            Export your expenses data in various formats.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col space-y-4">
            <div>
              <Label className="text-base mb-2 block">Export Format</Label>
              <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="cursor-pointer">CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="cursor-pointer">Excel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="cursor-pointer">PDF</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mt-4">
              <Label className="text-base mb-2 block">Include Fields</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="id" checked={includeFields.id} onCheckedChange={() => toggleField("id")} />
                  <Label htmlFor="id" className="cursor-pointer">ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="date" checked={includeFields.date} onCheckedChange={() => toggleField("date")} />
                  <Label htmlFor="date" className="cursor-pointer">Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="category" checked={includeFields.category} onCheckedChange={() => toggleField("category")} />
                  <Label htmlFor="category" className="cursor-pointer">Category</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vendor" checked={includeFields.vendor} onCheckedChange={() => toggleField("vendor")} />
                  <Label htmlFor="vendor" className="cursor-pointer">Vendor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="amount" checked={includeFields.amount} onCheckedChange={() => toggleField("amount")} />
                  <Label htmlFor="amount" className="cursor-pointer">Amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="status" checked={includeFields.status} onCheckedChange={() => toggleField("status")} />
                  <Label htmlFor="status" className="cursor-pointer">Status</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="paymentMethod" checked={includeFields.paymentMethod} onCheckedChange={() => toggleField("paymentMethod")} />
                  <Label htmlFor="paymentMethod" className="cursor-pointer">Payment Method</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
