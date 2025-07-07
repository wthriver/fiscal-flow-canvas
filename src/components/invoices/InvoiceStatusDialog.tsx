import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Invoice } from "@/types/company";

interface InvoiceStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onStatusUpdate: (invoiceId: string, status: Invoice['status'], notes?: string) => void;
}

export const InvoiceStatusDialog: React.FC<InvoiceStatusDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  onStatusUpdate,
}) => {
  const [status, setStatus] = useState<Invoice['status']>(invoice?.status || "Draft");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!invoice) return;
    
    onStatusUpdate(invoice.id, status, notes);
    toast.success(`Invoice status updated to ${status}`);
    setNotes("");
    onOpenChange(false);
  };

  const getStatusDescription = (status: Invoice['status']) => {
    switch (status) {
      case "Draft":
        return "Invoice is being prepared and has not been sent";
      case "Sent":
        return "Invoice has been sent to the customer";
      case "Paid":
        return "Payment has been received for this invoice";
      case "Overdue":
        return "Invoice payment is past due date";
      default:
        return "";
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Invoice Status</DialogTitle>
          <DialogDescription>
            Change the status of invoice {invoice.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Invoice Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Invoice['status'])}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription(status)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Invoice Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{invoice.customer}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${invoice.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span>{invoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="font-medium">{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};