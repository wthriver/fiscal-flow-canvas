
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, FileText, FileJson } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: string) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  onExport
}) => {
  const [format, setFormat] = useState("csv");

  const handleExport = () => {
    onExport(format);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Invoices</DialogTitle>
          <DialogDescription>
            Select a format to export your invoice data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-2 mb-4 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center cursor-pointer">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-muted-foreground">Export as comma-separated values</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 mb-4 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="flex items-center cursor-pointer">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
                <div>
                  <div className="font-medium">Excel</div>
                  <div className="text-xs text-muted-foreground">Export as Microsoft Excel file</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 mb-4 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                <FileText className="h-5 w-5 mr-2 text-red-600" />
                <div>
                  <div className="font-medium">PDF</div>
                  <div className="text-xs text-muted-foreground">Export as PDF document</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center cursor-pointer">
                <FileJson className="h-5 w-5 mr-2 text-yellow-600" />
                <div>
                  <div className="font-medium">JSON</div>
                  <div className="text-xs text-muted-foreground">Export as JSON data format</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
