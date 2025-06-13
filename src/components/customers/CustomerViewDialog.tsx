
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/company";

interface CustomerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export const CustomerViewDialog: React.FC<CustomerViewDialogProps> = ({
  open,
  onOpenChange,
  customer
}) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p>{customer.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p>{customer.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <p>{customer.company || '-'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <p>{customer.address || '-'}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <p>{customer.city || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <p>{customer.state || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
              <p>{customer.postalCode || '-'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Terms</label>
              <p>{customer.paymentTerms}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                {customer.status}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Since</label>
              <p>{customer.customerSince}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Sales</label>
              <p>${(customer.totalSales || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
